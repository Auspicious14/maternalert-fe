import { Ionicons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Linking,
  PanResponder,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { TokenStorage } from "../api/storage";
import { Typography } from "../components/shared/Typography";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { ClinicLocation, useClinics } from "../hooks/useClinics";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SHEET_HEIGHT = SCREEN_HEIGHT * 0.74;

// translateY values for the three snap points
const SNAP_FULL = 0; // fully open
const SNAP_HALF = SHEET_HEIGHT - SCREEN_HEIGHT * 0.44; // ~44% of screen visible
const SNAP_PEEK = SHEET_HEIGHT - 114; // handle + count only

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function distanceTo(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): string {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return km < 1 ? `${Math.round(km * 1000)}m away` : `${km.toFixed(1)}km away`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClinicFinderScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // --- Search state ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  // --- Location state ---
  const [userLocation, setUserLocation] =
    useState<ExpoLocation.LocationObject | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // --- Map state ---
  const [mapLayer, setMapLayer] = useState<"street" | "satellite">("street");
  const [selectedClinic, setSelectedClinic] = useState<ClinicLocation | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const listScrollRef = useRef<ScrollView>(null);

  // ---------------------------------------------------------------------------
  // Bottom sheet — pan gesture + spring snap
  // ---------------------------------------------------------------------------

  const sheetY = useRef(new Animated.Value(SNAP_PEEK)).current;
  const sheetYValue = useRef(SNAP_PEEK);

  useEffect(() => {
    const id = sheetY.addListener(({ value }) => {
      sheetYValue.current = value;
    });
    return () => sheetY.removeListener(id);
  }, []);

  const snapTo = useCallback(
    (target: number) => {
      Animated.spring(sheetY, {
        toValue: target,
        useNativeDriver: false,
        damping: 22,
        stiffness: 200,
        mass: 0.85,
      }).start();
    },
    [sheetY],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 8,
      onPanResponderGrant: () => {
        sheetY.stopAnimation();
        sheetY.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dy: sheetY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        sheetY.flattenOffset();
        const current = sheetYValue.current;
        const vy = gs.vy;

        let target: number;
        if (vy < -1.0) {
          target = current < SNAP_HALF ? SNAP_FULL : SNAP_HALF;
        } else if (vy > 1.0) {
          target = current > SNAP_HALF ? SNAP_PEEK : SNAP_HALF;
        } else {
          const snaps = [
            { to: SNAP_FULL, d: Math.abs(current - SNAP_FULL) },
            { to: SNAP_HALF, d: Math.abs(current - SNAP_HALF) },
            { to: SNAP_PEEK, d: Math.abs(current - SNAP_PEEK) },
          ];
          target = snaps.reduce((a, b) => (a.d < b.d ? a : b)).to;
        }

        Animated.spring(sheetY, {
          toValue: target,
          useNativeDriver: false,
          damping: 22,
          stiffness: 200,
          mass: 0.85,
        }).start();
      },
    }),
  ).current;

  // ---------------------------------------------------------------------------
  // Location effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      setIsLocating(true);
      try {
        const cached = await TokenStorage.getLastLocation();
        if (cached) {
          setUserLocation({ coords: cached, timestamp: Date.now() } as any);
        }
        const { status } =
          await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.High,
        });
        setUserLocation(loc);
        await TokenStorage.saveLastLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        // Open sheet once we have a location
        snapTo(SNAP_HALF);
      } catch (e) {
        console.error("[ERROR] Geolocation:", e);
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  const handleRequestLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Enable location permissions to find nearby clinics.",
          [{ text: "OK" }],
        );
        return;
      }
      const loc = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High,
      });
      setUserLocation(loc);
      await TokenStorage.saveLastLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      webViewRef.current?.injectJavaScript(`
        if (window.mapCenterOn) window.mapCenterOn(${loc.coords.latitude}, ${loc.coords.longitude}, 15);
        true;
      `);
    } catch {
      Alert.alert("Error", "Could not fetch your location.");
    } finally {
      setIsLocating(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Clinic data
  // ---------------------------------------------------------------------------

  const clinicParams = useMemo(() => {
    if (userLocation) {
      return {
        lat: userLocation.coords.latitude,
        lng: userLocation.coords.longitude,
        radius: 5000,
      };
    }
    return null;
  }, [userLocation]);

  const clinicQuery = clinicParams ?? (debouncedSearch || undefined);
  const { data: clinics, isLoading } = useClinics(
    clinicQuery,
    Boolean(clinicQuery),
  );

  const allMatchingClinics = useMemo(() => {
    const all = clinics ?? [];
    if (!debouncedSearch) return all;
    const q = debouncedSearch.toLowerCase();
    return all.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q),
    );
  }, [clinics, debouncedSearch]);

  const displayedClinics = useMemo(
    () => (showAll ? allMatchingClinics : allMatchingClinics.slice(0, 6)),
    [allMatchingClinics, showAll],
  );

  // ---------------------------------------------------------------------------
  // Map interactions
  // ---------------------------------------------------------------------------

  const handleLayerToggle = () => {
    const next = mapLayer === "street" ? "satellite" : "street";
    setMapLayer(next);
    webViewRef.current?.injectJavaScript(`
      if (window.mapSwitchLayer) window.mapSwitchLayer('${next}');
      true;
    `);
  };

  const handleClinicSelect = (clinic: ClinicLocation) => {
    setSelectedClinic(clinic);
    webViewRef.current?.injectJavaScript(`
      if (window.mapCenterOn) window.mapCenterOn(${clinic.latitude}, ${clinic.longitude}, 17);
      if (window.mapHighlight) window.mapHighlight('${clinic.id}');
      true;
    `);
    snapTo(SNAP_HALF);
  };

  const handleWebViewMessage = useCallback(
    (event: any) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === "clinicSelected") {
          const clinic = allMatchingClinics.find((c) => c.id === msg.clinicId);
          if (clinic) {
            setSelectedClinic(clinic);
            snapTo(SNAP_HALF);
          }
        } else if (msg.type === "mapTapped") {
          setSelectedClinic(null);
        }
      } catch {}
    },
    [allMatchingClinics, snapTo],
  );

  const handleOpenMaps = (clinic: ClinicLocation) => {
    const latLng = `${clinic.latitude},${clinic.longitude}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(clinic.name)}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${encodeURIComponent(clinic.name)})`,
    });
    if (url) Linking.openURL(url);
  };

  // ---------------------------------------------------------------------------
  // Map HTML — Leaflet with satellite + labels toggle
  // ---------------------------------------------------------------------------

  const mapHtml = useMemo(() => {
    const centerLat =
      userLocation?.coords.latitude ?? allMatchingClinics[0]?.latitude ?? 9.082;
    const centerLng =
      userLocation?.coords.longitude ??
      allMatchingClinics[0]?.longitude ??
      8.6753;

    // Safely serialize clinic data — avoids quote injection
    const clinicDataJson = JSON.stringify(
      allMatchingClinics.map((c) => ({
        id: c.id,
        name: c.name,
        address: c.address,
        city: c.city,
        latitude: c.latitude,
        longitude: c.longitude,
        isEmergency: c.isEmergency,
      })),
    );

    const userMarkerJson = userLocation
      ? JSON.stringify({
          lat: userLocation.coords.latitude,
          lng: userLocation.coords.longitude,
        })
      : "null";

    const primaryColor = Theme.colors.primary;

    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{height:100%;overflow:hidden}
    #map{height:100vh;width:100vw}
    .leaflet-control-attribution,.leaflet-control-zoom{display:none!important}

    /* Popup */
    .clinic-popup .leaflet-popup-content-wrapper{
      border-radius:16px;padding:0;overflow:hidden;
      background:#fff;box-shadow:0 8px 28px rgba(0,0,0,0.18);border:none;
    }
    .clinic-popup .leaflet-popup-content{margin:0;min-width:190px;max-width:230px}
    .clinic-popup .leaflet-popup-tip-container{margin-top:-1px}
    .clinic-popup .leaflet-popup-tip{background:#fff}
    .pu{padding:12px 14px}
    .pu-name{font-size:13px;font-weight:700;color:#0f172a;line-height:1.35}
    .pu-addr{font-size:11px;color:#64748b;margin-top:3px;line-height:1.4}
    .pu-badge{display:inline-block;margin-top:6px;background:#fef2f2;
      color:#dc2626;font-size:10px;padding:2px 8px;border-radius:20px;font-weight:700}
  </style>
</head>
<body>
<div id="map"></div>
<script>
(function() {
  var map = L.map('map',{zoomControl:false,attributionControl:false})
    .setView([${centerLat},${centerLng}],14);

  // --- Tile layers ---
  var streetLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {maxZoom:19,subdomains:'abcd'}
  ).addTo(map);

  var satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {maxZoom:19}
  );

  // Satellite labels overlay so roads/places stay readable
  var labelsLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    {maxZoom:19,subdomains:'abcd',opacity:0.85}
  );

  var currentLayer = 'street';
  window.mapSwitchLayer = function(type) {
    if (type === 'satellite' && currentLayer !== 'satellite') {
      map.removeLayer(streetLayer);
      satelliteLayer.addTo(map);
      labelsLayer.addTo(map);
      currentLayer = 'satellite';
    } else if (type === 'street' && currentLayer !== 'street') {
      map.removeLayer(satelliteLayer);
      map.removeLayer(labelsLayer);
      streetLayer.addTo(map);
      currentLayer = 'street';
    }
  };

  window.mapCenterOn = function(lat,lng,zoom) {
    map.setView([lat,lng],zoom||16,{animate:true});
  };

  // --- Marker icons ---
  var PRIMARY = '${primaryColor}';
  function makeIcon(isEmergency, isSelected) {
    var color = isEmergency ? '#dc2626' : PRIMARY;
    var size  = isSelected ? 38 : 30;
    var sh    = size * 1.3;
    return L.divIcon({
      className: '',
      html: '<div style="width:'+size+'px;height:'+sh+'px;">'
        + '<svg viewBox="0 0 30 39" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;'
        + 'filter:drop-shadow(0 3px 8px rgba(0,0,0,'+(isSelected?0.4:0.22)+')">'
        + '<path d="M15 0C6.72 0 0 6.72 0 15 0 26.25 15 39 15 39S30 26.25 30 15C30 6.72 23.28 0 15 0z" fill="'+color+'"/>'
        + '<circle cx="15" cy="15" r="7" fill="white" opacity="0.95"/>'
        + '</svg></div>',
      iconSize:   [size, sh],
      iconAnchor: [size/2, sh],
    });
  }

  // --- Plot clinics ---
  var clinicData = ${clinicDataJson};
  var markers    = {};
  var group      = L.featureGroup();

  clinicData.forEach(function(c) {
    var m = L.marker([c.latitude, c.longitude], { icon: makeIcon(c.isEmergency, false) });
    m.bindPopup(
      '<div class="pu">'
      + '<div class="pu-name">' + c.name + '</div>'
      + '<div class="pu-addr">' + c.address + (c.city && c.city !== 'Nearby' ? ', '+c.city : '') + '</div>'
      + (c.isEmergency ? '<span class="pu-badge">Emergency</span>' : '')
      + '</div>',
      { className: 'clinic-popup', maxWidth: 230, autoPanPadding: [40, 100] }
    );
    m.on('click', function(e) {
      L.DomEvent.stopPropagation(e);
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'clinicSelected', clinicId: c.id })
      );
    });
    markers[c.id] = { marker: m, data: c };
    group.addLayer(m);
  });

  group.addTo(map);

  window.mapHighlight = function(clinicId) {
    Object.keys(markers).forEach(function(id) {
      var entry = markers[id];
      entry.marker.setIcon(makeIcon(entry.data.isEmergency, id === clinicId));
    });
    if (markers[clinicId]) markers[clinicId].marker.openPopup();
  };

  // --- User location dot ---
  var userMarkerData = ${userMarkerJson};
  if (userMarkerData) {
    var pulseHtml =
      '<div style="width:22px;height:22px;border-radius:50%;'
      + 'background:#3b82f6;border:3px solid white;'
      + 'box-shadow:0 0 0 7px rgba(59,130,246,0.18),0 2px 8px rgba(59,130,246,0.45);"></div>';
    L.marker([userMarkerData.lat, userMarkerData.lng], {
      icon: L.divIcon({ className:'', html: pulseHtml, iconSize:[22,22], iconAnchor:[11,11] })
    }).addTo(map).bindPopup('<div style="font-size:12px;font-weight:700;padding:4px 2px;">You are here</div>');
  }

  // --- Fit to markers ---
  if (group.getLayers().length > 0) {
    map.fitBounds(group.getBounds(), { padding:[60,80], maxZoom:15 });
  }

  // Tap empty map → deselect
  map.on('click', function() {
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: 'mapTapped' })
    );
  });
})();
</script>
</body>
</html>`;
  }, [allMatchingClinics, userLocation]);

  // ---------------------------------------------------------------------------
  // Theme tokens
  // ---------------------------------------------------------------------------

  const bg = isDark ? "#0F1322" : "#F8FAFC";
  const cardBg = isDark ? "#1A2035" : "#FFFFFF";
  const sheetBg = isDark ? "#141824" : "#FFFFFF";
  const inputBg = isDark ? "rgba(20,24,36,0.94)" : "rgba(255,255,255,0.96)";
  const textCol = isDark ? "#F1F5F9" : "#0F172A";
  const subCol = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#1E293B" : "#F1F5F9";
  const handle = isDark ? "#2D3748" : "#CBD5E1";

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* ── Full-screen map ─────────────────────────────────────────────── */}
      <WebView
        ref={webViewRef}
        style={{ flex: 1 }}
        source={{ html: mapHtml }}
        scrollEnabled={false}
        onMessage={handleWebViewMessage}
        allowsInlineMediaPlayback
      />

      {/* ── Floating: back button ────────────────────────────────────────── */}
      <View style={{ position: "absolute", top: 52, left: 16 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: cardBg,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.16,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Ionicons name="arrow-back" size={22} color={textCol} />
        </TouchableOpacity>
      </View>

      {/* ── Floating: search bar ─────────────────────────────────────────── */}
      <View style={{ position: "absolute", top: 44, left: 66, right: 16 }}>
        <View
          style={{
            backgroundColor: inputBg,
            borderRadius: 28,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            shadowColor: "#000",
            shadowOpacity: 0.14,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Ionicons name="search" size={17} color="#94A3B8" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              fontFamily: "Outfit-Regular",
              fontSize: 14,
              color: textCol,
            }}
            placeholder="Search clinics or city..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={(t) => {
              setSearch(t);
              if (t) snapTo(SNAP_HALF);
            }}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Floating: right-side buttons (layer + locate) ────────────────── */}
      {/* Fixed 136px from bottom — always sits above the peek handle         */}
      <View
        style={{
          position: "absolute",
          right: 14,
          bottom: 136,
          gap: 10,
        }}
      >
        {/* Layer toggle */}
        <TouchableOpacity
          onPress={handleLayerToggle}
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: cardBg,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.16,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Ionicons
            name={mapLayer === "street" ? "earth" : "map-outline"}
            size={22}
            color={mapLayer === "satellite" ? Theme.colors.primary : textCol}
          />
        </TouchableOpacity>

        {/* My location */}
        <TouchableOpacity
          onPress={handleRequestLocation}
          disabled={isLocating}
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: cardBg,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.16,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={Theme.colors.primary} />
          ) : (
            <Ionicons name="locate" size={22} color={Theme.colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* ── "Finding location" toast ─────────────────────────────────────── */}
      {isLocating && !userLocation && (
        <View
          style={{
            position: "absolute",
            top: 110,
            alignSelf: "center",
            backgroundColor: inputBg,
            paddingHorizontal: 16,
            paddingVertical: 9,
            borderRadius: 24,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <ActivityIndicator size="small" color={Theme.colors.primary} />
          <Typography
            variant="caption"
            style={{ color: textCol, fontSize: 13 }}
          >
            Finding your location…
          </Typography>
        </View>
      )}

      {/* ── Bottom sheet ─────────────────────────────────────────────────── */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: SHEET_HEIGHT,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 24,
          transform: [{ translateY: sheetY }],
        }}
      >
        {/* Drag handle */}
        <View
          {...panResponder.panHandlers}
          style={{ paddingTop: 14, paddingBottom: 10, alignItems: "center" }}
        >
          <View
            style={{
              width: 38,
              height: 4,
              borderRadius: 2,
              backgroundColor: handle,
            }}
          />
        </View>

        {/* Sheet header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingBottom: 14,
          }}
        >
          <View>
            <Typography
              variant="h2"
              weight="bold"
              style={{ fontSize: 18, color: textCol }}
            >
              Nearby Facilities
            </Typography>
            <Typography
              variant="caption"
              style={{ color: subCol, fontSize: 12, marginTop: 2 }}
            >
              {isLoading
                ? "Searching…"
                : allMatchingClinics.length > 0
                  ? `${allMatchingClinics.length} result${allMatchingClinics.length !== 1 ? "s" : ""} found`
                  : clinicQuery
                    ? "No results found"
                    : "Enable location to search"}
            </Typography>
          </View>

          {/* Helpline CTA */}
          <TouchableOpacity
            onPress={() => Linking.openURL("tel:+234800MATERNAL")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: `${Theme.colors.primary}18`,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 22,
            }}
          >
            <Ionicons name="call" size={14} color={Theme.colors.primary} />
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: Theme.colors.primary, fontSize: 12 }}
            >
              Helpline
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: border,
            marginHorizontal: 20,
            marginBottom: 6,
          }}
        />

        {/* Clinic list */}
        <ScrollView
          ref={listScrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 6,
            paddingBottom: 48,
          }}
        >
          {/* Loading skeleton */}
          {isLoading && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 24,
              }}
            >
              <ActivityIndicator size="small" color={Theme.colors.primary} />
              <Typography variant="body" style={{ color: subCol }}>
                Searching nearby facilities…
              </Typography>
            </View>
          )}

          {/* Empty: no query */}
          {!clinicQuery && !isLocating && (
            <View style={{ alignItems: "center", paddingVertical: 36 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 24,
                  backgroundColor: `${Theme.colors.primary}15`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={34}
                  color={Theme.colors.primary}
                />
              </View>
              <Typography
                variant="body"
                style={{
                  color: subCol,
                  textAlign: "center",
                  lineHeight: 22,
                  fontSize: 14,
                }}
              >
                Turn on location or search your city{"\n"}to find nearby
                maternal care.
              </Typography>
            </View>
          )}

          {/* Empty: searched but no results */}
          {clinicQuery && !isLoading && allMatchingClinics.length === 0 && (
            <View style={{ alignItems: "center", paddingVertical: 36 }}>
              <Ionicons name="search-outline" size={40} color={subCol} />
              <Typography
                variant="body"
                style={{
                  color: subCol,
                  textAlign: "center",
                  marginTop: 12,
                  lineHeight: 22,
                }}
              >
                No clinics found here.{"\n"}Try a nearby city or expand your
                search.
              </Typography>
            </View>
          )}

          {/* Clinic cards */}
          {displayedClinics.map((clinic) => {
            const isSelected = selectedClinic?.id === clinic.id;
            const dist = userLocation
              ? distanceTo(
                  userLocation.coords.latitude,
                  userLocation.coords.longitude,
                  clinic.latitude,
                  clinic.longitude,
                )
              : null;

            return (
              <TouchableOpacity
                key={clinic.id}
                activeOpacity={0.82}
                onPress={() => handleClinicSelect(clinic)}
                style={{
                  flexDirection: "row",
                  backgroundColor: isSelected
                    ? `${Theme.colors.primary}12`
                    : cardBg,
                  borderRadius: 20,
                  padding: 14,
                  marginBottom: 10,
                  borderWidth: 1.5,
                  borderColor: isSelected
                    ? `${Theme.colors.primary}55`
                    : border,
                  shadowColor: "#000",
                  shadowOpacity: isSelected ? 0.07 : 0.03,
                  shadowRadius: 8,
                  elevation: isSelected ? 4 : 2,
                }}
              >
                {/* Facility icon */}
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: clinic.isEmergency
                      ? "#FEF2F2"
                      : isDark
                        ? "#1E293B"
                        : "#F8FAFC",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    flexShrink: 0,
                  }}
                >
                  <Ionicons
                    name={clinic.isEmergency ? "medical" : "business-outline"}
                    size={22}
                    color={clinic.isEmergency ? "#DC2626" : "#94A3B8"}
                  />
                </View>

                {/* Text info */}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h3"
                      weight="bold"
                      style={{
                        fontSize: 14,
                        color: textCol,
                        flex: 1,
                        marginRight: 6,
                        lineHeight: 19,
                      }}
                      numberOfLines={2}
                    >
                      {clinic.name}
                    </Typography>
                    {dist && (
                      <Typography
                        variant="caption"
                        style={{
                          color: Theme.colors.primary,
                          fontSize: 11,
                          fontWeight: "700",
                          marginTop: 2,
                        }}
                      >
                        {dist}
                      </Typography>
                    )}
                  </View>

                  <Typography
                    variant="caption"
                    style={{
                      color: subCol,
                      fontSize: 12,
                      marginTop: 3,
                      lineHeight: 16,
                    }}
                    numberOfLines={2}
                  >
                    {clinic.address}
                    {clinic.city && clinic.city !== "Nearby"
                      ? `, ${clinic.city}`
                      : ""}
                  </Typography>

                  {clinic.phone && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        Linking.openURL(`tel:${clinic.phone}`);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 5,
                      }}
                    >
                      <Ionicons
                        name="call-outline"
                        size={12}
                        color={Theme.colors.primary}
                      />
                      <Typography
                        variant="caption"
                        style={{ color: Theme.colors.primary, fontSize: 11 }}
                      >
                        {clinic.phone}
                      </Typography>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Directions button */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleOpenMaps(clinic);
                  }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: Theme.colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    marginLeft: 10,
                    flexShrink: 0,
                  }}
                >
                  <Ionicons name="navigate" size={17} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {/* Show more / less */}
          {allMatchingClinics.length > 6 && (
            <TouchableOpacity
              onPress={() => setShowAll((v) => !v)}
              style={{ alignItems: "center", paddingVertical: 14 }}
            >
              <Typography
                variant="body"
                weight="bold"
                style={{ color: Theme.colors.primary, fontSize: 14 }}
              >
                {showAll
                  ? "Show Less"
                  : `Show ${allMatchingClinics.length - 6} More`}
              </Typography>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
