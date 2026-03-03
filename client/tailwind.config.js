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
        'cyber-blue': '#3b82f6',
        'cyber-green': '#10b981',
        'cyber-purple': '#8b5cf6',
        'cyber-pink': '#ec4899',
        'cyber-yellow': '#f59e0b',
        'cyber-orange': '#f97316',
        'cyber-red': '#ef4444'
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, #060818 0%, #0a0e27 50%, #1a1f3a 100%)',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(239, 68, 68, 0.3)',
        'cyber-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'cyber-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'cyber-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'cyber-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'cyber-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
        'cyber-yellow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'cyber-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
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