import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Linking, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import apiClient from "../api/client";
import { AppHeader, Banner, Button, Card, FONT, Page, Skeleton, T, useTokens } from "../components/ds";
import { linkErrorMessage, normaliseFacilityCode } from "../services/facilityLink";

// Same screen as maternalert-web/src/app/(patient)/facility-linking/page.tsx
// Uses apiClient (bearer token). The old screen used fetch() without the
// token, so linking always failed in the app.

interface LinkStatus {
  linked: boolean;
  facilityName?: string;
  facilityAddress?: string;
  facilityPhone?: string;
  patientCode?: string;
  linkedAt?: string;
}

function Scanner({ onScan, onClose, busy }: { onScan: (v: string) => void; onClose: () => void; busy: boolean }) {
  const done = useRef(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => {
          if (done.current || busy) return;
          done.current = true;
          onScan(data);
        }}
      >
        <View style={{ padding: 16 }}>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close the scanner"
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(0,0,0,0.55)", alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 24 }}>
          {busy ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <View style={{ width: 230, height: 230, borderRadius: 24, borderWidth: 3, borderColor: "rgba(255,255,255,0.9)" }} />
          )}
          <View style={{ backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10, maxWidth: 300 }}>
            <Text style={{ color: "#fff", textAlign: "center", fontFamily: FONT.medium, fontSize: 16 }}>
              {busy ? "Linking…" : "Point the camera at your clinic's MaternAlert QR code"}
            </Text>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

export default function FacilityLinkingScreen() {
  const router = useRouter();
  const t = useTokens();
  const fromSetup = useLocalSearchParams<{ from?: string }>().from === "setup";
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<LinkStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [code, setCode] = useState("");
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justLinked, setJustLinked] = useState(false);
  const [confirmUnlink, setConfirmUnlink] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/facilities/link-status");
      setStatus(res.data);
    } catch {
      setStatus({ linked: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startScan = async () => {
    setError(null);
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setError(
          res.canAskAgain
            ? "MaternAlert needs the camera to scan the QR code. You can type the clinic code instead."
            : "Camera access is off for MaternAlert. Turn it on in your phone settings, or type the clinic code instead.",
        );
        return;
      }
    }
    setScanning(true);
  };

  const link = async (raw: string) => {
    const value = normaliseFacilityCode(raw);
    if (!value) {
      setScanning(false);
      setError("That doesn't look like a clinic code. It has 8 letters and numbers, for example 3FA85F64.");
      return;
    }
    setLinking(true);
    setError(null);
    try {
      await apiClient.post("/facilities/link-via-qr", { token: value });
      setJustLinked(true);
      setScanning(false);
      await load();
    } catch (err) {
      setScanning(false);
      setError(linkErrorMessage(err));
    } finally {
      setLinking(false);
    }
  };

  const unlink = async () => {
    try {
      await apiClient.delete("/facilities/unlink");
      setConfirmUnlink(false);
      setJustLinked(false);
      await load();
    } catch {
      setError("We couldn't unlink you. Check your internet and try again.");
    }
  };

  if (scanning) return <Scanner onScan={link} onClose={() => setScanning(false)} busy={linking} />;

  const finish = () => router.replace("/(tabs)");

  return (
    <Page>
      <AppHeader title="Your clinic" subtitle={fromSetup ? "Last step" : undefined} onBack={fromSetup ? undefined : () => router.back()} />

      {loading ? (
        <View style={{ gap: 12 }}>
          <Skeleton height={160} />
          <Skeleton height={120} />
        </View>
      ) : status?.linked ? (
        <>
          {justLinked ? (
            <Banner tone="green" icon="checkmark-circle-outline">
              You're linked. Your clinic can now see your readings and will get your emergency alerts.
            </Banner>
          ) : null}
          <Card>
            <View style={{ flexDirection: "row", gap: 14 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.mint, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="business-outline" size={20} color={t.greenInk} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <T variant="label">Linked clinic</T>
                <T variant="h2">{status.facilityName ?? ""}</T>
                {status.facilityAddress ? <T variant="small">{status.facilityAddress}</T> : null}
                {status.linkedAt ? (
                  <T variant="small">
                    {`Since ${new Date(status.linkedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
                  </T>
                ) : null}
              </View>
            </View>
            {status.patientCode ? (
              <View style={{ marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: t.surface2, gap: 4 }}>
                <T variant="small">Your patient code</T>
                <Text style={{ fontFamily: FONT.bold, fontSize: 24, letterSpacing: 2, color: t.ink }} selectable>
                  {status.patientCode}
                </Text>
                <T variant="small">Tell this to the nurse so they can find your record quickly.</T>
              </View>
            ) : null}
            {status.facilityPhone ? (
              <View style={{ marginTop: 16 }}>
                <Button block variant="secondary" href={`tel:${status.facilityPhone}`} icon={(c) => <Ionicons name="call-outline" size={18} color={c} />}>
                  Call the clinic
                </Button>
              </View>
            ) : null}
          </Card>

          {fromSetup || justLinked ? (
            <Button size="lg" block onPress={finish}>
              Go to my home page
            </Button>
          ) : null}

          {!fromSetup ? (
            confirmUnlink ? (
              <Card flat>
                <T>{`Unlink from ${status.facilityName}? They will stop seeing your readings and won't get your emergency alerts.`}</T>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                  <View style={{ flex: 1 }}>
                    <Button block variant="danger" onPress={unlink}>
                      Unlink
                    </Button>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button block variant="secondary" onPress={() => setConfirmUnlink(false)}>
                      Keep linked
                    </Button>
                  </View>
                </View>
              </Card>
            ) : (
              <Pressable onPress={() => setConfirmUnlink(true)} accessibilityRole="button" style={{ alignSelf: "center", minHeight: 44, justifyContent: "center" }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 15, color: t.greenInk }}>Moved clinic? Unlink</Text>
              </Pressable>
            )
          ) : null}
        </>
      ) : (
        <>
          <Card>
            <T variant="h2">Link to your antenatal clinic</T>
            <View style={{ gap: 12, marginTop: 14 }}>
              {[
                { icon: "medkit-outline", text: "Your midwife sees your blood pressure and symptoms between visits." },
                { icon: "notifications-outline", text: "Your clinic is alerted straight away if you press the emergency button." },
                { icon: "shield-checkmark-outline", text: "Only your clinic can see your information." },
              ].map((b) => (
                <View key={b.text} style={{ flexDirection: "row", gap: 12 }}>
                  <Ionicons name={b.icon as any} size={20} color={t.greenInk} style={{ marginTop: 2 }} />
                  <T style={{ flex: 1 }}>{b.text}</T>
                </View>
              ))}
            </View>
          </Card>

          <Button size="lg" block onPress={startScan} disabled={linking} icon={(c) => <Ionicons name="qr-code-outline" size={20} color={c} />}>
            Scan the clinic's QR code
          </Button>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
            <T variant="small">or type the clinic code</T>
            <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              accessibilityLabel="Clinic code"
              value={code}
              onChangeText={(v) => setCode(v.toUpperCase())}
              placeholder="3FA85F64"
              placeholderTextColor={t.muted}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={40}
              returnKeyType="go"
              onSubmitEditing={() => link(code)}
              style={{
                flex: 1,
                fontFamily: FONT.semibold,
                fontSize: 18,
                letterSpacing: 2,
                color: t.ink,
                backgroundColor: t.surface,
                borderWidth: 1.5,
                borderColor: t.borderStrong,
                borderRadius: 14,
                paddingHorizontal: 14,
                minHeight: 48,
              }}
            />
            <Button onPress={() => link(code)} loading={linking} disabled={linking || code.trim().length < 6}>
              Link
            </Button>
          </View>
          <T variant="small">
            Ask a nurse or midwife at your clinic for the QR code or the 8-character code. It's on their MaternAlert dashboard.
          </T>

          {error ? (
            <View style={{ gap: 8 }}>
              <Banner tone="red">{error}</Banner>
              {/settings/.test(error) ? (
                <Button variant="secondary" onPress={() => Linking.openSettings()}>
                  Open settings
                </Button>
              ) : null}
            </View>
          ) : null}

          {fromSetup ? (
            <Button variant="secondary" block onPress={finish}>
              Skip for now
            </Button>
          ) : null}
        </>
      )}
    </Page>
  );
}
