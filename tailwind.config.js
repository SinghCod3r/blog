/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#07080a',
        paper: '#f0f0e9',
        muted: '#989c99',
        lime: '#d8ff58',
        violet: '#a786ff',
        coral: '#ff806d',
        cyan: '#7ff3da',
        line: 'rgba(240, 240, 233, 0.12)',
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.65' }],
        'label': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        'caption': ['0.7rem', { lineHeight: '1.5', letterSpacing: '0.03em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'prose': '720px',
        'prose-lg': '800px',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', "'Plus Jakarta Sans'", 'sans-serif'],
        display: ['var(--font-syne)', "'Syne'", 'sans-serif'],
        serif: ['var(--font-serif)', "'Instrument Serif'", 'serif'],
        mono: ['var(--font-mono)', "'JetBrains Mono'", 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'roll-in': 'rollIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'island-expand': 'islandExpand 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-gentle': 'floatGentle 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 5s ease-in-out infinite',
      },
      keyframes: {
        rollIn: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        islandExpand: {
          from: { transform: 'scale(0.92)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(216, 255, 88, 0.35))' },
          '50%': { opacity: '0.95', filter: 'drop-shadow(0 0 30px rgba(216, 255, 88, 0.65))' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}