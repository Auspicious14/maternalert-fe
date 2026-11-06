/**
 * supportTips.ts — "How you can help this week" for a partner or family
 * member. Pure data. Shared word-for-word with
 * maternalert-web/src/services/supportTips.ts (only the import paths differ).
 */
import { tr } from "./i18n";
import type { LearnTone, SpotArt } from "./learnTheme";

export interface SupportTip {
  id: string;
  title: string;
  body: string;
  tone: LearnTone;
  art: SpotArt;
}

type Stage = 1 | 2 | 3 | "after";

const T = (id: string, stages: Stage[], tone: LearnTone, art: SpotArt, title: { en: string; pcm: string; yo: string }, body: { en: string; pcm: string; yo: string }) => ({
  id,
  stages,
  tone,
  art,
  title,
  body,
});

const ALL = [
  T("visit", [1, 2, 3], "sky", "mama",
    { en: "Go with her to her next visit", pcm: "Follow her go clinic next time", yo: "Bá a lọ sí ìbẹ̀wò rẹ̀ tó kàn" },
    { en: "Hearing what the health worker says helps you both remember it.", pcm: "If you hear wetin health worker talk, una two go remember am.", yo: "Gbígbọ́ ohun tí òṣìṣẹ́ ìlera sọ yóò ràn yín méjèèjì lọ́wọ́ láti rántí." }),
  T("iron", [1, 2, 3], "butter", "meds",
    { en: "Help her keep up with her tablets", pcm: "Help her take her tablet every day", yo: "Ràn án lọ́wọ́ láti máa lo àwọn oògùn rẹ̀" },
    { en: "Iron and folic acid work best taken every day. A reminder at breakfast helps.", pcm: "Iron and folic acid dey work well if she take am every day. Remind her for morning.", yo: "Iron àti folic acid ń ṣiṣẹ́ dáadáa tí a bá ń lò ó lójoojúmọ́. Rírán an létí ní àárọ̀ ń ṣèrànwọ́." }),
  T("food", [1, 2, 3], "mint", "food",
    { en: "Make sure there's good food at home", pcm: "Make sure say better food dey house", yo: "Rí i dájú pé oúnjẹ tó dára wà nílé" },
    { en: "Beans, eggs, fish, vegetables and fruit help her and the baby grow strong.", pcm: "Beans, egg, fish, vegetable and fruit dey help her and the pikin grow well.", yo: "Ẹ̀wà, ẹyin, ẹja, ẹ̀fọ́ àti èso ń ran òun àti ọmọ lọ́wọ́ láti lágbára." }),
  T("tired", [1], "lavender", "mama",
    { en: "She may feel very tired and sick", pcm: "She fit dey tire and dey feel sick", yo: "Ó lè máa rẹ̀ ẹ́ gidigidi kí inú sì máa rú u" },
    { en: "The first months are hard. Take on more of the cooking and chores so she can rest.", pcm: "First months dey hard. Help with cooking and house work make she fit rest.", yo: "Àwọn oṣù àkọ́kọ́ le. Ṣe púpọ̀ nínú oúnjẹ sísè àti iṣẹ́ ilé kí ó lè sinmi." }),
  T("back", [2, 3], "peach", "mama",
    { en: "Help with lifting and heavy chores", pcm: "Help her carry heavy things", yo: "Ràn án lọ́wọ́ pẹ̀lú gbígbé ẹrù àti iṣẹ́ líle" },
    { en: "Her back may ache as the bump grows. Let her rest on her side.", pcm: "Her back fit dey pain as belle dey grow. Make she rest for her side.", yo: "Ẹ̀yìn rẹ̀ lè máa dùn bí ikùn ṣe ń dàgbà. Jẹ́ kí ó sinmi ní ẹ̀gbẹ́." }),
  T("signs", [1, 2, 3, "after"], "rose", "alert",
    { en: "Learn the danger signs", pcm: "Learn the danger signs", yo: "Kọ́ àwọn àmì ewu" },
    { en: "If she has one, you may be the person who gets her to hospital. Don't wait.", pcm: "If she get one, na you fit carry her go hospital. No wait.", yo: "Tí ó bá ní ọ̀kan, ìwọ ni ẹni tí ó lè gbé e lọ sí ilé ìwòsàn. Má ṣe dúró." }),
  T("fund", [2, 3], "lavender", "bag",
    { en: "Start a small birth fund", pcm: "Start to save small money for delivery", yo: "Bẹ̀rẹ̀ owó ìpamọ́ kékeré fún ìbímọ" },
    { en: "Put money aside for transport and the hospital bill, so a late-night trip is never delayed.", pcm: "Keep money for transport and hospital bill, make night emergency no delay.", yo: "Fi owó pamọ́ fún ọkọ̀ àti owó ilé ìwòsàn, kí ìrìn òru má baà pẹ́." }),
  T("transport", [3], "sky", "bag",
    { en: "Plan how you'll get to the hospital", pcm: "Plan how una go reach hospital", yo: "Ṣètò bí ẹ ṣe máa dé ilé ìwòsàn" },
    { en: "Agree on a car or driver you can call at any hour, and keep their number ready.", pcm: "Agree on car or driver wey you fit call any time, keep the number ready.", yo: "Ẹ fohùn ṣọ̀kan lórí ọkọ̀ tàbí awakọ̀ tí ẹ lè pè nígbàkígbà, kí ẹ sì pa nọ́ńbà rẹ̀ mọ́." }),
  T("bag", [3], "butter", "bag",
    { en: "Help pack the hospital bag", pcm: "Help pack the hospital bag", yo: "Ràn án lọ́wọ́ láti di àpò ilé ìwòsàn" },
    { en: "Clothes for her and the baby, pads, her clinic card, and money. Keep it by the door.", pcm: "Clothes for her and pikin, pad, her clinic card and money. Keep am near door.", yo: "Aṣọ fún òun àti ọmọ, páàdì, káàdì kílíníìkì rẹ̀, àti owó. Fi sí ẹ̀gbẹ́ ilẹ̀kùn." }),
  T("rest-after", ["after"], "peach", "mamababy",
    { en: "Let her rest and heal", pcm: "Make she rest and heal", yo: "Jẹ́ kí ó sinmi kí ara rẹ̀ lè yá" },
    { en: "Take over chores for the first weeks, and help with the baby at night.", pcm: "Do the house work for first weeks, and help with pikin for night.", yo: "Ṣe iṣẹ́ ilé fún ọ̀sẹ̀ àkọ́kọ́, kí o sì ràn án lọ́wọ́ pẹ̀lú ọmọ ní òru." }),
  T("mood-after", ["after"], "lavender", "mamababy",
    { en: "Check how she's feeling", pcm: "Ask how she dey feel", yo: "Béèrè bí ara rẹ̀ ṣe rí" },
    { en: "Low mood after birth is common. If it lasts more than 2 weeks, help her talk to her clinic.", pcm: "Sadness after birth common. If e pass 2 weeks, help her talk to her clinic.", yo: "Ìbànújẹ́ lẹ́yìn ìbímọ wọ́pọ̀. Tí ó bá ju ọ̀sẹ̀ méjì lọ, ràn án lọ́wọ́ láti bá kílíníìkì sọ̀rọ̀." }),
];

/** Three tips for her stage, changing week by week. */
export function supportTips(weeks: number | null, delivered: boolean, n = 3): SupportTip[] {
  const stage: Stage = delivered ? "after" : weeks == null ? 2 : weeks <= 13 ? 1 : weeks <= 27 ? 2 : 3;
  const pool = ALL.filter((t) => t.stages.includes(stage));
  const shift = (weeks ?? 0) % pool.length;
  // Danger signs always stay in the list.
  const rotated = [...pool.slice(shift), ...pool.slice(0, shift)];
  const pick = [rotated.find((t) => t.id === "signs")!, ...rotated.filter((t) => t.id !== "signs")].slice(0, n);
  return pick.map((t) => ({ id: t.id, tone: t.tone, art: t.art, title: tr(t.title), body: tr(t.body) }));
}
