// ═══════════════════════════════════════════════════════════════════════════
// FILE: app/fetal-development.tsx  — Weekly fetal development screen
// Shows current week based on profile.pregnancyWeeks or patient.gestationalAge
// Works fully offline — all content is from constants/fetal-development.ts
// ═══════════════════════════════════════════════════════════════════════════
 
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  getWeekData,
  getTrimesterLabel,
  getWeeksRemaining,
} from "../constants/fetal-development";
 
export default function FetalDevelopmentScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { profile, calculatedPregnancyWeeks } = useUserProfile();
 
  const week = calculatedPregnancyWeeks ?? profile?.pregnancyWeeks ?? 0;
  const data = getWeekData(week);
  const trimesterLabel = getTrimesterLabel(week);
  const weeksRemaining = getWeeksRemaining(week);
 
  const bg = isDark ? Theme.colors.darkBg : "#FBF7F2";
  const cardBg = isDark ? "#0F172A" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#0F241C";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9";
 
  const trimesterColor =
    week <= 12 ? "#10B981" : week <= 27 ? "#3B82F6" : "#8B5CF6";
 
  if (!week || week < 4) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 20, flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={textPrimary} />
          </TouchableOpacity>
          <Typography variant="h3" weight="bold" style={{ marginLeft: 14, color: textPrimary }}>
            Baby Development
          </Typography>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Typography variant="h1" style={{ fontSize: 48, marginBottom: 16 }}>🤰</Typography>
          <Typography variant="h3" weight="bold" style={{ color: textPrimary, textAlign: "center", marginBottom: 8 }}>
            Gestational age not set
          </Typography>
          <Typography variant="body" style={{ color: textMuted, textAlign: "center" }}>
            Your health worker will record your gestational age at your next antenatal visit.
          </Typography>
        </View>
      </SafeAreaView>
    );
  }
 
  if (!data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ padding: 24 }}>
          <Typography variant="body" style={{ color: textMuted }}>
            No development data available for week {week}.
          </Typography>
        </View>
      </SafeAreaView>
    );
  }
 
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
          style={{ marginLeft: 14, color: textPrimary, flex: 1 }}
        >
          Baby Development
        </Typography>
        <View
          style={{
            backgroundColor: `${trimesterColor}20`,
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Typography
            variant="caption"
            weight="bold"
            style={{ color: trimesterColor, fontSize: 11 }}
          >
            {trimesterLabel.toUpperCase()}
          </Typography>
        </View>
      </View>
 
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 24,
            padding: 24,
            marginBottom: 20,
            borderWidth: 1,
            borderColor,
            alignItems: "center",
          }}
        >
          <Typography style={{ fontSize: 64, marginBottom: 12 }}>
            {data.sizeEmoji}
          </Typography>
 
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
            <Typography
              variant="h1"
              weight="bold"
              style={{ fontSize: 48, color: textPrimary, lineHeight: 52 }}
            >
              {week}
            </Typography>
            <Typography variant="body" style={{ color: textMuted, fontSize: 16 }}>
              weeks
            </Typography>
          </View>
 
          <Typography
            variant="body"
            style={{ color: textMuted, marginBottom: 16, fontSize: 14 }}
          >
            {weeksRemaining > 0
              ? `${weeksRemaining} weeks until your estimated due date`
              : "You have reached your estimated due date"}
          </Typography>
 
          {/* Size / weight row */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              width: "100%",
            }}
          >
            {[
              { label: "Size of a", value: data.size },
              { label: "Weight", value: data.weight },
              { label: "Length", value: data.length },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC",
                  borderRadius: 14,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  style={{ color: textMuted, fontSize: 10, marginBottom: 4, textAlign: "center" }}
                >
                  {item.label.toUpperCase()}
                </Typography>
                <Typography
                  variant="body"
                  weight="bold"
                  style={{ color: textPrimary, fontSize: 13, textAlign: "center" }}
                >
                  {item.value}
                </Typography>
              </View>
            ))}
          </View>
        </View>
 
        {/* Headline */}
        <View
          style={{
            backgroundColor: `${trimesterColor}15`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderLeftWidth: 3,
            borderLeftColor: trimesterColor,
          }}
        >
          <Typography
            variant="body"
            style={{ color: textPrimary, fontSize: 15, lineHeight: 22, fontStyle: "italic" }}
          >
            {data.headline}
          </Typography>
        </View>
 
        {/* Baby development */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Typography style={{ fontSize: 20 }}>👶</Typography>
            <Typography variant="h3" weight="bold" style={{ color: textPrimary }}>
              Your Baby This Week
            </Typography>
          </View>
          {data.babyDevelopment.map((point, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: trimesterColor,
                  marginTop: 8,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body"
                style={{ color: textMuted, fontSize: 14, lineHeight: 22, flex: 1 }}
              >
                {point}
              </Typography>
            </View>
          ))}
        </View>
 
        {/* Mother's body */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Typography style={{ fontSize: 20 }}>🤰</Typography>
            <Typography variant="h3" weight="bold" style={{ color: textPrimary }}>
              Your Body This Week
            </Typography>
          </View>
          {data.motherChanges.map((point, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#F472B6",
                  marginTop: 8,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body"
                style={{ color: textMuted, fontSize: 14, lineHeight: 22, flex: 1 }}
              >
                {point}
              </Typography>
            </View>
          ))}
        </View>
 
        {/* Tip of the week */}
        <View
          style={{
            backgroundColor: isDark ? "#0F2A1A" : "#EEF6F2",
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: isDark ? "#166534" : "#BBF7D0",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Typography style={{ fontSize: 18 }}>💡</Typography>
            <Typography
              variant="h3"
              weight="bold"
              style={{ color: isDark ? "#4ADE80" : "#0A5C43" }}
            >
              Tip for Week {week}
            </Typography>
          </View>
          <Typography
            variant="body"
            style={{
              color: isDark ? "#86EFAC" : "#166534",
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {data.tip}
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}