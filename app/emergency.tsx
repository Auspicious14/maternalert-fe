import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

export default function EmergencyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <Screen backgroundColor={Theme.colors.darkBg}>
        {/* Top Header */}
        <View className="flex-row justify-between items-center mb-10 px-6 pt-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="warning" size={24} color={Theme.colors.emergency} />
            <Typography variant="h3" weight="bold" className="text-white/80 tracking-widest text-base">EMERGENCY ALERT</Typography>
          </View>
          <View className="w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_10px_#2DE474]" />
        </View>

        <View className="flex-1 items-center justify-center pb-10 px-6">
          <View className="items-center mb-10">
            <Typography variant="caption" className="text-white/50 tracking-widest mb-2">CURRENT BP READING</Typography>
            <View className="flex-row items-center">
              <Typography variant="h1" className="text-[80px] text-emergency font-black">165</Typography>
              <Typography variant="h1" className="text-[60px] text-emergency/30 mx-1 font-light">/</Typography>
              <Typography variant="h1" className="text-[80px] text-emergency font-black">110</Typography>
            </View>
            <View className="flex-row items-center gap-1.5 border border-emergency/30 py-1.5 px-4 rounded-[20px] mt-4 bg-emergency/5">
              <Ionicons name="stats-chart" size={14} color={Theme.colors.emergency} />
              <Typography variant="caption" weight="bold" className="text-emergency tracking-widest uppercase">Critical Level</Typography>
            </View>
          </View>

          {/* Emergency Contact Avatar */}
          <View className="items-center mb-12">
            <View className="w-40 h-40 rounded-full border-2 border-emergency/40 justify-center items-center mb-4">
              <View className="w-[140px] h-[140px] rounded-full border-2 border-emergency overflow-hidden">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop' }} 
                  className="w-full h-full"
                />
              </View>
            </View>
            <Typography variant="h1" className="text-white text-4xl font-black">Husband</Typography>
          </View>

          {/* CALL NOW Button */}
          <TouchableOpacity 
            className="bg-emergency w-full h-20 rounded-[40px] flex-row items-center justify-center gap-4 mb-10 shadow-lg shadow-emergency/40" 
            activeOpacity={0.8}
            onPress={() => console.log('Calling emergency contact...')}
          >
            <Ionicons name="call" size={32} color="white" />
            <Typography variant="h1" weight="bold" className="text-white text-[28px]">CALL NOW</Typography>
          </TouchableOpacity>

          <View className="flex-row items-center w-full gap-4 mb-6">
            <View className="flex-1 h-[1px] bg-white/10" />
            <Typography variant="caption" className="text-white/40 tracking-widest">OR MEDICAL HELP</Typography>
            <View className="flex-1 h-[1px] bg-white/10" />
          </View>

          {/* Secondary Action */}
          <TouchableOpacity 
            className="flex-row items-center w-full bg-white/5 rounded-[30px] p-4 border border-white/10"
            onPress={() => router.push('/clinic-finder')}
          >
            <View className="w-11 h-11 rounded-xl bg-emergency/15 justify-center items-center mr-4">
              <Ionicons name="add-circle" size={24} color={Theme.colors.emergency} />
            </View>
            <Typography variant="h2" weight="bold" className="flex-1 text-white text-lg">Call Local Clinic</Typography>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}
