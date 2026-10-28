import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AppHeader, Banner, Button, FONT, Page, T, useTokens } from "../components/ds";
import { useToast } from "../components/ui/ToastProvider";
import { useHealthData } from "../hooks/useHealthData";
import { useLang } from "../hooks/useLang";
import { tx } from "../services/pidgin";
import { useMonitoringData } from "../hooks/useMonitoringData";

// Same screen as maternalert-web/src/app/(patient)/symptom-checker/page.tsx

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
  "SUDDEN_SWELLING", // sudden face/hand swelling: pre-eclampsia sign
];

// Detail options that are danger signs on their own, keyed by symptom.
const LOCAL_RED_FLAG_DETAILS: Record<string, string[]> = {
  HEADACHE: ["SEVERE_SUDDEN", "BLURRED_VISION", "SEEING_SPOTS"],
  ABDOMINAL_PAIN: ["UPPER_ABDOMEN"],
  VAGINAL_BLEEDING: ["HEAVY_BLEEDING", "MODERATE_BLEEDING"],
  NAUSEA_VOMITING: ["BLOOD_IN_VOMIT", "UNABLE_TO_KEEP_FLUIDS"],
  REDUCED_FETAL_MOVEMENT: ["NO_MOVEMENT", "SIGNIFICANTLY_REDUCED"],
  FEVER: ["HIGH_FEVER"],
};

function hasLocalRedFlag(
  selected: readonly string[],
  subOptions: Record<string, string[]>,
): boolean {
  if (selected.some((id) => LOCAL_RED_FLAGS.includes(id))) return true;
  return Object.entries(LOCAL_RED_FLAG_DETAILS).some(
    ([symptomId, dangerous]) =>
      selected.includes(symptomId) &&
      (subOptions[symptomId] ?? []).some((opt) => dangerous.includes(opt)),
  );
}

const OFFLINE_DANGER_MESSAGE =
  "We could not reach our server, but one or more of your symptoms can be a danger sign in pregnancy. Go to the nearest health facility now or call your emergency contact.";


const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  HEADACHE: "flash-outline",
  VAGINAL_DISCHARGE: "water-outline",
  ABDOMINAL_PAIN: "body-outline",
  VAGINAL_BLEEDING: "water",
  NAUSEA_VOMITING: "restaurant-outline",
  URINARY_SYMPTOMS: "beaker-outline",
  FEVER: "thermometer-outline",
  REDUCED_FETAL_MOVEMENT: "happy-outline",
  DIFFICULTY_BREATHING: "cloud-outline",
  CHEST_PAIN: "heart-dislike-outline",
  PALPITATIONS: "pulse-outline",
  FAINTING: "warning-outline",
  ABNORMAL_BODY_MOVEMENT: "flash",
  CONFUSION: "help-circle-outline",
  SUDDEN_SWELLING: "footsteps-outline",
  PERSISTENT_ITCHING: "hand-left-outline",
  BLURRED_VISION: "eye-outline",
  MALARIA: "bug-outline",
  ANOREXIA: "restaurant-outline",
  OTHER: "create-outline",
};

type SymptomDef = {
  id: SymptomId;
  title: string;
  subtitle?: string;
  icon?: string;
  groups?: { name: string; options: { id: string; label: string }[] }[];
};

// These live outside the screen so they keep their identity between renders
// (defining them inside would remount the text inputs and drop the keyboard
// after every keystroke).

function Chip({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={{
        minHeight: 44,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1.5,
        justifyContent: "center",
        borderColor: on ? t.green : t.borderStrong,
        backgroundColor: on ? t.green : t.surface,
      }}
    >
      <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#FFFFFF" : t.ink2 }}>{label}</Text>
    </Pressable>
  );
}

function SymTile({ sym, danger, on, onPress }: { sym: SymptomDef; danger: boolean; on: boolean; onPress: () => void }) {
  const t = useTokens();
  const accent = danger ? t.red : t.green;
  const icon = ICONS[sym.id] ?? (sym.icon as keyof typeof Ionicons.glyphMap) ?? "medkit-outline";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      accessibilityLabel={sym.subtitle ? `${tx(sym.title)}. ${tx(sym.subtitle)}` : tx(sym.title)}
      style={{
        flexBasis: "47%",
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        minHeight: 64,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: on ? accent : t.border,
        backgroundColor: on ? (danger ? t.redBg : t.mint) : t.surface,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: on ? accent : danger ? t.redBg : t.surface2,
        }}
      >
        <Ionicons name={icon} size={20} color={on ? "#FFFFFF" : danger ? t.redInk : t.ink2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONT.semibold, fontSize: 15, lineHeight: 19, color: t.ink }}>
          {tx(sym.title).replace(/\s*\/\s*/g, " / ")}
        </Text>
        {sym.subtitle ? (
          <Text style={{ fontFamily: FONT.regular, fontSize: 13, lineHeight: 17, color: t.muted }}>{tx(sym.subtitle)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function Detail({ children }: { children: React.ReactNode }) {
  const t = useTokens();
  return (
    <View style={{ backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, borderRadius: 20, padding: 16, gap: 14 }}>
      {children}
    </View>
  );
}

function YesNo({ value, set, label }: { value: boolean | null; set: (v: boolean | null) => void; label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <T variant="title" style={{ fontSize: 15 }}>
        {label}
      </T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Chip on={value === true} label={tx("Yes")} onPress={() => set(value === true ? null : true)} />
        <Chip on={value === false} label={tx("No")} onPress={() => set(value === false ? null : false)} />
      </View>
    </View>
  );
}

export default function SymptomCheckerScreen() {
  const router = useRouter();
  const { addSymptom, isAddingSymptom } = useHealthData();
  const { revalidateMonitoring } = useMonitoringData();
  const t = useTokens();
  const { showToast } = useToast();
  useLang();

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
      showToast({ type: "error", message: tx("Please type the other symptom you feel.") });
      return;
    }

    try {
      let hasEmergency = false;
      let hasUrgent = false;
      let msg = "";

      for (const symptomId of selected) {
        let res;
        // The backend validates strictly and rejects the WHOLE submission on
        // any unexpected value, so map UI values to what it accepts:
        // - trend enum is IMPROVING / WORSENING / UNCHANGED
        // - onsetAt must be an ISO date; free text like "yesterday" goes in
        //   structuredDetail instead.
        const TREND_TO_API: Record<string, string> = {
          BETTER: "IMPROVING",
          WORSE: "WORSENING",
          UNCHANGED: "UNCHANGED",
        };
        const onsetText = onset.trim();
        const commonData = {
          severity: severity > 0 ? severity : undefined,
          trend: trend ? TREND_TO_API[trend] : undefined,
          durationLabel: duration.trim() ? duration.trim().slice(0, 80) : undefined,
          structuredDetail: onsetText ? { onsetText: onsetText.slice(0, 80) } : undefined,
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

      const s = selected.join(",");
      if (hasEmergency || hasUrgent) {
        router.push({
          pathname: "/nurse-summary",
          params: { msg: msg.slice(0, 500), s, level: hasEmergency ? "emergency" : "urgent" },
        });
      } else {
        router.push({ pathname: "/symptom-results", params: { msg: msg.slice(0, 500), s } });
      }
    } catch (error) {
      console.error("Failed to submit symptoms", error);
      if (hasLocalRedFlag(selected, subOptions)) {
        router.push({
          pathname: "/nurse-summary",
          params: { msg: OFFLINE_DANGER_MESSAGE, s: selected.join(","), level: "offline" },
        });
        return;
      }
      showToast({
        type: "error",
        message: tx("We could not save your symptoms. Please try again."),
      });
    }
  };


  const all = SYMPTOMS as unknown as SymptomDef[];
  const dangerSymptoms = all.filter((sym) => LOCAL_RED_FLAGS.includes(sym.id));
  const otherSymptoms = all.filter((sym) => !LOCAL_RED_FLAGS.includes(sym.id));
  const anyDanger = hasLocalRedFlag(selected, subOptions);
  const withDetails = all.filter((sym) => selected.includes(sym.id) && sym.groups && sym.groups.length > 0);
  const hasOther = selected.includes("OTHER" as SymptomId);

  const inputStyle = {
    fontFamily: FONT.regular,
    fontSize: 16,
    color: t.ink,
    backgroundColor: t.surface,
    borderColor: t.borderStrong,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  };

  return (
    <Page>
      <AppHeader title={tx("How are you feeling?")} subtitle={tx("Tap everything you feel right now")} onBack={() => router.back()} />

      <View style={{ gap: 10 }}>
        <T variant="h2" accessibilityRole="header">
          {tx("Danger signs")}
        </T>
        <T variant="small">{tx("If you have any of these, go to a health facility now, even before you finish here.")}</T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {dangerSymptoms.map((sym) => (
            <SymTile key={sym.id} sym={sym} danger on={selected.includes(sym.id)} onPress={() => toggleSymptom(sym.id)} />
          ))}
        </View>
      </View>

      {anyDanger ? (
        <View style={{ gap: 10 }}>
          <Banner tone="red" icon="warning-outline">
            {tx("This can be serious. Please go to a health facility now.")}
          </Banner>
          <Button variant="danger" block onPress={() => router.push("/emergency")}>
            {tx("Send an emergency alert")}
          </Button>
        </View>
      ) : null}

      <View style={{ gap: 10 }}>
        <T variant="h2" accessibilityRole="header" style={{ marginTop: 8 }}>
          {tx("Other symptoms")}
        </T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {otherSymptoms.map((sym) => (
            <SymTile key={sym.id} sym={sym} danger={false} on={selected.includes(sym.id)} onPress={() => toggleSymptom(sym.id)} />
          ))}
        </View>
      </View>

      {hasOther ? (
        <Detail>
          <T variant="title" style={{ fontSize: 15 }}>
            {tx("Describe what you feel")}
          </T>
          <TextInput
            accessibilityLabel={tx("Describe what you feel")}
            value={otherSymptom}
            onChangeText={setOtherSymptom}
            maxLength={80}
            multiline
            placeholder={tx("For example: feeling dizzy when I stand up")}
            placeholderTextColor={t.muted}
            style={[inputStyle, { minHeight: 80, textAlignVertical: "top" }]}
          />
          <T variant="small" style={{ fontSize: 13 }}>
            {otherSymptom.length}/80
          </T>
        </Detail>
      ) : null}

      {withDetails.map((sym) => (
        <Detail key={sym.id}>
          <T variant="h2" style={{ fontSize: 17 }}>
            {tx("{symptom}: tell us more", { symptom: tx(sym.title) })}
          </T>
          {sym.groups!.map((group) => (
            <View key={group.name} style={{ gap: 8 }}>
              <T variant="title" style={{ fontSize: 15 }}>
                {tx(group.name)}
              </T>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {group.options.map((opt) => (
                  <Chip
                    key={opt.id}
                    on={(subOptions[sym.id] ?? []).includes(opt.id)}
                    label={tx(opt.label)}
                    onPress={() => toggleSubOption(sym.id, opt.id)}
                  />
                ))}
              </View>
            </View>
          ))}
        </Detail>
      ))}

      {selected.length > 0 ? (
        <Detail>
          <T variant="h2" style={{ fontSize: 17 }}>
            {tx("A few more details (optional)")}
          </T>
          <View style={{ gap: 8 }}>
            <T variant="title" style={{ fontSize: 15 }}>
              {tx("How bad is it? 1 = mild, 10 = worst")}
            </T>
            <View style={{ flexDirection: "row", gap: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                const on = severity === n;
                return (
                  <Pressable
                    key={n}
                    onPress={() => setSeverity(on ? 0 : n)}
                    accessibilityRole="button"
                    accessibilityLabel={`Severity ${n}`}
                    accessibilityState={{ selected: on }}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      borderRadius: 999,
                      borderWidth: 1.5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: on ? t.green : t.borderStrong,
                      backgroundColor: on ? t.green : t.surface,
                    }}
                  >
                    <Text style={{ fontFamily: FONT.semibold, fontSize: 14, color: on ? "#FFFFFF" : t.ink2 }}>{n}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <T variant="title" style={{ fontSize: 15 }}>
              {tx("Is it getting better or worse?")}
            </T>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {[
                { id: "BETTER", label: "Better" },
                { id: "WORSE", label: "Worse" },
                { id: "UNCHANGED", label: "Same" },
              ].map((o) => (
                <Chip key={o.id} on={trend === o.id} label={tx(o.label)} onPress={() => setTrend(trend === o.id ? "" : o.id)} />
              ))}
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <T variant="title" style={{ fontSize: 15 }}>
              {tx("How long has it lasted?")}
            </T>
            <TextInput
              accessibilityLabel={tx("How long has it lasted?")}
              value={duration}
              onChangeText={setDuration}
              maxLength={80}
              placeholder={tx("e.g. 2 hours, 3 days")}
              placeholderTextColor={t.muted}
              style={inputStyle}
            />
          </View>
          <View style={{ gap: 8 }}>
            <T variant="title" style={{ fontSize: 15 }}>
              {tx("When did it start?")}
            </T>
            <TextInput
              accessibilityLabel={tx("When did it start?")}
              value={onset}
              onChangeText={setOnset}
              maxLength={80}
              placeholder={tx("e.g. this morning, yesterday")}
              placeholderTextColor={t.muted}
              style={inputStyle}
            />
          </View>
          <YesNo value={hadBefore} set={setHadBefore} label={tx("Has this happened before?")} />
          <YesNo value={medsTaken} set={setMedsTaken} label={tx("Have you taken any medicine for it?")} />
        </Detail>
      ) : null}

      <Button
        size="lg"
        block
        onPress={handleSubmit}
        loading={isAddingSymptom}
        disabled={selected.length === 0 || (hasOther && !otherSymptom.trim())}
      >
        {isAddingSymptom
          ? tx("Sending…")
          : selected.length === 0
            ? tx("Choose at least one symptom")
            : tx(selected.length === 1 ? "Send {n} symptom" : "Send {n} symptoms", { n: selected.length })}
      </Button>

      <Banner tone="green" icon="information-circle-outline">
        {tx("Your answers go to your linked clinic. This is not a diagnosis.")}
      </Banner>
    </Page>
  );
}
