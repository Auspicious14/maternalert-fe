import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import apiClient from "../api/client";
import { appEvents } from "../api/event-emitter";
import { TokenStorage } from "../api/storage";
import { sessionService } from "../services/session";

interface User {
  id: string;
  email: string;
  name?: string;
  needsProfile?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasLaunched: boolean | null;
  markAsLaunched: () => Promise<void>;
  login: (token: string, refreshToken: string, user: User) => Promise<void>;
  logout: (reason?: string) => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const segments = useSegments();
  const router = useRouter();
  const queryClient = useQueryClient();
  const navigationState = useRootNavigationState();
  const isNavReady = navigationState?.key !== undefined;
  const perfStartTime = useRef<number>(Date.now());

  const [intendedDestination, setIntendedDestination] = useState<string | null>(
    null,
  );

  const {
    data: user,
    status,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["user-session"],
    queryFn: async () => {
      const start = Date.now();
      const token = await TokenStorage.getToken();

      if (!token) {
        console.log(
          `[PERF] No token found. Checked in ${Date.now() - start}ms`,
        );
        return null;
      }

      try {
        // First check if the session is valid
        const authResponse = await apiClient.post("/auth/me");
        const authUser = authResponse.data;
        console.log(`[PERF] /auth/me call took ${Date.now() - start}ms`);

        // Then try to get the profile (but don't fail if it's missing)
        try {
          const profileResponse = await apiClient.get("/user-profile");
          return { ...authUser, ...profileResponse.data };
        } catch (profileError: any) {
          if (profileError.response?.status === 404) {
            console.log("[AUTH] Authenticated but NO profile found");
            return { ...authUser, needsProfile: true };
          }
          throw profileError;
        }
      } catch (error) {
        console.error("Session check failed (not clearing tokens):", error);
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const [hasLaunched, setHasLaunched] = useState<boolean | null>(null);

  useEffect(() => {
    const loadLaunchState = async () => {
      const launched = await TokenStorage.getHasLaunched();
      console.log(`[AUTH] Loaded raw launch state: "${launched}"`);
      setHasLaunched(launched === "true");
    };
    loadLaunchState();
  }, []);

  const isLoading =
    isQueryLoading || status === "pending" || hasLaunched === null;

  useEffect(() => {
    if (!isLoading) {
      console.log(
        `[PERF] Auth state resolved in ${Date.now() - perfStartTime.current}ms (User: ${!!user}, HasLaunched: ${hasLaunched})`,
      );
    }
  }, [isLoading, user, hasLaunched]);

  const logoutInProgress = useRef(false);

  const logout = async (reason?: string) => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;
    console.log(`[AUTH] Logout requested. Reason: ${reason || "none"}`);
    try {
      // Only call logout API if we have a token
      const token = await TokenStorage.getToken();
      if (token) {
        await apiClient.post("/auth/logout");
      }
    } catch (error) {
      // Ignore logout API errors — we always clear locally
      console.error("Logout API error (ignored):", error);
    } finally {
      await TokenStorage.clearTokens();
      queryClient.setQueryData(["user-session"], null);
      queryClient.clear();

      if (reason === "expired") {
        router.replace("/login?message=session_expired");
      } else {
        router.replace("/login");
      }
      logoutInProgress.current = false;
    }
  };

  const markAsLaunched = async () => {
    await TokenStorage.setHasLaunched();
    setHasLaunched(true); // ← updates React state immediately
  };

  const checkSession = async () => {
    const start = Date.now();
    await refetch();
    console.log(`[PERF] Manual session check took ${Date.now() - start}ms`);
  };

  // ── Listen for session expiry emitted by apiClient interceptor ──
  useEffect(() => {
    const handleSessionExpired = () => {
      console.log("[AUTH] Session expired event received");
      logout("expired");
    };

    appEvents.on("session-expired", handleSessionExpired);

    return () => {
      appEvents.off("session-expired", handleSessionExpired);
    };
  }, []);

  // ── Route protection ──
  useEffect(() => {
    console.log(
      `[AUTH-EFFECT] Triggered. user=${!!user}, isLoading=${isLoading}, isNavReady=${isNavReady}`,
    );
    const guard = async () => {
      if (isLoading || !isNavReady) {
        console.log(
          `[AUTH-GUARD] Still loading (isLoading=${isLoading}, isNavReady=${isNavReady})`,
        );
        return;
      }

      const rootSegment = segments[0] as string | undefined;
      const inAuthGroup = segments.some((s) => s === "(tabs)");
      const isPublicRoute =
        rootSegment === "login" ||
        rootSegment === "register" ||
        rootSegment === "onboarding" ||
        rootSegment === "disclaimer" ||
        rootSegment === "forgot-password" ||
        rootSegment === "reset-password";

      if (!user && !isPublicRoute) {
        const fullPath = segments.join("/");
        if (
          fullPath &&
          fullPath !== "login" &&
          fullPath !== "" &&
          fullPath !== "index"
        ) {
          console.log(
            `[AUTH-GUARD] Setting intended destination to: ${fullPath}`,
          );
          setIntendedDestination(fullPath);
        }
        console.log("[AUTH-GUARD] Unauthorized — redirecting to /login");
        router.replace("/login");
      } else if (!user && isPublicRoute) {
        if (
          hasLaunched === false &&
          rootSegment !== "onboarding" &&
          rootSegment !== "disclaimer" &&
          rootSegment !== "register"
        ) {
          router.replace("/onboarding");
        } else if (hasLaunched === true && rootSegment === "onboarding") {
          console.log("[AUTH-GUARD] Already launched — redirecting to /login");
          router.replace("/login");
        }
      } else if (user) {
        if (user.needsProfile && rootSegment !== "profile-setup") {
          console.log(
            "[AUTH-GUARD] Authenticated but missing profile — redirecting to /profile-setup",
          );
          router.replace("/profile-setup");
        } else if (
          !user.needsProfile &&
          (isPublicRoute ||
            rootSegment === "profile-setup" ||
            !rootSegment ||
            rootSegment === "index")
        ) {
          if (intendedDestination) {
            console.log(
              `[AUTH-GUARD] Redirecting to intended destination: ${intendedDestination}`,
            );
            router.replace(intendedDestination as any);
            setIntendedDestination(null);
          } else {
            console.log("[AUTH-GUARD] Authenticated — redirecting to /(tabs)");
            router.replace("/(tabs)");
          }
        }
      } else {
        console.log("[AUTH-GUARD] State ok. No redirect needed.");
      }
    };

    guard();
  }, [user, segments, isLoading, isNavReady, intendedDestination, hasLaunched]);

  const login = async (token: string, refreshToken: string, userData: User) => {
    const start = Date.now();
    console.log("[AUTH] Updating login state...");
    await TokenStorage.saveToken(token);
    await TokenStorage.saveRefreshToken(refreshToken);

    // Set query data and ensure it's in a success state
    // We now get the user object directly from the login/register response
    queryClient.setQueryData(["user-session"], userData);
    console.log(
      "[AUTH] queryClient data set:",
      !!queryClient.getQueryData(["user-session"]),
    );

    sessionService.reset();

    // Register for push notifications now that we are authenticated
    try {
      const { notificationService } = await import("../services/notifications");
      await notificationService.registerForPushNotificationsAsync();
    } catch (pushError) {
      console.error(
        "[AUTH] Failed to register push notifications after login:",
        pushError,
      );
    }

    // Invalidate so all observers are updated correctly
    await queryClient.invalidateQueries({ queryKey: ["user-session"] });
    console.log("[AUTH] queryClient invalidated");

    console.log(`[PERF] Login state update took ${Date.now() - start}ms`);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
        hasLaunched,
        markAsLaunched,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
