import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, ColorSchemeName, LayoutAnimation } from "react-native";
import * as SecureStore from "expo-secure-store";

export type ThemePreference = "light" | "dark" | "system";

type ResolvedColorScheme = Exclude<ColorSchemeName, null | undefined>;

interface AppThemeContextValue {
  preference: ThemePreference;
  colorScheme: ResolvedColorScheme;
  setPreference: (value: ThemePreference) => void;
}

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

const THEME_PREFERENCE_KEY = "maternalert_theme_preference";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [systemScheme, setSystemScheme] = useState<ResolvedColorScheme>("light");

  useEffect(() => {
    const initialScheme = Appearance.getColorScheme() as ResolvedColorScheme | null;
    if (initialScheme) {
      setSystemScheme(initialScheme);
    }

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setSystemScheme(colorScheme as ResolvedColorScheme);
      }
    });

    SecureStore.getItemAsync(THEME_PREFERENCE_KEY)
      .then((value) => {
        if (value === "light" || value === "dark" || value === "system") {
          setPreferenceState(value);
        }
      })
      .catch(() => {});

    return () => {
      subscription.remove();
    };
  }, []);

  const colorScheme: ResolvedColorScheme = useMemo(() => {
    if (preference === "system") {
      return systemScheme || "light";
    }
    return preference;
  }, [preference, systemScheme]);

  const setPreference = (value: ThemePreference) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPreferenceState(value);
    SecureStore.setItemAsync(THEME_PREFERENCE_KEY, value).catch(() => {});
  };

  const contextValue: AppThemeContextValue = useMemo(
    () => ({
      preference,
      colorScheme,
      setPreference,
    }),
    [preference, colorScheme]
  );

  return <AppThemeContext.Provider value={contextValue}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}
