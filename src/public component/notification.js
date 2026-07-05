import "./notification.css";
import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../notificationAuthContext";

function Notification() {
    const { id,token,role} = useContext(AuthContext);
    const navigate=useNavigate();
    const {notifications,setNotifications}=useContext(NotificationContext);
    const [filter,setfilter]=useState("all");
    const [loding,setloding]=useState({});


    useEffect(() => {
        if (id) {
            socket.emit("join_room", {
                userid: id,
                role: role
            });
        }
    }, [id]);


  
  
 


 const handleNotificationClick = async (notification) => {
    try {
        if (!notification.isRead) {
            await axios.put(
                `https://sangolacollage.onrender.com/api/common/notification-isread/${notification._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            
            setNotifications(prev =>
                prev.map(item =>
                    item._id === notification._id
                        ? { ...item, isRead: true, readAt: new Date() }
                        : item
                )
            );
        }
    }
    catch (err) {
        console.log(err.response?.data);
        console.log(err.response?.status);
    }


    navigate(notification.actionUrl);
};

    const filteredNotification = notifications.filter((notification)=>{
        switch(filter)
        {
            case "unread":
                return !notification.isRead;
            case "registration":
                return ["student_added","teacher_added","mentor_added"].includes(notification.type);
            case "leave":
                return notification.type==="leave_request";
            default :
                return true;
        }

    })
    return (
        <div className="notification-container">
            <div className="notification-filter">
                <button className={filter === "all" ? "active-filter-btn" : ""} onClick={() => setfilter("all")} > All </button>
                <button className={filter === "unread" ? "active-filter-btn" : ""} onClick={() => setfilter("unread")}> Unread </button>
                <button className={filter === "registration" ? "active-filter-btn" : ""} onClick={()=>  setfilter("registration")}> Registrations </button>
                <button className={filter === "leave" ? "active-filter-btn" : ""} onClick={()=>  setfilter("leave")}> Leave </button>
            </div>

            <div className="notification-list">

                 {
                  filteredNotification.length === 0 ? (
            <div className="empty-notification">

                <div className="empty-icon">
                    <i className="bi bi-bell-slash-fill"></i>
                </div>

                <h3>No Notifications Yet</h3>

                <p>
                    You're all caught up! New notifications will appear here.
                </p>

            </div>
        ) : (
                    filteredNotification.map((item) => (
                        <div key={item._id} className={`notificationss-card ${!item.isRead ? "unread" : ""}`} onClick={()=>handleNotificationClick(item)}> 
                           <div className="notification-avatar">
                                <img src={ item.metadata?.profileurl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"} alt={item.metadata?.name} className="notification-profile-pic"/>
                            </div>
                            <div className="notification-details">
                                <div className="notification-top">
                                    <h4>{item.metadata?.name || item.title}</h4>
                                    <span>{new Date(item.createdAt).toLocaleDateString("en-IN",{
                                                    day:"numeric",
                                                    month:"short",
                                                    hour:"2-digit",
                                                    minute:"2-digit"
                                                })}</span>
                                </div>
                                <div className="notification-bottom">
                                    <p>{item.message}</p>
                                    {!item.isRead &&<div className="unread-dot"></div>}
                                </div>
                            </div>

                        </div>
                    ))
                )}

            </div>  

        </div>
    );
}

export default Notification;