import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07090d",
        midnight: "#0c1018",
        ember: "#f36b21",
        emberSoft: "#ff9358",
        steel: "#8e96a3",
        bone: "#f5f1ea",
        gold: "#f7c948",
        goldSoft: "#ffe08a",
        smoke: "rgba(255,255,255,0.07)"
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(243, 107, 33, 0.15)",
        goldGlow: "0 0 40px rgba(247, 201, 72, 0.15)"
      },
      backgroundImage: {
        "hero-radial": "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.14), transparent 32%), radial-gradient(circle at 15% 25%, rgba(243,107,33,0.20), transparent 30%), radial-gradient(circle at 85% 20%, rgba(247,201,72,0.18), transparent 28%), linear-gradient(180deg, #06070a 0%, #0d1018 38%, #090b10 100%)",
        haze: "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 30%, transparent 70%, rgba(255,255,255,0.03))"
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        pulseLine: "pulseLine 3s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -18px, 0) scale(1.04)" }
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.85" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        }
      }
    }
  },
  plugins: []
};

export default config;
