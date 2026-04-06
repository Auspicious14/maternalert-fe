import "react-native-reanimated";
import "../global.css";

import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { NotificationBanner } from "../components/notifications/NotificationBanner";
import { ToastProvider } from "../components/ui/ToastProvider";
import { Colors } from "../constants/theme";
import { AuthProvider } from "../context/AuthContext";
import { AppThemeProvider, useAppTheme } from "../hooks/useAppTheme";
import { useSession } from "../hooks/useSession";
import { notificationService } from "../services/notifications";

// ── Only import Notifications outside Expo Go ──
import Constants, { ExecutionEnvironment } from "expo-constants";
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
let Notifications: typeof import("expo-notifications") | null = null;
if (!isExpoGo) {
  Notifications = require("expo-notifications");
}

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

const NavigationLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    primary: Colors.light.tint,
  },
};

const NavigationDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    primary: Colors.dark.tint,
  },
};

function RootNavigation() {
  const { colorScheme } = useAppTheme();
  const navigationTheme =
    colorScheme === "dark" ? NavigationDarkTheme : NavigationLightTheme;
  const statusBarStyle = colorScheme === "dark" ? "light" : "dark";
  const { resetActivity } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!Notifications) return;

    notificationService.setRouter(router);
    notificationService.registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        notificationService.handleNotificationResponse(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <ThemeProvider value={navigationTheme}>
      <NotificationBanner />
      <TouchableWithoutFeedback onPress={resetActivity} accessible={false}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="reset-password" />
            <Stack.Screen name="disclaimer" />
            <Stack.Screen name="profile-setup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="emergency"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen name="symptom-checker" />
            <Stack.Screen name="symptom-results" />
            <Stack.Screen
              name="nurse-summary"
              options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen name="bp-entry" options={{ presentation: "modal" }} />
            <Stack.Screen name="clinic-finder" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </TouchableWithoutFeedback>
      <StatusBar style={statusBarStyle} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Lexend-Regular": Lexend_400Regular,
    "Lexend-Medium": Lexend_500Medium,
    "Lexend-SemiBold": Lexend_600SemiBold,
    "Lexend-Bold": Lexend_700Bold,
  });

  // ── Hide splash screen once fonts are loaded ──
  // Navigation and auth routing is handled entirely by AuthContext
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }

    // Fallback — hide splash after 5 seconds no matter what
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 5000);

    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppThemeProvider>
          <ToastProvider>
            <RootNavigation />
          </ToastProvider>
        </AppThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
