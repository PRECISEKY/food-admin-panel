// vite.config.ts (Correct Example Structure)
import path from "path" // <-- Need this import
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- Need this resolve block ---
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Maps @/* to src/*
    },
  },
  // ------------------------------
})