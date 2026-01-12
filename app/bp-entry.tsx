import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

import { useHealthData } from '../hooks/useHealthData';

export default function BPEntryScreen() {
  const router = useRouter();
  const { addBP, isAddingBP } = useHealthData();
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');

  const handleSave = async () => {
    try {
      await addBP({ 
        systolic: parseInt(systolic), 
        diastolic: parseInt(diastolic) 
      });

      if (parseInt(systolic) > 160 || parseInt(diastolic) > 110) {
        router.push('/emergency');
      } else if (parseInt(systolic) > 140 || parseInt(diastolic) > 90) {
        router.push('/nurse-summary');
      } else {
        router.back();
      }
    } catch (error) {
      console.error('Failed to save BP reading', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <Screen backgroundColor="#F9FAFB">
        <View className="flex-row items-center justify-between px-6 pt-4 mb-10">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 justify-center items-center">
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px]">Log Blood Pressure</Typography>
          <View className="w-7" />
        </View>

        <View className="items-center mb-4">
          <View className="flex-row items-center gap-2 bg-white py-3 px-5 rounded-[30px] shadow-sm">
            <Ionicons name="calendar" size={18} color={Theme.colors.primary} />
            <Typography variant="h3" weight="bold" className="text-base text-[#121915]">Today, 10:42 AM</Typography>
          </View>
        </View>

        <Typography variant="body" className="text-center text-gray-500 mb-10 px-10 leading-6">
          Enter the numbers exactly as they appear on your machine.
        </Typography>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Systolic Card */}
          <View className="bg-white rounded-[40px] p-6 mb-4 shadow-sm border border-[#F1F5F9]">
            <View className="flex-row justify-between items-center mb-4">
              <Typography variant="h2" className="text-xl font-black">Systolic (Top)</Typography>
              <Ionicons name="help-circle" size={24} color={Theme.colors.primary} />
            </View>
            <View className="flex-row items-center bg-[#E8FCF1] rounded-[30px] px-6 h-14 mb-3">
              <TextInput 
                className={`flex-1 text-[22px] font-bold text-[#2DE474]`}
                value={systolic}
                onChangeText={setSystolic}
                keyboardType="numeric"
                placeholderTextColor="#A0AEC0"
                style={{ fontFamily: 'Lexend-Bold' }}
              />
              <Typography variant="h3" weight="bold" className="text-[#2DE47499]">mmHg</Typography>
            </View>
            <Typography variant="caption" className="text-gray-500 text-center mt-1">Normal range is around 90-120</Typography>
          </View>

          {/* Diastolic Card */}
          <View className="bg-white rounded-[40px] p-6 mb-4 shadow-sm border border-[#F1F5F9]">
            <View className="flex-row justify-between items-center mb-4">
              <Typography variant="h2" className="text-xl font-black">Diastolic (Bottom)</Typography>
              <Ionicons name="help-circle" size={24} color={Theme.colors.primary} />
            </View>
            <View className="flex-row items-center bg-[#E8FCF1] rounded-[30px] px-6 h-14 mb-3">
              <TextInput 
                className={`flex-1 text-[22px] font-bold text-[#2DE474]`}
                value={diastolic}
                onChangeText={setDiastolic}
                keyboardType="numeric"
                placeholderTextColor="#A0AEC0"
                style={{ fontFamily: 'Lexend-Bold' }}
              />
              <Typography variant="h3" weight="bold" className="text-[#2DE47499]">mmHg</Typography>
            </View>
            <Typography variant="caption" className="text-gray-500 text-center mt-1">Normal range is around 60-80</Typography>
          </View>

          <View className="flex-row bg-[#EFF6FF] p-4 rounded-3xl items-center gap-4 mt-4 border border-[#DBEAFE]">
            <View className="w-11 h-11 rounded-full bg-white justify-center items-center">
              <Ionicons name="information-circle" size={24} color="#3B82F6" />
            </View>
            <Typography variant="body" className="flex-1 text-blue-800 leading-5 text-[15px]">
              Rest for 5 minutes before taking your reading for the most accurate result.
            </Typography>
          </View>
        </ScrollView>

        <View className="px-6 pb-8 pt-2">
          <TouchableOpacity 
            className={`bg-primary h-[70px] rounded-[35px] justify-center items-center shadow-md ${isAddingBP ? 'opacity-70' : ''}`}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isAddingBP}
          >
            <Typography variant="h2" weight="bold" className="text-[#121915] text-[22px]">
              {isAddingBP ? 'Saving...' : 'Save Reading'}
            </Typography>
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}
