import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, Share, Text, View } from "react-native";

import apiClient from "../../api/client";
import { Button, FONT, Page, Pressable, T, useTokens } from "../../components/ds";
import { GuideBlock, Kicker, LanguageSwitch, RoundButton, Spot, useTone } from "../../components/learn/LearnBits";
import { articleToText, getArticleById } from "../../constants/education";
import { useLang } from "../../hooks/useLang";
import { markGuideRead } from "../../hooks/useReadGuides";
import { categoryLabel } from "../../services/educationLabels";
import { tr } from "../../services/i18n";
import { articleArt, articleText, articleTone, readTime, topicArticles } from "../../services/learnTheme";
import { tx } from "../../services/pidgin";

// Same screen as maternalert-web/src/app/(patient)/education/[id]/page.tsx

export default function ArticleScreen() {
  const router = useRouter();
  const t = useTokens();
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = id ? getArticleById(Array.isArray(id) ? id[0] : id) : undefined;
  const lang = useLang();
  const [helpful, setHelpful] = useState<null | "yes" | "no">(null);
  const toneName = article ? (article.urgent ? "rose" : articleTone(article)) : "mint";
  const tone = useTone(toneName);

  useEffect(() => {
    if (article) markGuideRead(article.id);
    setHelpful(null);
  }, [article]);

  if (!article) {
    return (
      <Page>
        <T>{tr({ en: "We couldn't find that guide.", pcm: "We no see that guide.", yo: "A kò rí ìtọ́sọ́nà yẹn." })}</T>
        <Button href="/(tabs)/education">{tr({ en: "See all guides", pcm: "See all guide", yo: "Wo gbogbo ìtọ́sọ́nà" })}</Button>
      </Page>
    );
  }

  const text = articleText(article, lang);
  const [y, m] = article.updated.split("-").map(Number);
  const updated = new Date(y, (m || 1) - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const siblings = topicArticles(article.category);
  const next = siblings[(siblings.findIndex((a) => a.id === article.id) + 1) % siblings.length];
  const nextGuide = next && next.id !== article.id ? next : null;

  const share = () => {
    Share.share({
      title: text.title,
      message: `${text.title}\n\n${articleToText({ ...article, body: text.body })}\n\nMaternAlert: https://maternalert.com.ng`,
    }).catch(() => undefined);
  };

  const notHelpful = () => {
    setHelpful("no");
    // Only the "no" answers are sent: they tell us which guide to fix.
    apiClient
      .post("/feedback", { app: "app", rating: 2, message: `Guide not helpful: ${article.id} (${lang})`, page: `/education/${article.id}` })
      .catch(() => undefined);
  };

  return (
    <Page>
      <View style={{ borderRadius: 32, padding: 16, paddingHorizontal: 20, paddingBottom: 24, overflow: "hidden", backgroundColor: tone.bg, alignItems: "center" }}>
        <View style={{ position: "absolute", top: 54, width: 250, height: 250, borderRadius: 125, backgroundColor: tone.edge }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "stretch" }}>
          <RoundButton bare icon="arrow-back" label={tr({ en: "Back", pcm: "Go back", yo: "Padà" })} onPress={() => router.back()} />
          <RoundButton bare icon="share-social-outline" text={tr({ en: "Share", pcm: "Share", yo: "Pín" })} label={tr({ en: "Share", pcm: "Share", yo: "Pín" })} onPress={share} />
        </View>
        <Spot art={articleArt(article)} size={164} />
        <Kicker color={tone.ink}>
          {categoryLabel(article.category)} · {readTime(article.readTimeMinutes)}
        </Kicker>
        <Text accessibilityRole="header" style={{ fontFamily: FONT.bold, fontSize: 28, lineHeight: 32, color: t.ink, textAlign: "center", marginTop: 8 }}>
          {text.title}
        </Text>
      </View>

      <LanguageSwitch />

      <Text style={{ fontFamily: FONT.medium, fontSize: 18, lineHeight: 27, color: t.ink }}>{text.summary}</Text>

      {text.body.map((b, i) => (
        <GuideBlock key={i} block={b} urgent={!!article.urgent} tone={toneName} />
      ))}

      {article.urgent ? (
        <Button variant="danger" size="lg" block href="/emergency" icon={(c) => <Ionicons name="alert-circle-outline" size={20} color={c} />}>
          {tx("Get emergency help")}
        </Button>
      ) : null}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <Text style={{ fontFamily: FONT.bold, fontSize: 16, color: t.ink }}>{tr({ en: "Was this helpful?", pcm: "This one help you?", yo: "Ṣé èyí wúlò fún ọ?" })}</Text>
        {helpful ? (
          <Text accessibilityLiveRegion="polite" style={{ fontFamily: FONT.semibold, fontSize: 14, color: t.muted }}>
            {helpful === "yes"
              ? tr({ en: "Thank you!", pcm: "Thank you!", yo: "Ẹ ṣé o!" })
              : tr({ en: "Thanks. We'll make it clearer.", pcm: "Thank you. We go make am clear pass.", yo: "Ẹ ṣé. A ó mú un ṣe kedere sí i." })}
          </Text>
        ) : (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <RoundButton icon="thumbs-up-outline" text={tr({ en: "Yes", pcm: "Yes", yo: "Bẹ́ẹ̀ ni" })} label={tr({ en: "Yes", pcm: "Yes", yo: "Bẹ́ẹ̀ ni" })} onPress={() => setHelpful("yes")} />
            <RoundButton icon="thumbs-down-outline" text={tr({ en: "Not really", pcm: "No too much", yo: "Kò fi bẹ́ẹ̀" })} label={tr({ en: "Not really", pcm: "No too much", yo: "Kò fi bẹ́ẹ̀" })} onPress={notHelpful} />
          </View>
        )}
      </View>

      {nextGuide ? <NextGuide id={nextGuide.id} /> : null}

      <View style={{ backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, borderRadius: 20, padding: 16, gap: 8 }}>
        <T variant="label">{tr({ en: "Sources", pcm: "Where we get am", yo: "Orísun" })}</T>
        {article.sources.map((s) => (
          <Pressable key={s.url} onPress={() => Linking.openURL(s.url)} accessibilityRole="link" style={{ minHeight: 32 }}>
            <Text style={{ fontFamily: FONT.medium, fontSize: 15, lineHeight: 21, color: t.greenInk, textDecorationLine: "underline" }}>{s.title}</Text>
          </Pressable>
        ))}
        <T variant="small" style={{ marginTop: 4 }}>
          {tr({
            en: `Updated ${updated}. General information, not a diagnosis. Your health worker knows your situation best.`,
            pcm: `Last update: ${updated}. Na general information, e no be diagnosis. Your health worker sabi your matter pass.`,
            yo: `Àtúnṣe tó kẹ́yìn: ${updated}. Ìmọ̀ gbogbogbò ni, kì í ṣe àyẹ̀wò àìsàn. Òṣìṣẹ́ ìlera rẹ ló mọ ipò rẹ jù.`,
          })}
        </T>
      </View>
    </Page>
  );
}

function NextGuide({ id }: { id: string }) {
  const router = useRouter();
  const lang = useLang();
  const a = getArticleById(id)!;
  const c = useTone(articleTone(a));
  return (
    <Pressable
      onPress={() => router.push(`/education/${a.id}`)}
      accessibilityRole="link"
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 26, backgroundColor: "#0F241C", opacity: pressed ? 0.9 : 1 })}
    >
      <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
        <Spot art={articleArt(a)} size={54} />
      </View>
      <View style={{ flex: 1 }}>
        <Kicker color="#A8D9C4">{tr({ en: "Next guide", pcm: "Next guide", yo: "Ìtọ́sọ́nà tó kàn" })}</Kicker>
        <Text style={{ fontFamily: FONT.bold, fontSize: 17, color: "#FFFFFF", marginTop: 2 }}>{articleText(a, lang).title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
    </Pressable>
  );
}
