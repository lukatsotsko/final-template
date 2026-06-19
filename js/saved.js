import './nav.js';
import { getSavedCities, removeCity } from './storage.js';
import { createSavedCityCard } from './ui.js';
import { applyLang, initLangToggle } from './i18n.js';

if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';
}

document.getElementById('nav-user').textContent = localStorage.getItem('user') || '';

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    window.location.href = 'login.html';
});

applyLang();
initLangToggle();

function renderSaved() {
    const items = getSavedCities();
    const grid  = document.getElementById('saved-grid');
    const empty = document.getElementById('saved-empty');

    grid.innerHTML = '';

    if (!items.length) {
        empty.hidden = false;
        return;
    }

    empty.hidden = true;

    items.forEach(city => {
        const card = createSavedCityCard(
            city,
            (name) => { removeCity(name); renderSaved(); },
            (name) => { window.location.href = `index.html?city=${encodeURIComponent(name)}`; }
        );
        grid.appendChild(card);
    });
}

// Re-render cards on language change so button labels update
document.addEventListener('langchange', renderSaved);

renderSaved();
