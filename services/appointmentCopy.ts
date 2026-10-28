/**
 * Appointment and notification helpers.
 * IDENTICAL in maternalert-web (src/services/appointmentCopy.ts) and
 * maternalert-fe (services/appointmentCopy.ts).
 */

export type AppointmentType = "ANC" | "LAB" | "SCAN" | "GENERAL";
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "MISSED" | "CANCELLED";

export const APPOINTMENT_TYPES: { value: AppointmentType; label: string; defaultTitle: string }[] = [
  { value: "ANC", label: "Antenatal visit", defaultTitle: "Antenatal visit" },
  { value: "SCAN", label: "Scan", defaultTitle: "Ultrasound scan" },
  { value: "LAB", label: "Lab test", defaultTitle: "Blood or urine test" },
  { value: "GENERAL", label: "Other", defaultTitle: "" },
];

export const typeLabel = (t: string) => APPOINTMENT_TYPES.find((x) => x.value === t)?.label ?? "Appointment";

export function statusLabel(status: AppointmentStatus, dateTime: string): { text: string; tone: "green" | "amber" | "red" | "neutral" } {
  if (status === "CANCELLED") return { text: "Cancelled", tone: "neutral" };
  if (status === "COMPLETED") return { text: "Attended", tone: "green" };
  if (status === "MISSED") return { text: "Missed", tone: "red" };
  const d = new Date(dateTime);
  const days = Math.floor((startOfDay(d) - startOfDay(new Date())) / 86_400_000);
  if (days < 0) return { text: "Past", tone: "neutral" };
  if (days === 0) return { text: "Today", tone: "amber" };
  if (days === 1) return { text: "Tomorrow", tone: "amber" };
  return { text: `In ${days} days`, tone: "green" };
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Upcoming = scheduled and not before today. */
export function isUpcoming(a: { status: string; dateTime: string }): boolean {
  return a.status === "SCHEDULED" && startOfDay(new Date(a.dateTime)) >= startOfDay(new Date());
}

/** "2026-11-03" + "09:30" in the phone's local time -> ISO with timezone. */
export function localToIso(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{1,2}:\d{2}$/.test(time)) return null;
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const dt = new Date(y, m - 1, d, hh, mm);
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
}

export function fmtDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
}

// ── Notifications ───────────────────────────────────────────────────────────

export type NotificationType = "CARE_PRIORITY" | "BP_ALERT" | "SYMPTOM_ALERT" | "REMINDER" | "ANC_REMINDER" | "EDUCATIONAL";

/** Where tapping a notification goes, and how it's shown. */
export function notificationMeta(type: string): { route: string; tone: "red" | "amber" | "green" | "neutral"; label: string } {
  switch (type) {
    case "CARE_PRIORITY":
      return { route: "/home", tone: "red", label: "Your care" };
    case "BP_ALERT":
      return { route: "/tracking", tone: "amber", label: "Blood pressure" };
    case "SYMPTOM_ALERT":
      return { route: "/tracking", tone: "amber", label: "Symptoms" };
    case "REMINDER":
      return { route: "/bp-entry", tone: "green", label: "Reminder" };
    case "ANC_REMINDER":
      return { route: "/appointments", tone: "green", label: "Appointment" };
    case "EDUCATIONAL":
      return { route: "/education", tone: "neutral", label: "Learn" };
    default:
      return { route: "/home", tone: "neutral", label: "Update" };
  }
}
