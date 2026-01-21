import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { Card } from "../../components/shared/Card";
import { Screen } from "../../components/shared/Screen";
import { StatusBanner } from "../../components/shared/StatusBanner";
import { Typography } from "../../components/shared/Typography";
import { Skeleton } from "../../components/ui/Skeleton";
import { useEducation } from "../../hooks/useEducation";

export default function EducationScreen() {
  const router = useRouter();

  const { data: articles, isLoading } = useEducation();
  const featured = articles?.[0];
  const others = articles?.slice(1) ?? [];

  const openLink = async (url?: string) => {
    if (!url) return;
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: '#1A212E',
        toolbarColor: '#FFFFFF',
      });
    } catch (e) {
      console.error('Failed to open link', e);
    }
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
          {isLoading ? (
            <>
              {/* Featured Card Skeleton */}
              <Skeleton height={240} borderRadius={40} variant="light" style={{ marginBottom: 40 }} />
              
              <View className="mb-5">
                 <Skeleton width={100} height={30} variant="light" />
              </View>

              {/* List Skeletons */}
              <Skeleton height={120} borderRadius={32} variant="light" style={{ marginBottom: 16 }} />
              <Skeleton height={120} borderRadius={32} variant="light" style={{ marginBottom: 16 }} />
              <Skeleton height={120} borderRadius={32} variant="light" />
            </>
          ) : (
            <>
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
            </>
          )}
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}
