import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button } from '../components/shared/Button';
import { Typography } from '../components/shared/Typography';

export default function DisclaimerScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="flex-1 p-6">
        <View className="py-4 items-center border-b border-[#E2E8F0] mb-6">
           <Typography variant="h2" weight="bold">Important Notice</Typography>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center my-8 w-[100px] h-[100px] rounded-full bg-[#FFEBEE] justify-center self-center">
            <Ionicons name="medical" size={60} color="#C62828" />
          </View>
          
          <Typography variant="h1" className="text-center mb-8">Clinical Safety Disclaimer</Typography>
          
          <View className="gap-8 pb-8">
            <View className="flex-row gap-4 items-start">
              <Ionicons name="alert-circle" size={24} color="#C62828" />
              <Typography variant="body" className="flex-1 leading-6">
                <Typography weight="bold">This app does not provide medical diagnoses.</Typography> All health checks are automated based on clinical guidelines and must be verified by a medical professional.
              </Typography>
            </View>

            <View className="flex-row gap-4 items-start">
              <Ionicons name="call" size={24} color="#34E875" />
              <Typography variant="body" className="flex-1 leading-6">
                In case of a <Typography weight="bold">medical emergency</Typography>, do not wait for the app to load. Call emergency services or go to the nearest hospital immediately.
              </Typography>
            </View>

            <View className="flex-row gap-4 items-start">
              <Ionicons name="lock-closed" size={24} color="#1565C0" />
              <Typography variant="body" className="flex-1 leading-6">
                Your data is stored securely and processed according to strict privacy standards. We minimize the data we collect to only what is necessary for your care.
              </Typography>
            </View>

            <View className="flex-row gap-4 items-start">
              <Ionicons name="bluetooth" size={24} color="#6A1B9A" />
              <Typography variant="body" className="flex-1 leading-6">
                This app works offline for educational content, but requires an internet connection periodically to sync with the clinical backend for accurate assessments.
              </Typography>
            </View>
          </View>
        </ScrollView>

        <View className="pt-6 border-t border-[#E2E8F0] gap-6">
          <TouchableOpacity 
            className="flex-row gap-4 items-center" 
            activeOpacity={0.7}
            onPress={() => setAgreed(!agreed)}
          >
            <View className={`w-7 h-7 rounded-lg border-2 justify-center items-center ${agreed ? 'bg-[#34E875] border-[#34E875]' : 'border-[#CBD5E0]'}`}>
              {agreed && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Typography variant="body" className="flex-1 text-sm leading-5">
              I have read and I understand the safety disclaimer and terms of use.
            </Typography>
          </TouchableOpacity>

          <Button 
            title="I Understand & Accept" 
            variant="primary" 
            size="large"
            disabled={!agreed}
            onPress={() => router.replace('/register')}
            className="w-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
