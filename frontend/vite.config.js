import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration compatible Electron build
export default defineConfig({
  plugins: [react()],
  base: './', // <<--- OBLIGATOIRE pour que Electron charge correctement /assets/*
  build: {
    outDir: 'dist',
  }
})
