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
        },
        boxShadow: {
          'glow-white': '0px 1px 6.5px 0px #FF9BA8 inset, 0px 5px 10px 0px rgba(172, 104, 113, 0.70)',
        },
      },
    },
    plugins: [
      tailwindScrollbar,
    ],
  };
