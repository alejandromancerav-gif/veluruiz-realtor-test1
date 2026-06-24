/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            50: '#f4f6f8',
            100: '#e7ebf1',
            200: '#c3cee0',
            300: '#9faec8',
            400: '#56709b',
            500: '#1d3557', // Navy principal confiable
            600: '#1a304f',
            700: '#162842',
            800: '#112035',
            900: '#0b1523',
          },
          accent: {
            DEFAULT: '#F06C4F', // Nuevo Naranja extraído del logo (referencia image_8.png)
            hover: '#D15B41',   // Variante más oscura para estados hover
            light: '#FFB8A8'    // Variante muy clara para fondos sutiles
          }
        }
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(29, 53, 87, 0.1)',
        'premium-hover': '0 20px 40px -15px rgba(29, 53, 87, 0.15)',
      },
    },
  },
  plugins: [],
};