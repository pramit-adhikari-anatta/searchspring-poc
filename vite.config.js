import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Shopify-portable build: outputs a single self-contained JS bundle + CSS file
// that can be dropped into any Shopify theme via <script src="..."> + <link href="...">
// or served as a Shopify Theme App Extension asset.
export default defineConfig({
  plugins: [react()],
  define: {
    // Allows runtime config injection via window.__SS_CONFIG__ (Shopify theme sections
    // can expose Liquid variables this way: <script>window.__SS_CONFIG__={siteId:'...'}</script>)
    'import.meta.env.VITE_SS_SITE_ID': JSON.stringify(
      process.env.VITE_SS_SITE_ID || ''
    ),
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Single predictable filenames for easy Shopify asset referencing
        entryFileNames: 'searchspring-poc.js',
        assetFileNames: 'searchspring-poc.[ext]',
        manualChunks: undefined,
      },
    },
  },
});
