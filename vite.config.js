import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
  ],
  base: '/protoolkit/', // <-- यह लाइन जोड़ें (अपनी repo का नाम)
})
