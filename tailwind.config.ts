import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#F6F7FB",
          dark: "#E8EBF2",
        },
        ink: {
          DEFAULT: "#0B1220",
          muted: "#5B6478",
          light: "#8B95A8",
        },
        accent: {
          DEFAULT: "#BE123C",
          dark: "#9F1239",
          light: "#FB7185",
        },
        violet: {
          DEFAULT: "#6D28D9",
          light: "#A78BFA",
        },
        /* Legacy aliases mapped to new palette */
        caramel: {
          DEFAULT: "#BE123C",
          light: "#FB7185",
          dark: "#9F1239",
        },
        blush: {
          DEFAULT: "#FFE4EC",
          dark: "#FECDD3",
          light: "#FFF1F3",
        },
        terracotta: {
          DEFAULT: "#6D28D9",
          dark: "#5B21B6",
          light: "#A78BFA",
        },
        ivory: {
          DEFAULT: "#F6F7FB",
          dark: "#E8EBF2",
        },
        cream: {
          DEFAULT: "#FFFFFF",
          dark: "#E8EBF2",
        },
        mpesa: {
          DEFAULT: "#059669",
          dark: "#047857",
          light: "#34D399",
        },
        market: {
          orange: "#BE123C",
          "orange-dark": "#9F1239",
          gray: "#F6F7FB",
          dark: "#0B1220",
          text: "#5B6478",
          muted: "#8B95A8",
          border: "#E2E8F0",
          green: "#059669",
          red: "#BE123C",
        },
      },
      fontFamily: {
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(11, 18, 32, 0.08)",
        card: "0 1px 3px rgba(11, 18, 32, 0.06), 0 8px 24px -8px rgba(11, 18, 32, 0.1)",
        elevated: "0 24px 48px -12px rgba(11, 18, 32, 0.18)",
        market: "0 1px 4px rgba(0, 0, 0, 0.06)",
        "market-hover": "0 8px 24px rgba(11, 18, 32, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        pulseMpesa: "pulseMpesa 2s ease-in-out infinite",
        bounceHeart: "bounceHeart 0.4s ease",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        fadeIn: "fadeIn 0.45s ease-out forwards",
        fadeInUp: "fadeInUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseMpesa: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(5, 150, 105, 0.35)" },
          "50%": { boxShadow: "0 0 0 8px rgba(5, 150, 105, 0)" },
        },
        bounceHeart: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
