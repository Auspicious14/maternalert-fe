import { CATEGORY_LABELS, EducationCategory } from "../constants/education";
import { tr } from "./i18n";

/** Topic names for the Learn screens, in the app's language. */
export const categoryLabel = (c: EducationCategory) =>
  ({
    DANGER_SIGNS: tr({ en: CATEGORY_LABELS.DANGER_SIGNS, pcm: "Danger signs", yo: "Àwọn àmì ewu" }),
    BLOOD_PRESSURE: tr({ en: CATEGORY_LABELS.BLOOD_PRESSURE, pcm: "BP", yo: "Ìfúnpá" }),
    PREGNANCY_CARE: tr({ en: CATEGORY_LABELS.PREGNANCY_CARE, pcm: "Pregnancy care", yo: "Ìtọ́jú oyún" }),
    FOOD_MEDICINE: tr({ en: CATEGORY_LABELS.FOOD_MEDICINE, pcm: "Food and medicine", yo: "Oúnjẹ àti oògùn" }),
    BIRTH: tr({ en: CATEGORY_LABELS.BIRTH, pcm: "Labour and birth", yo: "Ìrọbí àti ìbímọ" }),
    AFTER_BIRTH: tr({ en: CATEGORY_LABELS.AFTER_BIRTH, pcm: "After you born", yo: "Lẹ́yìn ìbímọ" }),
    BABY: tr({ en: CATEGORY_LABELS.BABY, pcm: "Your pikin", yo: "Ọmọ rẹ" }),
  })[c] ?? CATEGORY_LABELS[c];
