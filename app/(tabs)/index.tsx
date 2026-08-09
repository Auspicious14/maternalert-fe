import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { memo, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { Typography } from "../../components/shared/Typography";
import { Skeleton } from "../../components/ui/Skeleton";
import Theme from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

import {
  BloodPressure,
  Symptom,
  useHealthData,
} from "../../hooks/useHealthData";
import {
  FollowUpTaskResponse,
  useMonitoringData,
} from "../../hooks/useMonitoringData";
import { useNotifications } from "../../hooks/useNotifications";
import { useUserProfile } from "../../hooks/useUserProfile";
import { getPersonalizedGuidance } from "../../services/personalization";
import axios from "axios";
import apiClient from "@/api/client";

// const API = process.env.EXPO_PUBLIC_API_URL ?? "";

// ─── FLOATING EMERGENCY BUTTON ────────────────────────────────────────────────
// Rendered outside <Screen> so it stays fixed above the tab bar while the
// content scrolls underneath it.

function FloatingEmergencyButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [triggered, setTriggered] = useState(false);

  async function handleConfirm() {
    setTriggering(true);
    try {
      const res = await apiClient.post("/emergency/trigger");

      if (res.status !== 201) throw new Error("Server error");
      setTriggered(true);
    } catch {
      Alert.alert(
        "Could not send alert",
        "Check your internet connection and try again. If urgent, call your health facility directly.",
        [{ text: "OK" }],
      );
      setModalVisible(false);
    } finally {
      setTriggering(false);
    }
  }

  function handleClose() {
    setModalVisible(false);
    // Reset after modal animation completes
    setTimeout(() => setTriggered(false), 300);
  }

  return (
    <>
      {/* Floating button — sits above tab bar */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
        style={{
          position: "absolute",
          bottom: 96, // above tab bar (~56px) + breathing room
          right: 20,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: "#DC2626",
          alignItems: "center",
          justifyContent: "center",
          // Shadow
          shadowColor: "#DC2626",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45,
          shadowRadius: 10,
          elevation: 10,
          zIndex: 100,
        }}
      >
        <Ionicons name="warning" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Confirmation / Success Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 28,
              width: "100%",
              alignItems: "center",
            }}
          >
            {triggered ? (
              // ── SUCCESS STATE ──
              <>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: "#DCFCE7",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={44} color="#16A34A" />
                </View>
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{ textAlign: "center", marginBottom: 8 }}
                >
                  Alert Sent
                </Typography>
                <Typography
                  variant="body"
                  style={{
                    color: "#64748B",
                    textAlign: "center",
                    lineHeight: 22,
                    marginBottom: 24,
                  }}
                >
                  Your emergency contact and health facility have been notified
                  via WhatsApp and SMS. Stay calm — help is coming.
                </Typography>
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    backgroundColor: "#16A34A",
                    borderRadius: 14,
                    paddingVertical: 14,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body"
                    weight="bold"
                    style={{ color: "#fff" }}
                  >
                    OK
                  </Typography>
                </TouchableOpacity>
              </>
            ) : (
              // ── CONFIRMATION STATE ──
              <>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "#FEE2E2",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="warning" size={34} color="#DC2626" />
                </View>
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{ textAlign: "center", marginBottom: 8 }}
                >
                  Send Emergency Alert?
                </Typography>
                <Typography
                  variant="body"
                  style={{
                    color: "#64748B",
                    textAlign: "center",
                    lineHeight: 22,
                    marginBottom: 24,
                  }}
                >
                  This will immediately notify your emergency contact and health
                  facility. Only use this in a real emergency.
                </Typography>

                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={triggering}
                  style={{
                    backgroundColor: "#DC2626",
                    borderRadius: 14,
                    paddingVertical: 15,
                    width: "100%",
                    alignItems: "center",
                    marginBottom: 10,
                    opacity: triggering ? 0.7 : 1,
                  }}
                >
                  {triggering ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Typography
                      variant="h3"
                      weight="bold"
                      style={{ color: "#fff" }}
                    >
                      Yes, Send Alert Now
                    </Typography>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleClose}
                  disabled={triggering}
                  style={{
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    borderRadius: 14,
                    paddingVertical: 13,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body" style={{ color: "#64748B" }}>
                    Cancel
                  </Typography>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

// ─── EXISTING COMPONENTS (unchanged) ─────────────────────────────────────────

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
          {symptom.symptomType === "OTHER" && symptom.customSymptom
            ? symptom.customSymptom
            : symptom.symptomType.replace(/_/g, " ")}
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

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {
    monitoringState,
    followUpTasks,
    isLoadingMonitoringState,
    isLoadingFollowUpTasks,
  } = useMonitoringData();
  const {
    latestBP,
    recentSymptoms,
    isLoadingLatestBP,
    isLoadingRecentSymptoms,
  } = useHealthData();
  const { profile, calculatedPregnancyWeeks } = useUserProfile();
  const { unreadCount } = useNotifications();

  const statusColors = useMemo(() => {
    switch (monitoringState?.currentState) {
      case "EMERGENCY":
        return Theme.colors.redGradient;
      case "URGENT":
        return Theme.colors.orangeGradient;
      case "MONITOR":
        return Theme.colors.yellowGradient;
      default:
        return Theme.colors.greenGradient;
    }
  }, [monitoringState?.currentState]);

  const statusLabel = useMemo(() => {
    switch (monitoringState?.currentState) {
      case "EMERGENCY":
        return "EMERGENCY";
      case "URGENT":
        return "URGENT ATTENTION";
      case "MONITOR":
        return "INCREASED MONITORING";
      default:
        return "NORMAL";
    }
  }, [monitoringState?.currentState]);

  const statusMessage = useMemo(
    () => monitoringState?.reason || "All readings are within normal range.",
    [monitoringState?.reason],
  );

  const nextActionMessage = useMemo(
    () => monitoringState?.nextAction || "Continue routine monitoring.",
    [monitoringState?.nextAction],
  );

  const personalizedGuidance = useMemo(
    () => getPersonalizedGuidance(recentSymptoms || []),
    [recentSymptoms],
  );

  return (
    // Wrapper View needed so the floating button can be positioned absolutely
    // relative to this container rather than relative to the scroll view
    <View style={{ flex: 1 }}>
      <Screen
        className="pt-6"
        scrollable
        backgroundColor={isDark ? Theme.colors.darkBg : Theme.colors.background}
      >
        {/* ── Header ── */}
        <View className="flex-row items-center justify-between px-6 mb-6">
          <View>
            <Typography
              variant="h2"
              className={`${isDark ? "text-white" : "text-text"} text-xl`}
            >
              Priority Dashboard
            </Typography>
            {calculatedPregnancyWeeks && (
              <Typography
                variant="body"
                className={`${isDark ? "text-white/70" : "text-gray-500"} mt-1`}
              >
                Week {calculatedPregnancyWeeks} of pregnancy
              </Typography>
            )}
          </View>
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
                  className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-accent border-2 ${isDark ? "border-[#020617]" : "border-white"}`}
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
          {/* ── Status Card ── */}
          <StatusCard
            priorityData={{
              priority: monitoringState?.currentState,
              message: statusMessage,
              nextAction: nextActionMessage,
            }}
            statusColors={statusColors}
            statusLabel={statusLabel}
            isLoading={isLoadingMonitoringState}
            isDark={isDark}
            onPress={() => {
              if (monitoringState?.currentState === "EMERGENCY") {
                router.push("/emergency");
              } else if (monitoringState?.currentState === "URGENT") {
                router.push("/symptom-results");
              } else if (
                followUpTasks &&
                followUpTasks.some((task) => task.type === "RECHECK")
              ) {
                router.push("/bp-entry");
              }
            }}
          />

          {/* ── Follow-up Task Card ── */}
          {isLoadingFollowUpTasks ? (
            <Skeleton
              height={100}
              borderRadius={28}
              style={{ marginBottom: 24 }}
              variant={isDark ? "dark" : "light"}
            />
          ) : (
            followUpTasks &&
            followUpTasks.length > 0 && (
              <Card
                className={`${isDark ? "bg-card-dark border-white/10" : "bg-white border-gray-100"} border p-6 mb-6 rounded-[24px]`}
              >
                <Typography
                  variant="h3"
                  weight="bold"
                  className={`${isDark ? "text-white" : "text-text"} text-lg mb-2`}
                >
                  Action Required
                </Typography>
                {followUpTasks.map((task: FollowUpTaskResponse) => (
                  <View
                    key={task.id}
                    className="flex-row items-center justify-between mb-2"
                  >
                    <View className="flex-1">
                      <Typography
                        variant="body"
                        className={`${isDark ? "text-white" : "text-text"}`}
                      >
                        {task.type === "RECHECK"
                          ? "Recheck your blood pressure"
                          : "Seek medical care"}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={`${isDark ? "text-white/50" : "text-gray-500"}`}
                      >
                        Due:{" "}
                        {new Date(task.dueAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </View>
                    <TouchableOpacity
                      className="bg-primary px-4 py-2 rounded-full"
                      onPress={() => {
                        if (task.type === "RECHECK") {
                          router.push("/bp-entry");
                        } else {
                          router.push("/clinic-finder");
                        }
                      }}
                    >
                      <Typography variant="caption" weight="bold">
                        {task.type === "RECHECK" ? "Log BP" : "Find Clinic"}
                      </Typography>
                    </TouchableOpacity>
                  </View>
                ))}
              </Card>
            )
          )}

          {/* ── Stats Row ── */}
          <StatsCard
            latestBP={latestBP}
            isLoading={isLoadingLatestBP}
            isDark={isDark}
          />

          {/* ── Quick Actions ── */}
          <View className="gap-3 mb-6">
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-primary h-12 rounded-full flex-row items-center justify-center gap-2 shadow-sm"
                onPress={() => router.push("/bp-entry")}
              >
                <Ionicons name="add" size={20} color="#1A1512" />
                <Typography
                  variant="h3"
                  weight="bold"
                  className="text-[#1A1512]"
                >
                  Add BP
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 border ${isDark ? "border-white/10" : "border-gray-200"} bg-transparent h-12 rounded-full flex-row items-center justify-center gap-2`}
                onPress={() => router.push("/appointments")}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={Theme.colors.accent}
                />
                <Typography variant="h3" weight="bold" className="text-accent">
                  Appointments
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

          {/* ── Personalized Guidance ── */}
          <TouchableOpacity
            className={`${isDark ? "bg-card-dark border-white/10" : "bg-white border-gray-100"} p-4 rounded-[24px] flex-row items-center mb-6 border shadow-lexend-medium`}
            onPress={() => router.push(personalizedGuidance.route as any)}
          >
            <View
              className={`w-11 h-11 rounded-full justify-center items-center mr-4 ${personalizedGuidance.tone === "urgent" ? "bg-emergency" : "bg-primary-light"}`}
            >
              <Ionicons
                name={
                  personalizedGuidance.tone === "urgent"
                    ? "alert-circle"
                    : "heart"
                }
                size={20}
                color={
                  personalizedGuidance.tone === "urgent"
                    ? "white"
                    : Theme.colors.primary
                }
              />
            </View>
            <View className="flex-1">
              <Typography
                variant="h3"
                weight="bold"
                className={`${isDark ? "text-white" : "text-text"} text-base`}
              >
                {personalizedGuidance.title}
              </Typography>
              <Typography
                variant="caption"
                className={`${isDark ? "text-white/50" : "text-gray-500"} leading-5`}
              >
                {personalizedGuidance.message}
              </Typography>
            </View>
            <Typography
              variant="caption"
              weight="bold"
              className="text-primary ml-3"
            >
              {personalizedGuidance.actionLabel}
            </Typography>
          </TouchableOpacity>

          {/* ── "Feeling unwell?" banner ──
               Kept but label updated to clarify the float button also exists.
               Remove this if you feel it's redundant with the floating button. ── */}
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
                Tap for full emergency screen
              </Typography>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Theme.colors.emergency}
            />
          </TouchableOpacity>

          {/* ── Recent Activity ── */}
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
              <ActivityItem
                key={symptom.id}
                symptom={symptom}
                isDark={isDark}
              />
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

      {/* ── Floating Emergency Button ──
           Lives outside <Screen> so it stays fixed while content scrolls ── */}
      <FloatingEmergencyButton />
    </View>
  );
}
