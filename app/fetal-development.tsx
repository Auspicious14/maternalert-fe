import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { AppHeader, Banner, Card, FONT, IconButton, Page, T, useTokens } from "../components/ds";
import { getTrimesterLabel, getWeekData } from "../constants/fetal-development";
import { useUserProfile } from "../hooks/useUserProfile";

// Same screen as maternalert-web/src/app/(patient)/fetal-development/page.tsx

const MIN_WEEK = 4;
const MAX_WEEK = 42;

function Bullets({ items }: { items: string[] }) {
  const t = useTokens();
  return (
    <View style={{ gap: 8 }}>
      {items.map((b) => (
        <View key={b} style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.green, marginTop: 10 }} />
          <T style={{ flex: 1 }}>{b}</T>
        </View>
      ))}
    </View>
  );
}

export default function FetalDevelopmentScreen() {
  const router = useRouter();
  const t = useTokens();
  const { profile, pregnancyTimeline } = useUserProfile() as any;
  const current: number | null = pregnancyTimeline?.isValid
    ? pregnancyTimeline.currentWeek
    : typeof profile?.pregnancyWeeks === "number"
      ? profile.pregnancyWeeks
      : null;

  const [week, setWeek] = useState<number>(current ?? 12);
  useEffect(() => {
    if (current) setWeek(Math.min(Math.max(current, MIN_WEEK), MAX_WEEK));
  }, [current]);

  const data = getWeekData(week);
  const isNow = current === week;

  return (
    <Page>
      <AppHeader title="Your baby week by week" onBack={() => router.back()} />

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ opacity: week <= MIN_WEEK ? 0.35 : 1 }}>
          <IconButton label="Previous week" onPress={() => setWeek((w) => Math.max(MIN_WEEK, w - 1))}>
            <Ionicons name="chevron-back" size={22} color={t.ink} />
          </IconButton>
        </View>
        <View style={{ alignItems: "center" }} accessibilityLiveRegion="polite">
          <Text style={{ fontFamily: FONT.bold, fontSize: 24, color: t.ink }}>{`Week ${week}`}</Text>
          <T variant="small">{isNow ? "You are here" : getTrimesterLabel(week)}</T>
        </View>
        <View style={{ opacity: week >= MAX_WEEK ? 0.35 : 1 }}>
          <IconButton label="Next week" onPress={() => setWeek((w) => Math.min(MAX_WEEK, w + 1))}>
            <Ionicons name="chevron-forward" size={22} color={t.ink} />
          </IconButton>
        </View>
      </View>
      {current && !isNow ? (
        <Pressable onPress={() => setWeek(current)} accessibilityRole="button" style={{ alignSelf: "center", minHeight: 44, justifyContent: "center" }}>
          <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>{`Back to this week (${current})`}</Text>
        </Pressable>
      ) : null}

      {week >= MAX_WEEK - 1 ? (
        <Banner tone="amber" icon="warning-outline">
          Past 41 weeks your clinic will want to see you. If you haven't spoken to them, contact them today.
        </Banner>
      ) : null}

      {!data ? (
        <Card>
          <T>Week-by-week information starts at week 4. Come back soon.</T>
        </Card>
      ) : (
        <>
          <View style={{ backgroundColor: t.mint, borderRadius: 24, padding: 20, gap: 6 }}>
            <Text style={{ fontSize: 44, lineHeight: 52 }} accessible={false}>
              {data.sizeEmoji}
            </Text>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", color: t.greenInk }}>
              {`About the size of ${/^[aeiou]/i.test(data.size) ? "an" : "a"} ${data.size}`}
            </Text>
            <Text style={{ fontFamily: FONT.bold, fontSize: 22, lineHeight: 28, color: t.ink }} accessibilityRole="header">
              {data.headline}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24, marginTop: 10 }}>
              {[
                ["Length", data.length],
                ["Weight", data.weight],
                ...(pregnancyTimeline?.isValid && isNow
                  ? [["Due in", `${Math.max(0, pregnancyTimeline.weeksRemaining)} week${pregnancyTimeline.weeksRemaining === 1 ? "" : "s"}`]]
                  : []),
              ].map(([k, v]) => (
                <View key={k}>
                  <T variant="small">{k}</T>
                  <Text style={{ fontFamily: FONT.bold, fontSize: 18, color: t.ink }}>{v}</Text>
                </View>
              ))}
            </View>
          </View>

          <Card>
            <T variant="h2" style={{ marginBottom: 10 }}>
              Your baby
            </T>
            <Bullets items={data.babyDevelopment} />
          </Card>
          <Card>
            <T variant="h2" style={{ marginBottom: 10 }}>
              Your body
            </T>
            <Bullets items={data.motherChanges} />
          </Card>

          <Banner tone="green" icon="bulb-outline">
            {`This week: ${data.tip}`}
          </Banner>
        </>
      )}

      <Pressable
        onPress={() => router.push({ pathname: "/education/[id]", params: { id: "danger-signs" } })}
        accessibilityRole="link"
        style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}
      >
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.redBg, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="warning-outline" size={20} color={t.redInk} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT.semibold, fontSize: 17, color: t.ink }}>Danger signs in pregnancy</Text>
          <T variant="small">Know when to go to a health facility straight away</T>
        </View>
        <Ionicons name="chevron-forward" size={20} color={t.muted} />
      </Pressable>

      <T variant="small" style={{ textAlign: "center" }}>
        Sizes are averages. Every baby grows at their own pace; your clinic checks your baby's growth at each visit.
      </T>
    </Page>
  );
}
