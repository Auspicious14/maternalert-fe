import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Card } from "../components/shared/Card";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useHealthData } from "../hooks/useHealthData";

export default function SymptomResultsScreen() {
  const router = useRouter();
  const { latestBP } = useHealthData();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FFFFFF" : "#1A212E";
  const cardBg = isDark ? Theme.colors.cardDark : "#FFFFFF";
  const borderColor = isDark ? Theme.colors.borderDark : "#F1F5F9";

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-6 pt-4 mb-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={28} color={iconColor} />
        </TouchableOpacity>
        <Typography variant="h2" weight="bold" className="text-xl">
          Care Recommendation
        </Typography>
        <View className="w-7" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center my-10">
          <View
            style={{
              backgroundColor: isDark ? "#2D2118" : "#FFF4E8",
            }}
            className="w-[180px] h-[180px] rounded-full justify-center items-center mb-6"
          >
            <View
              style={{
                backgroundColor: isDark ? "#3D2B1E" : "#FFE8D1",
              }}
              className="w-[140px] h-[140px] rounded-full justify-center items-center relative"
            >
              <View
                style={{
                  backgroundColor: isDark ? "#4D3626" : "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
                className="w-20 h-20 rounded-full justify-center items-center"
              >
                <Ionicons
                  name="medical"
                  size={40}
                  color={Theme.colors.accent}
                />
              </View>
              <View
                style={{
                  backgroundColor: isDark ? "#26211E" : "white",
                  borderColor: isDark ? "#3A3430" : "#FEE2E2",
                }}
                className="absolute bottom-[-5px] w-8 h-8 rounded-full justify-center items-center border shadow-sm"
              >
                <Ionicons
                  name="warning"
                  size={16}
                  color={Theme.colors.accent}
                />
              </View>
            </View>
          </View>
          <Typography
            variant="h1"
            className="text-[28px] font-black text-accent mb-2 shadow-lexend-bold"
          >
            Orange Level
          </Typography>
          <Typography
            variant="h2"
            weight="bold"
            className="text-xl text-center px-10 leading-7"
          >
            Medical review recommended soon
          </Typography>
        </View>

        <Card
          style={{
            backgroundColor: cardBg,
            borderColor: borderColor,
          }}
          className="rounded-[40px] p-[30px] mb-5 border"
        >
          <View className="flex-row gap-4 items-start mb-5">
            <Ionicons name="medical" size={24} color={Theme.colors.primary} />
            <Typography variant="body" className="flex-1 leading-6 text-lg">
              {latestBP && latestBP.systolic > 140
                ? "Based on your symptoms and blood pressure reading, please visit your clinic today."
                : "Your recent health data looks good. No immediate action required."}
            </Typography>
          </View>
          <View
            style={{ borderTopColor: borderColor }}
            className="flex-row items-center gap-2 border-t pt-4"
          >
            <Ionicons
              name="time"
              size={18}
              color={isDark ? "#9CA3AF" : Theme.colors.textLight}
            />
            <Typography
              variant="caption"
              className={isDark ? "text-gray-400" : "text-gray-500"}
            >
              {latestBP
                ? `Last reading: ${new Date(latestBP.recordedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "No recent readings"}
            </Typography>
          </View>
        </Card>

        <View className="gap-4">
          <TouchableOpacity
            className="bg-primary h-[70px] rounded-[35px] flex-row items-center justify-center gap-3 shadow-md"
            onPress={() => router.push("/clinic-finder")}
          >
            <Ionicons name="location" size={24} color="#1A212E" />
            <Typography
              variant="h2"
              weight="bold"
              className="text-lg text-[#1A212E]"
            >
              Find nearest clinic
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: isDark ? "#2D2118" : "#FFF4E8",
            }}
            className="h-[70px] rounded-[35px] flex-row items-center justify-center gap-3 shadow-sm"
            onPress={() => router.push("/emergency")}
          >
            <Ionicons
              name="call"
              size={24}
              color={isDark ? "#FFA14A" : Theme.colors.urgentText}
            />
            <Typography
              variant="h2"
              weight="bold"
              style={{ color: isDark ? "#FFA14A" : "#92400E" }}
              className="text-lg"
            >
              Call emergency contact
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center mt-2.5"
            onPress={() => router.replace("/(tabs)")}
          >
            <Typography
              variant="h3"
              weight="bold"
              className={isDark ? "text-gray-400" : "text-gray-500"}
            >
              Back to Home
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
