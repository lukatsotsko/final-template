export const API_KEY = 'af779ace59db6aba44e2382d6f5dd809'; // In a real app, this would be in an environment variable
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

/**
 * Fetch weather data for a specific city
 * @param {string} city - The name of the city
 * @returns {Promise<Object>} - The weather data
 */
export async function fetchWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Fetch 5-day forecast data for a specific city
 * @param {string} city - The name of the city
 * @returns {Promise<Object>} - The forecast data
 */
export async function fetchForecast(city) {
    try {
        const response = await fetch(`${BASE_URL}forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch forecast data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Get weather icon URL
 * @param {string} iconCode - The icon code from OpenWeather API
 * @returns {string} - The full URL for the icon
 */
export function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
