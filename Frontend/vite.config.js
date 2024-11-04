import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Upscale',
        short_name: 'crs_app',
        description: 'An online platform to purchase and view courses.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3399cc',
        icons: [
          {
            src: 'path/to/icon-192x192.png', // replace with your icon path
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'path/to/icon-512x512.png', // replace with your icon path
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
