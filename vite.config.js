import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Scoop Society',
        short_name: 'Scoop',
        description: 'Small-batch ice cream, ordered ahead.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#dce9cc',
        theme_color: '#d6336c',
        icons: [
          { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // never let the service worker answer API calls with index.html
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  server: {
    // run `npm run dev:api` alongside `npm run dev`
    proxy: { '/api': 'http://localhost:8788' },
  },
});