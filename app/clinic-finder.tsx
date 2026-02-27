import { Ionicons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
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
  const [userLocation, setUserLocation] =
    useState<ExpoLocation.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Use dynamic location for filtering
  const clinicParams = useMemo(() => {
    if (userLocation) {
      return {
        lat: userLocation.coords.latitude,
        lng: userLocation.coords.longitude,
        radius: 5000, // 5km search radius
      };
    }
    return "Lagos";
  }, [userLocation]);

  const { data: clinics, isLoading } = useClinics(clinicParams);

  useEffect(() => {
    (async () => {
      setIsLocating(true);
      try {
        let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Permission to access location was denied");
          setIsLocating(false);
          return;
        }

        let location = await ExpoLocation.getCurrentPositionAsync({});
        console.log(
          `[DEBUG] User coordinates: ${location.coords.latitude}, ${location.coords.longitude}`,
        );
        setUserLocation(location);

        // Reverse geocode to find city
        let reverseGeocode = await ExpoLocation.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        console.log(
          `[DEBUG] Reverse geocode results:`,
          JSON.stringify(reverseGeocode),
        );

        if (reverseGeocode.length > 0) {
          // Check for city, district, or subregion
          const detectedCity =
            reverseGeocode[0].city ||
            reverseGeocode[0].district ||
            reverseGeocode[0].subregion ||
            "Lagos";
          console.log(`[DEBUG] Detected location: ${detectedCity}`);
        }
      } catch (error) {
        console.error(`[ERROR] Geolocation error:`, error);
        setLocationError("Could not fetch location");
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  const handleRequestLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location permissions in your settings to find nearby clinics automatically.",
          [{ text: "OK" }],
        );
        setIsLocating(false);
        return;
      }

      let location = await ExpoLocation.getCurrentPositionAsync({});
      setUserLocation(location);

      let reverseGeocode = await ExpoLocation.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const detectedCity =
          reverseGeocode[0].city ||
          reverseGeocode[0].district ||
          reverseGeocode[0].subregion ||
          "Lagos";
        console.log(`[DEBUG] Detected location (manual): ${detectedCity}`);
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch your current location.");
    } finally {
      setIsLocating(false);
    }
  };

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

  const mapHtml = useMemo(() => {
    const clinicMarkers = (filteredClinics || [])
      .map(
        (c) => `
      var m = L.marker([${c.latitude}, ${c.longitude}], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: "<div style='background-color: ${Theme.colors.primary}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);'></div>",
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        })
      }).bindPopup("<div style='font-family: Lexend-Regular, sans-serif; min-width: 120px;'><b>${c.name}</b><br/><span style='font-size: 11px; opacity: 0.8;'>${c.address}</span></div>");
      group.addLayer(m);
    `,
      )
      .join("");

    const userMarker = userLocation
      ? `
      L.marker([${userLocation.coords.latitude}, ${userLocation.coords.longitude}], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: "<div style='background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(59,130,246,0.5);'></div>",
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        })
      }).addTo(map).bindPopup("<b>You are here</b>");
    `
      : "";

    const centerLat = userLocation
      ? userLocation.coords.latitude
      : filteredClinics && filteredClinics.length > 0
        ? filteredClinics[0].latitude
        : defaultRegion.latitude;

    const centerLng = userLocation
      ? userLocation.coords.longitude
      : filteredClinics && filteredClinics.length > 0
        ? filteredClinics[0].longitude
        : defaultRegion.longitude;

    const tileUrl =
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; background: #F8FAFC; }
          #map { height: 100vh; width: 100vw; }
          .leaflet-control-attribution { display: none !important; }
          .leaflet-container { background: #F8FAFC !important; }
          .custom-div-icon { background: transparent; border: none; }
          .leaflet-popup-content-wrapper {
            border-radius: 12px;
            padding: 0;
            overflow: hidden;
            background: #FFFFFF;
            color: #1A212E;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .leaflet-popup-tip {
            background: #FFFFFF;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          }).setView([${centerLat}, ${centerLng}], 14);
          
          L.tileLayer('${tileUrl}', {
            maxZoom: 19,
          }).addTo(map);

          var group = L.featureGroup();
          ${clinicMarkers}
          group.addTo(map);
          ${userMarker}
          
          if (group.getLayers().length > 0) {
            map.fitBounds(group.getBounds(), { padding: [30, 30] });
          } else {
            map.setView([${centerLat}, ${centerLng}], 14);
          }
        </script>
      </body>
      </html>
    `;
  }, [filteredClinics, userLocation, isDark]);

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
          className="h-72 rounded-[40px] overflow-hidden border relative"
        >
          <WebView
            style={{ flex: 1 }}
            source={{ html: mapHtml }}
            scrollEnabled={false}
          />
          <TouchableOpacity
            onPress={handleRequestLocation}
            className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full items-center justify-center shadow-md"
            style={{ elevation: 5 }}
            disabled={isLocating}
          >
            <Ionicons
              name={isLocating ? "sync" : "locate"}
              size={24}
              color={Theme.colors.primary}
            />
          </TouchableOpacity>
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
