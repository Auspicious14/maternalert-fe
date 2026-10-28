/**
 * Patient-facing wording for status and readings.
 * IDENTICAL in maternalert-web (src/services/patientCopy.ts) and
 * maternalert-fe (services/patientCopy.ts). Only imports ./i18n.
 * Keep the tone calm, specific and action-first; never diagnostic.
 * Each string has English (en) and Nigerian Pidgin (pcm) side by side.
 */
import { tr } from "./i18n";

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
        kicker: tr({ en: "Emergency", pcm: "Emergency" }),
        title: tr({ en: "Get help now", pcm: "Find help now now" }),
        fallbackMessage: tr({
          en: "Your recent readings or symptoms need care straight away. Go to the nearest health facility or press Emergency help.",
          pcm: "Wetin you check or report recently need care sharp sharp. Go the nearest hospital or press Emergency help.",
        }),
        primary: { label: tr({ en: "Emergency help", pcm: "Emergency help" }), route: "/emergency", danger: true },
        secondary: { label: tr({ en: "Find a facility", pcm: "Find hospital" }), route: "/clinic-finder" },
      };
    case "URGENT":
      return {
        tone: "urgent",
        kicker: tr({ en: "Urgent", pcm: "Urgent" }),
        title: tr({ en: "Contact your clinic today", pcm: "Call your clinic today" }),
        fallbackMessage: tr({
          en: "Something in your recent readings needs a health worker to look at it today.",
          pcm: "Something for your recent reading need make health worker check am today.",
        }),
        primary: { label: tr({ en: "Find a clinic", pcm: "Find clinic" }), route: "/clinic-finder" },
        secondary: { label: tr({ en: "Recheck BP", pcm: "Check BP again" }), route: "/bp-entry" },
      };
    case "MONITOR":
      return {
        tone: "amber",
        kicker: tr({ en: "Keep watch", pcm: "Dey watch" }),
        title: tr({ en: "Keep a close eye today", pcm: "Dey watch yourself well today" }),
        fallbackMessage: tr({
          en: "Your blood pressure was a little high. Rest, then check it again in about 4 hours.",
          pcm: "Your BP high small. Rest, then check am again after like 4 hours.",
        }),
        primary: { label: tr({ en: "Recheck BP", pcm: "Check BP again" }), route: "/bp-entry" },
        secondary: { label: tr({ en: "Report a symptom", pcm: "Tell us how you feel" }), route: "/symptom-checker" },
      };
    default:
      return {
        tone: "green",
        kicker: tr({ en: "All clear", pcm: "All dey alright" }),
        title: tr({ en: "You're on track", pcm: "You dey do well" }),
        fallbackMessage: tr({
          en: "Your latest readings look normal. A quick daily check keeps it that way.",
          pcm: "Your last reading dey normal. Check am small every day make e continue like that.",
        }),
        primary: { label: tr({ en: "Log today's BP", pcm: "Check today BP" }), route: "/bp-entry" },
      };
  }
}

export type ReadingTone = "green" | "amber" | "red";

/** Short label for a BP tier (1–4, from services/escalation getTier). */
export function readingLabel(tier: 1 | 2 | 3 | 4): { text: string; tone: ReadingTone } {
  switch (tier) {
    case 4:
      return { text: tr({ en: "Very high", pcm: "High well well" }), tone: "red" };
    case 3:
      return { text: tr({ en: "High", pcm: "High" }), tone: "red" };
    case 2:
      return { text: tr({ en: "A little high", pcm: "High small" }), tone: "amber" };
    default:
      return { text: tr({ en: "Normal", pcm: "Normal" }), tone: "green" };
  }
}

/** Title shown on the result sheet after saving a reading. */
export function readingResultTitle(tier: 1 | 2 | 3 | 4): string {
  switch (tier) {
    case 4:
      return tr({ en: "Your blood pressure is very high", pcm: "Your BP high well well" });
    case 3:
      return tr({ en: "Your blood pressure is high", pcm: "Your BP high" });
    case 2:
      return tr({ en: "Your blood pressure is a little high", pcm: "Your BP high small" });
    default:
      return tr({ en: "Your blood pressure looks normal", pcm: "Your BP dey normal" });
  }
}

/** How to take a good reading. */
export function bpTips(): string[] {
  return tr({
    en: [
      "Sit quietly for 5 minutes first, feet flat on the floor.",
      "Rest your arm on a table at the level of your heart.",
      "Don't talk while the machine is measuring.",
    ],
    pcm: [
      "Siddon quietly for 5 minutes first, put your two feet flat for ground.",
      "Put your hand for table, make e reach the level of your heart.",
      "No talk while the machine dey measure.",
    ],
  });
}

// ── After a symptom check ────────────────────────────────────────────────────

export type SymptomLevel = "emergency" | "urgent" | "offline" | "routine";

/** Wording for the screen shown after a symptom check. */
export function symptomResultCopy(level: SymptomLevel): {
  tone: "red" | "urgent" | "green";
  kicker: string;
  title: string;
  message: string;
  steps: string[];
} {
  switch (level) {
    case "emergency":
      return {
        tone: "red",
        kicker: tr({ en: "Emergency", pcm: "Emergency" }),
        title: tr({ en: "Go to a health facility now", pcm: "Go hospital now now" }),
        message: tr({
          en: "What you described can be a danger sign in pregnancy. Please don't wait to see if it gets better.",
          pcm: "Wetin you talk fit be danger sign for pregnancy. Abeg no wait to see if e go better.",
        }),
        steps: tr({
          en: [
            "Ask someone to take you. Don't go alone if you can avoid it.",
            "Take your antenatal card and this phone.",
            "Show the summary below to the nurse or doctor.",
          ],
          pcm: [
            "Make person carry you go. No go alone if you fit.",
            "Carry your antenatal card and this phone.",
            "Show the nurse or doctor the summary wey dey below.",
          ],
        }),
      };
    case "offline":
      return {
        tone: "red",
        kicker: tr({ en: "Danger sign", pcm: "Danger sign" }),
        title: tr({ en: "Go to a health facility now", pcm: "Go hospital now now" }),
        message: tr({
          en: "We couldn't reach our server, but one or more of your symptoms can be a danger sign in pregnancy. Go now, or call your emergency contact.",
          pcm: "We no fit reach our server, but one or more of wetin you dey feel fit be danger sign for pregnancy. Go now, or call your emergency contact.",
        }),
        steps: tr({
          en: [
            "Ask someone to take you.",
            "Take your antenatal card and this phone.",
            "Show the summary below to the nurse or doctor.",
          ],
          pcm: [
            "Make person carry you go.",
            "Carry your antenatal card and this phone.",
            "Show the nurse or doctor the summary wey dey below.",
          ],
        }),
      };
    case "urgent":
      return {
        tone: "urgent",
        kicker: tr({ en: "See a health worker today", pcm: "See health worker today" }),
        title: tr({ en: "Get checked today", pcm: "Make dem check you today" }),
        message: tr({
          en: "Your symptoms need a health worker to look at them today. Don't wait for your next appointment.",
          pcm: "Wetin you dey feel need make health worker check am today. No wait for your next appointment.",
        }),
        steps: tr({
          en: [
            "Go to your clinic or the nearest health facility today.",
            "Show the summary below to the nurse or doctor.",
            "If it gets worse, or you get a danger sign, go immediately.",
          ],
          pcm: [
            "Go your clinic or the nearest hospital today.",
            "Show the nurse or doctor the summary wey dey below.",
            "If e worse, or you see any danger sign, go sharp sharp.",
          ],
        }),
      };
    default:
      return {
        tone: "green",
        kicker: tr({ en: "Thank you", pcm: "Thank you" }),
        title: tr({ en: "Your symptoms were sent", pcm: "We don receive wetin you report" }),
        message: tr({
          en: "Nothing you reported needs urgent care right now. Your clinic can see what you sent.",
          pcm: "Nothing wey you report need urgent care now. Your clinic fit see wetin you send.",
        }),
        steps: tr({
          en: [
            "Rest, drink water, and keep checking your blood pressure.",
            "Tell your health worker at your next visit.",
            "If anything gets worse or you notice a danger sign, report it again or go to a facility.",
          ],
          pcm: [
            "Rest, drink water, and dey check your BP.",
            "Tell your health worker for your next visit.",
            "If anything worse or you see danger sign, report am again or go hospital.",
          ],
        }),
      };
  }
}
