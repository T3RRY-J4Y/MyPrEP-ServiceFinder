import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',

  server: {
    // Required for Codespaces — listen on all interfaces, not just localhost
    host: '0.0.0.0',
    port: 5173,
    // Allow the *.github.dev / *.app.github.dev preview URLs Codespaces generates
    allowedHosts: ['.github.dev', '.app.github.dev', 'localhost'],
    // Vite HMR needs the correct host when accessed through a tunnel
    hmr: {
      clientPort: 443   // Codespaces proxies over HTTPS/443
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false,   // no source maps in production (security)
  },
})
