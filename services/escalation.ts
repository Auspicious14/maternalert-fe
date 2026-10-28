import { tr } from "./i18n";
import { Colors } from "../constants/Colors";

export type Tier = 1 | 2 | 3 | 4;

export interface TierInfo {
  tier: Tier;
  label: string;
  color: string;
  response: string;
  actionLabel?: string;
  actionRoute?: string;
}

export const getTier = (systolic: number, diastolic: number): Tier => {
  if (systolic >= 150 || diastolic >= 100) return 4;
  if (systolic >= 140 || diastolic >= 90) return 3;
  if (systolic >= 130 || diastolic >= 80) return 2;
  return 1;
};

export const getTierInfo = (tier: Tier): TierInfo => {
  switch (tier) {
    case 1:
      return {
        tier: 1,
        label: "ROUTINE",
        color: Colors.primary,
        response: tr({ en: "Your blood pressure looks normal. Keep checking it every day.", pcm: "Your BP dey normal. Dey check am every day.", yo: "Ìfúnpá rẹ dára. Máa wò ó lójoojúmọ́." }),
      };
    case 2:
      return {
        tier: 2,
        label: "MONITOR",
        color: Colors.accent,
        response: tr({ en: "Rest for a while and drink some water, then check again in about 4 hours.", pcm: "Rest small and drink water, then check am again after like 4 hours.", yo: "Sinmi díẹ̀ kí o mu omi, kí o tún un wò lẹ́yìn nǹkan bí wákàtí mẹ́rin." }),
      };
    case 3:
      return {
        tier: 3,
        label: "URGENT",
        color: "#EA580C", // Darker orange so URGENT is visibly different from MONITOR
        response: tr({ en: "Contact your clinic today. Don't wait for your next appointment.", pcm: "Call your clinic today. No wait for your next appointment.", yo: "Pe kílíníìkì rẹ lónìí. Má ṣe dúró de ìpàdé rẹ tó ń bọ̀." }),
        actionLabel: tr({ en: "Call Clinic", pcm: "Call clinic", yo: "Pe kílíníìkì" }),
        actionRoute: "/clinic-finder",
      };
    case 4:
      return {
        tier: 4,
        label: "CRITICAL",
        color: Colors.emergency,
        response: tr({ en: "Go to a health facility now. Very high blood pressure in pregnancy needs care straight away.", pcm: "Go hospital now now. When BP high well well for pregnancy, e need care sharp sharp.", yo: "Lọ sí ilé ìwòsàn ní báyìí. Ìfúnpá tó ga jù nínú oyún nílò ìtọ́jú kíákíá." }),
        actionLabel: tr({ en: "Emergency Contacts", pcm: "Emergency contacts", yo: "Àwọn ẹni pàjáwìrì" }),
        actionRoute: "/emergency",
      };
  }
};
