import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import apiClient from "../api/client";
import { TokenStorage } from "../api/storage";
import { AppNotificationType } from "../constants/NotificationTypes";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const data = notification.request.content.data || {};

    if (data.type === AppNotificationType.BP_REMINDER) {
      try {
        const response = await apiClient.get("/blood-pressure/latest");
        const latestReading = response.data;
        if (latestReading) {
          const today = new Date().toDateString();
          const lastLogDate = new Date(latestReading.recordedAt).toDateString();
          if (today === lastLogDate) {
            console.log("BP already logged today, silencing reminder.");
            return {
              shouldShowAlert: false,
              shouldPlaySound: false,
              shouldSetBadge: false,
              shouldShowBanner: false,
              shouldShowList: false,
            };
          }
        }
      } catch (error) {
        console.error("Error in quiet reminder check:", error);
      }
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// ── Rotating notification content pools ──
const INACTIVITY_MESSAGES = {
  1: [
    {
      title: "Quick check-in 🩺",
      body: "You haven't logged your BP today. It only takes 30 seconds.",
    },
    {
      title: "BP check time",
      body: "Stay on top of your health — log your blood pressure today.",
    },
  ],
  2: [
    {
      title: "2 days without a reading",
      body: "Consistent tracking keeps you and your baby safe. Log your BP now.",
    },
    {
      title: "Don't let the gap grow",
      body: "It's been 2 days. A quick BP log keeps your health picture accurate.",
    },
  ],
  3: [
    {
      title: "Your BP tracking has a gap",
      body: "3 days without a reading. Pre-eclampsia can develop quickly — please check in today.",
    },
    {
      title: "We miss your readings",
      body: "3 days since your last log. Your health data helps us protect you.",
    },
  ],
  default: [
    {
      title: "Please check your blood pressure",
      body: "It's been a few days. If you feel unwell, contact your clinic immediately.",
    },
    {
      title: "Your health check is overdue",
      body: "Regular BP monitoring is the best way to catch warning signs early.",
    },
  ],
};

function getDaysSinceLastReading(lastReadingDate: string): number {
  const last = new Date(lastReadingDate);
  const now = new Date();
  // Compare local dates, not UTC timestamps
  const lastLocal = new Date(
    last.getFullYear(),
    last.getMonth(),
    last.getDate(),
  );
  const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = nowLocal.getTime() - lastLocal.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function pickRotatingMessage(pool: { title: string; body: string }[]): {
  title: string;
  body: string;
} {
  // Use day of month to cycle through messages so it changes daily
  const dayOfMonth = new Date().getDate();
  return pool[dayOfMonth % pool.length];
}

function getInactivityMessage(days: number): { title: string; body: string } {
  const pool =
    days === 1
      ? INACTIVITY_MESSAGES[1]
      : days === 2
        ? INACTIVITY_MESSAGES[2]
        : days === 3
          ? INACTIVITY_MESSAGES[3]
          : INACTIVITY_MESSAGES.default;

  const message = pickRotatingMessage(pool);

  // Inject actual day count for 4+ days
  if (days >= 4) {
    return {
      title: message.title,
      body: `It's been ${days} days since your last BP reading. ${message.body.split(".").slice(1).join(".").trim()}`,
    };
  }

  return message;
}

// ── Prevent duplicate scheduling ──
async function scheduleIfNotExists(
  type: string,
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput,
): Promise<string | null> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const alreadyExists = scheduled.some((n) => n.content.data?.type === type);

    if (alreadyExists) {
      console.log(`[NOTIF] ${type} already scheduled, skipping duplicate`);
      return null;
    }

    return await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { type } },
      trigger,
    });
  } catch (error) {
    console.error(`Error scheduling ${type}:`, error);
    return null;
  }
}

class NotificationService {
  private router: any = null;

  setRouter(router: any) {
    this.router = router;
  }

  async registerForPushNotificationsAsync() {
    if (isExpoGo) {
      console.warn(
        "Push notifications not supported in Expo Go. Use a dev build.",
      );
      return null;
    }

    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2DE474",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        await new Promise((resolve) => {
          Alert.alert(
            "Stay Protected",
            "MaternAlert needs permission to send you BP reminders and emergency alerts that could save your life.",
            [{ text: "Allow", onPress: resolve }],
          );
        });
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Push notification permission denied");
        return null;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "fd1b8c99-55ce-463d-8fd3-23857dd9f2ec",
        })
      ).data;

      try {
        await apiClient.post("/notifications/register", { token });
        await TokenStorage.savePushToken(token);
      } catch (error) {
        console.error("Failed to register push token:", error);
      }
    }

    return token;
  }

  handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data || {};
    const type = data.type;

    if (!this.router) return;

    switch (type) {
      case AppNotificationType.BP_REMINDER:
      case AppNotificationType.FOLLOW_UP_RECHECK:
      case AppNotificationType.INACTIVITY_REMINDER:
        this.router.push("/bp-entry");
        break;
      case AppNotificationType.TREND_ALERT:
      case AppNotificationType.ESCALATION_ALERT:
      case AppNotificationType.URGENT_INACTIVITY_REMINDER:
      case AppNotificationType.FOLLOW_UP_MISSED:
        this.router.push("/(tabs)/tracking");
        break;
      case AppNotificationType.FOLLOW_UP_SEEK_CARE:
        this.router.push("/clinic-finder");
        break;
      case AppNotificationType.SESSION_EXPIRY:
        this.router.push("/login");
        break;
      default:
        this.router.push("/(tabs)/index");
    }
  }

  async scheduleNotification(
    title: string,
    body: string,
    data: any,
    trigger: Notifications.NotificationTriggerInput,
  ) {
    try {
      return await Notifications.scheduleNotificationAsync({
        content: { title, body, data },
        trigger,
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return null;
    }
  }

  async cancelNotification(identifier: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error("Error cancelling notification:", error);
    }
  }

  // ── Daily BP Reminder — fixed timezone ──
  async scheduleDailyBPReminder(hour: number, minute: number) {
    try {
      // Cancel all existing BP reminders first
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const n of scheduled) {
        if (n.content.data?.type === AppNotificationType.BP_REMINDER) {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
        }
      }

      // Use DAILY trigger — respects device local timezone automatically
      // CALENDAR trigger defaults to UTC which causes the +1hr offset in WAT
      return await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to check your blood pressure 🩺",
          body: "It takes 30 seconds. Stay on top of your pregnancy health.",
          data: { type: AppNotificationType.BP_REMINDER },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    } catch (error) {
      console.error("Error scheduling daily BP reminder:", error);
      return null;
    }
  }

  // ── Smart inactivity reminder — replaces both "urgent BP" and "It's been a while" ──
  async scheduleInactivityReminder(lastReadingDate: string | null) {
    // If no reading date, treat as 999 days
    const days = lastReadingDate
      ? getDaysSinceLastReading(lastReadingDate)
      : 999;

    // Don't remind if logged today
    if (days === 0) {
      console.log("[NOTIF] BP logged today, no inactivity reminder needed");
      return;
    }

    const { title, body } = getInactivityMessage(days);
    const type =
      days >= 3
        ? AppNotificationType.URGENT_INACTIVITY_REMINDER
        : AppNotificationType.INACTIVITY_REMINDER;

    // Cancel existing inactivity reminders before scheduling new one
    // This prevents the duplicate you were seeing
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (
        n.content.data?.type === AppNotificationType.INACTIVITY_REMINDER ||
        n.content.data?.type === AppNotificationType.URGENT_INACTIVITY_REMINDER
      ) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }

    await scheduleIfNotExists(type, title, body, {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    });
  }

  // ── Follow-up after elevated reading ──
  async scheduleFollowUp(tier: "MONITOR" | "URGENT") {
    const delaySeconds = 4 * 60 * 60; // 4 hours

    const title =
      tier === "URGENT"
        ? "Have you contacted your clinic? ⚠️"
        : "Time to recheck your BP";

    const body =
      tier === "URGENT"
        ? "You logged a high BP reading earlier. Please contact your clinic if you haven't already."
        : "You logged an elevated BP reading earlier. Please recheck now and log your new reading.";

    return await scheduleIfNotExists(
      AppNotificationType.FOLLOW_UP_RECHECK,
      title,
      body,
      {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delaySeconds,
      },
    );
  }

  async cancelFollowUp() {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (
        n.content.data?.type === AppNotificationType.FOLLOW_UP_RECHECK ||
        n.content.data?.type === AppNotificationType.FOLLOW_UP_MISSED
      ) {
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  }
}

export const notificationService = new NotificationService();
