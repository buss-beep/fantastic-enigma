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
    if (!servers) return;
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

    button.innerText = "Launching...";
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
        // Add a safety timeout to the launch
        const launchPromise = launch(url);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Launch Timeout - Refresh and try again")), 7000)
        );

        await Promise.race([launchPromise, timeoutPromise]);
    } catch (err) {
        console.error(err);
        button.innerText = "Error";
        alert(err.message);
        setTimeout(() => { button.innerText = "Go"; button.disabled = false; }, 2000);
    }
});

async function launch(url) {
    if (!('serviceWorker' in navigator)) {
        throw new Error("SW Not Supported");
    }

    const registration = await navigator.serviceWorker.register('/fantastic-enigma/sw.js', {
        scope: __uv$config.prefix
    });

    // Explicitly wait for the worker to be ready
    await navigator.serviceWorker.ready;

    window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
}

function isUrl(val = '') {
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
}

function stealthLaunch() {
    const query = input.value.trim();
    if (!query) return alert("Enter something first.");
    const win = window.open();
    if (!win) return;
    const iframe = win.document.createElement('iframe');
    iframe.style.cssText = "width:100%; height:100%; border:none; position:fixed; top:0; left:0;";
    const engines = { google: 'https://www.google.com/search?q=', ddg: 'https://duckduckgo.com/?q=' };
    let target = isUrl(query) ? query : engines[currentEngine] + encodeURIComponent(query);
    if (!target.startsWith('http')) target = 'http://' + target;
    iframe.src = window.location.origin + __uv$config.prefix + __uv$config.encodeUrl(target);
    win.document.body.appendChild(iframe);
    window.location.replace("https://canvas.instructure.com");
}
