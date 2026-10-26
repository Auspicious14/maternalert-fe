/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0E7C5A",
        "primary-dark": "#0A5C43",
        "primary-light": "#E3F2EC",
        accent: "#B45309",
        "accent-light": "#FDF0E1",
        emergency: "#C7333B",
        "emergency-text": "#FFFFFF",
        "setup-blue": "#0E7C5A",
        "dark-bg": "#0B1A14",
        "card-dark": "#13261E",
        routine: "#0E7C5A",
        urgent: "#B45309",
        critical: "#C7333B",
        "urgent-text": "#92400E",
        "routine-text": "#0F241C",
        "text-light": "#5B6B64",
        "inactive-tab": "#8A9791",
        // Brand extras — same tokens as the web app's globals.css
        coral: "#F2545B",
        ink: "#0F241C",
        cream: "#FBF7F2",
      },
      fontFamily: {
        sans: ["Outfit-Regular"],
        outfit: ["Outfit-Regular"],
        "outfit-medium": ["Outfit-Medium"],
        "outfit-semibold": ["Outfit-SemiBold"],
        "outfit-bold": ["Outfit-Bold"],
        lexend: ["Outfit-Regular"],
        "lexend-medium": ["Outfit-Medium"],
        "lexend-semibold": ["Outfit-SemiBold"],
        "lexend-bold": ["Outfit-Bold"],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
      }
    },
  },
  plugins: [],
}
