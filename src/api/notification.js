import instance from "./axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const cleanApiUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

/**
 * Get all notifications for current user
 */
export const getNotifications = async (options = {}) => {
    try {
        const params = new URLSearchParams();
        if (options.unreadOnly) params.append("unread_only", "true");
        if (options.limit) params.append("limit", options.limit);

        const response = await instance.get(`/api/notifications?${params.toString()}`);
        return {
            success: true,
            data: response.data.data || [],
        };
    } catch (error) {
        console.error("Get notifications error:", error);
        return {
            success: false,
            data: [],
        };
    }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async () => {
    try {
        const response = await instance.get("/api/notifications/unread-count");
        return {
            success: true,
            unread_count: response.data.unread_count || 0,
        };
    } catch (error) {
        console.error("Get unread count error:", error);
        return {
            success: false,
            unread_count: 0,
        };
    }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
    try {
        await instance.patch(`/api/notifications/${notificationId}/read`);
        return { success: true };
    } catch (error) {
        console.error("Mark as read error:", error);
        return { success: false };
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
    try {
        await instance.patch("/api/notifications/read-all");
        return { success: true };
    } catch (error) {
        console.error("Mark all as read error:", error);
        return { success: false };
    }
};
