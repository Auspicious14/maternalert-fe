import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import apiClient from "../api/client";
import { TokenStorage } from "../api/storage";
import { AppNotificationType } from "../constants/NotificationTypes";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // ── Quiet Reminder Logic ──
    // If it's a daily reminder and user already logged BP today, don't show it
    const data = notification.request.content.data || {};
    if (data.type === AppNotificationType.BP_REMINDER) {
      try {
        const response = await apiClient.get("/blood-pressure/latest");
        const latestReading = response.data;
        if (latestReading) {
          const today = new Date().toISOString().split("T")[0];
          const lastLogDate = new Date(latestReading.recordedAt)
            .toISOString()
            .split("T")[0];
          if (today === lastLogDate) {
            console.log("BP already logged today, silencing daily reminder.");
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

class NotificationService {
  private router: any = null;

  setRouter(router: any) {
    this.router = router;
  }

  async registerForPushNotificationsAsync() {
    let token;

    if (isExpoGo) {
      console.warn(
        "Push notifications not supported in Expo Go. Use a dev build.",
      );
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        // Show explanation before requesting
        await new Promise((resolve) => {
          Alert.alert(
            "Push Notifications",
            "MaternAlert needs permission to send you BP reminders and emergency alerts.",
            [{ text: "Continue", onPress: resolve }],
          );
        });
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "fd1b8c99-55ce-463d-8fd3-23857dd9f2ec",
        })
      ).data;
      console.log("Expo Push Token:", token);

      // Register token with backend
      try {
        await apiClient.post("/notifications/register", { token });
        await TokenStorage.savePushToken(token);
      } catch (error) {
        console.error("Failed to register push token with backend", error);
      }
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    return token;
  }

  handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data || {};
    const type = data.type;

    if (this.router) {
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
  }

  async scheduleNotification(
    title: string,
    body: string,
    data: any,
    trigger: Notifications.NotificationTriggerInput,
  ) {
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
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

  async scheduleDailyBPReminder(hour: number, minute: number) {
    try {
      // First, cancel any existing BP reminders
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const notification of scheduled) {
        if (
          notification.content.data?.type === AppNotificationType.BP_REMINDER
        ) {
          await Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          );
        }
      }

      // Check if user already logged BP today (quiet check)
      try {
        const response = await apiClient.get("/blood-pressure/latest");
        const latestReading = response.data;
        if (latestReading) {
          const today = new Date().toISOString().split("T")[0];
          const lastLogDate = new Date(latestReading.recordedAt)
            .toISOString()
            .split("T")[0];
          if (today === lastLogDate) {
            console.log(
              "BP already logged today, skipping daily reminder schedule for today",
            );
          }
        }
      } catch (error) {
        console.error("Error checking latest BP for reminder:", error);
      }

      // Schedule new daily reminder
      return await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to check your blood pressure",
          body: "It takes 30 seconds. Stay on top of your pregnancy health.",
          data: { type: AppNotificationType.BP_REMINDER },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute,
          repeats: true,
        },
      });
    } catch (error) {
      console.error("Critical error in scheduleDailyBPReminder:", error);
      // We don't re-throw here to prevent crashing the UI flow (like saving BP)
      // because missing a reminder is better than failing to save medical data
      return null;
    }
  }
}

export const notificationService = new NotificationService();
