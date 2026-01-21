import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { Skeleton } from "../components/ui/Skeleton";
import { useNotifications, Notification } from "../hooks/useNotifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, isLoading, markAsRead } = useNotifications();

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
        return { name: "warning", color: "#EF4444", bg: "bg-red-100" };
      case "BP_ALERT":
        return { name: "medical", color: "#F97316", bg: "bg-orange-100" };
      case "SYMPTOM_ALERT":
        return { name: "medkit", color: "#EAB308", bg: "bg-yellow-100" };
      case "REMINDER":
      default:
        return { name: "alarm", color: "#9333EA", bg: "bg-purple-100" };
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const { name, color, bg } = getIconAndColor(item.type);
    
    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        className={`p-4 mb-3 rounded-2xl border ${
          item.read ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"
        }`}
      >
        <View className="flex-row items-start gap-3">
          <View
            className={`w-10 h-10 rounded-full justify-center items-center ${bg}`}
          >
            <Ionicons
              name={name as any}
              size={20}
              color={color}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <Typography variant="h3" className="mb-1 text-gray-900 flex-1 mr-2">
                {item.title}
              </Typography>
              {!item.read && (
                <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              )}
            </View>
            <Typography variant="body" className="text-gray-500 leading-5">
              {item.message}
            </Typography>
            <Typography variant="caption" className="text-gray-400 mt-2">
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                 weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Screen backgroundColor="#F9FAFB" scrollable={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 justify-center items-center rounded-full bg-white shadow-sm"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Typography variant="h2" className="text-xl">
            Notifications
          </Typography>
          <View className="w-10" />
        </View>

        {/* List */}
        {isLoading ? (
          <View className="px-4 mt-4 gap-4">
             <Skeleton height={100} borderRadius={16} />
             <Skeleton height={100} borderRadius={16} />
             <Skeleton height={100} borderRadius={16} />
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
                <Ionicons name="notifications-off-outline" size={48} color="#9CA3AF" />
                <Typography variant="body" className="text-gray-400 mt-4">
                  No notifications yet
                </Typography>
              </View>
            }
          />
        )}
      </Screen>
    </SafeAreaView>
  );
}
