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
        sand: {
          DEFAULT: "#f7f5f2",
          dark: "#edeae5",
        },
        ink: {
          DEFAULT: "#141414",
          muted: "#6b6560",
          light: "#9c9690",
        },
        wine: {
          DEFAULT: "#8B2942",
          light: "#a8324f",
          dark: "#6d1f33",
          50: "#fdf2f5",
          100: "#fce4ea",
        },
        champagne: {
          DEFAULT: "#c9a87c",
          light: "#e2c9a8",
        },
        // legacy aliases
        rose: {
          50: "#fdf2f5",
          100: "#fce4ea",
          200: "#f5c6d4",
          300: "#e899ad",
          400: "#d46582",
          500: "#a8324f",
          600: "#8B2942",
          700: "#6d1f33",
          800: "#551828",
          900: "#3d1120",
        },
        blush: { DEFAULT: "#fdf2f5", dark: "#fce4ea" },
        brand: {
          50: "#fdf2f5",
          100: "#fce4ea",
          200: "#f5c6d4",
          300: "#e899ad",
          400: "#d46582",
          500: "#a8324f",
          600: "#8B2942",
          700: "#6d1f33",
        },
        cream: "#f7f5f2",
        ivory: { DEFAULT: "#faf9f7", dark: "#f0eeeb" },
        cocoa: "#141414",
        gold: { DEFAULT: "#c9a87c", light: "#e2c9a8" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(20, 20, 20, 0.08)",
        card: "0 2px 16px rgba(20, 20, 20, 0.04)",
        elevated: "0 24px 64px -16px rgba(139, 41, 66, 0.15)",
        glow: "0 0 0 1px rgba(139, 41, 66, 0.08), 0 8px 32px -8px rgba(139, 41, 66, 0.12)",
      },
      animation: {
        shimmer: "shimmer 1.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        marquee: "marquee 40s linear infinite",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
