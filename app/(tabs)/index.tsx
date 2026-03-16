import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { memo, useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { Typography } from "../../components/shared/Typography";
import { Skeleton } from "../../components/ui/Skeleton";
import Theme from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

import { useCarePriority } from "../../hooks/useCarePriority";
import {
    BloodPressure,
    Symptom,
    useHealthData,
} from "../../hooks/useHealthData";
import { useNotifications } from "../../hooks/useNotifications";
import { useUserProfile } from "../../hooks/useUserProfile";

// Optimized Status Card Component
const StatusCard = memo(
  ({
    priorityData,
    statusColors,
    statusLabel,
    isLoading,
    onPress,
    isDark,
  }: any) => {
    if (isLoading) {
      return (
        <Skeleton
          height={220}
          borderRadius={28}
          style={{ marginBottom: 24 }}
          variant={isDark ? "dark" : "light"}
        />
      );
    }

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient
          colors={(statusColors as any) || (Theme.colors.greenGradient as any)}
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
        </LinearGradient>
      </TouchableOpacity>
    );
  },
);

// Optimized Stats Card Component
const StatsCard = memo(
  ({
    latestBP,
    isLoading,
    isDark,
  }: {
    latestBP: BloodPressure | undefined;
    isLoading: boolean;
    isDark: boolean;
  }) => {
    const bpColor = useMemo(() => {
      if (!latestBP) return Theme.colors.textLight;
      if (latestBP.systolic >= 160 || latestBP.diastolic >= 110)
        return Theme.colors.emergency;
      if (latestBP.systolic >= 140 || latestBP.diastolic >= 90)
        return Theme.colors.accent;
      if (latestBP.systolic >= 130 || latestBP.diastolic >= 85)
        return Theme.colors.accent;
      return Theme.colors.primary;
    }, [latestBP]);

    const bpStatus = useMemo(() => {
      if (!latestBP) return "--";
      if (latestBP.systolic >= 160 || latestBP.diastolic >= 110)
        return "Crisis";
      if (latestBP.systolic >= 140 || latestBP.diastolic >= 90) return "High";
      if (latestBP.systolic >= 130 || latestBP.diastolic >= 85)
        return "Elevated";
      return "Normal";
    }, [latestBP]);

    return (
      <Card
        className={`${isDark ? "bg-card-dark border-white/10" : "bg-white border-gray-100"} border p-6 flex-row items-center justify-between mb-6 rounded-[24px]`}
      >
        <View className="flex-1">
          <Typography
            variant="caption"
            className={`${isDark ? "text-white/50" : "text-gray-500"} mb-1`}
          >
            Last BP Reading
          </Typography>
          {isLoading ? (
            <Skeleton
              width={120}
              height={40}
              style={{ marginVertical: 8 }}
              variant={isDark ? "dark" : "light"}
            />
          ) : (
            <View className="flex-row items-baseline gap-2 my-1">
              <Typography
                variant="h1"
                weight="bold"
                className={`${isDark ? "text-white" : "text-text"} text-[32px]`}
              >
                {latestBP
                  ? `${latestBP.systolic}/${latestBP.diastolic}`
                  : "--/--"}
              </Typography>
              <Typography
                variant="body"
                weight="bold"
                style={{ color: bpColor }}
              >
                {bpStatus}
              </Typography>
            </View>
          )}
          {isLoading ? (
            <Skeleton
              width={150}
              height={16}
              variant={isDark ? "dark" : "light"}
            />
          ) : (
            <Typography
              variant="caption"
              className={`${isDark ? "text-white/30" : "text-gray-400"}`}
            >
              {latestBP?.recordedAt
                ? new Date(latestBP.recordedAt).toLocaleDateString(undefined, {
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
        <View
          className={`w-12 h-12 rounded-full ${isDark ? "bg-accent/10" : "bg-orange-50"} justify-center items-center`}
        >
          <Ionicons name="pulse" size={24} color={Theme.colors.accent} />
        </View>
      </Card>
    );
  },
);

// Optimized Activity Item Component
const ActivityItem = memo(
  ({ symptom, isDark }: { symptom: Symptom; isDark: boolean }) => (
    <Card
      key={symptom.id}
      className={`${isDark ? "bg-card-dark border-white/10" : "bg-white border-gray-100"} border p-4 flex-row items-center mb-2 rounded-[20px]`}
    >
      <View className="w-10 h-10 rounded-full bg-[#4C2456] justify-center items-center mr-4">
        <Ionicons name="alert-circle" size={20} color="#E879F9" />
      </View>
      <View className="flex-1">
        <Typography
          variant="h3"
          className={`${isDark ? "text-white" : "text-text"} text-[15px]`}
        >
          {symptom.symptomType.replace(/_/g, " ")}
        </Typography>
        <Typography
          variant="caption"
          className={`${isDark ? "text-white/40" : "text-gray-400"}`}
        >
          Reported
        </Typography>
      </View>
      <Typography
        variant="caption"
        className={`${isDark ? "text-white/30" : "text-gray-300"}`}
      >
        {new Date(symptom.recordedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
    </Card>
  ),
);

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
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

  const statusColors = useMemo(() => {
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

  const statusLabel = useMemo(() => {
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
    <Screen
      className="pt-6"
      scrollable
      backgroundColor={isDark ? Theme.colors.darkBg : Theme.colors.background}
    >
      <View className="flex-row items-center justify-between px-6 mb-6">
        <Typography
          variant="h2"
          className={`${isDark ? "text-white" : "text-text"} text-xl`}
        >
          Priority Dashboard
        </Typography>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className={`relative w-11 h-11 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"} justify-center items-center`}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons
              name="notifications"
              size={24}
              color={isDark ? "white" : "#1A212E"}
            />
            {unreadCount > 0 && (
              <View
                className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-accent border-2 ${isDark ? "border-[#1A1512]" : "border-white"}`}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-11 h-11 rounded-full overflow-hidden border-2 ${isDark ? "border-white/20" : "border-gray-200"}`}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Image
              source={require("../../assets/images/maternal_onboarding_illustration.jpg")}
              className="w-full h-full"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 120 }}>
        {/* Urgent Status Card */}
        <StatusCard
          priorityData={priorityData}
          statusColors={statusColors}
          statusLabel={statusLabel}
          isLoading={isLoadingPriority}
          isDark={isDark}
          onPress={() =>
            router.push(
              priorityData?.priority === "EMERGENCY"
                ? "/emergency"
                : "/symptom-results",
            )
          }
        />

        {/* Stats Row */}
        <StatsCard
          latestBP={latestBP}
          isLoading={isLoadingLatestBP}
          isDark={isDark}
        />

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
              className={`flex-1 border ${isDark ? "border-white/10" : "border-gray-200"} bg-transparent h-12 rounded-full flex-row items-center justify-center gap-2`}
              onPress={() => router.push("/clinic-finder")}
            >
              <Ionicons name="map" size={18} color={Theme.colors.accent} />
              <Typography variant="h3" weight="bold" className="text-accent">
                Find Clinic
              </Typography>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`border ${isDark ? "border-white/10" : "border-gray-200"} bg-transparent h-12 rounded-full flex-row items-center justify-center gap-2`}
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
          className={`${isDark ? "bg-card-dark border-red-500/20" : "bg-white border-red-100"} p-4 rounded-[24px] flex-row items-center mb-10 border shadow-lexend-medium`}
          onPress={() => router.push("/emergency")}
        >
          <View className="w-11 h-11 rounded-full bg-emergency justify-center items-center mr-4">
            <Ionicons name="medical" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Typography
              variant="h3"
              weight="bold"
              className={`${isDark ? "text-white" : "text-text"} text-base`}
            >
              Feeling unwell?
            </Typography>
            <Typography
              variant="caption"
              className={`${isDark ? "text-white/50" : "text-gray-500"}`}
            >
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
          <Typography
            variant="h2"
            className={`${isDark ? "text-white" : "text-text"} text-lg`}
          >
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
              variant={isDark ? "dark" : "light"}
            />
            <Skeleton
              height={80}
              borderRadius={20}
              style={{ marginBottom: 8 }}
              variant={isDark ? "dark" : "light"}
            />
          </>
        ) : (recentSymptoms?.length || 0) > 0 ? (
          recentSymptoms?.map((symptom) => (
            <ActivityItem key={symptom.id} symptom={symptom} isDark={isDark} />
          ))
        ) : (
          <Typography
            variant="body"
            className={`${isDark ? "text-white/30" : "text-gray-300"} text-center mt-5`}
          >
            No recent activity recorded
          </Typography>
        )}
      </View>
    </Screen>
  );
}
