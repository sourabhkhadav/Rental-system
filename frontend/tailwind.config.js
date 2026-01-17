/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          500: '#1E40AF',
          600: '#1d4ed8',
          700: '#1e3a8a',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          green: '#22C55E',
          orange: '#F97316',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          800: '#1F2937',
          900: '#111827',
        }
      },
      boxShadow: {
        'card': '0 10px 25px rgba(0,0,0,0.08)',
        'card-hover': '0 20px 40px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'card': '12px',
        'lg-card': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}