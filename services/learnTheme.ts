/**
 * learnTheme.ts — how the Learn screens look and what they pick: each topic's
 * colour and illustration, which guides to suggest this week, and topic
 * membership. Pure data, no React. Shared word-for-word with
 * maternalert-web/src/services/learnTheme.ts (only the import paths differ).
 */
import { EDUCATION_CONTENT, type EducationArticle, type EducationCategory } from "../constants/education";
import { tr } from "./i18n";

export type LearnTone = "mint" | "peach" | "lavender" | "sky" | "butter" | "rose";
export type SpotArt = "mama" | "bp" | "food" | "meds" | "bag" | "baby" | "mamababy" | "alert" | "couple" | "paircode";

/** Light-mode colours (the app draws its own dark-mode versions). */
export const TONES: Record<LearnTone, { bg: string; edge: string; ink: string }> = {
  mint: { bg: "#E3F2EC", edge: "#C5E6D7", ink: "#0A5C43" },
  peach: { bg: "#FDE9DF", edge: "#F8D2C0", ink: "#9A3F1F" },
  lavender: { bg: "#EEE8FB", edge: "#DCD2F6", ink: "#5B3FA8" },
  sky: { bg: "#E2F1FB", edge: "#C7E3F5", ink: "#1D5F8A" },
  butter: { bg: "#FFF4D6", edge: "#F7E3A6", ink: "#7A5200" },
  rose: { bg: "#FDE6E7", edge: "#F7CDD0", ink: "#A82A31" },
};

export const TOPIC_THEME: Record<EducationCategory, { tone: LearnTone; art: SpotArt }> = {
  DANGER_SIGNS: { tone: "rose", art: "alert" },
  BLOOD_PRESSURE: { tone: "sky", art: "bp" },
  PREGNANCY_CARE: { tone: "mint", art: "mama" },
  FOOD_MEDICINE: { tone: "butter", art: "meds" },
  BIRTH: { tone: "lavender", art: "bag" },
  AFTER_BIRTH: { tone: "peach", art: "mamababy" },
  BABY: { tone: "rose", art: "baby" },
};

/** Topics shown as tiles. Danger signs has its own card above them. */
export const TILE_TOPICS: EducationCategory[] = [
  "BLOOD_PRESSURE",
  "PREGNANCY_CARE",
  "FOOD_MEDICINE",
  "BIRTH",
  "AFTER_BIRTH",
  "BABY",
];

const ARTICLE_ART: Record<string, SpotArt> = {
  "eating-well": "food",
  "baby-movements": "baby",
  "antenatal-visits": "mama",
  breastfeeding: "mamababy",
  "feelings-after-birth": "mamababy",
};

export const articleArt = (a: EducationArticle): SpotArt => ARTICLE_ART[a.id] ?? TOPIC_THEME[a.category].art;
export const articleTone = (a: EducationArticle): LearnTone => TOPIC_THEME[a.category].tone;

// "Heavy bleeding after birth" lives under Danger signs but mothers look for
// it under After birth too.
const ALSO_IN: Partial<Record<EducationCategory, string[]>> = {
  AFTER_BIRTH: ["bleeding-after-birth"],
};

export function topicArticles(c: EducationCategory): EducationArticle[] {
  const extra = ALSO_IN[c] ?? [];
  return EDUCATION_CONTENT.filter((a) => a.category === c || extra.includes(a.id));
}

export const topicMinutes = (c: EducationCategory) => topicArticles(c).reduce((n, a) => n + a.readTimeMinutes, 0);

/**
 * Up to `n` everyday (not urgent) guides for this week of pregnancy: ones
 * made for her stage first (narrowest range wins), then the rest, rotated by
 * week so the picks change as she goes.
 */
export function pickedForWeek(weeks: number | null, n = 3): EducationArticle[] {
  const pool = EDUCATION_CONTENT.filter((a) => !a.urgent);
  const fits = weeks == null ? [] : pool.filter((a) => a.weeks && weeks >= a.weeks[0] && weeks <= a.weeks[1]);
  fits.sort((x, y) => x.weeks![1] - x.weeks![0] - (y.weeks![1] - y.weeks![0]));
  const rest = pool.filter((a) => !fits.includes(a) && !a.weeks);
  const shift = weeks ? weeks % Math.max(1, rest.length) : 0;
  const rotated = [...rest.slice(shift), ...rest.slice(0, shift)];
  return [...fits, ...rotated].slice(0, n);
}

/** Text in the app's language for one guide. */
export function articleText(a: EducationArticle, lang: string) {
  return (lang === "pcm" && a.pcm) || (lang === "yo" && a.yo) || a;
}

/** Simple search over titles and summaries, in the current language and English. */
export function searchArticles(q: string, lang: string): EducationArticle[] {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return EDUCATION_CONTENT.filter((a) => {
    const t = articleText(a, lang);
    const hay = `${t.title} ${t.summary} ${a.title} ${a.summary}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export function greeting(name?: string | null, now: Date = new Date()) {
  const h = now.getHours();
  const first = (name ?? "").trim().split(/\s+/)[0];
  const hi =
    h < 12
      ? tr({ en: "Good morning", pcm: "Good morning", yo: "Ẹ káàárọ̀" })
      : h < 17
        ? tr({ en: "Good afternoon", pcm: "Good afternoon", yo: "Ẹ káàsán" })
        : tr({ en: "Good evening", pcm: "Good evening", yo: "Ẹ kúùrọ̀lẹ́" });
  return first ? `${hi}, ${first}` : hi;
}

export const readTime = (m: number) =>
  tr({ en: `${m} min read`, pcm: `${m} min to read`, yo: `Ìṣẹ́jú ${m} láti kà` });

export const guidesCount = (n: number) =>
  tr({ en: `${n} guide${n === 1 ? "" : "s"}`, pcm: `${n} guide${n === 1 ? "" : "s"}`, yo: `Ìtọ́sọ́nà ${n}` });

// ── After the pregnancy ────────────────────────────────────────────────────
// Once she has had her baby, Learn leads with after-birth guides. After a
// loss it shows no baby content at all.

type Status = "ONGOING" | "DELIVERED" | "ENDED";

const AFTER_BIRTH_PICKS = ["after-birth", "breastfeeding", "feelings-after-birth", "newborn-danger-signs"];

export function picksFor(status: Status, weeks: number | null, n = 3): EducationArticle[] {
  if (status === "ENDED") return [];
  if (status === "DELIVERED") {
    return AFTER_BIRTH_PICKS.map((id) => EDUCATION_CONTENT.find((a) => a.id === id)!)
      .filter(Boolean)
      .slice(0, n);
  }
  return pickedForWeek(weeks, n);
}

export function tilesFor(status: Status): EducationCategory[] {
  if (status === "ENDED") return TILE_TOPICS.filter((c) => c !== "BIRTH" && c !== "BABY");
  if (status === "DELIVERED") return ["AFTER_BIRTH", "BABY", ...TILE_TOPICS.filter((c) => c !== "AFTER_BIRTH" && c !== "BABY" && c !== "BIRTH")];
  return TILE_TOPICS;
}

/** The urgent guide Learn puts first: pregnancy danger signs, or bleeding after birth. */
export const dangerGuideFor = (status: Status) =>
  status === "ONGOING" ? "danger-signs" : status === "DELIVERED" ? "bleeding-after-birth" : null;
