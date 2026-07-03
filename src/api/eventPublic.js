import instance from "./axios";

/**
 * Fetch all events (competitions or non-competitions) from the public endpoint
 * @param {string} type - Optional. 'competition' or 'non_competition'
 * @returns {Promise<Object>} The events data
 */
export const getPublicEvents = async (type = "") => {
    try {
        const url = type ? `/api/events?type=${type}` : "/api/events";
        const response = await instance.get(url);
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        console.error("Error fetching public events:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch events.",
        };
    }
};

/**
 * Fetch a specific event by its ID
 * @param {string} id - Event UUID
 * @returns {Promise<Object>} The event data
 */
export const getPublicEventById = async (id) => {
    try {
        const response = await instance.get(`/api/events/${id}`);
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        console.error("Error fetching public event details:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch event details.",
        };
    }
};
