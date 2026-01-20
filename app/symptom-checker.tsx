import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

const SYMPTOMS = [
  { id: 'HEADACHE', title: 'Severe Headache', icon: 'flash' },
  { id: 'BLURRED_VISION', title: 'Blurred Vision', icon: 'grid' },
  { id: 'SWELLING', title: 'Swelling', subtitle: 'Hands or face', icon: 'hand-left' },
  { id: 'UPPER_ABDOMINAL_PAIN', title: 'Stomach Pain', icon: 'sad' },
];

import { useHealthData } from '../hooks/useHealthData';

export default function SymptomCheckerScreen() {
  const router = useRouter();
  const { addSymptom, isAddingSymptom } = useHealthData();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSymptom = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;

    try {
      for (const symptomId of selected) {
        await addSymptom(symptomId);
      }
      router.push('/symptom-results');
    } catch (error) {
      console.error('Failed to submit symptoms', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <Screen backgroundColor="#F9FAFB">
        <View className="flex-row items-center justify-between px-6 pt-4 mb-10">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 justify-center items-center">
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px]">Check Symptoms</Typography>
          <View className="w-7" />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Typography variant="h1" className="text-[36px] font-black leading-[44px] mb-3 shadow-lexend-bold">How are you feeling today?</Typography>
          <Typography variant="body" className="text-gray-500 text-lg leading-6 mb-10">
            Select any symptoms you are experiencing right now.
          </Typography>

          <View className="gap-4">
            {SYMPTOMS.map((symptom) => (
              <TouchableOpacity 
                key={symptom.id}
                className={`bg-white rounded-[40px] py-6 px-[30px] flex-row items-center border shadow-sm ${selected.includes(symptom.id) ? 'border-primary' : 'border-[#F1F5F9]'}`}
                onPress={() => toggleSymptom(symptom.id)}
                activeOpacity={0.7}
              >
                <View className="w-11 h-11 rounded-full bg-primary-light justify-center items-center mr-4">
                  <Ionicons name={symptom.icon as any} size={24} color={Theme.colors.primary} />
                </View>
                <View className="flex-1">
                  <Typography variant="h3" weight="bold" className="text-lg">{symptom.title}</Typography>
                  {symptom.subtitle && (
                    <Typography variant="caption" className="text-gray-400">{symptom.subtitle}</Typography>
                  )}
                </View>
                <View className={`w-7 h-7 rounded-full border-2 justify-center items-center ${selected.includes(symptom.id) ? 'border-gray-300' : 'border-gray-300'}`}>
                  {selected.includes(symptom.id) && <View className="w-4 h-4 rounded-full bg-gray-300" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View className="px-10 pb-[100px] items-center">
          <TouchableOpacity 
            className={`bg-primary w-full h-[70px] rounded-[35px] flex-row items-center justify-center gap-3 mb-4 shadow-md ${isAddingSymptom || selected.length === 0 ? 'opacity-70' : ''}`}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={isAddingSymptom || selected.length === 0}
          >
            <Typography variant="h2" weight="bold" className="text-[22px] text-[#1A212E]">
              {isAddingSymptom ? 'Reporting...' : 'Submit Report'}
            </Typography>
            {!isAddingSymptom && <Ionicons name="arrow-forward" size={24} color="#1A212E" />}
          </TouchableOpacity>
          <Typography variant="caption" className="text-gray-500">All data is kept private and secure.</Typography>
        </View>

        {/* Tab Mockup for fidelity - Now Functional */}
        <View className="absolute bottom-0 w-full h-20 bg-white flex-row border-t border-[#F1F5F9] px-10 pt-2.5 justify-between">
           <TouchableOpacity className="items-center gap-1" onPress={() => router.push('/(tabs)')}>
              <Ionicons name="home" size={24} color={Theme.colors.textLight} />
              <Typography variant="caption" className="text-gray-500">Home</Typography>
           </TouchableOpacity>
           <TouchableOpacity className="items-center gap-1" onPress={() => router.push('/(tabs)/tracking')}>
              <View className="bg-[#E8FCF1] px-5 py-1 rounded-[20px]">
                <Ionicons name="medical" size={24} color={Theme.colors.primary} />
              </View>
              <Typography variant="caption" weight="bold" className="text-primary">Checkup</Typography>
           </TouchableOpacity>
           <TouchableOpacity className="items-center gap-1" onPress={() => router.push('/(tabs)/profile')}>
              <Ionicons name="person" size={24} color={Theme.colors.textLight} />
              <Typography variant="caption" className="text-gray-500">Profile</Typography>
           </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}
