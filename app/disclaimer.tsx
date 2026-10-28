import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AuthShell, Button, Card, FONT, Row, useTokens } from "../components/ds";
import { useAuthContext } from "../context/AuthContext";
import { useLang } from "../hooks/useLang";
import { EMERGENCY_LINE } from "../services/emergencyAlert";
import { tx } from "../services/pidgin";

// Same screen as maternalert-web/src/app/(patient)/disclaimer/page.tsx

export default function DisclaimerScreen() {
  const router = useRouter();
  const t = useTokens();
  const { markAsLaunched } = useAuthContext();
  const [agreed, setAgreed] = useState(false);
  useLang();

  const accept = async () => {
    await markAsLaunched();
    router.replace("/register");
  };

  return (
    <AuthShell title={tx("Before you start")} subtitle={tx("Please read these three things.")} onBack={() => router.back()}>
      <Card>
        <Row
          icon="medkit-outline"
          title={tx("This app does not diagnose.")}
          subtitle={tx("It follows clinical guidelines to tell you when to get care. A health worker must check you.")}
        />
        <Row
          icon="call-outline"
          title={tx("In an emergency, don't wait for the app.")}
          subtitle={tx("Call {line} or go to the nearest hospital straight away.", { line: EMERGENCY_LINE })}
        />
        <Row
          icon="lock-closed-outline"
          title={tx("Your information is private.")}
          subtitle={tx("We collect only what we need for your care. Only you and your linked clinic can see it.")}
          last
        />
      </Card>

      <Pressable
        onPress={() => setAgreed((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreed }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          padding: 16,
          minHeight: 60,
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: agreed ? t.green : t.border,
          backgroundColor: agreed ? t.mint : t.surface,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            borderWidth: 2,
            borderColor: agreed ? t.green : t.borderStrong,
            backgroundColor: agreed ? t.green : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {agreed ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
        </View>
        <Text style={{ flex: 1, fontFamily: FONT.medium, fontSize: 16, lineHeight: 22, color: t.ink }}>
          {tx("I understand. MaternAlert helps me but does not replace my health worker.")}
        </Text>
      </Pressable>

      <Button size="lg" block disabled={!agreed} onPress={accept}>
        {tx("Continue")}
      </Button>
    </AuthShell>
  );
}
