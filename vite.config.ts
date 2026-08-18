import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['offline.html', 'fonts/*.ttf', 'icons/*.png'],
      manifest: {
        name: 'Sohibna',
        short_name: 'Sohibna',
        description: 'Quran reader, prayer times, hafalan & more — Al-Qur’an, waktu shalat, hafalan.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'id',
        theme_color: '#0D1F17',
        background_color: '#F5F0E6',
        icons: [
          { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,ttf}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/quran\//, /^\/auth\//],
        runtimeCaching: [
          {
            // Public Quran content proxied through the Go API. Uses the same
            // 'quran-content' cache name the app's read-through quranCache.ts
            // opens, so Cache Storage puts and SW-served reads agree.
            urlPattern: (opts) =>
              opts.url.origin === apiOrigin() &&
              /^\/quran\/(api|gading)\//.test(opts.url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-content',
              expiration: { maxEntries: 1500, maxAgeSeconds: 60 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // QCF V2 per-page TTFs + IndoPak Nastaleeq (+ V4 COLRv1 woff2).
            // CORS + long max-age verified on the CDN.
            urlPattern: ({ url }) => url.origin === 'https://verses.quran.foundation',
            handler: 'CacheFirst',
            options: {
              cacheName: 'qcf-fonts',
              expiration: { maxEntries: 700, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Per-verse mp3s (audio.qurancdn.com). Verse files are small
            // full-body 200s; the SW stores them whole and Range requests are
            // satisfied from the cached response.
            urlPattern: ({ url }) => url.origin === 'https://audio.qurancdn.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-audio',
              expiration: { maxEntries: 3000, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Scheherazade New (Indonesian/imlai script) via Google Fonts.
            urlPattern: ({ url }) =>
              url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'gfonts',
              expiration: { maxEntries: 60, maxAgeSeconds: 180 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

// The API origin as configured for this build (dev default localhost:8080).
function apiOrigin(): string {
  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
  try {
    return new URL(base).origin
  } catch {
    return 'http://localhost:8080'
  }
}
