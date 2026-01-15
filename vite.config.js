import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'norteautomotores.up.railway.app' // Agrega tu dominio aquí
    ]
  },
  server: {
    // Esto es para desarrollo local, puedes dejarlo como está
    allowedHosts: true 
  }
})