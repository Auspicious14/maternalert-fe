import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AppHeader, FONT, Page, T, useTokens } from "../../components/ds";
import {
  CATEGORY_LABELS,
  EducationArticle,
  EducationCategory,
  getSortedArticles,
} from "../../constants/education";
import { useLang } from "../../hooks/useLang";
import { useUserProfile } from "../../hooks/useUserProfile";

// Same screen as maternalert-web/src/app/(patient)/education/page.tsx

const CATEGORIES = Object.keys(CATEGORY_LABELS) as EducationCategory[];

function ArticleCard({ article, onPress }: { article: EducationArticle; onPress: () => void }) {
  const t = useTokens();
  const lang = useLang();
  const text = (lang !== "en" && article[lang]) || article;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${text.title}. ${text.summary}`}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: t.border,
        borderLeftWidth: article.urgent ? 4 : 1,
        borderLeftColor: article.urgent ? t.red : t.border,
        backgroundColor: pressed ? t.surface2 : t.surface,
      })}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {article.urgent ? <Ionicons name="warning-outline" size={14} color={t.redInk} /> : null}
          <Text
            style={{
              fontFamily: FONT.semibold,
              fontSize: 13,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              color: article.urgent ? t.redInk : t.greenInk,
            }}
          >
            {CATEGORY_LABELS[article.category]}
          </Text>
        </View>
        <Text style={{ fontFamily: FONT.semibold, fontSize: 17, lineHeight: 22, color: t.ink }}>{text.title}</Text>
        <T variant="small">{text.summary}</T>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
          <Ionicons name="time-outline" size={14} color={t.muted} />
          <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: t.muted }}>
            {article.readTimeMinutes} min read
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={t.muted} />
    </Pressable>
  );
}

export default function EducationScreen() {
  const router = useRouter();
  const t = useTokens();
  const { calculatedPregnancyWeeks } = useUserProfile();
  const [category, setCategory] = useState<EducationCategory | "ALL">("ALL");
  const weeks = typeof calculatedPregnancyWeeks === "number" ? calculatedPregnancyWeeks : null;

  const articles = useMemo(() => getSortedArticles(weeks), [weeks]);
  const shown = category === "ALL" ? articles : articles.filter((a) => a.category === category);

  const Chip = ({ id, label }: { id: EducationCategory | "ALL"; label: string }) => {
    const on = category === id;
    return (
      <Pressable
        onPress={() => setCategory(id)}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        style={{
          minHeight: 44,
          paddingHorizontal: 16,
          borderRadius: 999,
          borderWidth: 1.5,
          justifyContent: "center",
          borderColor: on ? t.green : t.borderStrong,
          backgroundColor: on ? t.green : t.surface,
        }}
      >
        <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#FFFFFF" : t.ink2 }}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <Page>
      <AppHeader title="Learn" subtitle="Short, trusted guides for pregnancy and after birth" />

      {weeks ? (
        <Pressable
          onPress={() => router.push("/fetal-development")}
          accessibilityRole="link"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            padding: 16,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: t.border,
            backgroundColor: t.surface,
          }}
        >
          <View
            style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.mint, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="happy-outline" size={20} color={t.greenInk} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 17, color: t.ink }}>{`Your baby at ${weeks} weeks`}</Text>
            <T variant="small">How your baby is growing this week</T>
          </View>
          <Ionicons name="chevron-forward" size={20} color={t.muted} />
        </Pressable>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <Chip id="ALL" label="All" />
        {CATEGORIES.map((c) => (
          <Chip key={c} id={c} label={CATEGORY_LABELS[c]} />
        ))}
      </ScrollView>

      <View style={{ gap: 12 }}>
        {shown.map((a) => (
          <ArticleCard
            key={a.id}
            article={a}
            onPress={() => router.push({ pathname: "/education/[id]", params: { id: a.id } })}
          />
        ))}
      </View>

      <T variant="small" style={{ textAlign: "center" }}>
        Based on World Health Organization guidance. General information only. Your health worker knows your situation
        best.
      </T>
    </Page>
  );
}
