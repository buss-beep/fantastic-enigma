/* sw.js - Root Directory */
try {
    // Explicit full paths for GitHub Pages subfolder
    importScripts('/fantastic-enigma/uv/uv.bundle.js');
    importScripts('/fantastic-enigma/uv/uv.config.js');
    importScripts('/fantastic-enigma/uv/uv.sw.js');

    const sw = new UVServiceWorker();

    self.addEventListener('fetch', (event) => {
        event.respondWith(sw.fetch(event));
    });
    
    console.log("Service Worker: Active and Paths Loaded");
} catch (e) {
    console.error("Service Worker: Import Error", e);
}
