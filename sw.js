/* sw.js - Root Directory */
try {
    importScripts('/fantastic-enigma/uv/uv.bundle.js');
    importScripts('/fantastic-enigma/uv/uv.config.js');
    importScripts('/fantastic-enigma/uv/uv.sw.js');

    const sw = new UVServiceWorker();

    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

    self.addEventListener('fetch', (event) => {
        event.respondWith(sw.fetch(event));
    });
} catch (e) {
    console.error("SW Error:", e);
}
