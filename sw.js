/* sw.js - Root Directory */
try {
    // We use relative paths here so the browser looks inside your repo folder
    importScripts('./uv/uv.bundle.js');
    importScripts('./uv/uv.config.js');
    importScripts('./uv/uv.sw.js');

    const sw = new UVServiceWorker();

    self.addEventListener('fetch', (event) => {
        event.respondWith(sw.fetch(event));
    });
    
    console.log("SW: Files imported successfully.");
} catch (e) {
    console.error("SW: Failed to load Ultraviolet scripts. Check your /uv/ folder.", e);
}
