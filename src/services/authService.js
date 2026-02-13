/**
 * Authentication Service
 * Handles user login/logout and session management using localStorage
 */

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:9091'}/api/users`;
const USER_STORAGE_KEY = 'loggedInUser';

/**
 * Fetch user details by email
 * @param {string} email 
 * @returns {Promise<object>}
 */
export const fetchUserDetails = async (email) => {
    try {
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(`${API_BASE}/details?email=${encodedEmail}`);

        if (!response.ok) {
            console.error('Failed to fetch user details');
            return {};
        }

        const data = await response.json();
        return data || {};
    } catch (error) {
        console.error('Error fetching user details:', error);
        return {};
    }
};

/**
 * Login user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message: string, user?: object}>}
 */
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Handle server error
        if (response.status >= 500) {
            return { success: false, message: 'Login failed. Server error.' };
        }

        const data = await response.json();

        if (data.success) {
            // Fetch user details after successful login
            const userDetails = await fetchUserDetails(email);

            // Store user data in localStorage
            const userData = { email, ...userDetails };
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

            // Dispatch custom event to notify navbar
            window.dispatchEvent(new Event('authChange'));

            return { ...data, user: userData };
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Login failed. Please try again.' };
    }
};

/**
 * Signup user with name, email, and password
 * After successful signup, fetches user details and logs user in automatically
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message: string, user?: object}>}
 */
export const signupUser = async (name, email, password) => {
    try {
        const response = await fetch(`${API_BASE}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        // Handle server error
        if (response.status >= 500) {
            return { success: false, message: 'Signup failed. Server error.' };
        }

        // Handle conflict (user already exists)
        if (response.status === 409) {
            return {
                success: false,
                message: 'This email is already registered. Please sign in instead.',
                errorType: 'EMAIL_EXISTS'
            };
        }

        // Handle bad request
        if (response.status === 400) {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Invalid signup data.' };
        }

        const data = await response.json();

        // Check if API returns success: false (e.g., email already in use)
        if (data.success === false) {
            // Check for email already exists message
            if (data.message && data.message.toLowerCase().includes('email')) {
                return {
                    success: false,
                    message: 'This email is already registered. Please sign in instead.',
                    errorType: 'EMAIL_EXISTS'
                };
            }
            return { success: false, message: data.message || 'Signup failed. Please try again.' };
        }

        // After successful signup, fetch user details and log them in
        const userDetails = await fetchUserDetails(email);
        const userData = { email, name, ...userDetails };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

        // Dispatch custom event to notify navbar
        window.dispatchEvent(new Event('authChange'));

        return { success: true, message: 'Account created successfully!', user: userData };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, message: 'Signup failed. Please try again.' };
    }
};

/**
 * Logout current user
 */
export const logoutUser = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    // Dispatch custom event to notify navbar
    window.dispatchEvent(new Event('authChange'));
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
    try {
        const user = localStorage.getItem(USER_STORAGE_KEY);
        return !!user;
    } catch {
        return false;
    }
};

/**
 * Get logged in user data
 * @returns {{email: string} | null}
 */
export const getLoggedInUser = () => {
    try {
        const user = localStorage.getItem(USER_STORAGE_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export default { loginUser, logoutUser, isLoggedIn, getLoggedInUser, fetchUserDetails, signupUser };
