import axios from "axios";
import instance from "./axios";

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Remove trailing slash if present
const cleanApiUrl = API_BASE_URL.endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

/**
 * Register a new user
 * @param {Object} userData - Contains email, password, and confirmPassword
 * @returns {Promise<Object>} Result of the registration attempt
 */
export const registerUser = async (userData) => {
    try {
        const response = await instance.post('/auth/register', userData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            error: error.response?.data?.message ||
                error.response?.data?.error ||
                "Registration failed. Please try again."
        };
    }
};

/**
 * Login user with email and password
 * @param {Object} credentials - Contains email and password
 * @returns {Promise<Object>} Result of the login attempt
 */
export const loginUser = async (credentials) => {
    try {
        const response = await instance.post('/auth/login', credentials);

        // Store token if available
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        // Store user data if available
        if (response.data.user) {
            const userData = {
                name: response.data.user.name || response.data.user.email.split('@')[0],
                email: response.data.user.email,
                // Add other user fields as needed
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error.response?.data?.message ||
                error.response?.data?.error ||
                "Login failed. Please check your credentials."
        };
    }
};

//Initiate Google OAuth login
export const initiateGoogleLogin = () => {
    // Save redirect path for after login
    localStorage.setItem('redirectAfterAuth', '/dashboard/beranda');

    // Redirect to Google OAuth endpoint
    window.location.href = `${cleanApiUrl}/auth/google/redirect`;
};

/**
 * Get current user data using stored token
 * @returns {Promise<Object>} Current user data or error
 */
export const getCurrentUser = async () => {
    try {
        const response = await instance.get('/auth/me');

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Get user error:", error);
        return {
            success: false,
            error: error.response?.data?.message ||
                "Failed to get user data"
        };
    }
};

/**
 * Log out the current user
 * @returns {Promise<Object>} Result of logout attempt
 */
export const logoutUser = async () => {
    try {
        // Call logout endpoint
        await instance.post('/auth/logout');

        // Clear local storage and session storage
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');

        return {
            success: true
        };
    } catch (error) {
        console.error("Logout error:", error);
        // Even if API fails, clear local data
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');

        return {
            success: false,
            error: error.response?.data?.message ||
                "Logout failed"
        };
    }
};

/**
 * Check if the user is authenticated
 * @returns {boolean} Whether the user is authenticated
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token; // Convert to boolean
};

/**
 * Get user data from session storage
 * @returns {Object|null} User data or null if not found
 */
export const getUserData = () => {
    const userData = sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

/**
 * Update user's account information
 * @param {Object} userInfo - Updated user information
 * @returns {Promise<Object>} Result of the update attempt
 */
export const updateUserInfo = async (userInfo) => {
    try {
        const response = await instance.put('/auth/user', userInfo);

        // Update stored user data if available
        if (response.data.user) {
            const userData = {
                ...getUserData(),
                ...response.data.user
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Update user error:", error);
        return {
            success: false,
            error: error.response?.data?.message ||
                "Failed to update user information"
        };
    }
};

/**
 * Request password reset
 * @param {string} email - User's email
 * @returns {Promise<Object>} Result of the password reset request
 */
export const requestPasswordReset = async (email) => {
    try {
        const response = await instance.post('/auth/forgot-password', { email });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Password reset request error:", error);
        return {
            success: false,
            error: error.response?.data?.message ||
                "Failed to request password reset"
        };
    }
};

/**
 * Reset password with token
 * @param {Object} resetData - Contains token, password and confirmPassword
 * @returns {Promise<Object>} Result of the password reset attempt
 */
export const resetPassword = async (resetData) => {
    try {
        const response = await instance.post('/auth/reset-password', resetData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Password reset error:", error);
        return {
            success: false,
            error: error.response?.data?.message ||
                "Failed to reset password"
        };
    }
};