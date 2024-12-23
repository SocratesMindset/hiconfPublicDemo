import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    cors: true,
    host: 'localhost',
    proxy: {
      '/api': {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  },
  preview: {
    port: 3001,
    cors: true,
    host: 'localhost',
    proxy: {
      '/api': {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
