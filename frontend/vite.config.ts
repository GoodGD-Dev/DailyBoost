import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@features': path.resolve(__dirname, './src/features'),
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@theme': path.resolve(__dirname, './src/features/theme'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@styles': path.resolve(__dirname, './src/styles'),
      'firebase/app': 'firebase/app',
      'firebase/auth': 'firebase/auth',
      'firebase/analytics': 'firebase/analytics'
    }
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth']
  }
})
