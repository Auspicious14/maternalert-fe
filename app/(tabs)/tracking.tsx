import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { Typography } from "../../components/shared/Typography";
import Theme from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { useHealthData } from "../../hooks/useHealthData";
import { useTrends } from "../../hooks/useTrends";
import { useUserProfile } from "../../hooks/useUserProfile";
import {
  getActivitySuggestion,
  getNutritionReminder,
  getPregnancyMilestone,
} from "../../services/pregnancyContent";
import { notificationService } from "../../services/notifications";

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCard = memo(
  ({
    currentWeeks,
    trimesterLabel,
    progressLabel,
    weeksRemaining,
    edd,
    firstPregnancy,
    isDark,
    cardBg,
    borderColor,
    subTextColor,
    textColor,
  }: any) => (
    <Card
      style={[
        styles.summaryCard,
        { backgroundColor: cardBg, borderColor: borderColor },
      ]}
    >
      <View style={styles.summaryHeader}>
        <View style={styles.summaryInfo}>
          <Typography
            variant="h3"
            style={[styles.summaryTitle, { color: textColor }]}
          >
            {progressLabel || `${currentWeeks} Weeks Pregnant`}
          </Typography>
          <Typography
            variant="caption"
            style={[styles.summarySubtitle, { color: Theme.colors.primary }]}
          >
            {trimesterLabel}
          </Typography>
          {weeksRemaining !== undefined && weeksRemaining > 0 && (
            <Typography
              variant="caption"
              style={[styles.summarySubtitle, { color: subTextColor }]}
            >
              {weeksRemaining} week{weeksRemaining !== 1 ? "s" : ""} to
              estimated due date
            </Typography>
          )}
          {edd && (
            <Typography
              variant="caption"
              style={[
                styles.summarySubtitle,
                { color: subTextColor, marginTop: 2 },
              ]}
            >
              EDD:{" "}
              {new Date(edd).toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          )}
        </View>
        <View style={styles.babyIconBg}>
          <Ionicons name="fitness" size={24} color={Theme.colors.primary} />
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, (currentWeeks / 40) * 100)}%`,
              },
            ]}
          />
        </View>
        <Typography
          variant="caption"
          style={[styles.progressText, { color: subTextColor }]}
        >
          {Math.round(Math.min(100, (currentWeeks / 40) * 100))}% of 40 weeks
        </Typography>
      </View>
    </Card>
  ),
);

// ─── Calendar Day ─────────────────────────────────────────────────────────────

const CalendarDay = memo(({ item, isDark }: any) => (
  <View style={styles.dayItem}>
    <Typography
      variant="caption"
      style={[
        styles.dayLabel,
        { color: isDark ? "rgba(255,255,255,0.4)" : "#94A3B8" },
      ]}
    >
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
          (item.current || item.status !== "none") && {
            color: isDark ? "#FFFFFF" : "#1A212E",
          },
          item.current && { color: "#FFFFFF" },
        ]}
      >
        {item.date}
      </Typography>
    </View>
    {item.current && <View style={styles.activeDot} />}
  </View>
));

// ─── Vitals Card ──────────────────────────────────────────────────────────────

const VitalsCard = memo(
  ({ avgBP, cardBg, borderColor, textColor, subTextColor }: any) => (
    <Card
      style={[
        styles.vitalCard,
        { backgroundColor: cardBg, borderColor: borderColor },
      ]}
    >
      <View
        style={[
          styles.vitalIcon,
          { backgroundColor: "rgba(45, 228, 116, 0.1)" },
        ]}
      >
        <Ionicons name="pulse" size={20} color={Theme.colors.primary} />
      </View>
      <Typography
        variant="h2"
        style={[styles.vitalValue, { color: textColor }]}
      >
        {avgBP ? `${avgBP.systolic}/${avgBP.diastolic}` : "--/--"}
      </Typography>
      <Typography
        variant="caption"
        style={[styles.vitalLabel, { color: subTextColor }]}
      >
        Avg. Blood Pressure
      </Typography>
    </Card>
  ),
);

// ─── Pregnancy Content Card ───────────────────────────────────────────────────

const PregnancyContentCard = memo(
  ({
    icon,
    iconBg,
    iconColor,
    title,
    items,
    cardBg,
    borderColor,
    textColor,
    subTextColor,
  }: any) => (
    <Card
      style={[
        styles.contentCard,
        { backgroundColor: cardBg, borderColor: borderColor },
      ]}
    >
      <View style={styles.contentCardHeader}>
        <View style={[styles.contentCardIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Typography
          variant="h3"
          style={[styles.contentCardTitle, { color: textColor }]}
        >
          {title}
        </Typography>
      </View>
      {items.map((item: string, index: number) => (
        <View key={index} style={styles.contentBullet}>
          <View style={[styles.bulletDot, { backgroundColor: iconColor }]} />
          <Typography
            variant="caption"
            style={[styles.bulletText, { color: subTextColor }]}
          >
            {item}
          </Typography>
        </View>
      ))}
    </Card>
  ),
);

// ─── Tracking Screen ──────────────────────────────────────────────────────────

export default function TrackingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { bpHistory, recentSymptoms } = useHealthData();
  const { profile, pregnancyTimeline } = useUserProfile();
  const { trendAlerts } = useTrends();

  const currentWeeks =
    pregnancyTimeline?.currentWeek ?? profile?.pregnancyWeeks ?? 24;
  const trimesterLabel =
    pregnancyTimeline?.trimesterLabel ?? "Second Trimester";
  const progressLabel =
    pregnancyTimeline?.progressLabel ?? `${currentWeeks} weeks pregnant`;
  const trimester = pregnancyTimeline?.trimester ?? 2;

  const textColor = isDark ? "#FFFFFF" : "#1A212E";
  const subTextColor = isDark ? "rgba(255,255,255,0.6)" : "#64748B";
  const bgColor = isDark ? Theme.colors.darkBg : Theme.colors.background;
  const cardBg = isDark ? Theme.colors.cardDark : "#FFFFFF";
  const borderColor = isDark ? Theme.colors.borderDark : "#E2E8F0";

  // Pregnancy content for this week
  const nutrition = useMemo(
    () => getNutritionReminder(currentWeeks, trimester),
    [currentWeeks, trimester],
  );

  const activitySuggestion = useMemo(
    () => getActivitySuggestion(currentWeeks, trimester),
    [currentWeeks, trimester],
  );

  const milestone = useMemo(
    () => getPregnancyMilestone(currentWeeks),
    [currentWeeks],
  );

  // Schedule pregnancy notifications when screen mounts / week changes
  useEffect(() => {
    if (!pregnancyTimeline?.isValid || !profile) return;

    const [reminderHour, reminderMinute] = (profile.reminderTime || "09:00")
      .split(":")
      .map(Number);

    const topActivity = activitySuggestion.activities[0];

    notificationService
      .schedulePregnancyNotifications({
        currentWeek: currentWeeks,
        trimester,
        milestoneTitle: milestone.title,
        milestoneMsg: milestone.message,
        nutritionTitle: nutrition.title,
        nutritionTip: nutrition.tips[0] || "",
        activityName: topActivity?.name || "Gentle walk",
        activityDesc:
          topActivity?.description || "A short walk to stay active.",
        reminderHour: isNaN(reminderHour) ? 9 : reminderHour,
        reminderMinute: isNaN(reminderMinute) ? 0 : reminderMinute,
        notifyReminders: profile.notifyReminders !== false,
      })
      .catch(console.error);
  }, [currentWeeks]);

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
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);

      const isToday = date.toDateString() === today.toDateString();
      const dayName = date.toLocaleDateString("en-US", { weekday: "narrow" });

      days.push({
        day: dayName,
        date: date.getDate().toString(),
        current: isToday,
        status: isToday ? "stable" : "none",
      });
    }
    return days;
  }, []);

  return (
    <Screen
      style={styles.container}
      backgroundColor={bgColor}
      scrollable={true}
    >
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1" style={[styles.title, { color: textColor }]}>
          Health Tracking
        </Typography>
        <TouchableOpacity
          style={[
            styles.calendarButton,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={24}
            color={isDark ? "#FFFFFF" : "#1A212E"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scrollContent}>
        {/* Pregnancy Summary */}
        <SummaryCard
          currentWeeks={currentWeeks}
          trimesterLabel={trimesterLabel}
          progressLabel={progressLabel}
          weeksRemaining={pregnancyTimeline?.weeksRemaining}
          edd={pregnancyTimeline?.estimatedDueDate}
          firstPregnancy={profile?.firstPregnancy}
          isDark={isDark}
          cardBg={cardBg}
          borderColor={borderColor}
          subTextColor={subTextColor}
          textColor={textColor}
        />

        {/* Weekly Calendar Strip */}
        <View style={styles.calendarStrip}>
          {weekDays.map((item, index) => (
            <CalendarDay key={index} item={item} isDark={isDark} />
          ))}
        </View>

        {/* Milestone Banner */}
        <Card
          style={[
            styles.milestoneCard,
            {
              backgroundColor: isDark ? "rgba(45,228,116,0.08)" : "#F0FFF6",
              borderColor: Theme.colors.primary,
            },
          ]}
        >
          <View style={styles.milestoneRow}>
            <Typography style={styles.milestoneEmoji}>
              {milestone.emoji}
            </Typography>
            <View style={{ flex: 1 }}>
              <Typography
                variant="h3"
                style={[styles.milestoneTitle, { color: textColor }]}
              >
                {milestone.title}
              </Typography>
              <Typography
                variant="caption"
                style={{ color: subTextColor, lineHeight: 18 }}
              >
                {milestone.message}
              </Typography>
            </View>
          </View>
        </Card>

        {/* Vitals Section */}
        <View style={styles.sectionHeader}>
          <Typography
            variant="h2"
            style={[styles.sectionTitle, { color: textColor }]}
          >
            Vitals Overview
          </Typography>
        </View>

        <View style={styles.vitalsRow}>
          <VitalsCard
            avgBP={avgBP}
            cardBg={cardBg}
            borderColor={borderColor}
            textColor={textColor}
            subTextColor={subTextColor}
          />
        </View>

        {/* Nutrition Reminder */}
        <View style={styles.sectionHeader}>
          <Typography
            variant="h2"
            style={[styles.sectionTitle, { color: textColor }]}
          >
            Nutrition This Week
          </Typography>
        </View>

        <PregnancyContentCard
          icon="nutrition"
          iconBg={isDark ? "rgba(45,228,116,0.12)" : "#F0FFF6"}
          iconColor={Theme.colors.primary}
          title={nutrition.title}
          items={nutrition.tips}
          cardBg={cardBg}
          borderColor={borderColor}
          textColor={textColor}
          subTextColor={subTextColor}
        />

        <Typography
          variant="caption"
          style={[
            styles.safetyNote,
            { color: isDark ? "rgba(255,255,255,0.35)" : "#94A3B8" },
          ]}
        >
          Food guidance is general advice. Follow your health worker's
          recommendations.
        </Typography>

        {/* Daily Activity */}
        <View style={styles.sectionHeader}>
          <Typography
            variant="h2"
            style={[styles.sectionTitle, { color: textColor }]}
          >
            Today's Activity
          </Typography>
        </View>

        <Card
          style={[
            styles.activityCard,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <View style={styles.activityHeader}>
            <View
              style={[
                styles.activityIcon,
                {
                  backgroundColor: isDark ? "rgba(99,102,241,0.15)" : "#EEF2FF",
                },
              ]}
            >
              <Ionicons name="walk" size={20} color="#6366F1" />
            </View>
            <Typography
              variant="h3"
              style={[styles.activityTitle, { color: textColor }]}
            >
              {activitySuggestion.title}
            </Typography>
          </View>
          <Typography
            variant="caption"
            style={[{ color: subTextColor, marginBottom: 12, lineHeight: 18 }]}
          >
            {activitySuggestion.message}
          </Typography>
          {activitySuggestion.activities.slice(0, 3).map((act, i) => (
            <View key={i} style={styles.activityItem}>
              <Typography style={styles.activityEmoji}>{act.emoji}</Typography>
              <View style={{ flex: 1 }}>
                <Typography
                  variant="body"
                  style={{ color: textColor, fontWeight: "600" }}
                >
                  {act.name}
                  <Typography variant="caption" style={{ color: subTextColor }}>
                    {" "}
                    · {act.duration}
                  </Typography>
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: subTextColor, lineHeight: 18 }}
                >
                  {act.description}
                </Typography>
              </View>
            </View>
          ))}
          <View style={styles.safetyNoteBox}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={Theme.colors.primary}
            />
            <Typography
              variant="caption"
              style={[styles.safetyNoteText, { color: subTextColor }]}
            >
              {activitySuggestion.safetyNote}
            </Typography>
          </View>
        </Card>

        {/* Daily Logs */}
        <View style={styles.sectionHeader}>
          <Typography
            variant="h2"
            style={[styles.sectionTitle, { color: textColor }]}
          >
            Daily Logs
          </Typography>
        </View>

        <Card
          style={[
            styles.logItem,
            { backgroundColor: cardBg, borderColor: borderColor },
          ]}
        >
          <View style={[styles.logIcon, { backgroundColor: "#FF4B4B" }]}>
            <Ionicons name="sad" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.logInfo}>
            <Typography
              variant="h3"
              style={[styles.logTitle, { color: textColor }]}
            >
              Symptoms
            </Typography>
            <Typography
              variant="caption"
              style={[styles.logSubtitle, { color: subTextColor }]}
            >
              {recentSymptoms?.length || 0} signs reported recently
            </Typography>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
          />
        </Card>

        {/* Trends */}
        {trendAlerts.length > 0 && (
          <View style={styles.sectionHeader}>
            <Typography
              variant="h2"
              style={[styles.sectionTitle, { color: textColor }]}
            >
              Health Trends
            </Typography>
          </View>
        )}

        {trendAlerts.map((alert) => (
          <Card
            key={alert.id}
            style={[
              styles.trendCard,
              {
                backgroundColor: cardBg,
                borderColor:
                  alert.type === "CREEPING_RISE"
                    ? Theme.colors.emergency
                    : Theme.colors.accent,
                borderLeftWidth: 4,
              },
            ]}
          >
            <View style={styles.trendHeader}>
              <Ionicons
                name={alert.type === "SUDDEN_SPIKE" ? "flash" : "trending-up"}
                size={20}
                color={
                  alert.type === "CREEPING_RISE"
                    ? Theme.colors.emergency
                    : Theme.colors.accent
                }
              />
              <Typography
                variant="caption"
                style={[styles.trendDate, { color: subTextColor }]}
              >
                {new Date(alert.detectedAt).toLocaleDateString()}
              </Typography>
            </View>
            <Typography
              variant="body"
              style={[styles.trendMessage, { color: textColor }]}
            >
              {alert.message}
            </Typography>
          </Card>
        ))}
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push("/bp-entry")}
      >
        <Ionicons
          name="add"
          size={32}
          color={isDark ? Theme.colors.darkBg : "#FFFFFF"}
        />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  summaryInfo: {
    flex: 1,
    gap: 2,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  summarySubtitle: {},
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
  milestoneCard: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  milestoneEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  calendarStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
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
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
  },
  vitalsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 28,
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
  contentCard: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 24,
    marginBottom: 8,
  },
  contentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  contentCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  contentCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  contentBullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    lineHeight: 18,
  },
  safetyNote: {
    fontSize: 11,
    marginBottom: 28,
    fontStyle: "italic",
  },
  activityCard: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 24,
    marginBottom: 8,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  activityEmoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  safetyNoteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 4,
    padding: 10,
    backgroundColor: "rgba(45, 228, 116, 0.06)",
    borderRadius: 12,
  },
  safetyNoteText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontStyle: "italic",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 16,
    borderRadius: 24,
    marginBottom: 28,
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
  logSubtitle: {},
  trendCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  trendHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  trendDate: {
    fontSize: 12,
  },
  trendMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
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
