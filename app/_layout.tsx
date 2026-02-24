import 'react-native-reanimated';
import '../global.css';

import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { TokenStorage } from '../api/storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from "../components/ui/ToastProvider";
import { AppThemeProvider, useAppTheme } from '../hooks/useAppTheme';
import { Colors } from '../constants/theme';

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
  const navigationTheme = colorScheme === 'dark' ? NavigationDarkTheme : NavigationLightTheme;
  const statusBarStyle = colorScheme === 'dark' ? 'light' : 'dark';

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="disclaimer" />
        <Stack.Screen name="profile-setup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="emergency" options={{ presentation: 'modal' }} />
        <Stack.Screen name="symptom-checker" />
        <Stack.Screen name="symptom-results" />
        <Stack.Screen name="nurse-summary" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="bp-entry" options={{ presentation: 'modal' }} />
        <Stack.Screen name="clinic-finder" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={statusBarStyle} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Lexend-Regular': Lexend_400Regular,
    'Lexend-Medium': Lexend_500Medium,
    'Lexend-SemiBold': Lexend_600SemiBold,
    'Lexend-Bold': Lexend_700Bold,
  });

  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        const hasLaunched = await TokenStorage.getHasLaunched();
        const token = await TokenStorage.getToken();

        setTimeout(() => {
          if (!hasLaunched) {
            TokenStorage.setHasLaunched();
            router.replace('/onboarding');
          } else if (token) {
            router.replace('/(tabs)');
          } else {
            router.replace('/login');
          }
          setIsAuthReady(true);
        }, 500);
      } catch (e) {
        console.warn('Auth preparation error:', e);
        setIsAuthReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isAuthReady) {
      SplashScreen.hideAsync().catch(() => {});
    }

    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
      setIsAuthReady(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [fontsLoaded, isAuthReady]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <ToastProvider>
          <RootNavigation />
        </ToastProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
