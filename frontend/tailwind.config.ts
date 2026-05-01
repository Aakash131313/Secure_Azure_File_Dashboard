import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        azure: {
          50: "#eef8ff",
          100: "#d8efff",
          600: "#0078d4",
          700: "#106ebe",
          900: "#003f70",
        },
      },
      boxShadow: {
        dashboard: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
