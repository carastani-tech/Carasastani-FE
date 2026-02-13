/**
 * City Selection Utility
 * Persists the selected city across all pages using localStorage
 */

const CITY_STORAGE_KEY = 'selectedCity';
const DEFAULT_CITY = 'Mumbai';

/**
 * Get the currently selected city
 * @returns {string} The selected city name
 */
export const getSelectedCity = () => {
    try {
        const city = localStorage.getItem(CITY_STORAGE_KEY);
        return city || DEFAULT_CITY;
    } catch (error) {
        console.error('Error reading city from localStorage:', error);
        return DEFAULT_CITY;
    }
};

/**
 * Save the selected city
 * @param {string} city - The city name to save
 */
export const setSelectedCity = (city) => {
    try {
        if (city) {
            localStorage.setItem(CITY_STORAGE_KEY, city);
        }
    } catch (error) {
        console.error('Error saving city to localStorage:', error);
    }
};

/**
 * Clear the selected city (resets to default)
 */
export const clearSelectedCity = () => {
    try {
        localStorage.removeItem(CITY_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing city from localStorage:', error);
    }
};

export default { getSelectedCity, setSelectedCity, clearSelectedCity };
