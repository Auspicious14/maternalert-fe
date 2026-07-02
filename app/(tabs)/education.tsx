import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { SafeAreaView, FlatList, TouchableOpacity, View } from "react-native";
import { Screen } from "../../components/shared/Screen";
import { Typography } from "../../components/shared/Typography";
import Theme from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { getSortedArticles, EducationArticle } from "../../constants/education";
 
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  WARNING_SIGNS: { bg: "#FEE2E2", text: "#DC2626" },
  HYPERTENSION:  { bg: "#FEF3C7", text: "#D97706" },
  NUTRITION:     { bg: "#D1FAE5", text: "#059669" },
  POSTPARTUM:    { bg: "#EDE9FE", text: "#7C3AED" },
  ANTENATAL:     { bg: "#DBEAFE", text: "#2563EB" },
};
 
const ArticleCard = memo(
  ({
    article,
    isDark,
    onPress,
  }: {
    article: EducationArticle;
    isDark: boolean;
    onPress: () => void;
  }) => {
    const colors =
      CATEGORY_COLORS[article.category] ?? { bg: "#F3F4F6", text: "#6B7280" };
 
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={{ marginBottom: 12 }}
      >
        <View
          style={{
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
            borderRadius: 20,
            padding: 18,
            borderWidth: 1,
            borderColor: article.urgent
              ? "#FCA5A5"
              : isDark
              ? "rgba(255,255,255,0.08)"
              : "#F1F5F9",
          }}
        >
          {/* Category badge + read time */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                backgroundColor: colors.bg,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              <Typography
                variant="caption"
                weight="bold"
                style={{ color: colors.text, fontSize: 10 }}
              >
                {article.categoryLabel.toUpperCase()}
              </Typography>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons
                name="time-outline"
                size={12}
                color={isDark ? "#94A3B8" : "#9CA3AF"}
              />
              <Typography
                variant="caption"
                style={{ color: isDark ? "#94A3B8" : "#9CA3AF", fontSize: 11 }}
              >
                {article.readTimeMinutes} min read
              </Typography>
            </View>
          </View>
 
          {/* Title */}
          <Typography
            variant="h3"
            weight="bold"
            style={{
              color: isDark ? "#FFFFFF" : "#1A212E",
              marginBottom: 6,
              lineHeight: 22,
            }}
          >
            {article.urgent ? "🚨 " : ""}{article.title}
          </Typography>
 
          {/* Summary */}
          <Typography
            variant="body"
            style={{
              color: isDark ? "#94A3B8" : "#64748B",
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {article.summary}
          </Typography>
 
          {/* Read arrow */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
              gap: 4,
            }}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: article.urgent ? "#DC2626" : Theme.colors.primary, fontSize: 12 }}
            >
              Read article
            </Typography>
            <Ionicons
              name="arrow-forward"
              size={12}
              color={article.urgent ? "#DC2626" : Theme.colors.primary}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);
 
export default function EducationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const articles = getSortedArticles(); // sorted: urgent first, all offline
 
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB",
      }}
    >
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#F9FAFB"}>
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              isDark={isDark}
              onPress={() => router.push(`/education/${item.id}`)}
            />
          )}
          ListHeaderComponent={() => (
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
              <Typography
                variant="h1"
                weight="bold"
                style={{
                  fontSize: 28,
                  color: isDark ? "#FFFFFF" : "#1A212E",
                  marginBottom: 6,
                }}
              >
                Health Education
              </Typography>
              <Typography
                variant="body"
                style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: 15 }}
              >
                Trusted information for a safe pregnancy — available offline.
              </Typography>
            </View>
          )}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        />
      </Screen>
    </SafeAreaView>
  );
}
 
 