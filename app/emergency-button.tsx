import React, { useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "../components/shared/Typography";
import { useColorScheme } from "../hooks/use-color-scheme";
import Theme from "../constants/theme";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  ALERT_SENT_MESSAGE,
  showEmergencyFallback,
  triggerEmergencyAlert,
} from "../services/emergencyAlert";
 
interface EmergencyButtonProps {
  /** Pass as floating button on any screen */
  floating?: boolean;
}
 
export function EmergencyButton({ floating = false }: EmergencyButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [modalVisible, setModalVisible] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const { profile } = useUserProfile();

  async function confirmAndTrigger() {
    setTriggering(true);
    const ok = await triggerEmergencyAlert();
    setTriggering(false);
    if (ok) {
      setTriggered(true);
    } else {
      setModalVisible(false);
      showEmergencyFallback(profile?.emergencyContactPhone);
    }
  }
 
  if (floating) {
    return (
      <>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            position: "absolute",
            bottom: 90,
            right: 20,
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#DC2626",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#DC2626",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
            zIndex: 999,
          }}
        >
          <Ionicons name="warning" size={28} color="#fff" />
        </TouchableOpacity>
 
        <EmergencyModal
          visible={modalVisible}
          triggered={triggered}
          triggering={triggering}
          onConfirm={confirmAndTrigger}
          onClose={() => {
            setModalVisible(false);
            setTriggered(false);
          }}
        />
      </>
    );
  }
 
  // Full screen version
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? Theme.colors.darkBg : "#F9FAFB",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <EmergencyContent
        triggered={triggered}
        triggering={triggering}
        onPress={() => setModalVisible(true)}
      />
      <EmergencyModal
        visible={modalVisible}
        triggered={triggered}
        triggering={triggering}
        onConfirm={confirmAndTrigger}
        onClose={() => {
          setModalVisible(false);
          setTriggered(false);
        }}
      />
    </SafeAreaView>
  );
}
 
function EmergencyContent({
  triggered,
  triggering,
  onPress,
}: {
  triggered: boolean;
  triggering: boolean;
  onPress: () => void;
}) {
  if (triggered) {
    return (
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#DCFCE7",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Ionicons name="checkmark-circle" size={56} color="#16A34A" />
        </View>
        <Typography
          variant="h2"
          weight="bold"
          style={{ textAlign: "center", marginBottom: 12 }}
        >
          Alert Sent
        </Typography>
        <Typography
          variant="body"
          style={{ color: "#64748B", textAlign: "center", lineHeight: 24 }}
        >
          {ALERT_SENT_MESSAGE}
        </Typography>
      </View>
    );
  }
 
  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={triggering}
        style={{
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: "#DC2626",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
          shadowColor: "#DC2626",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        {triggering ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <Ionicons name="warning" size={56} color="#fff" />
          </>
        )}
      </TouchableOpacity>
 
      <Typography
        variant="h2"
        weight="bold"
        style={{ textAlign: "center", marginBottom: 8 }}
      >
        Emergency Help
      </Typography>
      <Typography
        variant="body"
        style={{ color: "#64748B", textAlign: "center", lineHeight: 24 }}
      >
        Tap the button to immediately alert your emergency contact and
        health facility.
      </Typography>
    </View>
  );
}
 
function EmergencyModal({
  visible,
  triggered,
  triggering,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  triggered: boolean;
  triggering: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (triggered) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 32,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="checkmark-circle"
              size={64}
              color="#16A34A"
              style={{ marginBottom: 16 }}
            />
            <Typography
              variant="h2"
              weight="bold"
              style={{ textAlign: "center", marginBottom: 8 }}
            >
              Alert Sent Successfully
            </Typography>
            <Typography
              variant="body"
              style={{
                color: "#64748B",
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 22,
              }}
            >
              {ALERT_SENT_MESSAGE}
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "#16A34A",
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 32,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Typography variant="body" weight="bold" style={{ color: "#fff" }}>
                OK
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
 
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 32,
            width: "100%",
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#FEE2E2",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              alignSelf: "center",
            }}
          >
            <Ionicons name="warning" size={36} color="#DC2626" />
          </View>
 
          <Typography
            variant="h2"
            weight="bold"
            style={{ textAlign: "center", marginBottom: 8 }}
          >
            Send Emergency Alert?
          </Typography>
          <Typography
            variant="body"
            style={{
              color: "#64748B",
              textAlign: "center",
              marginBottom: 24,
              lineHeight: 22,
            }}
          >
            This will immediately notify your emergency contact and health
            facility via WhatsApp and SMS. Only use this in a real emergency.
          </Typography>
 
          <TouchableOpacity
            onPress={onConfirm}
            disabled={triggering}
            style={{
              backgroundColor: "#DC2626",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {triggering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography variant="h3" weight="bold" style={{ color: "#fff" }}>
                Yes, Send Alert Now
              </Typography>
            )}
          </TouchableOpacity>
 
          <TouchableOpacity
            onPress={onClose}
            style={{
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Typography variant="body" style={{ color: "#64748B" }}>
              Cancel
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
