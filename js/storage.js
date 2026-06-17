const STORAGE_KEYS = {
    FAVORITES: 'weather_explorer_favorites',
    RECENT_SEARCHES: 'weather_explorer_recent'
};

/**
 * Get saved favorite cities from localStorage
 * @returns {Array<string>}
 */
export function getSavedCities() {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
}

/**
 * Save a city to favorites
 * @param {string} city 
 */
export function saveCity(city) {
    const saved = getSavedCities();
    if (!saved.includes(city)) {
        saved.push(city);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(saved));
        return true;
    }
    return false;
}

/**
 * Remove a city from favorites
 * @param {string} city 
 */
export function removeCity(city) {
    const saved = getSavedCities();
    const filtered = saved.filter(c => c !== city);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
}

/**
 * Get recent searches from localStorage
 * @returns {Array<string>}
 */
export function getRecentSearches() {
    const recent = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return recent ? JSON.parse(recent) : [];
}

/**
 * Add a city to recent searches (keep last 5)
 * @param {string} city 
 */
export function addRecentSearch(city) {
    let recent = getRecentSearches();
    recent = [city, ...recent.filter(c => c !== city)].slice(0, 5);
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recent));
}
