/* sw.js - Root Directory */
console.log("SW Loaded: Starting imports...");

try {
    importScripts('./uv/uv.bundle.js');
    importScripts('./uv/uv.config.js');
    importScripts('./uv/uv.sw.js');

    const sw = new UVServiceWorker();

    self.addEventListener('fetch', (event) => {
        event.respondWith(sw.fetch(event));
    });
    console.log("SW: Setup Complete");
} catch (e) {
    console.error("SW: Import failed", e);
}
