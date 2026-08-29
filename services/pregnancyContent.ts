/**
 * pregnancyContent.ts
 *
 * Reusable pregnancy-aware content service.
 *
 * CLINICAL SAFETY NOTICE:
 * - All content is general wellness guidance, not medical treatment.
 * - No diagnostic claims are made.
 * - Sensitive nutrition advice (supplements, dosages) is intentionally
 *   omitted — users are directed to their healthcare provider.
 * - Exercise guidance avoids high-risk activities and always includes a
 *   reminder to follow individual healthcare provider advice.
 * - Content is written in simple language for low-literacy users.
 *
 * DESIGN:
 * - Each week can override trimester defaults for precision.
 * - Trimester defaults cover any week not explicitly listed.
 * - Do NOT add diagnostic logic to this file.
 */

import { Trimester } from "./pregnancyTimeline";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NutritionReminder {
  title: string;
  message: string;
  /** Simple tip bullet points — max 3 */
  tips: string[];
}

export interface ActivitySuggestion {
  title: string;
  message: string;
  activities: ActivityItem[];
  /** Always displayed reminder to follow provider advice */
  safetyNote: string;
}

export interface ActivityItem {
  name: string;
  description: string;
  /** e.g. "10–15 min", "as tolerated" */
  duration: string;
  emoji: string;
}

export interface PregnancyMilestone {
  title: string;
  message: string;
  emoji: string;
}

export interface WeeklyPregnancyContent {
  week: number;
  nutrition: NutritionReminder;
  activity: ActivitySuggestion;
  milestone: PregnancyMilestone;
  /** When to contact care — shown as a soft reminder, not a diagnosis */
  seekCareReminder: string;
}

// ─── Trimester defaults ───────────────────────────────────────────────────────

const TRIMESTER_NUTRITION: Record<Trimester, NutritionReminder> = {
  1: {
    title: "Eating well in early pregnancy",
    message:
      "Your baby is growing fast. Simple, wholesome meals help both of you.",
    tips: [
      "Eat small meals every 2–3 hours if nausea is a problem",
      "Include iron-rich foods: beans, leafy greens, eggs",
      "Drink at least 8 cups of water a day",
    ],
  },
  2: {
    title: "Nourishing food for a growing baby",
    message:
      "Your appetite is back. This is a great time to focus on nutrient-rich foods.",
    tips: [
      "Include protein at every meal: chicken, fish, beans, nuts",
      "Eat colourful fruits and vegetables for vitamins and fibre",
      "Dairy or calcium-rich foods support your baby's bones",
    ],
  },
  3: {
    title: "Eating well in your final weeks",
    message:
      "Your baby is gaining weight quickly. Smaller, more frequent meals help.",
    tips: [
      "Eat smaller portions more often — your stomach has less space",
      "Include omega-3 rich foods: fish, walnuts for brain development",
      "Avoid very salty foods to help manage swelling",
    ],
  },
};

const TRIMESTER_ACTIVITY: Record<Trimester, ActivitySuggestion> = {
  1: {
    title: "Gentle movement in early pregnancy",
    message:
      "Light activity is safe and good for you. Listen to your body and rest when you need to.",
    activities: [
      {
        name: "Short walks",
        description:
          "A gentle 10-minute walk in fresh air can boost your mood and energy.",
        duration: "10–15 min",
        emoji: "🚶‍♀️",
      },
      {
        name: "Gentle stretching",
        description:
          "Slow stretches ease back tension and improve circulation.",
        duration: "5–10 min",
        emoji: "🧘‍♀️",
      },
      {
        name: "Deep breathing",
        description:
          "Slow, calm breathing reduces stress and helps with nausea.",
        duration: "5 min",
        emoji: "🌬️",
      },
    ],
    safetyNote:
      "Always follow the advice of your midwife or doctor. Stop any activity that causes pain, dizziness, or bleeding.",
  },
  2: {
    title: "Staying active in mid-pregnancy",
    message:
      "Many women feel their best in the second trimester. Gentle daily movement benefits you and your baby.",
    activities: [
      {
        name: "Walking",
        description:
          "A comfortable daily walk keeps your body moving and lifts your mood.",
        duration: "20–30 min",
        emoji: "🚶‍♀️",
      },
      {
        name: "Gentle yoga / stretching",
        description:
          "Pregnancy-safe stretches ease back pain and improve flexibility.",
        duration: "15–20 min",
        emoji: "🧘‍♀️",
      },
      {
        name: "Pelvic floor exercises",
        description:
          "Gentle squeezes of the pelvic floor muscles support your bladder and prepare for birth.",
        duration: "5 min (several times daily)",
        emoji: "💪",
      },
      {
        name: "Swimming or water walking",
        description:
          "Water supports your weight and is very comfortable during pregnancy.",
        duration: "20–30 min",
        emoji: "🏊‍♀️",
      },
    ],
    safetyNote:
      "Always follow the advice of your midwife or doctor. Stop any activity that causes pain, dizziness, or bleeding and seek care if worried.",
  },
  3: {
    title: "Staying comfortable and active",
    message:
      "Movement is still beneficial even as your bump grows. Gentle activity reduces back pain and prepares your body for birth.",
    activities: [
      {
        name: "Short gentle walks",
        description:
          "Even 10-minute walks help circulation and reduce leg swelling.",
        duration: "10–20 min",
        emoji: "🚶‍♀️",
      },
      {
        name: "Seated stretches",
        description:
          "Gentle stretches while sitting ease back and hip discomfort.",
        duration: "5–10 min",
        emoji: "🪑",
      },
      {
        name: "Breathing and relaxation",
        description:
          "Practise slow breathing patterns — useful during labour contractions.",
        duration: "5–10 min",
        emoji: "🌬️",
      },
      {
        name: "Pelvic floor exercises",
        description:
          "Continue gentle pelvic floor exercises to support your body.",
        duration: "5 min",
        emoji: "💪",
      },
      {
        name: "Rest",
        description:
          "Rest is exercise too. Lie on your left side to improve blood flow.",
        duration: "As needed",
        emoji: "🛌",
      },
    ],
    safetyNote:
      "Always follow the advice of your midwife or doctor. Stop any activity that causes pain, dizziness, or bleeding and seek care if worried.",
  },
};

// ─── Week-specific overrides ──────────────────────────────────────────────────

const WEEK_NUTRITION_OVERRIDES: Partial<Record<number, NutritionReminder>> = {
  4: {
    title: "Early pregnancy eating",
    message: "Your body is already working hard. Good food helps from day one.",
    tips: [
      "Take folic acid as advised by your health worker every day",
      "Eat iron-rich foods: beans, leafy greens, eggs",
      "Stay hydrated — aim for 8 cups of water daily",
    ],
  },
  6: {
    title: "Managing nausea with food",
    message: "Nausea is very common this week. Eating little and often helps.",
    tips: [
      "Eat small amounts every 2 hours — an empty stomach makes nausea worse",
      "Plain foods (rice, bread, crackers) are often best tolerated",
      "Ginger tea or ginger biscuits may ease nausea for some women",
    ],
  },
  13: {
    title: "Second trimester nutrition",
    message:
      "Your appetite is returning. Now is a great time to focus on nourishing meals.",
    tips: [
      "Include protein at every meal to support your baby's rapid growth",
      "Eat calcium-rich foods daily: dairy, sardines, dark leafy greens",
      "Continue iron-rich foods and stay well hydrated",
    ],
  },
  24: {
    title: "Iron and calcium this week",
    message:
      "Your baby needs more minerals now. Iron and calcium are especially important.",
    tips: [
      "Eat iron-rich foods daily: meat, beans, fortified cereals, spinach",
      "Pair iron-rich foods with vitamin C (orange, tomato) for better absorption",
      "Calcium from dairy, fortified soya or leafy greens supports bone development",
    ],
  },
  28: {
    title: "Third trimester nutrition",
    message:
      "Your baby is gaining weight rapidly. Nutritious, smaller meals are key.",
    tips: [
      "Eat smaller meals more often — your stomach has less space now",
      "Include protein, complex carbs, and healthy fats at each meal",
      "Avoid very salty and processed foods to help manage swelling",
    ],
  },
  36: {
    title: "Eating well towards the end",
    message:
      "Your baby is nearly ready. Keep eating well to stay strong for labour.",
    tips: [
      "Continue iron-rich foods to help prevent anaemia before birth",
      "Stay hydrated — dehydration can cause Braxton Hicks contractions",
      "Eat meals that are easy to digest: your stomach has little room",
    ],
  },
  40: {
    title: "Nutrition at your due date",
    message: "You are at your due date. Keep eating and hydrating well.",
    tips: [
      "Eat light, nutritious meals that are easy to digest",
      "Stay well hydrated throughout the day",
      "Have snacks ready for early labour — you will need energy",
    ],
  },
};

const WEEK_MILESTONES: Partial<Record<number, PregnancyMilestone>> = {
  4: {
    title: "Very early pregnancy",
    message:
      "Your pregnancy is just beginning. Your body is already making changes to support new life.",
    emoji: "🌱",
  },
  8: {
    title: "All major organs forming",
    message:
      "This is a critical week — all of your baby's major organs are beginning to develop.",
    emoji: "❤️",
  },
  12: {
    title: "End of first trimester",
    message:
      "You have reached 12 weeks. The biggest developmental changes are complete and risk of miscarriage drops significantly.",
    emoji: "🎉",
  },
  13: {
    title: "Welcome to the second trimester!",
    message:
      "You have entered the second trimester. Many women start to feel much better now.",
    emoji: "🌟",
  },
  20: {
    title: "Halfway there!",
    message:
      "You are halfway through your pregnancy. Your baby is now measured from head to toe.",
    emoji: "🍌",
  },
  24: {
    title: "Viability milestone",
    message:
      "Your baby now has a chance of survival if born early with specialist care.",
    emoji: "💛",
  },
  28: {
    title: "Welcome to the third trimester!",
    message:
      "You have reached the third trimester. Your baby is gaining weight rapidly now.",
    emoji: "🌙",
  },
  36: {
    title: "Early term",
    message:
      "Your baby is considered early term. The lungs and brain are nearly mature.",
    emoji: "✨",
  },
  38: {
    title: "Full term!",
    message: "Your baby is full term and could arrive any day now. Get ready!",
    emoji: "🎁",
  },
  40: {
    title: "Due date week!",
    message:
      "This is your estimated due date week. Only 5% of babies arrive exactly on their due date — yours may come a little before or after.",
    emoji: "🍉",
  },
  42: {
    title: "Post-term",
    message:
      "You are past 42 weeks. Please contact your health facility if you haven't already.",
    emoji: "🏥",
  },
};

const SEEK_CARE_REMINDERS: Partial<Record<number, string>> = {
  28: "From now on, pay attention to your baby's movements. Contact your clinic if movements reduce significantly.",
  32: "Regular antenatal visits are important in the third trimester. Attend all your scheduled appointments.",
  36: "Know the signs of labour. Contact your health facility immediately if you notice regular contractions, waters breaking, or any bleeding.",
  38: "Know the signs of labour and have your plan ready to get to the health facility at any time.",
  40: "Contact your health facility if you haven't delivered by your due date. They will guide next steps.",
  42: "You are past your due date. Please contact your health facility today if you haven't done so.",
};

const TRIMESTER_SEEK_CARE: Record<Trimester, string> = {
  1: "Contact your clinic if you experience heavy bleeding, severe abdominal pain, or high fever.",
  2: "Contact your clinic if you notice reduced fetal movement, heavy bleeding, or severe headache.",
  3: "Contact your clinic immediately if labour signs begin, movements reduce, or you have severe headache or swelling.",
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get nutrition reminder for a given week.
 * Week-specific overrides take priority over trimester defaults.
 */
export function getNutritionReminder(
  week: number,
  trimester: Trimester,
): NutritionReminder {
  // Find nearest week override at or below current week
  const overrideWeeks = Object.keys(WEEK_NUTRITION_OVERRIDES)
    .map(Number)
    .filter((w) => w <= week)
    .sort((a, b) => b - a);
  const matchWeek = overrideWeeks[0];
  if (matchWeek !== undefined && matchWeek >= week - 4) {
    return WEEK_NUTRITION_OVERRIDES[matchWeek]!;
  }
  return TRIMESTER_NUTRITION[trimester];
}

/**
 * Get activity suggestion for a given week and trimester.
 */
export function getActivitySuggestion(
  _week: number,
  trimester: Trimester,
): ActivitySuggestion {
  return TRIMESTER_ACTIVITY[trimester];
}

/**
 * Get weekly milestone for a given week.
 */
export function getPregnancyMilestone(week: number): PregnancyMilestone {
  // Find the closest milestone at or below current week
  const milestoneWeeks = Object.keys(WEEK_MILESTONES)
    .map(Number)
    .filter((w) => w <= week)
    .sort((a, b) => b - a);
  const matchWeek = milestoneWeeks[0];
  if (matchWeek !== undefined) {
    return WEEK_MILESTONES[matchWeek]!;
  }
  return {
    title: "Your pregnancy journey",
    message:
      "Each week brings new changes. Keep attending your antenatal visits.",
    emoji: "💚",
  };
}

/**
 * Get the "seek care" reminder for a given week.
 */
export function getSeekCareReminder(
  week: number,
  trimester: Trimester,
): string {
  // Find nearest week override
  const overrideWeeks = Object.keys(SEEK_CARE_REMINDERS)
    .map(Number)
    .filter((w) => w <= week)
    .sort((a, b) => b - a);
  const matchWeek = overrideWeeks[0];
  if (matchWeek !== undefined && matchWeek >= week - 4) {
    return SEEK_CARE_REMINDERS[matchWeek]!;
  }
  return TRIMESTER_SEEK_CARE[trimester];
}

/**
 * Get the full weekly content bundle for a given pregnancy week.
 */
export function getWeeklyContent(
  week: number,
  trimester: Trimester,
): WeeklyPregnancyContent {
  return {
    week,
    nutrition: getNutritionReminder(week, trimester),
    activity: getActivitySuggestion(week, trimester),
    milestone: getPregnancyMilestone(week),
    seekCareReminder: getSeekCareReminder(week, trimester),
  };
}
