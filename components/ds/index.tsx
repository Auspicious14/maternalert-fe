/**
 * MaternAlert patient-app components (React Native).
 * Mirrors maternalert-web/src/components/ds + src/styles/patient-ds.css —
 * same names, props, sizes and colours. Change both together.
 */

import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { createContext, useContext } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "../../hooks/use-color-scheme";

// ── Tokens (same values as patient-ds.css) ──────────────────────────────────

const light = {
  bg: "#FBF7F2", surface: "#FFFFFF", surface2: "#F4EFE8", border: "#E6E1D9", borderStrong: "#D9D2C7",
  ink: "#0F241C", ink2: "#2B3B34", muted: "#5B6B64",
  green: "#0E7C5A", greenPress: "#0A5C43", greenInk: "#0A5C43", mint: "#E3F2EC",
  amber: "#B45309", amberBg: "#FDF0E1", amberInk: "#92400E",
  red: "#C7333B", redPress: "#A82A31", redBg: "#FBE7E8", redInk: "#A82A31",
  coral: "#F2545B",
};
const dark: typeof light = {
  ...light,
  bg: "#0B1A14", surface: "#13261E", surface2: "#1A3128", border: "#2A3B34", borderStrong: "#3A4D45",
  ink: "#F3F6F4", ink2: "#D3DCD7", muted: "#9DB0A7",
  greenInk: "#6FD3A9", mint: "#173A2E", amberBg: "#3A2A12", amberInk: "#F5C27A",
  redBg: "#3A1A1C", redInk: "#FF9A9F",
};
export type Tokens = typeof light;

export function useTokens(): Tokens {
  return useColorScheme() === "dark" ? dark : light;
}

export const FONT = {
  regular: "Outfit-Regular",
  medium: "Outfit-Medium",
  semibold: "Outfit-SemiBold",
  bold: "Outfit-Bold",
};

// ── Text ────────────────────────────────────────────────────────────────────

type TextVariant = "h1" | "h2" | "title" | "body" | "small" | "label";

const TEXT: Record<TextVariant, TextStyle> = {
  h1: { fontFamily: FONT.bold, fontSize: 28, lineHeight: 32, letterSpacing: -0.5 },
  h2: { fontFamily: FONT.bold, fontSize: 19, lineHeight: 24 },
  title: { fontFamily: FONT.semibold, fontSize: 16, lineHeight: 21 },
  body: { fontFamily: FONT.regular, fontSize: 16, lineHeight: 25 },
  small: { fontFamily: FONT.regular, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: FONT.semibold, fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase" },
};

export function T({
  variant = "body",
  color,
  style,
  children,
  ...rest
}: {
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
} & React.ComponentProps<typeof Text>) {
  const t = useTokens();
  const defaultColor = variant === "body" ? t.ink2 : variant === "small" || variant === "label" ? t.muted : t.ink;
  return (
    <Text style={[TEXT[variant], { color: color ?? defaultColor }, style]} {...rest}>
      {children}
    </Text>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export function Page({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const t = useTokens();
  const { ScrollView } = require("react-native");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={["top"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.container}>{children}</View>
      )}
    </SafeAreaView>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────

export function AppHeader({
  title,
  subtitle,
  onBack,
  leading,
  actions,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerMain}>
        {onBack ? (
          <IconButton label="Go back" onPress={onBack}>
            <Ionicons name="arrow-back" size={22} color={useTokens().ink} />
          </IconButton>
        ) : (
          leading
        )}
        <View style={{ flexShrink: 1 }}>
          <T variant="h2" style={{ fontSize: 22, lineHeight: 27 }} accessibilityRole="header">
            {title}
          </T>
          {subtitle ? (
            <T variant="small" style={{ fontSize: 15, marginTop: 2 }}>
              {subtitle}
            </T>
          ) : null}
        </View>
      </View>
      {actions ? <View style={styles.headerActions}>{actions}</View> : null}
    </View>
  );
}

export function IconButton({
  label,
  onPress,
  children,
  dot,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
  dot?: boolean;
}) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.iconBtn,
        { backgroundColor: t.surface, borderColor: pressed ? t.borderStrong : t.border },
      ]}
    >
      {children}
      {dot ? <View style={[styles.dot, { backgroundColor: t.coral, borderColor: t.surface }]} /> : null}
    </Pressable>
  );
}

// ── Buttons ─────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "danger" | "on-color" | "white";

/** Navigate to an app route, or open tel:/sms:/https: links. */
export function useGo() {
  const router = useRouter();
  return (href: string) => {
    if (/^(tel:|sms:|mailto:|https?:)/.test(href)) Linking.openURL(href).catch(() => undefined);
    else router.push(href as Href);
  };
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  block,
  icon,
  href,
  onPress,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  block?: boolean;
  icon?: (color: string) => React.ReactNode;
  href?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const t = useTokens();
  const go = useGo();
  const palette: Record<ButtonVariant, { bg: string; press: string; fg: string; border: string }> = {
    primary: { bg: t.green, press: t.greenPress, fg: "#FFFFFF", border: "transparent" },
    danger: { bg: t.red, press: t.redPress, fg: "#FFFFFF", border: "transparent" },
    secondary: { bg: t.surface, press: t.surface2, fg: t.ink, border: t.borderStrong },
    "on-color": { bg: "rgba(255,255,255,0.16)", press: "rgba(255,255,255,0.26)", fg: "#FFFFFF", border: "rgba(255,255,255,0.5)" },
    white: { bg: "#FFFFFF", press: "#F1F1F1", fg: "#0F241C", border: "transparent" },
  };
  const p = palette[variant];
  const height = size === "lg" ? 60 : size === "sm" ? 44 : 52;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading) }}
      disabled={disabled || loading}
      onPress={() => (href ? go(href) : onPress?.())}
      style={({ pressed }) => [
        styles.btn,
        {
          minHeight: height,
          paddingHorizontal: size === "sm" ? 16 : 22,
          backgroundColor: pressed ? p.press : p.bg,
          borderColor: p.border,
          alignSelf: block ? "stretch" : "flex-start",
          opacity: disabled ? 0.55 : 1,
        },
      ]}
    >
      {loading ? <ActivityIndicator color={p.fg} /> : icon ? icon(p.fg) : null}
      <Text
        style={{ fontFamily: FONT.semibold, fontSize: size === "lg" ? 18 : size === "sm" ? 15 : 16, color: p.fg, textAlign: "center" }}
      >
        {children}
      </Text>
    </Pressable>
  );
}

// ── Surfaces ────────────────────────────────────────────────────────────────

export function Card({ children, flat, style }: { children: React.ReactNode; flat?: boolean; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.surface, borderColor: t.border },
        !flat && t === light ? styles.shadow : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  const t = useTokens();
  return (
    <View style={styles.sectionHead}>
      <T variant="h2" accessibilityRole="header">
        {title}
      </T>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center" }}>
          <T variant="title" color={t.greenInk} style={{ fontSize: 15 }}>
            {actionLabel}
          </T>
        </Pressable>
      ) : null}
    </View>
  );
}

export type Tone = "green" | "amber" | "red" | "neutral";

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  const t = useTokens();
  const map = {
    green: [t.mint, t.greenInk],
    amber: [t.amberBg, t.amberInk],
    red: [t.redBg, t.redInk],
    neutral: [t.surface2, t.ink2],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={{ fontFamily: FONT.semibold, fontSize: 13, color: fg }}>{children}</Text>
    </View>
  );
}

export function Banner({
  tone,
  icon,
  children,
}: {
  tone: "green" | "amber" | "red";
  icon?: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  const t = useTokens();
  const [bg, fg] = tone === "red" ? [t.redBg, t.redInk] : tone === "amber" ? [t.amberBg, t.amberInk] : [t.mint, t.greenInk];
  return (
    <View
      style={[styles.banner, { backgroundColor: bg }]}
      accessibilityRole={tone === "red" ? "alert" : undefined}
    >
      {icon ? <Ionicons name={icon} size={20} color={fg} style={{ marginTop: 2 }} /> : null}
      <Text style={{ flex: 1, fontFamily: FONT.regular, fontSize: 15, lineHeight: 22, color: fg }}>{children}</Text>
    </View>
  );
}

// ── Status hero ─────────────────────────────────────────────────────────────

export type HeroTone = "green" | "amber" | "urgent" | "red";

export function StatusHero({
  tone,
  kicker,
  title,
  message,
  icon,
  actions,
}: {
  tone: HeroTone;
  kicker: string;
  title: string;
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
  actions?: React.ReactNode;
}) {
  const t = useTokens();
  const filled = tone === "urgent" || tone === "red";
  const bg = tone === "green" ? t.mint : tone === "amber" ? t.amberBg : tone === "urgent" ? t.amber : t.red;
  const fg = filled ? "#FFFFFF" : t.ink;
  const iconBg = filled ? "rgba(255,255,255,0.18)" : t.surface;
  const iconFg = filled ? "#FFFFFF" : tone === "amber" ? t.amberInk : t.greenInk;
  return (
    <View style={[styles.hero, { backgroundColor: bg }]} accessibilityLiveRegion="polite">
      <View style={styles.row}>
        <View style={[styles.heroIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={24} color={iconFg} />
        </View>
        <Text style={[TEXT.label, { color: fg, opacity: 0.85 }]}>{kicker}</Text>
      </View>
      <Text style={{ fontFamily: FONT.bold, fontSize: 24, lineHeight: 29, color: fg }} accessibilityRole="header">
        {title}
      </Text>
      <Text style={{ fontFamily: FONT.regular, fontSize: 16, lineHeight: 25, color: filled ? "#FFFFFF" : t.ink2 }}>
        {message}
      </Text>
      {actions ? <View style={styles.heroActions}>{actions}</View> : null}
    </View>
  );
}

// ── Tiles & rows ────────────────────────────────────────────────────────────

export function Tile({
  icon,
  label,
  hint,
  href,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  href: string;
}) {
  const t = useTokens();
  const go = useGo();
  return (
    <Pressable
      onPress={() => go(href)}
      accessibilityRole="button"
      accessibilityLabel={hint ? `${label}. ${hint}` : label}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: t.surface, borderColor: pressed ? t.green : t.border },
      ]}
    >
      <View style={[styles.tileIcon, { backgroundColor: t.mint }]}>
        <Ionicons name={icon} size={22} color={t.greenInk} />
      </View>
      <T variant="title" style={{ fontSize: 17, lineHeight: 22 }}>
        {label}
      </T>
      {hint ? (
        <T variant="small" style={{ marginTop: -6 }}>
          {hint}
        </T>
      ) : null}
    </Pressable>
  );
}

export function Row({
  icon,
  title,
  subtitle,
  trailing,
  last,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  last?: boolean;
}) {
  const t = useTokens();
  return (
    <View style={[styles.listRow, { borderBottomColor: t.border, borderBottomWidth: last ? 0 : 1 }]}>
      {icon ? (
        <View style={[styles.rowIcon, { backgroundColor: t.surface2 }]}>
          <Ionicons name={icon} size={20} color={t.ink2} />
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <T variant="title">{title}</T>
        {subtitle ? (
          <T variant="small" style={{ marginTop: 2 }}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}

export function Skeleton({ height, radius = 16 }: { height: number; radius?: number }) {
  const t = useTokens();
  return <View style={{ height, borderRadius: radius, backgroundColor: t.surface2 }} />;
}

/** The MaternAlert mark (PNG of the same artwork as the web LogoMark). */
export function LogoMark({ height = 32 }: { height?: number }) {
  // maternalert-logo.png is the mark centred in a 512×512 square; the mark
  // itself fills ~100% of the height and ~32% of the width.
  return (
    <Image
      source={require("../../assets/images/maternalert-logo.png")}
      style={{ width: height, height, marginHorizontal: -height * 0.34 }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      accessible={false}
    />
  );
}

// ── Helpers (identical to web) ──────────────────────────────────────────────

export function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function prettySymptom(type: string, custom?: string | null): string {
  if (type === "OTHER" && custom) return custom;
  const s = type.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 132, gap: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 52 },
  headerMain: { flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 1 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", top: 9, right: 10, width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  btn: { borderRadius: 999, borderWidth: 1.5, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  card: { borderWidth: 1, borderRadius: 20, padding: 18 },
  shadow: { shadowColor: "#0F241C", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, alignSelf: "flex-start" },
  banner: { flexDirection: "row", gap: 12, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 },
  hero: { borderRadius: 24, padding: 22, gap: 14 },
  heroIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  tile: { flex: 1, borderWidth: 1, borderRadius: 20, padding: 16, minHeight: 120, gap: 12 },
  tileIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  listRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, minHeight: 56 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});

export const dsStyles = styles;
