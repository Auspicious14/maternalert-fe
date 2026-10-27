import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FONT, useTokens } from "../../components/ds";

// Same tabs as maternalert-web/src/components/navigation/WebButtonNavigation.tsx
// (Home, Readings, Learn, Profile, with a mint pill behind the active icon).

const TABS: { name: string; title: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }[] = [
  { name: "index", title: "Home", icon: "home-outline", iconActive: "home" },
  { name: "tracking", title: "Readings", icon: "pulse-outline", iconActive: "pulse" },
  { name: "education", title: "Learn", icon: "book-outline", iconActive: "book" },
  { name: "profile", title: "Profile", icon: "person-outline", iconActive: "person" },
];

export default function TabLayout() {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: t.greenInk,
        tabBarInactiveTintColor: t.muted,
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopColor: t.border,
          borderTopWidth: 1,
          height: 64 + bottom,
          paddingTop: 8,
          paddingBottom: bottom,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: { fontFamily: FONT.semibold, fontSize: 12, marginTop: 2 },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarAccessibilityLabel: tab.title,
            tabBarIcon: ({ focused, color }) => (
              <View
                style={{
                  width: 56,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? t.mint : "transparent",
                }}
              >
                <Ionicons name={focused ? tab.iconActive : tab.icon} size={22} color={color} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
