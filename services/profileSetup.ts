/**
 * Profile setup questions and helpers.
 * IDENTICAL in maternalert-web (src/services/profileSetup.ts) and
 * maternalert-fe (services/profileSetup.ts): plain TypeScript, no imports.
 * Values must match the backend enums (prisma: AgeRange, KnownCondition,
 * EmergencyContactRelationship).
 */

export type AgeRange = "UNDER_18" | "AGE_18_34" | "AGE_35_PLUS";
export type Relationship = "PARTNER" | "FAMILY_MEMBER" | "MIDWIFE" | "OTHER";

export const SETUP_STEPS = [
  {
    id: "you",
    title: "What's your name?",
    help: "If you ever need help, your clinic and emergency contact will see this name and number.",
  },
  { id: "age", title: "How old are you?", help: "We only ask for an age range, not your date of birth." },
  {
    id: "weeks",
    title: "How many weeks pregnant are you?",
    help: "Your best guess is fine. Your antenatal card may say it, or use the date of your last period.",
  },
  { id: "first", title: "Is this your first pregnancy?", help: "Some risks are different in a first pregnancy." },
  {
    id: "conditions",
    title: "Do any of these apply to you?",
    help: "Choose all that apply. These raise the chance of high blood pressure in pregnancy, so we watch more closely.",
  },
  {
    id: "contact",
    title: "Who should we alert in an emergency?",
    help: "When you press the emergency button, this person gets a WhatsApp message and an SMS straight away.",
  },
] as const;

export const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "UNDER_18", label: "Under 18" },
  { value: "AGE_18_34", label: "18 to 34" },
  { value: "AGE_35_PLUS", label: "35 or older" },
];

export const CONDITION_OPTIONS: { value: string; label: string; hint?: string }[] = [
  { value: "PREECLAMPSIA_HISTORY", label: "Pre-eclampsia in a past pregnancy", hint: "High blood pressure that needed care" },
  { value: "CHRONIC_HYPERTENSION", label: "High blood pressure", hint: "Before this pregnancy, or found in this one" },
  { value: "DIABETES", label: "Diabetes", hint: "Before this pregnancy" },
  { value: "GESTATIONAL_DIABETES", label: "High sugar in this pregnancy", hint: "Gestational diabetes" },
  { value: "KIDNEY_DISEASE", label: "Kidney disease" },
  { value: "AUTOIMMUNE_DISORDER", label: "Lupus or another autoimmune disease" },
  { value: "MULTIPLE_PREGNANCY", label: "Twins or more in this pregnancy" },
];

export const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: "PARTNER", label: "Husband or partner" },
  { value: "FAMILY_MEMBER", label: "Family member" },
  { value: "MIDWIFE", label: "Midwife or nurse" },
  { value: "OTHER", label: "Someone else" },
];

/** Whole weeks since the first day of the last period, or null. */
export function weeksFromLastPeriod(isoDate: string, today = new Date()): number | null {
  if (!isoDate) return null;
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const days = Math.floor((today.getTime() - d.getTime()) / 86_400_000);
  return days < 0 ? -1 : Math.floor(days / 7);
}

/** 0803 123 4567, +234 803 123 4567, 2348031234567, or another full international number. */
export function isValidNigerianPhone(raw: string): boolean {
  const digits = raw.replace(/[^\d]/g, "");
  if (/^0[789][01]\d{8}$/.test(digits)) return true;
  if (/^234[789][01]\d{8}$/.test(digits)) return true;
  return raw.trim().startsWith("+") && digits.length >= 10 && digits.length <= 15;
}

/** A real name: 2–80 characters with at least two letters. */
export function isValidName(raw: string): boolean {
  const t = raw.trim();
  return t.length >= 2 && t.length <= 80 && (t.match(/\p{L}/gu) ?? []).length >= 2;
}
