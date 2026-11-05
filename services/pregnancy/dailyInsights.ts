/**
 * dailyInsights.ts — the "Your day" cards on Home (like a daily feed): her
 * baby this week, her body, a tip, today's BP, a danger sign to know.
 * Pure: returns data; each app draws the cards its own way. Shared
 * word-for-word with maternalert-fe/services/pregnancy/dailyInsights.ts
 * (only the import paths differ).
 */
import { getWeekData } from "../../constants/fetal-development";
import { tr } from "../i18n";
import { fruitFor, type FruitKind, type PregnancyDay } from "./pregnancyDay";

export type InsightTone = "mint" | "peach" | "lavender" | "sky" | "butter" | "rose";

export interface Insight {
  id: string;
  tone: InsightTone;
  kicker: string;
  title: string;
  body?: string;
  cta: string;
  href: string;
  fruit?: FruitKind;
  icon?: "heart" | "body" | "bulb" | "pulse" | "alert" | "spark";
}

const DANGER_SIGNS = () => [
  tr({ en: "A bad headache that won't go away", pcm: "Strong headache wey no gree go", yo: "Ẹ̀fọ́rí líle tí kò lọ" }),
  tr({ en: "Blurred vision or seeing spots", pcm: "Eye wey dey blur or you dey see spots", yo: "Ojú tó ń ṣú tàbí rírí àmì" }),
  tr({ en: "Bleeding from the vagina", pcm: "Blood wey dey comot from your private part", yo: "Ẹ̀jẹ̀ tó ń jáde láti ojú ara" }),
  tr({ en: "Fits (convulsions)", pcm: "Fits (jerking)", yo: "Gìrì" }),
  tr({ en: "Baby moving less than usual", pcm: "Pikin no dey move like before", yo: "Ọmọ kò rìn tó bí ó ti máa ń rìn" }),
  tr({ en: "Sudden swelling of the face or hands", pcm: "Face or hand wey swell sudden sudden", yo: "Ojú tàbí ọwọ́ tó wú lójijì" }),
  tr({ en: "Pain under the ribs or in the upper belly", pcm: "Pain under your ribs or upper belle", yo: "Ìrora lábẹ́ egungun ìhà tàbí ikùn òkè" }),
  tr({ en: "Fever, or a bad-smelling discharge", pcm: "Fever, or something wey dey smell dey comot", yo: "Ibà, tàbí ohun tó ń rùn tó ń jáde" }),
];

const dayOfYear = (d: Date) => Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86_400_000);

export function dailyInsights(
  p: PregnancyDay,
  opts: { isToday: boolean; bpToday?: { systolic: number; diastolic: number } | null },
): Insight[] {
  const data = getWeekData(Math.max(4, p.week));
  const n = dayOfYear(p.date);
  const cards: Insight[] = [];

  if (data) {
    cards.push({
      id: "baby",
      tone: "mint",
      kicker: tr({ en: `Your baby · week ${p.week}`, pcm: `Your pikin · week ${p.week}`, yo: `Ọmọ rẹ · ọ̀sẹ̀ ${p.week}` }),
      title: tr({ en: `Size of a ${data.size}`, pcm: `Size of ${data.size}`, yo: `Bí ${data.size} ṣe tóbi` }),
      cta: tr({ en: "See how baby is growing", pcm: "See how pikin dey grow", yo: "Wo bí ọmọ ṣe ń dàgbà" }),
      href: "/fetal-development",
      fruit: fruitFor(data.size),
    });
  }

  if (opts.isToday) {
    const bp = opts.bpToday;
    cards.push(
      bp
        ? {
            id: "bp",
            tone: "sky",
            kicker: tr({ en: "Blood pressure today", pcm: "Your BP today", yo: "Ìfúnpá rẹ lónìí" }),
            title: `${bp.systolic}/${bp.diastolic}`,
            body: tr({ en: "Logged. Well done.", pcm: "You don log am. Well done.", yo: "O ti kọ ọ́. O ṣe dáadáa." }),
            cta: tr({ en: "See your readings", pcm: "See your readings", yo: "Wo àwọn ìwọ̀n rẹ" }),
            href: "/tracking",
            icon: "pulse",
          }
        : {
            id: "bp",
            tone: "sky",
            kicker: tr({ en: "Blood pressure today", pcm: "Your BP today", yo: "Ìfúnpá rẹ lónìí" }),
            title: tr({ en: "Not checked yet", pcm: "You never check am", yo: "O kò tíì wò ó" }),
            cta: tr({ en: "Log it now", pcm: "Log am now", yo: "Kọ ọ́ báyìí" }),
            href: "/bp-entry",
            icon: "pulse",
          },
    );
  }

  if (data) {
    const body = data.motherChanges[n % data.motherChanges.length];
    cards.push({
      id: "body",
      tone: "peach",
      kicker: tr({ en: "Your body this week", pcm: "Your body this week", yo: "Ara rẹ ní ọ̀sẹ̀ yìí" }),
      title: body,
      cta: tr({ en: "Read more", pcm: "Read more", yo: "Ka sí i" }),
      href: "/fetal-development",
      icon: "body",
    });
    const fact = data.babyDevelopment[n % data.babyDevelopment.length];
    cards.push({
      id: "fact",
      tone: "lavender",
      kicker: tr({ en: "Did you know?", pcm: "You know say?", yo: "Ṣé o mọ̀?" }),
      title: fact,
      cta: tr({ en: "More about baby", pcm: "More about pikin", yo: "Sí i nípa ọmọ" }),
      href: "/fetal-development",
      icon: "spark",
    });
    cards.push({
      id: "tip",
      tone: "butter",
      kicker: tr({ en: "Tip for this week", pcm: "Tip for this week", yo: "Ìmọ̀ràn ọ̀sẹ̀ yìí" }),
      title: data.tip,
      cta: tr({ en: "More tips in Learn", pcm: "More tips for Learn", yo: "Ìmọ̀ràn sí i ní Kẹ́kọ̀ọ́" }),
      href: "/education",
      icon: "bulb",
    });
  }

  const signs = DANGER_SIGNS();
  cards.push({
    id: "danger",
    tone: "rose",
    kicker: tr({ en: "Know the danger signs", pcm: "Know the danger signs", yo: "Mọ àwọn àmì ewu" }),
    title: signs[n % signs.length],
    body: tr({ en: "If you have this, get help now.", pcm: "If you get am, find help now now.", yo: "Tí o bá ní èyí, wá ìrànlọ́wọ́ ní báyìí." }),
    cta: tr({ en: "All danger signs", pcm: "All danger signs", yo: "Gbogbo àmì ewu" }),
    href: "/education/danger-signs",
    icon: "alert",
  });

  return cards;
}
