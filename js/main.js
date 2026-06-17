import { fetchWeather, fetchForecast } from './api.js';
import * as storage from './storage.js';
import * as ui from './ui.js';

// Application State
const state = {
    currentWeather: null,
    forecast: [],
    savedCities: storage.getSavedCities(),
    recentSearches: storage.getRecentSearches()
};

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const dashboardGrid = document.getElementById('dashboard-grid');
const forecastSection = document.getElementById('forecast-section');
const forecastContainer = document.getElementById('forecast-container');
const recentSearchesList = document.getElementById('recent-searches-list');
const savedGrid = document.getElementById('saved-grid');

/**
 * Debounce function to limit API calls
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function}
 */
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

/**
 * Handle weather search
 * @param {string} city 
 */
async function handleSearch(city) {
    if (!city || city.trim() === '') return;

    ui.showLoading(dashboardGrid);
    if (forecastSection) forecastSection.style.display = 'none';

    try {
        const [weatherData, forecastData] = await Promise.all([
            fetchWeather(city),
            fetchForecast(city)
        ]);
        
        state.currentWeather = weatherData;
        state.forecast = processForecastData(forecastData);
        
        // Add to recent searches
        storage.addRecentSearch(weatherData.name);
        state.recentSearches = storage.getRecentSearches();
        
        renderDashboard();
        renderRecentSearches();
    } catch (error) {
        ui.showError(dashboardGrid, error.message);
    }
}

/**
 * Process raw 5-day forecast data into daily summaries
 * @param {Object} data - Raw data from OpenWeather forecast API
 * @returns {Array} - Processed daily forecast items
 */
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
                date: date,
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

    // Convert dailyData object to array and pick most frequent icon
    return Object.values(dailyData).slice(0, 5).map(day => {
        // Simple most frequent icon selection
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

/**
 * Handle saving/unsaving a city
 * @param {string} cityName 
 */
function handleToggleSave(cityName) {
    const saved = storage.getSavedCities();
    if (saved.includes(cityName)) {
        storage.removeCity(cityName);
        ui.showSuccess(document.querySelector('main'), `Removed ${cityName} from favorites`);
    } else {
        storage.saveCity(cityName);
        ui.showSuccess(document.querySelector('main'), `Saved ${cityName} to favorites`);
    }
    state.savedCities = storage.getSavedCities();
    renderDashboard();
    if (savedGrid) renderSavedCities();
}

/**
 * Render the main weather dashboard
 */
function renderDashboard() {
    if (!dashboardGrid) return;
    
    dashboardGrid.innerHTML = '';
    if (state.currentWeather) {
        const isSaved = state.savedCities.includes(state.currentWeather.name);
        const card = ui.createWeatherCard(state.currentWeather, isSaved, handleToggleSave);
        dashboardGrid.appendChild(card);
    }

    if (forecastContainer && state.forecast.length > 0) {
        forecastContainer.innerHTML = '';
        state.forecast.forEach(day => {
            const card = ui.createForecastCard(day);
            forecastContainer.appendChild(card);
        });
        if (forecastSection) forecastSection.style.display = 'block';
    } else if (forecastSection) {
        forecastSection.style.display = 'none';
    }
}

/**
 * Render recent searches list
 */
function renderRecentSearches() {
    if (!recentSearchesList) return;
    
    recentSearchesList.innerHTML = '';
    state.recentSearches.forEach(city => {
        const item = ui.createRecentSearchItem(city, handleSearch);
        recentSearchesList.appendChild(item);
    });
}

/**
 * Render saved cities on saved.html
 */
function renderSavedCities() {
    if (!savedGrid) return;
    
    savedGrid.innerHTML = '';
    if (state.savedCities.length === 0) {
        savedGrid.innerHTML = '<p>No saved cities yet.</p>';
        return;
    }

    state.savedCities.forEach(city => {
        const card = ui.createSavedCityCard(city, (name) => {
            storage.removeCity(name);
            state.savedCities = storage.getSavedCities();
            renderSavedCities();
        });
        savedGrid.appendChild(card);
    });
}

// Event Listeners
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value;
        handleSearch(city);
    });

    // Debounced input example (optional requirement for "API calls not made on every keystroke")
    const debouncedSearch = debounce((val) => {
        console.log('Debounced value:', val);
        // We could trigger search here if we wanted auto-complete style
    }, 500);

    cityInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderRecentSearches();
    if (savedGrid) {
        renderSavedCities();
    }
});
