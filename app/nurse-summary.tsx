import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/shared/Card';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

import { useHealthData } from '../hooks/useHealthData';

export default function NurseSummaryScreen() {
  const router = useRouter();
  const { latestBP, recentSymptoms } = useHealthData();

  return (
    <SafeAreaView className="flex-1 bg-emergency">
      <Screen backgroundColor="#FFFFFF">
        {/* Urgent Header Banner */}
        <View className="bg-emergency py-10 px-10 items-center rounded-b-[60px]">
          <View className="relative mb-5 justify-center items-center">
            <Ionicons name="warning" size={60} color="#FFFFFF" className="absolute opacity-30" />
            <Ionicons name="alert-circle" size={80} color="#FFFFFF" />
          </View>
          <Typography variant="h1" className="text-white text-center text-[28px] font-black leading-[38px]">
            GO TO THE NEAREST HEALTH FACILITY NOW
          </Typography>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Nurse Card */}
          <Card className="rounded-[32px] p-6 mb-10 border-l-8 border-l-emergency bg-white shadow-md">
            <View className="flex-row items-center gap-3 mb-5">
              <View className="w-11 h-11 rounded-xl bg-red-50 justify-center items-center">
                <Ionicons name="medical" size={24} color={Theme.colors.emergency} />
              </View>
              <Typography variant="h2" weight="bold" className="text-lg font-black tracking-tight">SHOW THIS TO THE NURSE</Typography>
            </View>

            <View className="h-[1px] bg-gray-100 mb-6" />

            {/* Clinical Data Section */}
            <View className="flex-row items-start gap-3 mb-5">
              <Ionicons name="checkmark-circle" size={24} color={Theme.colors.emergency} />
              <View className="flex-1">
                <Typography variant="h3" className="text-lg">
                  Blood Pressure: <Typography weight="bold" className="font-extrabold">{latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : 'Not recorded'}</Typography>
                </Typography>
                <Typography variant="caption" weight="bold" className="text-emergency text-xs mt-0.5 tracking-[1px]">
                  ({latestBP?.systolic && latestBP.systolic > 140 ? 'CRITICAL' : 'ELEVATED'})
                </Typography>
              </View>
            </View>

            {recentSymptoms?.map((symptom) => (
              <View key={symptom.id} className="flex-row items-start gap-3 mb-5">
                <Ionicons name="checkmark-circle-outline" size={24} color={Theme.colors.text} />
                <Typography variant="h3" className="text-lg">
                  {symptom.symptomType.replace(/_/g, ' ')} detected
                </Typography>
              </View>
            ))}

            {(!recentSymptoms || recentSymptoms.length === 0) && (
              <View className="flex-row items-start gap-3 mb-5">
                <Ionicons name="information-circle-outline" size={24} color={Theme.colors.textLight} />
                <Typography variant="h3" className="text-lg text-gray-400">
                  No other symptoms reported
                </Typography>
              </View>
            )}
          </Card>

          {/* Action Buttons */}
          <View className="gap-4">
            <TouchableOpacity className="bg-[#121915] h-20 rounded-[40px] flex-row items-center px-[30px] gap-4" activeOpacity={0.8}>
               <Ionicons name="call" size={24} color="#FFFFFF" />
               <View className="flex-1">
                 <Typography variant="h3" weight="bold" className="text-white text-lg">Call Emergency</Typography>
                 <Typography variant="caption" className="text-white/60 text-xs text-sh-lexend-medium">Contacting: Husband (David)</Typography>
               </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-primary h-[70px] rounded-[35px] flex-row items-center justify-center gap-3" 
              activeOpacity={0.8}
              onPress={() => router.push('/clinic-finder')}
            >
               <Ionicons name="people" size={24} color="#FFFFFF" />
               <Typography variant="h3" weight="bold" className="text-white text-lg">Show to Midwife</Typography>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center mt-5 gap-2" onPress={() => router.replace('/(tabs)')}>
               <Ionicons name="home" size={18} color={Theme.colors.textLight} />
               <Typography variant="body" weight="bold" className="text-gray-500">False Alarm? Return to Home</Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}
