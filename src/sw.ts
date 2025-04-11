import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

// Precache and route all assets injected by Vite.
precacheAndRoute(self.__WB_MANIFEST);

// Cache JS and CSS files
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new CacheFirst(),
);

// Cache images
registerRoute(({ request }) => request.destination === 'image', new CacheFirst());

// Fallback to a basic offline page if everything else fails
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
});
self.addEventListener('install', (event) => {
  // self.skipWaiting(); // Activates the new SW immediately
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.webmanifest',
        '/src/main.jsx',
        '/@vite/client',
        'assets/*',
      ]);
    }),
  );
});
