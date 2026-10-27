import { Ionicons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, Pressable, Text, TextInput, View } from "react-native";

import { TokenStorage } from "../api/storage";
import { AppHeader, Banner, Button, FONT, Page, Pill, Skeleton, T, useTokens } from "../components/ds";
import {
  ClinicLocation,
  directionsUrl,
  formatDistance,
  useClinicDetails,
  useClinics,
} from "../hooks/useClinics";
import { EMERGENCY_LINE } from "../services/emergencyAlert";

// Same screen as maternalert-web/src/app/(patient)/clinic-finder/page.tsx

type Coords = { latitude: number; longitude: number };
type LocState = "idle" | "locating" | "ready" | "denied";
type Filter = "all" | "hospital" | "clinic";

function FacilityCard({ clinic }: { clinic: ClinicLocation }) {
  const t = useTokens();
  const [wantDetails, setWantDetails] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const { data: details, isFetching } = useClinicDetails(wantDetails ? clinic.placeId : null);
  const phone = clinic.phone ?? details?.phone ?? details?.internationalPhone;
  const distance = formatDistance(clinic.distanceKm);

  return (
    <View
      style={{
        backgroundColor: t.surface,
        borderColor: t.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        gap: 14,
      }}
    >
      <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: t.mint,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="location-outline" size={20} color={t.greenInk} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontFamily: FONT.semibold, fontSize: 16, lineHeight: 21, color: t.ink }}>{clinic.name}</Text>
          <T variant="small">{clinic.address}</T>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {clinic.kind === "hospital" ? <Pill tone="green">Hospital</Pill> : <Pill>Clinic</Pill>}
            {clinic.maternity ? <Pill tone="green">Maternity</Pill> : null}
            {details?.openNow === true ? <Pill tone="green">Open now</Pill> : null}
            {details?.openNow === false ? <Pill tone="amber">Closed now</Pill> : null}
          </View>
        </View>
        {distance ? (
          <Text style={{ fontFamily: FONT.semibold, fontSize: 14, color: t.ink2, paddingTop: 2 }}>{distance}</Text>
        ) : null}
      </View>

      {details?.hours && details.hours.length > 0 ? (
        <View>
          <Pressable
            onPress={() => setShowHours((v) => !v)}
            accessibilityRole="button"
            accessibilityState={{ expanded: showHours }}
            style={{ flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 }}
          >
            <Ionicons name="time-outline" size={18} color={t.greenInk} />
            <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>Opening hours</Text>
            <Ionicons name={showHours ? "chevron-up" : "chevron-down"} size={16} color={t.greenInk} />
          </Pressable>
          {showHours
            ? details.hours.map((h) => (
                <T key={h} variant="small" style={{ paddingLeft: 26 }}>
                  {h}
                </T>
              ))
            : null}
        </View>
      ) : null}
      {wantDetails && !isFetching && !phone && clinic.placeId ? (
        <T variant="small">No phone number listed for this facility.</T>
      ) : null}

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Button
            size="sm"
            block
            href={directionsUrl(clinic)}
            icon={(c) => <Ionicons name="navigate-outline" size={16} color={c} />}
          >
            Directions
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          {phone ? (
            <Button
              size="sm"
              block
              variant="secondary"
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              icon={(c) => <Ionicons name="call-outline" size={16} color={c} />}
            >
              Call
            </Button>
          ) : clinic.placeId && (!wantDetails || isFetching) ? (
            <Button
              size="sm"
              block
              variant="secondary"
              loading={isFetching}
              onPress={() => setWantDetails(true)}
              icon={(c) => <Ionicons name="call-outline" size={16} color={c} />}
            >
              Get phone
            </Button>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function ClinicFinderScreen() {
  const router = useRouter();
  const t = useTokens();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locState, setLocState] = useState<LocState>("idle");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showAll, setShowAll] = useState(false);

  const locate = async () => {
    setLocState((prev) => (prev === "ready" ? "ready" : "locating"));
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocState((prev) => (prev === "ready" ? "ready" : "denied"));
        return;
      }
      const loc = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
      const c = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setCoords(c);
      setLocState("ready");
      TokenStorage.saveLastLocation(c).catch(() => undefined);
    } catch {
      // Keep showing results for the last known location if a fresh fix fails.
      setLocState((prev) => (prev === "ready" ? "ready" : "idle"));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const cached = await TokenStorage.getLastLocation();
        if (cached) {
          setCoords({ latitude: cached.latitude, longitude: cached.longitude });
          setLocState("ready");
        }
      } catch {
        // ignore
      }
      locate();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const params = useMemo(() => {
    const point = coords
      ? { lat: Math.round(coords.latitude * 1000) / 1000, lng: Math.round(coords.longitude * 1000) / 1000 }
      : {};
    if (query) return { q: query, ...point };
    if (coords) return { ...point, radius: 10000 };
    return null;
  }, [coords, query]);

  const { data, isLoading, isError, refetch } = useClinics(params, Boolean(params));
  const all = data ?? [];
  const counts = {
    all: all.length,
    hospital: all.filter((c) => c.kind === "hospital").length,
    clinic: all.filter((c) => c.kind !== "hospital").length,
  };
  const filtered = all.filter((c) =>
    filter === "all" ? true : filter === "hospital" ? c.kind === "hospital" : c.kind !== "hospital",
  );
  const shown = showAll ? filtered : filtered.slice(0, 8);
  const fromGoogle = all.some((c) => c.source === "google");
  const fromOsm = all.some((c) => c.source === "osm");

  const submit = () => {
    if (input.trim().length < 2) return;
    setQuery(input.trim());
    setShowAll(false);
  };

  return (
    <Page>
      <AppHeader
        title="Find a health facility"
        subtitle={query ? `Results for "${query}"` : coords ? "Closest to you first" : "Hospitals and clinics near you"}
        onBack={() => router.back()}
      />

      <Banner tone="red">
        {`In an emergency, go to a hospital rather than a small clinic, or call ${EMERGENCY_LINE}.`}
      </Banner>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Ionicons
            name="search"
            size={18}
            color={t.muted}
            style={{ position: "absolute", left: 14, zIndex: 1 }}
          />
          <TextInput
            accessibilityLabel="Search a town or facility name"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={submit}
            returnKeyType="search"
            maxLength={80}
            placeholder="Town or facility name"
            placeholderTextColor={t.muted}
            style={{
              fontFamily: FONT.regular,
              fontSize: 16,
              color: t.ink,
              backgroundColor: t.surface,
              borderColor: t.borderStrong,
              borderWidth: 1.5,
              borderRadius: 14,
              paddingLeft: 42,
              paddingRight: 14,
              minHeight: 48,
            }}
          />
        </View>
        {query ? (
          <Pressable
            onPress={() => {
              setInput("");
              setQuery("");
            }}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: t.border,
              backgroundColor: t.surface,
            }}
          >
            <Ionicons name="close" size={20} color={t.ink} />
          </Pressable>
        ) : (
          <Button size="sm" onPress={submit} disabled={input.trim().length < 2}>
            Search
          </Button>
        )}
      </View>

      {locState !== "ready" && !query ? (
        <View
          style={{ backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, borderRadius: 20, padding: 16, gap: 12 }}
        >
          <T>
            {locState === "locating"
              ? "Finding where you are…"
              : locState === "denied"
                ? "Location permission is off. Allow it in your phone settings, or search your town above."
                : "Share your location to see the nearest facilities, or search your town above."}
          </T>
          {locState === "denied" ? (
            <Button variant="secondary" onPress={() => Linking.openSettings()}>
              Open settings
            </Button>
          ) : locState === "idle" ? (
            <Button
              variant="secondary"
              onPress={locate}
              icon={(c) => <Ionicons name="locate-outline" size={18} color={c} />}
            >
              Use my location
            </Button>
          ) : null}
        </View>
      ) : null}

      {params && all.length > 0 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }} accessibilityRole="radiogroup">
          {(
            [
              ["all", `All (${counts.all})`],
              ["hospital", `Hospitals (${counts.hospital})`],
              ["clinic", `Clinics (${counts.clinic})`],
            ] as [Filter, string][]
          ).map(([id, label]) => {
            const on = filter === id;
            return (
              <Pressable
                key={id}
                onPress={() => setFilter(id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                style={{
                  minHeight: 44,
                  paddingHorizontal: 16,
                  borderRadius: 999,
                  borderWidth: 1.5,
                  justifyContent: "center",
                  borderColor: on ? t.green : t.borderStrong,
                  backgroundColor: on ? t.green : t.surface,
                }}
              >
                <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: on ? "#FFFFFF" : t.ink2 }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {params && isLoading ? (
        <View style={{ gap: 12 }}>
          <Skeleton height={140} />
          <Skeleton height={140} />
          <Skeleton height={140} />
        </View>
      ) : null}

      {params && isError ? (
        <View style={{ gap: 10 }}>
          <Banner tone="amber">We couldn't load facilities. Check your internet and try again.</Banner>
          <Button variant="secondary" onPress={() => refetch()}>
            Try again
          </Button>
        </View>
      ) : null}

      {params && !isLoading && !isError && filtered.length === 0 ? (
        <View style={{ backgroundColor: t.surface, borderColor: t.border, borderWidth: 1, borderRadius: 20, padding: 16 }}>
          <T>
            {query
              ? `Nothing found for "${query}". Try the name of your town or LGA.`
              : "No facilities found within 10 km. Search your town or the nearest big town."}
          </T>
        </View>
      ) : null}

      {shown.map((c) => (
        <FacilityCard key={c.id} clinic={c} />
      ))}

      {filtered.length > shown.length ? (
        <Button variant="secondary" block onPress={() => setShowAll(true)}>
          {`Show ${filtered.length - shown.length} more`}
        </Button>
      ) : null}

      {all.length > 0 ? (
        <T variant="small" style={{ textAlign: "center" }}>
          {fromGoogle ? "Results from Google Maps. " : fromOsm ? "Map data © OpenStreetMap contributors. " : ""}
          "Maternity" is based on the facility name. Call ahead to confirm they can see you.
        </T>
      ) : null}
    </Page>
  );
}
