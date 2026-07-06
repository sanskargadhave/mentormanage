import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./Authintication";
import socket from "./socket";
import axios from "axios";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {

    const { id, role,token} = useContext(AuthContext);

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
        if (notifications.length > 0) {
        localStorage.setItem(
            "lastNotificationTime",
            notifications[0].createdAt
        );
    }
    }, [notifications]);

    useEffect(() => {

    const fetchLatestNotifications = async () => {

        try {

            const lastNotificationTime =
                localStorage.getItem("lastNotificationTime");

            if (!lastNotificationTime || !id || !token) return;

            const response = await fetch(
                `https://sangolacollage.onrender.com/api/common/get-latestnotification/${id}?after=${lastNotificationTime}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const fetchedNotifications = await response.json();

            setNotifications(prev => {
                const existingIds = new Set( prev.map(item => item._id) );
                const uniqueNotifications = fetchedNotifications.filter( item => !existingIds.has(item._id) );
                return [...uniqueNotifications, ...prev];
            });
        }
        catch (err) {
            console.log(err);
        }
    };

    socket.on("connect", fetchLatestNotifications);

    return () => {
        socket.off("connect", fetchLatestNotifications);
    };

}, [id, token]);

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