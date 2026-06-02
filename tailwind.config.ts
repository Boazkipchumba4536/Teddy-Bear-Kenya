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
        market: {
          orange: "#f68b1e",
          "orange-dark": "#e07b10",
          gray: "#f5f5f5",
          dark: "#333333",
          text: "#444444",
          muted: "#888888",
          border: "#e0e0e0",
          green: "#00b259",
          red: "#e63946",
        },
        caramel: {
          DEFAULT: "#8B5E3C",
          light: "#A67B5B",
          dark: "#6B4528",
        },
        blush: {
          DEFAULT: "#F5C5C5",
          dark: "#E8A8A8",
        },
        cream: {
          DEFAULT: "#FFF8F0",
          dark: "#F5EDE0",
        },
        ink: {
          DEFAULT: "#1A0A00",
          muted: "#5C4A3A",
          light: "#8A7A6A",
        },
        mpesa: {
          DEFAULT: "#4CAF50",
          dark: "#388E3C",
          light: "#66BB6A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(26, 10, 0, 0.08)",
        card: "0 2px 16px rgba(26, 10, 0, 0.06)",
        elevated: "0 24px 64px -16px rgba(139, 94, 60, 0.18)",
        market: "0 1px 4px rgba(0, 0, 0, 0.08)",
        "market-hover": "0 4px 12px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        pulseMpesa: "pulseMpesa 2s ease-in-out infinite",
        bounceHeart: "bounceHeart 0.4s ease",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        fadeIn: "fadeIn 0.45s ease-out forwards",
      },
      keyframes: {
        pulseMpesa: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(76, 175, 80, 0)" },
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
