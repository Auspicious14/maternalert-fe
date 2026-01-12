import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/shared/Card';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

const CLINICS = [
  { id: '1', name: 'West Health Center', distance: '0.8 km', status: 'Open Now', type: 'Clinic' },
  { id: '2', name: 'General Hospital', distance: '1.5 km', status: 'Open 24/7', type: 'Hospital' },
  { id: '3', name: 'Maternal Care Unit', distance: '2.4 km', status: 'Closed', type: 'Clinic' },
];

export default function ClinicFinderScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <Screen backgroundColor="#F9FAFB">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 mb-5">
          <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 justify-center items-center">
            <Ionicons name="arrow-back" size={28} color="#1A212E" />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold" className="text-[22px]">Nearest Clinics</Typography>
          <View className="w-7" />
        </View>

        {/* Search Bar Refined */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center bg-white h-[60px] rounded-[30px] px-6 border border-[#F1F5F9] shadow-sm">
            <Ionicons name="search" size={20} color="#94A3B8" />
            <TextInput 
              className="flex-1 ml-3 text-base text-[#1A212E]"
              placeholder="Search by clinic name..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#94A3B8"
              style={{ fontFamily: 'Lexend-Regular' }}
            />
          </View>
        </View>

        {/* Map Area Refined */}
        <View className="px-6 mb-10">
          <View className="h-72 bg-[#EEF2F6] rounded-[40px] overflow-hidden relative border border-[#E2E8F0]">
             {/* Mock Map Lines/Shapes */}
             <View className="absolute top-10 w-full h-[1px] bg-gray-300" />
             <View className="absolute left-[100px] h-full w-[1px] bg-gray-300" />
             
             {/* Vibrant Pins */}
             <View className="absolute top-[60px] left-[140px] items-center">
                <View className="w-11 h-11 rounded-full bg-[#E8FCF1] justify-center items-center shadow-md">
                  <Ionicons name="location" size={24} color={Theme.colors.primary} />
                </View>
                <View className="bg-white px-3 py-1 rounded-xl mt-2 border border-[#E2E8F0]">
                  <Typography variant="caption" weight="bold" className="text-[10px]">West Health</Typography>
                </View>
             </View>

             <View className="absolute top-[180px] left-[240px] items-center">
                <View className="w-11 h-11 rounded-full bg-blue-600 justify-center items-center shadow-md">
                  <Ionicons name="location" size={24} color="#FFFFFF" />
                </View>
             </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center px-10 mb-5">
          <Typography variant="h2" weight="bold" className="text-lg">Nearby Facilities</Typography>
          <TouchableOpacity>
             <Typography variant="body" weight="bold" className="text-primary text-sh-lexend-medium">See All</Typography>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }}>
          {CLINICS.map((clinic) => (
            <TouchableOpacity key={clinic.id} activeOpacity={0.9}>
              <Card className="flex-row items-center p-6 rounded-[30px] mb-4 bg-white border border-[#F1F5F9] shadow-sm">
                <View className="w-[50px] h-[50px] bg-slate-50 rounded-2xl justify-center items-center mr-4">
                   <Ionicons 
                    name={clinic.type === 'Hospital' ? 'business' : 'medical'} 
                    size={24} 
                    color={clinic.status === 'Closed' ? '#94A3B8' : Theme.colors.primary} 
                   />
                </View>
                <View className="flex-1">
                  <Typography variant="h3" weight="bold" className="text-lg font-black mb-1">{clinic.name}</Typography>
                  <View className="flex-row items-center gap-2">
                    <Typography variant="caption" className="text-gray-500">{clinic.distance}</Typography>
                    <View className="w-1 h-1 rounded-full bg-slate-300" />
                    <Typography 
                      variant="caption" 
                      weight="bold"
                      className={`${clinic.status === 'Open Now' ? 'text-primary' : 'text-rose-500'}`}
                    >
                      {clinic.status}
                    </Typography>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="px-10 pb-8 pt-2">
           <TouchableOpacity className="bg-slate-900 h-[70px] rounded-[35px] flex-row items-center justify-center gap-3">
              <Ionicons name="call" size={24} color="#FFFFFF" />
              <Typography variant="h2" weight="bold" className="text-white text-lg">Call Center</Typography>
           </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}
