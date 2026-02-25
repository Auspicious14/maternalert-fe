import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { Skeleton } from "../components/ui/Skeleton";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useNotifications, Notification } from "../hooks/useNotifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, isLoading, markAsRead } = useNotifications();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleNotificationPress = async (item: Notification) => {
    if (!item.read) {
      await markAsRead(item.id);
    }
    // Navigate if needed based on type
    if (item.type === "CARE_PRIORITY" || item.type === "SYMPTOM_ALERT") {
      router.push("/symptom-results");
    } else if (item.type === "BP_ALERT") {
      router.push("/(tabs)/tracking");
    }
  };

  const getIconAndColor = (type: Notification["type"]) => {
    switch (type) {
      case "CARE_PRIORITY":
        return {
          name: "warning",
          color: "#EF4444",
          bg: isDark ? "rgba(239, 68, 68, 0.2)" : "bg-red-100",
        };
      case "BP_ALERT":
        return {
          name: "medical",
          color: "#F97316",
          bg: isDark ? "rgba(249, 115, 22, 0.2)" : "bg-orange-100",
        };
      case "SYMPTOM_ALERT":
        return {
          name: "medkit",
          color: "#EAB308",
          bg: isDark ? "rgba(234, 179, 8, 0.2)" : "bg-yellow-100",
        };
      case "REMINDER":
      default:
        return {
          name: "alarm",
          color: "#9333EA",
          bg: isDark ? "rgba(147, 51, 234, 0.2)" : "bg-purple-100",
        };
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const { name, color, bg } = getIconAndColor(item.type);

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        style={{
          backgroundColor: item.read
            ? isDark
              ? Theme.colors.cardDark
              : "white"
            : isDark
              ? "#1E293B"
              : "#EFF6FF",
          borderColor: isDark ? Theme.colors.borderDark : "#F1F5F9",
        }}
        className="p-4 mb-3 rounded-2xl border"
      >
        <View className="flex-row items-start gap-3">
          <View
            style={isDark ? { backgroundColor: bg } : undefined}
            className={`w-10 h-10 rounded-full justify-center items-center ${!isDark ? bg : ""}`}
          >
            <Ionicons name={name as any} size={20} color={color} />
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <Typography variant="h3" className="mb-1 flex-1 mr-2">
                {item.title}
              </Typography>
              {!item.read && (
                <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              )}
            </View>
            <Typography
              variant="body"
              className={isDark ? "text-gray-400" : "text-gray-500"}
              style={{ lineHeight: 20 }}
            >
              {item.message}
            </Typography>
            <Typography
              variant="caption"
              className={isDark ? "text-gray-500" : "text-gray-400"}
              style={{ marginTop: 8 }}
            >
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const headerIconColor = isDark ? "#FFFFFF" : "#1F2937";
  const headerIconBg = isDark ? Theme.colors.cardDark : "white";

  return (
    <Screen scrollable={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 mb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: headerIconBg }}
          className="w-10 h-10 justify-center items-center rounded-full shadow-sm"
        >
          <Ionicons name="arrow-back" size={24} color={headerIconColor} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl">
          Notifications
        </Typography>
        <View className="w-10" />
      </View>

      {/* List */}
      {isLoading ? (
        <View className="px-4 mt-4 gap-4">
          <Skeleton
            height={100}
            borderRadius={16}
            variant={isDark ? "dark" : "light"}
          />
          <Skeleton
            height={100}
            borderRadius={16}
            variant={isDark ? "dark" : "light"}
          />
          <Skeleton
            height={100}
            borderRadius={16}
            variant={isDark ? "dark" : "light"}
          />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20">
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#9CA3AF"
              />
              <Typography variant="body" className="text-gray-400 mt-4">
                No notifications yet
              </Typography>
            </View>
          }
        />
      )}
    </Screen>
  );
}
