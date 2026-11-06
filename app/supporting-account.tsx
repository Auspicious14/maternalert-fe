import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, View } from "react-native";

import apiClient from "../api/client";
import { AppHeader, Button, FONT, Page, Pressable, SectionHeader, T, useTokens } from "../components/ds";
import { LanguageSwitch } from "../components/learn/LearnBits";
import { useAuthContext } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";
import { useLang } from "../hooks/useLang";
import { relationLabel, useSupporting } from "../hooks/usePartners";
import { tr } from "../services/i18n";

// Same screen as maternalert-web/src/app/(patient)/supporting/account/page.tsx

export default function SupporterAccountScreen() {
  const router = useRouter();
  const t = useTokens();
  useLang();
  const { user } = useAuthContext() as any;
  const { logout } = useAuth() as any;
  const { data, refetch } = useSupporting();

  const leave = (linkId: string, name: string) =>
    Alert.alert(tr({ en: `Stop following ${name}?`, pcm: `Stop to follow ${name}?`, yo: `Dá títẹ̀lé ${name} dúró?` }), undefined, [
      { text: tr({ en: "Cancel", pcm: "Cancel", yo: "Fagilé" }), style: "cancel" },
      {
        text: tr({ en: "Leave", pcm: "Comot", yo: "Kúrò" }),
        style: "destructive",
        onPress: async () => {
          await apiClient.delete(`/partners/supporting/${linkId}`).catch(() => undefined);
          refetch();
        },
      },
    ]);

  return (
    <Page>
      <AppHeader title={tr({ en: "Account", pcm: "Account", yo: "Àkáǹtì" })} subtitle={user?.displayName ?? undefined} onBack={() => router.back()} />
      <T variant="small">
        {tr({
          en: "Keep notifications on for MaternAlert in your phone settings, so you hear straight away if she needs urgent care.",
          pcm: "Make notification dey on for MaternAlert for your phone settings, so you go hear sharp sharp if she need urgent care.",
          yo: "Jẹ́ kí ìfitónilétí MaternAlert wà ní títàn nínú ètò fóònù rẹ, kí o lè gbọ́ lẹ́sẹ̀kẹsẹ̀ tí ó bá nílò ìtọ́jú kíákíá.",
        })}
      </T>

      <SectionHeader title={tr({ en: "People you support", pcm: "People wey you dey support", yo: "Àwọn tí o ń ṣàtìlẹ́yìn fún" })} />
      <View style={{ gap: 8 }}>
        {(data?.mothers ?? []).map((m) => (
          <View key={m.linkId} style={{ flexDirection: "row", alignItems: "center", padding: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{m.fullName || m.firstName}</Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: t.muted }}>
                {tr({ en: "You:", pcm: "You:", yo: "Ìwọ:" })} {relationLabel(m.relation, tr)}
              </Text>
            </View>
            <Pressable onPress={() => leave(m.linkId, m.firstName)} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: FONT.bold, fontSize: 14, color: t.redInk }}>{tr({ en: "Leave", pcm: "Comot", yo: "Kúrò" })}</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Button variant="secondary" onPress={() => router.push("/join" as any)}>
        {tr({ en: "Enter another code", pcm: "Put another code", yo: "Tẹ kóòdù mìíràn" })}
      </Button>

      <SectionHeader title={tr({ en: "Language", pcm: "Language", yo: "Èdè" })} />
      <LanguageSwitch />

      <Button variant="secondary" onPress={() => logout()}>
        {tr({ en: "Sign out", pcm: "Sign out", yo: "Jáde" })}
      </Button>
    </Page>
  );
}
