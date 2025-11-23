import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Forced Port of 3000 for URL match with Auth0 configuration
  server: {           
    port: 3000,
  },
})