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
        kicker: tr({ en: "Emergency", pcm: "Emergency", yo: "Pàjáwìrì" }),
        title: tr({ en: "Get help now", pcm: "Find help now now", yo: "Wá ìrànlọ́wọ́ ní báyìí" }),
        fallbackMessage: tr({
          en: "Your recent readings or symptoms need care straight away. Go to the nearest health facility or press Emergency help.",
          pcm: "Wetin you check or report recently need care sharp sharp. Go the nearest hospital or press Emergency help.",
          yo: "Àwọn ìwọ̀n tàbí àìsàn tí o sọ láìpẹ́ yìí nílò ìtọ́jú kíákíá. Lọ sí ilé ìwòsàn tó súnmọ́ ọ jù tàbí tẹ Ìrànlọ́wọ́ pàjáwìrì.",
        }),
        primary: { label: tr({ en: "Emergency help", pcm: "Emergency help", yo: "Ìrànlọ́wọ́ pàjáwìrì" }), route: "/emergency", danger: true },
        secondary: { label: tr({ en: "Find a facility", pcm: "Find hospital", yo: "Wá ilé ìwòsàn" }), route: "/clinic-finder" },
      };
    case "URGENT":
      return {
        tone: "urgent",
        kicker: tr({ en: "Urgent", pcm: "Urgent", yo: "Ó yá kíákíá" }),
        title: tr({ en: "Contact your clinic today", pcm: "Call your clinic today", yo: "Pe kílíníìkì rẹ lónìí" }),
        fallbackMessage: tr({
          en: "Something in your recent readings needs a health worker to look at it today.",
          pcm: "Something for your recent reading need make health worker check am today.",
          yo: "Ohun kan nínú àwọn ìwọ̀n rẹ láìpẹ́ yìí nílò kí òṣìṣẹ́ ìlera wò ó lónìí.",
        }),
        primary: { label: tr({ en: "Find a clinic", pcm: "Find clinic", yo: "Wá kílíníìkì" }), route: "/clinic-finder" },
        secondary: { label: tr({ en: "Recheck BP", pcm: "Check BP again", yo: "Tún ìfúnpá wò" }), route: "/bp-entry" },
      };
    case "MONITOR":
      return {
        tone: "amber",
        kicker: tr({ en: "Keep watch", pcm: "Dey watch", yo: "Máa ṣọ́ra" }),
        title: tr({ en: "Keep a close eye today", pcm: "Dey watch yourself well today", yo: "Ṣọ́ ara rẹ dáadáa lónìí" }),
        fallbackMessage: tr({
          en: "Your blood pressure was a little high. Rest, then check it again in about 4 hours.",
          pcm: "Your BP high small. Rest, then check am again after like 4 hours.",
          yo: "Ìfúnpá rẹ ga díẹ̀. Sinmi, kí o tún un wò lẹ́yìn nǹkan bí wákàtí mẹ́rin.",
        }),
        primary: { label: tr({ en: "Recheck BP", pcm: "Check BP again", yo: "Tún ìfúnpá wò" }), route: "/bp-entry" },
        secondary: { label: tr({ en: "Report a symptom", pcm: "Tell us how you feel", yo: "Sọ bí ara rẹ ṣe rí" }), route: "/symptom-checker" },
      };
    default:
      return {
        tone: "green",
        kicker: tr({ en: "All clear", pcm: "All dey alright", yo: "Gbogbo nǹkan dára" }),
        title: tr({ en: "You're on track", pcm: "You dey do well", yo: "O ń ṣe dáadáa" }),
        fallbackMessage: tr({
          en: "Your latest readings look normal. A quick daily check keeps it that way.",
          pcm: "Your last reading dey normal. Check am small every day make e continue like that.",
          yo: "Ìwọ̀n rẹ tó kẹ́yìn dára. Máa wò ó lójoojúmọ́ kí ó lè máa dára bẹ́ẹ̀.",
        }),
        primary: { label: tr({ en: "Log today's BP", pcm: "Check today BP", yo: "Wo ìfúnpá òní" }), route: "/bp-entry" },
      };
  }
}

export type ReadingTone = "green" | "amber" | "red";

/** Short label for a BP tier (1–4, from services/escalation getTier). */
export function readingLabel(tier: 1 | 2 | 3 | 4): { text: string; tone: ReadingTone } {
  switch (tier) {
    case 4:
      return { text: tr({ en: "Very high", pcm: "High well well", yo: "Ó ga jù" }), tone: "red" };
    case 3:
      return { text: tr({ en: "High", pcm: "High", yo: "Ó ga" }), tone: "red" };
    case 2:
      return { text: tr({ en: "A little high", pcm: "High small", yo: "Ó ga díẹ̀" }), tone: "amber" };
    default:
      return { text: tr({ en: "Normal", pcm: "Normal", yo: "Ó dára" }), tone: "green" };
  }
}

/** Title shown on the result sheet after saving a reading. */
export function readingResultTitle(tier: 1 | 2 | 3 | 4): string {
  switch (tier) {
    case 4:
      return tr({ en: "Your blood pressure is very high", pcm: "Your BP high well well", yo: "Ìfúnpá rẹ ga jù" });
    case 3:
      return tr({ en: "Your blood pressure is high", pcm: "Your BP high", yo: "Ìfúnpá rẹ ga" });
    case 2:
      return tr({ en: "Your blood pressure is a little high", pcm: "Your BP high small", yo: "Ìfúnpá rẹ ga díẹ̀" });
    default:
      return tr({ en: "Your blood pressure looks normal", pcm: "Your BP dey normal", yo: "Ìfúnpá rẹ dára" });
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
    yo: [
      "Jókòó jẹ́ẹ́ fún ìṣẹ́jú márùn-ún kí o tó wò ó, ẹsẹ̀ rẹ méjèèjì lélẹ̀.",
      "Gbé apá rẹ lé orí tábìlì, kí ó dọ́gba pẹ̀lú ọkàn rẹ.",
      "Má ṣe sọ̀rọ̀ nígbà tí ẹ̀rọ náà ń wọ̀n.",
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
        kicker: tr({ en: "Emergency", pcm: "Emergency", yo: "Pàjáwìrì" }),
        title: tr({ en: "Go to a health facility now", pcm: "Go hospital now now", yo: "Lọ sí ilé ìwòsàn ní báyìí" }),
        message: tr({
          en: "What you described can be a danger sign in pregnancy. Please don't wait to see if it gets better.",
          pcm: "Wetin you talk fit be danger sign for pregnancy. Abeg no wait to see if e go better.",
          yo: "Ohun tí o sọ lè jẹ́ àmì ewu nínú oyún. Jọ̀wọ́ má ṣe dúró láti wò bóyá yóò sàn.",
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
          yo: [
            "Jẹ́ kí ẹnìkan mú ọ lọ. Má ṣe lọ nìkan tí o bá lè yẹra fún un.",
            "Mú káàdì ìtọ́jú oyún rẹ àti fóònù yìí dání.",
            "Fi àkọsílẹ̀ tó wà nísàlẹ̀ han nọ́ọ̀sì tàbí dókítà.",
          ],
        }),
      };
    case "offline":
      return {
        tone: "red",
        kicker: tr({ en: "Danger sign", pcm: "Danger sign", yo: "Àmì ewu" }),
        title: tr({ en: "Go to a health facility now", pcm: "Go hospital now now", yo: "Lọ sí ilé ìwòsàn ní báyìí" }),
        message: tr({
          en: "We couldn't reach our server, but one or more of your symptoms can be a danger sign in pregnancy. Go now, or call your emergency contact.",
          pcm: "We no fit reach our server, but one or more of wetin you dey feel fit be danger sign for pregnancy. Go now, or call your emergency contact.",
          yo: "A kò rí sáfà wa, ṣùgbọ́n ọ̀kan tàbí jù bẹ́ẹ̀ lọ nínú ohun tí o ń rí lára lè jẹ́ àmì ewu nínú oyún. Lọ ní báyìí, tàbí pe ẹni pàjáwìrì rẹ.",
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
          yo: [
            "Jẹ́ kí ẹnìkan mú ọ lọ.",
            "Mú káàdì ìtọ́jú oyún rẹ àti fóònù yìí dání.",
            "Fi àkọsílẹ̀ tó wà nísàlẹ̀ han nọ́ọ̀sì tàbí dókítà.",
          ],
        }),
      };
    case "urgent":
      return {
        tone: "urgent",
        kicker: tr({ en: "See a health worker today", pcm: "See health worker today", yo: "Rí òṣìṣẹ́ ìlera lónìí" }),
        title: tr({ en: "Get checked today", pcm: "Make dem check you today", yo: "Jẹ́ kí wọ́n yẹ̀ ọ́ wò lónìí" }),
        message: tr({
          en: "Your symptoms need a health worker to look at them today. Don't wait for your next appointment.",
          pcm: "Wetin you dey feel need make health worker check am today. No wait for your next appointment.",
          yo: "Ohun tí o ń rí lára nílò kí òṣìṣẹ́ ìlera wò ó lónìí. Má ṣe dúró de ìpàdé rẹ tó ń bọ̀.",
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
          yo: [
            "Lọ sí kílíníìkì rẹ tàbí ilé ìwòsàn tó súnmọ́ ọ jù lónìí.",
            "Fi àkọsílẹ̀ tó wà nísàlẹ̀ han nọ́ọ̀sì tàbí dókítà.",
            "Tí ó bá burú sí i, tàbí o rí àmì ewu kankan, lọ lẹ́sẹ̀kẹsẹ̀.",
          ],
        }),
      };
    default:
      return {
        tone: "green",
        kicker: tr({ en: "Thank you", pcm: "Thank you", yo: "Ẹ ṣé" }),
        title: tr({ en: "Your symptoms were sent", pcm: "We don receive wetin you report", yo: "A ti gba ohun tí o sọ" }),
        message: tr({
          en: "Nothing you reported needs urgent care right now. Your clinic can see what you sent.",
          pcm: "Nothing wey you report need urgent care now. Your clinic fit see wetin you send.",
          yo: "Kò sí ohun tí o sọ tó nílò ìtọ́jú kíákíá báyìí. Kílíníìkì rẹ lè rí ohun tí o fi ránṣẹ́.",
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
          yo: [
            "Sinmi, mu omi, kí o sì máa wo ìfúnpá rẹ.",
            "Sọ fún òṣìṣẹ́ ìlera rẹ ní ìpàdé rẹ tó ń bọ̀.",
            "Tí nǹkan kan bá burú sí i tàbí o rí àmì ewu, tún sọ fún wa tàbí lọ sí ilé ìwòsàn.",
          ],
        }),
      };
  }
}
