import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Button } from "../components/shared/Button";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { useToast } from "../components/ui/ToastProvider";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useHealthData } from "../hooks/useHealthData";

import * as Notifications from "expo-notifications";
import { useTrends } from "../hooks/useTrends";
import { getTier, getTierInfo, Tier } from "../services/escalation";
import { notificationService } from "../services/notifications";

function getBPValidationError(systolic: string, diastolic: string): string | null {
  const sys = Number(systolic);
  const dia = Number(diastolic);

  if (!systolic || !diastolic || Number.isNaN(sys) || Number.isNaN(dia)) {
    return "Enter both BP numbers from your monitor.";
  }
  if (sys < 60 || sys > 260) {
    return "Top number should be between 60 and 260.";
  }
  if (dia < 40 || dia > 160) {
    return "Bottom number should be between 40 and 160.";
  }
  if (dia >= sys) {
    return "The top number should be higher than the bottom number.";
  }
  return null;
}

export default function BPEntryScreen() {
  const router = useRouter();
  const { addBP, isAddingBP } = useHealthData();
  const { analyzeLatestTrends } = useTrends();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { showToast } = useToast();

  // Start empty: pre-filling 120/80 let a mother tap Save without measuring,
  // recording a fake "normal" reading that hides real risk from her clinic.
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentTier, setCurrentTier] = useState<Tier | null>(null);
  const validationError = getBPValidationError(systolic, diastolic);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(currentDate);

  const scheduleTierNotifications = async (tier: Tier) => {
    try {
      if (tier === 2 || tier === 3) {
          // Schedule follow-up in 4 hours
          await notificationService.scheduleNotification(
            "Follow-up BP Check",
            "You logged an elevated BP reading earlier. Have you rechecked? Tap to log your new reading.",
            { type: "FOLLOW_UP" },
            {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 4 * 60 * 60,
            },
          );

          // Schedule second stronger notification in 5 hours (1 hour after the first one)
          await notificationService.scheduleNotification(
            "Recheck Required",
            "We haven't heard from you. Please recheck your BP or contact your clinic. Your health matters.",
            { type: "FOLLOW_UP", level: "urgent" },
            {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 5 * 60 * 60,
            },
          );
        }

        if (tier === 3) {
          // Urgent notification
          await notificationService.scheduleNotification(
            "High BP Reading",
            "You have had a high BP reading. Please contact your clinic today.",
            { type: "URGENT_ALERT" },
            {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 1,
            },
          );
        } else if (tier === 4) {
          // Critical notification
          await notificationService.scheduleNotification(
            "DANGER: Seek Help",
            "Seek urgent medical care immediately. Your BP is critical.",
            { type: "CRITICAL_ALERT" },
            {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 1,
            },
          );
        }
    } catch (error) {
      // Local notifications can fail (e.g. permission denied); the on-screen
      // warning is still shown, so never let this block the flow.
      console.error("Failed to schedule BP notifications", error);
    }
  };

  const handleSave = async () => {
    if (validationError) {
      showToast({ type: "error", message: validationError });
      return;
    }

    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    const tier = getTier(sys, dia);
    setCurrentTier(tier);

    // SAFETY: show the warning and fire local alerts BEFORE talking to the
    // server. Previously the warning only appeared after a successful save, so
    // a dangerous reading entered while offline (or while the free-tier server
    // was asleep) produced only "Failed to save" and no danger warning.
    if (tier !== 1) {
      setShowConfirmation(true);
      await scheduleTierNotifications(tier);
    }

    let saved = false;
    try {
      const savedReading = await addBP({ systolic: sys, diastolic: dia });
      saved = true;

      try {
        await notificationService.handleBPLogged(
          savedReading?.reading?.recordedAt || savedReading?.recordedAt,
        );
        const trendAlerts = await analyzeLatestTrends();
        if (__DEV__ && trendAlerts.length > 0) {
          console.log("Trend alerts detected:", trendAlerts);
        }
      } catch (postSaveError) {
        // The reading IS saved; reminders/trend analysis failing is non-fatal.
        console.error("Post-save BP processing failed", postSaveError);
      }
    } catch (error) {
      console.error("Failed to save BP reading", error);
      showToast({
        type: "error",
        message:
          tier === 1
            ? "Could not save your reading. Check your internet and try again."
            : "Could not save your reading, so your clinic has not seen it. Follow the advice on screen and contact your clinic directly.",
      });
    }

    if (tier === 1 && saved) {
      showToast({
        type: "success",
        message: "Blood pressure logged successfully.",
      });
      router.back();
    }
  };

  const showHelp = (type: "systolic" | "diastolic") => {
    Alert.alert(
      type === "systolic" ? "Systolic Pressure" : "Diastolic Pressure",
      type === "systolic"
        ? "The top number. It measures the force your heart exerts on your artery walls each time it beats. Normal is around 90-120."
        : "The bottom number. It measures the force your heart exerts on your artery walls between beats. Normal is around 60-80.",
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? Theme.colors.darkBg : "#FBF7F2" }}
    >
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#FBF7F2"}>
        <View className="flex-row items-center justify-between px-6 pt-4 mb-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 justify-center items-center"
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color={isDark ? Theme.colors.white : "#0F241C"}
            />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px]">
            Log Blood Pressure
          </Typography>
          <View className="w-7" />
        </View>

        <View className="items-center mb-4">
          <View
            className={
              isDark
                ? "flex-row items-center gap-2 bg-[#020617] py-3 px-5 rounded-[30px] shadow-sm border border-white/10"
                : "flex-row items-center gap-2 bg-white py-3 px-5 rounded-[30px] shadow-sm"
            }
          >
            <Ionicons name="calendar" size={18} color={Theme.colors.primary} />
            <Typography
              variant="h3"
              weight="bold"
              className={
                isDark ? "text-base text-white" : "text-base text-[#0F241C]"
              }
            >
              {formattedDate}
            </Typography>
          </View>
        </View>

        <Typography
          variant="body"
          className={
            isDark
              ? "text-center text-gray-300 mb-10 px-10 leading-6"
              : "text-center text-gray-500 mb-10 px-10 leading-6"
          }
        >
          Enter the numbers exactly as they appear on your machine.
        </Typography>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled
        >
          <View
            className={
              isDark
                ? "bg-[#13251F] rounded-[24px] p-5 mb-4 border border-primary/30"
                : "bg-[#EEF6F2] rounded-[24px] p-5 mb-4 border border-[#BBF7D0]"
            }
          >
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={22} color={Theme.colors.primary} />
              <View className="flex-1 ml-3">
                <Typography variant="h3" weight="bold" className={isDark ? "text-white mb-1" : "text-[#14532D] mb-1"}>
                  Use a real BP monitor
                </Typography>
                <Typography variant="body" className={isDark ? "text-gray-200 leading-5" : "text-[#166534] leading-5"}>
                  Please enter readings from a BP machine. Guessed numbers can make alerts less accurate.
                </Typography>
              </View>
            </View>
          </View>
          {/* Systolic Card */}
          <View
            className={
              isDark
                ? "bg-[#020617] rounded-[40px] p-6 mb-4 shadow-sm border border-white/10"
                : "bg-white rounded-[40px] p-6 mb-4 shadow-sm border border-[#F1F5F9]"
            }
          >
            <View className="flex-row justify-between items-center mb-4">
              <Typography variant="h2" className="text-xl font-black">
                Systolic (Top)
              </Typography>
              <TouchableOpacity
                style={{}}
                className="font-sans"
                onPress={() => showHelp("systolic")}
              >
                <Ionicons
                  name="help-circle"
                  size={24}
                  color={Theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            <View
              className={
                isDark
                  ? "flex-row items-center bg-[#022C22] rounded-[30px] px-6 h-14 mb-3"
                  : "flex-row items-center bg-[#E3F2EC] rounded-[30px] px-6 h-14 mb-3"
              }
            >
              <TextInput
                className={`flex-1 text-[22px] font-bold text-[#0E7C5A]`}
                value={systolic}
                onChangeText={(value) => setSystolic(value.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholderTextColor="#A0AEC0"
                style={{ fontFamily: "Outfit-Bold" }}
              />
              <Typography
                variant="h3"
                weight="bold"
                className="text-[#0E7C5A99]"
              >
                mmHg
              </Typography>
            </View>
            <Typography
              variant="caption"
              className={
                isDark
                  ? "text-gray-400 text-center mt-1"
                  : "text-gray-500 text-center mt-1"
              }
            >
              Normal range is around 90-120
            </Typography>
          </View>

          {/* Diastolic Card */}
          <View
            className={
              isDark
                ? "bg-[#020617] rounded-[40px] p-6 mb-4 shadow-sm border border-white/10"
                : "bg-white rounded-[40px] p-6 mb-4 shadow-sm border border-[#F1F5F9]"
            }
          >
            <View className="flex-row justify-between items-center mb-4">
              <Typography variant="h2" className="text-xl font-black">
                Diastolic (Bottom)
              </Typography>
              <TouchableOpacity onPress={() => showHelp("diastolic")}>
                <Ionicons
                  name="help-circle"
                  size={24}
                  color={Theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            <View
              className={
                isDark
                  ? "flex-row items-center bg-[#022C22] rounded-[30px] px-6 h-14 mb-3"
                  : "flex-row items-center bg-[#E3F2EC] rounded-[30px] px-6 h-14 mb-3"
              }
            >
              <TextInput
                className={`flex-1 text-[22px] font-bold text-[#0E7C5A]`}
                value={diastolic}
                onChangeText={(value) => setDiastolic(value.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholderTextColor="#A0AEC0"
                style={{ fontFamily: "Outfit-Bold" }}
              />
              <Typography
                variant="h3"
                weight="bold"
                className="text-[#0E7C5A99]"
              >
                mmHg
              </Typography>
            </View>
            <Typography
              variant="caption"
              className={
                isDark
                  ? "text-gray-400 text-center mt-1"
                  : "text-gray-500 text-center mt-1"
              }
            >
              Normal range is around 60-80
            </Typography>
          </View>

          {validationError && (systolic || diastolic) ? (
            <Typography variant="caption" className="text-red-500 text-center mb-3">
              {validationError}
            </Typography>
          ) : null}

          <TouchableOpacity
            className={`w-full bg-primary h-14 rounded-[30px] items-center justify-center mt-4 shadow-lg shadow-primary/30 ${validationError ? "opacity-60" : ""}`}
            onPress={handleSave}
            disabled={isAddingBP || Boolean(validationError)}
          >
            <Typography variant="h2" weight="bold" className="text-white">
              {isAddingBP ? "Saving..." : "Save Reading"}
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </Screen>

      {showConfirmation && currentTier && (
        <View
          className="absolute inset-0 z-50 items-center justify-center p-6"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <View
            className="w-full bg-cardDark rounded-3xl p-8 border"
            style={{ borderColor: getTierInfo(currentTier).color }}
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-6 self-center"
              style={{ backgroundColor: `${getTierInfo(currentTier).color}20` }}
            >
              <Ionicons
                name={
                  currentTier === 4
                    ? "alert-circle"
                    : currentTier === 3
                      ? "warning"
                      : "eye"
                }
                size={32}
                color={getTierInfo(currentTier).color}
              />
            </View>

            <Typography variant="h1" className="text-white text-center mb-2">
              {getTierInfo(currentTier).label}
            </Typography>

            <Typography variant="h2" className="text-white text-center mb-6">
              {systolic}/{diastolic} mmHg
            </Typography>

            <Typography
              variant="body"
              className="text-gray-300 text-center mb-10 leading-6"
            >
              {getTierInfo(currentTier).response}
            </Typography>

            <View className="gap-4">
              {getTierInfo(currentTier).actionLabel && (
                <Button
                  title={getTierInfo(currentTier).actionLabel!}
                  onPress={() => {
                    setShowConfirmation(false);
                    router.push(getTierInfo(currentTier).actionRoute as any);
                  }}
                  variant={currentTier === 4 ? "emergency" : "primary"}
                />
              )}

              <Button
                title="Done"
                onPress={() => {
                  setShowConfirmation(false);
                  router.back();
                }}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
