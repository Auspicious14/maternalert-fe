import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

import { Button, FONT, Page, Pressable, useTokens } from "../components/ds";
import { Kicker, Spot, useTone } from "../components/learn/LearnBits";
import { useLang } from "../hooks/useLang";
import { tr } from "../services/i18n";

// Same screen as maternalert-web/src/app/(patient)/welcome/page.tsx
// Right after sign-up: her own pregnancy, or supporting someone else's.

type Choice = "MOTHER" | "SUPPORTER";

function Option({
  on,
  onPress,
  tone,
  art,
  title,
  sub,
}: {
  on: boolean;
  onPress: () => void;
  tone: "mint" | "sky";
  art: "mama" | "couple";
  title: string;
  sub: string;
}) {
  const t = useTokens();
  const c = useTone(tone);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: on }}
      style={{ minHeight: 180, padding: 18, borderRadius: 28, overflow: "hidden", borderWidth: 2, borderColor: on ? c.ink : "transparent", backgroundColor: c.bg }}
    >
      <Spot art={art} size={112} style={{ position: "absolute", right: -4, bottom: -6 }} />
      {on ? (
        <View style={{ position: "absolute", top: 16, right: 16, width: 28, height: 28, borderRadius: 14, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark" size={16} color={t.surface} />
        </View>
      ) : null}
      <Text style={{ fontFamily: FONT.bold, fontSize: 20, lineHeight: 24, color: t.ink, maxWidth: "62%" }}>{title}</Text>
      <Text style={{ fontFamily: FONT.regular, fontSize: 14, lineHeight: 20, color: c.ink, maxWidth: "60%", marginTop: 6 }}>{sub}</Text>
    </Pressable>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const t = useTokens();
  useLang();
  const [choice, setChoice] = useState<Choice | null>(null);
  const mint = useTone("mint");

  return (
    <Page>
      <View style={{ marginTop: 24 }}>
        <Kicker color={mint.ink}>{tr({ en: "Welcome", pcm: "You don come", yo: "Ẹ káàbọ̀" })}</Kicker>
      </View>
      <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 30, lineHeight: 34, color: t.ink }}>
        {tr({ en: "How will you use MaternAlert?", pcm: "How you go use MaternAlert?", yo: "Báwo ni o ṣe máa lo MaternAlert?" })}
      </Text>
      <Text style={{ fontFamily: FONT.regular, fontSize: 16, color: t.muted }}>
        {tr({ en: "This decides what you see.", pcm: "Na this go decide wetin you go see.", yo: "Èyí ló máa pinnu ohun tí o máa rí." })}
      </Text>
      <View accessibilityRole="radiogroup" style={{ gap: 12 }}>
        <Option
          on={choice === "MOTHER"}
          onPress={() => setChoice("MOTHER")}
          tone="mint"
          art="mama"
          title={tr({ en: "I'm pregnant or just had a baby", pcm: "I dey pregnant or I just born", yo: "Mo lóyún tàbí mo ṣẹ̀ṣẹ̀ bímọ" })}
          sub={tr({ en: "Track your pregnancy, blood pressure and visits with your clinic.", pcm: "Track your pregnancy, BP and clinic visit.", yo: "Tọpinpin oyún rẹ, ìfúnpá rẹ àti ìbẹ̀wò sí kílíníìkì." })}
        />
        <Option
          on={choice === "SUPPORTER"}
          onPress={() => setChoice("SUPPORTER")}
          tone="sky"
          art="couple"
          title={tr({ en: "I'm supporting someone who's pregnant", pcm: "I dey support person wey dey pregnant", yo: "Mo ń ṣàtìlẹ́yìn fún ẹni tó lóyún" })}
          sub={tr({ en: "Husband, partner or family. You'll need the code she shares with you.", pcm: "Husband, partner or family. You go need the code wey she send you.", yo: "Ọkọ, olólùfẹ́ tàbí ẹbí. O máa nílò kóòdù tí ó fi ránṣẹ́ sí ọ." })}
        />
      </View>
      <Button block size="lg" disabled={!choice} onPress={() => router.push((choice === "MOTHER" ? "/profile-setup" : "/join") as any)}>
        {tr({ en: "Continue", pcm: "Continue", yo: "Tẹ̀síwájú" })}
      </Button>
    </Page>
  );
}
