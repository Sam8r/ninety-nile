import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "var(--page-gutter)",
      screens: {
        "2xl": "84rem",
      },
    },
    extend: {
      colors: {
        border: "var(--color-rule)",
        input: "var(--color-rule)",
        ring: "var(--color-focus)",
        background: "var(--color-paper)",
        foreground: "var(--color-ink)",
        primary: {
          DEFAULT: "var(--color-ink)",
          foreground: "var(--color-paper)",
        },
        secondary: {
          DEFAULT: "var(--color-paper-2)",
          foreground: "var(--color-ink)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-paper)",
        },
        muted: {
          DEFAULT: "var(--color-paper-2)",
          foreground: "var(--color-muted)",
        },
        destructive: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-paper)",
        },
        card: {
          DEFAULT: "var(--color-paper)",
          foreground: "var(--color-ink)",
        },
        popover: {
          DEFAULT: "var(--color-paper)",
          foreground: "var(--color-ink)",
        },
        brand: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          accent: "var(--brand-accent)",
          yellow: "var(--brand-yellow)",
          bg: "var(--brand-bg)",
          text: "var(--brand-text)",
        },
      },
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
        xl: "0",
        "2xl": "0",
      },
      fontFamily: {
        heading: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      fontSize: {
        "display-sm": ["clamp(2rem, 4vw + 0.5rem, 3.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2.75rem, 6vw + 1rem, 5.5rem)", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(4rem, 12vw, 12rem)", { lineHeight: "0.88", letterSpacing: "-0.05em" }],
      },
      spacing: {
        "3xs": "var(--space-3xs)",
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        flow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s var(--ease-out)",
        "fade-up": "fade-up 0.3s var(--ease-out)",
        flow: "flow 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        in: "var(--ease-in)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
