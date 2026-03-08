import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  base: './', // ← ADD THIS ONE LINE (THIS IS THE MAGIC)
  build: {
    outDir: 'dist',
    copyPublicDir: true,
    assetsDir: 'assets', // ← ADD THIS FOR GOOD MEASURE
  }
})