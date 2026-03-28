import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import apiClient from "../api/client";
import { TokenStorage } from "../api/storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
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
      token = (await Notifications.getExpoPushTokenAsync()).data;
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
        case "BP_REMINDER":
          this.router.push("/bp-entry");
          break;
        case "TREND_ALERT":
          this.router.push("/(tabs)/tracking");
          break;
        case "FOLLOW_UP":
          this.router.push("/bp-entry");
          break;
        case "SESSION_EXPIRY":
          this.router.push("/login");
          break;
        case "ESCALATION_ALERT":
          // Handle specific tier screen if needed, or just vitals
          this.router.push("/(tabs)/tracking");
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
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger,
    });
  }

  async cancelNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  async scheduleDailyBPReminder(hour: number, minute: number) {
    // First, cancel any existing BP reminders
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === "BP_REMINDER") {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        );
      }
    }

    // Schedule new daily reminder
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to check your blood pressure",
        body: "It takes 30 seconds. Stay on top of your pregnancy health.",
        data: { type: "BP_REMINDER" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });
  }
}

export const notificationService = new NotificationService();
