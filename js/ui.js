import { getWeatherIconUrl } from './api.js';

export function getConditionType(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return 'thunder';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'mist';
    if (weatherId === 800) return 'clear';
    return 'clouds';
}

function degToCompass(deg) {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
}

function formatLocalTime(unixTs, tzOffset) {
    const d = new Date((unixTs + tzOffset) * 1000);
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

export function createWeatherCard(data, isSaved, onSave) {
    const card = document.createElement('article');
    card.className = 'weather-card';
    card.dataset.condition = getConditionType(data.weather[0].id);

    const mainInfo = document.createElement('div');
    mainInfo.className = 'weather-card__main';

    const city = document.createElement('h2');
    city.className = 'weather-card__city';
    city.textContent = `${data.name}, ${data.sys.country}`;

    const temp = document.createElement('div');
    temp.className = 'weather-card__temp';
    temp.textContent = `${Math.round(data.main.temp)}°C`;

    const tempRange = document.createElement('div');
    tempRange.className = 'weather-card__temp-range';
    tempRange.innerHTML = `<span>↓ ${Math.round(data.main.temp_min)}°</span><span>↑ ${Math.round(data.main.temp_max)}°</span>`;

    const icon = document.createElement('img');
    icon.className = 'weather-card__icon';
    icon.src = getWeatherIconUrl(data.weather[0].icon);
    icon.alt = data.weather[0].description;

    const condition = document.createElement('p');
    condition.className = 'weather-card__condition';
    condition.textContent = data.weather[0].description;

    mainInfo.appendChild(city);
    mainInfo.appendChild(icon);
    mainInfo.appendChild(temp);
    mainInfo.appendChild(tempRange);
    mainInfo.appendChild(condition);

    const details = document.createElement('div');
    details.className = 'weather-card__details';

    const detailsData = [
        { label: 'Feels Like', icon: '🌡', value: `${Math.round(data.main.feels_like)}°C` },
        { label: 'Humidity',   icon: '💧', value: `${data.main.humidity}%` },
        { label: 'Wind',       icon: '💨', value: `${data.wind.speed} m/s ${data.wind.deg != null ? degToCompass(data.wind.deg) : ''}` },
        { label: 'Pressure',   icon: '📊', value: `${data.main.pressure} hPa` },
        { label: 'Visibility', icon: '👁', value: data.visibility != null ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A' },
        { label: 'Clouds',     icon: '☁', value: `${data.clouds?.all ?? 0}%` },
        { label: 'Sunrise',    icon: '🌅', value: formatLocalTime(data.sys.sunrise, data.timezone) },
        { label: 'Sunset',     icon: '🌇', value: formatLocalTime(data.sys.sunset, data.timezone) },
    ];

    detailsData.forEach(item => {
        const detail = document.createElement('div');
        detail.className = 'weather-detail';

        const label = document.createElement('span');
        label.className = 'weather-detail__label';
        label.textContent = `${item.icon} ${item.label}`;

        const value = document.createElement('span');
        value.className = 'weather-detail__value';
        value.textContent = item.value;

        detail.appendChild(label);
        detail.appendChild(value);
        details.appendChild(detail);
    });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'weather-card__save-btn' + (isSaved ? ' weather-card__save-btn--saved' : '');
    saveBtn.innerHTML = isSaved ? '★ Saved' : '☆ Save';
    saveBtn.title = isSaved ? 'Remove from favorites' : 'Add to favorites';
    saveBtn.addEventListener('click', () => onSave(data.name));
    mainInfo.appendChild(saveBtn);

    card.appendChild(mainInfo);
    card.appendChild(details);

    return card;
}

/**
 * Create a forecast card element
 * @param {Object} dayData - Processed daily forecast data
 * @returns {HTMLElement}
 */
export function createForecastCard(dayData) {
    const card = document.createElement('div');
    card.className = 'forecast-card';

    const date = document.createElement('div');
    date.className = 'forecast-card__date';
    date.textContent = dayData.date;

    const icon = document.createElement('img');
    icon.className = 'forecast-card__icon';
    icon.src = getWeatherIconUrl(dayData.icon);
    icon.alt = dayData.condition;
    icon.title = dayData.condition;

    const temps = document.createElement('div');
    temps.className = 'forecast-card__temps';
    
    const maxTemp = document.createElement('span');
    maxTemp.className = 'forecast-card__temp-max';
    maxTemp.textContent = `${Math.round(dayData.maxTemp)}°`;
    
    const minTemp = document.createElement('span');
    minTemp.className = 'forecast-card__temp-min';
    minTemp.textContent = `${Math.round(dayData.minTemp)}°`;

    temps.appendChild(maxTemp);
    temps.appendChild(minTemp);

    card.appendChild(date);
    card.appendChild(icon);
    card.appendChild(temps);

    return card;
}

/**
 * Create a recent search button
 * @param {string} city 
 * @param {Function} onClick 
 * @returns {HTMLElement}
 */
export function createRecentSearchItem(city, onClick) {
    const btn = document.createElement('button');
    btn.className = 'recent-search-btn';
    btn.textContent = city;
    btn.addEventListener('click', () => onClick(city));
    return btn;
}

/**
 * Create a saved city card for saved.html
 * @param {string} city 
 * @param {Function} onRemove 
 * @returns {HTMLElement}
 */
export function createSavedCityCard(city, onRemove, onView) {
    const card = document.createElement('div');
    card.className = 'saved-card';

    const cityName = document.createElement('span');
    cityName.className = 'saved-card__name';
    cityName.textContent = city;

    const actions = document.createElement('div');
    actions.className = 'saved-card__actions';

    if (onView) {
        const viewBtn = document.createElement('button');
        viewBtn.className = 'saved-card__view-btn';
        viewBtn.textContent = 'View →';
        viewBtn.addEventListener('click', () => onView(city));
        actions.appendChild(viewBtn);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'saved-card__remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => onRemove(city));
    actions.appendChild(removeBtn);

    card.appendChild(cityName);
    card.appendChild(actions);

    return card;
}

/**
 * Show loading state
 * @param {HTMLElement} container 
 */
export function showLoading(container) {
    container.innerHTML = '<div class="loading">Fetching weather data...</div>';
}

/**
 * Show error message
 * @param {HTMLElement} container 
 * @param {string} message 
 */
export function showError(container, message) {
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

/**
 * Show success message
 * @param {HTMLElement} container 
 * @param {string} message 
 */
export function showSuccess(container, message) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'success-message';
    msgDiv.textContent = message;
    container.prepend(msgDiv);
    setTimeout(() => msgDiv.remove(), 3000);
}
