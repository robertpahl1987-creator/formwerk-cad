import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base './' → läuft unter jedem Pfad (GitHub Pages, eigener Server, lokal)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: { three: ['three'], jscad: ['@jscad/modeling'], react: ['react', 'react-dom'] },
      },
    },
  },
});
