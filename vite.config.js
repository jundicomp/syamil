import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/syamil/', // GitHub Pages menyajikan repo ini dari subpath /syamil/, bukan root domain
})
