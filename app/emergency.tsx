import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { AppHeader, Banner, Button, Card, FONT, Page, Row, T, useTokens } from "../components/ds";
import { useHealthData } from "../hooks/useHealthData";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  ALERT_SENT_MESSAGE,
  EMERGENCY_LINE,
  showEmergencyFallback,
  textNumber,
  triggerEmergencyAlert,
} from "../services/emergencyAlert";

// Same screen as maternalert-web/src/app/(patient)/emergency/page.tsx

type AlertState = "idle" | "sending" | "sent" | "failed";

const RELATIONSHIP: Record<string, string> = {
  MIDWIFE: "Your midwife",
  PARTNER: "Your partner",
  FAMILY_MEMBER: "Family member",
  OTHER: "Emergency contact",
};

export default function EmergencyScreen() {
  const router = useRouter();
  const t = useTokens();
  const { profile } = useUserProfile();
  const { latestBP } = useHealthData();
  const [alertState, setAlertState] = useState<AlertState>("idle");

  const contactPhone = profile?.emergencyContactPhone ?? null;
  const contactName = profile?.emergencyContactRelationship
    ? RELATIONSHIP[profile.emergencyContactRelationship] ?? "Emergency contact"
    : "Emergency contact";

  async function handleSendAlert() {
    if (alertState === "sending") return;
    setAlertState("sending");
    const ok = await triggerEmergencyAlert();
    if (ok) {
      setAlertState("sent");
    } else {
      // "failed" keeps the button available for a retry.
      setAlertState("failed");
      showEmergencyFallback(contactPhone, () => router.push("/(tabs)/profile"));
    }
  }

  const sent = alertState === "sent";
  const sosColor = sent ? t.green : t.red;
  const ringColor = sent ? t.mint : t.redBg;

  return (
    <Page>
      <AppHeader title="Emergency help" onBack={() => router.back()} />

      <View style={{ alignItems: "center", gap: 18, paddingTop: 12, paddingBottom: 4 }}>
        <View style={{ padding: 12, borderRadius: 999, backgroundColor: ringColor }}>
          <Pressable
            onPress={handleSendAlert}
            disabled={alertState === "sending"}
            accessibilityRole="button"
            accessibilityLabel={sent ? "Alert sent" : "Send emergency alert"}
            accessibilityHint="Sends a message to your emergency contact and your clinic"
            style={({ pressed }) => ({
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: pressed && !sent ? t.redPress : sosColor,
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            })}
          >
            {alertState === "sending" ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <Ionicons name={sent ? "checkmark-circle-outline" : "alert-circle-outline"} size={52} color="#FFFFFF" />
            )}
            <Text style={{ fontFamily: FONT.bold, fontSize: 20, color: "#FFFFFF" }}>
              {alertState === "sending" ? "Sending…" : sent ? "Alert sent" : "Send alert"}
            </Text>
            {!sent && alertState !== "sending" ? (
              <Text style={{ fontFamily: FONT.medium, fontSize: 14, color: "#FFFFFF", opacity: 0.9 }}>Tap once</Text>
            ) : null}
          </Pressable>
        </View>
        <T style={{ textAlign: "center", maxWidth: 420 }}>
          {sent
            ? ALERT_SENT_MESSAGE
            : "Sends a WhatsApp or text message to your emergency contact and your clinic, saying you need help now."}
        </T>
      </View>

      {alertState === "failed" ? (
        <Banner tone="red">
          The alert couldn't be sent. Call or text your contact below, or call {EMERGENCY_LINE}.
        </Banner>
      ) : null}

      <Card>
        <T variant="h2" style={{ marginBottom: 4 }}>
          Call for help yourself
        </T>
        {contactPhone ? (
          <>
            <Row icon="person-outline" title={contactName} subtitle={contactPhone} last />
            <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
              <View style={{ flex: 1 }}>
                <Button block href={`tel:${contactPhone}`} icon={(c) => <Ionicons name="call-outline" size={18} color={c} />}>
                  Call
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  block
                  variant="secondary"
                  onPress={() => textNumber(contactPhone)}
                  icon={(c) => <Ionicons name="chatbubble-outline" size={18} color={c} />}
                >
                  Text
                </Button>
              </View>
            </View>
          </>
        ) : (
          <View style={{ gap: 12, marginTop: 8 }}>
            <T>You haven't added an emergency contact yet.</T>
            <Button variant="secondary" href="/(tabs)/profile">
              Add an emergency contact
            </Button>
          </View>
        )}
        <View style={{ marginTop: 12 }}>
          <Button
            variant="danger"
            block
            href={`tel:${EMERGENCY_LINE}`}
            icon={(c) => <Ionicons name="call-outline" size={18} color={c} />}
          >
            {`Call ${EMERGENCY_LINE} (emergency line)`}
          </Button>
        </View>
      </Card>

      <Card flat>
        <Row
          icon="location-outline"
          title="Nearest health facility"
          subtitle="Directions and phone numbers"
          last
          trailing={
            <Button size="sm" variant="secondary" href="/clinic-finder">
              Open
            </Button>
          }
        />
      </Card>

      {latestBP ? (
        <T variant="small" style={{ textAlign: "center" }}>
          Your last blood pressure: {latestBP.systolic}/{latestBP.diastolic} mmHg. Show this to the health worker.
        </T>
      ) : null}
    </Page>
  );
}
