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
        kopi: {
          50: "#faf6f0",
          100: "#f2e9d9",
          200: "#e5d2b3",
          300: "#d4b585",
          400: "#c4995c",
          500: "#b07d3d",
          600: "#966334",
          700: "#7a4d2c",
          800: "#664129",
          900: "#573825",
          950: "#2f1b10",
        },
        cream: "#faf6f0",
        roast: "#2f1b10",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
