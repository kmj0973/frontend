import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png'],
      manifest: {
        name: 'Trip Truth',
        short_name: 'TripTruth',
        description: '여행 취향을 모아 함께 더 잘 맞는 여행 계획을 만드는 앱',
        theme_color: '#ff822e',
        background_color: '#fcfdfd',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        lang: 'ko-KR',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
});
