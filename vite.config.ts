import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// Build-Stempel: in der App sichtbar und als version.json für die automatische Update-Prüfung
const BUILD = new Date().toISOString();
const versionFile = (): Plugin => ({
  name: 'formwerk-version',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD }) });
  },
});

// base './' → läuft unter jedem Pfad (GitHub Pages, eigener Server, lokal)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), versionFile()],
  define: { __BUILD__: JSON.stringify(BUILD) },
  // Hintergrund-Berechnung (buildWorker) als ES-Modul, damit three/jscad-Chunks geteilt werden können
  worker: { format: 'es' },
  build: {
    target: 'es2022',
    // FW_DEBUG=1: unminifiziert (nur für den Test-Build auf preview-dist)
    minify: process.env.FW_DEBUG ? false : 'esbuild',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: { three: ['three'], jscad: ['@jscad/modeling'], react: ['react', 'react-dom'] },
      },
    },
  },
});
