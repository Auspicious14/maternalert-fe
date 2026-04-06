import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useAuthContext } from "../context/AuthContext";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useUserProfile } from "../hooks/useUserProfile";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { createProfile, isCreatingProfile } = useUserProfile();
  const { checkSession } = useAuthContext();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const textColor = isDark ? "#FFFFFF" : "#121915";
  const subTextColor = isDark ? "#94A3B8" : "#6B7280";
  const bgColor = isDark ? "#1A1512" : "#F9FAFB";
  const cardBg = isDark ? "#26211E" : "#FFFFFF";
  const borderColor = isDark ? "#3A3430" : "#F1F5F9";

  const [ageRange, setAgeRange] = useState<
    "UNDER_18" | "AGE_18_34" | "AGE_35_PLUS"
  >("AGE_18_34");
  const [weeks, setWeeks] = useState(24);
  const [conditions, setConditions] = useState<string[]>([]);
  const [isFirstPregnancy, setIsFirstPregnancy] = useState<boolean | null>(
    null
  );

  const toggleCondition = (id: string) => {
    if (conditions.includes(id)) {
      setConditions(conditions.filter((c) => c !== id));
    } else {
      setConditions([...conditions, id]);
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      try {
        const mappedConditions = conditions.map((c) => {
          switch (c) {
            case "hbp":
              return "CHRONIC_HYPERTENSION";
            case "diabetes":
              return "GESTATIONAL_DIABETES";
            case "twins":
              return "MULTIPLE_PREGNANCY";
            case "kidney":
              return "KIDNEY_DISEASE";
            default:
              return "NONE";
          }
        });

        await createProfile({
          ageRange,
          pregnancyWeeks: weeks,
          firstPregnancy: isFirstPregnancy ?? true,
          knownConditions:
            mappedConditions.length > 0 ? mappedConditions : ["NONE"],
        });

        // Crucial: Update auth state before redirecting
        await checkSession();
        
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Failed to create profile", error);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View className="flex-1">
            <Typography
              variant="h1"
              weight="bold"
              style={{ color: textColor }}
              className="text-[32px] leading-10 mb-4 text-center"
            >
              How old are you?
            </Typography>

            <Typography
              variant="body"
              style={{ color: subTextColor }}
              className="text-center mb-10"
            >
              We use age range instead of exact age for privacy.
            </Typography>

            <View className="gap-4 mb-8">
              <ConditionItem
                title="Under 18"
                subtitle="You are younger than 18"
                selected={ageRange === "UNDER_18"}
                onPress={() => setAgeRange("UNDER_18")}
                isDark={isDark}
              />
              <ConditionItem
                title="18 – 34 years"
                subtitle="Most first pregnancies"
                selected={ageRange === "AGE_18_34"}
                onPress={() => setAgeRange("AGE_18_34")}
                isDark={isDark}
              />
              <ConditionItem
                title="35 years and above"
                subtitle="Advanced maternal age"
                selected={ageRange === "AGE_35_PLUS"}
                onPress={() => setAgeRange("AGE_35_PLUS")}
                isDark={isDark}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View className="flex-1">
            <Typography
              variant="h1"
              weight="bold"
              style={{ color: textColor }}
              className="text-[32px] leading-10 mb-4 text-center"
            >
              How many weeks{"\n"}pregnant are you?
            </Typography>
            <Typography
              variant="body"
              style={{ color: subTextColor }}
              className="text-center mb-10"
            >
              If you aren&apos;t sure, give your best guess.
            </Typography>

            <View className="items-center my-10">
              <Typography
                variant="h1"
                weight="bold"
                style={{ color: textColor }}
                className="text-[100px] leading-[110px]"
              >
                {weeks}
              </Typography>
              <Typography variant="h3" style={{ color: subTextColor }} className="text-2xl">
                Weeks
              </Typography>
            </View>

            <View className="flex-row items-center gap-5 mb-2">
              <TouchableOpacity
                style={{ backgroundColor: cardBg, borderColor: borderColor }}
                className="w-16 h-16 rounded-full justify-center items-center border shadow-sm"
                onPress={() => setWeeks(Math.max(0, weeks - 1))}
              >
                <Ionicons
                  name="remove"
                  size={32}
                  color={Theme.colors.primary}
                />
              </TouchableOpacity>

              <View className="flex-1 h-10 justify-center relative">
                <View style={{ backgroundColor: isDark ? "#3A3430" : "#EDF2F7" }} className="h-2 rounded-full w-full" />
                <View
                  className="h-2 bg-primary rounded-full absolute"
                  style={{ width: `${(weeks / 42) * 100}%` }}
                />
                <View
                  className="w-6 h-6 rounded-full bg-primary border-4 border-white absolute shadow-sm"
                  style={{ left: `${(weeks / 42) * 100}%`, marginLeft: -12 }}
                />
              </View>

              <TouchableOpacity
                className="w-16 h-16 rounded-full bg-primary justify-center items-center shadow-sm"
                onPress={() => setWeeks(Math.min(42, weeks + 1))}
              >
                <Ionicons name="add" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between px-2 mt-2">
              <Typography variant="caption" style={{ color: subTextColor }}>
                0 Weeks
              </Typography>
              <Typography variant="caption" style={{ color: subTextColor }}>
                42 Weeks
              </Typography>
            </View>
          </View>
        );
      case 3:
        return (
          <View className="flex-1">
            <Typography
              variant="h1"
              weight="bold"
              style={{ color: textColor }}
              className="text-[32px] leading-10 mb-4 text-center"
            >
              Have you ever had any of these conditions?
            </Typography>

            <View className="gap-4 mb-8">
              <ConditionItem
                id="hbp"
                title="High blood pressure"
                subtitle="Before this pregnancy"
                selected={conditions.includes("hbp")}
                onPress={() => toggleCondition("hbp")}
                isDark={isDark}
              />
              <ConditionItem
                id="diabetes"
                title="Diabetes"
                subtitle="Sugar problems"
                selected={conditions.includes("diabetes")}
                onPress={() => toggleCondition("diabetes")}
                isDark={isDark}
              />
              <ConditionItem
                id="twins"
                title="Twins or more"
                subtitle="Multiples like triplets"
                selected={conditions.includes("twins")}
                onPress={() => toggleCondition("twins")}
                isDark={isDark}
              />
              <ConditionItem
                id="kidney"
                title="Kidney problems"
                subtitle="Ongoing issues with kidneys"
                selected={conditions.includes("kidney")}
                onPress={() => toggleCondition("kidney")}
                isDark={isDark}
              />
            </View>

            <TouchableOpacity className="items-center mt-2"   onPress={() => setConditions([])}>
              <Typography
                variant="h3"
                weight="bold"
                className="text-setup-blue"
              >
                None of these apply to me
              </Typography>
            </TouchableOpacity>
          </View>
        );
      case 4:
        return (
          <View className="flex-1">
            <Typography
              variant="h1"
              weight="bold"
              style={{ color: textColor }}
              className="text-[32px] leading-10 mb-4 text-center"
            >
              Is this your first pregnancy?
            </Typography>

            <View className="flex-row justify-between mt-10 mb-10 gap-4">
              <TouchableOpacity
                style={{ backgroundColor: cardBg, borderColor: isFirstPregnancy === true ? Theme.colors.primary : borderColor }}
                className="flex-1 rounded-[40px] p-[30px] items-center border-2 shadow-sm relative"
                onPress={() => setIsFirstPregnancy(true)}
              >
                <View style={{ backgroundColor: isDark ? "#1B3A26" : "#E0FAEB" }} className="w-20 h-20 rounded-full justify-center items-center mb-5">
                  <Ionicons
                    name="happy-outline"
                    size={40}
                    color={Theme.colors.primary}
                  />
                </View>
                <Typography variant="h2" weight="bold" style={{ color: textColor }} className="text-[22px]">
                  Yes
                </Typography>
                {isFirstPregnancy === true && (
                  <View className="absolute top-[15px] right-[15px] w-5 h-5 rounded-full bg-primary justify-center items-center">
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: cardBg, borderColor: isFirstPregnancy === false ? Theme.colors.primary : borderColor }}
                className="flex-1 rounded-[40px] p-[30px] items-center border-2 shadow-sm relative"
                onPress={() => setIsFirstPregnancy(false)}
              >
                <View style={{ backgroundColor: isDark ? "#3A3430" : "#F3F4F6" }} className="w-20 h-20 rounded-full justify-center items-center mb-5">
                  <Ionicons name="people-outline" size={40} color={subTextColor} />
                </View>
                <Typography variant="h2" weight="bold" style={{ color: textColor }} className="text-[22px]">
                  No
                </Typography>
                {isFirstPregnancy === false && (
                  <View className="absolute top-[15px] right-[15px] w-5 h-5 rounded-full bg-primary justify-center items-center">
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Typography
              variant="body"
              style={{ color: subTextColor }}
              className="text-center px-5 leading-5"
            >
              This helps us provide the most relevant health tips and tracking
              for your specific needs.
            </Typography>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: bgColor }} className="flex-1">
      <Screen backgroundColor={bgColor}>
        <View className="flex-row items-center justify-between px-6 pt-4 mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 justify-center items-center"
          >
            <Ionicons name="arrow-back" size={28} color={textColor} />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" style={{ color: textColor }} className="text-[22px]">
            Profile Setup
          </Typography>
          <View className="w-7" />
        </View>

        <View className="px-10 mb-8">
          <View className="flex-row justify-between mb-2">
            <Typography
              variant="caption"
              style={{ color: subTextColor }}
              className="uppercase tracking-widest text-[10px]"
            >
              {step === 4 ? "Final Step" : `STEP ${step} OF ${totalSteps}`}
            </Typography>
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: textColor }}
            >
              {step} of {totalSteps}
            </Typography>
          </View>
          <View style={{ backgroundColor: isDark ? "#3A3430" : "#E2E8F0" }} className="h-[6px] rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full shadow-sm"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        <View
          className={`px-10 pb-10 ${SCREEN_HEIGHT < 700 ? "pb-4" : "pb-8"}`}
        >
          <TouchableOpacity
            className={`bg-primary h-[70px] rounded-[35px] flex-row items-center justify-center gap-3 shadow-md ${
              isCreatingProfile || (step === 4 && isFirstPregnancy === null)
                ? "opacity-50"
                : ""
            }`}
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={
              isCreatingProfile || (step === 4 && isFirstPregnancy === null)
            }
          >
            <Typography
              variant="h2"
              weight="bold"
              className="text-[#121915] text-[22px]"
            >
              {step === 4 ? "Finish Profile" : "Next"}
            </Typography>
            {step !== 4 && (
              <Ionicons name="arrow-forward" size={24} color="#121915" />
            )}
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

function ConditionItem({ title, subtitle, selected, onPress, isDark }: any) {
  const textColor = isDark ? "#FFFFFF" : "#121915";
  const subTextColor = isDark ? "#94A3B8" : "#6B7280";
  const cardBg = isDark ? "#26211E" : "#FFFFFF";
  const borderColor = isDark ? "#3A3430" : "#F1F5F9";

  return (
    <TouchableOpacity
      style={{ 
        backgroundColor: selected ? (isDark ? "#1B3A26" : "#F7FFF9") : cardBg,
        borderColor: selected ? Theme.colors.primary : borderColor
      }}
      className="rounded-[35px] py-5 px-6 flex-row items-center justify-between border shadow-sm"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <Typography variant="h3" weight="bold" style={{ color: textColor }} className="text-lg mb-0.5">
          {title}
        </Typography>
        <Typography variant="caption" style={{ color: subTextColor }} className="text-sm">
          {subtitle}
        </Typography>
      </View>
      <View
        style={{ borderColor: selected ? Theme.colors.primary : (isDark ? "#4B5563" : "#D1D5DB"), backgroundColor: selected ? (isDark ? "#FFFFFF" : "white") : "transparent" }}
        className="w-7 h-7 border rounded-full justify-center items-center"
      >
        {selected && (
          <Ionicons name="checkmark" size={16} color={Theme.colors.primary} />
        )}
      </View>
    </TouchableOpacity>
  );
}
