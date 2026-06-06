import { Symptom } from "../hooks/useHealthData";

type Guidance = {
  title: string;
  message: string;
  actionLabel: string;
  route: "/bp-entry" | "/symptom-checker" | "/clinic-finder" | "/emergency";
  tone: "calm" | "watch" | "urgent";
};

const HIGH_ATTENTION = new Set([
  "HEADACHE",
  "BLURRED_VISION",
  "UPPER_ABDOMINAL_PAIN",
  "SHORTNESS_OF_BREATH",
]);

const SYMPTOM_GUIDANCE: Record<string, Guidance> = {
  HEADACHE: {
    title: "Headache support",
    message: "Rest, drink water, and log BP if you can. Get help quickly if it is severe or comes with vision changes.",
    actionLabel: "Check Symptoms",
    route: "/symptom-checker",
    tone: "watch",
  },
  BLURRED_VISION: {
    title: "Vision changes noted",
    message: "Vision changes can matter in pregnancy. Please check BP and contact care if it continues.",
    actionLabel: "Find Clinic",
    route: "/clinic-finder",
    tone: "urgent",
  },
  SWELLING: {
    title: "Swelling care tip",
    message: "Raise your feet when resting and keep tracking. If face or hand swelling increases, check BP.",
    actionLabel: "Log Symptoms",
    route: "/symptom-checker",
    tone: "calm",
  },
  UPPER_ABDOMINAL_PAIN: {
    title: "Pain guidance",
    message: "Upper stomach pain should be reviewed. Please contact your clinic or use emergency help if it feels strong.",
    actionLabel: "Get Help",
    route: "/emergency",
    tone: "urgent",
  },
  SHORTNESS_OF_BREATH: {
    title: "Breathing support",
    message: "If breathing feels difficult, sit upright and seek help now. Your clinic or emergency contact can guide you.",
    actionLabel: "Get Help",
    route: "/emergency",
    tone: "urgent",
  },
};

export function getPersonalizedGuidance(symptoms: Symptom[] = []): Guidance {
  const latestHighAttention = symptoms.find((symptom) => HIGH_ATTENTION.has(symptom.symptomType));
  if (latestHighAttention) {
    return SYMPTOM_GUIDANCE[latestHighAttention.symptomType];
  }

  const latest = symptoms[0];
  if (latest?.symptomType === "OTHER" && latest.customSymptom) {
    return {
      title: "We saved your symptom",
      message: `You reported ${latest.customSymptom}. Keep tracking it, and contact your clinic if it gets worse.`,
      actionLabel: "Find Clinic",
      route: "/clinic-finder",
      tone: "watch",
    };
  }

  if (latest && SYMPTOM_GUIDANCE[latest.symptomType]) {
    return SYMPTOM_GUIDANCE[latest.symptomType];
  }

  return {
    title: "Today's simple check",
    message: "Log BP from your monitor and tell us if you feel unwell. Small daily checks help alerts stay accurate.",
    actionLabel: "Add BP",
    route: "/bp-entry",
    tone: "calm",
  };
}
