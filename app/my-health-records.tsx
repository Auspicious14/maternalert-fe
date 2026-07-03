import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useHealthData } from "../hooks/useHealthData";
import { useMonitoringData } from "../hooks/useMonitoringData";
import { useUserProfile } from "../hooks/useUserProfile";
 
const BP_COLOR = (sys: number, dia: number) => {
  if (sys >= 160 || dia >= 110) return "#DC2626";
  if (sys >= 140 || dia >= 90) return "#D97706";
  if (sys >= 130 || dia >= 85) return "#F59E0B";
  return "#10B981";
};
 
const BP_LABEL = (sys: number, dia: number) => {
  if (sys >= 160 || dia >= 110) return "Severe";
  if (sys >= 140 || dia >= 90) return "High";
  if (sys >= 130 || dia >= 85) return "Elevated";
  return "Normal";
};
 
const STATE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  NORMAL:    { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  MONITOR:   { bg: "#FEFCE8", text: "#A16207", border: "#FDE68A" },
  URGENT:    { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  EMERGENCY: { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
};
 
export default function MyHealthRecordsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { profile } = useUserProfile();
  const { bpHistory, recentSymptoms, isLoadingLatestBP } = useHealthData();
  const { monitoringState } = useMonitoringData();
 
  const bg = isDark ? Theme.colors.darkBg : "#F9FAFB";
  const cardBg = isDark ? "#0F172A" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#1A212E";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9";
 
  const state = monitoringState?.state ?? "NORMAL";
  const stateColors = STATE_COLORS[state] ?? STATE_COLORS.NORMAL;
 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={textPrimary} />
        </TouchableOpacity>
        <Typography
          variant="h3"
          weight="bold"
          style={{ marginLeft: 14, color: textPrimary }}
        >
          My Health Records
        </Typography>
      </View>
 
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current monitoring state */}
        <View
          style={{
            backgroundColor: stateColors.bg,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: stateColors.border,
          }}
        >
          <Typography
            variant="caption"
            style={{
              color: stateColors.text,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            CURRENT STATUS
          </Typography>
          <Typography
            variant="h2"
            weight="bold"
            style={{ color: stateColors.text, marginBottom: 4 }}
          >
            {state === "NORMAL"
              ? "All is well"
              : state === "MONITOR"
              ? "Being monitored"
              : state === "URGENT"
              ? "Needs attention"
              : "Emergency — seek care now"}
          </Typography>
          {monitoringState?.reason && (
            <Typography variant="body" style={{ color: stateColors.text, fontSize: 13 }}>
              {monitoringState.reason}
            </Typography>
          )}
          {monitoringState?.lastUpdatedAt && (
            <Typography
              variant="caption"
              style={{ color: stateColors.text, fontSize: 11, marginTop: 8, opacity: 0.7 }}
            >
              Last updated{" "}
              {new Date(monitoringState.lastUpdatedAt).toLocaleString("en-NG")}
            </Typography>
          )}
        </View>
 
        {/* Facility info */}
        {profile?.clinicName && (
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor,
            }}
          >
            <Typography
              variant="caption"
              style={{
                color: textMuted,
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              YOUR HEALTH FACILITY
            </Typography>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="medical" size={20} color={textMuted} />
              </View>
              <View>
                <Typography
                  variant="h3"
                  weight="bold"
                  style={{ color: textPrimary, fontSize: 15 }}
                >
                  {profile.clinicName}
                </Typography>
                {profile.clinicAddress && (
                  <Typography variant="caption" style={{ color: textMuted }}>
                    {profile.clinicAddress}
                  </Typography>
                )}
              </View>
            </View>
          </View>
        )}
 
        {/* Blood pressure readings */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor,
          }}
        >
          <Typography
            variant="caption"
            style={{
              color: textMuted,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1,
              marginBottom: 14,
            }}
          >
            BLOOD PRESSURE HISTORY
          </Typography>
 
          {isLoadingLatestBP ? (
            <ActivityIndicator color={textMuted} />
          ) : !bpHistory || bpHistory.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 24 }}>
              <Typography style={{ fontSize: 32, marginBottom: 8 }}>📊</Typography>
              <Typography variant="body" style={{ color: textMuted, textAlign: "center" }}>
                No readings recorded yet.
              </Typography>
              <Typography
                variant="caption"
                style={{ color: textMuted, textAlign: "center", marginTop: 4, fontSize: 12 }}
              >
                Your health worker will record your blood pressure at each antenatal visit.
              </Typography>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {bpHistory.map((reading: any, i: number) => {
                const color = BP_COLOR(reading.systolic, reading.diastolic);
                const label = BP_LABEL(reading.systolic, reading.diastolic);
                const isLatest = i === 0;
 
                return (
                  <View
                    key={reading.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.04)"
                        : isLatest
                        ? "#F8FAFC"
                        : "transparent",
                      borderRadius: 14,
                      padding: 14,
                      borderWidth: isLatest ? 1 : 0,
                      borderColor: isLatest ? borderColor : "transparent",
                    }}
                  >
                    <View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Typography
                          variant="h3"
                          weight="bold"
                          style={{ color, fontSize: 20, fontFamily: "monospace" }}
                        >
                          {reading.systolic}/{reading.diastolic}
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{ color: textMuted, fontSize: 11 }}
                        >
                          mmHg
                        </Typography>
                      </View>
                      <Typography
                        variant="caption"
                        style={{ color: textMuted, fontSize: 12, marginTop: 2 }}
                      >
                        {new Date(reading.recordedAt).toLocaleDateString("en-NG", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 4 }}>
                      <View
                        style={{
                          backgroundColor: `${color}20`,
                          borderRadius: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                        }}
                      >
                        <Typography
                          variant="caption"
                          weight="bold"
                          style={{ color, fontSize: 11 }}
                        >
                          {label}
                        </Typography>
                      </View>
                      {isLatest && (
                        <Typography
                          variant="caption"
                          style={{ color: textMuted, fontSize: 10 }}
                        >
                          Latest
                        </Typography>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
 
        {/* Recent symptoms */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor,
          }}
        >
          <Typography
            variant="caption"
            style={{
              color: textMuted,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1,
              marginBottom: 14,
            }}
          >
            SYMPTOMS YOU REPORTED
          </Typography>
 
          {!recentSymptoms || recentSymptoms.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Typography style={{ fontSize: 28, marginBottom: 8 }}>✅</Typography>
              <Typography variant="body" style={{ color: textMuted, textAlign: "center" }}>
                No symptoms reported recently.
              </Typography>
            </View>
          ) : (
            <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 8 }}>
              {recentSymptoms.map((symptom: any) => (
                <View
                  key={symptom.id}
                  style={{
                    backgroundColor: isDark ? "rgba(251,191,36,0.1)" : "#FFFBEB",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: isDark ? "rgba(251,191,36,0.2)" : "#FDE68A",
                  }}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{ color: "#D97706", fontSize: 12 }}
                  >
                    {symptom.symptomType === "OTHER" && symptom.customSymptom
                      ? symptom.customSymptom
                      : symptom.symptomType.replace(/_/g, " ")}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{ color: textMuted, fontSize: 10, marginTop: 2 }}
                  >
                    {new Date(symptom.recordedAt).toLocaleDateString("en-NG")}
                  </Typography>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}