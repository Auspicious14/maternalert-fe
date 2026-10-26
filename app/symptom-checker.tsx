import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { useToast } from "../components/ui/ToastProvider";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useHealthData } from "../hooks/useHealthData";
import { useMonitoringData } from "../hooks/useMonitoringData";

const SYMPTOMS = [
  {
    id: "HEADACHE",
    title: "Headache",
    icon: "flash",
    groups: [
      {
        name: "Type",
        options: [
          { id: "MILD_DULL", label: "Mild/dull" },
          { id: "THROBBING", label: "Throbbing/pulsating" },
          { id: "PRESSURE", label: "Pressure/tightness" },
          { id: "SHARP", label: "Sharp" },
          { id: "SEVERE_SUDDEN", label: "Severe/sudden" },
          { id: "ONE_SIDED", label: "One-sided" },
          { id: "BEHIND_EYES", label: "Behind the eyes" },
        ]
      },
      {
        name: "Duration",
        options: [
          { id: "LESS_THAN_1_HOUR", label: "Less than 1 hour" },
          { id: "1_6_HOURS", label: "1–6 hours" },
          { id: "MORE_THAN_6_HOURS", label: "More than 6 hours" },
          { id: "PERSISTENT", label: "Persistent/recurring" },
        ]
      },
      {
        name: "Associated symptoms",
        options: [
          { id: "BLURRED_VISION", label: "Blurred vision" },
          { id: "SEEING_SPOTS", label: "Seeing spots/flashes" },
          { id: "DIZZINESS", label: "Dizziness" },
          { id: "VOMITING", label: "Vomiting" },
          { id: "LIGHT_SENSITIVITY", label: "Sensitivity to light" },
          { id: "WEAKNESS", label: "Weakness" },
        ]
      }
    ]
  },
  {
    id: "VAGINAL_DISCHARGE",
    title: "Vaginal Discharge",
    subtitle: "Unusual discharge",
    icon: "water-outline",
    groups: [
      {
        name: "Colour",
        options: [
          { id: "CLEAR", label: "Clear" },
          { id: "WHITE", label: "White" },
          { id: "CREAMY", label: "Creamy" },
          { id: "YELLOW", label: "Yellow" },
          { id: "GREEN", label: "Green" },
          { id: "GREY", label: "Grey" },
          { id: "BROWN", label: "Brown" },
          { id: "PINK", label: "Pink" },
          { id: "BLOODY", label: "Red/bloody" },
        ]
      },
      {
        name: "Consistency",
        options: [
          { id: "CONTINUOUS_WATERY", label: "Watery" },
          { id: "THIN", label: "Thin" },
          { id: "CREAMY_CONSISTENCY", label: "Creamy" },
          { id: "THICK", label: "Thick" },
          { id: "STICKY", label: "Sticky" },
          { id: "CLUMPY", label: "Clumpy" },
        ]
      },
      {
        name: "Odour",
        options: [
          { id: "NO_SMELL", label: "No unusual smell" },
          { id: "MILD_SMELL", label: "Mild" },
          { id: "FOUL_SMELL", label: "Strong/foul smell" },
        ]
      },
      {
        name: "Associated symptoms",
        options: [
          { id: "ITCHING", label: "Itching" },
          { id: "BURNING", label: "Burning" },
          { id: "VULVAL_PAIN", label: "Vaginal/vulval pain" },
          { id: "PAIN_WHEN_URINATING", label: "Pain when urinating" },
          { id: "LOWER_ABDOMINAL_PAIN", label: "Lower abdominal pain" },
          { id: "FEVER", label: "Fever" },
        ]
      }
    ]
  },
  {
    id: "ABDOMINAL_PAIN",
    title: "Abdominal/Pelvic Pain",
    icon: "alert-circle",
    groups: [
      {
        name: "Location",
        options: [
          { id: "LOWER_ABDOMEN", label: "Lower abdomen" },
          { id: "UPPER_ABDOMEN", label: "Upper abdomen" },
          { id: "RIGHT_SIDE", label: "Right side" },
          { id: "LEFT_SIDE", label: "Left side" },
          { id: "GENERALIZED", label: "Generalized" },
          { id: "PELVIC", label: "Pelvic area" },
        ]
      },
      {
        name: "Type",
        options: [
          { id: "CRAMPING", label: "Cramping" },
          { id: "SHARP", label: "Sharp" },
          { id: "STABBING", label: "Stabbing" },
          { id: "BURNING", label: "Burning" },
          { id: "PRESSURE", label: "Pressure" },
          { id: "CONSTANT", label: "Constant" },
          { id: "COMES_AND_GOES", label: "Comes and goes" },
        ]
      }
    ]
  },
  {
    id: "VAGINAL_BLEEDING",
    title: "Vaginal Bleeding",
    icon: "medical",
    groups: [
      {
        name: "Volume",
        options: [
          { id: "SPOTTING", label: "Spotting" },
          { id: "LIGHT_BLEEDING", label: "Light bleeding" },
          { id: "MODERATE_BLEEDING", label: "Moderate bleeding" },
          { id: "HEAVY_BLEEDING", label: "Heavy bleeding" },
        ]
      },
      {
        name: "Colour",
        options: [
          { id: "PINK", label: "Pink" },
          { id: "BRIGHT_RED", label: "Bright red" },
          { id: "DARK_RED", label: "Dark red" },
          { id: "BROWN", label: "Brown" },
        ]
      }
    ]
  },
  {
    id: "NAUSEA_VOMITING",
    title: "Nausea/Vomiting",
    icon: "restaurant",
    groups: [
      {
        name: "Severity",
        options: [
          { id: "MILD_NAUSEA", label: "Mild nausea" },
          { id: "SEVERE_NAUSEA", label: "Severe nausea" },
          { id: "VOMITING_1_2", label: "Vomiting 1–2 times" },
          { id: "FREQUENT_VOMITING", label: "Frequent vomiting" },
          { id: "UNABLE_TO_KEEP_FLUIDS", label: "Unable to keep food/fluids down" },
          { id: "BLOOD_IN_VOMIT", label: "Blood in vomit" },
        ]
      }
    ]
  },
  {
    id: "URINARY_SYMPTOMS",
    title: "Urinary Symptoms",
    icon: "refresh",
    groups: [
      {
        name: "Type",
        options: [
          { id: "FREQUENT_URINATION", label: "Frequent urination" },
          { id: "PAIN_BURNING", label: "Pain/burning when urinating" },
          { id: "BLOOD_IN_URINE", label: "Blood in urine" },
          { id: "DIFFICULTY_URINATING", label: "Difficulty urinating" },
          { id: "URGENCY", label: "Urgency" },
          { id: "LOWER_ABD_PAIN", label: "Lower abdominal pain" },
          { id: "FOUL_SMELLING_URINE", label: "Foul-smelling urine" },
        ]
      }
    ]
  },
  {
    id: "FEVER",
    title: "Fever/Infection",
    icon: "thermometer",
    groups: [
      {
        name: "Symptoms",
        options: [
          { id: "MILD_FEVER", label: "Mild fever" },
          { id: "HIGH_FEVER", label: "High fever" },
          { id: "CHILLS", label: "Chills" },
          { id: "WEAKNESS", label: "Feeling unusually weak" },
          { id: "FOUL_DISCHARGE", label: "Foul-smelling vaginal discharge" },
        ]
      }
    ]
  },
  {
    id: "REDUCED_FETAL_MOVEMENT",
    title: "Fetal Movement",
    icon: "heart",
    groups: [
      {
        name: "Status (if established)",
        options: [
          { id: "LESS_THAN_USUAL", label: "Less than usual" },
          { id: "SIGNIFICANTLY_REDUCED", label: "Significantly reduced" },
          { id: "NO_MOVEMENT", label: "No movement felt" },
        ]
      }
    ]
  },
  { id: "DIFFICULTY_BREATHING", title: "Difficulty Breathing", icon: "walk" },
  { id: "CHEST_PAIN", title: "Chest Pain", icon: "heart-dislike" },
  { id: "PALPITATIONS", title: "Palpitations", subtitle: "Fast or irregular heartbeat", icon: "pulse-outline" },
  { id: "FAINTING", title: "Fainting", subtitle: "Loss of consciousness", icon: "bed" },
  { id: "ABNORMAL_BODY_MOVEMENT", title: "Convulsion/Seizure", icon: "pulse" },
  { id: "CONFUSION", title: "Confusion", icon: "help-circle" },
  { id: "SUDDEN_SWELLING", title: "Sudden Severe Swelling", icon: "hand-left" },
  { id: "PERSISTENT_ITCHING", title: "Persistent Itching", subtitle: "Especially palms/soles", icon: "hand-right" },
  { id: "BLURRED_VISION", title: "Blurred Vision / Spots", icon: "eye-off" },
  {
    id: "MALARIA",
    title: "Malaria",
    subtitle: "Suspected malaria symptoms",
    icon: "bug",
    groups: [
      {
        name: "Symptoms",
        options: [
          { id: "FEVER", label: "Fever" },
          { id: "HIGH_FEVER", label: "High fever" },
          { id: "HEADACHE", label: "Headache" },
          { id: "GENERAL_BODY_PAIN", label: "General body pain" },
          { id: "VOMITING", label: "Vomiting" },
          { id: "CHILLS", label: "Chills/shivering" },
          { id: "SWEATING", label: "Sweating" },
        ]
      }
    ]
  },
  {
    id: "ANOREXIA",
    title: "Anorexia / Loss of Appetite",
    subtitle: "Not feeling like eating",
    icon: "restaurant-outline",
  },
  { id: "OTHER", title: "Something else", subtitle: "Type what you feel", icon: "create" },
] as const;

type SymptomId = (typeof SYMPTOMS)[number]["id"];

// Offline safety net. The server's care-priority engine is the source of
// truth, but if the server can't be reached a danger sign must still route the
// mother to "go to a facility now" rather than a generic error toast.
// Based on WHO pregnancy danger signs; to be reviewed by our clinical lead.
const LOCAL_RED_FLAGS: readonly string[] = [
  "ABNORMAL_BODY_MOVEMENT", // fits / convulsions
  "VAGINAL_BLEEDING",
  "BLURRED_VISION",
  "DIFFICULTY_BREATHING",
  "CHEST_PAIN",
  "FAINTING",
  "CONFUSION",
  "REDUCED_FETAL_MOVEMENT",
  "FEVER",
];

function hasLocalRedFlag(
  selected: readonly string[],
  subOptions: Record<string, string[]>,
): boolean {
  if (selected.some((id) => LOCAL_RED_FLAGS.includes(id))) return true;
  // Upper-abdominal / below-the-ribs pain can signal severe pre-eclampsia.
  const pain = subOptions["ABDOMINAL_PAIN"] ?? [];
  return pain.includes("UPPER_ABDOMEN") || pain.includes("BELOW_RIBS");
}

const OFFLINE_DANGER_MESSAGE =
  "We could not reach our server, but one or more of your symptoms can be a danger sign in pregnancy. Go to the nearest health facility now or call your emergency contact.";


export default function SymptomCheckerScreen() {
  const router = useRouter();
  const { addSymptom, isAddingSymptom } = useHealthData();
  const { revalidateMonitoring } = useMonitoringData();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { showToast } = useToast();

  const [selected, setSelected] = useState<SymptomId[]>([]);
  const [otherSymptom, setOtherSymptom] = useState("");
  // sub-options: { [symptomId]: string[] }
  const [subOptions, setSubOptions] = useState<Record<string, string[]>>({});
  
  // Common Fields State
  const [severity, setSeverity] = useState<number>(0);
  const [trend, setTrend] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [onset, setOnset] = useState<string>("");
  const [hadBefore, setHadBefore] = useState<boolean | null>(null);
  const [medsTaken, setMedsTaken] = useState<boolean | null>(null);

  const textColor = isDark ? "#FFFFFF" : "#1A212E";
  const subTextColor = isDark ? "#94A3B8" : "#6B7280";
  const cardBg = isDark ? "#020617" : "#FFFFFF";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9";
  const subCardBg = isDark ? "#0F172A" : "#F8FAFC";

  const toggleSymptom = (id: SymptomId) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
      setSubOptions((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleSubOption = (symptomId: string, optionId: string) => {
    setSubOptions((prev) => {
      const current = prev[symptomId] ?? [];
      if (current.includes(optionId)) {
        return { ...prev, [symptomId]: current.filter((o) => o !== optionId) };
      }
      return { ...prev, [symptomId]: [...current, optionId] };
    });
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;

    const cleanedOtherSymptom = otherSymptom.trim().replace(/\s+/g, " ");
    if (selected.includes("OTHER") && !cleanedOtherSymptom) {
      showToast({ type: "error", message: "Please type the other symptom you feel." });
      return;
    }

    try {
      let hasEmergency = false;
      let hasUrgent = false;
      let msg = "";

      for (const symptomId of selected) {
        let res;
        const commonData = {
          severity: severity > 0 ? severity : undefined,
          trend: trend || undefined,
          durationLabel: duration || undefined,
          onsetAt: onset || undefined,
          hadBefore: hadBefore ?? undefined,
          medicationTaken: medsTaken ?? undefined,
        };

        if (symptomId === "OTHER") {
          res = await addSymptom({
            symptomType: "OTHER",
            customSymptom: cleanedOtherSymptom,
            ...commonData
          });
        } else {
          const symptomSubOptions = subOptions[symptomId] ?? [];
          res = await addSymptom({
            symptomType: symptomId,
            subOptions: symptomSubOptions.length > 0 ? symptomSubOptions : undefined,
            ...commonData
          } as any);
        }
        
        if (res && res.assessmentResult === "EMERGENCY") {
           hasEmergency = true;
           msg = res.patientMessage || msg;
        } else if (res && res.assessmentResult === "CLINICAL_REVIEW") {
           hasUrgent = true;
           if (!hasEmergency) msg = res.patientMessage || msg;
        } else if (res && res.patientMessage) {
           if (!hasEmergency && !hasUrgent) msg = res.patientMessage;
        }
      }

      setTimeout(() => revalidateMonitoring(), 1500);

      if (hasEmergency || hasUrgent) {
        router.push({ pathname: "/nurse-summary", params: { msg } });
      } else {
        router.push({ pathname: "/symptom-results", params: { msg } });
      }
    } catch (error) {
      console.error("Failed to submit symptoms", error);
      if (hasLocalRedFlag(selected, subOptions)) {
        router.push({
          pathname: "/nurse-summary",
          params: { msg: OFFLINE_DANGER_MESSAGE },
        });
        return;
      }
      showToast({
        type: "error",
        message: "Failed to submit symptoms. Please try again.",
      });
    }
  };

  const renderSubOptions = (symptom: any) => {
    if (!selected.includes(symptom.id as SymptomId)) return null;
    if (!("groups" in symptom) || !symptom.groups) return null;

    return (
      <View
        style={{ backgroundColor: subCardBg, borderColor: borderColor }}
        className="rounded-[24px] p-4 border mt-1 ml-4"
      >
        {symptom.groups.map((group: any) => (
          <View key={group.name} className="mb-4">
            <Typography variant="caption" weight="bold" style={{ color: textColor }} className="mb-2">
              {group.name}
            </Typography>
            <View className="flex-row flex-wrap gap-2">
              {group.options.map((opt: any) => {
                const isSelected = (subOptions[symptom.id] ?? []).includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => toggleSubOption(symptom.id, opt.id)}
                    style={{
                      backgroundColor: isSelected ? Theme.colors.primary : "transparent",
                      borderColor: isSelected ? Theme.colors.primary : borderColor,
                    }}
                    className="border rounded-full px-3 py-1.5"
                  >
                    <Typography
                      variant="caption"
                      style={{ color: isSelected ? "white" : subTextColor }}
                    >
                      {opt.label}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB" }}>
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#F9FAFB"} scrollable>
        <View className="flex-row items-center justify-between px-6 pt-4 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={textColor} />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px]">
            Report Symptoms
          </Typography>
          <View className="w-7" />
        </View>

        <View className="px-6 pb-20">
          <Typography variant="body" style={{ color: subTextColor }} className="mb-6">
            Select all symptoms you are currently experiencing:
          </Typography>

          {SYMPTOMS.map((symptom) => {
            const isSelected = selected.includes(symptom.id as SymptomId);
            return (
              <View key={symptom.id} className="mb-3">
                <TouchableOpacity
                  onPress={() => toggleSymptom(symptom.id as SymptomId)}
                  style={{
                    backgroundColor: isSelected ? Theme.colors.primary + "10" : cardBg,
                    borderColor: isSelected ? Theme.colors.primary : borderColor,
                  }}
                  className="rounded-[24px] p-4 flex-row items-center border"
                >
                  <View
                    style={{ backgroundColor: isSelected ? Theme.colors.primary : isDark ? "#1E293B" : "#F1F5F9" }}
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  >
                    <Ionicons name={symptom.icon as any} size={24} color={isSelected ? "white" : Theme.colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Typography variant="h3" weight="bold" style={{ color: textColor }}>
                      {symptom.title}
                    </Typography>
                    {(symptom as any).subtitle && (
                      <Typography variant="caption" style={{ color: subTextColor }} className="mt-0.5">
                        {(symptom as any).subtitle}
                      </Typography>
                    )}
                  </View>
                  <View
                    style={{
                      borderColor: isSelected ? Theme.colors.primary : borderColor,
                      backgroundColor: isSelected ? Theme.colors.primary : "transparent",
                    }}
                    className="w-6 h-6 rounded-full border items-center justify-center"
                  >
                    {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                </TouchableOpacity>

                {isSelected && symptom.id === "OTHER" && (
                  <View style={{ backgroundColor: subCardBg, borderColor }} className="rounded-[24px] p-4 border mt-1 ml-4">
                    <TextInput
                      placeholder="Please describe..."
                      placeholderTextColor={subTextColor}
                      value={otherSymptom}
                      onChangeText={setOtherSymptom}
                      style={{ color: textColor, minHeight: 40 }}
                      multiline
                    />
                  </View>
                )}
                {renderSubOptions(symptom)}
              </View>
            );
          })}

          {selected.length > 0 && (
            <View className="mt-8 mb-4 border-t pt-6" style={{ borderColor }}>
              <Typography variant="h3" weight="bold" style={{ color: textColor }} className="mb-4">
                Additional Details
              </Typography>
              
              <Typography variant="caption" style={{ color: subTextColor }} className="mb-2">Severity (0-10)</Typography>
              <View className="flex-row justify-between mb-6 bg-gray-100 rounded-full overflow-hidden p-1" style={{ backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }}>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <TouchableOpacity 
                    key={num} 
                    onPress={() => setSeverity(num)}
                    className="flex-1 py-2 items-center rounded-full"
                    style={{ backgroundColor: severity === num ? Theme.colors.primary : "transparent" }}
                  >
                    <Typography variant="caption" weight="bold" style={{ color: severity === num ? "white" : subTextColor }}>{num}</Typography>
                  </TouchableOpacity>
                ))}
              </View>

              <Typography variant="caption" style={{ color: subTextColor }} className="mb-2">Is it getting better or worse?</Typography>
              <View className="flex-row gap-2 mb-6">
                {["BETTER", "WORSE", "UNCHANGED"].map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setTrend(opt)}
                    className="flex-1 border rounded-full py-2 items-center"
                    style={{ 
                      borderColor: trend === opt ? Theme.colors.primary : borderColor,
                      backgroundColor: trend === opt ? Theme.colors.primary + "10" : "transparent"
                    }}
                  >
                    <Typography variant="caption" style={{ color: trend === opt ? Theme.colors.primary : subTextColor }}>
                      {opt.charAt(0) + opt.slice(1).toLowerCase()}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>

              <Typography variant="caption" style={{ color: subTextColor }} className="mb-2">How long has it lasted?</Typography>
              <TextInput
                placeholder="e.g. 2 hours, 3 days"
                placeholderTextColor={subTextColor}
                value={duration}
                onChangeText={setDuration}
                className="border rounded-2xl px-4 py-3 mb-6"
                style={{ borderColor, color: textColor }}
              />

              <Typography variant="caption" style={{ color: subTextColor }} className="mb-2">When did it start?</Typography>
              <TextInput
                placeholder="e.g. Today morning, yesterday"
                placeholderTextColor={subTextColor}
                value={onset}
                onChangeText={setOnset}
                className="border rounded-2xl px-4 py-3 mb-6"
                style={{ borderColor, color: textColor }}
              />

              <View className="flex-row items-center justify-between mb-4">
                <Typography variant="caption" style={{ color: textColor }}>Has this happened before?</Typography>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => setHadBefore(true)} className="px-4 py-2 border rounded-full" style={{ borderColor: hadBefore === true ? Theme.colors.primary : borderColor, backgroundColor: hadBefore === true ? Theme.colors.primary + "10" : "transparent" }}>
                    <Typography variant="caption" style={{ color: hadBefore === true ? Theme.colors.primary : subTextColor }}>Yes</Typography>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setHadBefore(false)} className="px-4 py-2 border rounded-full" style={{ borderColor: hadBefore === false ? Theme.colors.primary : borderColor, backgroundColor: hadBefore === false ? Theme.colors.primary + "10" : "transparent" }}>
                    <Typography variant="caption" style={{ color: hadBefore === false ? Theme.colors.primary : subTextColor }}>No</Typography>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-8">
                <Typography variant="caption" style={{ color: textColor }}>Any medication taken?</Typography>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => setMedsTaken(true)} className="px-4 py-2 border rounded-full" style={{ borderColor: medsTaken === true ? Theme.colors.primary : borderColor, backgroundColor: medsTaken === true ? Theme.colors.primary + "10" : "transparent" }}>
                    <Typography variant="caption" style={{ color: medsTaken === true ? Theme.colors.primary : subTextColor }}>Yes</Typography>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMedsTaken(false)} className="px-4 py-2 border rounded-full" style={{ borderColor: medsTaken === false ? Theme.colors.primary : borderColor, backgroundColor: medsTaken === false ? Theme.colors.primary + "10" : "transparent" }}>
                    <Typography variant="caption" style={{ color: medsTaken === false ? Theme.colors.primary : subTextColor }}>No</Typography>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isAddingSymptom}
                className={`w-full py-4 rounded-full flex-row items-center justify-center ${isAddingSymptom ? "opacity-50" : ""}`}
                style={{ backgroundColor: Theme.colors.primary }}
              >
                <Typography variant="h3" weight="bold" className="text-white">
                  {isAddingSymptom ? "Submitting..." : "Submit Symptoms"}
                </Typography>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Screen>
    </SafeAreaView>
  );
}
