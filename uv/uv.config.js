/* uv/uv.config.js */
const wispServers = [
    'wss://wisp.mercurywork.shop/',
    'wss://wisp.pydust.com/',
    'wss://flow-wisp.v-v.workers.dev/',
    'wss://shadow.letsendobesity.org/wisp/'
];

const savedWisp = localStorage.getItem('selectedWisp') || wispServers[0];

self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/', 
    wisp: savedWisp, 
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};

self.__uv$wispServers = wispServers;
