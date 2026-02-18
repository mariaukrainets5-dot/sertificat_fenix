/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        fenix: {
          orange: '#FF5F1F',
          dark: '#0f1012',
          panel: '#18181b',
          border: '#27272a',
          olive: '#4b5320',
        }
      },
      backgroundImage: {
        'tactical-grid': "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    }
  },
  plugins: [],
}