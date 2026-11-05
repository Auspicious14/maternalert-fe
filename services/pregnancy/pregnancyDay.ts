/**
 * pregnancyDay.ts — "where is she on a given day": week + day, days to go,
 * due date, and the baby-size illustration to show. Pure functions, no React,
 * shared word-for-word with maternalert-fe/services/pregnancy/pregnancyDay.ts.
 *
 * Same anchor as pregnancyTimeline.ts: the weeks she entered were true on
 * `pregnancyReferenceDate`, at day 0 of that week. Due date = week 40 day 0.
 */

export interface PregnancyDay {
  date: Date;
  week: number; // completed weeks, 0–42
  day: number; // 0–6 days into that week
  daysToGo: number; // to the due date; negative once past it
  dueDate: Date;
  trimester: 1 | 2 | 3;
  progress: number; // 0–1 of 40 weeks
}

const DAY = 24 * 60 * 60 * 1000;
const localDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function pregnancyOnDate(
  storedWeeks: number | null | undefined,
  referenceDate: string | Date | null | undefined,
  date: Date = new Date(),
): PregnancyDay | null {
  if (storedWeeks == null || Number.isNaN(storedWeeks) || !referenceDate) return null;
  const ref = localDay(new Date(referenceDate));
  if (Number.isNaN(ref.getTime())) return null;
  const today = localDay(date);
  const startDays = storedWeeks * 7; // gestational days on the reference date
  const gestDays = Math.max(0, startDays + Math.round((today.getTime() - ref.getTime()) / DAY));
  const capped = Math.min(gestDays, 42 * 7 + 6);
  const week = Math.floor(capped / 7);
  const dueDate = new Date(ref.getTime() + (40 * 7 - startDays) * DAY);
  const daysToGo = Math.round((dueDate.getTime() - today.getTime()) / DAY);
  return {
    date: today,
    week,
    day: capped % 7,
    daysToGo,
    dueDate,
    trimester: week <= 12 ? 1 : week <= 27 ? 2 : 3,
    progress: Math.min(1, gestDays / (40 * 7)),
  };
}

/** The 7 days of the current week (Monday first), for the day strip. */
export function weekDays(today: Date = new Date()): Date[] {
  const t = localDay(today);
  const mondayOffset = (t.getDay() + 6) % 7;
  const monday = new Date(t.getTime() - mondayOffset * DAY);
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getTime() + i * DAY));
}

export const sameDay = (a: Date, b: Date) => localDay(a).getTime() === localDay(b).getTime();

// ── Baby-size illustration ──────────────────────────────────────────────────
// Each fruit in fetal-development.ts maps to one drawn illustration.

export type FruitKind =
  | "seed"
  | "bean"
  | "berry"
  | "grape"
  | "cherry"
  | "strawberry"
  | "lime"
  | "lemon"
  | "peach"
  | "avocado"
  | "banana"
  | "aubergine"
  | "corn"
  | "coconut"
  | "melon"
  | "watermelon";

export function fruitFor(size: string | undefined | null): FruitKind {
  const s = (size ?? "").toLowerCase();
  if (s.includes("poppy") || s.includes("sesame")) return "seed";
  if (s.includes("lentil") || s.includes("kidney bean")) return "bean";
  if (s.includes("blueberry")) return "berry";
  if (s.includes("grape")) return "grape";
  if (s.includes("cherry")) return "cherry";
  if (s.includes("strawberry")) return "strawberry";
  if (s.includes("lime")) return "lime";
  if (s.includes("lemon")) return "lemon";
  if (s.includes("peach")) return "peach";
  if (s.includes("avocado")) return "avocado";
  if (s.includes("banana")) return "banana";
  if (s.includes("aubergine") || s.includes("eggplant")) return "aubergine";
  if (s.includes("corn")) return "corn";
  if (s.includes("coconut")) return "coconut";
  if (s.includes("watermelon")) return "watermelon";
  if (s.includes("melon")) return "melon";
  return "lime";
}

/** "14 Mar 2027" style date in the app's locale. */
export const prettyDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
