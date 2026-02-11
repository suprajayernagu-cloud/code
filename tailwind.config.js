/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ebf3f8',
          100: '#d3e6f1',
          200: '#a7cde3',
          300: '#72aacd',
          400: '#3d87b4',
          500: '#1e6995',
          600: '#12567d',
          700: '#0b4566',
          800: '#033f63',
          900: '#032f4a',
        },
        ink: {
          50: '#f6f7f8',
          100: '#ebeef0',
          200: '#d7dde2',
          300: '#b8c4cc',
          400: '#8fa1ad',
          500: '#6c8290',
          600: '#546976',
          700: '#425460',
          800: '#2f3d47',
          900: '#1d1d1d',
        },
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 16% 14%, rgba(3, 63, 99, 0.18) 0, transparent 34%), radial-gradient(circle at 84% 8%, rgba(219, 43, 57, 0.16) 0, transparent 30%), radial-gradient(circle at 52% 84%, rgba(243, 167, 19, 0.18) 0, transparent 30%)',
      },
      boxShadow: {
        card: '0 28px 56px -32px rgba(3, 63, 99, 0.35)',
        soft: '0 20px 42px -26px rgba(3, 63, 99, 0.24)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(14px)' },
        },
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.12)', opacity: '0.2' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float-slow': 'float 9s ease-in-out infinite',
        'drift-slow': 'drift 14s ease-in-out infinite',
        'pulse-ring': 'pulseRing 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.65s ease both',
      },
    },
  },
  plugins: [],
}
