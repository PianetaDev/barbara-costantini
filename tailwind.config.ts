import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './components/**/*.{vue,ts,js}',
    './layouts/**/*.{vue,ts,js}',
    './pages/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      // ── Design tokens da Figma Style Guide ─────────────────────────
      colors: {
        bc: {
          cream:  '#F5F0E8',  // sfondo principale
          black:  '#0A0A0A',  // testo principale
          white:  '#FFFFFF',
        },
      },
      fontFamily: {
        garamond: ['"EB Garamond"', 'Georgia', 'serif'],
        sans:     ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Scale tipografica da Figma
        'bc-xs':   ['12px', { lineHeight: '1.5' }],
        'bc-sm':   ['14px', { lineHeight: '1.5' }],
        'bc-base': ['16px', { lineHeight: '1.6' }],
        'bc-lg':   ['20px', { lineHeight: '1.5' }],
        'bc-xl':   ['24px', { lineHeight: '1.3' }],
        'bc-2xl':  ['32px', { lineHeight: '1.2' }],
        'bc-3xl':  ['48px', { lineHeight: '1.1' }],
        'bc-4xl':  ['64px', { lineHeight: '1.0' }],
      },
      spacing: {
        // Spacing coerente con la griglia 1440px del Figma
        'bc-page': '80px',   // padding laterale desktop
        'bc-sm':   '24px',
        'bc-md':   '48px',
        'bc-lg':   '80px',
        'bc-xl':   '120px',
      },
      maxWidth: {
        'bc-content': '1280px',
      },
    },
  },
  plugins: [],
} satisfies Config
