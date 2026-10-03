/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "#0b0e14",
          card: "#141923",
          border: "#232b3e",
          accent: "#ff3b5c",
          gold: "#f59e0b",
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          green: "#10b981",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}
