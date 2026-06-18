// ── Account storage ──────────────────────────────────────────
function getAccounts() {
    return JSON.parse(localStorage.getItem('wx_accounts') || '[]');
}

function saveAccount(account) {
    const accounts = getAccounts();
    accounts.push(account);
    localStorage.setItem('wx_accounts', JSON.stringify(accounts));
}

function findAccount(username) {
    return getAccounts().find(a => a.username.toLowerCase() === username.toLowerCase());
}

// ── Crypto helpers ────────────────────────────────────────────
function generateSalt() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(salt + password));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for non-secure contexts (http without localhost)
    return btoa(unescape(encodeURIComponent(salt + ':' + password)));
}

// ── Seed demo account once ────────────────────────────────────
(async () => {
    if (!findAccount('demo')) {
        const salt = 'wx_demo_fixed_salt_v1';
        const passwordHash = await hashPassword('demo123', salt);
        saveAccount({ username: 'demo', email: 'demo@weather.app', salt, passwordHash });
    }
})();

// ── Redirect if already logged in ────────────────────────────
if (localStorage.getItem('user')) {
    window.location.href = 'index.html';
}

// ── Tab switching ─────────────────────────────────────────────
const tabLogin    = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const panelLogin  = document.getElementById('panel-login');
const panelReg    = document.getElementById('panel-register');

function switchTab(tab) {
    const toLogin = tab === 'login';
    tabLogin.classList.toggle('auth-tab--active', toLogin);
    tabRegister.classList.toggle('auth-tab--active', !toLogin);
    panelLogin.hidden = !toLogin;
    panelReg.hidden   = toLogin;
    // Clear errors when switching
    document.getElementById('login-error').hidden = true;
    document.getElementById('register-error').hidden = true;
}

tabLogin.addEventListener('click', () => switchTab('login'));
tabRegister.addEventListener('click', () => switchTab('register'));

// ── Password visibility toggles ───────────────────────────────
function setupEyeToggle(btnId, inputId) {
    document.getElementById(btnId).addEventListener('click', () => {
        const input = document.getElementById(inputId);
        const btn   = document.getElementById(btnId);
        const show  = input.type === 'password';
        input.type  = show ? 'text' : 'password';
        btn.textContent = show ? '🙈' : '👁';
    });
}

setupEyeToggle('toggle-login-pw',    'login-password');
setupEyeToggle('toggle-reg-pw',      'reg-password');
setupEyeToggle('toggle-reg-confirm', 'reg-confirm');

// ── Helper: show error ────────────────────────────────────────
function showError(elId, message) {
    const el = document.getElementById(elId);
    el.textContent = message;
    el.hidden = false;
}

// ── Sign In ───────────────────────────────────────────────────
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const btn      = document.getElementById('login-submit-btn');

    document.getElementById('login-error').hidden = true;
    btn.textContent = 'Signing in…';
    btn.disabled    = true;

    const account = findAccount(username);
    if (!account) {
        showError('login-error', 'No account found with that username.');
        btn.textContent = 'Sign In';
        btn.disabled    = false;
        return;
    }

    const hash = await hashPassword(password, account.salt);
    if (hash !== account.passwordHash) {
        showError('login-error', 'Incorrect password. Please try again.');
        btn.textContent = 'Sign In';
        btn.disabled    = false;
        return;
    }

    localStorage.setItem('user', account.username);
    document.cookie = 'authorized=true; path=/';
    window.location.href = 'index.html';
});

// ── Sign Up ───────────────────────────────────────────────────
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm  = document.getElementById('reg-confirm').value;
    const btn      = document.getElementById('register-submit-btn');

    document.getElementById('register-error').hidden = true;

    if (username.length < 3) {
        showError('register-error', 'Username must be at least 3 characters.');
        return;
    }
    if (findAccount(username)) {
        showError('register-error', 'That username is already taken.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('register-error', 'Please enter a valid email address.');
        return;
    }
    if (password.length < 6) {
        showError('register-error', 'Password must be at least 6 characters.');
        return;
    }
    if (password !== confirm) {
        showError('register-error', 'Passwords do not match.');
        return;
    }

    btn.textContent = 'Creating account…';
    btn.disabled    = true;

    const salt         = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    saveAccount({ username, email, salt, passwordHash });

    localStorage.setItem('user', username);
    document.cookie = 'authorized=true; path=/';
    window.location.href = 'index.html';
});
