import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/stars': 'http://localhost:8000',
      '/habitability': 'http://localhost:8000',
      '/fits': 'http://localhost:8000',
      '/data': 'http://localhost:8000'
    }
  }
})
