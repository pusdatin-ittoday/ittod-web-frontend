import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getNotifications, getUnreadCount, markAsRead } from "../api/notification";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const [notifResult, countResult] = await Promise.all([
                getNotifications({ limit: 20 }),
                getUnreadCount(),
            ]);
            if (notifResult.success) {
                setNotifications(notifResult.data);
            }
            if (countResult.success) {
                setUnreadCount(countResult.unread_count);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Mark single notification as read
    const handleMarkAsRead = useCallback(async (notificationId) => {
        await markAsRead(notificationId);
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, is_read: 1 } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchNotifications();

        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead: handleMarkAsRead,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
}
