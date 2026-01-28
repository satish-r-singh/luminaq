/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luminaq: {
          bg: '#080808',
          surface: '#0a0a0a',
          card: '#121212',
          elevated: '#1a1a1a',
          border: '#2a2a2a',
          accent: '#a1835d',
          accentHover: '#b3956d',
          text: '#f0f0f0',
          muted: '#888888'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(8,8,8,1))",
      }
    }
  },
  plugins: [],
}
