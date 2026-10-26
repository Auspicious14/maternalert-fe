import { Alert, AlertButton, Linking, Platform } from "react-native";
import apiClient from "@/api/client";

/**
 * Shared emergency-alert logic used by every emergency entry point
 * (home floating button, emergency screen, emergency-button screen).
 *
 * Safety principle: the server can be asleep (free hosting), the phone can be
 * offline, or the request can time out. In every one of those cases the mother
 * must still be offered a way to reach help that does NOT depend on our server:
 * a direct phone call or SMS from her own phone, or the national emergency line.
 */

// Nigeria's national emergency number. Confirm with clinical co-founder before
// changing, and make this configurable when expanding to other countries.
export const EMERGENCY_LINE = "112";

const SMS_TEXT =
  "EMERGENCY: I need help now. This is an urgent pregnancy-related alert sent from MaternAlert. Please call me or come to me immediately.";

/** Sends the alert through our backend. Returns true on any 2xx response. */
export async function triggerEmergencyAlert(): Promise<boolean> {
  try {
    const res = await apiClient.post("/emergency/trigger", undefined, {
      timeout: 15000,
    });
    return res.status >= 200 && res.status < 300;
  } catch (error: any) {
    if (__DEV__) {
      console.log(
        "Emergency trigger error:",
        error?.response?.status,
        error?.message,
      );
    }
    return false;
  }
}

export function callNumber(phone: string) {
  Linking.openURL(`tel:${phone}`).catch(() => undefined);
}

export function textNumber(phone: string, body: string = SMS_TEXT) {
  // iOS uses "&body=", Android uses "?body="
  const sep = Platform.OS === "ios" ? "&" : "?";
  Linking.openURL(`sms:${phone}${sep}body=${encodeURIComponent(body)}`).catch(
    () => undefined,
  );
}

/**
 * Shown when the server alert could not be sent. Android allows at most three
 * buttons, so the choices are kept to three.
 */
export function showEmergencyFallback(
  contactPhone?: string | null,
  onAddContact?: () => void,
) {
  const buttons: AlertButton[] = contactPhone
    ? [
        { text: "Call contact", onPress: () => callNumber(contactPhone) },
        { text: "Text contact", onPress: () => textNumber(contactPhone) },
        { text: `Call ${EMERGENCY_LINE}`, onPress: () => callNumber(EMERGENCY_LINE) },
      ]
    : [
        { text: `Call ${EMERGENCY_LINE}`, onPress: () => callNumber(EMERGENCY_LINE) },
        ...(onAddContact
          ? [{ text: "Add a contact", onPress: onAddContact } as AlertButton]
          : []),
        { text: "Close", style: "cancel" },
      ];

  Alert.alert(
    "Alert could not be sent",
    contactPhone
      ? "We could not reach our server. Call or text your emergency contact directly from your phone now, or call the emergency line."
      : "We could not reach our server and you have no emergency contact saved. Call the emergency line or go to the nearest health facility now.",
    buttons,
    { cancelable: true },
  );
}

/** Honest success copy: we know the request was accepted, not that help is on the way. */
export const ALERT_SENT_MESSAGE =
  "Your alert was sent to your emergency contact and linked health facility. If you can, also call them directly to make sure they got it.";
