import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import apiClient from "../api/client";
import { AppHeader, Banner, Button, Card, FONT, Page, SectionHeader, Skeleton, T, useTokens } from "../components/ds";
import { useToast } from "../components/ui/ToastProvider";
import { useLang } from "../hooks/useLang";
import { useMyHistory } from "../hooks/useMyHistory";
import { tr } from "../services/i18n";

/**
 * Same screen as maternalert-web/src/app/(patient)/my-history/page.tsx.
 * The questions the clinic would otherwise ask at registration, answered by
 * her in her own time and language. Every question can be "Not sure".
 */

type YN = boolean | null;
type Answers = Record<string, number | boolean | string | null>;

const L = (en: string, pcm: string, yo: string) => tr({ en, pcm, yo });

function Chip({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
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
      <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: on ? "#FFFFFF" : t.ink }}>{label}</Text>
    </Pressable>
  );
}

function YesNoRow({ label, hint, value, onChange }: { label: string; hint?: string; value: YN | undefined; onChange: (v: YN) => void }) {
  const t = useTokens();
  const opts: [YN, string][] = [
    [true, L("Yes", "Yes", "Bẹ́ẹ̀ni")],
    [false, L("No", "No", "Rárá")],
    [null, L("Not sure", "I no sure", "Mi ò dá a lójú")],
  ];
  return (
    <View style={{ gap: 8 }} accessibilityRole="radiogroup" accessibilityLabel={label}>
      <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{label}</Text>
      {hint ? <T variant="small">{hint}</T> : null}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {opts.map(([v, text]) => (
          <Chip key={String(v)} on={value !== undefined && value === v} label={text} onPress={() => onChange(v)} />
        ))}
      </View>
    </View>
  );
}

function CountRow({ label, value, onChange }: { label: string; value: number | null | undefined; onChange: (v: number) => void }) {
  const t = useTokens();
  const n = typeof value === "number" ? value : 0;
  const btn = (icon: "remove" | "add", next: number, a11y: string) => (
    <Pressable
      onPress={() => onChange(next)}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: t.borderStrong, backgroundColor: t.surface, alignItems: "center", justifyContent: "center" }}
    >
      <Ionicons name={icon} size={20} color={t.ink} />
    </Pressable>
  );
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        {btn("remove", Math.max(0, n - 1), `${label}: −1`)}
        <Text style={{ fontFamily: FONT.bold, fontSize: 24, minWidth: 32, textAlign: "center", color: t.ink }} accessibilityLiveRegion="polite">
          {n}
        </Text>
        {btn("add", Math.min(20, n + 1), `${label}: +1`)}
      </View>
    </View>
  );
}

const BLOOD_GROUPS = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE"];
const GENOTYPES = ["AA", "AS", "AC", "SS", "SC", "CC"];
const bgLabel = (g: string) => g.replace("_POSITIVE", "+").replace("_NEGATIVE", "−");

const PAST = ["gestationalHypertension", "previousPreeclampsia", "previousEclampsia", "previousGestationalDiabetes", "previousPostpartumHemorrhage", "previousPretermBirth", "previousMultiplePregnancy"];

export default function MyHistoryScreen() {
  const t = useTokens();
  useLang();
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useMyHistory();
  const [a, setA] = useState<Answers>({});
  const [first, setFirst] = useState<YN | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data?.answers) return;
    // Before she has answered, blank means "not answered yet", so nothing is
    // pre-selected (null would show as "Not sure"). Answers the clinic
    // already recorded do show.
    setA(
      data.submittedAt
        ? data.answers
        : Object.fromEntries(Object.entries(data.answers).filter(([, v]) => v !== null)),
    );
    const g = data.answers.gravidity;
    if (typeof g === "number") setFirst(g <= 1);
    else if (data.submittedAt) setFirst(null);
  }, [data]);

  const set = (k: string) => (v: number | boolean | string | null) => setA((p) => ({ ...p, [k]: v }));
  const yn = (k: string) => (a[k] === undefined ? undefined : (a[k] as YN));

  const before = useMemo(() => {
    const g = a.gravidity;
    return typeof g === "number" && g > 0 ? g - 1 : 0;
  }, [a.gravidity]);

  const save = async () => {
    setSaving(true);
    try {
      const body: Answers = { ...a };
      if (first === true) {
        Object.assign(body, { gravidity: 1, parity: 0, livingChildren: 0, previousMiscarriages: 0, previousStillbirths: 0, previousCaesareans: 0 });
        for (const k of PAST) body[k] = false;
      }
      if (first === false) {
        // The counters show 0 until tapped, so 0 is what she saw and sent.
        for (const k of ["parity", "livingChildren", "previousMiscarriages", "previousStillbirths", "previousCaesareans"]) {
          if (typeof body[k] !== "number") body[k] = 0;
        }
        if (typeof body.gravidity !== "number" || (body.gravidity as number) < 2) body.gravidity = null;
      }
      if (first === null) {
        for (const k of ["gravidity", "parity", "livingChildren", "previousMiscarriages", "previousStillbirths", "previousCaesareans"]) body[k] = null;
      }
      // Only send what the API accepts.
      const allowed = new Set([...Object.keys(data?.answers ?? {})]);
      const payload = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.has(k)));
      await apiClient.put("/patients/me/history", payload);
      await queryClient.invalidateQueries({ queryKey: ["my-history"] });
      showToast({
        type: "success",
        message: L(
          "Thank you. Your clinic will go through your answers with you at your next visit.",
          "Thank you. Your clinic go check your answers with you for your next visit.",
          "A dúpẹ́. Kílíníìkì rẹ yóò yẹ àwọn ìdáhùn rẹ wò pẹ̀lú rẹ ní ìpàdé rẹ tó kàn.",
        ),
      });
      router.replace("/(tabs)");
    } catch {
      showToast({ type: "error", message: L("We couldn't save your answers. Check your internet and try again.", "E no save. Check your network and try again.", "A kò lè fi àwọn ìdáhùn rẹ pamọ́. Ṣàyẹ̀wò íntánẹ́ẹ̀tì rẹ kí o tún gbìyànjú.") });
    } finally {
      setSaving(false);
    }
  };

  const title = L("Your health history", "Your health history", "Ìtàn ìlera rẹ");

  if (isLoading) {
    return (
      <Page>
        <AppHeader title={title} onBack={() => router.back()} />
        <Skeleton height={160} />
        <Skeleton height={220} />
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <AppHeader title={title} onBack={() => router.back()} />
        <Card>
          <T variant="body" style={{ marginBottom: 12 }}>
            {L(
              "We couldn't load your questions. Check your internet and try again.",
              "We no fit load the questions. Check your network and try again.",
              "A kò lè gbé àwọn ìbéèrè rẹ wá. Ṣàyẹ̀wò íntánẹ́ẹ̀tì rẹ kí o tún gbìyànjú.",
            )}
          </T>
          <Button onPress={() => refetch()}>{L("Try again", "Try again", "Tún gbìyànjú")}</Button>
        </Card>
      </Page>
    );
  }

  if (!data?.linked) {
    return (
      <Page>
        <AppHeader title={title} onBack={() => router.back()} />
        <Card>
          <T variant="body" style={{ marginBottom: 12 }}>
            {L(
              "Link your clinic first. Then you can answer these questions and your clinic will see them.",
              "Link your clinic first. After that, you fit answer these questions and your clinic go see am.",
              "Kọ́kọ́ so kílíníìkì rẹ pọ̀. Lẹ́yìn náà o lè dáhùn àwọn ìbéèrè yìí, kílíníìkì rẹ yóò sì rí i.",
            )}
          </T>
          <Button href="/facility-linking">{L("Link my clinic", "Link my clinic", "So kílíníìkì mi pọ̀")}</Button>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <AppHeader
        title={title}
        subtitle={L("About 3 minutes", "Like 3 minutes", "Nǹkan bí ìṣẹ́jú mẹ́ta")}
        onBack={() => router.back()}
      />

      <Banner tone="green">
        {L(
          `These are the questions ${data.facilityName ?? "your clinic"} asks every pregnant woman. Your answers help them look after you. If you're not sure, choose "Not sure".`,
          `Na the questions wey ${data.facilityName ?? "your clinic"} dey ask every pregnant woman. Your answers go help dem take care of you. If you no sure, choose "I no sure".`,
          `Àwọn ìbéèrè tí ${data.facilityName ?? "kílíníìkì rẹ"} máa ń béèrè lọ́wọ́ gbogbo aboyún nìyí. Ìdáhùn rẹ yóò ràn wọ́n lọ́wọ́ láti tọ́jú rẹ. Tí kò bá dá ọ lójú, yan "Mi ò dá a lójú".`,
        )}
      </Banner>

      <SectionHeader title={L("Past pregnancies", "Pregnancy wey you don get before", "Àwọn oyún ti tẹ́lẹ̀")} />
      <Card>
        <View style={{ gap: 18 }}>
          <YesNoRow label={L("Is this your first pregnancy?", "Na your first pregnancy be this?", "Ṣé oyún àkọ́kọ́ rẹ nìyí?")} value={first} onChange={setFirst} />
          {first === false ? (
            <>
              <CountRow
                label={L("How many times have you been pregnant before this one?", "How many times you don get belle before this one?", "Ìgbà mélòó ni o ti lóyún ṣáájú èyí?")}
                value={before}
                onChange={(n) => set("gravidity")(n + 1)}
              />
              <CountRow label={L("How many babies have you given birth to?", "How many pikin you don born?", "Ọmọ mélòó ni o ti bí?")} value={a.parity as number} onChange={set("parity")} />
              <CountRow label={L("How many of your children are alive now?", "How many of your pikin dey alive now?", "Mélòó nínú àwọn ọmọ rẹ ló wà láàyè báyìí?")} value={a.livingChildren as number} onChange={set("livingChildren")} />
              <CountRow label={L("Pregnancies lost before 7 months (miscarriage)", "Belle wey comot before 7 months (miscarriage)", "Oyún tó bàjẹ́ ṣáájú oṣù 7")} value={a.previousMiscarriages as number} onChange={set("previousMiscarriages")} />
              <CountRow label={L("Babies born without life (stillbirth)", "Pikin wey born without life (stillbirth)", "Ọmọ tí a bí láìní ẹ̀mí")} value={a.previousStillbirths as number} onChange={set("previousStillbirths")} />
              <CountRow label={L("Births by operation (CS)", "Born wey dem do operation (CS)", "Ìbímọ nípasẹ̀ iṣẹ́ abẹ (CS)")} value={a.previousCaesareans as number} onChange={set("previousCaesareans")} />

              <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink, marginTop: 8 }}>
                {L("In any past pregnancy, did you have…", "For any pregnancy before, you get…", "Nínú oyún èyíkéyìí ti tẹ́lẹ̀, ṣé o ní…")}
              </Text>
              <YesNoRow label={L("High blood pressure", "High BP", "Ìfúnpá gíga")} value={yn("gestationalHypertension")} onChange={set("gestationalHypertension")} />
              <YesNoRow
                label={L("Pre-eclampsia", "Pre-eclampsia", "Pre-eclampsia")}
                hint={L("High BP with protein in the urine, or a health worker said \"pre-eclampsia\"", "High BP plus protein for urine, or health worker talk say na \"pre-eclampsia\"", "Ìfúnpá gíga pẹ̀lú protein nínú ìtọ̀, tàbí òṣìṣẹ́ ìlera sọ pé \"pre-eclampsia\" ni")}
                value={yn("previousPreeclampsia")}
                onChange={set("previousPreeclampsia")}
              />
              <YesNoRow label={L("Fits (convulsions) in pregnancy or after birth", "Fits (jerking) for pregnancy or after you born", "Gìrì nígbà oyún tàbí lẹ́yìn ìbímọ")} value={yn("previousEclampsia")} onChange={set("previousEclampsia")} />
              <YesNoRow label={L("Sugar (diabetes) in pregnancy", "Sugar (diabetes) for pregnancy", "Ìtọ̀ ṣúgà nígbà oyún")} value={yn("previousGestationalDiabetes")} onChange={set("previousGestationalDiabetes")} />
              <YesNoRow label={L("Heavy bleeding after birth", "Plenty bleeding after you born", "Ẹ̀jẹ̀ púpọ̀ lẹ́yìn ìbímọ")} value={yn("previousPostpartumHemorrhage")} onChange={set("previousPostpartumHemorrhage")} />
              <YesNoRow label={L("A baby born early (before 8 months)", "Pikin wey born early (before 8 months)", "Ọmọ tí a bí ṣáájú àkókò (ṣáájú oṣù 8)")} value={yn("previousPretermBirth")} onChange={set("previousPretermBirth")} />
              <YesNoRow label={L("Twins or more", "Twins or more", "Ìbejì tàbí jù bẹ́ẹ̀ lọ")} value={yn("previousMultiplePregnancy")} onChange={set("previousMultiplePregnancy")} />
            </>
          ) : null}
        </View>
      </Card>

      <SectionHeader title={L("Your health", "Your health", "Ìlera rẹ")} />
      <Card>
        <View style={{ gap: 18 }}>
          <T variant="small">
            {L("Has a health worker ever told you that you have…", "Health worker don ever tell you say you get…", "Ṣé òṣìṣẹ́ ìlera ti sọ fún ọ rí pé o ní…")}
          </T>
          <YesNoRow label={L("High blood pressure (before this pregnancy)", "High BP (before this pregnancy)", "Ìfúnpá gíga (ṣáájú oyún yìí)")} value={yn("chronicHypertension")} onChange={set("chronicHypertension")} />
          <YesNoRow label={L("Diabetes (sugar)", "Diabetes (sugar)", "Ìtọ̀ ṣúgà")} value={yn("diabetesMellitus")} onChange={set("diabetesMellitus")} />
          <YesNoRow label={L("Kidney disease", "Kidney sickness", "Àìsàn kíndìnrín")} value={yn("kidneyDisease")} onChange={set("kidneyDisease")} />
          <YesNoRow label={L("Heart disease", "Heart sickness", "Àìsàn ọkàn")} value={yn("heartDisease")} onChange={set("heartDisease")} />
          <YesNoRow label={L("Asthma", "Asthma", "Ikọ́ fée (asthma)")} value={yn("asthma")} onChange={set("asthma")} />
          <YesNoRow label={L("Sickle cell (SS or SC)", "Sickle cell (SS or SC)", "Sickle cell (SS tàbí SC)")} value={yn("sickleCellDisease")} onChange={set("sickleCellDisease")} />
          <YesNoRow label={L("Epilepsy (fits)", "Epilepsy (warapa)", "Wárápá")} value={yn("epilepsy")} onChange={set("epilepsy")} />
        </View>
      </Card>

      <SectionHeader title={L("Your family", "Your family", "Ẹbí rẹ")} />
      <Card>
        <View style={{ gap: 18 }}>
          <T variant="small">
            {L("Has your mother or a sister had…", "Your mama or sister don get…", "Ṣé ìyá rẹ tàbí arábìnrin rẹ ti ní…")}
          </T>
          <YesNoRow label={L("High blood pressure", "High BP", "Ìfúnpá gíga")} value={yn("familyHypertension")} onChange={set("familyHypertension")} />
          <YesNoRow label={L("Pre-eclampsia or fits in pregnancy", "Pre-eclampsia or fits for pregnancy", "Pre-eclampsia tàbí gìrì nígbà oyún")} value={yn("familyPreeclampsia")} onChange={set("familyPreeclampsia")} />
          <YesNoRow label={L("Diabetes (sugar)", "Diabetes (sugar)", "Ìtọ̀ ṣúgà")} value={yn("familyDiabetes")} onChange={set("familyDiabetes")} />
          <YesNoRow label={L("Twins", "Twins", "Ìbejì")} value={yn("familyMultiplePregnancy")} onChange={set("familyMultiplePregnancy")} />
        </View>
      </Card>

      <SectionHeader title={L("If you know them", "If you sabi dem", "Tí o bá mọ̀ wọ́n")} />
      <Card>
        <View style={{ gap: 18 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{L("Blood group", "Blood group", "Ẹgbẹ́ ẹ̀jẹ̀")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <Chip on={!a.bloodGroup} label={L("I don't know", "I no know", "Mi ò mọ̀")} onPress={() => set("bloodGroup")(null)} />
              {BLOOD_GROUPS.map((g) => (
                <Chip key={g} on={a.bloodGroup === g} label={bgLabel(g)} onPress={() => set("bloodGroup")(g)} />
              ))}
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{L("Genotype", "Genotype", "Genotype")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <Chip on={!a.genotype} label={L("I don't know", "I no know", "Mi ò mọ̀")} onPress={() => set("genotype")(null)} />
              {GENOTYPES.map((g) => (
                <Chip key={g} on={a.genotype === g} label={g} onPress={() => set("genotype")(g)} />
              ))}
            </View>
          </View>
        </View>
      </Card>

      <Button block size="lg" onPress={save} loading={saving} disabled={first === undefined}>
        {saving ? L("Saving…", "E dey save…", "Ó ń fipamọ́…") : L("Send to my clinic", "Send am give my clinic", "Fi ránṣẹ́ sí kílíníìkì mi")}
      </Button>
      {first === undefined ? (
        <T variant="small" style={{ textAlign: "center" }}>
          {L("Answer the first question to continue.", "Answer the first question first.", "Dáhùn ìbéèrè àkọ́kọ́ kí o tó tẹ̀síwájú.")}
        </T>
      ) : null}
    </Page>
  );
}
