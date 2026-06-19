import { fetchWeather, fetchForecast, fetchWeatherByCoords, fetchForecastByCoords } from './api.js';
import * as storage from './storage.js';
import * as ui from './ui.js';
import { applyLang, initLangToggle, tf, t } from './i18n.js';

if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';
}

applyLang();
initLangToggle();

// Weather theme palettes
const WEATHER_THEMES = {
    clear:   { stops: ['#1a0700','#7c2d12','#c2410c','#ea580c','#f97316'], orb1: 'rgba(251,191,36,.22)', orb2: 'rgba(249,115,22,.17)' },
    clouds:  { stops: ['#0a0b0d','#141820','#1e2535','#2e3748','#3d4a5c'], orb1: 'rgba(148,163,184,.14)', orb2: 'rgba(100,116,139,.11)' },
    rain:    { stops: ['#000d1a','#011f38','#023d62','#034e7b','#05659c'], orb1: 'rgba(56,189,248,.18)',  orb2: 'rgba(2,132,199,.14)'   },
    thunder: { stops: ['#050312','#0f0b25','#1a1740','#2d2b6b','#3d3aa3'], orb1: 'rgba(167,139,250,.2)',  orb2: 'rgba(99,102,241,.16)'  },
    snow:    { stops: ['#020d1a','#072244','#0d3a7a','#1557b0','#1d6fd4'], orb1: 'rgba(147,197,253,.2)',  orb2: 'rgba(186,230,253,.14)' },
    mist:    { stops: ['#0d0c0b','#1a1815','#2d2a26','#403c38','#524e4a'], orb1: 'rgba(161,155,148,.15)', orb2: 'rgba(120,113,108,.12)' },
};

function applyWeatherTheme(condition) {
    const theme = WEATHER_THEMES[condition];
    if (!theme) return;
    const b = document.body;
    b.style.setProperty('--bg-stop-1', theme.stops[0]);
    b.style.setProperty('--bg-stop-2', theme.stops[1]);
    b.style.setProperty('--bg-stop-3', theme.stops[2]);
    b.style.setProperty('--bg-stop-4', theme.stops[3]);
    b.style.setProperty('--bg-stop-5', theme.stops[4]);
    b.style.setProperty('--orb-1', theme.orb1);
    b.style.setProperty('--orb-2', theme.orb2);
}

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
const useLocationBtn = document.getElementById('use-location-btn');

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

async function handleSearch(city) {
    if (!city || city.trim() === '') return;

    ui.showLoading(dashboardGrid);
    if (forecastSection) forecastSection.classList.add('is-hidden');

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
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        if (!dailyData[date]) {
            dailyData[date] = {
                date,
                minTemp: item.main.temp_min,
                maxTemp: item.main.temp_max,
                icons: [item.weather[0].icon],
                conditions: [item.weather[0].description]
            };
        } else {
            dailyData[date].minTemp = Math.min(dailyData[date].minTemp, item.main.temp_min);
            dailyData[date].maxTemp = Math.max(dailyData[date].maxTemp, item.main.temp_max);
            dailyData[date].icons.push(item.weather[0].icon);
            dailyData[date].conditions.push(item.weather[0].description);
        }
    });

    return Object.values(dailyData).slice(0, 5).map(day => {
        const iconCounts = day.icons.reduce((acc, icon) => {
            acc[icon] = (acc[icon] || 0) + 1;
            return acc;
        }, {});
        const mostFrequentIcon = Object.keys(iconCounts).reduce((a, b) => iconCounts[a] > iconCounts[b] ? a : b);

        const conditionCounts = day.conditions.reduce((acc, cond) => {
            acc[cond] = (acc[cond] || 0) + 1;
            return acc;
        }, {});
        const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) => conditionCounts[a] > conditionCounts[b] ? a : b);

        return {
            date: day.date,
            minTemp: day.minTemp,
            maxTemp: day.maxTemp,
            icon: mostFrequentIcon,
            condition: mostFrequentCondition
        };
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
        const condition = ui.getConditionType(state.currentWeather.weather[0].id);
        applyWeatherTheme(condition);
        const isSaved = state.savedCities.includes(state.currentWeather.name);
        const card = ui.createWeatherCard(state.currentWeather, isSaved, handleToggleSave, getUnits());
        dashboardGrid.appendChild(card);
    }

    if (forecastContainer && state.forecast.length > 0) {
        forecastContainer.innerHTML = '';
        state.forecast.forEach(day => {
            forecastContainer.appendChild(ui.createForecastCard(day));
        });
        if (forecastSection) forecastSection.classList.remove('is-hidden');
    } else if (forecastSection) {
        forecastSection.classList.add('is-hidden');
    }
}

function renderRecentSearches() {
    if (!recentSearchesList) return;
    recentSearchesList.innerHTML = '';
    state.recentSearches.forEach(city => {
        recentSearchesList.appendChild(ui.createRecentSearchItem(city, handleSearch));
    });
}

// ===== Map Feature =====

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') return;

    const map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    }).addTo(map);

    map.on('click', (e) => {
        handleMapClick(e.latlng.lat, e.latlng.lng, map);
    });
}

async function handleMapClick(lat, lon, map) {
    const badge = document.getElementById('map-location-badge');

    ui.showLoading(dashboardGrid);
    if (forecastSection) forecastSection.classList.add('is-hidden');

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
            radius: 9,
            fillColor: '#3b82f6',
            color: '#ffffff',
            weight: 2.5,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(map).bindPopup(`<strong>${weatherData.name}, ${weatherData.sys.country}</strong>`).openPopup();

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

// Re-render weather card when language changes so labels update
document.addEventListener('langchange', () => {
    if (state.currentWeather) renderDashboard();
});

// ===== Event Listeners =====

if (useLocationBtn) {
    useLocationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            ui.showError(dashboardGrid, 'Geolocation is not supported by your browser.');
            return;
        }
        useLocationBtn.textContent = t('search.location.locating');
        useLocationBtn.disabled = true;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                useLocationBtn.textContent = t('search.location.btn');
                useLocationBtn.disabled = false;
                getWeatherByLocation(coords.latitude, coords.longitude);
            },
            () => {
                useLocationBtn.textContent = t('search.location.btn');
                useLocationBtn.disabled = false;
                ui.showError(dashboardGrid, 'Could not get your location. Please allow location access.');
            }
        );
    });
}

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch(cityInput.value.trim());
    });
}

if (unitSelect) {
    unitSelect.addEventListener('change', () => {
        if (state.currentWeather) {
            handleSearch(state.currentWeather.name);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderRecentSearches();

    const cityFromUrl = new URLSearchParams(window.location.search).get('city');
    if (cityFromUrl && cityInput) {
        cityInput.value = cityFromUrl;
        handleSearch(cityFromUrl);
        history.replaceState({}, '', window.location.pathname);
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => { getWeatherByLocation(coords.latitude, coords.longitude); },
            (error) => { console.log('Geolocation denied or failed:', error.message); }
        );
    }

    initMap();
});
