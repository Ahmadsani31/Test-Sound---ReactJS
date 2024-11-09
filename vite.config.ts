import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base:'http://localhost:8081/',
  plugins: [react()],
  resolve: {
    alias: {
        '@': '/public',
    },
}
})