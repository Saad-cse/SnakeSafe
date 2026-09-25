/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E3A8A',       // Primary Medical Navy Blue
          lightBlue: '#3B82F6',  // Action Blue
          cyan: '#06B6D4',       // Healthcare Teal/Cyan
          red: '#DC2626',        // Critical Emergency Crimson
          darkRed: '#991B1B',    // Severe Dark Red
          green: '#059669',      // Verified/Safe Green
          emerald: '#10B981',    // Active status
          amber: '#D97706',      // Warning Amber
          purple: '#7C3AED',     // Treatment Clinical Purple
          hospital: '#4F46E5',   // Hospital Primary Indigo
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'emergency': '0 0 25px rgba(220, 38, 38, 0.45)',
        'card-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
