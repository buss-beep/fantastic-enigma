/* sw.js - Root Directory */
try {
    importScripts('/fantastic-enigma/uv/uv.bundle.js');
    importScripts('/fantastic-enigma/uv/uv.config.js');
    importScripts('/fantastic-enigma/uv/uv.sw.js');

    const sw = new UVServiceWorker();

    self.addEventListener('install', (event) => {
        self.skipWaiting(); // Force activation
    });

    self.addEventListener('activate', (event) => {
        event.waitUntil(clients.claim()); // Take control of page immediately
    });

    self.addEventListener('fetch', (event) => {
        event.respondWith(sw.fetch(event));
    });
    
    console.log("SW: Aggressively active on /fantastic-enigma/");
} catch (e) {
    console.error("SW: Initialization failed", e);
}
