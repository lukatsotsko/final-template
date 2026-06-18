import { getWeatherIconUrl } from './api.js';
import { t } from './i18n.js';

export function createWeatherCard(data, isSaved, onSave) {
    const unitSymbol = data._unit === 'imperial' ? '°F' : '°C';
    const windUnit   = data._unit === 'imperial' ? 'mph' : 'm/s';

    const card = document.createElement('article');
    card.className = 'weather-card';

    const mainInfo = document.createElement('div');
    mainInfo.className = 'weather-card__main';

    const city = document.createElement('h2');
    city.className = 'weather-card__city';
    city.textContent = `${data.name}, ${data.sys.country}`;

    const temp = document.createElement('div');
    temp.className = 'weather-card__temp';
    temp.textContent = `${Math.round(data.main.temp)}${unitSymbol}`;

    const icon = document.createElement('img');
    icon.className = 'weather-card__icon';
    icon.src = getWeatherIconUrl(data.weather[0].icon);
    icon.alt = data.weather[0].description;

    const condition = document.createElement('p');
    condition.className = 'weather-card__condition';
    condition.textContent = data.weather[0].description;

    mainInfo.appendChild(city);
    mainInfo.appendChild(temp);
    mainInfo.appendChild(icon);
    mainInfo.appendChild(condition);

    const details = document.createElement('div');
    details.className = 'weather-card__details';

    const detailsData = [
        { key: 'card.feels_like', value: `${Math.round(data.main.feels_like)}${unitSymbol}` },
        { key: 'card.humidity',   value: `${data.main.humidity}%` },
        { key: 'card.wind',       value: `${data.wind.speed} ${windUnit}` },
        { key: 'card.pressure',   value: `${data.main.pressure} hPa` },
    ];

    detailsData.forEach(item => {
        const detail = document.createElement('div');
        detail.className = 'weather-detail';

        const label = document.createElement('span');
        label.className = 'weather-detail__label';
        label.dataset.i18n = item.key;
        label.textContent = t(item.key);

        const value = document.createElement('span');
        value.className = 'weather-detail__value';
        value.textContent = item.value;

        detail.appendChild(label);
        detail.appendChild(value);
        details.appendChild(detail);
    });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'weather-card__save-btn';
    saveBtn.innerHTML = isSaved ? '★' : '☆';
    saveBtn.dataset.i18nTitle = isSaved ? 'card.saved.title' : 'card.save.title';
    saveBtn.title = t(saveBtn.dataset.i18nTitle);
    saveBtn.addEventListener('click', () => {
        onSave(data.name);
    });

    card.appendChild(mainInfo);
    card.appendChild(details);
    card.appendChild(saveBtn);

    return card;
}

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

export function createRecentSearchItem(city, onClick) {
    const btn = document.createElement('button');
    btn.className = 'recent-search-btn';
    btn.textContent = city;
    btn.addEventListener('click', () => onClick(city));
    return btn;
}

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
        viewBtn.dataset.i18n = 'saved.view';
        viewBtn.textContent = t('saved.view');
        viewBtn.addEventListener('click', () => onView(city));
        actions.appendChild(viewBtn);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'saved-card__remove-btn';
    removeBtn.dataset.i18n = 'saved.remove';
    removeBtn.textContent = t('saved.remove');
    removeBtn.addEventListener('click', () => onRemove(city));
    actions.appendChild(removeBtn);

    card.appendChild(cityName);
    card.appendChild(actions);

    return card;
}

export function showLoading(container) {
    container.innerHTML = `<div class="loading">${t('weather.loading')}</div>`;
}

export function showError(container, message) {
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

export function showSuccess(container, message) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'success-message';
    msgDiv.textContent = message;
    container.prepend(msgDiv);
    setTimeout(() => msgDiv.remove(), 3000);
}
