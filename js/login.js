import { applyLang, initLangToggle, t } from './i18n.js';

if (localStorage.getItem('user')) {
    window.location.href = 'index.html';
}

applyLang();
initLangToggle();

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('name-input').value.trim();
    const errorEl = document.getElementById('login-error');

    if (!name) {
        errorEl.textContent = t('login.error.required');
        errorEl.hidden = false;
        return;
    }

    errorEl.hidden = true;
    localStorage.setItem('user', name);
    document.cookie = 'authorized=true; path=/';
    window.location.href = 'index.html';
});
