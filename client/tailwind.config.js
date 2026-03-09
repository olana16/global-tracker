/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0e27',
        'cyber-darker': '#060818',
         'cyber-blue': '#0891b2',
        'cyber-green': '#059669',
        'cyber-purple': '#7c3aed',
        'cyber-pink': '#ec4899',
        'cyber-yellow': '#eab308',
        'cyber-orange': '#f97316',
        'cyber-red': '#0891b2'
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(8, 145, 178, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(8, 145, 178, 0.1) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #060818 0%, #0a0e27 50%, #1a1f3a 100%)',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(8, 145, 178, 0.3)',
        'cyber-blue': '0 0 20px rgba(8, 145, 178, 0.3)',
        'cyber-green': '0 0 20px rgba(5, 150, 105, 0.3)',
        'cyber-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'cyber-red': '0 0 20px rgba(8, 145, 178, 0.3)',
        'cyber-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
        'cyber-yellow': '0 0 20px rgba(234, 179, 8, 0.3)',
        'cyber-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
      },
      animation: {
        'pulse-cyber': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(8, 145, 178, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(8, 145, 178, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}