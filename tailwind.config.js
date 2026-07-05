/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          playfair: ['"Playfair Display"', 'serif', { fontDisplay: 'swap' }],
          bebas: ['"Bebas Neue"', 'sans-serif', { fontDisplay: 'swap' }],
          inter: ['"Inter"', 'sans-serif', { fontDisplay: 'swap' }],
        },
        colors: {
          'indigo-neo': '#3730A3',
          'yellow-neo': '#F5C518',
          'red-neo': '#DC2626',
          'dark-neo': '#111827',
          'mustard': '#D4A017',
        },
        boxShadow: {
          'glow-white': '0px 1px 6.5px 0px #FF9BA8 inset, 0px 5px 10px 0px rgba(172, 104, 113, 0.70)',
          'neo-brutalist': '4px 4px 0px #000',
          'neo-brutalist-lg': '6px 6px 0px #000',
          'neo-brutalist-xl': '8px 8px 0px #000',
        },
        borderWidth: {
          'neobrutal': '2px',
        },
      },
    },
    plugins: [
      tailwindScrollbar,
    ],
  };
