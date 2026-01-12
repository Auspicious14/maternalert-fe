import 'react-native-reanimated';
import '../global.css';

import {
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold
} from '@expo-google-fonts/lexend';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { TokenStorage } from '../api/storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
});

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
        // Perform auth check
        const hasLaunched = await TokenStorage.getHasLaunched();
        const token = await TokenStorage.getToken();

        // Small delay to ensure the UI can mount smoothly
        setTimeout(() => {
          if (!hasLaunched) {
            TokenStorage.setHasLaunched();
            // We use router.push/replace only when we know the layout is ready
            // but for safety, we rely on the index.tsx redirect as well.
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
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
    }
    
    // Fallback: hide splash screen after 5 seconds no matter what
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
      setIsAuthReady(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [fontsLoaded, isAuthReady]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
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
        <StatusBar style="dark" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
