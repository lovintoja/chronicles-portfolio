/**
 * tailwind.config.ts
 *
 * NOTE: This project uses Tailwind CSS v4, which is configured entirely via
 * the @theme block inside src/app/globals.css (imported with @import "tailwindcss").
 * This file documents the Dopamine Decor design tokens for reference and
 * future compatibility, but the build pipeline reads globals.css — not this file.
 *
 * Content paths are listed here so any future Tailwind v3-compatible tooling
 * or migration scripts can pick them up automatically.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Dopamine Decor palette ──────────────────────────────────────
        "hot-pink":     "#FF2D9B",
        "hot-pink-light": "#FF6EC7",
        "hot-pink-dark":  "#C4006E",
        "electric-blue":  "#00C2FF",
        "electric-blue-light": "#66DEFF",
        "electric-blue-dark":  "#0085B2",
        "lime-green":     "#B6FF00",
        "lime-green-light": "#D4FF66",
        "lime-green-dark":  "#7AB200",
        "vivid-purple":   "#A020F0",
        "vivid-purple-light": "#C96EF5",
        "vivid-purple-dark":  "#6A00B0",
        "solar-orange":   "#FF6B00",
        "solar-orange-light": "#FFA04D",
        "solar-orange-dark":  "#B34A00",
        "pop-yellow":     "#FFE600",
        "pop-white":      "#FFFFFF",
        "pop-black":      "#111111",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)",    "sans-serif"],
        ui:      ["var(--font-ui)",      "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
