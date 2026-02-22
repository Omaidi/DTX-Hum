// sw.js - Service Worker untuk Akses Offline
const CACHE_NAME = 'dtx-cache-v6';

// File utama yang harus ada di awal
const INITIAL_CACHING = [
    './',
    './index.html'
];

// Saat Service Worker dipasang
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching INITIAL_CACHING...');
            return cache.addAll(INITIAL_CACHING);
        })
    );
    // Langsung aktifkan SW baru tanpa menunggu tutup browser
    self.skipWaiting();
});

// Bersihkan cache lama saat SW baru diaktifkan
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ambil kendali klien segera
    return self.clients.claim();
});

// Strategi: Ambil dari Cache dulu, kalau tidak ada baru ambil dari Network (lalu simpan ke cache)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Jika ada di cache, berikan langsung
            if (response) return response;

            // Jika tidak ada di cache, ambil dari internet
            return fetch(event.request).then((networkResponse) => {
                // Jangan simpan permintaan selain file internal atau audio (berdasarkan URL)
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !event.request.url.includes('Hadroh') && !event.request.url.includes('Simpatik') && !event.request.url.includes('Dtx')) {
                    return networkResponse;
                }

                // Simpan file baru ke cache (termasuk audio yang sedang di-preload)
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Jika gagal fetch dan tidak ada di cache (offline total)
                return null;
            });
        })
    );
});
