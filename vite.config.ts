import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@app', replacement: '/src/app' },
      { find: '@assets', replacement: '/src/assets' },
      { find: '@dev', replacement: '/src/dev' },
      { find: '@features', replacement: '/src/features' },
      { find: '@icons', replacement: '/src/shared/icons' },
      { find: '@layouts', replacement: '/src/layouts' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@shared', replacement: '/src/shared' },
      { find: '@styles', replacement: '/src/styles' },
      { find: '@ui', replacement: '/src/ui' },
    ],
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
})
