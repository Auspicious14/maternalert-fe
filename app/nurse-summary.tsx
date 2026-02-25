import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "../components/shared/Card";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useHealthData } from "../hooks/useHealthData";
import { useUserProfile } from "../hooks/useUserProfile";

export default function NurseSummaryScreen() {
  const router = useRouter();
  const { latestBP, recentSymptoms } = useHealthData();
  const { profile } = useUserProfile();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleCallEmergency = () => {
    if (profile?.emergencyContactPhone) {
      Linking.openURL(`tel:${profile.emergencyContactPhone}`);
    } else {
      Linking.openURL("tel:999"); // Fallback to local emergency services
    }
  };

  const handleShowToMidwife = () => {
    router.push("/clinic-finder");
  };

  const backgroundColor = isDark ? Theme.colors.darkBg : "#FFFFFF";

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#EF4444" }}>
      <Screen backgroundColor={backgroundColor}>
        {/* Urgent Header Banner */}
        <View className="bg-emergency py-10 px-10 items-center rounded-b-[60px]">
          <View className="relative mb-5 justify-center items-center">
            <Ionicons
              name="warning"
              size={60}
              color="#FFFFFF"
              className="absolute opacity-30"
            />
            <Ionicons name="alert-circle" size={80} color="#FFFFFF" />
          </View>
          <Typography
            variant="h1"
            className="text-white text-center text-[28px] font-black leading-[38px]"
          >
            GO TO THE NEAREST HEALTH FACILITY NOW
          </Typography>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Nurse Card */}
          <Card
            className={`rounded-[32px] p-6 mb-10 border-l-8 border-l-emergency shadow-md ${isDark ? "bg-card-dark border-white/10" : "bg-white border-gray-100"}`}
          >
            <View className="flex-row items-center gap-3 mb-5">
              <View
                className={`w-11 h-11 rounded-xl justify-center items-center ${isDark ? "bg-red-900/20" : "bg-red-50"}`}
              >
                <Ionicons
                  name="medical"
                  size={24}
                  color={Theme.colors.emergency}
                />
              </View>
              <Typography
                variant="h2"
                weight="bold"
                className="text-lg font-black tracking-tight"
              >
                SHOW THIS TO THE NURSE
              </Typography>
            </View>

            <View
              className={`h-[1px] mb-6 ${isDark ? "bg-white/10" : "bg-gray-100"}`}
            />

            {/* Clinical Data Section */}
            <View className="flex-row items-start gap-3 mb-5">
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Theme.colors.emergency}
              />
              <View className="flex-1">
                <Typography variant="h3" className="text-lg">
                  Blood Pressure:{" "}
                  <Typography weight="bold" className="font-extrabold">
                    {latestBP
                      ? `${latestBP.systolic}/${latestBP.diastolic}`
                      : "Not recorded"}
                  </Typography>
                </Typography>
                <Typography
                  variant="caption"
                  weight="bold"
                  className="text-emergency text-xs mt-0.5 tracking-[1px]"
                >
                  (
                  {latestBP?.systolic && latestBP.systolic >= 160
                    ? "CRITICAL"
                    : "ELEVATED"}
                  )
                </Typography>
              </View>
            </View>

            {recentSymptoms?.map((symptom) => (
              <View
                key={symptom.id}
                className="flex-row items-start gap-3 mb-5"
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color={isDark ? "#9CA3AF" : Theme.colors.text}
                />
                <Typography variant="h3" className="text-lg">
                  {symptom.symptomType.replace(/_/g, " ")} detected
                </Typography>
              </View>
            ))}

            {(!recentSymptoms || recentSymptoms.length === 0) && (
              <View className="flex-row items-start gap-3 mb-5">
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={Theme.colors.textLight}
                />
                <Typography variant="h3" className="text-lg text-gray-400">
                  No other symptoms reported
                </Typography>
              </View>
            )}
          </Card>

          {/* Action Buttons */}
          <View className="gap-4">
            <TouchableOpacity
              className={`h-20 rounded-[40px] flex-row items-center px-[30px] gap-4 ${isDark ? "bg-white" : "bg-[#121915]"}`}
              activeOpacity={0.8}
              onPress={handleCallEmergency}
            >
              <Ionicons
                name="call"
                size={24}
                color={isDark ? "#121915" : "#FFFFFF"}
              />
              <View className="flex-1">
                <Typography
                  variant="h3"
                  weight="bold"
                  className={`text-lg ${isDark ? "text-[#121915]" : "text-white"}`}
                >
                  Call Emergency
                </Typography>
                <Typography
                  variant="caption"
                  className={`text-xs text-sh-lexend-medium ${isDark ? "text-[#121915]/60" : "text-white/60"}`}
                >
                  Contacting:{" "}
                  {profile?.emergencyContactRelationship ||
                    "Emergency Services"}
                  {profile?.emergencyContactPhone
                    ? ` (${profile.emergencyContactPhone})`
                    : ""}
                </Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-primary h-[70px] rounded-[35px] flex-row items-center justify-center gap-3"
              activeOpacity={0.8}
              onPress={handleShowToMidwife}
            >
              <Ionicons name="people" size={24} color="#FFFFFF" />
              <Typography
                variant="h3"
                weight="bold"
                className="text-white text-lg"
              >
                Show to Midwife
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center mt-5 gap-2"
              onPress={() => router.replace("/(tabs)")}
            >
              <Ionicons name="home" size={18} color={Theme.colors.textLight} />
              <Typography
                variant="body"
                weight="bold"
                className="text-gray-500"
              >
                False Alarm? Return to Home
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}
