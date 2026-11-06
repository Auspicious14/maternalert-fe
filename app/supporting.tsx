import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, Text, View } from "react-native";

import { Banner, Button, FONT, Page, Pressable, Skeleton, T, useTokens } from "../components/ds";
import { DangerCard, Kicker, RoundButton, Spot, useTone } from "../components/learn/LearnBits";
import { FruitArt } from "../components/pregnancy/PregnancyHero";
import { getWeekData } from "../constants/fetal-development";
import { useAuthContext } from "../context/AuthContext";
import { useLang } from "../hooks/useLang";
import { useSupporting, type MotherView } from "../hooks/usePartners";
import { tr } from "../services/i18n";
import { greeting } from "../services/learnTheme";
import { medName } from "../services/medicines";
import { aSize, fruitFor, prettyDate, pregnancyOnDate } from "../services/pregnancy/pregnancyDay";
import { supportTips } from "../services/supportTips";

// Same screen as maternalert-web/src/app/(patient)/supporting/page.tsx
// Home for a husband, partner or family member: read-only.

const time = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
const when = (iso: string) => {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString() ? `${tr({ en: "today", pcm: "today", yo: "lónìí" })} ${time(iso)}` : prettyDate(d);
};
const humanize = (s: string) => s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

export default function SupportingScreen() {
  const router = useRouter();
  const t = useTokens();
  useLang();
  const { user } = useAuthContext() as any;
  const { data, isLoading, isError, refetch } = useSupporting();
  const [pick, setPick] = useState(0);
  const mothers = data?.mothers ?? [];
  const m = mothers[Math.min(pick, Math.max(0, mothers.length - 1))];
  const sky = useTone("sky");

  return (
    <Page>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flexShrink: 1 }}>
          <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: t.muted }}>{greeting(user?.displayName)}</Text>
          <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 28, color: t.ink }}>
            {m ? tr({ en: `Supporting ${m.firstName}`, pcm: `You dey support ${m.firstName}`, yo: `Ò ń ṣàtìlẹ́yìn fún ${m.firstName}` }) : tr({ en: "Supporting", pcm: "Support", yo: "Àtìlẹ́yìn" })}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
          <RoundButton icon="book-outline" label={tr({ en: "Learn", pcm: "Learn", yo: "Kẹ́kọ̀ọ́" })} onPress={() => router.push("/(tabs)/education")} />
          <RoundButton icon="person-outline" label={tr({ en: "Account", pcm: "Account", yo: "Àkáǹtì" })} onPress={() => router.push("/supporting-account" as any)} />
        </View>
      </View>

      {mothers.length > 1 ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          {mothers.map((x, i) => (
            <Pressable
              key={x.linkId}
              onPress={() => setPick(i)}
              accessibilityRole="tab"
              accessibilityState={{ selected: i === pick }}
              style={{ minHeight: 44, paddingHorizontal: 16, borderRadius: 999, justifyContent: "center", backgroundColor: i === pick ? t.green : t.surface, borderWidth: 1.5, borderColor: i === pick ? t.green : t.borderStrong }}
            >
              <Text style={{ fontFamily: FONT.semibold, color: i === pick ? "#FFFFFF" : t.ink2 }}>{x.firstName}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {isError ? <Banner tone="amber">{tr({ en: "We couldn't load her updates. Pull down to try again.", pcm: "We no fit load her update. Try again.", yo: "A kò lè ṣí ìròyìn rẹ̀. Tún gbìyànjú." })}</Banner> : null}
      {isError ? (
        <Button variant="secondary" onPress={() => refetch()}>
          {tr({ en: "Try again", pcm: "Try again", yo: "Tún gbìyànjú" })}
        </Button>
      ) : null}
      {isLoading ? <Skeleton height={200} radius={24} /> : null}

      {data && !m ? (
        <View style={{ borderRadius: 32, padding: 20, alignItems: "center", backgroundColor: sky.bg }}>
          <Spot art="couple" size={130} />
          <Text style={{ fontFamily: FONT.bold, fontSize: 22, color: t.ink, textAlign: "center", marginTop: 6 }}>
            {tr({ en: "You're not linked to anyone yet", pcm: "You never join anybody", yo: "O kò tíì so pọ̀ mọ́ ẹnikẹ́ni" })}
          </Text>
          <Text style={{ fontFamily: FONT.regular, fontSize: 15, lineHeight: 21, color: t.ink2, textAlign: "center", marginTop: 6 }}>
            {tr({ en: "Ask her for her code. She finds it in Profile → Partner or family.", pcm: "Ask her for her code. E dey Profile → Partner or family.", yo: "Béèrè kóòdù rẹ̀. Ó wà ní Profile → Partner or family." })}
          </Text>
          <View style={{ marginTop: 14 }}>
            <Button onPress={() => router.push("/join" as any)}>{tr({ en: "Enter a code", pcm: "Put code", yo: "Tẹ kóòdù" })}</Button>
          </View>
        </View>
      ) : null}

      {m ? <MotherPanel m={m} /> : null}
    </Page>
  );
}

function MotherPanel({ m }: { m: MotherView }) {
  const router = useRouter();
  const t = useTokens();
  const mint = useTone("mint");
  const sky = useTone("sky");
  const p = m.pregnancy;
  const preg = p && p.status === "ONGOING" ? pregnancyOnDate(p.weeks, p.referenceDate) : null;
  const data = preg ? getWeekData(Math.max(4, preg.week)) : null;
  const tips = supportTips(preg?.week ?? null, p?.status === "DELIVERED").filter((x) => x.id !== "signs");
  const bp = m.latestBp?.systolic ? `${m.latestBp.systolic}/${m.latestBp.diastolic}` : null;
  const step = (n: number, label: string, sub: string | null, action: React.ReactNode) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 10, paddingHorizontal: 12, borderRadius: 18, backgroundColor: "#FFFFFF" }}>
      <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: t.red, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: FONT.bold, color: "#FFFFFF" }}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONT.bold, fontSize: 15, color: "#0F241C" }}>{label}</Text>
        {sub ? <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: "#5B6B64" }}>{sub}</Text> : null}
      </View>
      {action}
    </View>
  );
  const act = (label: string, icon: keyof typeof Ionicons.glyphMap | null, onPress: () => void, solid = false) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{ minHeight: 44, paddingHorizontal: 14, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: solid ? t.red : "#FDE6E7" }}
    >
      {icon ? <Ionicons name={icon} size={18} color={solid ? "#FFFFFF" : "#A82A31"} /> : null}
      <Text style={{ fontFamily: FONT.bold, fontSize: 15, color: solid ? "#FFFFFF" : "#A82A31" }}>{label}</Text>
    </Pressable>
  );

  return (
    <>
      {m.status.urgent ? (
        <View accessibilityRole="alert" style={{ padding: 20, borderRadius: 28, backgroundColor: t.red }}>
          <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, height: 30, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.18)" }}>
            <Ionicons name="warning-outline" size={16} color="#FFFFFF" />
            <Text style={{ fontFamily: FONT.bold, fontSize: 13, color: "#FFFFFF" }}>
              {tr({ en: "Urgent", pcm: "Urgent", yo: "Kíákíá" })}
              {m.status.since ? ` · ${time(m.status.since)}` : ""}
            </Text>
          </View>
          <Text style={{ fontFamily: FONT.bold, fontSize: 26, lineHeight: 30, color: "#FFFFFF", marginTop: 12 }}>
            {tr({ en: `${m.firstName} needs urgent care`, pcm: `${m.firstName} need urgent care`, yo: `${m.firstName} nílò ìtọ́jú kíákíá` })}
          </Text>
          <Text style={{ fontFamily: FONT.regular, fontSize: 16, lineHeight: 23, color: "#FDE6E7", marginTop: 8 }}>
            {bp
              ? tr({ en: `Her blood pressure was ${bp}. Help her get to a hospital now.`, pcm: `Her BP na ${bp}. Help her reach hospital now now.`, yo: `Ìfúnpá rẹ̀ jẹ́ ${bp}. Ràn án lọ́wọ́ láti dé ilé ìwòsàn ní báyìí.` })
              : tr({ en: "Her latest check needs urgent care. Help her get to a hospital now.", pcm: "Her last check need urgent care. Help her reach hospital now now.", yo: "Àyẹ̀wò rẹ̀ tó kẹ́yìn nílò ìtọ́jú kíákíá. Ràn án lọ́wọ́ láti dé ilé ìwòsàn ní báyìí." })}
          </Text>
          <View style={{ gap: 8, marginTop: 14 }}>
            {step(1, tr({ en: "Call her now", pcm: "Call her now", yo: "Pè é ní báyìí" }), null, m.phone ? act(tr({ en: "Call", pcm: "Call", yo: "Pè" }), "call", () => Linking.openURL(`tel:${m.phone}`), true) : null)}
            {step(2, tr({ en: "Get her to a hospital", pcm: "Carry her go hospital", yo: "Gbé e lọ sí ilé ìwòsàn" }), null, act(tr({ en: "Nearest", pcm: "Near", yo: "Tó súnmọ́" }), "location", () => router.push("/clinic-finder")))}
            {m.facility?.phone
              ? step(3, tr({ en: "Call her clinic", pcm: "Call her clinic", yo: "Pe kílíníìkì rẹ̀" }), m.facility.name, act(tr({ en: "Call", pcm: "Call", yo: "Pè" }), null, () => Linking.openURL(`tel:${m.facility!.phone}`)))
              : null}
          </View>
          <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: "#FDE6E7", marginTop: 12 }}>
            {tr({ en: "Bring her clinic card and any medicines she takes.", pcm: "Carry her clinic card and the medicine wey she dey take.", yo: "Mú káàdì kílíníìkì rẹ̀ àti àwọn oògùn tí ó ń lò dání." })}
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 24, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: m.status.state === "MONITOR" ? t.amberBg : t.mint }}>
            <Ionicons name={m.status.state === "MONITOR" ? "warning-outline" : "checkmark"} size={24} color={m.status.state === "MONITOR" ? t.amber : t.green} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT.bold, fontSize: 18, color: t.ink }}>
              {m.status.state === "MONITOR"
                ? tr({ en: `Keep an eye on ${m.firstName}`, pcm: `Dey watch ${m.firstName}`, yo: `Máa ṣọ́ ${m.firstName}` })
                : tr({ en: `${m.firstName} is doing well`, pcm: `${m.firstName} dey okay`, yo: `Ara ${m.firstName} yá` })}
            </Text>
            <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.muted, marginTop: 2 }}>
              {m.status.state === "MONITOR"
                ? tr({ en: "Her last check needs a follow-up soon. Remind her to check again.", pcm: "Her last check need follow-up. Remind her to check again.", yo: "Àyẹ̀wò rẹ̀ tó kẹ́yìn nílò àtúnyẹ̀wò. Rán an létí láti tún wò ó." })
                : m.latestBp
                  ? `${tr({ en: "Blood pressure", pcm: "BP", yo: "Ìfúnpá" })} ${bp ? `${bp} ` : ""}${when(m.latestBp.at)}`
                  : tr({ en: "No blood pressure check yet.", pcm: "She never check BP.", yo: "Kò tíì wọn ìfúnpá." })}
            </Text>
          </View>
        </View>
      )}

      {preg && data ? (
        <View style={{ minHeight: 190, padding: 20, borderRadius: 32, overflow: "hidden", backgroundColor: mint.bg }}>
          <View style={{ position: "absolute", right: -40, top: -40, width: 210, height: 210, borderRadius: 105, backgroundColor: mint.edge }} />
          <View style={{ position: "absolute", right: 6, top: 20 }}>
            <FruitArt kind={fruitFor(data.size)} size={150} bob />
          </View>
          <View style={{ maxWidth: "58%" }}>
            <View style={{ alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: t.surface }}>
              <Text style={{ fontFamily: FONT.bold, fontSize: 12, color: mint.ink }}>{tr({ en: `Week ${preg.week}`, pcm: `Week ${preg.week}`, yo: `Ọ̀sẹ̀ ${preg.week}` })}</Text>
            </View>
            <Text style={{ fontFamily: FONT.bold, fontSize: 23, lineHeight: 27, color: t.ink, marginTop: 12 }}>
              {tr({ en: `Baby is the size of ${aSize(data.size)}`, pcm: `Pikin don reach size of ${data.size}`, yo: `Ọmọ ti tó ${data.size}` })}
            </Text>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 14, color: mint.ink, marginTop: 8 }}>
              {tr({ en: "Due", pcm: "Due", yo: "Ọjọ́ ìbí" })} {prettyDate(preg.dueDate)}
              {preg.daysToGo >= 0 ? ` · ${tr({ en: `${preg.daysToGo} days to go`, pcm: `${preg.daysToGo} days remain`, yo: `Ọjọ́ ${preg.daysToGo} ló kù` })}` : ""}
            </Text>
          </View>
        </View>
      ) : null}

      {m.nextAppointment ? (
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center", padding: 16, borderRadius: 24, backgroundColor: sky.bg }}>
          <View style={{ width: 56, height: 60, borderRadius: 16, backgroundColor: t.surface, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: FONT.bold, fontSize: 11, color: sky.ink }}>
              {new Date(m.nextAppointment.dateTime).toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase()}
            </Text>
            <Text style={{ fontFamily: FONT.bold, fontSize: 22, color: t.ink }}>{new Date(m.nextAppointment.dateTime).getDate()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Kicker color={sky.ink}>
              {m.nextAppointment.type === "ANC" ? tr({ en: "Next antenatal visit", pcm: "Next clinic visit", yo: "Ìbẹ̀wò tó kàn" }) : tr({ en: "Next appointment", pcm: "Next appointment", yo: "Àdéhùn tó kàn" })}
            </Kicker>
            <Text style={{ fontFamily: FONT.bold, fontSize: 16, color: t.ink, marginTop: 2 }}>
              {time(m.nextAppointment.dateTime)}
              {m.nextAppointment.facilityName || m.nextAppointment.location ? ` · ${m.nextAppointment.facilityName || m.nextAppointment.location}` : ""}
            </Text>
            <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: sky.ink, marginTop: 2 }}>
              {tr({ en: "Can you go with her? We'll remind you the day before.", pcm: "You fit follow her? We go remind you the day before.", yo: "Ṣé o lè bá a lọ? A ó rán ọ létí ní ọjọ́ kan ṣáájú." })}
            </Text>
          </View>
        </View>
      ) : null}

      {m.medicines?.length ? (
        <View style={{ gap: 8 }}>
          <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink }}>
            {tr({ en: "Her medicines today", pcm: "Her medicine today", yo: "Àwọn oògùn rẹ̀ lónìí" })}
          </Text>
          {m.medicines.map((x) => (
            <View key={x.name} style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
              <Text style={{ flex: 1, fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{medName({ kind: x.kind as any, name: x.name })}</Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: t.muted }}>
                {tr({ en: `${x.takenToday} of ${x.dosesToday} taken`, pcm: `${x.takenToday} of ${x.dosesToday} taken`, yo: `${x.takenToday} nínú ${x.dosesToday}` })}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {m.symptoms?.length ? (
        <View style={{ gap: 8 }}>
          <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink }}>
            {tr({ en: "How she's been feeling", pcm: "How she dey feel", yo: "Bí ara rẹ̀ ṣe rí" })}
          </Text>
          {m.symptoms.map((x, i) => (
            <View key={i} style={{ flexDirection: "row", padding: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
              <Text style={{ flex: 1, fontFamily: FONT.semibold, fontSize: 15, color: t.ink }}>{humanize(x.symptomType)}</Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: t.muted }}>{when(x.createdAt)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink, marginTop: 8 }}>
        {tr({ en: "How you can help this week", pcm: "How you fit help this week", yo: "Bí o ṣe lè ṣèrànwọ́ lọ́sẹ̀ yìí" })}
      </Text>
      {tips.map((x) => (
        <Tip key={x.id} tip={x} />
      ))}

      <DangerCard
        title={tr({ en: "Know the danger signs", pcm: "Know the danger signs", yo: "Mọ àwọn àmì ewu" })}
        sub={tr({ en: "You may be the one who acts", pcm: "Na you fit act", yo: "Ìwọ lè jẹ́ ẹni tí yóò gbé ìgbésẹ̀" })}
        onPress={() => router.push((p?.status === "DELIVERED" ? "/education/bleeding-after-birth" : "/education/danger-signs") as any)}
      />

      <T variant="small" style={{ textAlign: "center" }}>
        {tr({
          en: `${m.firstName} chooses what you see here. MaternAlert supports care; it does not replace her clinic.`,
          pcm: `${m.firstName} dey choose wetin you go see here. MaternAlert dey support care; e no replace her clinic.`,
          yo: `${m.firstName} ló ń yan ohun tí o máa rí níbí. MaternAlert ń ṣàtìlẹ́yìn ìtọ́jú; kò rọ́pò kílíníìkì rẹ̀.`,
        })}
      </T>
    </>
  );
}

function Tip({ tip }: { tip: ReturnType<typeof supportTips>[number] }) {
  const t = useTokens();
  const c = useTone(tip.tone);
  return (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center", padding: 14, borderRadius: 22, backgroundColor: c.bg }}>
      <Spot art={tip.art} size={64} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONT.bold, fontSize: 16, lineHeight: 20, color: t.ink }}>{tip.title}</Text>
        <Text style={{ fontFamily: FONT.regular, fontSize: 14, lineHeight: 20, color: c.ink, marginTop: 3 }}>{tip.body}</Text>
      </View>
    </View>
  );
}
