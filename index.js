const input = document.getElementById('uv-address');
const button = document.getElementById('uv-btn');
const googleBtn = document.getElementById('google-btn');
const ddgBtn = document.getElementById('ddg-btn');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

let currentEngine = localStorage.getItem('engine') || 'google';

// Initialize
window.addEventListener('load', () => {
    updateUI();
    checkStatus();
});

function setEngine(engine) {
    currentEngine = engine;
    localStorage.setItem('engine', engine);
    updateUI();
}

function updateUI() {
    googleBtn.classList.toggle('active', currentEngine === 'google');
    ddgBtn.classList.toggle('active', currentEngine === 'ddg');
}

async function checkStatus() {
    console.log("Checking Wisp status...");
    if (typeof __uv$config === 'undefined') {
        setTimeout(checkStatus, 500);
        return;
    }
    const isAlive = await testWisp(__uv$config.wisp);
    if (isAlive) {
        statusDot.className = 'dot-online';
        statusText.innerText = 'Wisp Online';
    } else {
        statusDot.className = 'dot-offline';
        statusText.innerText = 'Wisp Offline';
        findWorkingWisp();
    }
}

async function findWorkingWisp() {
    const servers = self.__uv$wispServers;
    for (const url of servers) {
        if (await testWisp(url)) {
            __uv$config.wisp = url;
            localStorage.setItem('selectedWisp', url);
            statusDot.className = 'dot-online';
            statusText.innerText = 'Wisp Restored';
            return;
        }
    }
    statusText.innerText = 'All Wisps Offline';
}

function testWisp(url) {
    return new Promise((resolve) => {
        const socket = new WebSocket(url);
        const timeout = setTimeout(() => { socket.close(); resolve(false); }, 2000);
        socket.onopen = () => { clearTimeout(timeout); socket.close(); resolve(true); };
        socket.onerror = () => { clearTimeout(timeout); resolve(false); };
    });
}

button.addEventListener('click', async () => {
    console.log("Button clicked!");
    let url = input.value.trim();
    if (!url) return;

    const engines = {
        google: 'https://www.google.com/search?q=',
        ddg: 'https://duckduckgo.com/?q='
    };

    if (!isUrl(url)) {
        url = engines[currentEngine] + encodeURIComponent(url);
    } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = 'http://' + url;
    }

    console.log("Target URL:", url);
    launch(url);
});

async function launch(url) {
    console.log("Registering Service Worker...");
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js', {
                scope: __uv$config.prefix
            });
            console.log("Registration successful. Redirecting...");
            window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
        } catch (err) {
            console.error("Service Worker failed:", err);
            alert("Error: Service Worker could not register. Check your console (F12).");
        }
    } else {
        alert("Your browser does not support Service Workers.");
    }
}

function isUrl(val = '') {
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
}const input = document.getElementById('uv-address');
const button = document.getElementById('uv-btn');
const googleBtn = document.getElementById('google-btn');
const ddgBtn = document.getElementById('ddg-btn');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

let currentEngine = localStorage.getItem('engine') || 'google';

// Initialize
window.addEventListener('load', () => {
    updateUI();
    checkStatus();
});

function setEngine(engine) {
    currentEngine = engine;
    localStorage.setItem('engine', engine);
    updateUI();
}

function updateUI() {
    googleBtn.classList.toggle('active', currentEngine === 'google');
    ddgBtn.classList.toggle('active', currentEngine === 'ddg');
}

async function checkStatus() {
    console.log("Checking Wisp status...");
    if (typeof __uv$config === 'undefined') {
        setTimeout(checkStatus, 500);
        return;
    }
    const isAlive = await testWisp(__uv$config.wisp);
    if (isAlive) {
        statusDot.className = 'dot-online';
        statusText.innerText = 'Wisp Online';
    } else {
        statusDot.className = 'dot-offline';
        statusText.innerText = 'Wisp Offline';
        findWorkingWisp();
    }
}

async function findWorkingWisp() {
    const servers = self.__uv$wispServers;
    for (const url of servers) {
        if (await testWisp(url)) {
            __uv$config.wisp = url;
            localStorage.setItem('selectedWisp', url);
            statusDot.className = 'dot-online';
            statusText.innerText = 'Wisp Restored';
            return;
        }
    }
    statusText.innerText = 'All Wisps Offline';
}

function testWisp(url) {
    return new Promise((resolve) => {
        const socket = new WebSocket(url);
        const timeout = setTimeout(() => { socket.close(); resolve(false); }, 2000);
        socket.onopen = () => { clearTimeout(timeout); socket.close(); resolve(true); };
        socket.onerror = () => { clearTimeout(timeout); resolve(false); };
    });
}

button.addEventListener('click', async () => {
    console.log("Button clicked!");
    let url = input.value.trim();
    if (!url) return;

    const engines = {
        google: 'https://www.google.com/search?q=',
        ddg: 'https://duckduckgo.com/?q='
    };

    if (!isUrl(url)) {
        url = engines[currentEngine] + encodeURIComponent(url);
    } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = 'http://' + url;
    }

    console.log("Target URL:", url);
    launch(url);
});

async function launch(url) {
    console.log("Registering Service Worker...");
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js', {
                scope: __uv$config.prefix
            });
            console.log("Registration successful. Redirecting...");
            window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
        } catch (err) {
            console.error("Service Worker failed:", err);
            alert("Error: Service Worker could not register. Check your console (F12).");
        }
    } else {
        alert("Your browser does not support Service Workers.");
    }
}

function isUrl(val = '') {
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
}
