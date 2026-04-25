import * as Notifications from "expo-notifications";
import { BloodPressure } from "../hooks/useHealthData";
import { notificationService } from "./notifications";

export interface TrendAlert {
  id: string;
  type: "CREEPING_RISE" | "REPEATED_HIGH" | "SUDDEN_SPIKE";
  message: string;
  detectedAt: string;
}

class TrendService {
  detectTrends(readings: BloodPressure[]): TrendAlert[] {
    const alerts: TrendAlert[] = [];
    if (readings.length === 0) return alerts;

    const sortedReadings = [...readings].sort(
      (a, b) =>
        new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
    );

    // Pattern 1: Creeping rise
    if (sortedReadings.length >= 3) {
      const last3 = sortedReadings.slice(-3);
      const diff1 = last3[1].systolic - last3[0].systolic;
      const diff2 = last3[2].systolic - last3[1].systolic;

      if (diff1 >= 5 && diff2 >= 5) {
        alerts.push({
          id: `rise-${last3[2].id}`, // Use reading ID not Date.now() — prevents duplicates on re-render
          type: "CREEPING_RISE",
          message:
            "Your blood pressure has been rising consistently over your last 3 readings. This pattern needs medical attention.",
          detectedAt: new Date().toISOString(),
        });
      }
    }

    // Pattern 2: Repeated high readings (140/90+ within 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7Days = sortedReadings.filter(
      (r) => new Date(r.recordedAt) >= sevenDaysAgo,
    );
    const highReadings = last7Days.filter(
      (r) => r.systolic >= 140 || r.diastolic >= 90,
    );

    if (highReadings.length >= 2) {
      alerts.push({
        id: `high-${highReadings[highReadings.length - 1].id}`, // stable ID
        type: "REPEATED_HIGH",
        message:
          "You have had multiple high BP readings this week. Please contact your clinic today.",
        detectedAt: new Date().toISOString(),
      });
    }

    // Pattern 3: Sudden spike
    if (sortedReadings.length >= 2) {
      const latest = sortedReadings[sortedReadings.length - 1];
      const previousReadings = sortedReadings.slice(0, -1);
      const averageSystolic =
        previousReadings.reduce((sum, r) => sum + r.systolic, 0) /
        previousReadings.length;

      if (latest.systolic >= averageSystolic + 30) {
        alerts.push({
          id: `spike-${latest.id}`, // stable ID
          type: "SUDDEN_SPIKE",
          message:
            "This reading is significantly higher than your usual numbers. Recheck in 1 hour and seek help if it remains high.",
          detectedAt: new Date().toISOString(),
        });
      }
    }

    return alerts;
  }

  async triggerTrendNotifications(alerts: TrendAlert[]) {
    // Cancel existing trend notifications before firing new ones
    // This prevents the duplicate triggering you noticed
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.content.data?.type === "TREND_ALERT") {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }

    // Only notify for the most severe alert, not all of them
    // Priority: CREEPING_RISE > REPEATED_HIGH > SUDDEN_SPIKE
    const priority = ["CREEPING_RISE", "REPEATED_HIGH", "SUDDEN_SPIKE"];
    const mostSevere = alerts.sort(
      (a, b) => priority.indexOf(a.type) - priority.indexOf(b.type),
    )[0];

    if (!mostSevere) return;

    await notificationService.scheduleNotification(
      "Blood Pressure Trend Detected",
      mostSevere.message,
      { type: "TREND_ALERT", alertType: mostSevere.type },
      {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    );
  }
}

export const trendService = new TrendService();
