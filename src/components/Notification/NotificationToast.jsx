import { useState, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationToast() {
    const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotifications();
    const [showDropdown, setShowDropdown] = useState(false);
    const [toast, setToast] = useState(null);

    // Show toast for new notifications
    useEffect(() => {
        const newNotifications = notifications.filter(n => !n.is_read);
        if (newNotifications.length > 0 && toast === null) {
            setToast(newNotifications[0]);
            setTimeout(() => setToast(null), 5000);
        }
    }, [notifications]);

    const getTypeStyles = (type) => {
        switch (type) {
            case "error":
                return "bg-red-500 text-white";
            case "success":
                return "bg-green-500 text-white";
            case "warning":
                return "bg-yellow-500 text-white";
            default:
                return "bg-purple-600 text-white";
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "error":
                return "❌";
            case "success":
                return "✅";
            case "warning":
                return "⚠️";
            default:
                return "ℹ️";
        }
    };

    return (
        <>
            {/* Notification Badge & Button */}
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                >
                    <span className="text-xl">🔔</span>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>

                {/* Dropdown */}
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="font-semibold text-white">Notifikasi</h3>
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-400">
                                    Tidak ada notifikasi
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                                            !notif.is_read ? "bg-gray-700/50" : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl">{getTypeIcon(notif.type)}</span>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white text-sm">{notif.title}</h4>
                                                <p className="text-gray-300 text-sm mt-1">{notif.message}</p>
                                                <p className="text-gray-500 text-xs mt-2">
                                                    {new Date(notif.created_at).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                            {!notif.is_read && (
                                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl z-50 animate-slide-up ${getTypeStyles(toast.type)}`}>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">{getTypeIcon(toast.type)}</span>
                        <div className="flex-1">
                            <h4 className="font-semibold">{toast.title}</h4>
                            <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="text-white/70 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
