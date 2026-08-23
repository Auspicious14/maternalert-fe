import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { useToast } from "../components/ui/ToastProvider";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

// ──────────────────────────────────────────────────────────────────────────────
// Symptom definitions
// Each symptom may have:
//   - subOptions: contextual follow-up choices (presented when the symptom is selected)
//   - note: a contextual informational note
//   - hasOtherInput: if the sub-option includes a free-text pain location field
// ──────────────────────────────────────────────────────────────────────────────

const SYMPTOMS = [
  {
    id: "HEADACHE",
    title: "Headache",
    icon: "flash",
    subOptions: [
      { id: "FEVER", label: "With fever" },
      { id: "CHILLS_AND_RIGORS", label: "With chills and rigors" },
      { id: "VOMITING", label: "With vomiting" },
      { id: "NAUSEA", label: "With nausea" },
    ],
    subOptionsPrompt: "Is the headache associated with any of the following?",
  },
  { id: "BLURRED_VISION", title: "Blurred Vision", icon: "eye-off" },
  {
    id: "LEG_SWELLING",
    title: "Leg Swelling",
    subtitle: "Swelling of one or both legs",
    icon: "hand-left",
    subOptions: [
      { id: "PAINFUL", label: "Painful leg swelling" },
      { id: "NON_PAINFUL", label: "Non-painful leg swelling" },
      { id: "FROTHY_URINE", label: "Also have frothy urine" },
    ],
    subOptionsPrompt: "Is the leg swelling painful or non-painful?",
  },
  {
    id: "FROTHY_URINE",
    title: "Frothy Urine",
    subtitle: "Urine forming foam",
    icon: "water",
  },
  {
    id: "VAGINAL_BLEEDING",
    title: "Vaginal Bleeding",
    icon: "medical",
    note: "Any vaginal bleeding requires medical attention, regardless of volume. This symptom most commonly occurs after the first trimester.",
    subOptions: [
      { id: "ASSOCIATED_WITH_ABDOMINAL_PAIN", label: "With abdominal pain" },
    ],
    subOptionsPrompt: "Is the bleeding associated with abdominal pain?",
  },
  {
    id: "VAGINAL_DISCHARGE",
    title: "Vaginal Discharge",
    subtitle: "Unusual discharge",
    icon: "water-outline",
  },
  { id: "FEVER", title: "Fever", icon: "thermometer" },
  {
    id: "REDUCED_FETAL_MOVEMENT",
    title: "Reduced Fetal Movement",
    icon: "heart",
  },
  { id: "DIFFICULTY_BREATHING", title: "Difficulty Breathing", icon: "walk" },
  {
    id: "ABNORMAL_BODY_MOVEMENT",
    title: "Abnormal Body Movement",
    subtitle: "Fits or convulsions",
    icon: "pulse",
  },
  {
    id: "ABDOMINAL_PAIN",
    title: "Abdominal Pain",
    icon: "alert-circle",
    subOptions: [
      { id: "LOWER_ABDOMEN", label: "Lower abdomen" },
      { id: "UPPER_ABDOMEN", label: "Upper abdomen" },
      { id: "BELOW_RIBS", label: "Just below the ribs" },
      { id: "OTHER", label: "Describe the pain" },
    ],
    subOptionsPrompt: "Where is the abdominal pain located?",
    hasLocationInput: true,
  },
  { id: "PAINFUL_URINATION", title: "Painful Urination", icon: "alert" },
  { id: "FREQUENT_URINATION", title: "Frequent Urination", icon: "refresh" },
  {
    id: "OTHER",
    title: "Something else",
    subtitle: "Type what you feel",
    icon: "create",
  },
] as const;

type SymptomId = (typeof SYMPTOMS)[number]["id"];

import { useHealthData } from "../hooks/useHealthData";

export default function SymptomCheckerScreen() {
  const router = useRouter();
  const { addSymptom, isAddingSymptom } = useHealthData();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { showToast } = useToast();

  const [selected, setSelected] = useState<SymptomId[]>([]);
  const [otherSymptom, setOtherSymptom] = useState("");
  // sub-options: { [symptomId]: string[] }
  const [subOptions, setSubOptions] = useState<Record<string, string[]>>({});
  // pain location for abdominal pain
  const [painLocation, setPainLocation] = useState("");

  const textColor = isDark ? "#FFFFFF" : "#1A212E";
  const subTextColor = isDark ? "#94A3B8" : "#6B7280";
  const cardBg = isDark ? "#020617" : "#FFFFFF";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9";
  const subCardBg = isDark ? "#0F172A" : "#F8FAFC";

  const toggleSymptom = (id: SymptomId) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
      // clear sub-options when deselected
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
      showToast({
        type: "error",
        message: "Please type the other symptom you feel.",
      });
      return;
    }

    try {
      for (const symptomId of selected) {
        if (symptomId === "OTHER") {
          await addSymptom({
            symptomType: "OTHER",
            customSymptom: cleanedOtherSymptom,
          });
        } else {
          const symptomSubOptions = subOptions[symptomId] ?? [];
          const locationValue =
            symptomId === "ABDOMINAL_PAIN" && painLocation.trim()
              ? painLocation.trim()
              : undefined;

          await addSymptom({
            symptomType: symptomId,
            subOptions:
              symptomSubOptions.length > 0 ? symptomSubOptions : undefined,
            painLocation: locationValue,
          } as any);
        }
      }

      const symptomSet = new Set(selected);
      const isEmergency =
        (symptomSet.has("HEADACHE") && symptomSet.has("BLURRED_VISION")) ||
        symptomSet.has("ABDOMINAL_PAIN") ||
        symptomSet.has("ABNORMAL_BODY_MOVEMENT") ||
        symptomSet.has("VAGINAL_BLEEDING") ||
        symptomSet.has("DIFFICULTY_BREATHING") ||
        symptomSet.has("REDUCED_FETAL_MOVEMENT") ||
        symptomSet.has("FEVER");

      if (isEmergency) {
        router.push("/nurse-summary");
      } else {
        router.push("/symptom-results");
      }
    } catch (error) {
      console.error("Failed to submit symptoms", error);
      showToast({
        type: "error",
        message: "Failed to submit symptoms. Please try again.",
      });
    }
  };

  const renderSubOptions = (symptom: (typeof SYMPTOMS)[number]) => {
    if (!selected.includes(symptom.id as SymptomId)) return null;
    if (!("subOptions" in symptom) || !symptom.subOptions) return null;

    const selectedSubs = subOptions[symptom.id] ?? [];
    const showLocationInput =
      "hasLocationInput" in symptom &&
      symptom.hasLocationInput &&
      selectedSubs.includes("OTHER");

    return (
      <View
        style={{ backgroundColor: subCardBg, borderColor: borderColor }}
        className="rounded-[24px] p-4 border mt-1 ml-4"
      >
        {"note" in symptom && symptom.note && (
          <View className="mb-3 flex-row items-start gap-2">
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={Theme.colors.primary}
            />
            <Typography
              variant="caption"
              style={{
                color: subTextColor,
                flex: 1,
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              {symptom.note}
            </Typography>
          </View>
        )}
        <Typography
          variant="caption"
          weight="bold"
          style={{ color: textColor, marginBottom: 8 }}
        >
          {"subOptionsPrompt" in symptom
            ? symptom.subOptionsPrompt
            : "Select all that apply:"}
        </Typography>
        <View className="gap-2">
          {symptom.subOptions.map((opt) => {
            const isSubSelected = selectedSubs.includes(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => toggleSubOption(symptom.id, opt.id)}
                style={{
                  backgroundColor: isSubSelected
                    ? isDark
                      ? "#1B3A26"
                      : "#F0FDF4"
                    : isDark
                      ? "#020617"
                      : "#FFFFFF",
                  borderColor: isSubSelected
                    ? Theme.colors.primary
                    : borderColor,
                }}
                className="flex-row items-center gap-3 rounded-2xl px-4 py-3 border"
              >
                <View
                  style={{
                    borderColor: isSubSelected
                      ? Theme.colors.primary
                      : isDark
                        ? "#4B5563"
                        : "#D1D5DB",
                    backgroundColor: isSubSelected
                      ? Theme.colors.primary
                      : "transparent",
                  }}
                  className="w-5 h-5 rounded border-2 justify-center items-center"
                >
                  {isSubSelected && (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Typography
                  variant="caption"
                  style={{ color: textColor, fontSize: 14 }}
                >
                  {opt.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
        {showLocationInput && (
          <View className="mt-3">
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: textColor, marginBottom: 4 }}
            >
              Describe the pain location:
            </Typography>
            <TextInput
              value={painLocation}
              onChangeText={setPainLocation}
              placeholder="e.g. lower left abdomen"
              placeholderTextColor="#94A3B8"
              className={
                isDark ? "text-white text-base" : "text-[#1A212E] text-base"
              }
              style={{
                fontFamily: "Lexend-Regular",
                minHeight: 40,
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
              }}
              maxLength={80}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB" }}
    >
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#F9FAFB"}>
        <View className="flex-row items-center justify-between px-6 pt-4 mb-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 justify-center items-center"
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color={isDark ? Theme.colors.white : "#1A212E"}
            />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px]">
            Check Symptoms
          </Typography>
          <View className="w-7" />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Typography
            variant="h1"
            className="text-[36px] font-black leading-[44px] mb-3 shadow-lexend-bold"
          >
            How are you feeling today?
          </Typography>
          <Typography
            variant="body"
            className={
              isDark
                ? "text-gray-300 text-lg leading-6 mb-10"
                : "text-gray-500 text-lg leading-6 mb-10"
            }
          >
            Select any symptoms you are experiencing right now.
          </Typography>

          <View className="gap-3">
            {SYMPTOMS.map((symptom) => {
              const isSelected = selected.includes(symptom.id as SymptomId);
              const hasSubOpts =
                "subOptions" in symptom &&
                symptom.subOptions &&
                symptom.subOptions.length > 0;

              return (
                <View key={symptom.id}>
                  <TouchableOpacity
                    className={`${isDark ? "bg-[#020617] border-white/10" : "bg-white"} rounded-[40px] py-6 px-[30px] flex-row items-center border shadow-sm ${isSelected ? "border-primary" : "border-[#F1F5F9]"}`}
                    onPress={() => toggleSymptom(symptom.id as SymptomId)}
                    activeOpacity={0.7}
                  >
                    <View className="w-11 h-11 rounded-full bg-primary-light justify-center items-center mr-4">
                      <Ionicons
                        name={symptom.icon as any}
                        size={24}
                        color={Theme.colors.primary}
                      />
                    </View>
                    <View className="flex-1">
                      <Typography
                        variant="h3"
                        weight="bold"
                        className="text-lg"
                      >
                        {symptom.title}
                      </Typography>
                      {"subtitle" in symptom && symptom.subtitle && (
                        <Typography
                          variant="caption"
                          className={isDark ? "text-gray-400" : "text-gray-400"}
                        >
                          {symptom.subtitle}
                        </Typography>
                      )}
                      {hasSubOpts && isSelected && (
                        <Typography
                          variant="caption"
                          style={{
                            color: Theme.colors.primary,
                            fontSize: 11,
                            marginTop: 2,
                          }}
                        >
                          Tap below to add details
                        </Typography>
                      )}
                    </View>
                    <View
                      className={`w-7 h-7 rounded-full border-2 justify-center items-center ${isSelected ? "border-gray-300" : "border-gray-300"}`}
                    >
                      {isSelected && (
                        <View className="w-4 h-4 rounded-full bg-gray-300" />
                      )}
                    </View>
                  </TouchableOpacity>
                  {renderSubOptions(symptom as any)}
                </View>
              );
            })}

            {selected.includes("OTHER") && (
              <View
                className={
                  isDark
                    ? "bg-[#020617] border-white/10 rounded-[28px] p-5 border"
                    : "bg-white border-[#F1F5F9] rounded-[28px] p-5 border"
                }
              >
                <Typography variant="h3" weight="bold" className="mb-2">
                  Tell us what you feel
                </Typography>
                <TextInput
                  value={otherSymptom}
                  onChangeText={setOtherSymptom}
                  placeholder="Type symptom here"
                  placeholderTextColor="#94A3B8"
                  className={
                    isDark ? "text-white text-base" : "text-[#1A212E] text-base"
                  }
                  style={{ fontFamily: "Lexend-Regular", minHeight: 48 }}
                  multiline
                  maxLength={80}
                />
              </View>
            )}
          </View>
        </ScrollView>

        <View className="px-10 pb-[100px] items-center">
          <TouchableOpacity
            className={`bg-primary w-full h-[70px] rounded-[35px] flex-row items-center justify-center gap-3 mb-4 shadow-md ${isAddingSymptom || selected.length === 0 ? "opacity-70" : ""}`}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={
              isAddingSymptom ||
              selected.length === 0 ||
              (selected.includes("OTHER") && !otherSymptom.trim())
            }
          >
            <Typography
              variant="h2"
              weight="bold"
              className="text-[22px] text-[#1A212E]"
            >
              {isAddingSymptom ? "Reporting..." : "Submit Report"}
            </Typography>
            {!isAddingSymptom && (
              <Ionicons name="arrow-forward" size={24} color="#1A212E" />
            )}
          </TouchableOpacity>
          <Typography variant="caption" className="text-gray-500">
            All data is kept private and secure.
          </Typography>
        </View>

        {/* Tab Mockup for fidelity - Now Functional */}
        <View
          className={
            isDark
              ? "absolute bottom-0 w-full h-20 bg-[#020617] flex-row border-t border-white/10 px-10 pt-2.5 justify-between"
              : "absolute bottom-0 w-full h-20 bg-white flex-row border-t border-[#F1F5F9] px-10 pt-2.5 justify-between"
          }
        >
          <TouchableOpacity
            className="items-center gap-1"
            onPress={() => router.push("/(tabs)")}
          >
            <Ionicons name="home" size={24} color={Theme.colors.textLight} />
            <Typography variant="caption" className="text-gray-500">
              Home
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center gap-1"
            onPress={() => router.push("/(tabs)/tracking")}
          >
            <View
              className={
                isDark
                  ? "bg-[#022C22] px-5 py-1 rounded-[20px]"
                  : "bg-[#E8FCF1] px-5 py-1 rounded-[20px]"
              }
            >
              <Ionicons name="medical" size={24} color={Theme.colors.primary} />
            </View>
            <Typography
              variant="caption"
              weight="bold"
              className="text-primary"
            >
              Checkup
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center gap-1"
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Ionicons name="person" size={24} color={Theme.colors.textLight} />
            <Typography variant="caption" className="text-gray-500">
              Profile
            </Typography>
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}
