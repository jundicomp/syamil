import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/syamil/', // GitHub Pages menyajikan repo ini dari subpath /syamil/, bukan root domain
  define: {
    // Terisi otomatis tiap kali di-build — karena GitHub Actions build tiap push,
    // ini jadi indikator akurat "kapan terakhir di-push" tanpa perlu backend.
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
