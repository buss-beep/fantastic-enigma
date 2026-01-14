/* sw.js - Root Directory */
console.log("SW: Correcting paths for GitHub Pages...");

try {
    importScripts('/fantastic-enigma/uv/uv.bundle.js');
    importScripts('/fantastic-enigma/uv/uv.config.js');
    importScripts('/fantastic-enigma/uv/uv.sw.js');

    const sw = new UVServiceWorker();

    self.addEventListener('fetch', (event) => {
        event.respondWith(sw.fetch(event));
    });
} catch (e) {
    console.error("SW: Import failed", e);
}
