/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        // Act palettes
        ink: {
          DEFAULT: "#0a0a0c",
          50: "#1a1a1f",
          100: "#222229",
          200: "#2c2c35",
        },
        paper: "#f4ecdc",
        rain: "#5b6471",
        amber: {
          glow: "#d4a14a",
          deep: "#8a6420",
        },
        jade: {
          DEFAULT: "#1f6f5f",
          light: "#3aa987",
          deep: "#0f3a2f",
        },
        rose: "#c75850",
        neon: {
          purple: "#9b5cff",
          cyan: "#5cf2ff",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        flicker: "flicker 4s infinite",
        "pyramid-glow": "pyramidGlow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
          "55%": { opacity: "1" },
        },
        pyramidGlow: {
          "0%, 100%": { filter: "drop-shadow(0 0 8px rgba(212,161,74,0.3))" },
          "50%": { filter: "drop-shadow(0 0 22px rgba(212,161,74,0.7))" },
        },
      },
    },
  },
  plugins: [],
};
