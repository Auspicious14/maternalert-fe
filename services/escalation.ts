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
        response: "Your BP looks normal. Keep logging daily.",
      };
    case 2:
      return {
        tier: 2,
        label: "MONITOR",
        color: Colors.accent,
        response: "Your BP is slightly elevated. Rest, stay hydrated, and recheck in 4 hours.",
      };
    case 3:
      return {
        tier: 3,
        label: "URGENT",
        color: Colors.accent, // Urgent uses accent color as per instructions
        response: "Your BP is high. Contact your clinic within 24 hours. Do not ignore this.",
        actionLabel: "Call Clinic",
        actionRoute: "/clinic-finder",
      };
    case 4:
      return {
        tier: 4,
        label: "CRITICAL",
        color: Colors.emergency,
        response: "DANGER. Seek urgent medical care immediately.",
        actionLabel: "Emergency Contacts",
        actionRoute: "/emergency",
      };
  }
};
