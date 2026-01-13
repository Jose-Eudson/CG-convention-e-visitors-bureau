/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // todos os arquivos do projeto
  ],
  theme: {
    extend: {
      fontFamily: {
        convention: ['"ConventionFont"', 'sans-serif'], // mesma fonte da logo
          header: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};

