/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "swiss-paper": "#f4f4f4",
        "swiss-ink": "#1a1a1a",
        "swiss-red": "#ff3b30",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
        mono: ['"Courier New"', "Courier", "monospace"],
      },
      boxShadow: {
        hard: "12px 12px 0px #1a1a1a",
      },
      borderWidth: {
        3: "3px",
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
    },
  },
  plugins: [],
};
