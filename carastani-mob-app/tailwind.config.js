/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e', // Teal-700 based on image
        secondary: '#111827', // Gray-900
        accent: '#ef4444', // Red-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        car: 'car 1.4s ease-in-out infinite',
        flame: 'flame 0.6s ease-in-out infinite',
      },
      keyframes: {
        car: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        flame: {
          '0%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '50%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
