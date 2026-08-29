/**
 * reminderChannel.ts
 *
 * Channel-agnostic reminder model.
 *
 * PURPOSE:
 * Decouples reminder definitions from their delivery mechanism.
 * The same reminder can be scheduled for push notification today
 * and later routed through WhatsApp or email with no changes to
 * the reminder definition itself.
 *
 * WHATSAPP READINESS:
 * This model is designed so that a WhatsApp delivery adapter can
 * be added later by implementing ReminderDeliveryAdapter.
 * No fake WhatsApp integration is included here.
 *
 * PARTNER SUPPORT:
 * The `targetType` field allows a reminder to target the patient
 * or an explicitly linked partner/caregiver.
 * Partner reminders MUST only be sent for event types the patient
 * has consented to share (see `partnerConsentScopes`).
 *
 * CONSENT:
 * No reminder is dispatched unless `enabled` is true and the
 * relevant user preference flag is set.
 */

// ─── Channels ─────────────────────────────────────────────────────────────────

export type ReminderChannel = "PUSH" | "WHATSAPP" | "EMAIL";

// ─── Reminder event types ─────────────────────────────────────────────────────

export type ReminderEventType =
  | "DAILY_BP"
  | "WEEKLY_PREGNANCY_MILESTONE"
  | "TRIMESTER_TRANSITION"
  | "NUTRITION_REMINDER"
  | "ACTIVITY_REMINDER"
  | "INACTIVITY_BP"
  | "URGENT_INACTIVITY_BP"
  | "APPOINTMENT_REMINDER"
  | "FOLLOW_UP_RECHECK"
  | "PARTNER_MILESTONE"
  | "PARTNER_APPOINTMENT";

// ─── Target types ─────────────────────────────────────────────────────────────

export type ReminderTarget = "PATIENT" | "PARTNER";

// ─── Partner consent scopes ───────────────────────────────────────────────────

/**
 * Event types a partner can receive — only after the patient explicitly
 * grants consent for that scope.
 * Private health data (BP readings, symptoms) is NEVER shared by default.
 */
export const PARTNER_ALLOWED_EVENT_TYPES: ReminderEventType[] = [
  "PARTNER_MILESTONE",
  "PARTNER_APPOINTMENT",
];

// ─── Reminder definition ──────────────────────────────────────────────────────

export interface ReminderDefinition {
  /** Stable identifier — used to prevent duplicates. */
  key: string;
  type: ReminderEventType;
  title: string;
  body: string;
  /** Which channels this reminder can be delivered through. */
  channels: ReminderChannel[];
  /** Who receives this reminder. */
  targetType: ReminderTarget;
  /** Whether this reminder is currently enabled. */
  enabled: boolean;
  /** Optional metadata for scheduling or deduplication. */
  meta?: Record<string, any>;
}

// ─── Delivery adapter interface ───────────────────────────────────────────────

/**
 * Any future delivery adapter (push, WhatsApp, email) should implement this.
 * The scheduler calls adapters without knowing which channel is being used.
 */
export interface ReminderDeliveryAdapter {
  channel: ReminderChannel;
  canDeliver(reminder: ReminderDefinition): boolean;
  deliver(reminder: ReminderDefinition): Promise<void>;
}

// ─── Factory helpers ──────────────────────────────────────────────────────────

export function makePregnancyMilestoneReminder(
  week: number,
  milestoneTitle: string,
  milestoneMessage: string,
): ReminderDefinition {
  return {
    key: `PREGNANCY_MILESTONE_W${week}`,
    type: "WEEKLY_PREGNANCY_MILESTONE",
    title: `Week ${week} milestone 🌟`,
    body: `${milestoneTitle} — ${milestoneMessage}`,
    channels: ["PUSH"],
    targetType: "PATIENT",
    enabled: true,
    meta: { week },
  };
}

export function makeTrimesterTransitionReminder(
  trimester: 1 | 2 | 3,
  week: number,
): ReminderDefinition {
  const labels: Record<number, string> = {
    1: "You are in your first trimester",
    2: "Welcome to your second trimester 🌟",
    3: "Welcome to your third trimester 🌙",
  };
  return {
    key: `TRIMESTER_${trimester}_TRANSITION_W${week}`,
    type: "TRIMESTER_TRANSITION",
    title: labels[trimester],
    body:
      trimester === 2
        ? "You have reached 13 weeks. The risk of miscarriage drops significantly and many women feel much better now."
        : trimester === 3
          ? "You have reached 28 weeks. Your baby is gaining weight rapidly. Attend all remaining antenatal visits."
          : "Your pregnancy journey has begun.",
    channels: ["PUSH"],
    targetType: "PATIENT",
    enabled: true,
    meta: { trimester, week },
  };
}

export function makeNutritionReminder(
  week: number,
  title: string,
  tip: string,
): ReminderDefinition {
  return {
    key: `NUTRITION_W${week}`,
    type: "NUTRITION_REMINDER",
    title: `Nutrition tip 🥗`,
    body: `${title}: ${tip}`,
    channels: ["PUSH"],
    targetType: "PATIENT",
    enabled: true,
    meta: { week },
  };
}

export function makeActivityReminder(
  week: number,
  activityName: string,
  description: string,
): ReminderDefinition {
  return {
    key: `ACTIVITY_W${week}`,
    type: "ACTIVITY_REMINDER",
    title: `Today's activity 🚶‍♀️`,
    body: `${activityName}: ${description}`,
    channels: ["PUSH"],
    targetType: "PATIENT",
    enabled: true,
    meta: { week },
  };
}

export function makePartnerMilestoneReminder(
  week: number,
  message: string,
): ReminderDefinition {
  return {
    key: `PARTNER_MILESTONE_W${week}`,
    type: "PARTNER_MILESTONE",
    title: `Pregnancy milestone 💛`,
    body: message,
    channels: ["PUSH"],
    targetType: "PARTNER",
    enabled: true,
    meta: { week },
  };
}
