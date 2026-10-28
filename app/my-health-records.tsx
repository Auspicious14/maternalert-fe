import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";

import { AppHeader, Banner, Button, Card, FONT, Page, Pill, SectionHeader, Skeleton, T, useTokens } from "../components/ds";
import { useHealthData } from "../hooks/useHealthData";
import { AncVisitRecord, SCAN_LABEL, URINE_PROTEIN_LABEL, useMyRecords } from "../hooks/useMyRecords";
import { getTier } from "../services/escalation";
import { readingLabel } from "../services/patientCopy";

// Same screen as maternalert-web/src/app/(patient)/my-health-records/page.tsx

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function Visit({ v, last }: { v: AncVisitRecord; last: boolean }) {
  const t = useTokens();
  const hasBp = v.bloodPressureSystolic != null && v.bloodPressureDiastolic != null;
  const bp = hasBp ? readingLabel(getTier(v.bloodPressureSystolic!, v.bloodPressureDiastolic!)) : null;
  const rows: [string, React.ReactNode][] = [];
  if (hasBp)
    rows.push([
      "Blood pressure",
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <Text style={{ fontFamily: FONT.medium, fontSize: 16, color: t.ink }}>{`${v.bloodPressureSystolic}/${v.bloodPressureDiastolic} mmHg`}</Text>
        {bp ? <Pill tone={bp.tone}>{bp.text}</Pill> : null}
      </View>,
    ]);
  if (v.urineProtein) rows.push(["Protein in urine", URINE_PROTEIN_LABEL[v.urineProtein] ?? v.urineProtein]);
  if (v.weight != null) rows.push(["Weight", `${v.weight} kg`]);
  if (v.haemoglobin != null) rows.push(["Blood level (Hb)", `${v.haemoglobin} g/dL`]);
  if (v.fetalHeartRate != null) rows.push(["Baby's heartbeat", `${v.fetalHeartRate} per minute`]);
  if (v.fundalHeight != null) rows.push(["Bump size", `${v.fundalHeight} cm`]);
  if (v.fetalMovement != null) rows.push(["Baby moving", v.fetalMovement ? "Yes" : "No"]);
  if (v.temperature != null) rows.push(["Temperature", `${v.temperature} °C`]);

  return (
    <View style={{ paddingVertical: 16, paddingTop: 0, marginBottom: last ? 0 : 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: t.border, gap: 4 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <Text style={{ fontFamily: FONT.bold, fontSize: 17, color: t.ink }}>{fmtDate(v.visitDate)}</Text>
        {v.gestationalAge != null ? <T variant="small">{`${v.gestationalAge} weeks`}</T> : null}
      </View>
      {v.facilityName ? <T variant="small">{v.facilityName}</T> : null}
      {rows.map(([k, val], i) => (
        <View key={k} style={{ flexDirection: "row", gap: 12, paddingVertical: 8, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: t.border }}>
          <Text style={{ width: 130, fontFamily: FONT.regular, fontSize: 14, color: t.muted }}>{k}</Text>
          <View style={{ flex: 1 }}>{typeof val === "string" ? <Text style={{ fontFamily: FONT.medium, fontSize: 16, color: t.ink }}>{val}</Text> : val}</View>
        </View>
      ))}
      {v.remarks ? (
        <T style={{ marginTop: 6 }}>
          <Text style={{ fontFamily: FONT.semibold }}>Health worker's note: </Text>
          {v.remarks}
        </T>
      ) : null}
      {v.nextAppointmentDate ? <T variant="small">{`Next visit: ${fmtDate(v.nextAppointmentDate)}`}</T> : null}
    </View>
  );
}

export default function HealthRecordsScreen() {
  const router = useRouter();
  const t = useTokens();
  const { data, isLoading, isError, refetch } = useMyRecords();
  const { bpHistory } = useHealthData();
  const [showAll, setShowAll] = useState(false);

  const visits = data?.visits ?? [];
  const shown = showAll ? visits : visits.slice(0, 3);
  const readings = bpHistory?.length ?? 0;

  return (
    <Page>
      <AppHeader title="Health records" onBack={() => router.back()} />

      {isLoading ? (
        <View style={{ gap: 12 }}>
          <Skeleton height={90} />
          <Skeleton height={220} />
        </View>
      ) : isError ? (
        <View style={{ gap: 10 }}>
          <Banner tone="amber">We couldn't load your records.</Banner>
          <Button variant="secondary" onPress={() => refetch()}>
            Try again
          </Button>
        </View>
      ) : !data?.linked ? (
        <Card>
          <T variant="h2">Link your clinic to see your records</T>
          <T style={{ marginTop: 8, marginBottom: 14 }}>
            When your clinic records your antenatal visits and scans on MaternAlert, they appear here so you always have them with you.
          </T>
          <Button href="/facility-linking" icon={(c) => <Ionicons name="business-outline" size={18} color={c} />}>
            Link my clinic
          </Button>
        </Card>
      ) : (
        <>
          <Card flat>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="business-outline" size={20} color={t.ink2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{data.facilityName ?? "Your clinic"}</Text>
                <T variant="small">{`${visits.length} visit${visits.length === 1 ? "" : "s"} · ${data.scans.length} scan${data.scans.length === 1 ? "" : "s"}`}</T>
              </View>
            </View>
          </Card>

          <SectionHeader title="Antenatal visits" />
          <Card>
            {visits.length ? (
              <>
                {shown.map((v, i) => (
                  <Visit key={v.id} v={v} last={i === shown.length - 1} />
                ))}
                {!showAll && visits.length > 3 ? (
                  <View style={{ marginTop: 14 }}>
                    <Button variant="secondary" block onPress={() => setShowAll(true)}>
                      {`Show ${visits.length - 3} earlier visits`}
                    </Button>
                  </View>
                ) : null}
              </>
            ) : (
              <T>No visits recorded yet. After your next antenatal visit, ask the nurse to record it on MaternAlert.</T>
            )}
          </Card>

          <SectionHeader title="Scans and documents" />
          <Card>
            {data.scans.length ? (
              data.scans.map((s, i) => (
                <View
                  key={s.id}
                  style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12, borderBottomWidth: i === data.scans.length - 1 ? 0 : 1, borderBottomColor: t.border }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="image-outline" size={20} color={t.ink2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{SCAN_LABEL[s.scanType] ?? "Scan"}</Text>
                    <T variant="small">{`${fmtDate(s.scanDate)}${s.notes ? ` · ${s.notes}` : ""}`}</T>
                  </View>
                  <Button size="sm" variant="secondary" onPress={() => Linking.openURL(s.url)} icon={(c) => <Ionicons name="open-outline" size={16} color={c} />}>
                    Open
                  </Button>
                </View>
              ))
            ) : (
              <T>No scans uploaded yet.</T>
            )}
          </Card>
        </>
      )}

      <SectionHeader title="Your own readings" />
      <Card>
        <Pressable onPress={() => router.push("/(tabs)/tracking")} accessibilityRole="link" style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="pulse-outline" size={20} color={t.ink2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>Blood pressure and symptoms</Text>
            <T variant="small">{readings ? `${readings} reading${readings === 1 ? "" : "s"} logged` : "No readings yet"}</T>
          </View>
          <Ionicons name="chevron-forward" size={20} color={t.muted} />
        </Pressable>
      </Card>

      <T variant="small" style={{ textAlign: "center" }}>
        Records come from your clinic. If something looks wrong, tell your health worker.
      </T>
    </Page>
  );
}
