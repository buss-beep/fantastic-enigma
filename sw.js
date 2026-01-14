/* sw.js - Root Directory */
importScripts('/fantastic-enigma/uv/uv.bundle.js');
importScripts('/fantastic-enigma/uv/uv.config.js');
importScripts('/fantastic-enigma/uv/uv.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
    event.respondWith(sw.fetch(event));
});

// Force the Service Worker to take control immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});
