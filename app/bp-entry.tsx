import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import {
  AppHeader,
  Banner,
  Button,
  Card,
  FONT,
  Page,
  T,
  useTokens,
} from "../components/ds";
import { useToast } from "../components/ui/ToastProvider";
import { useHealthData } from "../hooks/useHealthData";
import { useTrends } from "../hooks/useTrends";
import { getTier, getTierInfo, Tier } from "../services/escalation";
import { enqueueReading, isNetworkError } from "../services/offlineQueue";
import { notificationService } from "../services/notifications";
import { useLang } from "../hooks/useLang";
import { bpTips, readingLabel, readingResultTitle } from "../services/patientCopy";
import { tx } from "../services/pidgin";
import { tr } from "../services/i18n";

// Same screen as maternalert-web/src/app/(patient)/bp-entry/page.tsx

function getBPValidationError(systolic: string, diastolic: string): string | null {
  const sys = Number(systolic);
  const dia = Number(diastolic);
  if (!systolic.trim() || !diastolic.trim() || Number.isNaN(sys) || Number.isNaN(dia)) {
    return tx("Enter both numbers from your BP machine.");
  }
  if (!Number.isInteger(sys) || !Number.isInteger(dia)) return tx("Please enter whole numbers only.");
  if (sys < 60 || sys > 260) return tx("The top number should be between 60 and 260.");
  if (dia < 40 || dia > 160) return tx("The bottom number should be between 40 and 160.");
  if (dia >= sys) return tx("The top number should be higher than the bottom number.");
  return null;
}

export default function BPEntryScreen() {
  const router = useRouter();
  const t = useTokens();
  const { addBP, isAddingBP } = useHealthData();
  const { analyzeLatestTrends } = useTrends();
  const { showToast } = useToast();
  useLang();

  // Start empty so a reading can't be saved without actually measuring.
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [touched, setTouched] = useState(false);
  const [focus, setFocus] = useState<"sys" | "dia" | null>(null);
  const [result, setResult] = useState<{ tier: Tier; sys: number; dia: number; saved: boolean | "queued" | null } | null>(null);
  const diaRef = useRef<TextInput>(null);

  const validationError = useMemo(() => getBPValidationError(systolic, diastolic), [systolic, diastolic]);
  const showError = touched && systolic !== "" && diastolic !== "" ? validationError : null;

  const scheduleTierNotifications = async (tier: Tier) => {
    try {
      const at = (seconds: number) => ({
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      });
      if (tier === 2 || tier === 3) {
        await notificationService.scheduleNotification(
          "Time to recheck your BP",
          "Your last reading was high. Please check your blood pressure again now.",
          { type: "FOLLOW_UP" },
          at(4 * 60 * 60) as any,
        );
        await notificationService.scheduleNotification(
          "Please recheck your BP",
          "We haven't seen a new reading. Check your blood pressure or contact your clinic.",
          { type: "FOLLOW_UP", level: "urgent" },
          at(5 * 60 * 60) as any,
        );
      }
      if (tier === 3) {
        await notificationService.scheduleNotification(
          "Contact your clinic today",
          "Your blood pressure is high. Don't wait for your next appointment.",
          { type: "URGENT_ALERT" },
          at(1) as any,
        );
      } else if (tier === 4) {
        await notificationService.scheduleNotification(
          "Go to a health facility now",
          "Your blood pressure is very high. Please get care straight away.",
          { type: "CRITICAL_ALERT" },
          at(1) as any,
        );
      }
    } catch (error) {
      // Local notifications can fail (e.g. permission denied); the on-screen
      // warning still shows, so never let this block the flow.
      console.error("Failed to schedule BP notifications", error);
    }
  };

  const handleSave = async () => {
    setTouched(true);
    if (validationError) {
      showToast({ type: "error", message: validationError });
      return;
    }
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    const tier = getTier(sys, dia);

    // SAFETY: show the warning and fire local alerts BEFORE talking to the
    // server, so a dangerous reading entered offline still gets advice.
    if (tier !== 1) {
      setResult({ tier, sys, dia, saved: null });
      await scheduleTierNotifications(tier);
    }

    // Taken now; sent with the reading so a later retry keeps the real time.
    const takenAt = new Date().toISOString();
    try {
      const savedReading = await addBP({ systolic: sys, diastolic: dia, recordedAt: takenAt });
      try {
        await notificationService.handleBPLogged(savedReading?.reading?.recordedAt || savedReading?.recordedAt);
        const trendAlerts = await analyzeLatestTrends();
        if (__DEV__ && trendAlerts.length > 0) console.log("Trend alerts detected:", trendAlerts);
      } catch (postSaveError) {
        // The reading IS saved; reminders/trend analysis failing is non-fatal.
        console.error("Post-save BP processing failed", postSaveError);
      }
      if (tier === 1) {
        // The reading is normal, but her overall status can still be urgent
        // because of symptoms she reported recently. Say so (same as web).
        const overall = (savedReading as any)?.monitoringState;
        showToast(
          overall === "EMERGENCY" || overall === "URGENT"
            ? {
                type: "info",
                message: tr({
                  en: "Saved. This reading is normal, but the symptoms you reported still need a health worker to check you.",
                  pcm: "E don save. This reading dey normal, but the sickness wey you report still need health worker check.",
                  yo: "A ti fipamọ́. Ìwọ̀n yìí dára, ṣùgbọ́n àwọn àìsàn tí o sọ ṣì nílò kí òṣìṣẹ́ ìlera yẹ̀ ọ́ wò.",
                }),
              }
            : { type: "success", message: tx("Saved. Your blood pressure looks normal.") },
        );
        router.back();
        return;
      }
      setResult({ tier, sys, dia, saved: true });
    } catch (error) {
      console.error("Failed to save BP reading", error);
      if (isNetworkError(error)) {
        // No connection: keep it on this phone and send it automatically later.
        await enqueueReading({ systolic: sys, diastolic: dia, recordedAt: takenAt });
        if (tier === 1) {
          showToast({ type: "success", message: tx("No internet. Saved on this phone. It will send automatically when you're back online.") });
          router.back();
        } else {
          setResult({ tier, sys, dia, saved: "queued" });
        }
        return;
      }
      if (tier === 1) {
        showToast({ type: "error", message: tx("We couldn't save your reading. Check your internet and try again.") });
      } else {
        setResult({ tier, sys, dia, saved: false });
      }
    }
  };

  const inputStyle = (which: "sys" | "dia") => ({
    fontFamily: FONT.bold,
    fontSize: 44,
    textAlign: "center" as const,
    color: t.ink,
    backgroundColor: focus === which ? t.surface : t.surface2,
    borderWidth: 2,
    borderColor: showError ? t.red : focus === which ? t.green : "transparent",
    borderRadius: 18,
    minHeight: 84,
    paddingVertical: 10,
  });

  const info = result ? getTierInfo(result.tier) : null;
  const band = result ? (result.tier === 1 ? t.green : result.tier === 2 ? t.amber : t.red) : t.green;

  return (
    <>
      <Page>
        <AppHeader title={tx("Log blood pressure")} subtitle={tx("Takes less than a minute")} onBack={() => router.back()} />

        <Card>
          <View style={{ gap: 20 }}>
            <T>{tx("Type the two numbers exactly as they show on your BP machine.")}</T>

            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 12 }}>
              <View style={{ flex: 1, gap: 8 }}>
                <T variant="title" style={{ fontSize: 15 }} nativeID="bp-sys-label">
                  {tx("Top number")}
                </T>
                <TextInput
                  accessibilityLabel="Top number, systolic"
                  accessibilityLabelledBy="bp-sys-label"
                  keyboardType="number-pad"
                  returnKeyType="next"
                  maxLength={3}
                  value={systolic}
                  onFocus={() => setFocus("sys")}
                  onBlur={() => setFocus(null)}
                  onChangeText={(v) => {
                    const cleaned = v.replace(/[^0-9]/g, "");
                    setSystolic(cleaned);
                    if (cleaned.length === 3) diaRef.current?.focus();
                  }}
                  onSubmitEditing={() => diaRef.current?.focus()}
                  style={inputStyle("sys")}
                />
                <T variant="small" style={{ fontSize: 13 }}>
                  {tx("SYS · usually 90–140")}
                </T>
              </View>
              <Text style={{ fontSize: 44, color: t.muted, paddingBottom: 34 }} accessible={false}>
                /
              </Text>
              <View style={{ flex: 1, gap: 8 }}>
                <T variant="title" style={{ fontSize: 15 }} nativeID="bp-dia-label">
                  {tx("Bottom number")}
                </T>
                <TextInput
                  ref={diaRef}
                  accessibilityLabel="Bottom number, diastolic"
                  accessibilityLabelledBy="bp-dia-label"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  maxLength={3}
                  value={diastolic}
                  onFocus={() => setFocus("dia")}
                  onBlur={() => setFocus(null)}
                  onChangeText={(v) => setDiastolic(v.replace(/[^0-9]/g, ""))}
                  onSubmitEditing={handleSave}
                  style={inputStyle("dia")}
                />
                <T variant="small" style={{ fontSize: 13 }}>
                  {tx("DIA · usually 60–90")}
                </T>
              </View>
            </View>

            {showError ? (
              <T color={t.redInk} style={{ fontSize: 14 }} accessibilityRole="alert">
                {showError}
              </T>
            ) : null}

            <Button size="lg" block onPress={handleSave} loading={isAddingBP}>
              {isAddingBP ? tx("Saving…") : tx("Save reading")}
            </Button>
          </View>
        </Card>

        <Card flat>
          <T variant="h2" style={{ marginBottom: 12 }}>
            {tx("For an accurate reading")}
          </T>
          <View style={{ gap: 10 }}>
            {bpTips().map((tip) => (
              <View key={tip} style={{ flexDirection: "row", gap: 10 }}>
                <Ionicons name="checkmark" size={18} color={t.greenInk} style={{ marginTop: 3 }} />
                <T style={{ flex: 1, fontSize: 15, lineHeight: 22 }}>{tip}</T>
              </View>
            ))}
          </View>
        </Card>

        <Banner tone="amber" icon="information-circle-outline">
          {tx("No BP machine? Ask at your clinic or a pharmacy. Don't guess the numbers, because a wrong reading can hide a real problem.")}
        </Banner>
      </Page>

      <Modal visible={Boolean(result && info)} transparent animationType="slide" onRequestClose={() => setResult(null)}>
        {result && info ? (
          <View style={{ flex: 1, backgroundColor: "rgba(15,36,28,0.55)", justifyContent: "flex-end", padding: 12 }}>
            <View style={{ backgroundColor: t.surface, borderRadius: 28, overflow: "hidden" }} accessibilityViewIsModal>
              <View style={{ backgroundColor: band, padding: 22, gap: 6 }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", color: "#FFFFFF", opacity: 0.85 }}>
                  {readingLabel(result.tier).text}
                </Text>
                <Text style={{ fontFamily: FONT.bold, fontSize: 24, lineHeight: 29, color: "#FFFFFF" }} accessibilityRole="header">
                  {readingResultTitle(result.tier)}
                </Text>
                <Text style={{ fontFamily: FONT.bold, fontSize: 34, color: "#FFFFFF" }}>
                  {result.sys}/{result.dia}
                  <Text style={{ fontFamily: FONT.medium, fontSize: 15 }}> mmHg</Text>
                </Text>
              </View>
              <View style={{ padding: 22, gap: 16 }}>
                <T style={{ fontSize: 17 }}>{info.response}</T>
                {result.tier >= 3 ? (
                  <T variant="small">
                    {tx("Go now if you also have a severe headache, blurred vision, pain under the ribs, or fits.")}
                  </T>
                ) : null}
                {result.tier >= 2 ? <T variant="small">{tx("We'll remind you to check again.")}</T> : null}
                {result.saved === "queued" ? (
                  <Banner tone="amber">
                    {tx("No internet, so your clinic hasn't seen this yet. It's saved on this phone and will send automatically. If you need help now, call your clinic.")}
                  </Banner>
                ) : null}
                {result.saved === false ? (
                  <Banner tone="red">
                    {tx("This reading couldn't be saved, so your clinic hasn't seen it. Contact them directly.")}
                  </Banner>
                ) : null}
                {result.tier === 4 ? (
                  <Button
                    variant="danger"
                    size="lg"
                    block
                    onPress={() => {
                      setResult(null);
                      router.push("/emergency");
                    }}
                    icon={(c) => <Ionicons name="alert-circle-outline" size={20} color={c} />}
                  >
                    {tx("Get emergency help")}
                  </Button>
                ) : null}
                {result.tier === 3 ? (
                  <Button
                    size="lg"
                    block
                    onPress={() => {
                      setResult(null);
                      router.push("/clinic-finder");
                    }}
                    icon={(c) => <Ionicons name="location-outline" size={20} color={c} />}
                  >
                    {tx("Find a clinic")}
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  block
                  onPress={() => {
                    setResult(null);
                    router.back();
                  }}
                >
                  {tx("Done")}
                </Button>
              </View>
            </View>
          </View>
        ) : null}
      </Modal>
    </>
  );
}
