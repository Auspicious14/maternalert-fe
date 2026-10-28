import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Card, FONT, LogoMark, Row, T, useTokens } from "../components/ds";
import { useLang } from "../hooks/useLang";
import { LANGUAGES } from "../services/i18n";
import { chooseLang } from "../services/langStorage";
import { tx } from "../services/pidgin";

// Same screen as maternalert-web/src/app/(patient)/onboarding/page.tsx

export default function OnboardingScreen() {
  const router = useRouter();
  const t = useTokens();
  const lang = useLang();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48, gap: 20, width: "100%", maxWidth: 440, alignSelf: "center" }}>
        {/* Language first, so everything after it is in her language. */}
        <View style={{ gap: 8, alignItems: "center" }}>
          <T variant="label">{tx("Choose your language")}</T>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" }} accessibilityRole="radiogroup">
            {LANGUAGES.map((l) => {
              const on = lang === l.code;
              return (
                <Pressable
                  key={l.code}
                  onPress={() => chooseLang(l.code)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  style={{
                    minHeight: 44,
                    paddingHorizontal: 16,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    justifyContent: "center",
                    borderColor: on ? t.green : t.borderStrong,
                    backgroundColor: on ? t.green : t.surface,
                  }}
                >
                  <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#FFFFFF" : t.ink2 }}>{l.native}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ alignItems: "center", gap: 8 }}>
          <LogoMark height={64} />
          <T variant="h1" accessibilityRole="header" style={{ textAlign: "center" }}>
            {tx("Safe pregnancy, early warning")}
          </T>
          <T style={{ textAlign: "center" }}>{tx("Spot warning signs early and know exactly when to get care.")}</T>
        </View>

        <View
          style={{
            width: "70%",
            maxWidth: 260,
            aspectRatio: 1,
            alignSelf: "center",
            borderRadius: 32,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: t.border,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Image
            source={require("../assets/images/maternal_onboarding_illustration.jpg")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>

        <Card>
          <Row icon="pulse-outline" title={tx("Check your blood pressure at home")} subtitle={tx("We tell you what your numbers mean and what to do.")} />
          <Row icon="warning-outline" title={tx("Know the danger signs")} subtitle={tx("Report how you feel and get clear advice straight away.")} />
          <Row icon="alert-circle-outline" title={tx("Get help in one tap")} subtitle={tx("Alert your family and your clinic straight away.")} last />
        </Card>

        <View style={{ gap: 4 }}>
          <Button size="lg" block onPress={() => router.push("/disclaimer")} icon={(c) => <Ionicons name="arrow-forward" size={20} color={c} />}>
            {tx("Get started")}
          </Button>
          <Pressable onPress={() => router.push("/login")} accessibilityRole="link" style={{ minHeight: 44, justifyContent: "center" }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk, textAlign: "center" }}>
              {tx("I already have an account")}
            </Text>
          </Pressable>
        </View>

        <T variant="small" style={{ textAlign: "center" }}>
          {tx("MaternAlert does not replace your doctor or midwife.")}{" "}
          <Text onPress={() => Linking.openURL("https://maternalert.com.ng/terms")} style={{ color: t.greenInk, fontFamily: FONT.semibold }}>
            {tx("Terms")}
          </Text>
          {" · "}
          <Text onPress={() => Linking.openURL("https://maternalert.com.ng/privacy")} style={{ color: t.greenInk, fontFamily: FONT.semibold }}>
            {tx("Privacy")}
          </Text>
        </T>
      </ScrollView>
    </SafeAreaView>
  );
}
