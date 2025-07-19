import instance from "./axios";

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Remove trailing slash if present
const cleanApiUrl = API_BASE_URL.endsWith("/")
	? API_BASE_URL.slice(0, -1)
	: API_BASE_URL;

/**
 * Register a new user
 * @param {Object} userData - Contains name, email, password, and confirmPassword
 * @returns {Promise<Object>} Result of the registration attempt
 */
export const registerUser = async (userData) => {
	try {
		console.log("Sending registration data:", userData);
		const response = await instance.post("/api/auth/register", userData);

		// Return success with verification flag
		return {
			success: true,
			requiresEmailVerification: true, // Added flag to indicate verification is needed
			data: response.data,
		};
	} catch (error) {
		console.error("Registration error:", error);
		console.log("Error response data:", error.response?.data);
		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Registration failed. Please try again.",
		};
	}
};

/**
 * Login user with email and password
 * @param {Object} credentials - Contains email and password
 * @returns {Promise<Object>}
 */
export const loginUser = async (credentials) => {
	try {
		const response = await instance.post("/api/auth/login", credentials);

		// Store token if available
		if (response.data.token) {
			localStorage.setItem("authToken", response.data.token);

			// Dispatch custom event
			window.dispatchEvent(new Event("auth-changed"));
		}

		// Store user data if available
		if (response.data.user) {
			const userData = {
				name: response.data.user.name || response.data.user.email.split("@")[0],
				email: response.data.user.email,
				// Add other user fields as needed
			};
			sessionStorage.setItem("userData", JSON.stringify(userData));
		}

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Login error:", error);
		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Login failed. Please check your credentials.",
		};
	}
};

//Initiate Google OAuth login
export const initiateGoogleLogin = () => {
	// Save current location for redirect after login
	const currentPath = window.location.pathname;
	const urlParams = new URLSearchParams(window.location.search);
	const redirectTo = urlParams.get("redirectTo");

	if (redirectTo) {
		localStorage.setItem("redirectAfterAuth", decodeURIComponent(redirectTo));
	} else if (currentPath !== "/login" && currentPath !== "/register") {
		localStorage.setItem("redirectAfterAuth", currentPath);
	} else {
		localStorage.setItem("redirectAfterAuth", "/dashboard/beranda");
	}

	// Redirect to Google OAuth endpoint
	window.location.href = `${cleanApiUrl}/api/auth/google`;
};

/**
 * Check if the user is logged in by calling the backend status endpoint
 * @returns {Promise<boolean>} Whether the user is logged in
 */
export const isAuthenticated = async () => {
	try {
		const res = await instance.get("/api/auth/status", {
			withCredentials: true,
		});
		// Adjust this depending on your backend's response
		return (
			res.data?.authenticated === true || res.data?.status === "authenticated"
		);
	} catch {
		return false;
	}
};

/**
 * Get current user's data
 * @returns {Promise<Object>} User data or error
 */
export const getCurrentUser = async () => {
	try {
		const response = await instance.get("/api/user");
		// console.log("User data fetched:", response.data);
		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Error fetching user data:", error);

		// If unauthorized, clear token
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("authToken");
		}

		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to fetch user data",
		};
	}
};

/**
 * Log out the current user
 * @returns {Promise<Object>} Result of logout attempt
 */
export const logoutUser = async () => {
	try {
		await instance.get("/api/auth/logout", { withCredentials: true });
	} catch (error) {
		console.error("Error during logout : ", error);
	}
	// Remove tokens and user data
	localStorage.removeItem("authToken");
	localStorage.removeItem("user");
	sessionStorage.removeItem("userData");
	// Notify listeners
	window.dispatchEvent(new Event("auth-changed"));
};

/**
 * Get user data from session storage
 * @returns {Object|null} User data or null if not found
 */
export const getUserData = async () => {
	const userData = await instance
		.get("/api/user/data", { withCredentials: true })
		.then((response) => response.data)
		.catch((error) => {
			console.error("Error fetching user data:", error);
			return null;
		});
	return userData ? JSON.parse(userData) : null;
};

/**
 * Update user's account information
 * @param {Object} userInfo - Updated user information
 * @returns {Promise<Object>} Result of the update attempt
 */
export const updateUserInfo = async (userInfo) => {
	try {
		const response = await instance.put("/api/auth/user", userInfo);

		// Update stored user data if available
		if (response.data.user) {
			const userData = {
				...getUserData(),
				...response.data.user,
			};
			sessionStorage.setItem("userData", JSON.stringify(userData));
		}

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Update user error:", error);
		return {
			success: false,
			error:
				error.response?.data?.message || "Failed to update user information",
		};
	}
};

/**
 * Request a password reset
 * @param {Object} data - Contains email
 * @returns {Promise<Object>} Result of the password reset request
 */
export const requestPasswordReset = async (data) => {
	try {
		const response = await instance.post("/api/auth/forgot-password", data);
		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Password reset request error:", error);
		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to send password reset email. Please try again.",
		};
	}
};

/**
 * Reset password using token
 * @param {Object} resetData - Contains token, password and confirmPassword
 * @returns {Promise<Object>} Result of the password reset attempt
 */
export const resetPassword = async (resetData) => {
	try {
		const response = await instance.post("/api/auth/reset-password", resetData);
		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Password reset error:", error);
		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Gagal mengubah password. Token mungkin sudah kadaluarsa.",
		};
	}
};

/**
 * Verify user email with token
 * @param {string} token - Verification token from email
 * @returns {Promise<Object>} Result of the email verification attempt
 */
export const verifyEmail = async (token) => {
	try {
		const response = await instance.get(`/api/auth/verify?token=${token}`);
		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Email verification error:", error);
		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Gagal memverifikasi email. Token mungkin sudah kadaluarsa.",
		};
	}
};

/**
 * Get the competitions that the current user has joined
 * @returns {Promise<Object>} The user's competitions data
 */
export const getUserCompetitions = async () => {
	try {
		const response = await instance.get("/api/user/competition-data");
		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Error fetching user competition data:", error);
		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to fetch competition data.",
		};
	}
};

/**
 * Announcement API
 */

// Get all announcements
export const getAnnouncements = async () => {
	try {
		const response = await instance.get("/api/announcements");
		return { success: true, data: response.data };
	} catch (error) {
		return {
			success: false,
			error: error.response?.data?.message || "Failed to fetch announcements",
		};
	}
};

export const resendVerificationEmail = async (email) => {
	try {
		const response = await instance.post("api/auth/resend-verification-email", {
			email,
		});

		return {
			success: true,
			message: response.data.message || "Email verifikasi telah dikirim ulang.",
		};
	} catch (error) {
		return {
			success: false,
			error:
				error.response?.data?.error ||
				"Terjadi kesalahan saat mengirim email verifikasi.",
		};
	}
};

// join team
export const joinTeam = async (teamCode) => {
	try {
		const res = await instance.post("api/competition/join", {
			team_code: teamCode,
		});
		return res;
	} catch (error) {
		console.error("Error fetching data:", error);
		throw error;
	}
};

export const registerEvent = async ({
	eventId,
	institutionName,
	phoneNumber,
}) => {
	try {
		const res = await instance.post("api/event/join", {
			event_id: eventId,
			institution_name: institutionName,
			phone_number: phoneNumber,
		});
		return res;
	} catch (error) {
		console.error("Error registering to Event:", error);
		throw error;
	}
};

/**
 * Special function to register for bootcamp. Bundling enums -> day1 | day2 | day1_day2
 */
export const registerToBootcamp = async ({
	eventId,
	institutionName,
	phoneNumber,
	bundling,
}) => {
	try {
		const res = await instance.post("api/event/bootcamp/join", {
			event_id: eventId,
			institution_name: institutionName,
			phone_number: phoneNumber,
			bundling: bundling,
		});
		return res;
	} catch (error) {
		console.error("Error registering to Bootcamp:", error);
		throw error;
	}
};

export const uploadBootcampPayment = async (file) => {
	try {
		const formData = new FormData();
		formData.append("image", file);

		const response = await instance.post(
			"api/event/bootcamp/payment",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Error uploading payment proof:", error);
		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to upload payment proof.",
		};
	}
};

/**
 * Get image URL from R2 storage
 * @param {string} key - The key/name for the image in R2
 * @returns {string} The image URL
 */
export const getImageUrlFromR2 = (key) => {
	if (!key) return "";
	return `${cleanApiUrl}/api/images/${key}`;
};

/**
 * Post an image to R2 storage
 */
export const postImageToR2 = async (file) => {
	try {
		const formData = new FormData();
		formData.append("image", file);

		const response = await instance.post(
			`${cleanApiUrl}/api/images/`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		// console.error("Error uploading image:", error);
		return {
			success: false,
			error: error.response?.data?.message || "Failed to upload image",
		};
	}
};

// Add this function to handle Google auth callback
export const handleGoogleAuthCallback = async () => {
	try {
		const response = await instance.get("/api/auth/google/callback", {
			withCredentials: true,
		});

		if (response.data.success) {
			// Dispatch auth change event
			window.dispatchEvent(new Event("auth-changed"));
			return {
				success: true,
				data: response.data,
			};
		} else {
			return {
				success: false,
				error: response.data.error || "Google authentication failed",
			};
		}
	} catch (error) {
		console.error("Google auth callback error:", error);

		// Check if it's an account conflict error
		if (error.response?.data?.error === "ACCOUNT_EXISTS_WITH_EMAIL") {
			return {
				success: false,
				error: "ACCOUNT_EXISTS_WITH_EMAIL",
				message:
					"Akun kamu sudah teregistrasi dengan email dan password. Silakan login menggunakan email dan password.",
			};
		}

		return {
			success: false,
			error: error.response?.data?.error || "Google authentication failed",
		};
	}
};

export const checkIpbOrMinetoday = async () => {
	try {
		const response = await instance.get("/api/event/check-ipb-or-minetoday");
		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		console.error("Error checking IPB or MineToday:", error);
		return {
			success: false,
			error:
				error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to check IPB or MineToday status.",
		};
	}
};
