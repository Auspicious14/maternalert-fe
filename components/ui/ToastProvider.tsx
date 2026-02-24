import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  message: string;
  type?: ToastType;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const hide = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
  }, [opacity]);

  const showToast = useCallback(
    ({ message, type = "info" }: ToastOptions) => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      setToast({ message, type });
      opacity.setValue(0);
      translateY.setValue(40);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
      hideTimeout.current = setTimeout(hide, 3500);
    },
    [hide, opacity, translateY]
  );

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  const getVisuals = () => {
    if (!toast) {
      return { backgroundColor: "transparent", icon: "information-circle" as const };
    }
    if (toast.type === "success") {
      return { backgroundColor: "rgba(45, 228, 116, 0.95)", icon: "checkmark-circle" as const };
    }
    if (toast.type === "error") {
      return { backgroundColor: "rgba(255, 75, 75, 0.95)", icon: "alert-circle" as const };
    }
    return { backgroundColor: "rgba(26, 33, 46, 0.95)", icon: "information-circle" as const };
  };

  const { backgroundColor, icon } = getVisuals();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.container,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={hide}>
            <View style={[styles.toast, { backgroundColor }]}>
              <Ionicons name={icon} size={20} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.text}>{toast.message}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  toast: {
    minWidth: "70%",
    maxWidth: "90%",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    flexShrink: 1,
  },
});
