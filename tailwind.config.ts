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
        garamond: ['"EB Garamond"', 'Georgia', 'serif'],
        sans:     ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Scale tipografica esatta da Figma MCP
        'bc-label2':  ['14px', { lineHeight: '1.2', letterSpacing: '0.028em' }], // Public Sans Light
        'bc-label1':  ['16px', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // Public Sans Light
        'bc-nav':     ['16px', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // Public Sans Regular
        'bc-btn':     ['18px', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // EB Garamond Regular
        'bc-body2':   ['18px', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // EB Garamond Regular
        'bc-body1':   ['22px', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // EB Garamond Regular
        'bc-sub':     ['28px', { lineHeight: '1.2' }],                           // EB Garamond Regular
        'bc-h4':      ['24px', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // EB Garamond SemiBold
        'bc-h2':      ['38px', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // EB Garamond SemiBold
        'bc-h1':      ['56px', { lineHeight: '1.2', letterSpacing: '0.02em' }],  // EB Garamond SemiBold
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
  plugins: [],
} satisfies Config
