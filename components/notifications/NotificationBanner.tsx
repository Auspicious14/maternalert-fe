import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Typography } from "../shared/Typography";

const { width } = Dimensions.get("window");

export const NotificationBanner = () => {
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const translateY = useRef(new Animated.Value(-100)).current;
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Show banner if app is in foreground
        setNotification(notification);
        showBanner();
      },
    );

    return () => subscription.remove();
  }, []);

  const showBanner = () => {
    Animated.spring(translateY, {
      toValue: 50,
      useNativeDriver: true,
      friction: 8,
    }).start();

    setTimeout(() => {
      hideBanner();
    }, 4000);
  };

  const hideBanner = () => {
    Animated.timing(translateY, {
      toValue: -150,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setNotification(null));
  };

  const handlePress = () => {
    if (notification) {
      const data = notification.request.content.data || {};
      const type = data.type;

      switch (type) {
        case "BP_REMINDER":
          router.push("/bp-entry");
          break;
        case "TREND_ALERT":
          router.push("/(tabs)/tracking");
          break;
        case "FOLLOW_UP":
          router.push("/bp-entry");
          break;
        case "ESCALATION_ALERT":
          router.push("/(tabs)/tracking");
          break;
        default:
          router.push("/(tabs)/index" as any);
      }
    }
    hideBanner();
  };

  if (!notification) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        className="flex-row items-center bg-cardDark p-4 rounded-2xl border border-borderDark shadow-lg"
      >
        <View className="bg-primary/20 p-2 rounded-full mr-3">
          <Ionicons name="notifications" size={20} color={Colors.primary} />
        </View>
        <View className="flex-1">
          <Typography variant="h3" className="text-white text-sm font-bold">
            {notification.request.content.title}
          </Typography>
          <Typography
            variant="body"
            className="text-gray-400 text-xs"
            numberOfLines={1}
          >
            {notification.request.content.body}
          </Typography>
        </View>
        <TouchableOpacity onPress={hideBanner} className="p-1">
          <Ionicons name="close" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
});
