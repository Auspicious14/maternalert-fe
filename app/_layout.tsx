import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold
} from '@expo-google-fonts/lexend';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { TokenStorage } from '../api/storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Clinical safety: don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

export default function RootLayout() {
  const [loaded] = useFonts({
    'Lexend-Regular': Lexend_400Regular,
    'Lexend-Medium': Lexend_500Medium,
    'Lexend-SemiBold': Lexend_600SemiBold,
    'Lexend-Bold': Lexend_700Bold,
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <InitialRouteHandler />
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="disclaimer" options={{ headerShown: false }} />
          <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="emergency" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="symptom-checker" options={{ headerShown: false }} />
          <Stack.Screen name="symptom-results" options={{ headerShown: false }} />
          <Stack.Screen name="nurse-summary" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="bp-entry" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="clinic-finder" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function InitialRouteHandler() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkNavigation = async () => {
      const hasLaunched = await TokenStorage.getHasLaunched();
      const token = await TokenStorage.getToken();

      if (!hasLaunched) {
        // First time user: show welcome (onboarding)
        await TokenStorage.setHasLaunched();
        router.replace('/onboarding');
      } else if (token) {
        // Returning user, logged in: show dashboard
        // Note: we might want to check if profile is completed here too, 
        // but for now following the prompt's logic.
        router.replace('/(tabs)');
      } else {
        // Returning user, NOT logged in: show login
        router.replace('/login');
      }
      setIsReady(true);
    };

    checkNavigation();
  }, []);

  return null;
}
