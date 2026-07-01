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
          canvas: '#F7F6EF',  // --color/surface-canvas (esatto da Figma)
          black:  '#000000',  // --color/content-medium / dark-100
          white:  '#FFFFFF',
        },
      },
      fontFamily: {
        garamond: ['"Public Sans"', 'system-ui', 'sans-serif'],
        sans:     ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Scale tipografica — Public Sans
        'bc-label2':  ['14px', { lineHeight: '1.2', letterSpacing: '0.028em' }],
        'bc-label1':  ['16px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'bc-nav':     ['16px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'bc-btn':     ['18px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'bc-body2':   ['18px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'bc-body1':   ['20px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'bc-sub':     ['28px', { lineHeight: '1.2' }],
        'bc-h4':      ['20px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'bc-h3':      ['24px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'bc-h2':      ['32px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'bc-h1':      ['40px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
      },
      spacing: {
        // Spacing tokens da Figma (--spacing/*)
        'bc-2xs': '4px',
        'bc-xs':  '8px',
        'bc-sm':  '12px',
        'bc-md':  '16px',
        'bc-xl':  '32px',
        'bc-2xl': '48px',
        'bc-4xl': '80px',
        'bc-page': '32px',    // padding laterale nav/footer
      },
      maxWidth: {
        'bc-content': '1140px',  // griglia interna Figma
        'bc-wrap':    '1440px',  // larghezza frame
      },
    },
  },
  safelist: [
    { pattern: /^text-bc-/ },
  ],
  plugins: [],
} satisfies Config
