import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONT, useTokens } from "../ds";

/**
 * Same toast as the website (src/components/ui/ToastProvider.tsx): a card
 * above the tab bar with a coloured edge and icon, readable for long
 * messages, light and dark. Tap × (or the card) to close.
 */

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  message: string;
  type?: ToastType;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ICON: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark",
  error: "alert-circle-outline",
  info: "information-circle-outline",
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 12, duration: 180, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const showToast = useCallback(
    ({ message, type = "info" }: ToastOptions) => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      setToast({ message, type });
      opacity.setValue(0);
      translateY.setValue(16);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 220, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
      ]).start();
      AccessibilityInfo.announceForAccessibility?.(message);
      // Longer messages stay longer (about 4 s plus reading time).
      hideTimeout.current = setTimeout(hide, Math.min(9000, 3500 + message.length * 45));
    },
    [hide, opacity, translateY],
  );

  useEffect(() => () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
  }, []);

  const colors =
    toast?.type === "error"
      ? { accent: t.red, iconBg: t.redBg, icon: t.redInk }
      : toast?.type === "info"
        ? { accent: t.amber, iconBg: t.amberBg, icon: t.amberInk }
        : { accent: t.green, iconBg: t.mint, icon: t.greenInk };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.region, { bottom: 92 + insets.bottom, opacity, transform: [{ translateY }] }]}
        >
          <Pressable
            onPress={hide}
            accessibilityRole={toast.type === "error" ? "alert" : "text"}
            accessibilityLiveRegion={toast.type === "error" ? "assertive" : "polite"}
            style={[
              styles.toast,
              { backgroundColor: t.surface, borderColor: t.border, borderLeftColor: colors.accent },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: colors.iconBg }]}>
              <Ionicons name={ICON[toast.type]} size={18} color={colors.icon} />
            </View>
            <Text style={[styles.text, { color: t.ink }]}>{toast.message}</Text>
            <View style={styles.close} accessibilityLabel="Close" accessibilityRole="button">
              <Ionicons name="close" size={18} color={t.muted} />
            </View>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};

const styles = StyleSheet.create({
  region: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  toast: {
    width: "100%",
    maxWidth: 480,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 5,
    shadowColor: "#0F241C",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  icon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  text: { flex: 1, marginTop: 5, fontFamily: FONT.medium, fontSize: 15, lineHeight: 21 },
  close: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
});
