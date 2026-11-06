import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from "react-native";

import { getWeekData } from "../../constants/fetal-development";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { tr } from "../../services/i18n";
import type { Insight } from "../../services/pregnancy/dailyInsights";
import { fruitFor, prettyDate, sameDay, weekDays, type FruitKind, type PregnancyDay } from "../../services/pregnancy/pregnancyDay";
import { FONT, Pressable, useTokens } from "../ds";

// Same screens as maternalert-web/src/components/pregnancy/PregnancyHero.tsx.

const FRUITS: Record<FruitKind, any> = {
  seed: require("../../assets/fruits/seed.png"),
  bean: require("../../assets/fruits/bean.png"),
  berry: require("../../assets/fruits/berry.png"),
  grape: require("../../assets/fruits/grape.png"),
  cherry: require("../../assets/fruits/cherry.png"),
  strawberry: require("../../assets/fruits/strawberry.png"),
  lime: require("../../assets/fruits/lime.png"),
  lemon: require("../../assets/fruits/lemon.png"),
  peach: require("../../assets/fruits/peach.png"),
  avocado: require("../../assets/fruits/avocado.png"),
  banana: require("../../assets/fruits/banana.png"),
  aubergine: require("../../assets/fruits/aubergine.png"),
  corn: require("../../assets/fruits/corn.png"),
  coconut: require("../../assets/fruits/coconut.png"),
  melon: require("../../assets/fruits/melon.png"),
  watermelon: require("../../assets/fruits/watermelon.png"),
};

export function FruitArt({ kind, size = 132, bob = false }: { kind: FruitKind; size?: number; bob?: boolean }) {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!bob) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -4, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, y]);
  return (
    <Animated.Image
      source={FRUITS[kind]}
      style={{ width: size, height: size, transform: [{ translateY: y }] }}
      accessibilityIgnoresInvertColors
      accessible={false}
    />
  );
}

const DAY_LETTERS = () => [
  tr({ en: "M", pcm: "M", yo: "Ajé" }),
  tr({ en: "T", pcm: "T", yo: "Ìṣẹ́" }),
  tr({ en: "W", pcm: "W", yo: "Rú" }),
  tr({ en: "T", pcm: "T", yo: "Bọ̀" }),
  tr({ en: "F", pcm: "F", yo: "Ẹtì" }),
  tr({ en: "S", pcm: "S", yo: "Àbá" }),
  tr({ en: "S", pcm: "S", yo: "Àìk" }),
];

export function DayStrip({ selected, onSelect }: { selected: Date; onSelect: (d: Date) => void }) {
  const t = useTokens();
  const today = new Date();
  const letters = DAY_LETTERS();
  return (
    <View style={styles.strip} accessibilityRole="tablist">
      {weekDays(today).map((d, i) => {
        const isToday = sameDay(d, today);
        const on = sameDay(d, selected);
        return (
          <Pressable
            key={d.toISOString()}
            onPress={() => onSelect(d)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={styles.day}
          >
            <Text numberOfLines={1} style={[styles.dayLabel, { color: isToday ? t.ink : t.muted }]}>
              {isToday ? tr({ en: "TODAY", pcm: "TODAY", yo: "ÒNÍ" }) : letters[i]}
            </Text>
            <View
              style={[
                styles.dayNum,
                on && { backgroundColor: t.surface, borderWidth: 2, borderColor: t.green, shadowColor: t.green, shadowOpacity: 0.18, shadowRadius: 8, elevation: 3 },
              ]}
            >
              <Text style={{ fontFamily: FONT.semibold, fontSize: 17, color: isToday || on ? t.green : t.ink }}>{d.getDate()}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/** 40 dots around the fruit: one per week, filled up to now. */
export function WeekRing({ progress, children }: { progress: number; children: React.ReactNode }) {
  const t = useTokens();
  const size = 196;
  const r = 90;
  const filled = Math.round(progress * 40);
  return (
    <View style={{ width: size, height: size, marginBottom: 6 }}>
      {Array.from({ length: 40 }, (_, i) => {
        const a = (i / 40) * 2 * Math.PI - Math.PI / 2;
        const on = i < filled;
        const d = on ? 9 : 7;
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              width: d,
              height: d,
              borderRadius: d / 2,
              left: size / 2 + r * Math.cos(a) - d / 2,
              top: size / 2 + r * Math.sin(a) - d / 2,
              backgroundColor: on ? t.green : "rgba(14,124,90,0.15)",
            }}
          />
        );
      })}
      <View style={[styles.ringInner, { backgroundColor: "#FFFFFF" }]}>{children}</View>
    </View>
  );
}

export function PregnancyHero({ p, isToday }: { p: PregnancyDay; isToday: boolean }) {
  const t = useTokens();
  const router = useRouter();
  const dark = useColorScheme() === "dark";
  const data = getWeekData(Math.max(4, p.week));
  const weekLine = tr({
    en: `Week ${p.week}${p.day ? `, day ${p.day}` : ""}`,
    pcm: `Week ${p.week}${p.day ? `, day ${p.day}` : ""}`,
    yo: `Ọ̀sẹ̀ ${p.week}${p.day ? `, ọjọ́ ${p.day}` : ""}`,
  });
  const headline =
    p.daysToGo > 1
      ? tr({ en: `Baby due in ${p.daysToGo} days`, pcm: `Pikin go come in ${p.daysToGo} days`, yo: `Ọmọ yóò dé ní ọjọ́ ${p.daysToGo}` })
      : p.daysToGo === 1
        ? tr({ en: "Baby due tomorrow", pcm: "Pikin fit come tomorrow", yo: "Ọmọ lè dé lọ́la" })
        : p.daysToGo === 0
          ? tr({ en: "Your due date is today", pcm: "Today na your due date", yo: "Òní ni ọjọ́ ìbí rẹ" })
          : tr({ en: `${-p.daysToGo} days past your due date`, pcm: `Due date don pass by ${-p.daysToGo} days`, yo: `Ọjọ́ ìbí ti kọjá ní ọjọ́ ${-p.daysToGo}` });

  return (
    <Pressable
      onPress={() => router.push("/(tabs)/tracking")}
      accessibilityRole="button"
      accessibilityLabel={`${headline}. ${weekLine}.`}
      style={[styles.heroWrap, { borderColor: t.border }]}
    >
      <LinearGradient colors={dark ? ["#173A2E", "#2A2320"] : ["#E3F2EC", "#FDEFE6"]} style={styles.hero}>
        <View style={[styles.cloud, { top: 26, left: 18, opacity: dark ? 0.06 : 0.75 }]} />
        <View style={[styles.cloud, { top: 46, right: 22, width: 56, opacity: dark ? 0.06 : 0.75 }]} />
        <WeekRing progress={p.progress}>
          <FruitArt kind={fruitFor(data?.size)} size={132} bob />
        </WeekRing>
        <Text style={[styles.kicker, { color: t.greenInk }]}>
          {isToday ? weekLine : `${p.date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} · ${weekLine}`}
        </Text>
        <Text style={[styles.title, { color: dark ? "#6FD3A9" : t.green }]}>{headline}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
          <Text style={{ fontFamily: FONT.regular, fontSize: 15, color: t.ink2, textAlign: "center", flexShrink: 1 }}>
            {tr({ en: "Due", pcm: "Due", yo: "Ọjọ́ ìbí" })} {prettyDate(p.dueDate)}
            {data ? ` · ${tr({ en: `size of a ${data.size}`, pcm: `size of ${data.size}`, yo: `bí ${data.size}` })}` : ""}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={t.ink2} />
        </View>
        {p.daysToGo < 0 ? (
          <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.amberInk, marginTop: 8, textAlign: "center" }}>
            {tr({
              en: "Stay in close touch with your clinic until baby arrives.",
              pcm: "Dey in touch with your clinic well well until pikin come.",
              yo: "Máa bá kílíníìkì rẹ sọ̀rọ̀ déédéé títí ọmọ yóò fi dé.",
            })}
          </Text>
        ) : null}
      </LinearGradient>
    </Pressable>
  );
}

const TONES = {
  light: {
    mint: ["#E3F2EC", "#C5E6D7", "#0A5C43"],
    peach: ["#FDE9DF", "#F8D2C0", "#9A3F1F"],
    lavender: ["#EEE8FB", "#DCD2F6", "#5B3FA8"],
    sky: ["#E2F1FB", "#C7E3F5", "#1D5F8A"],
    butter: ["#FFF4D6", "#F7E3A6", "#7A5200"],
    rose: ["#FDE6E7", "#F7CDD0", "#A82A31"],
  },
  dark: {
    mint: ["#13261E", "#2C6B55", "#6FD3A9"],
    peach: ["#13261E", "#7A4A36", "#F5B79B"],
    lavender: ["#13261E", "#554684", "#C7B8F5"],
    sky: ["#13261E", "#2F5B78", "#9CCFF0"],
    butter: ["#13261E", "#6F5A22", "#F5D27A"],
    rose: ["#13261E", "#7A3438", "#FF9A9F"],
  },
} as const;

const ICON: Record<NonNullable<Insight["icon"]>, keyof typeof Ionicons.glyphMap> = {
  heart: "heart-outline",
  body: "body-outline",
  bulb: "bulb-outline",
  pulse: "pulse-outline",
  alert: "warning-outline",
  spark: "sparkles-outline",
};

export function DailyInsights({ items, label }: { items: Insight[]; label: string }) {
  const t = useTokens();
  const router = useRouter();
  const mode = useColorScheme() === "dark" ? "dark" : "light";
  const route = (href: string) => (href === "/tracking" ? "/(tabs)/tracking" : href === "/education" ? "/(tabs)/education" : href);
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink }} accessibilityRole="header">
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 8 }} snapToInterval={180} decelerationRate="fast">
        {items.map((c) => {
          const [bg, edge, ink] = TONES[mode][c.tone];
          return (
            <Pressable
              key={c.id}
              onPress={() => router.push(route(c.href) as any)}
              accessibilityRole="link"
              accessibilityLabel={`${c.kicker}. ${c.title}. ${c.cta}`}
              style={({ pressed }) => [styles.insight, { backgroundColor: bg, borderColor: edge, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
            >
              <Text style={[styles.insightKicker, { color: ink }]}>{c.kicker.toUpperCase()}</Text>
              <View style={[styles.insightArt, { backgroundColor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)" }]}>
                {c.fruit ? <FruitArt kind={c.fruit} size={60} /> : <Ionicons name={ICON[c.icon ?? "spark"]} size={26} color={ink} />}
              </View>
              <Text numberOfLines={4} style={[styles.insightTitle, { color: t.ink }]}>
                {c.title}
              </Text>
              {c.body ? <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: t.ink2 }}>{c.body}</Text> : null}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 2, marginTop: "auto" }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 13, color: ink, flexShrink: 1 }}>{c.cta}</Text>
                <Ionicons name="chevron-forward" size={14} color={ink} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/** Tracking tab: days to go, due date, trimester progress. */
export function PregnancyProgressCard({ p }: { p: PregnancyDay }) {
  const t = useTokens();
  const router = useRouter();
  const dark = useColorScheme() === "dark";
  const data = getWeekData(Math.max(4, p.week));
  const pct = Math.round(p.progress * 100);
  const tri = [
    tr({ en: "1st trimester", pcm: "1st trimester", yo: "Ìpele 1" }),
    tr({ en: "2nd trimester", pcm: "2nd trimester", yo: "Ìpele 2" }),
    tr({ en: "3rd trimester", pcm: "3rd trimester", yo: "Ìpele 3" }),
  ];
  return (
    <LinearGradient colors={dark ? ["#173A2E", "#2A2320"] : ["#E3F2EC", "#FDEFE6"]} style={[styles.card, { borderColor: t.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 999, padding: 6 }}>
          <FruitArt kind={fruitFor(data?.size)} size={80} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { color: t.greenInk, textAlign: "left" }]}>
            {tr({ en: `Week ${p.week}, day ${p.day}`, pcm: `Week ${p.week}, day ${p.day}`, yo: `Ọ̀sẹ̀ ${p.week}, ọjọ́ ${p.day}` })} · {tri[p.trimester - 1]}
          </Text>
          <Text style={{ fontFamily: FONT.bold, fontSize: 26, color: dark ? "#6FD3A9" : t.green, marginVertical: 2 }}>
            {p.daysToGo >= 0
              ? tr({ en: `${p.daysToGo} days to go`, pcm: `${p.daysToGo} days remain`, yo: `Ọjọ́ ${p.daysToGo} ló kù` })
              : tr({ en: `${-p.daysToGo} days past due`, pcm: `${-p.daysToGo} days pass due date`, yo: `Ọjọ́ ${-p.daysToGo} ti kọjá` })}
          </Text>
          <Text style={{ fontFamily: FONT.regular, fontSize: 14, color: t.ink2 }}>
            {tr({ en: "Estimated due date", pcm: "Due date (estimate)", yo: "Ọjọ́ ìbí (àfojúsùn)" })}:{" "}
            <Text style={{ fontFamily: FONT.semibold }}>{prettyDate(p.dueDate)}</Text>
          </Text>
        </View>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: pct }}
        style={{ height: 12, borderRadius: 999, backgroundColor: "rgba(14,124,90,0.14)", marginTop: 16, overflow: "hidden" }}
      >
        <View style={{ width: `${pct}%`, height: "100%", backgroundColor: t.green, borderRadius: 999 }} />
        <View style={{ position: "absolute", left: `${(13 / 40) * 100}%`, top: 0, bottom: 0, width: 2, backgroundColor: "rgba(255,255,255,0.9)" }} />
        <View style={{ position: "absolute", left: `${(28 / 40) * 100}%`, top: 0, bottom: 0, width: 2, backgroundColor: "rgba(255,255,255,0.9)" }} />
      </View>
      <View style={{ flexDirection: "row", marginTop: 6 }}>
        <Text style={[styles.tri, { color: t.muted, flex: 13 }]}>{tri[0]}</Text>
        <Text style={[styles.tri, { color: t.muted, flex: 15, textAlign: "center" }]}>{tri[1]}</Text>
        <Text style={[styles.tri, { color: t.muted, flex: 12, textAlign: "right" }]}>{tri[2]}</Text>
      </View>
      <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: t.muted, marginTop: 10 }}>
        {tr({
          en: "Worked out from the weeks you entered. Your clinic's scan date is more accurate; if it's different, update your weeks in Profile.",
          pcm: "We calculate am from the weeks wey you put. Your clinic scan date correct pass; if e different, change your weeks for Profile.",
          yo: "A ṣírò rẹ̀ láti inú ọ̀sẹ̀ tí o tẹ̀. Ọjọ́ tí scan kílíníìkì rẹ fún ọ péye jù; tí ó bá yàtọ̀, ṣe àtúnṣe ọ̀sẹ̀ rẹ ní Profile.",
        })}{" "}
        <Text onPress={() => router.push("/(tabs)/profile")} style={{ color: t.greenInk, fontFamily: FONT.semibold, textDecorationLine: "underline" }}>
          {tr({ en: "Update", pcm: "Change am", yo: "Ṣe àtúnṣe" })}
        </Text>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: "row", justifyContent: "space-between" },
  day: { flex: 1, alignItems: "center", gap: 6, paddingVertical: 4 },
  dayLabel: { fontFamily: FONT.semibold, fontSize: 11, letterSpacing: 0.4 },
  dayNum: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  heroWrap: { borderRadius: 28, borderWidth: 1, overflow: "hidden" },
  hero: { alignItems: "center", paddingTop: 22, paddingBottom: 20, paddingHorizontal: 18, gap: 4 },
  cloud: { position: "absolute", width: 70, height: 22, borderRadius: 999, backgroundColor: "#FFFFFF" },
  ringInner: { position: "absolute", left: 22, top: 22, right: 22, bottom: 22, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  kicker: { fontFamily: FONT.semibold, fontSize: 14, textAlign: "center" },
  title: { fontFamily: FONT.bold, fontSize: 30, lineHeight: 34, letterSpacing: -0.5, textAlign: "center" },
  insight: { width: 168, minHeight: 228, padding: 14, borderRadius: 22, borderWidth: 1.5, gap: 8 },
  insightKicker: { fontFamily: FONT.bold, fontSize: 12, letterSpacing: 0.4 },
  insightArt: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  insightTitle: { fontFamily: FONT.semibold, fontSize: 15, lineHeight: 20 },
  card: { padding: 18, borderRadius: 24, borderWidth: 1 },
  tri: { fontFamily: FONT.regular, fontSize: 12 },
});
