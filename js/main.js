import { fetchWeather, fetchForecast, fetchWeatherByCoords, fetchForecastByCoords } from './api.js';
import * as storage from './storage.js';
import * as ui from './ui.js';
import { applyLang, initLangToggle, tf } from './i18n.js';

if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';
}

applyLang();
initLangToggle();

let mapMarker = null;

const state = {
    currentWeather: null,
    forecast: [],
    savedCities: storage.getSavedCities(),
    recentSearches: storage.getRecentSearches()
};

const navUser        = document.getElementById('nav-user');
const logoutBtn      = document.getElementById('logout-btn');
const searchForm     = document.getElementById('search-form');
const cityInput      = document.getElementById('city-input');
const unitSelect     = document.getElementById('unit-select');
const dashboardGrid  = document.getElementById('dashboard-grid');
const forecastSection  = document.getElementById('forecast-section');
const forecastContainer = document.getElementById('forecast-container');
const recentSearchesList = document.getElementById('recent-searches-list');
const locationBtn    = document.getElementById('use-location-btn');

if (navUser) navUser.textContent = localStorage.getItem('user') || '';
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        window.location.href = 'login.html';
    });
}

function getUnits() {
    return unitSelect?.value || 'metric';
}

function debounce(func, delay) {
    let id;
    return (...args) => { clearTimeout(id); id = setTimeout(() => func(...args), delay); };
}

async function handleSearch(city) {
    if (!city?.trim()) return;
    ui.showLoading(dashboardGrid);
    if (forecastSection) forecastSection.style.display = 'none';
    try {
        const units = getUnits();
        const [weatherData, forecastData] = await Promise.all([
            fetchWeather(city, units),
            fetchForecast(city, units)
        ]);
        state.currentWeather = weatherData;
        state.forecast = processForecastData(forecastData);
        storage.addRecentSearch(weatherData.name);
        state.recentSearches = storage.getRecentSearches();
        renderDashboard();
        renderRecentSearches();
    } catch (error) {
        ui.showError(dashboardGrid, error.message);
    }
}

export function processForecastData(data) {
    const dailyData = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
        if (!dailyData[date]) {
            dailyData[date] = {
                date, minTemp: item.main.temp_min, maxTemp: item.main.temp_max,
                icons: [item.weather[0].icon], conditions: [item.weather[0].description]
            };
        } else {
            dailyData[date].minTemp = Math.min(dailyData[date].minTemp, item.main.temp_min);
            dailyData[date].maxTemp = Math.max(dailyData[date].maxTemp, item.main.temp_max);
            dailyData[date].icons.push(item.weather[0].icon);
            dailyData[date].conditions.push(item.weather[0].description);
        }
    });
    return Object.values(dailyData).slice(0, 5).map(day => {
        const iconCounts = day.icons.reduce((a, ic) => { a[ic] = (a[ic] || 0) + 1; return a; }, {});
        const icon = Object.keys(iconCounts).reduce((a, b) => iconCounts[a] > iconCounts[b] ? a : b);
        const condCounts = day.conditions.reduce((a, c) => { a[c] = (a[c] || 0) + 1; return a; }, {});
        const condition = Object.keys(condCounts).reduce((a, b) => condCounts[a] > condCounts[b] ? a : b);
        return { date: day.date, minTemp: day.minTemp, maxTemp: day.maxTemp, icon, condition };
    });
}

function handleToggleSave(cityName) {
    const saved = storage.getSavedCities();
    if (saved.includes(cityName)) {
        storage.removeCity(cityName);
        ui.showSuccess(document.querySelector('main'), tf('msg.removed', cityName));
    } else {
        storage.saveCity(cityName);
        ui.showSuccess(document.querySelector('main'), tf('msg.saved', cityName));
    }
    state.savedCities = storage.getSavedCities();
    renderDashboard();
}

function renderDashboard() {
    if (!dashboardGrid) return;
    dashboardGrid.innerHTML = '';
    if (state.currentWeather) {
        const isSaved = state.savedCities.includes(state.currentWeather.name);
        dashboardGrid.appendChild(ui.createWeatherCard(state.currentWeather, isSaved, handleToggleSave));
    }
    if (forecastContainer && state.forecast.length > 0) {
        forecastContainer.innerHTML = '';
        state.forecast.forEach(day => forecastContainer.appendChild(ui.createForecastCard(day)));
        if (forecastSection) forecastSection.style.display = 'block';
    } else if (forecastSection) {
        forecastSection.style.display = 'none';
    }
}

function renderRecentSearches() {
    if (!recentSearchesList) return;
    recentSearchesList.innerHTML = '';
    state.recentSearches.forEach(city => {
        recentSearchesList.appendChild(ui.createRecentSearchItem(city, handleSearch));
    });
}

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') return;

    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
    }).addTo(map);

    map.on('click', (e) => handleMapClick(e.latlng.lat, e.latlng.lng, map));
}

async function handleMapClick(lat, lon, map) {
    const badge = document.getElementById('map-location-badge');
    ui.showLoading(dashboardGrid);
    if (forecastSection) forecastSection.style.display = 'none';
    try {
        const units = getUnits();
        const [weatherData, forecastData] = await Promise.all([
            fetchWeatherByCoords(lat, lon, units),
            fetchForecastByCoords(lat, lon, units)
        ]);
        state.currentWeather = weatherData;
        state.forecast = processForecastData(forecastData);
        storage.addRecentSearch(weatherData.name);
        state.recentSearches = storage.getRecentSearches();

        if (mapMarker) mapMarker.remove();
        mapMarker = L.circleMarker([lat, lon], {
            radius: 9, fillColor: '#3b82f6', color: '#ffffff',
            weight: 2.5, opacity: 1, fillOpacity: 0.9
        }).addTo(map)
          .bindPopup(`<strong>${weatherData.name}, ${weatherData.sys.country}</strong>`)
          .openPopup();

        if (badge) {
            badge.textContent = `📍 ${weatherData.name}, ${weatherData.sys.country}`;
            badge.hidden = false;
        }
        renderDashboard();
        renderRecentSearches();
        document.querySelector('.weather-results')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        ui.showError(dashboardGrid, error.message);
        if (badge) badge.hidden = true;
    }
}

async function getWeatherByLocation(lat, lon) {
    try {
        ui.showLoading(dashboardGrid);
        const units = getUnits();
        const [weatherData, forecastData] = await Promise.all([
            fetchWeatherByCoords(lat, lon, units),
            fetchForecastByCoords(lat, lon, units)
        ]);
        state.currentWeather = weatherData;
        state.forecast = processForecastData(forecastData);
        storage.addRecentSearch(weatherData.name);
        state.recentSearches = storage.getRecentSearches();
        ui.showSuccess(document.querySelector('main'), tf('msg.location'));
        renderDashboard();
        renderRecentSearches();
    } catch (error) {
        ui.showError(dashboardGrid, error.message);
    }
}

// Re-render when language changes (updates card labels)
document.addEventListener('langchange', () => {
    if (state.currentWeather) renderDashboard();
});

// Event listeners
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch(cityInput.value.trim());
    });
    const debouncedLog = debounce((v) => console.log('input:', v), 500);
    cityInput.addEventListener('input', (e) => debouncedLog(e.target.value));
}

if (locationBtn) {
    locationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => getWeatherByLocation(pos.coords.latitude, pos.coords.longitude),
            (err) => console.log('Geolocation denied:', err.message)
        );
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderRecentSearches();
    initMap();

    // Check if redirected from saved page with a city param
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    if (cityParam) {
        cityInput.value = cityParam;
        handleSearch(cityParam);
        history.replaceState({}, '', window.location.pathname);
        return;
    }

    // Auto-load weather for current location on first visit
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => getWeatherByLocation(pos.coords.latitude, pos.coords.longitude),
            (err) => console.log('Geolocation denied:', err.message)
        );
    }
});
