/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2DE474",
        "primary-dark": "#15803D",
        "primary-light": "#E8FCF1",
        accent: "#FF9B3E",
        "accent-light": "#FFF4E8",
        emergency: "#FF4B4B",
        "emergency-text": "#FFFFFF",
        "setup-blue": "#1E6BFF",
        "dark-bg": "#1A1512",
        "card-dark": "#26211E",
        routine: "#2DE474",
        urgent: "#FF9B3E",
        critical: "#FF4B4B",
        "urgent-text": "#92400E",
        "routine-text": "#1A212E",
        "text-light": "#6B7280",
        "inactive-tab": "#94A3B8",
      },
      fontFamily: {
        sans: ["Lexend-Regular"],
        lexend: ["Lexend-Regular"],
        "lexend-medium": ["Lexend-Medium"],
        "lexend-semibold": ["Lexend-SemiBold"],
        "lexend-bold": ["Lexend-Bold"],
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
