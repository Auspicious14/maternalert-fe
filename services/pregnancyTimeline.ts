/**
 * pregnancyTimeline.ts
 *
 * Single source of truth for all pregnancy week / trimester / EDD calculations.
 *
 * DESIGN DECISIONS:
 * ─────────────────
 * • Uses `pregnancyReferenceDate` as the calculation anchor — NOT `createdAt`.
 *   `createdAt` records when the DB row was inserted; it has no clinical meaning.
 *   `pregnancyReferenceDate` is set to "now" when the user first enters (or updates)
 *   their pregnancy week, making it the moment at which `pregnancyWeeks` was accurate.
 *
 * • Week progression is calculated in whole calendar days elapsed since the reference
 *   date, then integer-divided by 7. This prevents timezone / midnight-boundary
 *   off-by-one errors that can occur when comparing UTC timestamps directly.
 *
 * • The raw `pregnancyWeeks` stored on the profile is NEVER mutated on the frontend.
 *   The frontend always derives the current week from the reference date.
 *
 * • Weeks are capped at 42. Beyond 42 weeks the calculation is clinically unreliable
 *   and the UI should prompt the user to update their profile.
 *
 * ROOT CAUSE OF THE 29→30 BUG (fixed here):
 * ──────────────────────────────────────────
 * Previous code used `createdAt` as the reference and compared UTC timestamps.
 * If the user registered at 23:55 local time but the server stored a UTC createdAt
 * that fell on the "next" UTC day, `weeksSince` instantly returned 1 rather than 0,
 * inflating the displayed week by 1 immediately after registration.
 */

export type Trimester = 1 | 2 | 3;

export interface PregnancyTimeline {
  /** Current gestational week (1-based, capped 0–42). */
  currentWeek: number;
  /** Current trimester derived from week. */
  trimester: Trimester;
  /** Human-readable trimester label. */
  trimesterLabel: string;
  /** Estimated due date (week 40 from LMP anchor). */
  estimatedDueDate: Date;
  /** Days remaining to EDD (can be negative if overdue). */
  daysRemaining: number;
  /** Weeks remaining (floor of daysRemaining / 7). */
  weeksRemaining: number;
  /** Whether pregnancy is at or past the due date. */
  isOverdue: boolean;
  /** Whether week calculation is reliable (reference date is valid). */
  isValid: boolean;
  /** Human-readable progress label, e.g. "29 weeks pregnant". */
  progressLabel: string;
}

/**
 * Count whole calendar days elapsed between two dates using LOCAL date components.
 * This correctly handles timezone-boundary issues: a user in WAT (UTC+1) registering
 * at 23:55 WAT on Monday will not see Tuesday count as "1 day later" for UTC purposes.
 */
export function calendarDaysElapsed(from: Date, to: Date): number {
  const fromLocal = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
  );
  const toLocal = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const diffMs = toLocal.getTime() - fromLocal.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculate whole gestational weeks elapsed since a reference date.
 * Returns a non-negative integer.
 */
export function weeksSinceReference(
  referenceDate: Date,
  now: Date = new Date(),
): number {
  const days = calendarDaysElapsed(referenceDate, now);
  if (days < 0) return 0; // future reference date → treat as 0 elapsed
  return Math.floor(days / 7);
}

/**
 * Derive the current pregnancy week from stored profile data.
 *
 * @param storedWeeks  - The pregnancy week stored at registration time.
 * @param referenceDate - The date/time at which `storedWeeks` was accurate.
 * @param now          - The current date (injectable for testing; defaults to new Date()).
 *
 * GUARDS:
 * - If `referenceDate` is null/undefined → returns `storedWeeks` unchanged.
 * - If `referenceDate` is in the future → clamps elapsed to 0 (no week inflation).
 * - If result exceeds 42 → caps at 42.
 * - If result is negative (data error) → clamps to 0.
 */
export function calculateCurrentWeek(
  storedWeeks: number,
  referenceDate: string | Date | null | undefined,
  now: Date = new Date(),
): number {
  if (storedWeeks == null || isNaN(storedWeeks)) return 0;

  if (!referenceDate) {
    // No reference date means we cannot advance the week safely.
    // Return the stored value as-is (conservative fallback).
    return Math.min(42, Math.max(0, storedWeeks));
  }

  const ref =
    referenceDate instanceof Date ? referenceDate : new Date(referenceDate);

  if (isNaN(ref.getTime())) {
    // Unparseable reference date — return stored value conservatively.
    return Math.min(42, Math.max(0, storedWeeks));
  }

  const elapsed = weeksSinceReference(ref, now);
  const result = storedWeeks + elapsed;

  return Math.min(42, Math.max(0, result));
}

/**
 * Determine the trimester from a gestational week.
 */
export function getTrimester(week: number): Trimester {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

export function getTrimesterLabel(week: number): string {
  const t = getTrimester(week);
  if (t === 1) return "First Trimester";
  if (t === 2) return "Second Trimester";
  return "Third Trimester";
}

/**
 * Calculate the estimated due date.
 * Convention: EDD = referenceDate + (40 - storedWeeks) weeks from the reference point,
 * OR equivalently, EDD = (referenceDate - storedWeeks*7) + 280 days.
 */
export function calculateEDD(
  storedWeeks: number,
  referenceDate: string | Date | null | undefined,
): Date {
  const ref = referenceDate
    ? referenceDate instanceof Date
      ? referenceDate
      : new Date(referenceDate)
    : new Date();

  const weeksRemaining = 40 - storedWeeks;
  const edd = new Date(ref);
  edd.setDate(edd.getDate() + weeksRemaining * 7);
  return edd;
}

/**
 * Build the full pregnancy timeline object from raw profile data.
 * This is the single function that all screens should call.
 */
export function buildPregnancyTimeline(
  storedWeeks: number | null | undefined,
  referenceDate: string | Date | null | undefined,
  now: Date = new Date(),
): PregnancyTimeline {
  const weeks = storedWeeks ?? 0;
  const isValid =
    weeks != null &&
    !isNaN(weeks) &&
    !!referenceDate &&
    !isNaN(new Date(referenceDate as string).getTime());

  const currentWeek = calculateCurrentWeek(weeks, referenceDate, now);
  const trimester = getTrimester(currentWeek);
  const trimesterLabel = getTrimesterLabel(currentWeek);
  const estimatedDueDate = calculateEDD(weeks, referenceDate);

  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eddLocal = new Date(
    estimatedDueDate.getFullYear(),
    estimatedDueDate.getMonth(),
    estimatedDueDate.getDate(),
  );
  const daysRemaining = Math.round(
    (eddLocal.getTime() - todayLocal.getTime()) / (1000 * 60 * 60 * 24),
  );
  const weeksRemaining = Math.max(0, Math.floor(daysRemaining / 7));
  const isOverdue = daysRemaining < 0;

  const progressLabel = `${currentWeek} week${currentWeek === 1 ? "" : "s"} pregnant`;

  return {
    currentWeek,
    trimester,
    trimesterLabel,
    estimatedDueDate,
    daysRemaining,
    weeksRemaining,
    isOverdue,
    isValid,
    progressLabel,
  };
}
