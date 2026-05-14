import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vike from 'vike/plugin'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), vike()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
