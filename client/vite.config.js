import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // This intercept calls to /api and redirects them to your backend
      '/api': {
        target: 'https://shelfsync-api.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})