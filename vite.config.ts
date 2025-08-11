import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
// Removed lovable-tagger to eliminate injected tags/metadata

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Add base path for GitHub Pages (replace 'galton-board' with your repo name)
  base: process.env.NODE_ENV === 'production' ? '/galton-board/' : '/',
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
