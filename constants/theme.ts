import { Colors as BaseColors } from "./Colors";

export const Colors = {
  light: {
    text: BaseColors.text,
    background: BaseColors.background,
    card: BaseColors.white,
    border: BaseColors.border,
    tint: BaseColors.primary,
    tabIconDefault: BaseColors.inactiveTab,
    tabIconSelected: BaseColors.primary,
  },
  dark: {
    text: BaseColors.textOnDark,
    background: BaseColors.darkBg,
    card: BaseColors.cardDark,
    border: BaseColors.borderDark,
    tint: BaseColors.primary,
    tabIconDefault: BaseColors.inactiveTab,
    tabIconSelected: BaseColors.primary,
  },
};

export const Theme = {
  colors: BaseColors,
  typography: {
    fontFamilies: {
      regular: "Lexend-Regular",
      medium: "Lexend-Medium",
      semiBold: "Lexend-SemiBold",
      bold: "Lexend-Bold",
    },
    fontFamily: "Lexend-Regular",
    baseSize: 16,
    headerSize: 24,
    subHeaderSize: 20,
    fontWeight: {
      regular: "400",
      medium: "500",
      bold: "700",
    },
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  shadows: {
    light: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 4,
    },
  },
};

export default Theme;
