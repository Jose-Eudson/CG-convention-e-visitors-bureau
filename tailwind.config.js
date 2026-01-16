/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        convention: ['"ConventionFont"', 'sans-serif'], 
          header: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};

