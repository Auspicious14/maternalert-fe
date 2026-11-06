import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import apiClient from "../api/client";
import { Banner, Button, FONT, Page, Pressable, useTokens } from "../components/ds";
import { RoundButton, Spot } from "../components/learn/LearnBits";
import { useAuthContext } from "../context/AuthContext";
import { RELATIONS, relationLabel, type Relation } from "../hooks/usePartners";
import { useLang } from "../hooks/useLang";
import { tr } from "../services/i18n";
import { pregnancyOnDate } from "../services/pregnancy/pregnancyDay";

// Same screen as maternalert-web/src/app/(patient)/join/page.tsx

const cleanCode = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

interface Preview {
  firstName: string;
  pregnancyWeeks: number | null;
  pregnancyReferenceDate: string | null;
  pregnancyStatus: string;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const t = useTokens();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{label}</Text>
      {children}
      {hint ? <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: t.muted }}>{hint}</Text> : null}
    </View>
  );
}

export default function JoinScreen() {
  const router = useRouter();
  const t = useTokens();
  useLang();
  const params = useLocalSearchParams<{ code?: string }>();
  const { user, checkSession } = useAuthContext() as any;
  const [code, setCode] = useState(cleanCode(String(params.code ?? "")));
  const [preview, setPreview] = useState<Preview | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [name, setName] = useState<string>(user?.displayName ?? "");
  const [phone, setPhone] = useState<string>(user?.phone ?? "");
  const [relation, setRelation] = useState<Relation>("PARTNER");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(null);
    setCodeError(null);
    if (code.length !== 6) return;
    let live = true;
    apiClient
      .get(`/partners/code/${code}`)
      .then((r) => live && setPreview(r.data))
      .catch((e) => {
        if (!live) return;
        setCodeError(
          e?.response?.status === 404
            ? tr({ en: "That code isn't valid any more. Ask her to send a new one.", pcm: "That code no work again. Ask her make she send new one.", yo: "Kóòdù yẹn kò ṣiṣẹ́ mọ́. Ní kí ó fi òmíràn ránṣẹ́." })
            : tr({ en: "We couldn't check the code. Check your internet.", pcm: "We no fit check the code. Check your network.", yo: "A kò lè ṣàyẹ̀wò kóòdù náà. Ṣàyẹ̀wò íńtánẹ́ẹ̀tì rẹ." }),
        );
      });
    return () => {
      live = false;
    };
  }, [code]);

  const weeks = preview ? pregnancyOnDate(preview.pregnancyWeeks, preview.pregnancyReferenceDate)?.week : null;

  const join = async () => {
    setError(null);
    if (name.trim().length < 2) return setError(tr({ en: "Write your name.", pcm: "Write your name.", yo: "Kọ orúkọ rẹ." }));
    setSaving(true);
    try {
      await apiClient.post("/partners/join", { code, name: name.trim(), relation, phone: phone.trim() || undefined });
      await checkSession?.();
      router.replace("/supporting" as any);
    } catch (e: any) {
      const m = e?.response?.data?.message;
      setError(Array.isArray(m) ? m.join(". ") : m || tr({ en: "We couldn't join. Try again.", pcm: "We no fit join. Try again.", yo: "A kò lè darapọ̀. Tún gbìyànjú." }));
    } finally {
      setSaving(false);
    }
  };

  const input = { minHeight: 52, borderRadius: 14, borderWidth: 1.5, borderColor: t.borderStrong, paddingHorizontal: 14, fontFamily: FONT.regular, fontSize: 16, color: t.ink, backgroundColor: t.surface } as const;

  return (
    <Page>
      <View style={{ flexDirection: "row" }}>
        <RoundButton icon="arrow-back" label={tr({ en: "Back", pcm: "Go back", yo: "Padà" })} onPress={() => router.back()} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 28, color: t.ink }}>
            {tr({ en: "Enter her code", pcm: "Put her code", yo: "Tẹ kóòdù rẹ̀" })}
          </Text>
          <Text style={{ fontFamily: FONT.regular, fontSize: 15, lineHeight: 21, color: t.muted, marginTop: 6 }}>
            {tr({ en: "Type the 6 letters she sent you.", pcm: "Type the 6 letters wey she send you.", yo: "Tẹ lẹ́tà mẹ́fà tí ó fi ránṣẹ́ sí ọ." })}
          </Text>
        </View>
        <Spot art="paircode" size={92} />
      </View>

      <TextInput
        value={code}
        onChangeText={(v) => setCode(cleanCode(v))}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={6}
        placeholder="K7M4QX"
        placeholderTextColor={t.muted}
        accessibilityLabel={tr({ en: "Pairing code", pcm: "Pairing code", yo: "Kóòdù ìsopọ̀" })}
        style={{ height: 72, borderRadius: 20, borderWidth: 2, borderColor: t.green, backgroundColor: t.surface, textAlign: "center", fontFamily: FONT.bold, fontSize: 32, letterSpacing: 10, color: t.ink }}
      />
      {preview ? (
        <View style={{ flexDirection: "row", gap: 12, padding: 16, borderRadius: 20, backgroundColor: t.mint }}>
          <Ionicons name="checkmark" size={22} color={t.greenInk} />
          <Text style={{ flex: 1, fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>
            {tr({ en: "Code for", pcm: "Code for", yo: "Kóòdù fún" })} <Text style={{ fontFamily: FONT.bold }}>{preview.firstName}</Text>
            {weeks && preview.pregnancyStatus === "ONGOING" ? tr({ en: `, ${weeks} weeks pregnant`, pcm: `, ${weeks} weeks pregnant`, yo: `, oyún ọ̀sẹ̀ ${weeks}` }) : ""}
          </Text>
        </View>
      ) : null}
      {codeError ? <Banner tone="amber">{codeError}</Banner> : null}

      <Field label={tr({ en: "Your name", pcm: "Your name", yo: "Orúkọ rẹ" })} hint={tr({ en: "She'll see this.", pcm: "She go see am.", yo: "Ó máa rí èyí." })}>
        <TextInput value={name} onChangeText={setName} maxLength={80} autoComplete="name" style={input} accessibilityLabel={tr({ en: "Your name", pcm: "Your name", yo: "Orúkọ rẹ" })} />
      </Field>
      <Field
        label={tr({ en: "Your phone number", pcm: "Your phone number", yo: "Nọ́ńbà fóònù rẹ" })}
        hint={tr({ en: "For an SMS or WhatsApp if she ever needs urgent care.", pcm: "For SMS or WhatsApp if she need urgent help.", yo: "Fún SMS tàbí WhatsApp tí ó bá nílò ìtọ́jú kíákíá." })}
      >
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" style={input} accessibilityLabel={tr({ en: "Your phone number", pcm: "Your phone number", yo: "Nọ́ńbà fóònù rẹ" })} />
      </Field>
      <Field label={tr({ en: "How are you related to her?", pcm: "Wetin you be to her?", yo: "Kí ni ìbáṣepọ̀ rẹ pẹ̀lú rẹ̀?" })}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {RELATIONS.map((r) => {
            const on = relation === r;
            return (
              <Pressable
                key={r}
                onPress={() => setRelation(r)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1.5, borderColor: on ? t.green : t.borderStrong, backgroundColor: on ? t.green : t.surface, justifyContent: "center" }}
              >
                <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#FFFFFF" : t.ink2 }}>{relationLabel(r, tr)}</Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <View style={{ padding: 16, borderRadius: 20, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface, gap: 8 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Ionicons name="warning-outline" size={18} color={t.red} />
          <Text style={{ flex: 1, fontFamily: FONT.regular, fontSize: 14, lineHeight: 20, color: t.ink2 }}>
            {tr({ en: "You'll get an alert if she ever needs urgent care.", pcm: "We go alert you if she need urgent help.", yo: "A ó fi ìkìlọ̀ ránṣẹ́ sí ọ tí ó bá nílò ìtọ́jú kíákíá." })}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Ionicons name="eye-outline" size={18} color={t.green} />
          <Text style={{ flex: 1, fontFamily: FONT.regular, fontSize: 14, lineHeight: 20, color: t.ink2 }}>
            {tr({ en: "You'll see what she chooses to share. She can stop sharing at any time.", pcm: "You go see wetin she choose to share. She fit stop am any time.", yo: "O máa rí ohun tí ó yàn láti pín. Ó lè dá pípín dúró nígbàkígbà." })}
          </Text>
        </View>
      </View>

      {error ? <Banner tone="red">{error}</Banner> : null}
      <Button block size="lg" onPress={join} disabled={!preview} loading={saving}>
        {preview ? tr({ en: `Join ${preview.firstName}`, pcm: `Join ${preview.firstName}`, yo: `Darapọ̀ mọ́ ${preview.firstName}` }) : tr({ en: "Join", pcm: "Join", yo: "Darapọ̀" })}
      </Button>
      {user?.role !== "SUPPORTER" ? (
        <Pressable onPress={() => router.push("/profile-setup")} accessibilityRole="button" style={{ minHeight: 44, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>
            {tr({ en: "No code? Use MaternAlert for my own pregnancy", pcm: "No code? Use MaternAlert for my own pregnancy", yo: "Kò sí kóòdù? Lo MaternAlert fún oyún tèmi" })}
          </Text>
        </Pressable>
      ) : null}
    </Page>
  );
}
