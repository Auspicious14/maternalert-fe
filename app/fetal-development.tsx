import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { FONT, Page, Pressable, T, useTokens } from "../components/ds";
import { DangerCard, Kicker, RoundButton, Spot, useTone } from "../components/learn/LearnBits";
import { FruitArt, WeekRing } from "../components/pregnancy/PregnancyHero";
import { FETAL_DEVELOPMENT, getWeekData } from "../constants/fetal-development";
import { useUserProfile } from "../hooks/useUserProfile";
import { tr } from "../services/i18n";
import { aSize, fruitFor, pregnancyFor, pregnancyStatusOf } from "../services/pregnancy/pregnancyDay";

// Same screen as maternalert-web/src/app/(patient)/fetal-development/page.tsx

const MIN_WEEK = 4;
const MAX_WEEK = 42;
const WEEKS = Array.from({ length: MAX_WEEK - MIN_WEEK + 1 }, (_, i) => MIN_WEEK + i);
const PILL = 54 + 8;

// One stop per new baby-size picture: "how baby has grown".
const JOURNEY = Object.keys(FETAL_DEVELOPMENT)
  .map(Number)
  .sort((a, b) => a - b)
  .map((w) => ({ week: w, kind: fruitFor(FETAL_DEVELOPMENT[w].size) }))
  .filter((s, i, all) => i === 0 || all[i - 1].kind !== s.kind);

function Facts({ title, items, tone, art }: { title: string; items: string[]; tone: "lavender" | "peach"; art: "baby" | "mama" }) {
  const t = useTokens();
  const c = useTone(tone);
  return (
    <View style={{ padding: 18, borderRadius: 28, backgroundColor: c.bg }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 19, color: t.ink }}>
          {title}
        </Text>
        <Spot art={art} size={52} style={{ marginVertical: -8, marginRight: -4 }} />
      </View>
      <View style={{ gap: 12, marginTop: 10 }}>
        {items.map((b, i) => (
          <View key={b} style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ width: 28, height: 28, borderRadius: 10, backgroundColor: c.edge, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: FONT.bold, fontSize: 13, color: c.ink }}>{i + 1}</Text>
            </View>
            <Text style={{ flex: 1, fontFamily: FONT.regular, fontSize: 16, lineHeight: 23, color: t.ink }}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function FetalDevelopmentScreen() {
  const router = useRouter();
  const t = useTokens();
  const mint = useTone("mint");
  const butter = useTone("butter");
  const { profile } = useUserProfile() as any;
  const p = useMemo(
    () => pregnancyFor(profile),
    [profile?.pregnancyWeeks, profile?.pregnancyReferenceDate, profile?.pregnancyStatus],
  );
  const current = p ? Math.min(Math.max(p.week, MIN_WEEK), MAX_WEEK) : null;

  const [week, setWeek] = useState<number>(current ?? 12);
  useEffect(() => {
    if (current) setWeek(current);
  }, [current]);

  const strip = useRef<ScrollView>(null);
  useEffect(() => {
    const x = Math.max(0, (week - MIN_WEEK) * PILL - 140);
    strip.current?.scrollTo({ x, animated: true });
  }, [week]);

  const data = getWeekData(week);
  const isNow = current === week;

  if (profile && pregnancyStatusOf(profile) !== "ONGOING") {
    // Not pregnant any more: no baby-size pages, especially after a loss.
    return (
      <Page>
        <RoundButton icon="arrow-back" label={tr({ en: "Back", pcm: "Go back", yo: "Padà" })} onPress={() => router.back()} />
        <T>
          {tr({
            en: "Week-by-week baby updates are switched off because you told us your pregnancy has ended.",
            pcm: "We don off the week-by-week baby update because you tell us say your pregnancy don end.",
            yo: "A ti pa ìròyìn ọmọ ọ̀sẹ̀ dé ọ̀sẹ̀ nítorí o sọ fún wa pé oyún rẹ ti parí.",
          })}
        </T>
      </Page>
    );
  }

  return (
    <Page>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <RoundButton icon="arrow-back" label={tr({ en: "Back", pcm: "Go back", yo: "Padà" })} onPress={() => router.back()} />
        <Text accessibilityRole="header" style={{ flexShrink: 1, fontFamily: FONT.bold, fontSize: 22, color: t.ink }}>
          {tr({ en: "Your baby, week by week", pcm: "Your pikin, week by week", yo: "Ọmọ rẹ, ọ̀sẹ̀ dé ọ̀sẹ̀" })}
        </Text>
      </View>

      <ScrollView
        ref={strip}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        accessibilityLabel={tr({ en: "Choose a week", pcm: "Choose week", yo: "Yan ọ̀sẹ̀ kan" })}
      >
        {WEEKS.map((w) => {
          const on = w === week;
          return (
            <Pressable
              key={w}
              onPress={() => setWeek(w)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={{
                width: 54,
                height: 66,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: on ? t.green : t.border,
                backgroundColor: on ? t.green : t.surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: FONT.semibold, fontSize: 11, color: on ? "#E3F2EC" : t.muted }}>
                {w === current ? tr({ en: "Now", pcm: "Now", yo: "Báyìí" }) : tr({ en: "Week", pcm: "Week", yo: "Ọ̀sẹ̀" })}
              </Text>
              <Text style={{ fontFamily: FONT.bold, fontSize: 20, color: on ? "#FFFFFF" : t.ink }}>{w}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {week >= MAX_WEEK - 1 ? (
        <View style={{ flexDirection: "row", gap: 12, padding: 16, borderRadius: 22, backgroundColor: t.amberBg }}>
          <Ionicons name="alert-circle-outline" size={22} color={t.amberInk} />
          <Text style={{ flex: 1, fontFamily: FONT.semibold, fontSize: 16, lineHeight: 23, color: t.amberInk }}>
            {tr({
              en: "Past 41 weeks your clinic will want to see you. If you haven't spoken to them, contact them today.",
              pcm: "After 41 weeks your clinic go wan see you. If you never talk to them, call them today.",
              yo: "Lẹ́yìn ọ̀sẹ̀ 41 kílíníìkì rẹ yóò fẹ́ rí ọ. Tí o kò bá tíì bá wọn sọ̀rọ̀, kàn sí wọn lónìí.",
            })}
          </Text>
        </View>
      ) : null}

      {data ? (
        <>
          <View accessibilityLiveRegion="polite" style={{ borderRadius: 36, padding: 22, paddingBottom: 24, alignItems: "center", backgroundColor: mint.bg }}>
            <WeekRing progress={Math.min(1, week / 40)}>
              <FruitArt kind={fruitFor(data.size)} size={128} bob />
            </WeekRing>
            <Kicker color={mint.ink}>
              {isNow ? tr({ en: "You are here", pcm: "You dey here", yo: "O wà níbí" }) : tr({ en: `Week ${week}`, pcm: `Week ${week}`, yo: `Ọ̀sẹ̀ ${week}` })}
            </Kicker>
            <Text style={{ fontFamily: FONT.bold, fontSize: 26, lineHeight: 30, color: t.ink, textAlign: "center", marginTop: 6 }}>
              {tr({ en: `About the size of ${aSize(data.size)}`, pcm: `Size of ${data.size}`, yo: `Ó tó ${data.size}` })}
            </Text>
            <Text style={{ fontFamily: FONT.regular, fontSize: 15, lineHeight: 21, color: mint.ink, textAlign: "center", marginTop: 8 }}>{data.headline}</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              [data.weight, tr({ en: "Weight", pcm: "Weight", yo: "Ìwúwo" })],
              [data.length, tr({ en: "Length", pcm: "Length", yo: "Gígùn" })],
              ...(isNow && p && p.daysToGo >= 0 ? [[String(p.daysToGo), tr({ en: "Days to go", pcm: "Days remain", yo: "Ọjọ́ tó kù" })]] : []),
            ].map(([v, l]) => (
              <View key={l} style={{ flex: 1, padding: 12, paddingHorizontal: 8, borderRadius: 20, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface, alignItems: "center" }}>
                <Text style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink }}>{v}</Text>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 12, color: t.muted }}>{l}</Text>
              </View>
            ))}
          </View>

          <Facts title={tr({ en: "Baby this week", pcm: "Pikin this week", yo: "Ọmọ ní ọ̀sẹ̀ yìí" })} items={data.babyDevelopment} tone="lavender" art="baby" />
          <Facts title={tr({ en: "Your body this week", pcm: "Your body this week", yo: "Ara rẹ ní ọ̀sẹ̀ yìí" })} items={data.motherChanges} tone="peach" art="mama" />

          <View style={{ flexDirection: "row", gap: 12, padding: 18, borderRadius: 28, backgroundColor: butter.bg }}>
            <Ionicons name="bulb-outline" size={24} color={butter.ink} />
            <View style={{ flex: 1 }}>
              <Kicker color={butter.ink}>{tr({ en: "Tip for this week", pcm: "Tip for this week", yo: "Ìmọ̀ràn ọ̀sẹ̀ yìí" })}</Kicker>
              <Text style={{ fontFamily: FONT.regular, fontSize: 16, lineHeight: 24, color: t.ink, marginTop: 4 }}>{data.tip}</Text>
            </View>
          </View>
        </>
      ) : null}

      <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink, marginTop: 8 }}>
        {tr({ en: "How baby grows", pcm: "How pikin dey grow", yo: "Bí ọmọ ṣe ń dàgbà" })}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, rowGap: 12 }}>
        {JOURNEY.map((s) => {
          const on = getWeekData(week)?.week === s.week;
          const later = !!current && s.week > current;
          return (
            <Pressable
              key={s.week}
              onPress={() => setWeek(s.week)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={{ width: 58, alignItems: "center", gap: 4, opacity: later ? 0.5 : 1 }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: on ? 2 : 1,
                  borderColor: on ? t.green : t.border,
                  backgroundColor: on ? t.mint : t.surface,
                }}
              >
                <FruitArt kind={s.kind} size={42} />
              </View>
              <Text style={{ fontFamily: FONT.bold, fontSize: 12, color: on ? t.greenInk : t.muted }}>
                {tr({ en: `Wk ${s.week}`, pcm: `Wk ${s.week}`, yo: `Ọ̀sẹ̀ ${s.week}` })}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <DangerCard
        title={tr({ en: "Danger signs in pregnancy", pcm: "Danger signs for pregnancy", yo: "Àwọn àmì ewu nínú oyún" })}
        sub={tr({ en: "Know when to go straight away", pcm: "Know when to go sharp sharp", yo: "Mọ ìgbà tí o gbọ́dọ̀ lọ lẹ́sẹ̀kẹsẹ̀" })}
        onPress={() => router.push("/education/danger-signs")}
      />

      <T variant="small" style={{ textAlign: "center" }}>
        {tr({
          en: "Sizes are averages. Every baby grows at their own pace; your clinic checks your baby's growth at each visit.",
          pcm: "Na average size be this. Every pikin dey grow for their own pace; your clinic dey check am every visit.",
          yo: "Ìwọ̀n àpapọ̀ ni wọ̀nyí. Ọmọ kọ̀ọ̀kan ń dàgbà ní ìwọ̀n tirẹ̀; kílíníìkì rẹ ń wò ó ní ìbẹ̀wò kọ̀ọ̀kan.",
        })}
      </T>
    </Page>
  );
}
