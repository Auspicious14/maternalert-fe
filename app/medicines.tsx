import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Linking, Text, TextInput, View } from "react-native";

import { AppHeader, Banner, Button, Card, FONT, Page, Pill, Pressable, SectionHeader, Skeleton, T, useTokens } from "../components/ds";
import { Spot, useTone } from "../components/learn/LearnBits";
import { useLang } from "../hooks/useLang";
import { useMedicines } from "../hooks/useMedicines";
import { useUserProfile } from "../hooks/useUserProfile";
import { tr } from "../services/i18n";
import {
  DEFAULT_TIMES,
  effectLabel,
  KINDS,
  medName,
  MISSED_REASONS,
  missedLabel,
  prettyTime,
  SEVERITIES,
  SIDE_EFFECTS,
  sideEffectAdvice,
  type Advice,
  type MedicationKind,
  type MedicationRow,
  type MedicinesSummary,
  type Severity,
  type SideEffectKind,
} from "../services/medicines";
import { prettyDate, pregnancyFor } from "../services/pregnancy/pregnancyDay";

// Same screen as maternalert-web/src/app/(patient)/medicines/page.tsx
// No native time/date picker is installed: times step by 30 minutes, and the
// refill date is a quick choice.

const fmt = (iso: string) => prettyDate(new Date(iso));
const pad = (n: number) => String(n).padStart(2, "0");
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const inDays = (n: number) => isoDay(new Date(Date.now() + n * 86_400_000));

function stepTime(hhmm: string, by: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const mins = (((h * 60 + m + by) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
}

function Chip({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={{
        minHeight: 44,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: on ? t.green : t.borderStrong,
        backgroundColor: on ? t.green : t.surface,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#FFFFFF" : t.ink2 }}>{label}</Text>
    </Pressable>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  const t = useTokens();
  return <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink, marginBottom: 8 }}>{children}</Text>;
}

/** "8:00 am" with − and + (30 minutes). */
function TimeStepper({ value, onChange, n }: { value: string; onChange: (v: string) => void; n: number }) {
  const t = useTokens();
  const btn = (icon: "remove" | "add", by: number, label: string) => (
    <Pressable
      onPress={() => onChange(stepTime(value, by))}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: t.surface2 }}
    >
      <Ionicons name={icon} size={20} color={t.ink} />
    </Pressable>
  );
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 6, borderRadius: 999, borderWidth: 1.5, borderColor: t.borderStrong, alignSelf: "flex-start" }}>
      {btn("remove", -30, tr({ en: `Dose ${n} earlier`, pcm: `Dose ${n} early`, yo: `Ìwọ̀n ${n} ní kùtùkùtù` }))}
      <Text style={{ fontFamily: FONT.bold, fontSize: 16, color: t.ink, minWidth: 74, textAlign: "center" }}>{prettyTime(value)}</Text>
      {btn("add", 30, tr({ en: `Dose ${n} later`, pcm: `Dose ${n} late`, yo: `Ìwọ̀n ${n} ní ìgbà tó pẹ́` }))}
    </View>
  );
}

function RefillChoice({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opts = [
    { label: tr({ en: "In 1 week", pcm: "1 week", yo: "Ọ̀sẹ̀ kan" }), v: inDays(7) },
    { label: tr({ en: "In 2 weeks", pcm: "2 weeks", yo: "Ọ̀sẹ̀ méjì" }), v: inDays(14) },
    { label: tr({ en: "In 1 month", pcm: "1 month", yo: "Oṣù kan" }), v: inDays(30) },
    { label: tr({ en: "Not sure", pcm: "I no know", yo: "Kò dá mi lójú" }), v: "" },
  ];
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {opts.map((o) => (
        <Chip key={o.label} on={value === o.v} label={o.label} onPress={() => onChange(o.v)} />
      ))}
    </View>
  );
}

export default function MedicinesScreen() {
  const router = useRouter();
  const t = useTokens();
  useLang();
  const { data, isLoading, isError, refetch, log, undo } = useMedicines();
  const { profile } = useUserProfile() as any;
  const preg = useMemo(() => pregnancyFor(profile), [profile]);
  const butter = useTone("butter");
  const [adding, setAdding] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [missing, setMissing] = useState<string | null>(null);

  const active = (data?.medications ?? []).filter((m) => m.active);
  const doses = active
    .flatMap((m) => m.reminderTimes.map((time, slot) => ({ m, time, slot, log: m.today.find((x) => x.slot === slot) })))
    .sort((a, b) => a.time.localeCompare(b.time));
  const takenCount = doses.filter((d) => d.log?.status === "TAKEN").length;
  const showIptp = (data?.iptp.doses.length ?? 0) > 0 || (!!preg && preg.week >= 13);

  return (
    <Page>
      <AppHeader
        title={tr({ en: "Medicines", pcm: "Medicine", yo: "Àwọn oògùn" })}
        subtitle={tr({ en: "Reminders and a record for your clinic", pcm: "Reminder and record for your clinic", yo: "Ìránnilétí àti àkọsílẹ̀ fún kílíníìkì rẹ" })}
        onBack={() => router.back()}
      />

      {isError ? (
        <Banner tone="amber">
          {tr({ en: "We couldn't load your medicines. Pull down or try again.", pcm: "We no fit load your medicine. Try again.", yo: "A kò lè ṣí àwọn oògùn rẹ. Tún gbìyànjú." })}
        </Banner>
      ) : null}
      {isError ? (
        <Button variant="secondary" onPress={() => refetch()}>
          {tr({ en: "Try again", pcm: "Try again", yo: "Tún gbìyànjú" })}
        </Button>
      ) : null}
      {isLoading ? <Skeleton height={180} radius={24} /> : null}

      {data && !active.length && !adding ? (
        <View style={{ borderRadius: 32, padding: 20, alignItems: "center", backgroundColor: butter.bg }}>
          <Spot art="meds" size={120} />
          <Text style={{ fontFamily: FONT.bold, fontSize: 24, lineHeight: 28, color: t.ink, textAlign: "center", marginTop: 8 }}>
            {tr({ en: "Never miss your supplements", pcm: "No miss your supplement again", yo: "Má ṣe gbàgbé àwọn oògùn rẹ mọ́" })}
          </Text>
          <Text style={{ fontFamily: FONT.regular, fontSize: 16, lineHeight: 23, color: t.ink2, textAlign: "center", marginTop: 8 }}>
            {tr({
              en: "Add the iron, folic acid or other medicines your clinic gave you. We'll remind you, and your clinic can see how it's going.",
              pcm: "Add the iron, folic acid or other medicine wey your clinic give you. We go remind you, and your clinic go see how e dey go.",
              yo: "Fi iron, folic acid tàbí oògùn mìíràn tí kílíníìkì rẹ fún ọ kún un. A ó máa rán ọ létí, kílíníìkì rẹ yóò sì rí bí ó ṣe ń lọ.",
            })}
          </Text>
          <View style={{ marginTop: 16 }}>
            <Button onPress={() => setAdding(true)} icon={(c) => <Ionicons name="add" size={18} color={c} />}>
              {tr({ en: "Add a medicine", pcm: "Add medicine", yo: "Fi oògùn kún un" })}
            </Button>
          </View>
        </View>
      ) : null}

      {doses.length ? (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
            <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink }}>
              {tr({ en: "Today", pcm: "Today", yo: "Òní" })}
            </Text>
            <Text style={{ fontFamily: FONT.bold, fontSize: 13, color: t.muted }}>
              {tr({ en: `${takenCount} of ${doses.length} taken`, pcm: `${takenCount} of ${doses.length} taken`, yo: `${takenCount} nínú ${doses.length} ti lò` })}
            </Text>
          </View>
          {doses.map(({ m, time, slot, log: l }) => {
            const key = `${m.id}:${slot}`;
            const bg = l?.status === "TAKEN" ? t.mint : l?.status === "MISSED" ? t.amberBg : t.surface;
            return (
              <View key={key} style={{ padding: 14, paddingHorizontal: 16, borderRadius: 22, backgroundColor: bg, borderWidth: l ? 0 : 1, borderColor: t.border, gap: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT.bold, fontSize: 13, color: t.muted }}>{prettyTime(time)}</Text>
                    <Text style={{ fontFamily: FONT.bold, fontSize: 17, color: t.ink }}>{medName(m)}</Text>
                    {m.doseText ? <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.ink2 }}>{m.doseText}</Text> : null}
                  </View>
                  {l ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flexShrink: 1 }}>
                      {l.status === "TAKEN" ? <Ionicons name="checkmark" size={16} color={t.greenInk} /> : null}
                      <Text style={{ fontFamily: FONT.bold, fontSize: 14, color: l.status === "TAKEN" ? t.greenInk : t.amberInk, flexShrink: 1 }}>
                        {l.status === "TAKEN"
                          ? tr({ en: "Taken", pcm: "I don take am", yo: "Mo ti lò ó" })
                          : `${tr({ en: "Missed", pcm: "I miss am", yo: "Mo pàdánù rẹ̀" })}${l.missedReason ? ` · ${missedLabel(l.missedReason)}` : ""}`}
                      </Text>
                      <Pressable
                        onPress={() => undo.mutate({ id: m.id, day: data!.today, slot })}
                        accessibilityRole="button"
                        accessibilityLabel={tr({ en: "Undo", pcm: "Undo", yo: "Dá a padà" })}
                        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
                      >
                        <Ionicons name="arrow-undo-outline" size={18} color={t.muted} />
                      </Pressable>
                    </View>
                  ) : missing === key ? null : (
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Button size="sm" onPress={() => log.mutate({ id: m.id, day: data!.today, slot, status: "TAKEN" })}>
                        {tr({ en: "Taken", pcm: "I don take am", yo: "Mo ti lò ó" })}
                      </Button>
                      <Button size="sm" variant="secondary" onPress={() => setMissing(key)}>
                        {tr({ en: "Missed", pcm: "I miss am", yo: "Mo pàdánù rẹ̀" })}
                      </Button>
                    </View>
                  )}
                </View>
                {!l && missing === key ? (
                  <View style={{ gap: 8 }}>
                    <Text style={{ fontFamily: FONT.semibold, fontSize: 14, color: t.ink2 }}>
                      {tr({ en: "Why did you miss it?", pcm: "Why you miss am?", yo: "Kí ló dé tí o fi pàdánù rẹ̀?" })}
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                      {MISSED_REASONS().map((r) => (
                        <Chip
                          key={r.v}
                          on={false}
                          label={r.label}
                          onPress={() => {
                            setMissing(null);
                            log.mutate({ id: m.id, day: data!.today, slot, status: "MISSED", missedReason: r.v });
                          }}
                        />
                      ))}
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}

      {data && showIptp ? <IptpCard data={data} week={preg?.week ?? null} /> : null}

      {active.length ? (
        <View style={{ gap: 10 }}>
          <SectionHeader title={tr({ en: "Your medicines", pcm: "Your medicine", yo: "Àwọn oògùn rẹ" })} />
          {active.map((m) => (
            <MedicineCard key={m.id} m={m} />
          ))}
        </View>
      ) : null}

      {adding ? <AddMedicine onDone={() => setAdding(false)} /> : null}

      {data && active.length && !adding ? (
        <Button variant="secondary" block onPress={() => setAdding(true)} icon={(c) => <Ionicons name="add" size={18} color={c} />}>
          {tr({ en: "Add another medicine", pcm: "Add another medicine", yo: "Fi oògùn mìíràn kún un" })}
        </Button>
      ) : null}

      {data ? (
        reporting ? (
          <ReportSideEffect meds={active} onClose={() => setReporting(false)} />
        ) : (
          <Pressable
            onPress={() => setReporting(true)}
            accessibilityRole="button"
            style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 14, paddingHorizontal: 16, borderRadius: 24, borderWidth: 1.5, borderColor: "#F7CDD0", backgroundColor: t.redBg }}
          >
            <Spot art="alert" size={56} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT.bold, fontSize: 16, color: t.ink }}>
                {tr({ en: "Feeling unwell after a medicine?", pcm: "Medicine dey make you feel bad?", yo: "Ṣé oògùn kan ń mú ara rẹ dàrú?" })}
              </Text>
              <Text style={{ fontFamily: FONT.semibold, fontSize: 14, color: t.redInk, marginTop: 2 }}>
                {tr({ en: "Tell us, and see what to do", pcm: "Tell us, and see wetin to do", yo: "Sọ fún wa, kí o sì rí ohun tí o máa ṣe" })}
              </Text>
            </View>
          </Pressable>
        )
      ) : null}

      {data?.sideEffects.length ? (
        <View style={{ gap: 8 }}>
          <SectionHeader title={tr({ en: "Side effects you reported", pcm: "Side effect wey you report", yo: "Àwọn àbájáde tí o ròyìn" })} />
          {data.sideEffects.slice(0, 5).map((s) => (
            <View key={s.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap", padding: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
              <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{effectLabel(s.effect)}</Text>
              <Pill tone={s.severity === "SEVERE" ? "red" : s.severity === "MODERATE" ? "amber" : "neutral"}>{SEVERITIES().find((x) => x.v === s.severity)?.label ?? ""}</Pill>
              <Text style={{ marginLeft: "auto", fontFamily: FONT.regular, fontSize: 13, color: t.muted }}>{fmt(s.createdAt)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <T variant="small" style={{ textAlign: "center" }}>
        {tr({
          en: "MaternAlert reminds you; it never changes your medicines. Your clinic can see what you record here.",
          pcm: "MaternAlert dey remind you; e no dey change your medicine. Your clinic fit see wetin you record here.",
          yo: "MaternAlert ń rán ọ létí; kò yí oògùn rẹ padà. Kílíníìkì rẹ lè rí ohun tí o kọ síbí.",
        })}
      </T>
    </Page>
  );
}

function IptpCard({ data, week }: { data: MedicinesSummary; week: number | null }) {
  const t = useTokens();
  const sky = useTone("sky");
  const doses = data.iptp.doses;
  const last = doses[doses.length - 1];
  const next = data.iptp.nextDueAt ? new Date(data.iptp.nextDueAt) : null;
  const overdue = !!next && next.getTime() < Date.now() - 86_400_000;
  const body = { fontFamily: FONT.regular, fontSize: 16, lineHeight: 23, color: t.ink } as const;
  return (
    <View style={{ padding: 18, borderRadius: 28, backgroundColor: sky.bg }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 19, color: t.ink, flexShrink: 1 }}>
          {tr({ en: "Malaria prevention (IPTp)", pcm: "Malaria prevention (IPTp)", yo: "Ìdènà ibà (IPTp)" })}
        </Text>
        <Spot art="meds" size={52} style={{ marginVertical: -8 }} />
      </View>
      {doses.length ? (
        <>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {doses.map((d) => (
              <View key={d.id} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: sky.ink, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontFamily: FONT.bold, fontSize: 15, color: t.surface }}>{d.doseNumber}</Text>
              </View>
            ))}
          </View>
          <Text style={[body, { marginTop: 10 }]}>
            {tr({ en: `Last dose: ${fmt(last.givenAt)}. `, pcm: `Last dose: ${fmt(last.givenAt)}. `, yo: `Ìwọ̀n tó kẹ́yìn: ${fmt(last.givenAt)}. ` })}
            {next ? (
              <Text style={{ fontFamily: FONT.bold }}>
                {overdue
                  ? tr({ en: `Your next dose was due on ${prettyDate(next)}. Please visit your clinic.`, pcm: `Your next dose suppose happen ${prettyDate(next)}. Abeg go your clinic.`, yo: `Ìwọ̀n tó kàn yẹ kí ó wáyé ní ${prettyDate(next)}. Jọ̀wọ́ lọ sí kílíníìkì rẹ.` })
                  : tr({ en: `Next dose due: ${prettyDate(next)}.`, pcm: `Next dose: ${prettyDate(next)}.`, yo: `Ìwọ̀n tó kàn: ${prettyDate(next)}.` })}
              </Text>
            ) : null}
          </Text>
        </>
      ) : (
        <Text style={[body, { marginTop: 8 }]}>
          {tr({
            en: `${week ? `You're ${week} weeks. ` : ""}From 13 weeks, pregnant women in Nigeria are offered medicine to prevent malaria (IPTp-SP) at the clinic. Ask at your next visit.`,
            pcm: `${week ? `You don reach ${week} weeks. ` : ""}From 13 weeks, clinic dey give pregnant women medicine to prevent malaria (IPTp-SP). Ask when you go next.`,
            yo: `${week ? `O ti pé ọ̀sẹ̀ ${week}. ` : ""}Láti ọ̀sẹ̀ 13, kílíníìkì ń fún aláboyún ní oògùn ìdènà ibà (IPTp-SP). Béèrè nígbà tí o bá lọ.`,
          })}
        </Text>
      )}
      <T variant="small" style={{ marginTop: 10 }}>
        {tr({
          en: "Your clinic gives and records each dose. We remind you when the next one is due.",
          pcm: "Your clinic dey give and record every dose. We go remind you when the next one reach.",
          yo: "Kílíníìkì rẹ ló ń fúnni, tí ó sì ń kọ ìwọ̀n kọ̀ọ̀kan sílẹ̀. A ó rán ọ létí nígbà tí èyí tó kàn bá tó.",
        })}
      </T>
    </View>
  );
}

function MedicineCard({ m }: { m: MedicationRow }) {
  const t = useTokens();
  const butter = useTone("butter");
  const { update } = useMedicines();
  const [editing, setEditing] = useState(false);
  const [times, setTimes] = useState<string[]>(m.reminderTimes);
  const [refill, setRefill] = useState(m.refillDate ? m.refillDate.slice(0, 10) : "");
  const a = m.adherence7d;

  return (
    <View style={{ padding: 16, borderRadius: 24, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
        <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: butter.bg, alignItems: "center", justifyContent: "center" }}>
          <Spot art="meds" size={44} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: FONT.bold, fontSize: 17, color: t.ink }}>{medName(m)}</Text>
          <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.muted }}>
            {m.doseText ? `${m.doseText} · ` : ""}
            {m.reminderTimes.map(prettyTime).join(", ")}
          </Text>
          {m.addedBy === "CLINIC" ? (
            <View style={{ alignSelf: "flex-start", marginTop: 4 }}>
              <Pill tone="green">{tr({ en: "From your clinic", pcm: "From your clinic", yo: "Láti kílíníìkì rẹ" })}</Pill>
            </View>
          ) : null}
        </View>
        <Pressable
          onPress={() => update.mutate({ id: m.id, remindersOn: !m.remindersOn })}
          accessibilityRole="switch"
          accessibilityState={{ checked: m.remindersOn }}
          accessibilityLabel={tr({ en: "Reminders", pcm: "Reminder", yo: "Ìránnilétí" })}
          style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: t.border, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name={m.remindersOn ? "notifications-outline" : "notifications-off-outline"} size={19} color={t.ink} />
        </Pressable>
      </View>

      {a ? (
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontFamily: FONT.semibold, fontSize: 13, color: t.muted }}>
            {tr({ en: `Taken ${a.taken} of ${a.expected} in the last 7 days`, pcm: `You take ${a.taken} out of ${a.expected} for last 7 days`, yo: `O lò ó ní ${a.taken} nínú ${a.expected} ní ọjọ́ méje sẹ́yìn` })}
          </Text>
          <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: a.percent }} style={{ height: 8, borderRadius: 99, backgroundColor: t.mint, marginTop: 8, overflow: "hidden" }}>
            <View style={{ width: `${a.percent}%` as any, height: "100%", borderRadius: 99, backgroundColor: t.green }} />
          </View>
        </View>
      ) : null}

      {m.refillDate ? (
        <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.muted, marginTop: 10 }}>
          {tr({ en: "Refill by", pcm: "Buy more by", yo: "Ra òmíràn kí ó tó di" })} <Text style={{ fontFamily: FONT.bold, color: t.ink }}>{fmt(m.refillDate)}</Text>
        </Text>
      ) : null}

      {editing ? (
        <View style={{ gap: 14, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: t.border }}>
          <View>
            <Label>{tr({ en: "Reminder times", pcm: "Reminder time", yo: "Àkókò ìránnilétí" })}</Label>
            <View style={{ gap: 8 }}>
              {times.map((x, i) => (
                <TimeStepper key={i} n={i + 1} value={x} onChange={(v) => setTimes(times.map((y, j) => (j === i ? v : y)))} />
              ))}
            </View>
          </View>
          <View>
            <Label>{tr({ en: "When will it run out?", pcm: "When e go finish?", yo: "Ìgbà wo ni yóò tán?" })}</Label>
            <RefillChoice value={refill} onChange={setRefill} />
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              size="sm"
              loading={update.isPending}
              onPress={() => update.mutate({ id: m.id, timesPerDay: times.length, reminderTimes: times, refillDate: refill }, { onSuccess: () => setEditing(false) })}
            >
              {tr({ en: "Save", pcm: "Save", yo: "Fi pamọ́" })}
            </Button>
            <Button size="sm" variant="secondary" onPress={() => setEditing(false)}>
              {tr({ en: "Cancel", pcm: "Cancel", yo: "Fagilé" })}
            </Button>
          </View>
          <Pressable onPress={() => update.mutate({ id: m.id, active: false })} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center" }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.redInk }}>{tr({ en: "I've stopped taking this", pcm: "I don stop to take am", yo: "Mo ti dá a dúró" })}</Text>
          </Pressable>
          {m.addedBy === "CLINIC" ? (
            <T variant="small">
              {tr({
                en: "Your clinic added this. Only stop if a health worker told you to.",
                pcm: "Na your clinic add am. Only stop if health worker talk say make you stop.",
                yo: "Kílíníìkì rẹ ló fi èyí kún un. Dá a dúró tí òṣìṣẹ́ ìlera bá sọ bẹ́ẹ̀ nìkan.",
              })}
            </T>
          ) : null}
        </View>
      ) : (
        <Pressable onPress={() => setEditing(true)} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center", marginTop: 4 }}>
          <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>
            {tr({ en: "Change times or refill date", pcm: "Change time or date to buy more", yo: "Yí àkókò tàbí ọjọ́ àtúnrà padà" })}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function AddMedicine({ onDone }: { onDone: () => void }) {
  const t = useTokens();
  const { add } = useMedicines();
  const [kind, setKind] = useState<MedicationKind | null>(null);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [times, setTimes] = useState<string[]>(DEFAULT_TIMES[1]);
  const [refill, setRefill] = useState("");
  const [error, setError] = useState<string | null>(null);
  const picked = KINDS().find((k) => k.kind === kind);

  const save = () => {
    if (!kind) return setError(tr({ en: "Choose a medicine.", pcm: "Choose medicine.", yo: "Yan oògùn kan." }));
    if (kind === "OTHER" && name.trim().length < 2) return setError(tr({ en: "Write the medicine's name.", pcm: "Write the medicine name.", yo: "Kọ orúkọ oògùn náà." }));
    setError(null);
    add.mutate(
      { kind, name: kind === "OTHER" ? name.trim() : undefined, timesPerDay: count, reminderTimes: times, refillDate: refill || undefined },
      {
        onSuccess: onDone,
        onError: (e: any) => {
          const m = e?.response?.data?.message;
          setError(Array.isArray(m) ? m.join(". ") : m || tr({ en: "We couldn't save it. Try again.", pcm: "We no fit save am. Try again.", yo: "A kò lè fi pamọ́. Tún gbìyànjú." }));
        },
      },
    );
  };

  return (
    <Card>
      <View style={{ gap: 16 }}>
        <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink }}>
          {tr({ en: "Add a medicine", pcm: "Add medicine", yo: "Fi oògùn kún un" })}
        </Text>
        <View>
          <Label>{tr({ en: "Which one?", pcm: "Which one?", yo: "Èwo ni?" })}</Label>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {KINDS().map((k) => (
              <Chip key={k.kind} on={kind === k.kind} label={k.label} onPress={() => setKind(k.kind)} />
            ))}
          </View>
          {picked ? <T variant="small" style={{ marginTop: 8 }}>{picked.why}</T> : null}
        </View>
        {kind === "OTHER" ? (
          <View>
            <Label>{tr({ en: "Name on the pack", pcm: "Name wey dey the pack", yo: "Orúkọ tó wà lórí páálí" })}</Label>
            <TextInput
              value={name}
              onChangeText={setName}
              maxLength={120}
              accessibilityLabel={tr({ en: "Name on the pack", pcm: "Name wey dey the pack", yo: "Orúkọ tó wà lórí páálí" })}
              style={{ minHeight: 48, borderRadius: 14, borderWidth: 1.5, borderColor: t.borderStrong, paddingHorizontal: 14, fontFamily: FONT.regular, fontSize: 16, color: t.ink, backgroundColor: t.surface }}
            />
          </View>
        ) : null}
        <View>
          <Label>{tr({ en: "How many times a day did your clinic say?", pcm: "How many times for one day your clinic talk?", yo: "Ìgbà mélòó lójúmọ́ ni kílíníìkì rẹ sọ?" })}</Label>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[1, 2, 3, 4].map((n) => (
              <Chip
                key={n}
                on={count === n}
                label={`${n}×`}
                onPress={() => {
                  setCount(n);
                  setTimes(DEFAULT_TIMES[n]);
                }}
              />
            ))}
          </View>
        </View>
        <View>
          <Label>{tr({ en: "Remind me at", pcm: "Remind me by", yo: "Rán mi létí ní" })}</Label>
          <View style={{ gap: 8 }}>
            {times.map((x, i) => (
              <TimeStepper key={i} n={i + 1} value={x} onChange={(v) => setTimes(times.map((y, j) => (j === i ? v : y)))} />
            ))}
          </View>
        </View>
        <View>
          <Label>{tr({ en: "When will it run out?", pcm: "When e go finish?", yo: "Ìgbà wo ni yóò tán?" })}</Label>
          <RefillChoice value={refill} onChange={setRefill} />
          <T variant="small" style={{ marginTop: 6 }}>
            {tr({ en: "We'll remind you 3 days before.", pcm: "We go remind you 3 days before.", yo: "A ó rán ọ létí ní ọjọ́ mẹ́ta ṣáájú." })}
          </T>
        </View>
        {error ? <Banner tone="red">{error}</Banner> : null}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button onPress={save} loading={add.isPending}>
            {tr({ en: "Save", pcm: "Save", yo: "Fi pamọ́" })}
          </Button>
          <Button variant="secondary" onPress={onDone}>
            {tr({ en: "Cancel", pcm: "Cancel", yo: "Fagilé" })}
          </Button>
        </View>
      </View>
    </Card>
  );
}

function ReportSideEffect({ meds, onClose }: { meds: MedicationRow[]; onClose: () => void }) {
  const t = useTokens();
  const { reportSideEffect } = useMedicines();
  const [medId, setMedId] = useState<string | null>(meds.length === 1 ? meds[0].id : null);
  const [effect, setEffect] = useState<SideEffectKind | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [advice, setAdvice] = useState<Advice | null>(null);

  const submit = () => {
    if (!effect || !severity) return;
    setAdvice(sideEffectAdvice(effect, severity));
    reportSideEffect.mutate({ medicationId: medId ?? undefined, effect, severity });
  };

  if (advice) return <AdviceCard advice={advice} onClose={onClose} />;

  return (
    <Card>
      <View style={{ gap: 16 }}>
        <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink }}>
          {tr({ en: "How are you feeling?", pcm: "How you dey feel?", yo: "Báwo ni ara rẹ?" })}
        </Text>
        {meds.length > 1 ? (
          <View>
            <Label>{tr({ en: "After which medicine?", pcm: "After which medicine?", yo: "Lẹ́yìn oògùn wo?" })}</Label>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {meds.map((m) => (
                <Chip key={m.id} on={medId === m.id} label={medName(m)} onPress={() => setMedId(m.id)} />
              ))}
              <Chip on={medId === null} label={tr({ en: "Not sure", pcm: "I no sure", yo: "Kò dá mi lójú" })} onPress={() => setMedId(null)} />
            </View>
          </View>
        ) : null}
        <View>
          <Label>{tr({ en: "What are you feeling?", pcm: "Wetin you dey feel?", yo: "Kí lo ń ní?" })}</Label>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {SIDE_EFFECTS().map((s) => (
              <Chip key={s.v} on={effect === s.v} label={s.label} onPress={() => setEffect(s.v)} />
            ))}
          </View>
        </View>
        <View>
          <Label>{tr({ en: "How bad is it?", pcm: "How e bad reach?", yo: "Báwo ló ṣe le tó?" })}</Label>
          <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
            {SEVERITIES().map((s) => {
              const on = severity === s.v;
              return (
                <Pressable
                  key={s.v}
                  onPress={() => setSeverity(s.v)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: on ? t.green : t.border, backgroundColor: on ? t.mint : t.surface }}
                >
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? t.green : t.borderStrong, backgroundColor: on ? t.green : "transparent", alignItems: "center", justifyContent: "center" }}>
                    {on ? <Ionicons name="checkmark" size={13} color="#FFFFFF" /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{s.label}</Text>
                    <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.muted }}>{s.sub}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button onPress={submit} disabled={!effect || !severity}>
            {tr({ en: "See what to do", pcm: "See wetin to do", yo: "Wo ohun tí o máa ṣe" })}
          </Button>
          <Button variant="secondary" onPress={onClose}>
            {tr({ en: "Cancel", pcm: "Cancel", yo: "Fagilé" })}
          </Button>
        </View>
      </View>
    </Card>
  );
}

function AdviceCard({ advice, onClose }: { advice: Advice; onClose: () => void }) {
  const t = useTokens();
  const router = useRouter();
  if (advice.level === "GO_NOW") {
    return (
      <View accessibilityRole="alert" style={{ padding: 18, borderRadius: 26, backgroundColor: t.red }}>
        <Text style={{ fontFamily: FONT.bold, fontSize: 18, color: "#FFFFFF" }}>{advice.title}</Text>
        <Text style={{ fontFamily: FONT.regular, fontSize: 15, lineHeight: 21, color: "#FDE6E7", marginTop: 6 }}>{advice.body}</Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
          <Pressable
            onPress={() => Linking.openURL("tel:112")}
            accessibilityRole="button"
            style={{ flex: 1, minHeight: 48, borderRadius: 999, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Ionicons name="call" size={18} color={t.red} />
            <Text style={{ fontFamily: FONT.bold, fontSize: 15, color: t.red }}>{tr({ en: "Call 112", pcm: "Call 112", yo: "Pe 112" })}</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/clinic-finder")}
            accessibilityRole="button"
            style={{ flex: 1, minHeight: 48, borderRadius: 999, backgroundColor: t.redPress, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Ionicons name="location" size={18} color="#FFFFFF" />
            <Text style={{ fontFamily: FONT.bold, fontSize: 15, color: "#FFFFFF" }}>{tr({ en: "Nearest clinic", pcm: "Clinic wey near", yo: "Kílíníìkì tó súnmọ́" })}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  const amber = advice.level === "CALL_TODAY";
  return (
    <Card>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", gap: 12, padding: 16, borderRadius: 20, backgroundColor: amber ? t.amberBg : t.mint }}>
          <Ionicons name={amber ? "warning-outline" : "checkmark-circle-outline"} size={22} color={amber ? t.amberInk : t.greenInk} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT.bold, fontSize: 17, color: amber ? t.amberInk : t.greenInk }}>{advice.title}</Text>
            <Text style={{ fontFamily: FONT.medium, fontSize: 15, lineHeight: 21, color: amber ? t.amberInk : t.greenInk, marginTop: 4 }}>{advice.body}</Text>
          </View>
        </View>
        {advice.info ? <Text style={{ fontFamily: FONT.regular, fontSize: 16, lineHeight: 24, color: t.ink2 }}>{advice.info}</Text> : null}
        <Button variant="secondary" onPress={onClose}>
          {tr({ en: "Done", pcm: "Done", yo: "Ó parí" })}
        </Button>
      </View>
    </Card>
  );
}
