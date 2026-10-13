export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'light-bg': '#ffffff',
        'light-surface': '#f8fafc',
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
      },
      textColor: {
        'light-text': '#0f172a',
        'dark-text': '#f1f5f9',
        'light-primary': '#2563eb',
        'dark-primary': '#3b82f6',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}