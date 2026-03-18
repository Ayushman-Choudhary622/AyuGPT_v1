import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ayu-dark": "#050510",
        "ayu-surface": "rgba(255,255,255,0.04)",
        "ayu-border": "rgba(139,92,246,0.3)",
        "ayu-purple": "#7c3aed",
        "ayu-violet": "#8b5cf6",
        "ayu-cyan": "#06b6d4",
      },
      backgroundImage: {
        "ayu-gradient": "linear-gradient(135deg, #7c3aed, #06b6d4)",
        "ayu-card": "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "typing": "typing 1.5s steps(40,end)",
        "fadeSlideUp": "fadeSlideUp 0.4s ease-out forwards",
        "spin-slow": "spin 8s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "particle": "particle 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(6,182,212,0.8), 0 0 60px rgba(6,182,212,0.4)" },
        },
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        particle: {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100px) rotate(720deg)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
