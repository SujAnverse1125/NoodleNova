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
        ink: {
          DEFAULT: "#080717",
          2: "#111027",
          3: "#1b1938",
        },
        paper: "#f7f5f0",
        muted: "#9d9ab5",
        cyan: "#5ae5e1",
        pink: {
          DEFAULT: "#ff5e9e",
          neon: "#FF2D78",
        },
        gold: "#ffc95b",
        purple: "#9a76ff",
        lavender: "#C0B9DD",
      },
      fontFamily: {
        sans: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        mono: ["Space Mono", "DM Mono", "monospace"],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(90, 229, 225, 0.5), 0 0 20px rgba(90, 229, 225, 0.3)',
        'neon-pink': '0 0 10px rgba(255, 94, 158, 0.5), 0 0 20px rgba(255, 94, 158, 0.3)',
        'neon-gold': '0 0 10px rgba(255, 201, 91, 0.5), 0 0 20px rgba(255, 201, 91, 0.3)',
        'neon-purple': '0 0 10px rgba(154, 118, 255, 0.5), 0 0 20px rgba(154, 118, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'nebula': 'radial-gradient(circle at 50% 50%, rgba(154, 118, 255, 0.1) 0%, rgba(255, 94, 158, 0.05) 25%, rgba(8, 7, 23, 0) 50%)',
      },
      animation: {
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "float-slow": "float 8s ease-in-out 1s infinite",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "sweep": "sweep 4s linear infinite",
        "spin-slow": "spin 3s linear infinite",
        "rider-bob": "riderBob 0.55s ease-in-out infinite alternate",
        "item-pulse": "itemPulse 0.55s ease-in-out infinite alternate",
        "sketch-bob": "sketchBob 1.2s ease-in-out infinite alternate",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 94, 158, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 94, 158, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        riderBob: {
          "0%": { transform: "translate(-50%, -50%)" },
          "100%": { transform: "translate(-50%, -55%)" },
        },
        itemPulse: {
          "0%": { transform: "scale(1) rotate(0)" },
          "100%": { transform: "scale(1.22) rotate(14deg)" },
        },
        sketchBob: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "100%": { transform: "translateY(-8px) rotate(1deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
