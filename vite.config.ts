import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Base path for deployment (supports staging and production)
  // Use: npm run build for production (base = '/')
  // Or: VITE_BASE_PATH=/staging npm run build for staging
  base: process.env.VITE_BASE_PATH || '/',

  // Proxy API calls to XAMPP Apache server for local development
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/DIMA/api'),
      },
      '/admin': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, '/DIMA/admin'),
      },
      '/DIMA/uploads': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.png'],
})
