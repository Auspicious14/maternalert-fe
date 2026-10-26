import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button } from "../components/shared/Button";
import { Screen } from "../components/shared/Screen";
import { Typography } from "../components/shared/Typography";
import { useToast } from "../components/ui/ToastProvider";
import Theme from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useAuth } from "../hooks/useAuth";

const API = process.env.EXPO_PUBLIC_API_URL ?? "";

type ActiveScreen = "HOME" | "SCANNING" | "SUCCESS" | "ALREADY_LINKED";

interface LinkResult {
  facilityId: string;
  facilityName: string;
  patientCode: string;
  alreadyLinked: boolean;
}

interface LinkStatus {
  linked: boolean;
  facilityName?: string;
  facilityAddress?: string;
  facilityPhone?: string;
  patientCode?: string;
  linkedAt?: string;
}

export default function FacilityLinkingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  // const { user } = useAuth();
  const { showToast } = useToast();

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("HOME");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [linking, setLinking] = useState(false);
  const [result, setResult] = useState<LinkResult | null>(null);
  const [linkStatus, setLinkStatus] = useState<LinkStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const bg = isDark ? Theme.colors.darkBg : "#FBF7F2";
  const cardBg = isDark ? "#0F172A" : "#FFFFFF";
  const textMuted = isDark ? "#94A3B8" : "#64748B";
  const textPrimary = isDark ? "#FFFFFF" : "#0F241C";

  useEffect(() => {
    fetchLinkStatus();
  }, []);

  async function fetchLinkStatus() {
    setLoadingStatus(true);
    try {
      const res = await fetch(`${API}/facilities/link-status`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setLinkStatus(data);
      }
    } catch {
      // Non-critical — show unlinked state
    } finally {
      setLoadingStatus(false);
    }
  }

  async function startScanning() {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Camera Permission Required",
          "MaternAlert needs camera access to scan the QR code from your health worker.",
          [{ text: "OK" }],
        );
        return;
      }
    }
    setScanned(false);
    setActiveScreen("SCANNING");
  }

  async function handleBarCodeScanned({ data: token }: { data: string }) {
    if (scanned || linking) return;
    setScanned(true);
    setLinking(true);

    try {
      const res = await fetch(`${API}/facilities/link-via-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          res.status === 401
            ? "This QR code has expired. Ask your health worker to generate a new one."
            : res.status === 409
              ? data.message
              : "Could not link to facility. Please try again.";

        Alert.alert("Link Failed", message, [
          {
            text: "Try Again",
            onPress: () => {
              setScanned(false);
              setLinking(false);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setActiveScreen("HOME"),
          },
        ]);
        return;
      }

      setResult(data);
      setActiveScreen(data.alreadyLinked ? "ALREADY_LINKED" : "SUCCESS");
      fetchLinkStatus();
    } catch {
      Alert.alert(
        "Connection Error",
        "Could not reach the server. Check your internet connection.",
        [
          {
            text: "Retry",
            onPress: () => {
              setScanned(false);
              setLinking(false);
            },
          },
        ],
      );
    } finally {
      setLinking(false);
    }
  }

  async function handleUnlink() {
    Alert.alert(
      "Unlink Facility",
      `Are you sure you want to unlink from ${linkStatus?.facilityName}? Your health worker will no longer be able to monitor you.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API}/facilities/unlink`, {
                method: "DELETE",
                credentials: "include",
              });
              if (res.ok) {
                setLinkStatus({ linked: false });
                showToast({ type: "success", message: "Facility unlinked" });
              } else {
                showToast({ type: "error", message: "Failed to unlink. Try again." });
              }
            } catch {
              showToast({ type: "error", message: "Failed to unlink. Try again." });
            }
          },
        },
      ],
    );
  }

  // ── SCANNING ─────────────────────────────────────────────────────────────
  if (activeScreen === "SCANNING") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        >
          {/* Close button */}
          <View style={{ paddingTop: 16, paddingHorizontal: 20 }}>
            <TouchableOpacity
              onPress={() => setActiveScreen("HOME")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Viewfinder */}
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {linking ? (
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.75)",
                  borderRadius: 20,
                  padding: 32,
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
                <Typography variant="body" style={{ color: "#fff" }}>
                  Linking to facility…
                </Typography>
              </View>
            ) : (
              <>
                {/* Corner brackets */}
                <View style={{ width: 220, height: 220, position: "relative" }}>
                  {[
                    { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
                    { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
                    { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
                    { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
                  ].map((style, i) => (
                    <View
                      key={i}
                      style={{
                        position: "absolute",
                        width: 40,
                        height: 40,
                        borderColor: "#fff",
                        ...style,
                      }}
                    />
                  ))}
                </View>
                <View
                  style={{
                    marginTop: 28,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 12,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                >
                  <Typography
                    variant="body"
                    style={{ color: "#fff", textAlign: "center" }}
                  >
                    Point camera at the QR code from your health worker
                  </Typography>
                </View>
              </>
            )}
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if (activeScreen === "SUCCESS" && result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <Screen backgroundColor={bg}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#DCFCE7",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Ionicons name="checkmark-circle" size={48} color="#16A34A" />
            </View>

            <Typography
              variant="h2"
              weight="bold"
              style={{ textAlign: "center", marginBottom: 8 }}
            >
              You're linked!
            </Typography>
            <Typography
              variant="body"
              style={{ color: textMuted, textAlign: "center", marginBottom: 32 }}
            >
              Your health worker at{" "}
              <Typography variant="body" weight="bold">
                {result.facilityName}
              </Typography>{" "}
              can now monitor your progress.
            </Typography>

            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 20,
                padding: 20,
                width: "100%",
                marginBottom: 32,
              }}
            >
              <Typography
                variant="caption"
                style={{ color: textMuted, marginBottom: 4 }}
              >
                Your Patient Code
              </Typography>
              <Typography
                variant="h2"
                weight="bold"
                style={{ letterSpacing: 4, marginBottom: 8 }}
              >
                {result.patientCode}
              </Typography>
              <Typography variant="caption" style={{ color: textMuted }}>
                Share this with your health worker if they ask for it.
              </Typography>
            </View>

            <Button
              title="Done"
              containerStyle={{ width: "100%", height: 60, borderRadius: 30 }}
              onPress={() => router.back()}
            />
          </View>
        </Screen>
      </SafeAreaView>
    );
  }

  // ── ALREADY LINKED ────────────────────────────────────────────────────────
  if (activeScreen === "ALREADY_LINKED" && result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <Screen backgroundColor={bg}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
            }}
          >
            <Ionicons
              name="information-circle"
              size={64}
              color="#3B82F6"
              style={{ marginBottom: 24 }}
            />
            <Typography
              variant="h2"
              weight="bold"
              style={{ textAlign: "center", marginBottom: 8 }}
            >
              Already linked
            </Typography>
            <Typography
              variant="body"
              style={{ color: textMuted, textAlign: "center", marginBottom: 32 }}
            >
              You're already connected to {result.facilityName}. No changes were made.
            </Typography>
            <Button
              title="Go Back"
              containerStyle={{ width: "100%", height: 60, borderRadius: 30 }}
              onPress={() => router.back()}
            />
          </View>
        </Screen>
      </SafeAreaView>
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <Screen backgroundColor={bg}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 4,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color={textPrimary} />
          </TouchableOpacity>
          <Typography
            variant="h3"
            weight="bold"
            style={{ marginLeft: 14, fontSize: 18 }}
          >
            Facility Link
          </Typography>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 32 }}>
          {loadingStatus ? (
            <View style={{ alignItems: "center", paddingTop: 48 }}>
              <ActivityIndicator color={textPrimary} />
            </View>
          ) : linkStatus?.linked ? (
            // ── CURRENTLY LINKED ──
            <>
              {/* Linked badge */}
              <View
                style={{
                  backgroundColor: "#DCFCE7",
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Ionicons name="checkmark-circle" size={32} color="#16A34A" />
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    style={{ color: "#0A5C43", marginBottom: 2 }}
                  >
                    Linked to
                  </Typography>
                  <Typography
                    variant="h3"
                    weight="bold"
                    style={{ color: "#14532D" }}
                  >
                    {linkStatus.facilityName}
                  </Typography>
                  {linkStatus.facilityAddress ? (
                    <Typography
                      variant="caption"
                      style={{ color: "#16A34A", marginTop: 2 }}
                    >
                      {linkStatus.facilityAddress}
                    </Typography>
                  ) : null}
                </View>
              </View>

              {/* Patient code card */}
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 24,
                }}
              >
                <Typography
                  variant="caption"
                  style={{ color: textMuted, marginBottom: 4 }}
                >
                  Your Patient Code
                </Typography>
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{ letterSpacing: 4, marginBottom: 8 }}
                >
                  {linkStatus.patientCode}
                </Typography>
                {linkStatus.linkedAt ? (
                  <Typography variant="caption" style={{ color: textMuted }}>
                    Linked on{" "}
                    {new Date(linkStatus.linkedAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>
                ) : null}
              </View>

              {/* Unlink */}
              <TouchableOpacity
                onPress={handleUnlink}
                style={{
                  borderWidth: 1,
                  borderColor: "#FCA5A5",
                  borderRadius: 16,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body"
                  weight="bold"
                  style={{ color: "#DC2626" }}
                >
                  Unlink from this facility
                </Typography>
              </TouchableOpacity>
            </>
          ) : (
            // ── NOT LINKED ──
            <>
              <Typography
                variant="h1"
                weight="bold"
                style={{ fontSize: 30, marginBottom: 12, lineHeight: 38 }}
              >
                Connect with your clinic
              </Typography>
              <Typography
                variant="body"
                style={{ color: textMuted, marginBottom: 40, lineHeight: 24 }}
              >
                Scan the QR code from your health worker to let them monitor
                your pregnancy and send you timely alerts.
              </Typography>

              {/* Primary CTA */}
              <TouchableOpacity
                onPress={startScanning}
                style={{
                  backgroundColor: textPrimary,
                  borderRadius: 24,
                  paddingVertical: 20,
                  paddingHorizontal: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={26}
                  color={isDark ? "#0F241C" : "#fff"}
                />
                <Typography
                  variant="h3"
                  weight="bold"
                  style={{
                    color: isDark ? "#0F241C" : "#fff",
                    fontSize: 17,
                  }}
                >
                  Scan QR Code
                </Typography>
              </TouchableOpacity>

              {/* How it works */}
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 20,
                  padding: 20,
                  gap: 16,
                }}
              >
                <Typography
                  variant="caption"
                  style={{
                    color: textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  How it works
                </Typography>
                {[
                  {
                    icon: "person-outline",
                    text: "Visit your health facility for your next antenatal appointment",
                  },
                  {
                    icon: "qr-code-outline",
                    text: "Ask your nurse or midwife to show you the facility QR code",
                  },
                  {
                    icon: "phone-portrait-outline",
                    text: "Scan it here — you'll be linked instantly",
                  },
                ].map((step, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={step.icon as any}
                        size={18}
                        color={textMuted}
                      />
                    </View>
                    <Typography
                      variant="body"
                      style={{ flex: 1, color: textMuted, lineHeight: 22 }}
                    >
                      {step.text}
                    </Typography>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </Screen>
    </SafeAreaView>
  );
}