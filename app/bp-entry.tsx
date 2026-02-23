import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useHealthData } from '../hooks/useHealthData';

export default function BPEntryScreen() {
  const router = useRouter();
  const { addBP, isAddingBP } = useHealthData();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(currentDate);

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
      Alert.alert('Error', 'Failed to save blood pressure reading. Please try again.');
    }
  };

  const showHelp = (type: 'systolic' | 'diastolic') => {
    Alert.alert(
      type === 'systolic' ? 'Systolic Pressure' : 'Diastolic Pressure',
      type === 'systolic' 
        ? 'The top number. It measures the force your heart exerts on your artery walls each time it beats. Normal is around 90-120.' 
        : 'The bottom number. It measures the force your heart exerts on your artery walls between beats. Normal is around 60-80.'
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB" }}
    >
      <Screen backgroundColor={isDark ? Theme.colors.darkBg : "#F9FAFB"}>
        <View className="flex-row items-center justify-between px-6 pt-4 mb-10">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 justify-center items-center">
            <Ionicons
              name="arrow-back"
              size={28}
              color={isDark ? Theme.colors.white : "#1A212E"}
            />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px]">Log Blood Pressure</Typography>
          <View className="w-7" />
        </View>

        <View className="items-center mb-4">
          <View className={isDark ? "flex-row items-center gap-2 bg-[#020617] py-3 px-5 rounded-[30px] shadow-sm border border-white/10" : "flex-row items-center gap-2 bg-white py-3 px-5 rounded-[30px] shadow-sm"}>
            <Ionicons name="calendar" size={18} color={Theme.colors.primary} />
            <Typography
              variant="h3"
              weight="bold"
              className={isDark ? "text-base text-white" : "text-base text-[#121915]"}
            >
              {formattedDate}
            </Typography>
          </View>
        </View>

        <Typography
          variant="body"
          className={isDark ? "text-center text-gray-300 mb-10 px-10 leading-6" : "text-center text-gray-500 mb-10 px-10 leading-6"}
        >
          Enter the numbers exactly as they appear on your machine.
        </Typography>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Systolic Card */}
          <View className={isDark ? "bg-[#020617] rounded-[40px] p-6 mb-4 shadow-sm border border-white/10" : "bg-white rounded-[40px] p-6 mb-4 shadow-sm border border-[#F1F5F9]"}>
            <View className="flex-row justify-between items-center mb-4">
              <Typography variant="h2" className="text-xl font-black">Systolic (Top)</Typography>
              <TouchableOpacity onPress={() => showHelp('systolic')}>
                <Ionicons name="help-circle" size={24} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <View className={isDark ? "flex-row items-center bg-[#022C22] rounded-[30px] px-6 h-14 mb-3" : "flex-row items-center bg-[#E8FCF1] rounded-[30px] px-6 h-14 mb-3"}>
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
            <Typography variant="caption" className={isDark ? "text-gray-400 text-center mt-1" : "text-gray-500 text-center mt-1"}>Normal range is around 90-120</Typography>
          </View>

          {/* Diastolic Card */}
          <View className={isDark ? "bg-[#020617] rounded-[40px] p-6 mb-4 shadow-sm border border-white/10" : "bg-white rounded-[40px] p-6 mb-4 shadow-sm border border-[#F1F5F9]"}>
            <View className="flex-row justify-between items-center mb-4">
              <Typography variant="h2" className="text-xl font-black">Diastolic (Bottom)</Typography>
              <TouchableOpacity onPress={() => showHelp('diastolic')}>
                <Ionicons name="help-circle" size={24} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <View className={isDark ? "flex-row items-center bg-[#022C22] rounded-[30px] px-6 h-14 mb-3" : "flex-row items-center bg-[#E8FCF1] rounded-[30px] px-6 h-14 mb-3"}>
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
            <Typography variant="caption" className={isDark ? "text-gray-400 text-center mt-1" : "text-gray-500 text-center mt-1"}>Normal range is around 60-80</Typography>
          </View>

          <TouchableOpacity 
            className="w-full bg-primary h-14 rounded-[30px] items-center justify-center mt-4 shadow-lg shadow-primary/30"
            onPress={handleSave}
            disabled={isAddingBP}
          >
            <Typography variant="h2" weight="bold" className="text-white">
              {isAddingBP ? 'Saving...' : 'Save Reading'}
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}