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
        "primary": "#141414",
        "background-light": "#f7f7f7",
        "background-dark": "#191919",
      },
      fontFamily: {
        "sans": ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;