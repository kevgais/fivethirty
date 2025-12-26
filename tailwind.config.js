/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        'warm-white': '#FFFDF9',
        terracotta: '#C65D3B',
        sage: '#7B9E87',
        charcoal: '#2D2D2D',
        mushroom: '#8B7E74',
        butter: '#F5E6C8',
        'clock-gold': '#D4A853',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
      borderRadius: {
        'soft': '12px',
        'round': '24px',
      },
      spacing: {
        'unit': '8px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'check': 'check 0.3s ease-out forwards',
      },
      keyframes: {
        check: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
