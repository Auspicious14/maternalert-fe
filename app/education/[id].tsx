import { Typography } from "@/components/shared/Typography";
import { getArticleById } from "@/constants/education";
import Theme from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, useColorScheme, View } from "react-native";

 
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  WARNING_SIGNS: { bg: "#FEE2E2", text: "#DC2626" },
  HYPERTENSION:  { bg: "#FEF3C7", text: "#D97706" },
  NUTRITION:     { bg: "#D1FAE5", text: "#059669" },
  POSTPARTUM:    { bg: "#EDE9FE", text: "#7C3AED" },
  ANTENATAL:     { bg: "#DBEAFE", text: "#2563EB" },
};
 
/**
 * Renders plain text content with basic formatting:
 * - Lines in ALL CAPS become section headings
 * - Lines starting with - become bullet points
 * - Blank lines become spacing
 * No markdown parser needed — pure React Native.
 */
function ArticleContent({
  content,
  isDark,
}: {
  content: string;
  isDark: boolean;
}) {
  const textColor = isDark ? "#E2E8F0" : "#1E293B";
  const mutedColor = isDark ? "#94A3B8" : "#64748B";
 
  const lines = content.split("\n");
 
  return (
    <View style={{ gap: 2 }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
 
        // Empty line — spacing
        if (!trimmed) {
          return <View key={i} style={{ height: 10 }} />;
        }
 
        // ALL CAPS line (≥4 chars, no lowercase) = section heading
        const isHeading =
          trimmed.length >= 4 &&
          trimmed === trimmed.toUpperCase() &&
          !/^\d/.test(trimmed) &&
          !trimmed.startsWith("-");
 
        if (isHeading) {
          return (
            <View key={i} style={{ marginTop: 16, marginBottom: 4 }}>
              <Typography
                variant="h3"
                weight="bold"
                style={{ color: textColor, fontSize: 15, letterSpacing: 0.3 }}
              >
                {trimmed}
              </Typography>
            </View>
          );
        }
 
        // Bullet point
        if (trimmed.startsWith("- ")) {
          return (
            <View
              key={i}
              style={{ flexDirection: "row", gap: 8, paddingLeft: 4, marginBottom: 4 }}
            >
              <Typography
                variant="body"
                style={{ color: mutedColor, fontSize: 15, lineHeight: 24, marginTop: 1 }}
              >
                •
              </Typography>
              <Typography
                variant="body"
                style={{ color: textColor, fontSize: 15, lineHeight: 24, flex: 1 }}
              >
                {trimmed.slice(2)}
              </Typography>
            </View>
          );
        }
 
        // Numbered list (e.g. "1. something")
        if (/^\d+\.\s/.test(trimmed)) {
          const [num, ...rest] = trimmed.split(". ");
          return (
            <View
              key={i}
              style={{ flexDirection: "row", gap: 8, paddingLeft: 4, marginBottom: 4 }}
            >
              <Typography
                variant="body"
                weight="bold"
                style={{ color: mutedColor, fontSize: 15, lineHeight: 24, minWidth: 20 }}
              >
                {num}.
              </Typography>
              <Typography
                variant="body"
                style={{ color: textColor, fontSize: 15, lineHeight: 24, flex: 1 }}
              >
                {rest.join(". ")}
              </Typography>
            </View>
          );
        }
 
        // Regular paragraph
        return (
          <Typography
            key={i}
            variant="body"
            style={{ color: textColor, fontSize: 15, lineHeight: 24, marginBottom: 2 }}
          >
            {trimmed}
          </Typography>
        );
      })}
    </View>
  );
}
 
export default function ArticleReaderScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
 
  const article = getArticleById(id);
 
  if (!article) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body" style={{ color: "#94A3B8" }}>
          Article not found.
        </Typography>
      </SafeAreaView>
    );
  }
 
  const colors =
    CATEGORY_COLORS[article.category] ?? { bg: "#F3F4F6", text: "#6B7280" };
 
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB",
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={isDark ? "#FFFFFF" : "#1A212E"}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Typography
            variant="caption"
            style={{
              color: isDark ? "#94A3B8" : "#64748B",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {article.categoryLabel}
          </Typography>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Ionicons name="time-outline" size={13} color="#94A3B8" />
          <Typography
            variant="caption"
            style={{ color: "#94A3B8", fontSize: 12 }}
          >
            {article.readTimeMinutes} min
          </Typography>
        </View>
      </View>
 
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgent badge */}
        {article.urgent && (
          <View
            style={{
              backgroundColor: "#FEE2E2",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignSelf: "flex-start",
              marginBottom: 16,
            }}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: "#DC2626", fontSize: 11 }}
            >
              🚨 ACT IMMEDIATELY IF YOU HAVE THESE SYMPTOMS
            </Typography>
          </View>
        )}
 
        {/* Category badge */}
        {!article.urgent && (
          <View
            style={{
              backgroundColor: colors.bg,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 5,
              alignSelf: "flex-start",
              marginBottom: 16,
            }}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: colors.text, fontSize: 11 }}
            >
              {article.categoryLabel.toUpperCase()}
            </Typography>
          </View>
        )}
 
        {/* Title */}
        <Typography
          variant="h1"
          weight="bold"
          style={{
            color: isDark ? "#FFFFFF" : "#1A212E",
            fontSize: 24,
            lineHeight: 32,
            marginBottom: 12,
          }}
        >
          {article.title}
        </Typography>
 
        {/* Summary */}
        <Typography
          variant="body"
          style={{
            color: isDark ? "#94A3B8" : "#64748B",
            fontSize: 15,
            lineHeight: 23,
            marginBottom: 28,
            fontStyle: "italic",
          }}
        >
          {article.summary}
        </Typography>
 
        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
            marginBottom: 28,
          }}
        />
 
        {/* Article body */}
        <ArticleContent content={article.content} isDark={isDark} />
 
        {/* Source attribution */}
        <View
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
          }}
        >
          <Typography
            variant="caption"
            style={{
              color: isDark ? "#475569" : "#94A3B8",
              fontSize: 12,
              lineHeight: 18,
            }}
          >
            Source: {article.source}
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}