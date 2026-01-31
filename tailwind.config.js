/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Vibe Coding Theme
                background: "#030305",
                surface: "#0f1016",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#D93025", // Quai Red
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#06b6d4", // Cyan/Teal
                    foreground: "#ffffff",
                },
                accent: {
                    DEFAULT: "#f59e0b", // Amber for Gas/Warning
                    foreground: "#000000",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["Inter", ...fontFamily.sans],
                heading: ["Outfit", ...fontFamily.sans],
                mono: ["JetBrains Mono", ...fontFamily.mono],
            },
            keyframes: {
                "pulse-glow": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                },
                "slide-in": {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            animation: {
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                "slide-in": "slide-in 0.3s ease-out",
                shimmer: "shimmer 2s linear infinite",
            },
        },
    },
    plugins: [],
}
