import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors"
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      ...colors,
      primary: colors.purple,
      secondary: colors.green,
      'tsecondary-light' : '#4b5563',
      'tsecondary-dark' : '#9ca3af',
    },
  },
  plugins: [],
  darkMode : 'selector'
};
export default config;
