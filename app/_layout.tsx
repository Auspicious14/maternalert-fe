import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

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
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
