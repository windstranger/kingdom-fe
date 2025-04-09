import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

const key = fs.readFileSync('./192.168.0.174-key.pem');
const cert = fs.readFileSync('./192.168.0.174.pem');
export default defineConfig({
  plugins: [
    react(),
    viteBasicSslPlugin(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'WebRTC PWA Chat',
        short_name: 'Chat',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#0d6efd',
        icons: [],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => true,
            handler: 'CacheFirst',
            options: {
              cacheName: 'offline-cache',
              expiration: {
                maxEntries: 200,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    // https: true,
    https: {
      key,
      cert,
    },
    host: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});
