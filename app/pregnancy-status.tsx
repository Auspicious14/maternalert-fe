import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { AppHeader, Banner, Button, FONT, Page, Pressable, T, useTokens } from "../components/ds";
import { useToast } from "../components/ui/ToastProvider";
import { useLang } from "../hooks/useLang";
import { useUserProfile } from "../hooks/useUserProfile";
import { tr } from "../services/i18n";
import { pregnancyStatusOf, type PregnancyStatus } from "../services/pregnancy/pregnancyDay";

// Same screen as maternalert-web/src/app/(patient)/pregnancy-status/page.tsx
// She tells us she has had her baby, or that her pregnancy has ended, so the
// app stops counting down and stops showing baby-size content.

const OPTIONS = (): { v: PregnancyStatus; title: string; sub: string }[] => [
  {
    v: "ONGOING",
    title: tr({ en: "I'm still pregnant", pcm: "I still dey pregnant", yo: "Mo ṣì lóyún" }),
    sub: tr({ en: "Keep the countdown and baby updates.", pcm: "Keep the countdown and pikin update.", yo: "Máa fi ìkàsílẹ̀ àti ìròyìn ọmọ hàn." }),
  },
  {
    v: "DELIVERED",
    title: tr({ en: "I've had my baby", pcm: "I don born", yo: "Mo ti bímọ" }),
    sub: tr({ en: "Show me after-birth care for me and my baby.", pcm: "Show me care for after I born, for me and my pikin.", yo: "Fi ìtọ́jú lẹ́yìn ìbímọ hàn mí, fún èmi àti ọmọ mi." }),
  },
  {
    v: "ENDED",
    title: tr({ en: "My pregnancy has ended", pcm: "My pregnancy don end", yo: "Oyún mi ti parí" }),
    sub: tr({
      en: "This includes a loss at any stage. We'll stop all baby content.",
      pcm: "E include if you lose am at any time. We go stop all pikin content.",
      yo: "Èyí kan àdánù ní ìpele èyíkéyìí. A ó dá gbogbo ohun nípa ọmọ dúró.",
    }),
  },
];

export default function PregnancyStatusScreen() {
  const router = useRouter();
  const t = useTokens();
  useLang();
  const { profile, updateProfile } = useUserProfile() as any;
  const { showToast } = useToast();
  const [choice, setChoice] = useState<PregnancyStatus>("ONGOING");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) setChoice(pregnancyStatusOf(profile));
  }, [profile]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ pregnancyStatus: choice });
      if (choice === "DELIVERED") {
        showToast({ type: "success", message: tr({ en: "Congratulations!", pcm: "Congratulations!", yo: "Ẹ kú oríire!" }) });
      } else if (choice === "ONGOING") {
        showToast({ type: "success", message: tr({ en: "Saved", pcm: "We don save am", yo: "A ti fi pamọ́" }) });
      }
      router.replace("/(tabs)");
    } catch {
      setError(tr({ en: "We couldn't save that. Please try again.", pcm: "We no fit save am. Abeg try again.", yo: "A kò lè fi pamọ́. Jọ̀wọ́ tún gbìyànjú." }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <AppHeader title={tr({ en: "Your pregnancy", pcm: "Your pregnancy", yo: "Oyún rẹ" })} onBack={() => router.back()} />
      <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
        {OPTIONS().map((o) => {
          const on = choice === o.v;
          return (
            <Pressable
              key={o.v}
              onPress={() => setChoice(o.v)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                padding: 16,
                minHeight: 60,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: on ? t.green : t.border,
                backgroundColor: on ? t.mint : t.surface,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: on ? t.green : t.borderStrong,
                  backgroundColor: on ? t.green : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {on ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{o.title}</Text>
                <Text style={{ fontFamily: FONT.regular, fontSize: 14, lineHeight: 19, color: t.muted }}>{o.sub}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <T variant="small">
        {tr({
          en: "Your clinic will see this on your record. You can change it here at any time.",
          pcm: "Your clinic go see am for your record. You fit change am here any time.",
          yo: "Kílíníìkì rẹ yóò rí èyí lórí àkọsílẹ̀ rẹ. O lè yí i padà níbí nígbàkígbà.",
        })}
      </T>
      {error ? <Banner tone="red">{error}</Banner> : null}
      <Button block size="lg" onPress={save} loading={saving}>
        {tr({ en: "Save", pcm: "Save", yo: "Fi pamọ́" })}
      </Button>
    </Page>
  );
}
