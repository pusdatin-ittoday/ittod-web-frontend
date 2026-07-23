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

/**
 * Fetch all competition timelines
 * @returns {Promise<Object>} The competition timelines data
 */
export const getCompetitionTimelines = async () => {
    try {
        const response = await instance.get("/api/competition-timeline");
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error fetching competition timelines:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch competition timelines.",
        };
    }
};

/**
 * Fetch all event timelines
 * @returns {Promise<Object>} The event timelines data
 */
export const getEventTimelines = async () => {
    try {
        const response = await instance.get("/api/timeline");
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error fetching event timelines:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to fetch event timelines.",
        };
    }
};
