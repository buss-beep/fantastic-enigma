const input = document.getElementById('uv-address');
const button = document.getElementById('uv-btn');
const googleBtn = document.getElementById('google-btn');
const ddgBtn = document.getElementById('ddg-btn');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

let currentEngine = localStorage.getItem('engine') || 'google';

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
}

function testWisp(url) {
    return new Promise((resolve) => {
        const socket = new WebSocket(url);
        const timeout = setTimeout(() => { socket.close(); resolve(false); }, 2500);
        socket.onopen = () => { clearTimeout(timeout); socket.close(); resolve(true); };
        socket.onerror = () => { clearTimeout(timeout); resolve(false); };
    });
}

button.addEventListener('click', async () => {
    let url = input.value.trim();
    if (!url) return;

    button.innerText = "Connecting...";
    button.disabled = true;

    const engines = {
        google: 'https://www.google.com/search?q=',
        ddg: 'https://duckduckgo.com/?q='
    };

    if (!isUrl(url)) {
        url = engines[currentEngine] + encodeURIComponent(url);
    } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = 'http://' + url;
    }

    try {
        await launch(url);
    } catch (err) {
        button.innerText = "Error";
        alert("Error: " + err.message);
        setTimeout(() => { button.innerText = "Go"; button.disabled = false; }, 2000);
    }
});

async function launch(url) {
    const registration = await navigator.serviceWorker.register('/fantastic-enigma/sw.js', {
        scope: '/fantastic-enigma/service/'
    });

    // If the worker isn't active yet, we must wait or the 404 will happen
    if (!navigator.serviceWorker.controller) {
        button.innerText = "Initializing...";
        await new Promise(resolve => {
            navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
            // Fallback for Safari/Slow Browsers
            setTimeout(resolve, 1000);
        });
    }

    window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
}

function isUrl(val = '') {
    if (/^http(s?):\/\//.test(val) || (val.includes('.') && val.substr(0, 1) !== ' ')) return true;
    return false;
}
