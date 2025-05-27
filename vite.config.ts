import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@components', replacement: '/src/components' },
      { find: '@layouts', replacement: '/src/components/layouts' },
      { find: '@app', replacement: '/src/app' },
      { find: '@features', replacement: '/src/features' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@shared', replacement: '/src/shared' },
      { find: '@styles', replacement: '/src/styles' },
      { find: '@icons', replacement: '/src/icons' },
      { find: '@dev', replacement: '/src/dev' },
    ],
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
})
