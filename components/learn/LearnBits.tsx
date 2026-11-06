import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Linking, Text, View } from "react-native";

import type { Block } from "../../constants/education";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { useLang } from "../../hooks/useLang";
import { LANGUAGES, tr } from "../../services/i18n";
import { chooseLang } from "../../services/langStorage";
import type { LearnTone, SpotArt } from "../../services/learnTheme";
import { FONT, Pressable, useTokens } from "../ds";

// Same pieces as maternalert-web/src/components/learn/LearnBits.tsx

const SPOTS: Record<SpotArt, any> = {
  mama: require("../../assets/spots/mama.png"),
  bp: require("../../assets/spots/bp.png"),
  food: require("../../assets/spots/food.png"),
  meds: require("../../assets/spots/meds.png"),
  bag: require("../../assets/spots/bag.png"),
  baby: require("../../assets/spots/baby.png"),
  mamababy: require("../../assets/spots/mamababy.png"),
  alert: require("../../assets/spots/alert.png"),
};

/** A drawn illustration. Decorative: the words next to it say what it is. */
export function Spot({ art, size, style }: { art: SpotArt; size: number; style?: any }) {
  return <Image source={SPOTS[art]} style={[{ width: size, height: size }, style]} accessible={false} accessibilityIgnoresInvertColors />;
}

const PALETTE = {
  light: {
    mint: { bg: "#E3F2EC", edge: "#C5E6D7", ink: "#0A5C43" },
    peach: { bg: "#FDE9DF", edge: "#F8D2C0", ink: "#9A3F1F" },
    lavender: { bg: "#EEE8FB", edge: "#DCD2F6", ink: "#5B3FA8" },
    sky: { bg: "#E2F1FB", edge: "#C7E3F5", ink: "#1D5F8A" },
    butter: { bg: "#FFF4D6", edge: "#F7E3A6", ink: "#7A5200" },
    rose: { bg: "#FDE6E7", edge: "#F7CDD0", ink: "#A82A31" },
  },
  dark: {
    mint: { bg: "#15362A", edge: "#2C6B55", ink: "#6FD3A9" },
    peach: { bg: "#3A2419", edge: "#7A4A36", ink: "#F5B79B" },
    lavender: { bg: "#262041", edge: "#554684", ink: "#C7B8F5" },
    sky: { bg: "#16293A", edge: "#2F5B78", ink: "#9CCFF0" },
    butter: { bg: "#33290F", edge: "#6F5A22", ink: "#F5D27A" },
    rose: { bg: "#3A1A1C", edge: "#7A3438", ink: "#FF9A9F" },
  },
} as const;

/** The three colours of a topic tone, for light or dark mode. */
export function useTone(tone: LearnTone) {
  return PALETTE[useColorScheme() === "dark" ? "dark" : "light"][tone];
}

export function Kicker({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Text style={{ fontFamily: FONT.bold, fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color }}>{children}</Text>
  );
}

/** Round 44px button used in Learn headers. */
export function RoundButton({
  icon,
  label,
  text,
  onPress,
  bare,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  text?: string;
  onPress: () => void;
  bare?: boolean;
}) {
  const t = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => ({
        minWidth: 44,
        height: 44,
        paddingHorizontal: text ? 14 : 0,
        borderRadius: 999,
        borderWidth: bare ? 0 : 1,
        borderColor: t.border,
        backgroundColor: pressed ? t.surface2 : t.surface,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      })}
    >
      <Ionicons name={icon} size={19} color={t.ink} />
      {text ? <Text style={{ fontFamily: FONT.bold, fontSize: 14, color: t.ink }}>{text}</Text> : null}
    </Pressable>
  );
}

/** English / Pidgin / Yorùbá, right where she is reading. Saved like Profile → Language. */
export function LanguageSwitch() {
  const t = useTokens();
  const lang = useLang();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={tr({ en: "Language", pcm: "Language", yo: "Èdè" })}
      style={{ flexDirection: "row", padding: 4, borderRadius: 999, backgroundColor: t.surface2 }}
    >
      {LANGUAGES.map((l) => {
        const on = lang === l.code;
        return (
          <Pressable
            key={l.code}
            onPress={() => void chooseLang(l.code)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: on ? t.surface : "transparent",
              elevation: on ? 1 : 0,
            }}
          >
            <Text style={{ fontFamily: FONT.bold, fontSize: 14, color: on ? t.ink : t.muted }}>
              {l.code === "pcm" ? "Pidgin" : l.native}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** One block of a guide, drawn in the Learn style. */
export function GuideBlock({ block, urgent, tone }: { block: Block; urgent: boolean; tone: LearnTone }) {
  const t = useTokens();
  const c = useTone(tone);
  const router = useRouter();
  switch (block.type) {
    case "h":
      return <Text style={{ fontFamily: FONT.bold, fontSize: 20, color: t.ink, marginTop: 8, marginBottom: -4 }}>{block.text}</Text>;
    case "p":
      return <Text style={{ fontFamily: FONT.regular, fontSize: 17, lineHeight: 27, color: t.ink2 }}>{block.text}</Text>;
    case "list": {
      const bg = block.tone === "red" ? t.redBg : block.tone === "amber" ? t.amberBg : c.bg;
      const dot = block.tone === "red" ? t.red : block.tone === "amber" ? t.amber : c.ink;
      return (
        <View style={{ padding: 14, borderRadius: 24, backgroundColor: bg, gap: 6 }}>
          {block.items.map((item) => (
            <View key={item} style={{ flexDirection: "row", gap: 12, padding: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: t.surface }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, marginTop: 7, backgroundColor: dot }} />
              <Text style={{ flex: 1, fontFamily: FONT.regular, fontSize: 16, lineHeight: 23, color: t.ink }}>{item}</Text>
            </View>
          ))}
        </View>
      );
    }
    case "alert":
      if (block.tone === "red" && urgent) {
        // In an emergency guide the red box is the action: call, or go.
        return (
          <View accessibilityRole="alert" style={{ padding: 18, borderRadius: 26, backgroundColor: t.red }}>
            <Text style={{ fontFamily: FONT.bold, fontSize: 18, lineHeight: 24, color: "#FFFFFF" }}>{block.text}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
              <Pressable
                onPress={() => Linking.openURL("tel:112")}
                accessibilityRole="button"
                style={{ flex: 1, minHeight: 48, borderRadius: 999, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <Ionicons name="call" size={18} color={t.red} />
                <Text style={{ fontFamily: FONT.bold, fontSize: 15, color: t.red }}>{tr({ en: "Call 112", pcm: "Call 112", yo: "Pe 112" })}</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/clinic-finder")}
                accessibilityRole="button"
                style={{ flex: 1, minHeight: 48, borderRadius: 999, backgroundColor: t.redPress, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <Ionicons name="location" size={18} color="#FFFFFF" />
                <Text style={{ fontFamily: FONT.bold, fontSize: 15, color: "#FFFFFF" }}>
                  {tr({ en: "Nearest clinic", pcm: "Clinic wey near", yo: "Kílíníìkì tó súnmọ́" })}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      }
      {
        const bg = block.tone === "green" ? t.mint : block.tone === "amber" ? t.amberBg : t.redBg;
        const ink = block.tone === "green" ? t.greenInk : block.tone === "amber" ? t.amberInk : t.redInk;
        return (
          <View
            accessibilityRole={block.tone === "red" ? "alert" : undefined}
            style={{ flexDirection: "row", gap: 12, padding: 16, borderRadius: 22, backgroundColor: bg }}
          >
            <Ionicons name={block.tone === "green" ? "bulb-outline" : "warning-outline"} size={22} color={ink} />
            <Text style={{ flex: 1, fontFamily: FONT.semibold, fontSize: 16, lineHeight: 23, color: ink }}>{block.text}</Text>
          </View>
        );
      }
  }
}

/** The pink "danger signs" card: strong red button, calm bell. */
export function DangerCard({ title, sub, onPress }: { title: string; sub?: string; onPress: () => void }) {
  const t = useTokens();
  const rose = useTone("rose");
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 16,
        borderRadius: 28,
        borderWidth: 1.5,
        borderColor: rose.edge,
        backgroundColor: t.redBg,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <Spot art="alert" size={72} />
      <View style={{ flex: 1 }}>
        <Kicker color={t.redInk}>{tr({ en: "Know these", pcm: "Know these ones", yo: "Mọ àwọn wọ̀nyí" })}</Kicker>
        <Text style={{ fontFamily: FONT.bold, fontSize: 18, lineHeight: 22, color: t.ink, marginTop: 2 }}>{title}</Text>
        <Text style={{ fontFamily: FONT.semibold, fontSize: 13, color: t.redInk, marginTop: 4 }}>
          {sub ?? tr({ en: "Works without internet", pcm: "E dey work without network", yo: "Ó ń ṣiṣẹ́ láìsí íńtánẹ́ẹ̀tì" })}
        </Text>
      </View>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.red, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}
