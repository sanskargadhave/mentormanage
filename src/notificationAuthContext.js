import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./Authintication";
import socket from "./socket";
import { LiveNotification } from "./public component/login";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";



export const NotificationContext = createContext();

export function NotificationProvider({ children }) {

    const { id, role,token} = useContext(AuthContext);
    const [popup,setpopup]=useState(null);
    const navigate=useNavigate();
    const [notifications, setNotifications] = useState(() => {
        const stored = localStorage.getItem("notifications");
        return stored ? JSON.parse(stored) : [];
    });

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

            const response = await axiosInstance.get(`/common/get-latestnotification/${id}?after=${lastNotificationTime}`);

            
            const fetchedNotifications = response.data;

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

   
    useEffect(() => {
        if (id) {
            socket.emit("join_room", {
                userid: id,
                role: role
            });
        }
    }, [id, role]);

    useEffect(() => {

        const handleNotification = (data) => {
            setpopup(data);
            setTimeout(() => {
                setpopup(null);
            }, 20000);
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
            {
    popup && (
        <LiveNotification
            notification={popup}
            onClose={() => setpopup(null)}/>
    )
}
        </NotificationContext.Provider>
    );
}