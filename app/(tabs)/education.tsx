import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

import { FONT, Page, Pressable, T, useTokens } from "../../components/ds";
import { DangerCard, Kicker, LanguageSwitch, RoundButton, Spot, useTone } from "../../components/learn/LearnBits";
import { FruitArt } from "../../components/pregnancy/PregnancyHero";
import { getArticleById, type EducationArticle, type EducationCategory } from "../../constants/education";
import { getWeekData } from "../../constants/fetal-development";
import { useLang } from "../../hooks/useLang";
import { useReadGuides } from "../../hooks/useReadGuides";
import { useUserProfile } from "../../hooks/useUserProfile";
import { categoryLabel } from "../../services/educationLabels";
import { tr } from "../../services/i18n";
import {
  articleArt,
  articleText,
  articleTone,
  greeting,
  guidesCount,
  pickedForWeek,
  readTime,
  searchArticles,
  TILE_TOPICS,
  TOPIC_THEME,
  topicArticles,
} from "../../services/learnTheme";
import { fruitFor, pregnancyOnDate } from "../../services/pregnancy/pregnancyDay";

// Same screen as maternalert-web/src/app/(patient)/education/page.tsx

export default function EducationScreen() {
  const router = useRouter();
  const t = useTokens();
  const lang = useLang();
  const { profile } = useUserProfile() as any;
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const mint = useTone("mint");

  const p = useMemo(
    () => pregnancyOnDate(profile?.pregnancyWeeks, profile?.pregnancyReferenceDate),
    [profile?.pregnancyWeeks, profile?.pregnancyReferenceDate],
  );
  // About two weeks past the due date she has most likely had her baby.
  const pregnant = !!p && p.week >= 4 && p.daysToGo > -14;
  const week = pregnant ? p!.week : null;
  const data = week ? getWeekData(week) : null;
  const picks = useMemo(() => pickedForWeek(week), [week]);
  const results = useMemo(() => searchArticles(query, lang), [query, lang]);
  const danger = getArticleById("danger-signs");

  return (
    <Page>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flexShrink: 1 }}>
          <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: t.muted }}>{greeting(profile?.fullName)}</Text>
          <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 34, letterSpacing: -0.6, color: t.ink }}>
            {tr({ en: "Learn", pcm: "Learn", yo: "Kẹ́kọ̀ọ́" })}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
          <RoundButton
            icon="globe-outline"
            text={lang === "pcm" ? "PCM" : lang === "yo" ? "YO" : "EN"}
            label={tr({ en: "Change language", pcm: "Change language", yo: "Yí èdè padà" })}
            onPress={() => setShowLang((v) => !v)}
          />
          <RoundButton
            icon={searching ? "close" : "search"}
            label={tr({ en: "Search guides", pcm: "Search guide", yo: "Wá ìtọ́sọ́nà" })}
            onPress={() => {
              setSearching((v) => !v);
              setQuery("");
            }}
          />
        </View>
      </View>

      {showLang ? <LanguageSwitch /> : null}

      {searching ? (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              height: 52,
              paddingHorizontal: 16,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: t.borderStrong,
              backgroundColor: t.surface,
            }}
          >
            <Ionicons name="search" size={18} color={t.muted} />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder={tr({ en: "Try “headache” or “food”", pcm: "Try “headache” or “food”", yo: "Gbìyànjú “ẹ̀fọ́rí” tàbí “oúnjẹ”" })}
              placeholderTextColor={t.muted}
              accessibilityLabel={tr({ en: "Search guides", pcm: "Search guide", yo: "Wá ìtọ́sọ́nà" })}
              returnKeyType="search"
              style={{ flex: 1, fontFamily: FONT.regular, fontSize: 16, color: t.ink }}
            />
          </View>
          {query.trim() ? (
            results.length ? (
              <View style={{ gap: 10 }}>
                {results.map((a) => (
                  <GuideRow key={a.id} a={a} />
                ))}
              </View>
            ) : (
              <T variant="small" style={{ textAlign: "center" }}>
                {tr({ en: "No guides match that yet.", pcm: "No guide match am.", yo: "Kò sí ìtọ́sọ́nà tó bá a mu." })}
              </T>
            )
          ) : null}
        </>
      ) : (
        <>
          {pregnant && data ? (
            <Pressable
              onPress={() => router.push("/fetal-development")}
              accessibilityRole="link"
              style={({ pressed }) => ({
                minHeight: 212,
                padding: 20,
                borderRadius: 32,
                overflow: "hidden",
                backgroundColor: mint.bg,
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <View style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, borderRadius: 110, backgroundColor: mint.edge }} />
              <View style={{ position: "absolute", right: 6, top: 22 }}>
                <FruitArt kind={fruitFor(data.size)} size={160} bob />
              </View>
              <View style={{ maxWidth: "58%" }}>
                <View style={{ alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: t.surface }}>
                  <Text style={{ fontFamily: FONT.bold, fontSize: 12, color: mint.ink }}>{tr({ en: `Week ${week}`, pcm: `Week ${week}`, yo: `Ọ̀sẹ̀ ${week}` })}</Text>
                </View>
                <Text style={{ fontFamily: FONT.bold, fontSize: 25, lineHeight: 29, color: t.ink, marginTop: 14 }}>
                  {tr({ en: `Baby is about the size of a ${data.size}`, pcm: `Pikin don reach size of ${data.size}`, yo: `Ọmọ ti tó ${data.size}` })}
                </Text>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 14, color: mint.ink, marginTop: 10 }}>
                  {data.weight} · {data.length}
                </Text>
                <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, minHeight: 44, paddingHorizontal: 18, borderRadius: 999, backgroundColor: t.green }}>
                  <Text style={{ fontFamily: FONT.bold, fontSize: 15, color: "#FFFFFF" }}>{tr({ en: "See this week", pcm: "See this week", yo: "Wo ọ̀sẹ̀ yìí" })}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </View>
              </View>
            </Pressable>
          ) : null}

          {danger ? <DangerCard title={articleText(danger, lang).title} onPress={() => router.push("/education/danger-signs")} /> : null}

          <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink, marginTop: 8 }}>
            {week
              ? tr({ en: `Picked for week ${week}`, pcm: `For your week ${week}`, yo: `Fún ọ̀sẹ̀ ${week}` })
              : tr({ en: "Picked for you", pcm: "For you", yo: "Fún ọ" })}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {picks.map((a) => (
              <PickCard key={a.id} a={a} />
            ))}
          </ScrollView>

          <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink, marginTop: 8 }}>
            {tr({ en: "Topics", pcm: "Topics", yo: "Àwọn àkòrí" })}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {TILE_TOPICS.map((c) => (
              <TopicTile key={c} c={c} />
            ))}
          </View>
        </>
      )}

      <T variant="small" style={{ textAlign: "center" }}>
        {tr({
          en: "Based on World Health Organization guidance. Learn helps you understand; it does not replace your clinic.",
          pcm: "E base on World Health Organization guide. Learn go help you understand; e no fit replace your clinic.",
          yo: "Ó dá lórí ìtọ́sọ́nà Àjọ Ìlera Àgbáyé. Kẹ́kọ̀ọ́ ń ràn ọ́ lọ́wọ́ láti lóye; kò rọ́pò kílíníìkì rẹ.",
        })}
      </T>
    </Page>
  );
}

function PickCard({ a }: { a: EducationArticle }) {
  const router = useRouter();
  const t = useTokens();
  const lang = useLang();
  const { isRead } = useReadGuides();
  const c = useTone(articleTone(a));
  return (
    <Pressable
      onPress={() => router.push(`/education/${a.id}`)}
      accessibilityRole="link"
      style={({ pressed }) => ({ width: 210, minHeight: 256, padding: 18, borderRadius: 28, backgroundColor: c.bg, opacity: pressed ? 0.92 : 1 })}
    >
      <Kicker color={c.ink}>{readTime(a.readTimeMinutes)}</Kicker>
      <Spot art={articleArt(a)} size={104} style={{ alignSelf: "center", marginTop: 8, marginBottom: 10 }} />
      <Text style={{ fontFamily: FONT.bold, fontSize: 18, lineHeight: 22, color: t.ink }}>{articleText(a, lang).title}</Text>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingTop: 8 }}>
        {isRead(a.id) ? <Ionicons name="checkmark" size={14} color={c.ink} /> : null}
        <Text style={{ fontFamily: FONT.semibold, fontSize: 13, color: c.ink }}>
          {isRead(a.id) ? tr({ en: "Read", pcm: "You don read am", yo: "O ti kà á" }) : categoryLabel(a.category)}
        </Text>
      </View>
    </Pressable>
  );
}

function TopicTile({ c }: { c: EducationCategory }) {
  const router = useRouter();
  const t = useTokens();
  const { isRead } = useReadGuides();
  const tone = useTone(TOPIC_THEME[c].tone);
  const list = topicArticles(c);
  const done = list.every((a) => isRead(a.id));
  return (
    <Pressable
      onPress={() => router.push(`/education/topic/${c.toLowerCase()}`)}
      accessibilityRole="link"
      accessibilityLabel={`${categoryLabel(c)}, ${guidesCount(list.length)}`}
      style={({ pressed }) => ({
        flexBasis: "47%",
        flexGrow: 1,
        height: 150,
        padding: 14,
        borderRadius: 24,
        overflow: "hidden",
        justifyContent: "space-between",
        backgroundColor: tone.bg,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <Spot art={TOPIC_THEME[c].art} size={88} style={{ position: "absolute", right: -6, bottom: -8 }} />
      <Text style={{ fontFamily: FONT.bold, fontSize: 16, lineHeight: 20, color: t.ink, maxWidth: 120 }}>{categoryLabel(c)}</Text>
      <Text style={{ fontFamily: FONT.bold, fontSize: 12, color: tone.ink }}>{guidesCount(list.length)}</Text>
      {done ? (
        <View style={{ position: "absolute", top: 12, right: 12, width: 26, height: 26, borderRadius: 13, backgroundColor: t.green, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="checkmark" size={15} color="#FFFFFF" />
        </View>
      ) : null}
    </Pressable>
  );
}

function GuideRow({ a }: { a: EducationArticle }) {
  const router = useRouter();
  const t = useTokens();
  const lang = useLang();
  const { isRead } = useReadGuides();
  const c = useTone(articleTone(a));
  const text = articleText(a, lang);
  return (
    <Pressable
      onPress={() => router.push(`/education/${a.id}`)}
      accessibilityRole="link"
      style={({ pressed }) => ({
        flexDirection: "row",
        gap: 14,
        padding: 14,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: pressed ? t.surface2 : t.surface,
      })}
    >
      <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
        <Spot art={articleArt(a)} size={44} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONT.bold, fontSize: 17, lineHeight: 21, color: t.ink }}>{text.title}</Text>
        <Text style={{ fontFamily: FONT.regular, fontSize: 14, lineHeight: 20, color: t.muted, marginTop: 4 }}>{text.summary}</Text>
        <Text style={{ fontFamily: FONT.bold, fontSize: 12, color: isRead(a.id) ? t.greenInk : t.muted, marginTop: 8 }}>
          {isRead(a.id) ? "✓ " : ""}
          {categoryLabel(a.category)} · {readTime(a.readTimeMinutes)}
        </Text>
      </View>
    </Pressable>
  );
}
