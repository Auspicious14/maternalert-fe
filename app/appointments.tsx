import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AppHeader, Banner, Button, Card, FONT, Page, Pill, SectionHeader, Skeleton, StatusHero, T, useTokens } from "../components/ds";
import { useToast } from "../components/ui/ToastProvider";
import { Appointment, useAppointments } from "../hooks/useAppointments";
import { fmtDay, fmtTime, isUpcoming, statusLabel, typeLabel } from "../services/appointmentCopy";

// Same screen as maternalert-web/src/app/(patient)/appointments/page.tsx

function AppointmentItem({ a, last, onCancel, cancelling }: { a: Appointment; last?: boolean; onCancel?: () => void; cancelling?: boolean }) {
  const t = useTokens();
  const [confirm, setConfirm] = useState(false);
  const d = new Date(a.dateTime);
  const st = statusLabel(a.status, a.dateTime);
  const where = a.facilityName || a.location;
  return (
    <View style={{ flexDirection: "row", gap: 14, paddingVertical: 14, borderBottomWidth: last ? 0 : 1, borderBottomColor: t.border }}>
      <View style={{ width: 52, height: 56, borderRadius: 14, backgroundColor: t.mint, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: FONT.semibold, fontSize: 12, letterSpacing: 0.7, textTransform: "uppercase", color: t.greenInk }}>
          {d.toLocaleDateString("en-GB", { month: "short" })}
        </Text>
        <Text style={{ fontFamily: FONT.bold, fontSize: 22, lineHeight: 24, color: t.greenInk }}>{d.getDate()}</Text>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{a.title || typeLabel(a.type)}</Text>
        <T variant="small">{`${fmtDay(a.dateTime)}, ${fmtTime(a.dateTime)}`}</T>
        {where ? <T variant="small">{where}</T> : null}
        {a.notes ? <T variant="small" style={{ marginTop: 2 }}>{a.notes}</T> : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
          <Pill tone={st.tone}>{st.text}</Pill>
          <Pill>{a.appointmentSource === "FACILITY" ? "From your clinic" : "Added by you"}</Pill>
        </View>
        {onCancel ? (
          confirm ? (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <View style={{ flex: 1 }}>
                <Button size="sm" block variant="danger" onPress={onCancel} loading={cancelling}>
                  Cancel it
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button size="sm" block variant="secondary" onPress={() => setConfirm(false)}>
                  Keep it
                </Button>
              </View>
            </View>
          ) : (
            <Pressable onPress={() => setConfirm(true)} accessibilityRole="button" style={{ minHeight: 40, justifyContent: "center", alignSelf: "flex-start" }}>
              <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>Cancel appointment</Text>
            </Pressable>
          )
        ) : null}
      </View>
    </View>
  );
}

export default function AppointmentsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    appointments,
    isLoadingAppointments,
    isAppointmentsError,
    isFacilityLinkRequired,
    refetchAppointments,
    cancelAppointment,
    isCancelingAppointment,
  } = useAppointments();
  const [showPast, setShowPast] = useState(false);

  const { upcoming, past } = useMemo(() => {
    const list = [...(appointments ?? [])];
    return {
      upcoming: list.filter(isUpcoming).sort((a, b) => +new Date(a.dateTime) - +new Date(b.dateTime)),
      past: list.filter((a) => !isUpcoming(a)).sort((a, b) => +new Date(b.dateTime) - +new Date(a.dateTime)),
    };
  }, [appointments]);

  const cancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      showToast({ type: "success", message: "Appointment cancelled." });
    } catch {
      showToast({ type: "error", message: "We couldn't cancel it. Please try again." });
    }
  };

  const next = upcoming[0];

  return (
    <Page>
      <AppHeader
        title="Appointments"
        onBack={() => router.back()}
        actions={
          <Button size="sm" href="/appointment-create" icon={(c) => <Ionicons name="add" size={18} color={c} />}>
            Add
          </Button>
        }
      />

      {isLoadingAppointments ? (
        <View style={{ gap: 12 }}>
          <Skeleton height={130} />
          <Skeleton height={200} />
        </View>
      ) : isFacilityLinkRequired ? (
        <Card>
          <T variant="h2">Link your clinic to see appointments</T>
          <T style={{ marginTop: 8, marginBottom: 14 }}>
            Your clinic's appointments appear here once you're linked. You can still add your own reminders.
          </T>
          <View style={{ gap: 10 }}>
            <Button block href="/facility-linking">
              Link my clinic
            </Button>
            <Button block variant="secondary" href="/appointment-create">
              Add my own
            </Button>
          </View>
        </Card>
      ) : isAppointmentsError ? (
        <View style={{ gap: 10 }}>
          <Banner tone="amber">We couldn't load your appointments. Check your internet and try again.</Banner>
          <Button variant="secondary" onPress={() => refetchAppointments()}>
            Try again
          </Button>
        </View>
      ) : (
        <>
          {next ? (
            <StatusHero
              tone="green"
              kicker={`Next appointment · ${statusLabel(next.status, next.dateTime).text}`}
              title={next.title || typeLabel(next.type)}
              message={`${fmtDay(next.dateTime)} at ${fmtTime(next.dateTime)}${
                next.facilityName || next.location ? ` · ${next.facilityName || next.location}` : ""
              }. Bring your antenatal card. If you can't go, tell your clinic so they can rebook you.`}
              icon="calendar-outline"
            />
          ) : (
            <Card>
              <T variant="h2">No upcoming appointments</T>
              <T style={{ marginTop: 8, marginBottom: 14 }}>
                Add your next antenatal visit, scan or test so we can remind you the day before.
              </T>
              <Button href="/appointment-create" icon={(c) => <Ionicons name="add" size={18} color={c} />}>
                Add an appointment
              </Button>
            </Card>
          )}

          {upcoming.length ? (
            <>
              <SectionHeader title="Coming up" />
              <Card>
                {upcoming.map((a, i) => (
                  <AppointmentItem
                    key={a.id}
                    a={a}
                    last={i === upcoming.length - 1}
                    cancelling={isCancelingAppointment}
                    onCancel={a.appointmentSource === "PATIENT" ? () => cancel(a.id) : undefined}
                  />
                ))}
              </Card>
            </>
          ) : null}

          {past.length ? (
            showPast ? (
              <>
                <SectionHeader title="Past" />
                <Card>
                  {past.map((a, i) => (
                    <AppointmentItem key={a.id} a={a} last={i === past.length - 1} />
                  ))}
                </Card>
              </>
            ) : (
              <Button variant="secondary" block onPress={() => setShowPast(true)}>
                {`Show past appointments (${past.length})`}
              </Button>
            )
          ) : null}
        </>
      )}
    </Page>
  );
}
