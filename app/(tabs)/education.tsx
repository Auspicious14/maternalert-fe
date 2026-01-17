import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { StatusBanner } from "../../components/shared/StatusBanner";
import { Typography } from "../../components/shared/Typography";
import { useEducation } from "../../hooks/useEducation";

export default function EducationScreen() {
  const router = useRouter();

  const { data: articles, isLoading } = useEducation();
  const featured = articles?.[0];
  const others = articles?.slice(1) ?? [];

  const openLink = (url?: string) => {
    if (!url) return;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <Screen backgroundColor="#F9FAFB">
        <StatusBanner
          message="OFFLINE MODE ACTIVE"
          icon={<Ionicons name="cloud-offline" size={16} color="#FFFFFF" />}
        />

        <View className="px-10 mt-5 mb-8">
          <Typography
            variant="h1"
            className="text-[32px] font-black mb-2 shadow-lexend-bold"
          >
            Education Hub
          </Typography>
          <Typography variant="body" className="text-gray-500 text-lg">
            Verified pregnancy advice and care tips.
          </Typography>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Featured Card */}
          {featured && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => openLink(featured.videoUrl || featured.sourceUrl)}
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

          {isLoading && (
            <Typography variant="body" className="mb-4">
              Loading education articles…
            </Typography>
          )}
          <View className="mb-5">
            <Typography variant="h2" weight="bold" className="text-[22px]">
              Articles
            </Typography>
          </View>

          {others.map((article) => (
            <TouchableOpacity
              key={article.id}
              activeOpacity={0.8}
              onPress={() => openLink(article.sourceUrl || article.videoUrl)}
            >
              <Card className="mb-4 rounded-[32px] p-6 border border-[#F1F5F9] shadow-sm bg-white">
                <Typography variant="h3" weight="bold" className="mb-1">
                  {article.title}
                </Typography>
                <Typography variant="caption" className="text-gray-500 mb-2">
                  {article.readTimeMinutes} mins • {article.category}
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  {article.summary}
                </Typography>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}

function TopicCard({ title, icon, color, bg }: any) {
  return (
    <TouchableOpacity
      className="w-[47%] bg-white rounded-[32px] p-6 items-center border border-[#F1F5F9] shadow-sm"
      activeOpacity={0.7}
    >
      <View
        className="w-[60px] h-[60px] rounded-[20px] justify-center items-center mb-4"
        style={{ backgroundColor: bg }}
      >
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Typography variant="h3" weight="bold" className="text-center">
        {title}
      </Typography>
    </TouchableOpacity>
  );
}
