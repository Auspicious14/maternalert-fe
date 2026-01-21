import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { Typography } from "../../components/shared/Typography";
import { Skeleton } from "../../components/ui/Skeleton";
import Theme from "../../constants/theme";

import { useCarePriority } from "../../hooks/useCarePriority";
import { useHealthData } from "../../hooks/useHealthData";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useNotifications } from "../../hooks/useNotifications";

export default function HomeScreen() {
  const router = useRouter();
  const { data: priorityData, isLoading: isLoadingPriority } =
    useCarePriority();
  const {
    latestBP,
    recentSymptoms,
    isLoadingLatestBP,
    isLoadingRecentSymptoms,
  } = useHealthData();
  const { profile } = useUserProfile();
  const { unreadCount } = useNotifications();

  const DEFAULT_AVATAR =
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop";

  // Memoize status colors based on priority
  const statusColors = React.useMemo(() => {
    switch (priorityData?.priority) {
      case "EMERGENCY":
        return Theme.colors.redGradient;
      case "URGENT_REVIEW":
        return Theme.colors.orangeGradient;
      case "INCREASED_MONITORING":
        return Theme.colors.greenGradient;
      default:
        return Theme.colors.greenGradient;
    }
  }, [priorityData?.priority]);

  const statusLabel = React.useMemo(() => {
    switch (priorityData?.priority) {
      case "EMERGENCY":
        return "EMERGENCY";
      case "URGENT_REVIEW":
        return "ATTENTION NEEDED";
      case "INCREASED_MONITORING":
        return "INCREASED MONITORING";
      default:
        return "ROUTINE CARE";
    }
  }, [priorityData?.priority]);

  return (
    <Screen className="pt-6" scrollable backgroundColor={Theme.colors.darkBg}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 mb-6">
        <TouchableOpacity className="w-11 h-11 rounded-full bg-white/10 justify-center items-center">
          <Ionicons name="menu-outline" size={28} color="white" />
        </TouchableOpacity>
        {/* <Typography variant="h2" className="text-white text-xl">Priority Dashboard</Typography> */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="relative w-11 h-11 rounded-full bg-white/10 justify-center items-center" onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications" size={24} color="white" />
            {unreadCount > 0 && <View className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent border-2 border-[#1A1512]" />}
          </TouchableOpacity>
          <TouchableOpacity
            className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/20"
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Image source={{ uri: DEFAULT_AVATAR }} className="w-full h-full" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
      >
        {/* Urgent Status Card */}
        {isLoadingPriority ? (
          <Skeleton
            height={220}
            borderRadius={28}
            style={{ marginBottom: 24 }}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push(
                priorityData?.priority === "EMERGENCY"
                  ? "/emergency"
                  : "/symptom-results",
              )
            }
          >
            <LinearGradient
              colors={
                (statusColors as any) || (Theme.colors.greenGradient as any)
              }
              className="rounded-[28px] p-6 mb-6"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-row items-center gap-1.5 mb-4">
                <Ionicons
                  name={
                    priorityData?.priority === "EMERGENCY" ||
                    priorityData?.priority === "URGENT_REVIEW"
                      ? "alert-circle"
                      : "checkmark-circle"
                  }
                  size={18}
                  color="#1A1512"
                />
                <Typography
                  variant="caption"
                  weight="bold"
                  className="text-[#1A1512] text-xs tracking-widest"
                >
                  {statusLabel}
                </Typography>
              </View>
              <Typography
                variant="h1"
                className="text-[#1A1512] leading-8 mb-2 font-black"
              >
                {priorityData?.message || "Fetching your health status..."}
              </Typography>
              {priorityData?.reasons && priorityData.reasons.length > 0 && (
                <Typography
                  variant="body"
                  className="text-[#1A1512CC] text-[15px] leading-[22px] mb-6"
                >
                  Based on: {priorityData.reasons.join(", ")}
                </Typography>
              )}

              <View className="h-[140px] bg-white/10 rounded-[30px] overflow-hidden">
                <LinearGradient
                  colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]}
                  className="flex-1"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Stats Row */}
        <Card className="bg-card-dark border border-white/10 p-6 flex-row items-center justify-between mb-6 rounded-[24px]">
          <View className="flex-1">
            <Typography variant="caption" className="text-white/50 mb-1">
              Last BP Reading
            </Typography>
            {isLoadingLatestBP ? (
              <Skeleton width={120} height={40} style={{ marginVertical: 8 }} />
            ) : (
              <View className="flex-row items-baseline gap-2 my-1">
                <Typography
                  variant="h1"
                  weight="bold"
                  className="text-white text-[32px]"
                >
                  {latestBP
                    ? `${latestBP.systolic}/${latestBP.diastolic}`
                    : "--/--"}
                </Typography>
                <Typography
                  variant="body"
                  weight="bold"
                  className="text-accent"
                >
                  {latestBP?.systolic && latestBP.systolic > 140
                    ? "High"
                    : "Normal"}
                </Typography>
              </View>
            )}
            {isLoadingLatestBP ? (
              <Skeleton width={150} height={16} />
            ) : (
              <Typography variant="caption" className="text-white/30">
                {latestBP?.timestamp
                  ? new Date(latestBP.timestamp).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "No readings yet"}
              </Typography>
            )}
          </View>
          <View className="w-12 h-12 rounded-full bg-accent/10 justify-center items-center">
            <Ionicons name="pulse" size={24} color={Theme.colors.accent} />
          </View>
        </Card>

        {/* Quick Actions */}
        <View className="gap-3 mb-6">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-primary h-12 rounded-full flex-row items-center justify-center gap-2 shadow-sm"
              onPress={() => router.push("/bp-entry")}
            >
              <Ionicons name="add" size={20} color="#1A1512" />
              <Typography variant="h3" weight="bold" className="text-[#1A1512]">
                Add BP
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 border border-white/10 bg-transparent h-12 rounded-full flex-row items-center justify-center gap-2"
              onPress={() => router.push("/clinic-finder")}
            >
              <Ionicons name="map" size={18} color={Theme.colors.accent} />
              <Typography variant="h3" weight="bold" className="text-accent">
                Find Clinic
              </Typography>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="border border-white/10 bg-transparent h-12 rounded-full flex-row items-center justify-center gap-2"
            onPress={() => router.push("/symptom-checker")}
          >
            <Ionicons name="list" size={18} color={Theme.colors.accent} />
            <Typography variant="h3" weight="bold" className="text-accent">
              Log Symptoms
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Unwell Banner */}
        <TouchableOpacity
          className="bg-card-dark p-4 rounded-[24px] flex-row items-center mb-10 border border-red-500/20 shadow-lexend-medium"
          onPress={() => router.push("/emergency")}
        >
          <View className="w-11 h-11 rounded-full bg-emergency justify-center items-center mr-4">
            <Ionicons name="medical" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Typography
              variant="h3"
              weight="bold"
              className="text-white text-base"
            >
              Feeling unwell?
            </Typography>
            <Typography variant="caption" className="text-white/50">
              Tap for immediate help
            </Typography>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={Theme.colors.emergency}
          />
        </TouchableOpacity>

        {/* Recent Activity */}
        <View className="flex-row justify-between items-center mb-4">
          <Typography variant="h2" className="text-white text-lg">
            Recent Activity
          </Typography>
          <TouchableOpacity onPress={() => router.push("/symptom-results")}>
            <Typography variant="body" weight="bold" className="text-accent">
              View all
            </Typography>
          </TouchableOpacity>
        </View>

        {isLoadingRecentSymptoms ? (
          <>
            <Skeleton
              height={80}
              borderRadius={20}
              style={{ marginBottom: 8 }}
            />
            <Skeleton
              height={80}
              borderRadius={20}
              style={{ marginBottom: 8 }}
            />
          </>
        ) : (recentSymptoms?.length || 0) > 0 ? (
          recentSymptoms?.map((symptom) => (
            <Card
              key={symptom.id}
              className="bg-card-dark border border-white/10 p-4 flex-row items-center mb-2 rounded-[20px]"
            >
              <View className="w-10 h-10 rounded-full bg-[#4C2456] justify-center items-center mr-4">
                <Ionicons name="alert-circle" size={20} color="#E879F9" />
              </View>
              <View className="flex-1">
                <Typography variant="h3" className="text-white text-[15px]">
                  {symptom.symptomType.replace(/_/g, " ")}
                </Typography>
                <Typography variant="caption" className="text-white/40">
                  Reported
                </Typography>
              </View>
              <Typography variant="caption" className="text-white/30">
                {new Date(symptom.timestamp).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Card>
          ))
        ) : (
          <Typography variant="body" className="text-white/30 text-center mt-5">
            No recent activity recorded
          </Typography>
        )}
      </ScrollView>
    </Screen>
  );
}
