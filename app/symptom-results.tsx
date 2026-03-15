import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Card } from "../components/shared/Card";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useCarePriority } from "../hooks/useCarePriority";
import { useHealthData } from "../hooks/useHealthData";

export default function SymptomResultsScreen() {
  const router = useRouter();
  const { latestBP } = useHealthData();
  const { data: priorityData } = useCarePriority();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const iconColor = isDark ? "#FFFFFF" : "#1A212E";
  const cardBg = isDark ? Theme.colors.cardDark : "#FFFFFF";
  const borderColor = isDark ? Theme.colors.borderDark : "#F1F5F9";

  const priorityInfo = React.useMemo(() => {
    switch (priorityData?.priority) {
      case "EMERGENCY":
        return {
          label: "EMERGENCY CARE",
          color: Theme.colors.emergency,
          icon: "alert-circle",
          bgLight: isDark ? "#3D1A1A" : "#FEF2F2",
          bgInner: isDark ? "#5C2626" : "#FEE2E2",
          description: "Immediate clinical attention is required. Please follow the instructions below.",
        };
      case "URGENT_REVIEW":
        return {
          label: "URGENT REVIEW",
          color: Theme.colors.accent,
          icon: "warning",
          bgLight: isDark ? "#3D2B1E" : "#FFF4E8",
          bgInner: isDark ? "#5C402D" : "#FFE8D1",
          description: "Your symptoms require medical review within 24 hours.",
        };
      case "INCREASED_MONITORING":
        return {
          label: "INCREASED MONITORING",
          color: Theme.colors.primary,
          icon: "eye",
          bgLight: isDark ? "#1A2D1F" : "#F0FDF4",
          bgInner: isDark ? "#26452D" : "#DCFCE7",
          description: "Monitor your symptoms closely and report any changes.",
        };
      default:
        return {
          label: "ROUTINE CARE",
          color: Theme.colors.primary,
          icon: "checkmark-circle",
          bgLight: isDark ? "#1A2D1F" : "#F0FDF4",
          bgInner: isDark ? "#26452D" : "#DCFCE7",
          description: "Your health data is within normal range. Continue regular tracking.",
        };
    }
  }, [priorityData?.priority, isDark]);

  const textColor = isDark ? "#FFFFFF" : "#1A212E";
  const subTextColor = isDark ? "#94A3B8" : "#64748B";

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-6 pt-4 mb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={28} color={iconColor} />
        </TouchableOpacity>
        <Typography variant="h2" weight="bold" style={{ color: textColor }} className="text-xl">
          Care Recommendation
        </Typography>
        <View className="w-7" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-8 mb-6">
          <View
            style={{
              backgroundColor: priorityInfo.bgLight,
            }}
            className="w-48 h-48 rounded-full justify-center items-center mb-6"
          >
            <View
              style={{
                backgroundColor: priorityInfo.bgInner,
              }}
              className="w-36 h-36 rounded-full justify-center items-center relative"
            >
              <View
                style={{
                  backgroundColor: isDark ? "#1A1512" : "white",
                  shadowColor: priorityInfo.color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                className="w-20 h-20 rounded-full justify-center items-center"
              >
                <Ionicons
                  name={priorityInfo.icon as any}
                  size={44}
                  color={priorityInfo.color}
                />
              </View>
            </View>
          </View>
          
          <View
            style={{ backgroundColor: priorityInfo.bgLight }}
            className="px-4 py-1 rounded-full mb-3"
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: priorityInfo.color }}
              className="tracking-widest uppercase text-xs"
            >
              {priorityInfo.label}
            </Typography>
          </View>

          <Typography
            variant="h1"
            style={{ color: textColor }}
            className="text-2xl text-center px-4 mb-2 font-black"
          >
            {priorityData?.message || "Assessing your health status..."}
          </Typography>
          
          <Typography
            variant="body"
            style={{ color: subTextColor }}
            className="text-center px-6 leading-5"
          >
            {priorityInfo.description}
          </Typography>
        </View>

        <Card
          style={{
            backgroundColor: cardBg,
            borderColor: borderColor,
          }}
          className="rounded-3xl p-6 mb-8 border shadow-sm"
        >
          <View className="flex-row gap-4 items-start mb-6">
            <View className="w-10 h-10 rounded-xl bg-primary/10 justify-center items-center">
              <Ionicons name="medical" size={20} color={Theme.colors.primary} />
            </View>
            <View className="flex-1">
              <Typography variant="h3" weight="bold" style={{ color: textColor }} className="mb-1">
                Assessment Factors
              </Typography>
              <Typography variant="body" style={{ color: subTextColor }} className="leading-5 text-[15px]">
                {priorityData?.reasons && priorityData.reasons.length > 0
                  ? priorityData.reasons.join(", ")
                  : "No immediate clinical concerns identified from your data."}
              </Typography>
            </View>
          </View>

          <View
            style={{ borderTopColor: borderColor }}
            className="flex-row items-center justify-between border-t pt-4"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons
                name="time-outline"
                size={18}
                color={subTextColor}
              />
              <Typography
                variant="caption"
                style={{ color: subTextColor }}
              >
                {latestBP
                  ? `Reading from ${new Date(latestBP.recordedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "No recent readings"}
              </Typography>
            </View>
            {latestBP && (
              <Typography variant="caption" weight="bold" style={{ color: Theme.colors.primary }}>
                {latestBP.systolic}/{latestBP.diastolic}
              </Typography>
            )}
          </View>
        </Card>

        <View className="gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary h-[64px] rounded-2xl flex-row items-center justify-center gap-3 shadow-md"
            onPress={() => router.push("/clinic-finder")}
          >
            <Ionicons name="location" size={22} color="#1A212E" />
            <Typography
              variant="h2"
              weight="bold"
              className="text-lg text-[#1A212E]"
            >
              Find Nearest Clinic
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: isDark ? "#2D2118" : "#FFF4E8",
            }}
            className="h-[64px] rounded-2xl flex-row items-center justify-center gap-3"
            onPress={() => router.push("/emergency")}
          >
            <Ionicons
              name="call"
              size={22}
              color={isDark ? "#FFA14A" : Theme.colors.urgentText}
            />
            <Typography
              variant="h2"
              weight="bold"
              style={{ color: isDark ? "#FFA14A" : "#92400E" }}
              className="text-lg"
            >
              Call Emergency Contact
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="items-center py-4"
            onPress={() => router.replace("/(tabs)")}
          >
            <Typography
              variant="h3"
              weight="bold"
              style={{ color: subTextColor }}
            >
              Dismiss
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
