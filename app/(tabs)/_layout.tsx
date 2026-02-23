import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../../components/shared/Typography';
import Theme from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark ? Theme.colors.darkBg : Theme.colors.white,
            borderTopColor: isDark ? Theme.colors.borderDark : Theme.colors.border,
          },
        ],
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDark ? Theme.colors.white : Theme.colors.text,
        tabBarInactiveTintColor: Theme.colors.inactiveTab,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && (isDark ? styles.activeIconContainerDark : styles.activeIconContainerLight)]}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Typography variant="caption" style={[styles.label, { color, fontWeight: focused ? 'bold' : 'normal' }]}>
              Home
            </Typography>
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: 'Tracking',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && (isDark ? styles.activeIconContainerDark : styles.activeIconContainerLight)]}>
              <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={24} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Typography variant="caption" style={[styles.label, { color, fontWeight: focused ? 'bold' : 'normal' }]}>
              Tracking
            </Typography>
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Education',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && (isDark ? styles.activeIconContainerDark : styles.activeIconContainerLight)]}>
              <Ionicons name={focused ? 'book' : 'book-outline'} size={24} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Typography variant="caption" style={[styles.label, { color, fontWeight: focused ? 'bold' : 'normal' }]}>
              Education
            </Typography>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && (isDark ? styles.activeIconContainerDark : styles.activeIconContainerLight)]}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Typography variant="caption" style={[styles.label, { color, fontWeight: focused ? 'bold' : 'normal' }]}>
              Profile
            </Typography>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    paddingBottom: 25,
    paddingTop: 10,
    borderTopLeftRadius: Theme.borderRadius.large,
    borderTopRightRadius: Theme.borderRadius.large,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontFamily: Theme.typography.fontFamilies.regular,
    fontSize: 12,
  },
  iconContainer: {
    width: 60,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: Theme.colors.secondary,
  },
  activeIconContainerLight: {
    backgroundColor: Theme.colors.secondary,
  },
  activeIconContainerDark: {
    backgroundColor: 'rgba(45, 228, 116, 0.2)',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  label: {
    marginTop: 4,
  },
});
