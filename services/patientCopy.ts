/**
 * Patient-facing wording for status and readings.
 * IDENTICAL in maternalert-web (src/services/patientCopy.ts) and
 * maternalert-fe (services/patientCopy.ts) — plain TypeScript, no imports.
 * Keep the tone calm, specific and action-first; never diagnostic.
 */

export type MonitoringStateName = "NORMAL" | "MONITOR" | "URGENT" | "EMERGENCY";
export type HeroToneName = "green" | "amber" | "urgent" | "red";

export interface StatusCopy {
  tone: HeroToneName;
  kicker: string;
  title: string;
  fallbackMessage: string;
  primary: { label: string; route: string; danger?: boolean };
  secondary?: { label: string; route: string };
}

export function statusCopy(state?: MonitoringStateName | null): StatusCopy {
  switch (state) {
    case "EMERGENCY":
      return {
        tone: "red",
        kicker: "Emergency",
        title: "Get help now",
        fallbackMessage:
          "Your recent readings or symptoms need care straight away. Go to the nearest health facility or press Emergency help.",
        primary: { label: "Emergency help", route: "/emergency", danger: true },
        secondary: { label: "Find a facility", route: "/clinic-finder" },
      };
    case "URGENT":
      return {
        tone: "urgent",
        kicker: "Urgent",
        title: "Contact your clinic today",
        fallbackMessage:
          "Something in your recent readings needs a health worker to look at it today.",
        primary: { label: "Find a clinic", route: "/clinic-finder" },
        secondary: { label: "Recheck BP", route: "/bp-entry" },
      };
    case "MONITOR":
      return {
        tone: "amber",
        kicker: "Keep watch",
        title: "Keep a close eye today",
        fallbackMessage:
          "Your blood pressure was a little high. Rest, then check it again in about 4 hours.",
        primary: { label: "Recheck BP", route: "/bp-entry" },
        secondary: { label: "Report a symptom", route: "/symptom-checker" },
      };
    default:
      return {
        tone: "green",
        kicker: "All clear",
        title: "You're on track",
        fallbackMessage:
          "Your latest readings look normal. A quick daily check keeps it that way.",
        primary: { label: "Log today's BP", route: "/bp-entry" },
      };
  }
}

export type ReadingTone = "green" | "amber" | "red";

/** Short label for a BP tier (1–4, from services/escalation getTier). */
export function readingLabel(tier: 1 | 2 | 3 | 4): { text: string; tone: ReadingTone } {
  switch (tier) {
    case 4:
      return { text: "Very high", tone: "red" };
    case 3:
      return { text: "High", tone: "red" };
    case 2:
      return { text: "A little high", tone: "amber" };
    default:
      return { text: "Normal", tone: "green" };
  }
}

/** Title shown on the result sheet after saving a reading. */
export function readingResultTitle(tier: 1 | 2 | 3 | 4): string {
  switch (tier) {
    case 4:
      return "Your blood pressure is very high";
    case 3:
      return "Your blood pressure is high";
    case 2:
      return "Your blood pressure is a little high";
    default:
      return "Your blood pressure looks normal";
  }
}

export const BP_TIPS = [
  "Sit quietly for 5 minutes first, feet flat on the floor.",
  "Rest your arm on a table at the level of your heart.",
  "Don't talk while the machine is measuring.",
];
