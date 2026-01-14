/* * uv.config.js
 * This file manages the proxy settings and the Wisp server list.
 */

const wispServers = [
    'wss://wisp.mercurywork.shop/',
    'wss://wisp.pydust.com/',
    'wss://flow-wisp.v-v.workers.dev/',
    'wss://shadow.letsendobesity.org/wisp/'
];

// Get the last used wisp from storage, or default to the first one
const savedWisp = localStorage.getItem('selectedWisp') || wispServers[0];

self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/', 
    
    // The active Wisp server
    wisp: savedWisp, 
    
    // Core UV settings
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};

// Also export the list so index.js can see it for the status check
self.__uv$wispServers = wispServers;