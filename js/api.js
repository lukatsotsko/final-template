export const API_KEY = 'af779ace59db6aba44e2382d6f5dd809';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

function apiLang() {
    return localStorage.getItem('wx_lang') === 'ka' ? 'ka' : 'en';
}

export async function fetchWeather(city, units = 'metric') {
    const response = await fetch(
        `${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}&lang=${apiLang()}`
    );
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch weather data');
    }
    const data = await response.json();
    data._unit = units;
    return data;
}

export async function fetchForecast(city, units = 'metric') {
    const response = await fetch(
        `${BASE_URL}forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}&lang=${apiLang()}`
    );
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch forecast data');
    }
    return response.json();
}

export async function fetchWeatherByCoords(lat, lon, units = 'metric') {
    const response = await fetch(
        `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${apiLang()}`
    );
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch weather data');
    }
    const data = await response.json();
    data._unit = units;
    return data;
}

export async function fetchForecastByCoords(lat, lon, units = 'metric') {
    const response = await fetch(
        `${BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${apiLang()}`
    );
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch forecast data');
    }
    return response.json();
}

export function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
