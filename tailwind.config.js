/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0F0E0C',
          2: '#3A3832',
          3: '#7A756A',
          4: '#B5B0A5',
        },
        cream: {
          DEFAULT: '#FAF8F4',
          2: '#F2EDE6',
          3: '#E8E1D6',
        },
        amber: {
          DEFAULT: '#C97C2A',
          2: '#E8952F',
          3: '#F5E4C8',
        },
        paper: '#FFFFFF',
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '10px',
        xl: '14px',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.4' },
        },
        floatTilt: {
          '0%, 100%': {
            transform:
              'perspective(1200px) rotateX(2deg) rotateY(-3deg) translateY(0)',
          },
          '50%': {
            transform:
              'perspective(1200px) rotateX(-1deg) rotateY(3deg) translateY(-6px)',
          },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.35s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 1.5s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float-tilt': 'floatTilt 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
