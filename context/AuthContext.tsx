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
import { TokenStorage } from "../api/storage";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
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

  const [intendedDestination, setIntendedDestination] = useState<string | null>(
    null,
  );
  const perfStartTime = useRef<number>(Date.now());

  // React Query is our source of truth for user session
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
        const response = await apiClient.get("/auth/me");
        console.log(`[PERF] /auth/me call took ${Date.now() - start}ms`);
        return response.data;
      } catch (error) {
        console.error("Session check failed:", error);
        await TokenStorage.clearTokens();
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Derived loading state
  const isLoading = isQueryLoading || status === "pending";

  useEffect(() => {
    if (!isLoading) {
      console.log(
        `[PERF] Auth state resolved in ${Date.now() - perfStartTime.current}ms (User: ${!!user})`,
      );
    }
  }, [isLoading, user]);

  const checkSession = async () => {
    const start = Date.now();
    await refetch();
    console.log(`[PERF] Manual session check took ${Date.now() - start}ms`);
  };

  useEffect(() => {
    // Wait for auth state to be resolved and navigation to be ready
    if (isLoading || !isNavReady) return;

    const rootSegment = segments[0] as string | undefined;

    // Auth-related routes
    const inAuthGroup =
      !rootSegment ||
      rootSegment === "index" ||
      rootSegment === "login" ||
      rootSegment === "register" ||
      rootSegment === "onboarding" ||
      rootSegment === "forgot-password" ||
      rootSegment === "disclaimer";

    console.log(
      `[AUTH] Checking redirection: user=${!!user}, rootSegment=${rootSegment}, inAuthGroup=${inAuthGroup}, isNavReady=${isNavReady}`,
    );

    if (!user && !inAuthGroup) {
      // User is not logged in and trying to access a protected route
      const fullPath = segments.join("/");
      if (fullPath && fullPath !== "login") {
        setIntendedDestination(fullPath);
      }
      console.log("[AUTH] Unauthorized access, redirecting to /login");
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // User is logged in but on an auth-related route
      if (intendedDestination) {
        console.log(
          `[AUTH] Authenticated, redirecting to intended destination: ${intendedDestination}`,
        );
        router.replace(intendedDestination as any);
        setIntendedDestination(null);
      } else {
        console.log("[AUTH] Authenticated, redirecting to /(tabs)");
        router.replace("/(tabs)");
      }
    }
  }, [user, segments, isLoading, isNavReady, intendedDestination]);

  const login = async (token: string, refreshToken: string, userData: User) => {
    const start = Date.now();
    await TokenStorage.saveToken(token);
    await TokenStorage.saveRefreshToken(refreshToken);

    // Update React Query cache immediately
    queryClient.setQueryData(["user-session"], userData);

    console.log(`[PERF] Login state update took ${Date.now() - start}ms`);
  };

  const logout = async (reason?: string) => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await TokenStorage.clearTokens();
      queryClient.setQueryData(["user-session"], null);
      if (reason === "expired") {
        router.replace("/login?message=session_expired");
      } else {
        router.replace("/login");
      }
    }
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      logout("expired");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("session-expired", handleSessionExpired);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("session-expired", handleSessionExpired);
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
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
