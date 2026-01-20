import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import { Card } from '../components/shared/Card';
import { Screen } from '../components/shared/Screen';
import { Typography } from '../components/shared/Typography';
import Theme from '../constants/theme';
import { useClinics } from "../hooks/useClinics";

export default function ClinicFinderScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data: clinics, isLoading } = useClinics();
  
  const filteredClinics =
    (clinics || []).filter((clinic) =>
      clinic.name.toLowerCase().includes(search.toLowerCase())
    );

  // Default region if no clinics (Lagos coordinates as fallback)
  const defaultRegion = {
    latitude: 6.45,
    longitude: 3.39,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const initialRegion = clinics && clinics.length > 0 
    ? {
        latitude: clinics[0].latitude,
        longitude: clinics[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : defaultRegion;

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
          <View className="h-72 rounded-[40px] overflow-hidden border border-[#E2E8F0]">
            <MapView
              style={{ flex: 1 }}
              initialRegion={initialRegion}
              showsUserLocation={true}
            >
              {(clinics || []).map((clinic) => (
                <Marker
                  key={clinic.id}
                  coordinate={{
                    latitude: clinic.latitude,
                    longitude: clinic.longitude,
                  }}
                  title={clinic.name}
                  description={clinic.address}
                />
              ))}
            </MapView>
          </View>
        </View>

        <View className="flex-row justify-between items-center px-10 mb-5">
          <Typography variant="h2" weight="bold" className="text-lg">Nearby Facilities</Typography>
          <TouchableOpacity>
             <Typography variant="body" weight="bold" className="text-primary text-sh-lexend-medium">See All</Typography>
          </TouchableOpacity>
        </View>

       <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }}
        >
          {isLoading && (
            <Typography variant="body" className="mb-4">
              Loading nearby facilities...
            </Typography>
          )}

          {filteredClinics.map((clinic) => (
            <TouchableOpacity key={clinic.id} activeOpacity={0.9}>
              <Card className="flex-row items-center p-6 rounded-[30px] mb-4 bg-white border border-[#F1F5F9] shadow-sm">
                <View className="w-[50px] h-[50px] bg-slate-50 rounded-2xl justify-center items-center mr-4">
                  <Ionicons
                    name={clinic.isEmergency ? "medical" : "business"}
                    size={24}
                    color={clinic.isEmergency ? Theme.colors.primary : "#94A3B8"}
                  />
                </View>
                <View className="flex-1">
                  <Typography
                    variant="h3"
                    weight="bold"
                    className="text-lg font-black mb-1"
                  >
                    {clinic.name}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    {clinic.address}, {clinic.city}
                  </Typography>
                  {clinic.phone && (
                    <Typography variant="caption" className="text-gray-500">
                      {clinic.phone}
                    </Typography>
                  )}
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
