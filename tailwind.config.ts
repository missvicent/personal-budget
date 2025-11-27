import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Primary Colors - Updated Purple Gradient Palette
        black: '#000000',
        gray: {
          900: '#171717',
          800: '#262626',
        },
        purple: {
          950: '#0d0015', // Darkest
          900: '#1a0014', // Very Dark Purple-Black (main dark bg)
          850: '#2d0a3d', // Deep Purple
          800: '#2d1b69', // Dark Purple
          700: '#3d1e5c', // Rich Dark Purple
          600: '#4a2970', // Royal Purple
          500: '#5c3585', // Rich Purple (gradient peak)
          400: '#7e22ce', // Bright Purple
          350: '#8b5cf6', // Light Bright Purple
          300: '#9333ea', // Vibrant Purple
          250: '#a855f7', // Primary Purple (buttons/accents)
          200: '#c084fc', // Light Purple
          150: '#d8b4fe', // Pale Purple (text)
          100: '#e9d5ff', // Very Pale Purple (subtle text)
          50: '#f3e8ff', // Almost White Purple
        },

        green: {
          100: '#10b981',
          200: '#059669',
          300: '#34d399',
          400: '#059669',
          500: '#34d399',
          600: '#059669',
          700: '#34d399',
          800: '#059669',
          900: '#34d399',
        },

        // Functional Colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',

        // Additional Accent Colors for Dashboard
        budgetGreen: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399',
        },
        budgetRed: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
          light: '#f87171',
        },
        budgetAmber: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24',
        },
      },

      // Background Gradients
      backgroundImage: {
        'budget-gradient':
          'linear-gradient(180deg, #1a0014 0%, #2d0a3d 10%, #3d1e5c 20%, #4a2970 35%, #5c3585 50%, #4a2970 65%, #3d1e5c 80%, #2d0a3d 90%, #1a0014 100%)',
        'budget-gradient-simple':
          'linear-gradient(180deg, #1a0014 0%, #3d1e5c 25%, #5c3585 50%, #3d1e5c 75%, #1a0014 100%)',
        'budget-gradient-radial':
          'radial-gradient(ellipse at center, #5c3585 0%, #3d1e5c 25%, #2d1b69 50%, #1a0014 100%)',
        'button-gradient': 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
        'button-gradient-hover':
          'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
        'success-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(126, 34, 206, 0.1) 100%)',
      },

      // Box Shadows with purple tint
      boxShadow: {
        purple: '0 10px 40px -10px rgba(168, 85, 247, 0.3)',
        'purple-lg': '0 20px 60px -15px rgba(168, 85, 247, 0.4)',
        glow: '0 0 40px rgba(168, 85, 247, 0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config
