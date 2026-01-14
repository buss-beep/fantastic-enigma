/* uv/uv.config.js */
const wispServers = [
    'wss://wisp.mercurywork.shop/',
    'wss://wisp.pydust.com/',
    'wss://flow-wisp.v-v.workers.dev/',
    'wss://shadow.letsendobesity.org/wisp/'
];

const savedWisp = localStorage.getItem('selectedWisp') || wispServers[0];

self.__uv$config = {
    prefix: '/fantastic-enigma/service/',
    bare: '/fantastic-enigma/bare/', 
    wisp: savedWisp, 
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/fantastic-enigma/uv/uv.handler.js',
    bundle: '/fantastic-enigma/uv/uv.bundle.js',
    config: '/fantastic-enigma/uv/uv.config.js',
    sw: '/fantastic-enigma/sw.js', 
};

self.__uv$wispServers = wispServers;
