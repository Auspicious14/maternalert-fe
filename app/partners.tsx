import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Linking, Share, Text, View } from "react-native";

import { AppHeader, Banner, Button, FONT, Page, Pressable, SectionHeader, Skeleton, T, useTokens } from "../components/ds";
import { Spot, useTone } from "../components/learn/LearnBits";
import { useLang } from "../hooks/useLang";
import { relationLabel, usePartners } from "../hooks/usePartners";
import { tr } from "../services/i18n";

// Same screen as maternalert-web/src/app/(patient)/partners/page.tsx
// The mother invites up to 2 people and chooses what they see.

export default function PartnersScreen() {
  const router = useRouter();
  const t = useTokens();
  useLang();
  const mint = useTone("mint");
  const { data, isLoading, invite, settings, remove, removeAll } = usePartners();
  const [error, setError] = React.useState<string | null>(null);

  const code = invite.data ?? data?.activeCode ?? null;
  const used = data?.supporters.length ?? 0;
  const max = data?.max ?? 2;
  const full = used >= max;
  const hoursLeft = code ? Math.max(1, Math.round((new Date(code.expiresAt).getTime() - Date.now()) / 3_600_000)) : 0;

  const message = (c: { code: string; link: string }) =>
    tr({
      en: `I'd like you to follow my pregnancy on MaternAlert, so you know how I'm doing and get an alert if I ever need urgent care. Open ${c.link} or enter code ${c.code}.`,
      pcm: `I wan make you follow my pregnancy for MaternAlert, so you go know how I dey and get alert if I need urgent help. Open ${c.link} or put code ${c.code}.`,
      yo: `Mo fẹ́ kí o máa tẹ̀lé oyún mi lórí MaternAlert, kí o lè mọ bí mo ṣe ń ṣe, kí o sì gba ìkìlọ̀ tí mo bá nílò ìtọ́jú kíákíá. Ṣí ${c.link} tàbí tẹ kóòdù ${c.code}.`,
    });

  const makeCode = () => {
    setError(null);
    invite.mutate(undefined, {
      onError: (e: any) => {
        const m = e?.response?.data?.message;
        setError(Array.isArray(m) ? m.join(". ") : m || tr({ en: "We couldn't make a code. Try again.", pcm: "We no fit make code. Try again.", yo: "A kò lè ṣe kóòdù. Tún gbìyànjú." }));
      },
    });
  };

  const sendWhatsApp = async (c: { code: string; link: string }) => {
    const url = `whatsapp://send?text=${encodeURIComponent(message(c))}`;
    try {
      if (await Linking.canOpenURL(url)) return void Linking.openURL(url);
    } catch {
      /* fall through to the share sheet */
    }
    Share.share({ message: message(c) }).catch(() => undefined);
  };

  const row = (title: string, sub: string | null, right: React.ReactNode, first = false) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, paddingHorizontal: 16, borderTopWidth: first ? 0 : 1, borderTopColor: t.border }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONT.semibold, fontSize: 16, color: t.ink }}>{title}</Text>
        {sub ? <Text style={{ fontFamily: FONT.regular, fontSize: 13, lineHeight: 18, color: t.muted, marginTop: 2 }}>{sub}</Text> : null}
      </View>
      {right}
    </View>
  );
  const always = (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: t.mint }}>
      <Text style={{ fontFamily: FONT.bold, fontSize: 12, color: t.greenInk }}>{tr({ en: "Always", pcm: "Always", yo: "Nígbà gbogbo" })}</Text>
    </View>
  );
  const sw = (k: "shareBpNumbers" | "shareMedicines" | "shareSymptoms", label: string) => {
    const on = !!data?.settings[k];
    return (
      <Pressable
        onPress={() => settings.mutate({ [k]: !on })}
        accessibilityRole="switch"
        accessibilityState={{ checked: on }}
        accessibilityLabel={label}
        style={{ width: 52, height: 32, borderRadius: 16, padding: 3, backgroundColor: on ? t.green : t.borderStrong, alignItems: on ? "flex-end" : "flex-start" }}
      >
        <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: "#FFFFFF" }} />
      </Pressable>
    );
  };
  const card = { borderRadius: 24, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface, overflow: "hidden" } as const;

  return (
    <Page>
      <AppHeader title={tr({ en: "Partner or family", pcm: "Partner or family", yo: "Olólùfẹ́ tàbí ẹbí" })} onBack={() => router.back()} />
      {isLoading ? <Skeleton height={220} radius={28} /> : null}

      {data && !full ? (
        <View style={{ borderRadius: 32, padding: 20, alignItems: "center", overflow: "hidden", backgroundColor: mint.bg }}>
          <Spot art="couple" size={130} />
          <Text style={{ fontFamily: FONT.bold, fontSize: 22, lineHeight: 26, color: t.ink, textAlign: "center", marginTop: 4 }}>
            {tr({ en: "Let someone you trust walk this with you", pcm: "Make person wey you trust follow you", yo: "Jẹ́ kí ẹni tí o fọkàn tán bá ọ rìn ìrìn yìí" })}
          </Text>
          <Text style={{ fontFamily: FONT.regular, fontSize: 15, lineHeight: 21, color: mint.ink, textAlign: "center", marginTop: 6 }}>
            {tr({ en: "They'll see your progress and get an alert if you ever need urgent care.", pcm: "Dem go see how you dey and get alert if you need urgent care.", yo: "Wọ́n máa rí bí o ṣe ń lọ, wọ́n sì máa gba ìkìlọ̀ tí o bá nílò ìtọ́jú kíákíá." })}
          </Text>
          {code ? (
            <View style={{ alignSelf: "stretch", alignItems: "center", marginTop: 16, gap: 6 }}>
              <Text style={{ fontFamily: FONT.bold, fontSize: 13, color: t.muted }}>{tr({ en: "Your code", pcm: "Your code", yo: "Kóòdù rẹ" })}</Text>
              <Text selectable accessibilityLabel={code.code.split("").join(" ")} style={{ fontFamily: FONT.bold, fontSize: 40, letterSpacing: 10, color: t.ink }}>
                {code.code}
              </Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: t.muted, textAlign: "center" }}>
                {tr({
                  en: `Works once · expires in ${hoursLeft} hours · ${max - used} of ${max} places left`,
                  pcm: `E work once · e go expire in ${hoursLeft} hours · ${max - used} of ${max} space remain`,
                  yo: `Ó ń ṣiṣẹ́ lẹ́ẹ̀kan · yóò parí ní wákàtí ${hoursLeft} · àyè ${max - used} nínú ${max} ló kù`,
                })}
              </Text>
              <View style={{ alignSelf: "stretch", gap: 8, marginTop: 8 }}>
                <Button block onPress={() => sendWhatsApp(code)} icon={(c) => <Ionicons name="logo-whatsapp" size={18} color={c} />}>
                  {tr({ en: "Send on WhatsApp", pcm: "Send for WhatsApp", yo: "Fi ránṣẹ́ lórí WhatsApp" })}
                </Button>
                <Button block variant="secondary" onPress={() => Share.share({ message: message(code) }).catch(() => undefined)} icon={(c) => <Ionicons name="share-outline" size={18} color={c} />}>
                  {tr({ en: "Share another way", pcm: "Share another way", yo: "Pín ní ọ̀nà mìíràn" })}
                </Button>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 16 }}>
              <Button onPress={makeCode} loading={invite.isPending}>
                {tr({ en: "Invite someone", pcm: "Invite person", yo: "Pe ẹnìkan" })}
              </Button>
            </View>
          )}
        </View>
      ) : null}
      {error ? <Banner tone="red">{error}</Banner> : null}

      {data?.supporters.length ? (
        <View style={{ gap: 8 }}>
          <SectionHeader title={tr({ en: "Supporting you", pcm: "People wey dey support you", yo: "Àwọn tó ń ṣàtìlẹ́yìn fún ọ" })} />
          <T variant="small">{tr({ en: `${used} of ${max} places used`, pcm: `${used} of ${max} space don use`, yo: `Àyè ${used} nínú ${max} ti lò` })}</T>
          <View style={card}>
            {data.supporters.map((s, i) => (
              <React.Fragment key={s.id}>
              {row(
                s.name,
                `${relationLabel(s.relation, tr)}${s.isEmergencyContact ? ` · ${tr({ en: "your emergency contact", pcm: "your emergency contact", yo: "olùbásọ̀rọ̀ pàjáwìrì rẹ" })}` : ""}`,
                <Pressable
                  onPress={() =>
                    Alert.alert(tr({ en: `Remove ${s.name}?`, pcm: `Remove ${s.name}?`, yo: `Yọ ${s.name} kúrò?` }), tr({ en: "They'll stop seeing anything straight away.", pcm: "Dem no go see anything again.", yo: "Wọn kò ní rí nǹkan mọ́." }), [
                      { text: tr({ en: "Cancel", pcm: "Cancel", yo: "Fagilé" }), style: "cancel" },
                      { text: tr({ en: "Remove", pcm: "Remove", yo: "Yọ kúrò" }), style: "destructive", onPress: () => remove.mutate(s.id) },
                    ])
                  }
                  accessibilityRole="button"
                  style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 6 }}
                >
                  <Text style={{ fontFamily: FONT.bold, fontSize: 14, color: t.redInk }}>{tr({ en: "Remove", pcm: "Remove", yo: "Yọ kúrò" })}</Text>
                </Pressable>,
                i === 0,
              )}
              </React.Fragment>
            ))}
          </View>
        </View>
      ) : null}

      {data ? (
        <>
          <SectionHeader title={tr({ en: "Always shared", pcm: "We go always share", yo: "A máa ń pín nígbà gbogbo" })} />
          <View style={card}>
            {row(tr({ en: "Your week, due date and baby", pcm: "Your week, due date and pikin", yo: "Ọ̀sẹ̀ rẹ, ọjọ́ ìbí àti ọmọ" }), null, always, true)}
            {row(tr({ en: "How you're doing", pcm: "How you dey", yo: "Bí o ṣe ń ṣe" }), tr({ en: "Normal, check soon, or get help now", pcm: "Normal, check soon, or find help now", yo: "Déédéé, ṣàyẹ̀wò láìpẹ́, tàbí wá ìrànlọ́wọ́ ní báyìí" }), always)}
            {row(tr({ en: "Your appointments", pcm: "Your appointment", yo: "Àwọn àdéhùn rẹ" }), null, always)}
            {row(
              tr({ en: "Emergency alerts", pcm: "Emergency alert", yo: "Ìkìlọ̀ pàjáwìrì" }),
              tr({ en: "If a reading or symptom needs urgent care, they're told straight away so they can help you get there.", pcm: "If reading or symptom need urgent care, we go tell dem sharp sharp make dem help you reach there.", yo: "Tí ìwọ̀n tàbí àmì kan bá nílò ìtọ́jú kíákíá, a ó sọ fún wọn lẹ́sẹ̀kẹsẹ̀ kí wọ́n lè ràn ọ́ lọ́wọ́." }),
              always,
            )}
          </View>
          <SectionHeader title={tr({ en: "You choose", pcm: "Na you go choose", yo: "Ìwọ ló máa yàn" })} />
          <View style={card}>
            {row(tr({ en: "Blood pressure numbers", pcm: "BP numbers", yo: "Nọ́ńbà ìfúnpá" }), tr({ en: "Not just whether it's normal", pcm: "No be only whether e normal", yo: "Kì í ṣe bóyá ó dára nìkan" }), sw("shareBpNumbers", tr({ en: "Blood pressure numbers", pcm: "BP numbers", yo: "Nọ́ńbà ìfúnpá" })), true)}
            {row(tr({ en: "Medicines", pcm: "Medicine", yo: "Àwọn oògùn" }), tr({ en: "Whether you took them, so they can remind you", pcm: "Whether you take am, make dem fit remind you", yo: "Bóyá o lò wọ́n, kí wọ́n lè rán ọ létí" }), sw("shareMedicines", tr({ en: "Medicines", pcm: "Medicine", yo: "Àwọn oògùn" })))}
            {row(tr({ en: "Symptoms you log", pcm: "Symptoms wey you log", yo: "Àwọn àmì tí o kọ sílẹ̀" }), null, sw("shareSymptoms", tr({ en: "Symptoms you log", pcm: "Symptoms wey you log", yo: "Àwọn àmì tí o kọ sílẹ̀" })))}
          </View>
          <View style={{ flexDirection: "row", gap: 10, padding: 14, paddingHorizontal: 16, borderRadius: 20, backgroundColor: t.surface2 }}>
            <Ionicons name="lock-closed-outline" size={20} color={t.muted} />
            <Text style={{ flex: 1, fontFamily: FONT.regular, fontSize: 14, lineHeight: 20, color: t.ink2 }}>
              <Text style={{ fontFamily: FONT.bold }}>{tr({ en: "Never shared: ", pcm: "We no go ever share: ", yo: "A kò ní pín láé: " })}</Text>
              {tr({ en: "your health history answers and your messages with the clinic.", pcm: "your health history answers and your message with clinic.", yo: "àwọn ìdáhùn ìtàn ìlera rẹ àti àwọn ìfiránṣẹ́ rẹ pẹ̀lú kílíníìkì." })}
            </Text>
          </View>
          {data.supporters.length ? (
            <>
              <Pressable
                onPress={() =>
                  Alert.alert(tr({ en: "Stop sharing with everyone?", pcm: "Stop to share with everybody?", yo: "Dá pípín pẹ̀lú gbogbo ènìyàn dúró?" }), undefined, [
                    { text: tr({ en: "Cancel", pcm: "Cancel", yo: "Fagilé" }), style: "cancel" },
                    { text: tr({ en: "Stop sharing", pcm: "Stop", yo: "Dá dúró" }), style: "destructive", onPress: () => removeAll.mutate() },
                  ])
                }
                accessibilityRole="button"
                style={{ minHeight: 52, borderRadius: 999, borderWidth: 1.5, borderColor: t.red, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ fontFamily: FONT.bold, fontSize: 16, color: t.redInk }}>{tr({ en: "Stop sharing with everyone", pcm: "Stop to share with everybody", yo: "Dá pípín pẹ̀lú gbogbo ènìyàn dúró" })}</Text>
              </Pressable>
              <T variant="small" style={{ textAlign: "center" }}>
                {tr({ en: "They'll stop seeing anything straight away. We won't tell them why.", pcm: "Dem no go see anything again. We no go tell dem why.", yo: "Wọn kò ní rí nǹkan mọ́ lẹ́sẹ̀kẹsẹ̀. A kò ní sọ ìdí fún wọn." })}
              </T>
            </>
          ) : null}
        </>
      ) : null}
    </Page>
  );
}
