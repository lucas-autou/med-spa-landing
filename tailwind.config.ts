import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          card: "var(--bg-card)",
          overlay: "var(--bg-overlay)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
        },
        teal: {
          DEFAULT: "var(--color-teal)",
          hover: "var(--color-teal-hover)",
          light: "var(--color-teal-light)",
        },
        blush: {
          DEFAULT: "var(--color-blush)",
          light: "var(--color-blush-light)",
        },
        gray: {
          50: "var(--color-gray-50)",
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
          600: "var(--color-gray-600)",
          700: "var(--color-gray-700)",
          800: "var(--color-gray-800)",
          900: "var(--color-gray-900)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          light: "var(--border-light)",
          focus: "var(--border-focus)",
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        md: "8px",
        lg: "16px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        cta: "0 4px 12px rgba(20, 184, 166, 0.25)",
      },
      backgroundImage: {
        'gradient-radial': 'var(--gradient-radial)',
        'gradient-hero': 'var(--gradient-hero)',
      },
    },
  },
  plugins: [],
};
export default config;