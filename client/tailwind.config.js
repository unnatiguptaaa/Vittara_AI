/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: 'rgb(var(--midnight-950) / <alpha-value>)',
          900: 'rgb(var(--midnight-900) / <alpha-value>)',
          850: 'rgb(var(--midnight-850) / <alpha-value>)',
          800: 'rgb(var(--midnight-800) / <alpha-value>)',
          750: 'rgb(var(--midnight-750) / <alpha-value>)',
          700: 'rgb(var(--midnight-700) / <alpha-value>)',
          600: 'rgb(var(--midnight-600) / <alpha-value>)',
        },
        emerald: {
          950: 'rgb(var(--emerald-950) / <alpha-value>)',
          900: 'rgb(var(--emerald-900) / <alpha-value>)',
          800: 'rgb(var(--emerald-800) / <alpha-value>)',
          700: 'rgb(var(--emerald-700) / <alpha-value>)',
          600: 'rgb(var(--emerald-600) / <alpha-value>)',
          500: 'rgb(var(--emerald-500) / <alpha-value>)',
          400: 'rgb(var(--emerald-400) / <alpha-value>)',
          300: 'rgb(var(--emerald-300) / <alpha-value>)',
          200: 'rgb(var(--emerald-200) / <alpha-value>)',
          100: 'rgb(var(--emerald-100) / <alpha-value>)',
          50: 'rgb(var(--emerald-50) / <alpha-value>)',
        },
        gold: {
          600: 'var(--gold-600, #b48a27)',
          500: 'var(--gold-500, #d4af37)',
          400: 'var(--gold-400, #e5c07b)',
          300: 'var(--gold-300, #f6d59e)',
          100: 'var(--gold-100, #fef3c7)',
        },
        ivory: {
          DEFAULT: 'rgb(var(--ivory) / <alpha-value>)',
          muted: 'rgb(var(--ivory-muted) / <alpha-value>)',
          subtle: 'rgb(var(--ivory-subtle) / <alpha-value>)',
          dark: 'rgb(var(--ivory-dark) / <alpha-value>)',
        },
        slate: {
          50: 'rgb(var(--slate-50) / <alpha-value>)',
          100: 'rgb(var(--slate-100) / <alpha-value>)',
          200: 'rgb(var(--slate-200) / <alpha-value>)',
          300: 'rgb(var(--slate-300) / <alpha-value>)',
          400: 'rgb(var(--slate-400) / <alpha-value>)',
          500: 'rgb(var(--slate-500) / <alpha-value>)',
          600: 'rgb(var(--slate-600) / <alpha-value>)',
          700: 'rgb(var(--slate-700) / <alpha-value>)',
          800: 'rgb(var(--slate-800) / <alpha-value>)',
          900: 'rgb(var(--slate-900) / <alpha-value>)',
          950: 'rgb(var(--slate-950) / <alpha-value>)',
        },
        teal: {
          50: 'rgb(var(--teal-50) / <alpha-value>)',
          100: 'rgb(var(--teal-100) / <alpha-value>)',
          200: 'rgb(var(--teal-200) / <alpha-value>)',
          300: 'rgb(var(--teal-300) / <alpha-value>)',
          400: 'rgb(var(--teal-400) / <alpha-value>)',
          500: 'rgb(var(--teal-500) / <alpha-value>)',
          600: 'rgb(var(--teal-600) / <alpha-value>)',
          700: 'rgb(var(--teal-700) / <alpha-value>)',
          800: 'rgb(var(--teal-800) / <alpha-value>)',
          900: 'rgb(var(--teal-900) / <alpha-value>)',
          950: 'rgb(var(--teal-950) / <alpha-value>)',
        },
      },
      animation: {
        'float-gentle': 'floatGentle 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        },
      },
      boxShadow: {
        'fintech-sm': 'var(--shadow-fintech-sm, 0 2px 8px -2px rgba(0, 0, 0, 0.4))',
        'fintech-md': 'var(--shadow-fintech-md, 0 12px 24px -6px rgba(0, 0, 0, 0.5))',
        'fintech-lg': 'var(--shadow-fintech-lg, 0 24px 48px -12px rgba(0, 0, 0, 0.65))',
        'fintech-emerald': 'var(--shadow-fintech-emerald, 0 12px 30px -8px rgba(0, 186, 242, 0.3))',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
