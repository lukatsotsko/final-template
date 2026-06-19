import { applyLang, initLangToggle } from './i18n.js';

if (!localStorage.getItem('user')) window.location.href = 'login.html';

const u = document.getElementById('nav-user');
if (u) u.textContent = localStorage.getItem('user') || '';

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    window.location.href = 'login.html';
});

applyLang();
initLangToggle();
