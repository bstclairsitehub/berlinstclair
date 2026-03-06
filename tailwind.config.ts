import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['var(--font-playfair)', 'Georgia', 'Cambria', 'serif'],
        body: ['var(--font-merriweather)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-montserrat)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        masthead: ['var(--font-unifraktur)', 'cursive'],
      },
      colors: {
        dp: {
          bg: '#0D0D0D',
          surface: '#1A1A1A',
          elevated: '#242424',
          border: '#2E2E2E',
          'border-light': '#3A3A3A',
          text: '#E8E8E8',
          'text-secondary': '#999999',
          'text-muted': '#666666',
          gold: '#C9A96E',
          'gold-dim': '#8B7445',
          red: '#D4382C',
          blue: '#5BA3D9',
          green: '#4CAF50',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#E8E8E8',
            fontFamily: 'var(--font-merriweather), Georgia, serif',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
