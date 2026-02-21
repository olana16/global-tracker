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
        'cyber-blue': '#ef4444',
        'cyber-green': '#ef4444',
        'cyber-purple': '#ef4444',
        'cyber-pink': '#ef4444',
        'cyber-yellow': '#ef4444',
        'cyber-orange': '#ef4444',
        'cyber-red': '#ef4444'
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #060818 0%, #0a0e27 50%, #1a1f3a 100%)',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(239, 68, 68, 0.3)',
        'cyber-green': '0 0 20px rgba(239, 68, 68, 0.3)',
        'cyber-purple': '0 0 20px rgba(239, 68, 68, 0.3)',
        'cyber-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'cyber-orange': '0 0 20px rgba(239, 68, 68, 0.3)',
        'cyber-yellow': '0 0 20px rgba(239, 68, 68, 0.3)',
        'cyber-pink': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'pulse-cyber': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}