/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'kilishi-red': '#8B0000',
        'kilishi-gold': '#FFD700',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}
