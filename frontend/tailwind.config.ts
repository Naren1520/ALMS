import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory:        '#FDFBF7',
        'ivory-dark': '#F5F0E8',
        cream:        '#EDE8DF',
        charcoal:     '#1A1A1A',
        'charcoal-mid':'#2E2E2E',
        stone:        '#6B6560',
        'stone-light':'#9E9890',
        gold:         '#B8965A',
        'gold-dark':  '#9A7A42',
        'gold-light': '#D4B47A',
        border:       '#E2DDD6',
        'border-light':'#EDEAE4',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 8vw, 7rem)',   { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(2rem, 3.5vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.15' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.7' }],
        'body-base':  ['1rem',     { lineHeight: '1.65' }],
        'caption':    ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.04em' }],
        'overline':   ['0.6875rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '120': '30rem',
      },
      maxWidth: {
        'container': '1320px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'luxury-in-out': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      boxShadow: {
        'xs':  '0 1px 3px rgba(26,26,26,0.06), 0 1px 2px rgba(26,26,26,0.04)',
        'sm':  '0 2px 6px rgba(26,26,26,0.07), 0 1px 3px rgba(26,26,26,0.05)',
        'md':  '0 4px 16px rgba(26,26,26,0.10), 0 2px 6px rgba(26,26,26,0.06)',
        'lg':  '0 10px 32px rgba(26,26,26,0.12), 0 4px 12px rgba(26,26,26,0.07)',
        'xl':  '0 20px 56px rgba(26,26,26,0.14), 0 8px 20px rgba(26,26,26,0.08)',
        '2xl': '0 32px 80px rgba(26,26,26,0.18), 0 12px 32px rgba(26,26,26,0.10)',
        'gold': '0 4px 20px rgba(184,150,90,0.35)',
        'gold-lg': '0 8px 32px rgba(184,150,90,0.4)',
      },
      borderRadius: {
        'none': '0',
        'xs':   '6px',
        'sm':   '10px',
        DEFAULT:'12px',
        'md':   '16px',
        'lg':   '24px',
        'xl':   '32px',
        '2xl':  '48px',
        '3xl':  '64px',
        'full': '9999px',
      },
      animation: {
        'fade-up':   'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':   'fadeIn 0.5s ease-out both',
        'line-grow': 'lineGrow 0.8s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        lineGrow: {
          '0%':   { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-ivory', 'bg-ivory-dark', 'bg-cream', 'bg-charcoal', 'bg-charcoal-mid',
    'text-ivory', 'text-charcoal', 'text-gold', 'text-stone', 'text-stone-light',
    'border-border', 'border-gold',
    'py-24', 'py-32', 'md:py-32',
  ],
};

export default config;
