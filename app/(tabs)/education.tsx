import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { memo, useCallback } from "react";
import { SafeAreaView, FlatList, TouchableOpacity, View } from "react-native";
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { Typography } from "../../components/shared/Typography";
import { Skeleton } from "../../components/ui/Skeleton";
import Theme from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { useEducation, EducationArticle } from "../../hooks/useEducation";

// Optimized Article Card Component
const ArticleCard = memo(({ article, isDark, onPress }: { article: EducationArticle; isDark: boolean; onPress: () => void }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Card
      className={
        isDark
          ? "mb-4 rounded-[32px] p-6 border shadow-sm bg-[#020617] border-white/10"
          : "mb-4 rounded-[32px] p-6 border shadow-sm bg-white border-[#F1F5F9]"
      }
    >
      <Typography variant="h3" weight="bold" className="mb-1">
        {article.title}
      </Typography>
      <Typography
        variant="caption"
        className={
          isDark ? "text-gray-400 mb-2" : "text-gray-500 mb-2"
        }
      >
        {article.readTimeMinutes} mins • {article.category}
      </Typography>
      <Typography
        variant="body"
        className={isDark ? "text-gray-300" : "text-gray-600"}
      >
        {article.summary}
      </Typography>
    </Card>
  </TouchableOpacity>
));

export default function EducationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { data: articles, isLoading } = useEducation();
  const featured = articles?.[0];
  const others = articles?.slice(1) ?? [];

  const openLink = useCallback(async (url?: string) => {
    if (!url) return;
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: "#1A212E",
        toolbarColor: "#FFFFFF",
      });
    } catch (e) {
      console.error("Failed to open link", e);
    }
  }, []);

  const renderHeader = () => (
    <>
      <View className="mt-5 mb-8">
        <Typography
          variant="h1"
          className="text-[32px] font-black mb-2 shadow-lexend-bold"
        >
          Education Hub
        </Typography>
        <Typography
          variant="body"
          className={
            isDark ? "text-gray-300 text-lg" : "text-gray-500 text-lg"
          }
        >
          Verified pregnancy advice and care tips.
        </Typography>
      </View>

      {isLoading ? (
        <>
          {/* Featured Card Skeleton */}
          <Skeleton
            height={240}
            borderRadius={40}
            variant={isDark ? "dark" : "light"}
            style={{ marginBottom: 40 }}
          />

          <View className="mb-5">
            <Skeleton
              width={100}
              height={30}
              variant={isDark ? "dark" : "light"}
            />
          </View>
        </>
      ) : (
        <>
          {/* Featured Card */}
          {featured && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                openLink(featured.videoUrl || featured.sourceUrl)
              }
            >
              <Card className="h-[240px] rounded-[40px] overflow-hidden mb-10 bg-[#1A212E] p-0">
                <View className="w-full h-full bg-[#111827]" />
                <View className="absolute inset-0 p-[30px] justify-between">
                  <View className="w-14 h-14 rounded-full bg-white/20 border border-white/40 justify-center items-center">
                    <Ionicons name="play" size={24} color="#FFFFFF" />
                  </View>
                  <View>
                    <Typography
                      variant="h2"
                      weight="bold"
                      className="text-white text-2xl"
                    >
                      {featured.title}
                    </Typography>
                    <Typography variant="caption" className="text-white/70">
                      {featured.readTimeMinutes} mins • {featured.category}
                    </Typography>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}

          <View className="mb-5">
            <Typography variant="h2" weight="bold" className="text-[22px]">
              Articles
            </Typography>
          </View>
        </>
      )}
    </>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <>
        {/* List Skeletons */}
        <Skeleton
          height={120}
          borderRadius={32}
          variant={isDark ? "dark" : "light"}
          style={{ marginBottom: 16 }}
        />
        <Skeleton
          height={120}
          borderRadius={32}
          variant={isDark ? "dark" : "light"}
          style={{ marginBottom: 16 }}
        />
        <Skeleton
          height={120}
          borderRadius={32}
          variant={isDark ? "dark" : "light"}
        />
      </>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB" }}
    >
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#F9FAFB"}>
        <FlatList
          data={isLoading ? [] : others}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArticleCard 
              article={item} 
              isDark={isDark} 
              onPress={() => openLink(item.sourceUrl || item.videoUrl)} 
            />
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
      </Screen>
    </SafeAreaView>
  );
}
