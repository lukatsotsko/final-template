import { getSavedCities, removeCity } from './storage.js';
import { createSavedCityCard } from './ui.js';

if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';
}

document.getElementById('nav-user').textContent = localStorage.getItem('user') || '';

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    window.location.href = 'login.html';
});

function renderSaved() {
    const items = getSavedCities();
    const grid = document.getElementById('saved-grid');
    const empty = document.getElementById('saved-empty');

    grid.innerHTML = '';

    if (!items.length) {
        empty.hidden = false;
        return;
    }

    empty.hidden = true;

    items.forEach(city => {
        const card = createSavedCityCard(city, (name) => {
            removeCity(name);
            renderSaved();
        });
        grid.appendChild(card);
    });
}

renderSaved();
