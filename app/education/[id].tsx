import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, Text, View } from "react-native";

import { AppHeader, Banner, Button, FONT, Page, Pill, T, useTokens } from "../../components/ds";
import { Block, CATEGORY_LABELS, getArticleById } from "../../constants/education";
import { useLang } from "../../hooks/useLang";
import { tx } from "../../services/pidgin";

// Same screen as maternalert-web/src/app/(patient)/education/[id]/page.tsx

function BlockView({ block }: { block: Block }) {
  const t = useTokens();
  switch (block.type) {
    case "h":
      return (
        <T variant="h2" accessibilityRole="header" style={{ marginTop: 10 }}>
          {block.text}
        </T>
      );
    case "p":
      return <T>{block.text}</T>;
    case "list":
      return (
        <View style={{ gap: 8 }}>
          {block.items.map((item) => (
            <View key={item} style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.green, marginTop: 10 }} />
              <T style={{ flex: 1 }}>{item}</T>
            </View>
          ))}
        </View>
      );
    case "alert":
      return <Banner tone={block.tone}>{block.text}</Banner>;
  }
}

export default function ArticleScreen() {
  const router = useRouter();
  const t = useTokens();
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = id ? getArticleById(Array.isArray(id) ? id[0] : id) : undefined;
  const lang = useLang();

  if (!article) {
    return (
      <Page>
        <AppHeader title="Article not found" onBack={() => router.back()} />
        <Button href="/(tabs)/education">See all guides</Button>
      </Page>
    );
  }

  // Pidgin version when there is one.
  const text = lang === "pcm" && article.pcm ? article.pcm : article;
  const [y, m] = article.updated.split("-").map(Number);
  const updated = new Date(y, (m || 1) - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <Page>
      <AppHeader title={CATEGORY_LABELS[article.category]} onBack={() => router.back()} />

      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {article.urgent ? <Pill tone="red">{tx("Important")}</Pill> : null}
        <Pill>{`${article.readTimeMinutes} min read`}</Pill>
      </View>
      <T variant="h1" accessibilityRole="header">
        {text.title}
      </T>
      <T style={{ fontSize: 18, lineHeight: 27, color: t.ink }}>{text.summary}</T>

      {text.body.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}

      {article.urgent ? (
        <Button
          variant="danger"
          size="lg"
          block
          href="/emergency"
          icon={(c) => <Ionicons name="alert-circle-outline" size={20} color={c} />}
        >
          {tx("Get emergency help")}
        </Button>
      ) : null}

      <View style={{ backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, borderRadius: 20, padding: 16, gap: 8 }}>
        <T variant="label">Sources</T>
        {article.sources.map((s) => (
          <Pressable key={s.url} onPress={() => Linking.openURL(s.url)} accessibilityRole="link" style={{ minHeight: 32 }}>
            <Text style={{ fontFamily: FONT.medium, fontSize: 15, lineHeight: 21, color: t.greenInk, textDecorationLine: "underline" }}>
              {s.title}
            </Text>
          </Pressable>
        ))}
        <T variant="small" style={{ marginTop: 4 }}>
          {`Updated ${updated}. General information, not a diagnosis. Your health worker knows your situation best.`}
        </T>
      </View>
    </Page>
  );
}
