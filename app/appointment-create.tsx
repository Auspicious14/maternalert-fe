import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AppHeader, Banner, Button, Card, FONT, Page, T, useTokens } from "../components/ds";
import { useToast } from "../components/ui/ToastProvider";
import { useAppointments } from "../hooks/useAppointments";
import { APPOINTMENT_TYPES, AppointmentType, localToIso } from "../services/appointmentCopy";

// Same screen as maternalert-web/src/app/(patient)/appointment-create/page.tsx
// No native date/time picker is installed, so: quick choices + typed values.

const pad = (n: number) => String(n).padStart(2, "0");
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const inDays = (n: number) => isoDay(new Date(Date.now() + n * 86_400_000));
const DATE_PRESETS = [
  { label: "Tomorrow", days: 1 },
  { label: "In 1 week", days: 7 },
  { label: "In 2 weeks", days: 14 },
  { label: "In 4 weeks", days: 28 },
];
const TIME_PRESETS = ["08:00", "09:00", "10:00", "12:00", "14:00"];

/** "03/11/2026" -> "2026-11-03" */
function dmyToIso(v: string): string {
  const m = v.trim().match(/^(\d{1,2})[/.\- ](\d{1,2})[/.\- ](\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
}
const isoToDmy = (v: string) => (v ? v.split("-").reverse().join("/") : "");

function Chip({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
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
      <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#fff" : t.ink2 }}>{label}</Text>
    </Pressable>
  );
}

function Label({ children }: { children: string }) {
  const t = useTokens();
  return <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{children}</Text>;
}

export default function AppointmentCreateScreen() {
  const router = useRouter();
  const t = useTokens();
  const { showToast } = useToast();
  const { createAppointment, isCreatingAppointment } = useAppointments();

  const [type, setType] = useState<AppointmentType>("ANC");
  const [title, setTitle] = useState("Antenatal visit");
  const [date, setDate] = useState(isoToDmy(inDays(1)));
  const [time, setTime] = useState("09:00");
  const [place, setPlace] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const input = {
    fontFamily: FONT.regular,
    fontSize: 16,
    color: t.ink,
    backgroundColor: t.surface,
    borderWidth: 1.5,
    borderColor: t.borderStrong,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 48,
  };

  const chooseType = (v: AppointmentType) => {
    const prev = APPOINTMENT_TYPES.find((x) => x.value === type)?.defaultTitle;
    setType(v);
    if (!title.trim() || title === prev) setTitle(APPOINTMENT_TYPES.find((x) => x.value === v)?.defaultTitle ?? "");
  };

  const save = async () => {
    const iso = localToIso(dmyToIso(date), time.trim());
    if (!title.trim()) return setError("Please give the appointment a name, for example “Antenatal visit”.");
    if (!iso) return setError("Please enter the date like 03/11/2026 and the time like 09:30.");
    if (new Date(iso).getTime() < Date.now() - 60_000) return setError("That date and time has already passed.");
    setError(null);
    try {
      await createAppointment({ type, title: title.trim(), dateTime: iso, location: place.trim() || undefined, notes: notes.trim() || undefined });
      showToast({ type: "success", message: "Appointment added. We'll remind you the day before." });
      router.replace("/appointments");
    } catch {
      setError("We couldn't save the appointment. Check your internet and try again.");
    }
  };

  return (
    <Page>
      <AppHeader title="Add an appointment" onBack={() => router.back()} />
      <Card>
        <View style={{ gap: 18 }}>
          <View style={{ gap: 8 }}>
            <Label>What is it?</Label>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {APPOINTMENT_TYPES.map((o) => (
                <Chip key={o.value} on={type === o.value} label={o.label} onPress={() => chooseType(o.value)} />
              ))}
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <Label>Name</Label>
            <TextInput accessibilityLabel="Appointment name" value={title} onChangeText={setTitle} maxLength={100} style={input} />
          </View>
          <View style={{ gap: 8 }}>
            <Label>Date</Label>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {DATE_PRESETS.map((p) => (
                <Chip key={p.label} on={date === isoToDmy(inDays(p.days))} label={p.label} onPress={() => setDate(isoToDmy(inDays(p.days)))} />
              ))}
            </View>
            <TextInput
              accessibilityLabel="Date, day month year"
              keyboardType="numbers-and-punctuation"
              placeholder="DD/MM/YYYY"
              placeholderTextColor={t.muted}
              value={date}
              onChangeText={setDate}
              maxLength={10}
              style={input}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label>Time</Label>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TIME_PRESETS.map((p) => (
                <Chip key={p} on={time === p} label={p} onPress={() => setTime(p)} />
              ))}
            </View>
            <TextInput
              accessibilityLabel="Time, 24-hour, for example 14:30"
              keyboardType="numbers-and-punctuation"
              placeholder="HH:MM"
              placeholderTextColor={t.muted}
              value={time}
              onChangeText={setTime}
              maxLength={5}
              style={input}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label>Where (optional)</Label>
            <TextInput
              accessibilityLabel="Where"
              placeholder="e.g. General Hospital, ANC clinic"
              placeholderTextColor={t.muted}
              value={place}
              onChangeText={setPlace}
              maxLength={150}
              style={input}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label>Notes (optional)</Label>
            <TextInput
              accessibilityLabel="Notes"
              placeholder="e.g. Bring urine sample, go fasting"
              placeholderTextColor={t.muted}
              value={notes}
              onChangeText={setNotes}
              maxLength={300}
              multiline
              style={[input, { minHeight: 88, paddingTop: 12, textAlignVertical: "top" }]}
            />
          </View>
          {error ? <Banner tone="red">{error}</Banner> : null}
          <Button size="lg" block onPress={save} loading={isCreatingAppointment} disabled={isCreatingAppointment}>
            Save appointment
          </Button>
          <T variant="small" style={{ textAlign: "center" }}>
            Times are in your phone's time zone.
          </T>
        </View>
      </Card>
    </Page>
  );
}
