import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './plugins/**/*.ts',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        th: {
          bg: 'rgb(var(--t-bg) / <alpha-value>)',
          'bg-alt': 'rgb(var(--t-bg-alt) / <alpha-value>)',
          'bg-el': 'rgb(var(--t-bg-el) / <alpha-value>)',
          fg: 'rgb(var(--t-fg) / <alpha-value>)',
          body: 'rgb(var(--t-body) / <alpha-value>)',
          muted: 'rgb(var(--t-muted) / <alpha-value>)',
          subtle: 'rgb(var(--t-subtle) / <alpha-value>)',
          faint: 'rgb(var(--t-faint) / <alpha-value>)',
          overlay: 'rgb(var(--t-overlay) / <alpha-value>)',
          edge: 'rgb(var(--t-edge) / <alpha-value>)',
          accent: 'rgb(var(--t-accent) / <alpha-value>)',
          'accent-soft': 'rgb(var(--t-accent-soft) / <alpha-value>)',
          'accent-cyan': 'rgb(var(--t-accent-cyan) / <alpha-value>)',
          'accent-violet': 'rgb(var(--t-accent-violet) / <alpha-value>)',
          'ring-from': 'rgb(var(--t-ring-from) / <alpha-value>)',
          'ring-via': 'rgb(var(--t-ring-via) / <alpha-value>)',
          'ring-to': 'rgb(var(--t-ring-to) / <alpha-value>)',
          btn: 'rgb(var(--t-btn) / <alpha-value>)',
          'btn-hover': 'rgb(var(--t-btn-hover) / <alpha-value>)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
