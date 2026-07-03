import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./Authintication";
import socket from "./socket";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {

    const { id, role } = useContext(AuthContext);

    const [notifications, setNotifications] = useState(() => {
        const stored = localStorage.getItem("notifications");
        return stored ? JSON.parse(stored) : [];
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(
            "notifications",
            JSON.stringify(notifications)
        );
    }, [notifications]);

    // Join socket room
    useEffect(() => {
        if (id) {
            socket.emit("join_room", {
                userid: id,
                role: role
            });
        }
    }, [id, role]);

    // Listen for notifications
    useEffect(() => {

        const handleNotification = (data) => {

            setNotifications(prev => {

                const exists = prev.some(
                    item => item._id === data._id
                );

                if (exists) return prev;

                return [data, ...prev];
            });
        };

        socket.on("notification", handleNotification);

        return () => {
            socket.off("notification", handleNotification);
        };

    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                setNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}