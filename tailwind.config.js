export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070b',
        panel: '#0b1018',
        panelStrong: '#0f1622',
        line: 'rgba(148, 163, 184, 0.16)',
        foreground: '#f8fafc',
        muted: '#94a3b8',
        accent: {
          DEFAULT: '#7c8cff',
          soft: 'rgba(124, 140, 255, 0.14)',
        },
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(148, 163, 184, 0.12), 0 20px 60px rgba(2, 6, 23, 0.45)',
        glow: '0 0 0 1px rgba(124, 140, 255, 0.18), 0 0 32px rgba(59, 130, 246, 0.12)',
      },
    },
  },
  plugins: [],
}
