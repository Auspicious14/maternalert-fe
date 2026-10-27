import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { AppHeader, Button, Card, FONT, Page, Pill, StatusHero, Steps, T, prettySymptom, useTokens } from "../components/ds";
import { useHealthData } from "../hooks/useHealthData";
import { useUserProfile } from "../hooks/useUserProfile";
import { getTier } from "../services/escalation";
import { EMERGENCY_LINE } from "../services/emergencyAlert";
import { SymptomLevel, readingLabel, symptomResultCopy } from "../services/patientCopy";

// Same screen as maternalert-web/src/app/(patient)/nurse-summary/page.tsx

export default function NurseSummaryScreen() {
  const router = useRouter();
  const t = useTokens();
  const params = useLocalSearchParams<{ level?: string; msg?: string; s?: string }>();
  const level: SymptomLevel = params.level === "urgent" ? "urgent" : params.level === "offline" ? "offline" : "emergency";
  const reported = (params.s ?? "").split(",").filter(Boolean);

  const { latestBP, recentSymptoms } = useHealthData();
  const { profile, pregnancyTimeline } = useUserProfile();
  const copy = symptomResultCopy(level);
  const contactPhone = profile?.emergencyContactPhone;
  const now = new Date();

  const symptoms = reported.length
    ? reported.map((s) => prettySymptom(s))
    : (recentSymptoms ?? []).slice(0, 5).map((s: any) => prettySymptom(s.symptomType, s.customSymptom));
  const bpLabel = latestBP ? readingLabel(getTier(latestBP.systolic, latestBP.diastolic)) : null;
  const weeks = pregnancyTimeline?.isValid ? pregnancyTimeline.currentWeek : null;
  const fmt = (d: Date) => d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

  const Line = ({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) => (
    <View style={{ flexDirection: "row", gap: 12, paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: t.border }}>
      <Text style={{ width: 110, fontFamily: FONT.regular, fontSize: 14, color: t.muted }}>{label}</Text>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );

  return (
    <Page>
      <AppHeader title="What to do now" onBack={() => router.back()} />

      <StatusHero
        tone={copy.tone}
        kicker={copy.kicker}
        title={copy.title}
        message={params.msg || copy.message}
        icon="warning-outline"
        actions={
          level === "urgent" ? (
            <Button variant="white" href="/clinic-finder" icon={(c) => <Ionicons name="location-outline" size={18} color={c} />}>
              Find a clinic
            </Button>
          ) : (
            <Button variant="white" href="/emergency" icon={(c) => <Ionicons name="alert-circle-outline" size={18} color={c} />}>
              Send emergency alert
            </Button>
          )
        }
      />

      <Steps steps={copy.steps} />

      <Card>
        <T variant="label">Show this to the nurse or doctor</T>
        <View style={{ marginTop: 4 }}>
          <Line label="Blood pressure">
            {latestBP ? (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>
                    {`${latestBP.systolic}/${latestBP.diastolic} mmHg`}
                  </Text>
                  {bpLabel ? <Pill tone={bpLabel.tone}>{bpLabel.text}</Pill> : null}
                </View>
                <T variant="small">{fmt(new Date(latestBP.recordedAt))}</T>
              </>
            ) : (
              <T>Not recorded</T>
            )}
          </Line>
          <Line label={reported.length ? "Symptoms now" : "Recent symptoms"}>
            <T style={{ color: t.ink }}>{symptoms.length ? symptoms.join(", ") : "None reported"}</T>
          </Line>
          {weeks ? (
            <Line label="Pregnancy">
              <T style={{ color: t.ink }}>{`${weeks} weeks`}</T>
            </Line>
          ) : null}
          <Line label="Reported" last>
            <T style={{ color: t.ink }}>{fmt(now)}</T>
          </Line>
        </View>
      </Card>

      <View style={{ gap: 10 }}>
        {contactPhone ? (
          <Button variant="secondary" block href={`tel:${contactPhone}`} icon={(c) => <Ionicons name="call-outline" size={18} color={c} />}>
            Call my emergency contact
          </Button>
        ) : null}
        <Button variant="secondary" block href={`tel:${EMERGENCY_LINE}`} icon={(c) => <Ionicons name="call-outline" size={18} color={c} />}>
          {`Call ${EMERGENCY_LINE}`}
        </Button>
        {level !== "urgent" ? (
          <Button variant="secondary" block href="/clinic-finder" icon={(c) => <Ionicons name="location-outline" size={18} color={c} />}>
            Find the nearest hospital
          </Button>
        ) : null}
        <Button variant="secondary" block href="/(tabs)">
          Back to home
        </Button>
      </View>
    </Page>
  );
}
