import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import "./mentor.css";

function MentorDashboardContent() {
  const { id } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  
  useEffect(() => {
    async function getNotifications() {
      try {
        const resp = await axios.get(`https://sangolacollage.onrender.com/api/get-notifications/${id}`
        );
        
        const sorted = resp.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      } catch (err) {
        console.error("Error fetching stored notifications", err);
      }
    }
    getNotifications();
  }, [id]);

  
  useEffect(() => {
    const handleNotification = (data) => {
      if (data.receiverid === id) {
        // Prepend live notification to existing notifications
        setNotifications((prev) => [data, ...prev]);
      }
    };
    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [id]);

  return (
    <div className="notifications-panel">
      <h2 className="panel-title">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif._id} className={`notification-card ${!notif.read ? "unread" : ""}`}>
              <div className="notification-header">
                <span className="notification-type">{notif.type}</span>
                <span className="notification-time">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="notification-message">{notif.message}</div>
              <div className="notification-details">
                <p><strong>Student Id:</strong> {notif.data.id}</p>
                <p><strong>Name:</strong> {notif.data.name}</p>
                <p><strong>Email Id:</strong> {notif.data.email}</p>

                <div className="verify-parent-number">
                  <span className="badge rounded-pill bg-warning text-dark">
                    Please Verify This Parent Whatsapp No
                  </span>
                  <p>
                    <strong>Parent Whatsapp No:</strong>
                    <a href={`tel:${notif.data.parentno}`} className="verify-btn"> Call / Verify</a>
                  </p>
                </div>
                <p><strong>Student Mobile No:</strong> {notif.data.mobileno}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { MentorDashboardContent };