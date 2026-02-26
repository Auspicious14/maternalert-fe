import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Card } from "../components/shared/Card";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { ClinicLocation, useClinics } from "../hooks/useClinics";

export default function ClinicFinderScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { data: clinics, isLoading } = useClinics();

  const filteredClinics = useMemo(() => {
    const all = clinics || [];
    const filtered = all.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(search.toLowerCase()) ||
        clinic.address.toLowerCase().includes(search.toLowerCase()) ||
        clinic.city.toLowerCase().includes(search.toLowerCase()),
    );
    return showAll ? filtered : filtered.slice(0, 3);
  }, [clinics, search, showAll]);

  const handleOpenMaps = (clinic: ClinicLocation) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${clinic.latitude},${clinic.longitude}`;
    const label = clinic.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const handleCallCenter = () => {
    // Maternal health support call center (mock number)
    Linking.openURL("tel:+234800MATERNAL");
  };

  const defaultRegion = {
    latitude: 6.45,
    longitude: 3.39,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const initialRegion =
    clinics && clinics.length > 0
      ? {
          latitude: clinics[0].latitude,
          longitude: clinics[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : defaultRegion;

  const iconColor = isDark ? "#FFFFFF" : "#1A212E";
  const searchBg = isDark ? Theme.colors.cardDark : "#FFFFFF";
  const borderColor = isDark ? Theme.colors.borderDark : "#F1F5F9";
  const cardBg = isDark ? Theme.colors.cardDark : "#FFFFFF";
  const secondaryBtnBg = isDark ? "#FFFFFF" : "#0F172A";
  const secondaryBtnText = isDark ? "#1A212E" : "#FFFFFF";

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-6 pt-4 mb-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={28} color={iconColor} />
        </TouchableOpacity>
        <Typography variant="h2" weight="bold" className="text-[22px]">
          Nearest Clinics
        </Typography>
        <View className="w-7" />
      </View>

      <View className="px-6 mb-8">
        <View
          style={{ backgroundColor: searchBg, borderColor: borderColor }}
          className="flex-row items-center h-[60px] rounded-[30px] px-6 border shadow-sm"
        >
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Search by clinic name or city..."
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              if (text) setShowAll(true);
            }}
            placeholderTextColor="#94A3B8"
            style={{
              fontFamily: "Lexend-Regular",
              color: isDark ? "#FFFFFF" : "#1A212E",
            }}
          />
        </View>
      </View>

      <View className="px-6 mb-10">
        <View
          style={{ borderColor: borderColor }}
          className="h-72 rounded-[40px] overflow-hidden border"
        >
          <MapView
            style={{ flex: 1 }}
            initialRegion={initialRegion}
            showsUserLocation={true}
            userInterfaceStyle={isDark ? "dark" : "light"}
          >
            {(filteredClinics || []).map((clinic) => (
              <Marker
                key={clinic.id}
                coordinate={{
                  latitude: clinic.latitude,
                  longitude: clinic.longitude,
                }}
                title={clinic.name}
                description={clinic.address}
                onCalloutPress={() => handleOpenMaps(clinic)}
              />
            ))}
          </MapView>
        </View>
      </View>

      <View className="flex-row justify-between items-center px-10 mb-5">
        <Typography variant="h2" weight="bold" className="text-lg">
          Nearby Facilities
        </Typography>
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Typography
            variant="body"
            weight="bold"
            className="text-primary text-sh-lexend-medium"
          >
            {showAll ? "Show Less" : "See All"}
          </Typography>
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

        {!isLoading && filteredClinics.length === 0 && (
          <Typography variant="body" className="text-center text-gray-500 mt-4">
            No clinics found matching your search.
          </Typography>
        )}

        {filteredClinics.map((clinic) => (
          <TouchableOpacity
            key={clinic.id}
            activeOpacity={0.9}
            onPress={() => handleOpenMaps(clinic)}
          >
            <Card
              style={{ backgroundColor: cardBg, borderColor: borderColor }}
              className="flex-row items-center p-6 rounded-[30px] mb-4 border shadow-sm"
            >
              <View
                style={{ backgroundColor: isDark ? "#3A3430" : "#F8FAFC" }}
                className="w-[50px] h-[50px] rounded-2xl justify-center items-center mr-4"
              >
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
                <Typography
                  variant="caption"
                  className={isDark ? "text-gray-400" : "text-gray-500"}
                >
                  {clinic.address}, {clinic.city}
                </Typography>
                {clinic.phone && (
                  <Typography
                    variant="caption"
                    className={isDark ? "text-gray-400" : "text-gray-500"}
                  >
                    {clinic.phone}
                  </Typography>
                )}
              </View>
              <Ionicons
                name="navigate"
                size={20}
                color={Theme.colors.primary}
              />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="px-10 pb-8 pt-2">
        <TouchableOpacity
          style={{ backgroundColor: secondaryBtnBg }}
          onPress={handleCallCenter}
          className="h-[70px] rounded-[35px] flex-row items-center justify-center gap-3"
        >
          <Ionicons name="call" size={24} color={secondaryBtnText} />
          <Typography
            variant="h2"
            weight="bold"
            style={{ color: secondaryBtnText }}
            className="text-lg"
          >
            Call Center
          </Typography>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
