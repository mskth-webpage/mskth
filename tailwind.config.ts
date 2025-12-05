import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      // ✨ MSKTH Brand Colors
      colors: {
        "mskth-light": "var(--color-mskth-light)",
        "mskth-blue": "var(--color-mskth-blue)",
        "mskth-deep": "var(--color-mskth-deep)",
        "mskth-dark": "var(--color-mskth-dark)",
        "mskth-white": "var(--color-mskth-white)",
      },
      // ✨ Brand Fonts (Archivo + Nanum)
      fontFamily: {
        brandSans: ["var(--font-brand-sans)", "sans-serif"],
        brandSerif: ["var(--font-brand-serif)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
