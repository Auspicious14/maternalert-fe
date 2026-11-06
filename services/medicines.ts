/**
 * medicines.ts — words and safety advice for the Medicines screen. Pure data.
 * Shared word-for-word with maternalert-web/src/services/medicines.ts (only the
 * import path differs).
 *
 * AWAITING CLINICAL REVIEW: the side-effect advice below follows general
 * WHO antenatal guidance and must be checked by MaternAlert's clinical lead
 * before launch. The app never suggests a medicine, a dose, or stopping one.
 */
import { tr } from "./i18n";

export type MedicationKind =
  | "IRON_FOLIC_ACID"
  | "FOLIC_ACID"
  | "IRON"
  | "CALCIUM"
  | "ANTIMALARIAL"
  | "BP_MEDICINE"
  | "ASPIRIN"
  | "OTHER";
export type MissedDoseReason = "FORGOT" | "RAN_OUT" | "SIDE_EFFECTS" | "COST" | "FEELING_WELL" | "TOLD_TO_STOP" | "OTHER";
export type SideEffectKind =
  | "NAUSEA"
  | "VOMITING"
  | "CONSTIPATION"
  | "DARK_STOOLS"
  | "STOMACH_PAIN"
  | "HEARTBURN"
  | "DIARRHOEA"
  | "HEADACHE"
  | "DIZZINESS"
  | "RASH"
  | "ITCHING"
  | "OTHER";
export type Severity = "MILD" | "MODERATE" | "SEVERE";

export interface MedicationRow {
  id: string;
  kind: MedicationKind;
  name: string;
  doseText: string | null;
  timesPerDay: number;
  reminderTimes: string[];
  remindersOn: boolean;
  refillDate: string | null;
  endDate: string | null;
  addedBy: "PATIENT" | "CLINIC";
  active: boolean;
  today: { slot: number; status: "TAKEN" | "MISSED"; missedReason: MissedDoseReason | null }[];
  adherence7d: { taken: number; expected: number; percent: number } | null;
}

export interface MedicinesSummary {
  today: string;
  medications: MedicationRow[];
  sideEffects: { id: string; effect: SideEffectKind; severity: Severity; createdAt: string; medicationId: string | null }[];
  iptp: { doses: { id: string; doseNumber: number; givenAt: string; gestationalWeeks: number | null }[]; nextDueAt: string | null };
}

/** The kinds she can pick, with what each is for. Never a dose. */
export const KINDS = (): { kind: MedicationKind; label: string; why: string }[] => [
  {
    kind: "IRON_FOLIC_ACID",
    label: tr({ en: "Iron and folic acid", pcm: "Iron and folic acid", yo: "Iron àti folic acid" }),
    why: tr({
      en: "Helps prevent anaemia and supports your baby's growth.",
      pcm: "E dey help stop low blood and e dey help your pikin grow.",
      yo: "Ó ń dènà àìtó ẹ̀jẹ̀, ó sì ń ran ìdàgbàsókè ọmọ rẹ lọ́wọ́.",
    }),
  },
  {
    kind: "FOLIC_ACID",
    label: tr({ en: "Folic acid", pcm: "Folic acid", yo: "Folic acid" }),
    why: tr({
      en: "Helps your baby's brain and spine develop, especially early in pregnancy.",
      pcm: "E dey help your pikin brain and back bone form, mostly for early pregnancy.",
      yo: "Ó ń ran ọpọlọ àti egungun ẹ̀yìn ọmọ rẹ lọ́wọ́ láti dàgbà, pàápàá ní ìbẹ̀rẹ̀ oyún.",
    }),
  },
  {
    kind: "IRON",
    label: tr({ en: "Iron", pcm: "Iron", yo: "Iron" }),
    why: tr({ en: "Helps prevent anaemia (low blood).", pcm: "E dey help stop low blood.", yo: "Ó ń dènà àìtó ẹ̀jẹ̀." }),
  },
  {
    kind: "CALCIUM",
    label: tr({ en: "Calcium", pcm: "Calcium", yo: "Calcium" }),
    why: tr({
      en: "When your clinic prescribes it, it can lower the risk of pre-eclampsia.",
      pcm: "If your clinic give you am, e fit reduce the risk of pre-eclampsia.",
      yo: "Tí kílíníìkì rẹ bá kọ ọ́ fún ọ, ó lè dín ewu pre-eclampsia kù.",
    }),
  },
  {
    kind: "ANTIMALARIAL",
    label: tr({ en: "Malaria medicine", pcm: "Malaria medicine", yo: "Oògùn ibà" }),
    why: tr({
      en: "Only what your clinic gave you. Some malaria medicines are not safe in pregnancy.",
      pcm: "Na only the one wey your clinic give you. Some malaria medicine no safe for pregnancy.",
      yo: "Èyí tí kílíníìkì rẹ fún ọ nìkan. Àwọn oògùn ibà kan kò dára fún aláboyún.",
    }),
  },
  {
    kind: "BP_MEDICINE",
    label: tr({ en: "Blood pressure medicine", pcm: "BP medicine", yo: "Oògùn ìfúnpá" }),
    why: tr({
      en: "Take it exactly as your clinic told you, even when you feel well.",
      pcm: "Take am exactly how your clinic talk, even if you dey feel fine.",
      yo: "Lò ó gẹ́gẹ́ bí kílíníìkì rẹ ṣe sọ, kódà tí ara rẹ bá yá.",
    }),
  },
  {
    kind: "ASPIRIN",
    label: tr({ en: "Low-dose aspirin", pcm: "Low-dose aspirin", yo: "Aspirin oníwọ̀n kékeré" }),
    why: tr({
      en: "Only if your clinic prescribed it for you.",
      pcm: "Only if your clinic give you am.",
      yo: "Tí kílíníìkì rẹ bá kọ ọ́ fún ọ nìkan.",
    }),
  },
  {
    kind: "OTHER",
    label: tr({ en: "Something else", pcm: "Another one", yo: "Òmíràn" }),
    why: tr({ en: "Write the name on the pack.", pcm: "Write the name wey dey the pack.", yo: "Kọ orúkọ tó wà lórí páálí rẹ̀." }),
  },
];

export const kindLabel = (k: MedicationKind) => KINDS().find((x) => x.kind === k)?.label ?? k;

/** Her medicine's name in her language when it's one of ours. */
export const medName = (m: { kind: MedicationKind; name: string }) => (m.kind === "OTHER" ? m.name : kindLabel(m.kind));

export const MISSED_REASONS = (): { v: MissedDoseReason; label: string }[] => [
  { v: "FORGOT", label: tr({ en: "I forgot", pcm: "I forget", yo: "Mo gbàgbé" }) },
  { v: "RAN_OUT", label: tr({ en: "I ran out", pcm: "E don finish", yo: "Ó ti tán" }) },
  { v: "SIDE_EFFECTS", label: tr({ en: "It made me feel unwell", pcm: "E dey make me feel bad", yo: "Ó ń mú ara mi dàrú" }) },
  { v: "COST", label: tr({ en: "Couldn't afford it", pcm: "I no get money buy am", yo: "Kò sí owó láti rà á" }) },
  { v: "FEELING_WELL", label: tr({ en: "I felt fine without it", pcm: "I dey feel fine without am", yo: "Ara mi yá láìsí i" }) },
  { v: "TOLD_TO_STOP", label: tr({ en: "A health worker told me to stop", pcm: "Health worker talk say make I stop", yo: "Òṣìṣẹ́ ìlera ní kí n dá a dúró" }) },
  { v: "OTHER", label: tr({ en: "Another reason", pcm: "Another reason", yo: "Ìdí mìíràn" }) },
];

export const missedLabel = (r: MissedDoseReason | null) => (r ? MISSED_REASONS().find((x) => x.v === r)?.label ?? r : "");

export const SIDE_EFFECTS = (): { v: SideEffectKind; label: string }[] => [
  { v: "NAUSEA", label: tr({ en: "Feeling sick", pcm: "Body dey turn", yo: "Ìríra" }) },
  { v: "VOMITING", label: tr({ en: "Vomiting", pcm: "Vomiting", yo: "Èébì" }) },
  { v: "CONSTIPATION", label: tr({ en: "Constipation", pcm: "Hard poo-poo", yo: "Ìgbẹ́ líle" }) },
  { v: "DARK_STOOLS", label: tr({ en: "Dark stools", pcm: "Black poo-poo", yo: "Ìgbẹ́ dúdú" }) },
  { v: "STOMACH_PAIN", label: tr({ en: "Stomach pain", pcm: "Belle pain", yo: "Inú rírun" }) },
  { v: "HEARTBURN", label: tr({ en: "Heartburn", pcm: "Chest dey burn", yo: "Àyà gbígbóná" }) },
  { v: "DIARRHOEA", label: tr({ en: "Diarrhoea", pcm: "Running stomach", yo: "Ìgbẹ́ gbuuru" }) },
  { v: "HEADACHE", label: tr({ en: "Headache", pcm: "Headache", yo: "Ẹ̀fọ́rí" }) },
  { v: "DIZZINESS", label: tr({ en: "Dizziness", pcm: "Head dey turn", yo: "Òòyì" }) },
  { v: "RASH", label: tr({ en: "Skin rash", pcm: "Rashes for body", yo: "Èèwo ara" }) },
  { v: "ITCHING", label: tr({ en: "Itching", pcm: "Body dey scratch", yo: "Ara yíyún" }) },
  { v: "OTHER", label: tr({ en: "Something else", pcm: "Another thing", yo: "Nǹkan mìíràn" }) },
];

export const effectLabel = (e: SideEffectKind) => SIDE_EFFECTS().find((x) => x.v === e)?.label ?? e;

export const SEVERITIES = (): { v: Severity; label: string; sub: string }[] => [
  { v: "MILD", label: tr({ en: "Mild", pcm: "Small", yo: "Díẹ̀" }), sub: tr({ en: "I can go about my day", pcm: "I fit do my things", yo: "Mo lè ṣe iṣẹ́ mi" }) },
  { v: "MODERATE", label: tr({ en: "Bothering me", pcm: "E dey worry me", yo: "Ó ń yọ mí lẹ́nu" }), sub: tr({ en: "It's hard to carry on", pcm: "E hard to continue", yo: "Ó ṣòro láti máa bá a lọ" }) },
  { v: "SEVERE", label: tr({ en: "Very bad", pcm: "E bad well well", yo: "Ó le gan-an" }), sub: tr({ en: "I can't cope", pcm: "I no fit bear am", yo: "Kò ṣeé fara dà" }) },
];

/** Signs that can mean something serious when they are very bad. */
const URGENT_WHEN_SEVERE: SideEffectKind[] = ["HEADACHE", "STOMACH_PAIN", "RASH", "VOMITING", "DIZZINESS"];

export type Advice = { level: "GO_NOW" | "CALL_TODAY" | "TELL_CLINIC"; title: string; body: string; info?: string };

/** What to do about a side effect. Plain, cautious, and never "stop your medicine". */
export function sideEffectAdvice(effect: SideEffectKind, severity: Severity): Advice {
  const dontStop = tr({
    en: "Don't stop or change a prescribed medicine on your own; talk to your clinic first.",
    pcm: "No stop or change medicine wey dem give you by yourself; talk to your clinic first.",
    yo: "Má ṣe dá oògùn tí wọ́n kọ fún ọ dúró tàbí yí i padà fúnra rẹ; bá kílíníìkì rẹ sọ̀rọ̀ ná.",
  });
  const info = INFO()[effect];
  if (severity === "SEVERE" && URGENT_WHEN_SEVERE.includes(effect)) {
    return {
      level: "GO_NOW",
      title: tr({ en: "Go to a hospital now", pcm: "Go hospital now now", yo: "Lọ sí ilé ìwòsàn ní báyìí" }),
      body: tr({
        en: "A very bad headache, stomach pain, rash, vomiting or dizziness in pregnancy needs to be checked straight away. Take your medicines with you.",
        pcm: "Strong headache, belle pain, rashes, vomiting or head wey dey turn for pregnancy need check sharp sharp. Carry your medicine follow body.",
        yo: "Ẹ̀fọ́rí, inú rírun, èèwo, èébì tàbí òòyì tó le nínú oyún nílò àyẹ̀wò lẹ́sẹ̀kẹsẹ̀. Mú àwọn oògùn rẹ dání.",
      }),
      info,
    };
  }
  if (severity !== "MILD") {
    return {
      level: "CALL_TODAY",
      title: tr({ en: "Call your clinic today", pcm: "Call your clinic today", yo: "Pe kílíníìkì rẹ lónìí" }),
      body: `${tr({
        en: "Tell them what you feel and which medicine you take. They may change how you take it.",
        pcm: "Tell them wetin you dey feel and the medicine wey you dey take. Dem fit change how you go take am.",
        yo: "Sọ ohun tí o ń ní àti oògùn tí o ń lò fún wọn. Wọ́n lè yí bí o ṣe ń lò ó padà.",
      })} ${dontStop}`,
      info,
    };
  }
  return {
    level: "TELL_CLINIC",
    title: tr({ en: "Tell your clinic at your next visit", pcm: "Tell your clinic when you go next", yo: "Sọ fún kílíníìkì rẹ nígbà tí o bá lọ" }),
    body: `${tr({
      en: "We've noted it, and your clinic can see it. If it gets worse, call them.",
      pcm: "We don write am down, and your clinic fit see am. If e worse, call them.",
      yo: "A ti kọ ọ́ sílẹ̀, kílíníìkì rẹ sì lè rí i. Tí ó bá burú sí i, pè wọ́n.",
    })} ${dontStop}`,
    info,
  };
}

/** A short, calm explanation for the common ones. */
const INFO = (): Partial<Record<SideEffectKind, string>> => ({
  NAUSEA: tr({
    en: "Feeling sick is common with iron tablets. Your clinic can suggest ways to make them easier to take.",
    pcm: "Body to dey turn common with iron tablet. Your clinic fit tell you how to take am make e easy.",
    yo: "Ìríra wọ́pọ̀ pẹ̀lú oògùn iron. Kílíníìkì rẹ lè sọ bí o ṣe lè lò ó tí kò fi ní ni ọ́ lára.",
  }),
  CONSTIPATION: tr({
    en: "Common with iron. Drink plenty of clean water and eat fruit, vegetables and beans.",
    pcm: "E common with iron. Drink plenty clean water and chop fruit, vegetable and beans.",
    yo: "Ó wọ́pọ̀ pẹ̀lú iron. Mu omi tó mọ́ púpọ̀, kí o sì jẹ èso, ẹ̀fọ́ àti ẹ̀wà.",
  }),
  DARK_STOOLS: tr({
    en: "Dark or black stools are normal with iron tablets. But if they are black and sticky and you feel faint or weak, go to a hospital now.",
    pcm: "Black poo-poo normal with iron tablet. But if e black and sticky and you dey feel weak or wan faint, go hospital now now.",
    yo: "Ìgbẹ́ dúdú wọ́pọ̀ pẹ̀lú oògùn iron. Ṣùgbọ́n tí ó bá dúdú tó sì lẹ̀mọ́, tí ara rẹ sì ń rẹ̀ ọ́ tàbí tí o fẹ́ dákú, lọ sí ilé ìwòsàn ní báyìí.",
  }),
  HEARTBURN: tr({
    en: "Common in pregnancy. Small meals and not lying down right after eating can help.",
    pcm: "E common for pregnancy. Chop small small and no lie down immediately after you chop.",
    yo: "Ó wọ́pọ̀ nínú oyún. Jíjẹ oúnjẹ kékeré àti àìdùbúlẹ̀ lẹ́sẹ̀kẹsẹ̀ lẹ́yìn oúnjẹ lè ṣèrànwọ́.",
  }),
  HEADACHE: tr({
    en: "A headache in pregnancy can be a sign of high blood pressure. Check your BP if you can.",
    pcm: "Headache for pregnancy fit mean say BP high. Check your BP if you fit.",
    yo: "Ẹ̀fọ́rí nínú oyún lè jẹ́ àmì ìfúnpá gíga. Wọn ìfúnpá rẹ tí o bá lè ṣe é.",
  }),
  ITCHING: tr({
    en: "Itching all over, especially on your hands and feet late in pregnancy, should be checked by your clinic.",
    pcm: "If your whole body dey scratch, mostly hand and leg for late pregnancy, make your clinic check am.",
    yo: "Tí gbogbo ara bá ń yún ọ, pàápàá ọwọ́ àti ẹsẹ̀ ní ìparí oyún, jẹ́ kí kílíníìkì rẹ yẹ̀ ẹ́ wò.",
  }),
  RASH: tr({
    en: "If a rash comes with blisters, peeling skin, sore mouth or eyes, or swelling of your face, go to a hospital now.",
    pcm: "If rashes come with blister, skin wey dey peel, mouth or eye wey dey pain, or face wey swell, go hospital now now.",
    yo: "Tí èèwo bá wá pẹ̀lú ìléròrò, awọ tó ń bó, ẹnu tàbí ojú tó ń dun, tàbí ojú tó wú, lọ sí ilé ìwòsàn ní báyìí.",
  }),
});

/** "08:00" → "8:00 am" */
export function prettyTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h < 12 ? "am" : "pm";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ap}`;
}

/** Suggested reminder times for 1–4 doses a day. She can change them. */
export const DEFAULT_TIMES: Record<number, string[]> = {
  1: ["08:00"],
  2: ["08:00", "20:00"],
  3: ["08:00", "14:00", "20:00"],
  4: ["07:00", "12:00", "17:00", "21:00"],
};
