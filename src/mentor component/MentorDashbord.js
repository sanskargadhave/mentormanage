import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import "./mentor.css"; 

function MentorDashboardContent() {
  const { id } = useContext(AuthContext);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [oldNotifications, setOldNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (data) => {
      if (data.receiverid === id) {
        setLiveNotifications((prev) => [data, ...prev]);
      }
    };
    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [id]);

  
  useEffect(() => {
    async function getNotifications() {
      try {
        const resp = await axios.get(`https://sangolacollage.onrender.com/api/get-notifications/${id}`);
        setOldNotifications(resp.data);
      } 
      catch (err) {
        console.error("Error fetching stored notifications", err);
      }
    }
    getNotifications();
  }, [id]);

 
  const allNotifications = [...liveNotifications, ...oldNotifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="notifications-panel">
      <h2 className="panel-title">Notifications</h2>
      {allNotifications.length === 0 ? (<p className="no-notifications">No notifications yet</p>
      ) : (
        <div className="notifications-list">
          {allNotifications.map((notif) => (
            <div key={notif._id} className={`notification-card ${!notif.read ? "unread" : ""}`}>
              <div className="notification-header">
                <span className="notification-type">{notif.type}</span>
                <span className="notification-time">{new Date(notif.createdAt).toLocaleString()}</span>
              </div>
              <div className="notification-message">
                {notif.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { MentorDashboardContent };