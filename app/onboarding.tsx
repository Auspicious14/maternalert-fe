import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';

const { height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const isSmallScreen = height < 700;

  return (
    <Screen backgroundColor="#F9FAFB" safe={true} scrollable={true}>
      <View className="flex-1 px-6 pb-10">
        
        {/* Header - Fixed to top right */}
        <View className="flex-row justify-end pt-4 mb-4">
          <TouchableOpacity 
            className="flex-row items-center gap-2 bg-white py-2 px-4 rounded-full shadow-sm"
            activeOpacity={0.7}
          >
            <Ionicons name="language" size={20} color={Theme.colors.primary} />
            <Typography variant="body" weight="bold" className="text-[#1A212E]">English</Typography>
            <Ionicons name="chevron-down" size={16} color={Theme.colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Text Section - Moved Above Image as requested */}
        <View className="px-4 mb-6">
          <Typography 
            variant="h1" 
            weight="black" 
            className="text-center mb-3 text-[#121915] text-[32px] leading-[42px]"
          >
            Safe Pregnancy{"\n"}Tracking
          </Typography>
          <Typography variant="body" className="text-center text-gray-500 leading-6 text-base px-2">
            Notice warning signs early and know exactly when to seek professional care.
          </Typography>
        </View>

        {/* Content Section - Image BELOW text */}
        <View className="items-center mb-10">
          <View className="w-[85%] aspect-square bg-white rounded-[40px] shadow-sm border border-[#E2E8F0] overflow-hidden items-center justify-center">
            <Image 
              source={require('../assets/images/maternal_onboarding_illustration.png')} 
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Medical Info Box */}
        <View className="px-4 mb-10">
          <View className="flex-row bg-[#F0F7FF] p-5 rounded-3xl items-center gap-4 border border-[#DBEAFE]">
            <View className="w-12 h-12 rounded-2xl bg-white justify-center items-center shadow-sm">
              <Ionicons name="shield-checkmark" size={28} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Typography variant="body" weight="bold" className="text-blue-900 text-[15px] mb-0.5">Clinical Guidance</Typography>
              <Typography variant="caption" className="text-blue-800 leading-[18px] text-xs opacity-80">
                Built on verified clinical safety standards to support your journey.
              </Typography>
            </View>
          </View>
        </View>

        {/* Footer Actions */}
        <View className="px-4 mt-auto">
          <TouchableOpacity 
            className="bg-primary w-full h-16 rounded-[20px] flex-row items-center justify-center gap-3 mb-5 shadow-sm"
            activeOpacity={0.8}
            onPress={() => router.push('/disclaimer')}
          >
            <Typography variant="h3" weight="bold" className="text-[#121915]">Get Started</Typography>
            <Ionicons name="arrow-forward" size={24} color="#121915" />
          </TouchableOpacity>

          {/* <View className="flex-row justify-center mb-4">
            <Typography variant="body" className="text-gray-500">Already have an account? </Typography>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Typography variant="body" weight="bold" className="text-primary-dark">Sign In</Typography>
            </TouchableOpacity>
          </View> */}

          <Typography variant="caption" className="text-gray-400 text-center text-[11px] leading-4 px-4">
            By continuing, you acknowledge that this app does not replace medical advice. 
            See our <Typography variant="caption" className="underline text-gray-500">Terms</Typography> & <Typography variant="caption" className="underline text-gray-500">Privacy Policy</Typography>.
          </Typography>
        </View>
      </View>
    </Screen>
  );
}
