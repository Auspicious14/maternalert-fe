import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { Button, FONT, Page, Pressable, T, useTokens } from "../../../components/ds";
import { Kicker, RoundButton, Spot, useTone } from "../../../components/learn/LearnBits";
import { CATEGORY_LABELS, type EducationCategory } from "../../../constants/education";
import { useLang } from "../../../hooks/useLang";
import { useReadGuides } from "../../../hooks/useReadGuides";
import { categoryLabel } from "../../../services/educationLabels";
import { tr } from "../../../services/i18n";
import { articleText, guidesCount, TOPIC_THEME, topicArticles, topicMinutes } from "../../../services/learnTheme";

// Same screen as maternalert-web/src/app/(patient)/education/topic/[category]/page.tsx

export default function TopicScreen() {
  const router = useRouter();
  const t = useTokens();
  const lang = useLang();
  const { isRead } = useReadGuides();
  const params = useLocalSearchParams<{ category: string }>();
  const raw = String(Array.isArray(params.category) ? params.category[0] : params.category ?? "").toUpperCase();
  const valid = raw in CATEGORY_LABELS;
  const c = (valid ? raw : "PREGNANCY_CARE") as EducationCategory;
  const tone = useTone(TOPIC_THEME[c].tone);

  if (!valid) {
    return (
      <Page>
        <T>{tr({ en: "We couldn't find that topic.", pcm: "We no see that topic.", yo: "A kò rí àkòrí yẹn." })}</T>
        <Button href="/(tabs)/education">{tr({ en: "Back to Learn", pcm: "Go back to Learn", yo: "Padà sí Kẹ́kọ̀ọ́" })}</Button>
      </Page>
    );
  }

  const list = topicArticles(c);
  const done = list.filter((a) => isRead(a.id)).length;
  const nextId = list.find((a) => !isRead(a.id))?.id;
  const mins = topicMinutes(c);

  return (
    <Page>
      <View style={{ borderRadius: 32, padding: 16, paddingHorizontal: 20, paddingBottom: 24, overflow: "hidden", backgroundColor: tone.bg }}>
        <View style={{ position: "absolute", right: -50, top: 20, width: 230, height: 230, borderRadius: 115, backgroundColor: tone.edge }} />
        <Spot art={TOPIC_THEME[c].art} size={148} style={{ position: "absolute", right: 8, top: 64 }} />
        <View style={{ flexDirection: "row" }}>
          <RoundButton bare icon="arrow-back" label={tr({ en: "Back", pcm: "Go back", yo: "Padà" })} onPress={() => router.back()} />
        </View>
        <View style={{ maxWidth: "58%", marginTop: 44, minHeight: 110 }}>
          <Kicker color={tone.ink}>{tr({ en: "Topic", pcm: "Topic", yo: "Àkòrí" })}</Kicker>
          <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 30, lineHeight: 33, color: t.ink, marginTop: 6 }}>
            {categoryLabel(c)}
          </Text>
          <Text style={{ fontFamily: FONT.semibold, fontSize: 14, color: tone.ink, marginTop: 10 }}>
            {guidesCount(list.length)} · {tr({ en: `${mins} min`, pcm: `${mins} min`, yo: `Ìṣẹ́jú ${mins}` })}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT.semibold, fontSize: 13, color: t.muted }}>{tr({ en: "Your progress", pcm: "How far you don go", yo: "Ìlọsíwájú rẹ" })}</Text>
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: list.length, now: done }}
            style={{ height: 8, borderRadius: 99, backgroundColor: tone.bg, marginTop: 8, overflow: "hidden" }}
          >
            <View style={{ width: `${(done / Math.max(1, list.length)) * 100}%` as any, height: "100%", borderRadius: 99, backgroundColor: tone.ink }} />
          </View>
        </View>
        <Text style={{ fontFamily: FONT.bold, fontSize: 16, color: t.ink }}>
          {tr({ en: `${done} of ${list.length}`, pcm: `${done} of ${list.length}`, yo: `${done} nínú ${list.length}` })}
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        {list.map((a, i) => {
          const text = articleText(a, lang);
          const read = isRead(a.id);
          const next = a.id === nextId;
          return (
            <Pressable
              key={a.id}
              onPress={() => router.push(`/education/${a.id}`)}
              accessibilityRole="link"
              style={({ pressed }) => ({
                flexDirection: "row",
                gap: 14,
                padding: 14,
                paddingHorizontal: 16,
                borderRadius: 24,
                borderWidth: next ? 2 : 1,
                borderColor: next ? tone.ink : t.border,
                backgroundColor: pressed ? t.surface2 : t.surface,
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: read ? t.mint : next ? tone.ink : tone.bg,
                }}
              >
                {read ? (
                  <Ionicons name="checkmark" size={18} color={t.greenInk} />
                ) : (
                  <Text style={{ fontFamily: FONT.bold, fontSize: 16, color: next ? t.surface : tone.ink }}>{i + 1}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT.bold, fontSize: 17, lineHeight: 21, color: t.ink }}>{text.title}</Text>
                {next ? <Text style={{ fontFamily: FONT.regular, fontSize: 14, lineHeight: 20, color: t.muted, marginTop: 4 }}>{text.summary}</Text> : null}
                <Text style={{ fontFamily: FONT.bold, fontSize: 12, marginTop: 8, color: read ? t.greenInk : next ? tone.ink : t.muted }}>
                  {read ? tr({ en: "Read", pcm: "You don read am", yo: "O ti kà á" }) + " · " : next ? tr({ en: "Up next", pcm: "Next one", yo: "Èyí tó kàn" }) + " · " : ""}
                  {tr({ en: `${a.readTimeMinutes} min`, pcm: `${a.readTimeMinutes} min`, yo: `Ìṣẹ́jú ${a.readTimeMinutes}` })}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Page>
  );
}
