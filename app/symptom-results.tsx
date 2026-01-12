import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/shared/Card';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

export default function SymptomResultsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <Screen backgroundColor="#F9FAFB">
        <View className="flex-row items-center justify-between px-6 pt-4 mb-5">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 justify-center items-center">
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-xl">Care Recommendation</Typography>
          <View className="w-7" />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Level Radial Indicator Mockup */}
          <View className="items-center my-10">
            <View className="w-[180px] h-[180px] rounded-full bg-[#FFF4E8] justify-center items-center mb-6">
               <View className="w-[140px] h-[140px] rounded-full bg-[#FFE8D1] justify-center items-center relative">
                  <View className="w-20 h-20 rounded-full bg-white justify-center items-center shadow-md">
                    <Ionicons name="medical" size={40} color={Theme.colors.accent} />
                  </View>
                  <View className="absolute bottom-[-5px] bg-white w-8 h-8 rounded-full justify-center items-center border border-[#FEE2E2] shadow-sm">
                    <Ionicons name="warning" size={16} color={Theme.colors.accent} />
                  </View>
               </View>
            </View>
            <Typography variant="h1" className="text-[28px] font-black text-accent mb-2 shadow-lexend-bold">Orange Level</Typography>
            <Typography variant="h2" weight="bold" className="text-xl text-center px-10 leading-7">Medical review recommended soon</Typography>
          </View>

          <Card className="bg-white rounded-[40px] p-[30px] mb-5 border border-[#F1F5F9]">
             <View className="flex-row gap-4 items-start mb-5">
               <Ionicons name="medical" size={24} color={Theme.colors.primary} />
               <Typography variant="body" className="flex-1 leading-6 text-lg">
                 Based on your symptoms and blood pressure reading, please visit your clinic <Typography weight="bold">today</Typography>.
               </Typography>
             </View>
             <View className="flex-row items-center gap-2 border-t border-[#F1F5F9] pt-4">
                <Ionicons name="time" size={18} color={Theme.colors.textLight} />
                <Typography variant="caption" className="text-gray-500">Last reading: 10 mins ago</Typography>
             </View>
          </Card>

          {/* Nearest Clinic Mockup */}
          <View className="h-[100px] bg-[#F1F5F9] rounded-[30px] flex-row items-center px-6 mb-10">
             <View className="flex-1">
               <Typography variant="h3" weight="bold" className="font-black">Nearest Clinic</Typography>
               <Typography variant="caption" className="text-gray-500">1.2km away • Open now</Typography>
             </View>
             <TouchableOpacity className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-sm">
                <Ionicons name="navigate" size={20} color="#1A212E" />
             </TouchableOpacity>
          </View>

          <View className="gap-4">
            <TouchableOpacity 
              className="bg-primary h-[70px] rounded-[35px] flex-row items-center justify-center gap-3 shadow-md" 
              onPress={() => router.push('/clinic-finder')}
            >
              <Ionicons name="location" size={24} color="#1A212E" />
              <Typography variant="h2" weight="bold" className="text-lg text-[#1A212E]">Find nearest clinic</Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-[#FFF4E8] h-[70px] rounded-[35px] flex-row items-center justify-center gap-3 shadow-sm"
              onPress={() => router.push('/emergency')}
            >
              <Ionicons name="call" size={24} color={Theme.colors.urgentText} />
              <Typography variant="h2" weight="bold" className="text-lg text-urgent-text">Call emergency contact</Typography>
            </TouchableOpacity>

            <TouchableOpacity className="items-center mt-2.5" onPress={() => router.replace('/(tabs)')}>
               <Typography variant="h3" weight="bold" className="text-gray-500">Back to Home</Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}
