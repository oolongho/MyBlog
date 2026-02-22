/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00cc66',
          light: '#00ff66',
          dark: '#00b85c',
          darker: '#00a852',
          darkest: '#009948',
        },
        accent: {
          DEFAULT: '#00cc66',
          dark: '#00b85c',
        },
        blog: {
          light: '#eeeeee',
          dark: '#202020',
          card: {
            light: '#ffffff',
            dark: '#2a2a2a',
          },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00cc66 0%, #00ff66 100%)',
        'gradient-header': 'linear-gradient(135deg, #00cc66 0%, #00dd66 50%, #00ff66 100%)',
      },
      borderRadius: {
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}
