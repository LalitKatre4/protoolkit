import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Tailwind plugin wapas add karein

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Ye run hona zaroori hai
  ],
  base: '/protoolkit/', // <-- Base path bhi rahega
})
