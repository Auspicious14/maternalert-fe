import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/shared/Card';
import { Screen } from '../../components/shared/Screen';
import { StatusBanner } from '../../components/shared/StatusBanner';
import { Typography } from '../../components/shared/Typography';

export default function EducationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <Screen backgroundColor="#F9FAFB">
        <StatusBanner 
          message="OFFLINE MODE ACTIVE" 
          icon={<Ionicons name="cloud-offline" size={16} color="#FFFFFF" />}
        />

        <View className="px-10 mt-5 mb-8">
          <Typography variant="h1" className="text-[32px] font-black mb-2 shadow-lexend-bold">Education Hub</Typography>
          <Typography variant="body" className="text-gray-500 text-lg">Verified pregnancy advice and care tips.</Typography>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Featured Card */}
          <TouchableOpacity activeOpacity={0.9}>
            <Card className="h-[240px] rounded-[40px] overflow-hidden mb-10 bg-[#1A212E] p-0">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400&auto=format&fit=crop' }} 
                className="w-full h-full opacity-60"
              />
              <View className="absolute inset-0 p-[30px] justify-between">
                 <View className="w-14 h-14 rounded-full bg-white/20 border border-white/40 justify-center items-center">
                    <Ionicons name="play" size={24} color="#FFFFFF" />
                 </View>
                 <View>
                   <Typography variant="h2" weight="bold" className="text-white text-2xl">Know your movements</Typography>
                   <Typography variant="caption" className="text-white/70">Guide • 4 mins video</Typography>
                 </View>
              </View>
            </Card>
          </TouchableOpacity>

          <View className="mb-5">
            <Typography variant="h2" weight="bold" className="text-[22px]">Essential Topics</Typography>
          </View>

          <View className="flex-row flex-wrap gap-4 justify-between mb-10">
            <TopicCard 
              title="Danger Signs" 
              icon="warning" 
              color="#F43F5E" 
              bg="#FFF1F2" 
            />
            <TopicCard 
              title="Healthy Diet" 
              icon="leaf" 
              color="#10B981" 
              bg="#ECFDF5" 
            />
            <TopicCard 
              title="Mental Health" 
              icon="heart" 
              color="#8B5CF6" 
              bg="#F5F3FF" 
            />
            <TopicCard 
              title="Labor Prep" 
              icon="bed" 
              color="#3B82F6" 
              bg="#EFF6FF" 
            />
          </View>

          {/* Myths vs Facts Section */}
          <View className="mb-5">
            <Typography variant="h2" weight="bold" className="text-[22px]">Myths vs Facts</Typography>
          </View>

          <TouchableOpacity className="bg-white rounded-[32px] p-6 border border-[#F1F5F9] shadow-sm">
             <View className="mb-4">
                <View className="bg-[#FFF1F2] px-2 py-0.5 rounded-md self-start mb-2">
                  <Typography variant="caption" weight="bold" className="text-[#F43F5E] text-[10px]">MYTH</Typography>
                </View>
                <Typography variant="h3" weight="bold" className="text-base text-[#121915]">Drinking cold water causes flu in the baby.</Typography>
             </View>
             <View className="border-t border-[#F1F5F9] pt-4">
                <View className="bg-[#ECFDF5] px-2 py-0.5 rounded-md self-start mb-2">
                  <Typography variant="caption" weight="bold" className="text-[#10B981] text-[10px]">FACT</Typography>
                </View>
                <Typography variant="body" className="text-gray-500">Cold water does not affect the baby's health in the womb.</Typography>
             </View>
          </TouchableOpacity>
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}

function TopicCard({ title, icon, color, bg }: any) {
  return (
    <TouchableOpacity className="w-[47%] bg-white rounded-[32px] p-6 items-center border border-[#F1F5F9] shadow-sm" activeOpacity={0.7}>
      <View className="w-[60px] h-[60px] rounded-[20px] justify-center items-center mb-4" style={{ backgroundColor: bg }}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Typography variant="h3" weight="bold" className="text-center">{title}</Typography>
    </TouchableOpacity>
  );
}
