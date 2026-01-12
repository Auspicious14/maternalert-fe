import { Platform } from "react-native";
import { Colors } from "./Colors";

export const Theme = {
  colors: Colors,

  // Typography
  typography: {
    fontFamily: Platform.select({
      ios: "Quicksand-Regular", // Approximating rounded sans-serif
      android: "sans-serif-condensed",
      default: "System",
    }),
    baseSize: 16,
    headerSize: 24,
    subHeaderSize: 20,
    fontWeight: {
      regular: "400",
      medium: "500",
      bold: "700",
    },
  },

  // Shapes & Layout
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

  // Shadows
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
