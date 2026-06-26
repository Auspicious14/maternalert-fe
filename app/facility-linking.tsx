import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "../components/shared/Button";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { useToast } from "../components/ui/ToastProvider";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useUserProfile } from "../hooks/useUserProfile";

export default function FacilityLinkingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { profile, updateProfile, isUpdatingProfile } = useUserProfile();
  const { showToast } = useToast();

  const [clinicName, setClinicName] = useState(profile?.clinicName ?? "");
  const [clinicAddress, setClinicAddress] = useState(
    profile?.clinicAddress ?? "",
  );
  const [clinicPhone, setClinicPhone] = useState(profile?.clinicPhone ?? "");
  const [facilityCode, setFacilityCode] = useState("");

  const handleSave = async () => {
    try {
      await updateProfile({
        clinicName,
        clinicAddress,
        clinicPhone,
      });
      showToast({
        type: "success",
        message: "Facility linked successfully!",
      });
      router.back();
    } catch (error) {
      console.error("Failed to link facility:", error);
      showToast({
        type: "error",
        message: "Failed to link facility. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB" }}
    >
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#F9FAFB"}>
        <View className="px-6 pt-4 mb-8 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={28}
              color={isDark ? Theme.colors.white : "#1A212E"}
            />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px] ml-4">
            Link Facility
          </Typography>
        </View>

        <View className="px-10">
          <Typography
            variant="h1"
            className="text-[32px] font-black mb-3 shadow-lexend-bold"
          >
            Connect with your clinic
          </Typography>
          <Typography
            variant="body"
            className={
              isDark
                ? "text-gray-300 text-lg mb-10"
                : "text-gray-500 text-lg mb-10"
            }
          >
            Link your profile to your health facility so they can monitor your
            progress.
          </Typography>

          <View className="gap-6 mb-10">
            <View>
              <Typography
                variant="caption"
                className={isDark ? "text-gray-400" : "text-gray-500"}
              >
                Facility Code (Optional)
              </Typography>
              <TextInput
                className={`mt-2 px-4 py-3 rounded-[16px] border ${isDark ? "bg-[#020617] border-white/10 text-white" : "bg-white border-[#F1F5F9] text-[#1A212E]"}`}
                placeholder="Enter facility code"
                placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
                value={facilityCode}
                onChangeText={setFacilityCode}
              />
            </View>

            <View>
              <Typography
                variant="caption"
                className={isDark ? "text-gray-400" : "text-gray-500"}
              >
                Clinic Name
              </Typography>
              <TextInput
                className={`mt-2 px-4 py-3 rounded-[16px] border ${isDark ? "bg-[#020617] border-white/10 text-white" : "bg-white border-[#F1F5F9] text-[#1A212E]"}`}
                placeholder="Enter clinic name"
                placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
                value={clinicName}
                onChangeText={setClinicName}
              />
            </View>

            <View>
              <Typography
                variant="caption"
                className={isDark ? "text-gray-400" : "text-gray-500"}
              >
                Clinic Address
              </Typography>
              <TextInput
                className={`mt-2 px-4 py-3 rounded-[16px] border ${isDark ? "bg-[#020617] border-white/10 text-white" : "bg-white border-[#F1F5F9] text-[#1A212E]"}`}
                placeholder="Enter clinic address"
                placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
                value={clinicAddress}
                onChangeText={setClinicAddress}
              />
            </View>

            <View>
              <Typography
                variant="caption"
                className={isDark ? "text-gray-400" : "text-gray-500"}
              >
                Clinic Phone (Optional)
              </Typography>
              <TextInput
                className={`mt-2 px-4 py-3 rounded-[16px] border ${isDark ? "bg-[#020617] border-white/10 text-white" : "bg-white border-[#F1F5F9] text-[#1A212E]"}`}
                placeholder="Enter clinic phone number"
                placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
                value={clinicPhone}
                onChangeText={setClinicPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Button
            title={isUpdatingProfile ? "Saving..." : "Link Facility"}
            containerStyle={{ height: 70, borderRadius: 35 }}
            onPress={handleSave}
            disabled={isUpdatingProfile || !clinicName.trim()}
          />

          <View className="mt-6">
            <Typography
              variant="caption"
              className={isDark ? "text-gray-400" : "text-gray-500"}
            >
              Or scan QR code
            </Typography>
            <TouchableOpacity
              className={`mt-3 px-4 py-4 rounded-[24px] border flex-row items-center justify-center gap-2 ${isDark ? "bg-[#020617] border-white/10" : "bg-white border-[#F1F5F9]"}`}
              onPress={() =>
                showToast({
                  type: "info",
                  message: "QR code scanning coming soon!",
                })
              }
            >
              <Ionicons
                name="qr-code-outline"
                size={24}
                color={isDark ? Theme.colors.white : "#1A212E"}
              />
              <Typography variant="h3" weight="bold">
                Scan QR Code
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    </SafeAreaView>
  );
}
