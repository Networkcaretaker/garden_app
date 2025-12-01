import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // We set manifest to false because we will create a manual file in /public
      // This gives us more control over the file structure
      manifest: false, 
      workbox: {
        // These are the file types we want to cache for offline use
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: true // Allows us to test PWA features in development
      }
    })
  ]
})