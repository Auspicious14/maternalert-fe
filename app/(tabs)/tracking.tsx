import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";

import {
  AppHeader,
  Banner,
  Button,
  Card,
  FONT,
  Page,
  Pill,
  SectionHeader,
  Skeleton,
  T,
  prettySymptom,
  timeAgo,
  useTokens,
} from "../../components/ds";
import { useHealthData } from "../../hooks/useHealthData";
import { useTrends } from "../../hooks/useTrends";
import { useUserProfile } from "../../hooks/useUserProfile";
import { getTier } from "../../services/escalation";
import { readingLabel } from "../../services/patientCopy";
import PendingReadingsBanner from "../../components/PendingReadingsBanner";

// Same screen as maternalert-web/src/app/(patient)/tracking/page.tsx

type Reading = { id: string; systolic: number; diastolic: number; recordedAt: string };

const DAY_MS = 24 * 60 * 60 * 1000;

function dayHeading(d: Date): string {
  const today = new Date();
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(today) - start(d)) / DAY_MS);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

/** Line chart drawn with plain Views (react-native-svg isn't installed). */
function BPChart({ readings }: { readings: Reading[] }) {
  const t = useTokens();
  const [w, setW] = useState(0);
  const pts = readings.slice(-14);
  const H = 170;
  const pad = { l: 30, r: 8, t: 10, b: 20 };
  const lo = Math.min(50, ...pts.map((r) => r.diastolic - 5));
  const hi = Math.max(170, ...pts.map((r) => r.systolic + 5));
  const innerW = Math.max(w - pad.l - pad.r, 1);
  const x = (i: number) => pad.l + (pts.length === 1 ? innerW / 2 : (i * innerW) / (pts.length - 1));
  const y = (v: number) => pad.t + ((hi - v) * (H - pad.t - pad.b)) / (hi - lo);
  const highs = pts.filter((r) => getTier(r.systolic, r.diastolic) >= 3).length;

  const segment = (x1: number, y1: number, x2: number, y2: number, color: string, width: number, key: string) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    return (
      <View
        key={key}
        style={{
          position: "absolute",
          left: (x1 + x2) / 2 - len / 2,
          top: (y1 + y2) / 2 - width / 2,
          width: len,
          height: width,
          borderRadius: width,
          backgroundColor: color,
          transform: [{ rotate: `${angle}rad` }],
        }}
      />
    );
  };
  const dotColor = (r: Reading) => {
    const tier = getTier(r.systolic, r.diastolic);
    return tier >= 3 ? t.red : tier === 2 ? t.amber : t.green;
  };

  return (
    <View>
      <View
        onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
        style={{ height: H }}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Chart of your last ${pts.length} readings. ${highs} of them were high, 140/90 or above.`}
      >
        {w > 0 ? (
          <>
            {[140, 90].map((v) => (
              <React.Fragment key={v}>
                <View
                  style={{
                    position: "absolute",
                    left: pad.l,
                    right: pad.r,
                    top: y(v),
                    borderTopWidth: 1,
                    borderStyle: "dashed",
                    borderColor: t.red,
                    opacity: 0.6,
                  }}
                />
                <Text style={{ position: "absolute", left: 0, width: pad.l - 6, textAlign: "right", top: y(v) - 8, fontSize: 11, color: t.muted, fontFamily: FONT.regular }}>
                  {v}
                </Text>
              </React.Fragment>
            ))}
            {pts.slice(1).map((r, i) => segment(x(i), y(pts[i].systolic), x(i + 1), y(r.systolic), t.green, 2.5, `s${i}`))}
            {pts.slice(1).map((r, i) => (
              <View key={`d${i}`} style={{ opacity: 0.45, position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }} pointerEvents="none">
                {segment(x(i), y(pts[i].diastolic), x(i + 1), y(r.diastolic), t.green, 2, `dd${i}`)}
              </View>
            ))}
            {pts.map((r, i) =>
              [r.systolic, r.diastolic].map((v, j) => (
                <View
                  key={`${r.id}-${j}`}
                  style={{
                    position: "absolute",
                    left: x(i) - 4,
                    top: y(v) - 4,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: dotColor(r),
                    borderWidth: 1.5,
                    borderColor: t.surface,
                  }}
                />
              )),
            )}
            {pts.length > 1 ? (
              <>
                <Text style={{ position: "absolute", left: pad.l, bottom: 0, fontSize: 11, color: t.muted, fontFamily: FONT.regular }}>
                  {new Date(pts[0].recordedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </Text>
                <Text style={{ position: "absolute", right: pad.r, bottom: 0, fontSize: 11, color: t.muted, fontFamily: FONT.regular }}>
                  {new Date(pts[pts.length - 1].recordedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </Text>
              </>
            ) : null}
          </>
        ) : null}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, marginTop: 10 }}>
        {[
          { label: "Top number", color: t.green, opacity: 1, dashed: false },
          { label: "Bottom number", color: t.green, opacity: 0.45, dashed: false },
          { label: "High (140/90)", color: t.red, opacity: 1, dashed: true },
        ].map((k) => (
          <View key={k.label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 16, borderTopWidth: k.dashed ? 1.5 : 2.5, borderStyle: k.dashed ? "dashed" : "solid", borderColor: k.color, opacity: k.opacity }} />
            <Text style={{ fontSize: 13, color: t.muted, fontFamily: FONT.regular }}>{k.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ReadingsScreen() {
  const router = useRouter();
  const t = useTokens();
  const { bpHistory, isLoadingBP, recentSymptoms } = useHealthData();
  const { pregnancyTimeline } = useUserProfile();
  const { trendAlerts } = useTrends();
  const [showAll, setShowAll] = useState(false);

  const readings = useMemo<Reading[]>(
    () =>
      [...((bpHistory as Reading[] | undefined) ?? [])].sort(
        (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
      ),
    [bpHistory],
  );
  const newestFirst = useMemo(() => [...readings].reverse(), [readings]);
  const latest = newestFirst[0];

  const week = useMemo(() => {
    const since = Date.now() - 7 * DAY_MS;
    const recent = readings.filter((r) => new Date(r.recordedAt).getTime() >= since);
    const highest = recent.reduce<Reading | null>(
      (m, r) => (!m || r.systolic > m.systolic || (r.systolic === m.systolic && r.diastolic > m.diastolic) ? r : m),
      null,
    );
    return { count: recent.length, high: recent.filter((r) => getTier(r.systolic, r.diastolic) >= 3).length, highest };
  }, [readings]);

  const groups = useMemo(() => {
    const list = showAll ? newestFirst : newestFirst.slice(0, 15);
    const out: { heading: string; items: Reading[] }[] = [];
    for (const r of list) {
      const h = dayHeading(new Date(r.recordedAt));
      if (!out.length || out[out.length - 1].heading !== h) out.push({ heading: h, items: [] });
      out[out.length - 1].items.push(r);
    }
    return out;
  }, [newestFirst, showAll]);

  const tl = pregnancyTimeline?.isValid ? pregnancyTimeline : null;
  const latestLabel = latest ? readingLabel(getTier(latest.systolic, latest.diastolic)) : null;

  const Stat = ({ value, label }: { value: string; label: string }) => (
    <View style={{ flex: 1, gap: 2 }}>
      <Text style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink }}>{value}</Text>
      <Text style={{ fontFamily: FONT.regular, fontSize: 13, lineHeight: 17, color: t.muted }}>{label}</Text>
    </View>
  );

  return (
    <Page>
      <AppHeader
        title="Readings"
        subtitle="Your blood pressure over time"
        actions={
          <Button size="sm" href="/bp-entry" icon={(c) => <Ionicons name="add" size={18} color={c} />}>
            Log BP
          </Button>
        }
      />

      <PendingReadingsBanner />

      {isLoadingBP ? (
        <View style={{ gap: 12 }}>
          <Skeleton height={120} />
          <Skeleton height={220} />
        </View>
      ) : readings.length === 0 ? (
        <Card>
          <View style={{ gap: 12, alignItems: "flex-start" }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="pulse-outline" size={20} color={t.ink2} />
            </View>
            <T variant="h2">No readings yet</T>
            <T>
              Log your first blood pressure reading. Checking regularly is how problems are found early, often before you
              feel anything.
            </T>
            <Button href="/bp-entry">Log my first reading</Button>
          </View>
        </Card>
      ) : (
        <>
          {latest && latestLabel ? (
            <Card>
              <T variant="label">{`Latest · ${timeAgo(latest.recordedAt)}`}</T>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                <Text style={{ fontFamily: FONT.bold, fontSize: 40, lineHeight: 44, letterSpacing: -1, color: t.ink }}>
                  {latest.systolic}/{latest.diastolic}
                </Text>
                <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: t.muted }}>mmHg</Text>
                <Pill tone={latestLabel.tone}>{latestLabel.text}</Pill>
              </View>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: t.border }}>
                <Stat value={String(week.count)} label="readings this week" />
                <Stat value={String(week.high)} label="high this week" />
                <Stat value={week.highest ? `${week.highest.systolic}/${week.highest.diastolic}` : "–"} label="highest this week" />
              </View>
            </Card>
          ) : null}

          {(trendAlerts ?? []).slice(0, 2).map((a) => (
            <Banner key={a.id ?? `${a.type}-${a.detectedAt}`} tone={a.type === "SUDDEN_SPIKE" ? "red" : "amber"}>
              {a.message}
            </Banner>
          ))}

          {readings.length >= 2 ? (
            <Card>
              <T variant="h2" style={{ marginBottom: 8 }}>{`Last ${Math.min(readings.length, 14)} readings`}</T>
              <BPChart readings={readings} />
            </Card>
          ) : null}

          <SectionHeader title="All readings" />
          <Card>
            {groups.map((g, gi) => (
              <View key={g.heading} style={{ marginTop: gi ? 16 : 0 }}>
                <T variant="label" style={{ marginBottom: 4 }}>
                  {g.heading}
                </T>
                {g.items.map((r, i) => {
                  const label = readingLabel(getTier(r.systolic, r.diastolic));
                  return (
                    <View
                      key={r.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                        borderBottomWidth: i < g.items.length - 1 ? 1 : 0,
                        borderBottomColor: t.border,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>
                          {r.systolic}/{r.diastolic}
                          <Text style={{ fontFamily: FONT.medium, fontSize: 14, color: t.muted }}> mmHg</Text>
                        </Text>
                        <T variant="small">
                          {new Date(r.recordedAt).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </T>
                      </View>
                      <Pill tone={label.tone}>{label.text}</Pill>
                    </View>
                  );
                })}
              </View>
            ))}
          </Card>
          {!showAll && newestFirst.length > 15 ? (
            <Button variant="secondary" block onPress={() => setShowAll(true)}>
              {`Show ${newestFirst.length - 15} older readings`}
            </Button>
          ) : null}
        </>
      )}

      <SectionHeader title="Symptoms" />
      <Card>
        {recentSymptoms && recentSymptoms.length > 0 ? (
          recentSymptoms.slice(0, 5).map((s: any, i: number) => (
            <View key={s.id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: t.border, paddingTop: i ? 10 : 0 }}>
              <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>
                {prettySymptom(s.symptomType, s.customSymptom)}
              </Text>
              <T variant="small">{timeAgo(s.recordedAt ?? s.createdAt)}</T>
            </View>
          ))
        ) : (
          <T>No symptoms reported recently.</T>
        )}
        <Pressable
          onPress={() => router.push("/symptom-checker")}
          accessibilityRole="link"
          style={{ flexDirection: "row", alignItems: "center", gap: 14, minHeight: 56, marginTop: 8 }}
        >
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.surface2, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="medkit-outline" size={20} color={t.ink2} />
          </View>
          <Text style={{ flex: 1, fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>Report how you feel</Text>
          <Ionicons name="chevron-forward" size={20} color={t.muted} />
        </Pressable>
      </Card>

      {tl ? (
        <Card flat>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>
              {`${tl.currentWeek} weeks · ${tl.trimesterLabel}`}
            </Text>
            <T variant="small">
              {`Due ${new Date(tl.estimatedDueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`}
            </T>
          </View>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel="Weeks of pregnancy"
            accessibilityValue={{ min: 0, max: 40, now: Math.min(tl.currentWeek, 40) }}
            style={{ height: 8, borderRadius: 999, backgroundColor: t.surface2, overflow: "hidden", marginTop: 12 }}
          >
            <View style={{ height: "100%", width: `${Math.min((tl.currentWeek / 40) * 100, 100)}%`, backgroundColor: t.green, borderRadius: 999 }} />
          </View>
        </Card>
      ) : null}
    </Page>
  );
}
