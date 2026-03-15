import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { Typography } from "../../components/shared/Typography";
import Theme from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { useHealthData } from "../../hooks/useHealthData";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function TrackingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { bpHistory, recentSymptoms } = useHealthData();
  const { profile, calculatedPregnancyWeeks } = useUserProfile();

  const currentWeeks =
    calculatedPregnancyWeeks || profile?.pregnancyWeeks || 24;

  const textColor = isDark ? "#FFFFFF" : "#1A212E";
  const subTextColor = isDark ? "rgba(255,255,255,0.6)" : "#64748B";
  const bgColor = isDark ? Theme.colors.darkBg : Theme.colors.background;
  const cardBg = isDark ? Theme.colors.cardDark : "#FFFFFF";
  const borderColor = isDark ? Theme.colors.borderDark : "#E2E8F0";

  // Calculate average BP
  const avgBP = useMemo(() => {
    if (!bpHistory || bpHistory.length === 0) return null;
    const sysSum = bpHistory.reduce((acc, curr) => acc + curr.systolic, 0);
    const diaSum = bpHistory.reduce((acc, curr) => acc + curr.diastolic, 0);
    return {
      systolic: Math.round(sysSum / bpHistory.length),
      diastolic: Math.round(diaSum / bpHistory.length),
    };
  }, [bpHistory]);

  // Generate current week days
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Calculate offset to get to Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);

      const isToday = date.toDateString() === today.toDateString();
      const dayName = date.toLocaleDateString("en-US", { weekday: "narrow" }); // M, T, W...

      days.push({
        day: dayName,
        date: date.getDate().toString(),
        current: isToday,
        status: isToday ? "stable" : "none", // Simple logic for now
      });
    }
    return days;
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <Screen style={styles.container} backgroundColor={bgColor}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1" style={[styles.title, { color: textColor }]}>
            Health Tracking
          </Typography>
          <TouchableOpacity style={[styles.calendarButton, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={isDark ? "#FFFFFF" : "#1A212E"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Summary Banner */}
          <Card style={[styles.summaryCard, { backgroundColor: cardBg, borderColor: borderColor }]}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryInfo}>
                <Typography variant="h3" style={[styles.summaryTitle, { color: textColor }]}>
                  {currentWeeks} Weeks Pregnant
                </Typography>
                <Typography variant="caption" style={[styles.summarySubtitle, { color: subTextColor }]}>
                  {profile?.firstPregnancy
                    ? "First Pregnancy"
                    : "Healthy Progress"}
                </Typography>
              </View>
              <View style={styles.babyIconBg}>
                <Ionicons
                  name="fitness"
                  size={24}
                  color={Theme.colors.primary}
                />
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(currentWeeks / 40) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Typography variant="caption" style={[styles.progressText, { color: subTextColor }]}>
                {Math.round((currentWeeks / 40) * 100)}% complete
              </Typography>
            </View>
          </Card>

          {/* Calendar Strip */}
          <View style={styles.calendarStrip}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.dayItem}>
                <Typography variant="caption" style={[styles.dayLabel, { color: isDark ? "rgba(255,255,255,0.4)" : "#94A3B8" }]}>
                  {item.day}
                </Typography>
                <View
                  style={[
                    styles.dateCircle,
                    { borderColor: isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0" },
                    item.current && styles.dateCircleActive,
                    item.status === "stable" && styles.dateCircleStable,
                    item.status === "urgent" && styles.dateCircleUrgent,
                  ]}
                >
                  <Typography
                    variant="body"
                    style={[
                      styles.dateText,
                      { color: isDark ? "rgba(255,255,255,0.4)" : "#64748B" },
                      (item.current || item.status !== "none") &&
                        { color: isDark ? "#FFFFFF" : "#1A212E" },
                      item.current && { color: "#FFFFFF" }
                    ]}
                  >
                    {item.date}
                  </Typography>
                </View>
                {item.current && <View style={styles.activeDot} />}
              </View>
            ))}
          </View>

          {/* Vitals Section */}
          <View style={styles.sectionHeader}>
            <Typography variant="h2" style={[styles.sectionTitle, { color: textColor }]}>
              Vitals Overview
            </Typography>
          </View>

          <View style={styles.vitalsRow}>
            <Card style={[styles.vitalCard, { backgroundColor: cardBg, borderColor: borderColor }]}>
              <View
                style={[
                  styles.vitalIcon,
                  { backgroundColor: "rgba(45, 228, 116, 0.1)" },
                ]}
              >
                <Ionicons name="pulse" size={20} color={Theme.colors.primary} />
              </View>
              <Typography variant="h2" style={[styles.vitalValue, { color: textColor }]}>
                {avgBP ? `${avgBP.systolic}/${avgBP.diastolic}` : "--/--"}
              </Typography>
              <Typography variant="caption" style={[styles.vitalLabel, { color: subTextColor }]}>
                Avg. Blood Pressure
              </Typography>
            </Card>
          </View>

          {/* Logs */}
          <View style={styles.sectionHeader}>
            <Typography variant="h2" style={[styles.sectionTitle, { color: textColor }]}>
              Daily Logs
            </Typography>
          </View>

          <Card style={[styles.logItem, { backgroundColor: cardBg, borderColor: borderColor }]}>
            <View style={[styles.logIcon, { backgroundColor: "#FF4B4B" }]}>
              <Ionicons name="sad" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.logInfo}>
              <Typography variant="h3" style={[styles.logTitle, { color: textColor }]}>
                Symptoms
              </Typography>
              <Typography variant="caption" style={[styles.logSubtitle, { color: subTextColor }]}>
                {recentSymptoms?.length || 0} signs reported recently
              </Typography>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
            />
          </Card>
        </ScrollView>

        {/* FAB Refined */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.9}
          onPress={() => router.push("/bp-entry")}
        >
          <Ionicons name="add" size={32} color={isDark ? Theme.colors.darkBg : "#FFFFFF"} />
        </TouchableOpacity>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.xl,
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: 100,
  },
  summaryCard: {
    borderWidth: 1,
    padding: 24,
    borderRadius: 32,
    marginBottom: 40,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  summarySubtitle: {
  },
  babyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(45, 228, 116, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    textAlign: "right",
  },
  calendarStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  dayItem: {
    alignItems: "center",
    gap: 8,
  },
  dayLabel: {
    textTransform: "uppercase",
    fontSize: 12,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  dateCircleActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dateCircleStable: {
    borderColor: Theme.colors.primary,
    backgroundColor: "rgba(45, 228, 116, 0.1)",
  },
  dateCircleUrgent: {
    borderColor: Theme.colors.emergency,
    backgroundColor: "rgba(255, 75, 75, 0.1)",
  },
  dateText: {
    fontWeight: "600",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
  },
  vitalsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  vitalCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
  },
  vitalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  vitalValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  vitalLabel: {
    fontSize: 12,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
  },
  logIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  logSubtitle: {
  },
  fab: {
    position: "absolute",
    bottom: 110,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
  },
});
