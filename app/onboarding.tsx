import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

const { height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Screen safe={true} scrollable={true}>
      <View className="flex-1 px-6 pb-10">
        <View className="flex-row justify-end pt-4 mb-4">
          <TouchableOpacity
            style={{
              backgroundColor: isDark ? Theme.colors.cardDark : "white",
            }}
            className="flex-row items-center gap-2 py-2 px-4 rounded-full shadow-sm"
            activeOpacity={0.7}
          >
            <Ionicons name="language" size={20} color={Theme.colors.primary} />
            <Typography variant="body" weight="bold">
              English
            </Typography>
            <Ionicons
              name="chevron-down"
              size={16}
              color={Theme.colors.textLight}
            />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-6">
          <Image
            source={require("../assets/images/matern-logo.png")}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        <View className="px-4 mb-6">
          <Typography
            variant="h1"
            weight="black"
            className="text-center mb-3 text-[32px] leading-[42px]"
          >
            Safe Pregnancy{"\n"}Tracking
          </Typography>
          <Typography
            variant="body"
            className="text-center leading-6 text-base px-2"
          >
            Notice warning signs early and know exactly when to seek professional
            care.
          </Typography>
        </View>

        <View className="items-center mb-10">
          <View
            style={{
              backgroundColor: isDark ? Theme.colors.cardDark : "white",
              borderColor: isDark ? Theme.colors.borderDark : "#E2E8F0",
            }}
            className="w-[85%] aspect-square rounded-[40px] shadow-sm border overflow-hidden items-center justify-center"
          >
            <Image
              source={require("../assets/images/maternal_onboarding_illustration.jpg")}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="px-4 mb-10">
          <View
            style={{
              backgroundColor: isDark ? "#1E293B" : "#F0F7FF",
              borderColor: isDark ? "#334155" : "#DBEAFE",
            }}
            className="flex-row p-5 rounded-3xl items-center gap-4 border"
          >
            <View
              style={{
                backgroundColor: isDark ? Theme.colors.cardDark : "white",
              }}
              className="w-12 h-12 rounded-2xl justify-center items-center shadow-sm"
            >
              <Ionicons name="shield-checkmark" size={28} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Typography
                variant="body"
                weight="bold"
                className={`${isDark ? "text-blue-300" : "text-blue-900"} text-[15px] mb-0.5`}
              >
                Clinical Guidance
              </Typography>
              <Typography
                variant="caption"
                className={`${isDark ? "text-blue-400" : "text-blue-800"} leading-[18px] text-xs opacity-80`}
              >
                Built on verified clinical safety standards to support your
                journey.
              </Typography>
            </View>
          </View>
        </View>

        <View className="px-4 mt-auto">
          <TouchableOpacity
            className="bg-primary w-full h-16 rounded-[20px] flex-row items-center justify-center gap-3 mb-5 shadow-sm"
            activeOpacity={0.8}
            onPress={() => router.push("/disclaimer")}
          >
            <Typography variant="h3" weight="bold" className="text-[#121915]">
              Get Started
            </Typography>
            <Ionicons name="arrow-forward" size={24} color="#121915" />
          </TouchableOpacity>

          <Typography
            variant="caption"
            className="text-gray-400 text-center text-[11px] leading-4 px-4"
          >
            By continuing, you acknowledge that this app does not replace
            medical advice. See our{" "}
            <Typography
              variant="caption"
              className="underline"
            >
              Terms
            </Typography>{" "}
            &{" "}
            <Typography
              variant="caption"
              className="underline"
            >
              Privacy Policy
            </Typography>
            .
          </Typography>
        </View>
      </View>
    </Screen>
  );
}
