import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Banner, Button, FONT, IconButton, T, useTokens } from "../components/ds";
import { useAuthContext } from "../context/AuthContext";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  AGE_OPTIONS,
  AgeRange,
  CONDITION_OPTIONS,
  RELATIONSHIP_OPTIONS,
  Relationship,
  SETUP_STEPS,
  isValidName,
  isValidNigerianPhone,
  weeksFromLastPeriod,
} from "../services/profileSetup";

// Same screen as maternalert-web/src/app/(patient)/profile-setup/page.tsx

function Choice({
  selected,
  onPress,
  title,
  subtitle,
  multi,
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  subtitle?: string;
  multi?: boolean;
}) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={multi ? "checkbox" : "radio"}
      accessibilityState={{ checked: selected }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 16,
        minHeight: 60,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: selected ? t.green : t.border,
        backgroundColor: selected ? t.mint : t.surface,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{title}</Text>
        {subtitle ? <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.muted }}>{subtitle}</Text> : null}
      </View>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: multi ? 7 : 12,
          borderWidth: 2,
          borderColor: selected ? t.green : t.borderStrong,
          backgroundColor: selected ? t.green : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </View>
    </Pressable>
  );
}

/** YYYY-MM-DD from a typed DD/MM/YYYY, or "" (no native date picker installed). */
function toIso(dmy: string): string {
  const m = dmy.trim().match(/^(\d{1,2})[/.\- ](\d{1,2})[/.\- ](\d{4})$/);
  if (!m) return "";
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export default function ProfileSetupScreen() {
  const router = useRouter();
  const t = useTokens();
  const { createProfile, isCreatingProfile } = useUserProfile();
  const { checkSession, user } = useAuthContext() as any;
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [myPhone, setMyPhone] = useState<string>(() => (user?.phone as string | undefined) ?? "");
  useEffect(() => {
    if (user?.phone) setMyPhone((p) => p || user.phone);
  }, [user?.phone]);
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
  const [weeks, setWeeks] = useState("");
  const [useLmp, setUseLmp] = useState(false);
  const [lmp, setLmp] = useState("");
  const [firstPregnancy, setFirstPregnancy] = useState<boolean | null>(null);
  const [conditions, setConditions] = useState<string[] | null>(null);
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const current = SETUP_STEPS[step];
  const last = step === SETUP_STEPS.length - 1;
  const weeksNum = useLmp ? weeksFromLastPeriod(toIso(lmp)) : weeks === "" ? null : Number(weeks);

  const validate = (): string | null => {
    switch (current.id) {
      case "you":
        if (!isValidName(fullName)) return "Please enter your name.";
        if (myPhone.trim() && !isValidNigerianPhone(myPhone)) return "Please enter your full phone number, for example 0803 123 4567.";
        return null;
      case "age":
        return ageRange ? null : "Please choose your age range.";
      case "weeks":
        if (weeksNum === null || Number.isNaN(weeksNum)) {
          return useLmp ? "Please enter the date like 14/03/2026." : "Please enter how many weeks pregnant you are.";
        }
        if (weeksNum < 0 || weeksNum > 42) return "That works out to more than 42 weeks. Please check the date or number.";
        return null;
      case "first":
        return firstPregnancy === null ? "Please choose Yes or No." : null;
      case "conditions":
        return conditions === null ? "Choose any that apply, or “None of these”." : null;
      case "contact":
        if (!phone.trim()) return null;
        if (!isValidNigerianPhone(phone)) return "Please enter a full phone number, for example 0803 123 4567.";
        if (!relationship) return "Please choose who this person is.";
        return null;
      default:
        return null;
    }
  };

  const next = async () => {
    const problem = validate();
    setError(problem);
    if (problem) return;
    if (!last) {
      setStep((s) => s + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      return;
    }
    try {
      await createProfile({
        fullName: fullName.trim(),
        ...(myPhone.trim() ? { phone: myPhone.trim() } : {}),
        ageRange: ageRange!,
        pregnancyWeeks: Math.round(weeksNum!),
        firstPregnancy: firstPregnancy!,
        knownConditions: conditions && conditions.length ? conditions : ["NONE"],
        ...(phone.trim() ? { emergencyContactPhone: phone.trim(), emergencyContactRelationship: relationship! } : {}),
      } as any);
      await checkSession();
      router.replace({ pathname: "/facility-linking", params: { from: "setup" } });
    } catch (err) {
      console.error("[PROFILE_SETUP] Failed to create profile:", err);
      setError("We couldn't save your profile. Check your internet and try again.");
    }
  };

  const back = () => {
    setError(null);
    if (step > 0) setStep((s) => s - 1);
    else router.back();
  };

  const toggleCondition = (value: string) =>
    setConditions((c) => {
      const list = c ?? [];
      return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
    });

  const inputStyle = {
    fontFamily: FONT.regular,
    fontSize: 16,
    color: t.ink,
    backgroundColor: t.surface,
    borderWidth: 1.5,
    borderColor: t.borderStrong,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 48,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 20, paddingBottom: 48, gap: 18 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <IconButton label={step > 0 ? "Previous question" : "Go back"} onPress={back}>
              <Ionicons name="arrow-back" size={22} color={t.ink} />
            </IconButton>
            <View
              style={{ flex: 1, flexDirection: "row", gap: 6 }}
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel={`Question ${step + 1} of ${SETUP_STEPS.length}`}
            >
              {SETUP_STEPS.map((s, i) => (
                <View key={s.id} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= step ? t.green : t.border }} />
              ))}
            </View>
            <T variant="small">{`${step + 1}/${SETUP_STEPS.length}`}</T>
          </View>

          <View style={{ gap: 8, paddingTop: 4 }}>
            <T variant="h1" accessibilityRole="header">
              {current.title}
            </T>
            <T>{current.help}</T>
          </View>

          {current.id === "you" ? (
            <View style={{ gap: 16 }}>
              <View style={{ gap: 8 }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>Your name</Text>
                <TextInput
                  accessibilityLabel="Your name"
                  textContentType="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  placeholder="For example, Amina Bello"
                  placeholderTextColor={t.muted}
                  maxLength={80}
                  value={fullName}
                  onChangeText={setFullName}
                  style={inputStyle}
                />
              </View>
              <View style={{ gap: 8 }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>Your phone number</Text>
                <TextInput
                  accessibilityLabel="Your phone number"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  autoComplete="tel"
                  placeholder="0803 123 4567"
                  placeholderTextColor={t.muted}
                  value={myPhone}
                  onChangeText={setMyPhone}
                  style={inputStyle}
                />
                <T variant="small">So your clinic or family can call you back. Optional, but it helps.</T>
              </View>
            </View>
          ) : null}

          {current.id === "age" ? (
            <View style={{ gap: 10 }}>
              {AGE_OPTIONS.map((o) => (
                <Choice key={o.value} title={o.label} selected={ageRange === o.value} onPress={() => setAgeRange(o.value)} />
              ))}
            </View>
          ) : null}

          {current.id === "weeks" ? (
            <View style={{ gap: 16 }}>
              {!useLmp ? (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 16 }}>
                  <IconButton label="One week less" onPress={() => setWeeks(String(Math.max(0, (weeksNum ?? 1) - 1)))}>
                    <Ionicons name="remove" size={22} color={t.ink} />
                  </IconButton>
                  <View style={{ alignItems: "center", gap: 6 }}>
                    <TextInput
                      accessibilityLabel="Weeks pregnant"
                      keyboardType="number-pad"
                      maxLength={2}
                      value={weeks}
                      placeholder="–"
                      placeholderTextColor={t.muted}
                      onChangeText={(v) => setWeeks(v.replace(/[^0-9]/g, ""))}
                      style={{
                        width: 140,
                        minHeight: 84,
                        textAlign: "center",
                        fontFamily: FONT.bold,
                        fontSize: 44,
                        color: t.ink,
                        backgroundColor: t.surface,
                        borderWidth: 2,
                        borderColor: t.green,
                        borderRadius: 18,
                      }}
                    />
                    <T variant="small">weeks</T>
                  </View>
                  <IconButton label="One week more" onPress={() => setWeeks(String(Math.min(42, (weeksNum ?? -1) + 1)))}>
                    <Ionicons name="add" size={22} color={t.ink} />
                  </IconButton>
                </View>
              ) : (
                <View style={{ gap: 8 }}>
                  <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>First day of your last period</Text>
                  <TextInput
                    accessibilityLabel="First day of your last period, day month year"
                    keyboardType="numbers-and-punctuation"
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={t.muted}
                    value={lmp}
                    onChangeText={setLmp}
                    maxLength={10}
                    style={inputStyle}
                  />
                  {weeksNum !== null && weeksNum >= 0 && weeksNum <= 42 ? (
                    <T variant="small">{`That makes you about ${weeksNum} weeks pregnant.`}</T>
                  ) : null}
                </View>
              )}
              <Pressable onPress={() => setUseLmp((v) => !v)} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center" }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>
                  {useLmp ? "I know how many weeks I am" : "Not sure? Use the date of your last period"}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {current.id === "first" ? (
            <View style={{ gap: 10 }}>
              <Choice title="Yes, this is my first" selected={firstPregnancy === true} onPress={() => setFirstPregnancy(true)} />
              <Choice title="No, I've been pregnant before" selected={firstPregnancy === false} onPress={() => setFirstPregnancy(false)} />
            </View>
          ) : null}

          {current.id === "conditions" ? (
            <View style={{ gap: 10 }}>
              {CONDITION_OPTIONS.map((c) => (
                <Choice
                  key={c.value}
                  multi
                  title={c.label}
                  subtitle={c.hint}
                  selected={(conditions ?? []).includes(c.value)}
                  onPress={() => toggleCondition(c.value)}
                />
              ))}
              <Choice title="None of these" selected={conditions !== null && conditions.length === 0} onPress={() => setConditions([])} />
            </View>
          ) : null}

          {current.id === "contact" ? (
            <View style={{ gap: 16 }}>
              <View style={{ gap: 8 }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>Who is this person?</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }} accessibilityRole="radiogroup">
                  {RELATIONSHIP_OPTIONS.map((r) => {
                    const on = relationship === r.value;
                    return (
                      <Pressable
                        key={r.value}
                        onPress={() => setRelationship(r.value)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: on }}
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
                        <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#fff" : t.ink2 }}>{r.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              <View style={{ gap: 8 }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>Their phone number</Text>
                <TextInput
                  accessibilityLabel="Their phone number"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  autoComplete="tel"
                  placeholder="0803 123 4567"
                  placeholderTextColor={t.muted}
                  value={phone}
                  onChangeText={setPhone}
                  style={inputStyle}
                />
                <T variant="small">Use a number that has WhatsApp if possible. We also send an SMS.</T>
              </View>
              <Banner tone="amber">
                Without an emergency contact, the emergency button can only alert your clinic. You can add one later in Profile.
              </Banner>
            </View>
          ) : null}

          {error ? <Banner tone="red">{error}</Banner> : null}

          <View style={{ gap: 10, marginTop: 4 }}>
            <Button size="lg" block onPress={next} loading={isCreatingProfile} disabled={isCreatingProfile}>
              {isCreatingProfile ? "Saving…" : last ? (phone.trim() ? "Save and continue" : "Skip and finish") : "Next"}
            </Button>
            <T variant="small" style={{ textAlign: "center" }}>
              Only you and your linked clinic can see this. You can change it later in Profile.
            </T>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
