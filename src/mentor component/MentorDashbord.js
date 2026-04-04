import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import "./mentor.css";

function MentorDashboardContent() {
  const { id } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loding,setloding]=useState(false);
  
  useEffect(() => {
    async function getNotifications() {
      try {
        setloding(true);
        const resp = await axios.get(`https://sangolacollage.onrender.com/api/get-notifications/${id}`);
        //const resp=await axios.get(`http://localhost:3000/api/get-notifications/${id}`);
        const sorted = resp.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
        setloding(false);
      } catch (err) {
        console.error("Error fetching stored notifications", err);
      }
    }
    getNotifications();
  }, [id]);

  
  useEffect(() => {
    const handleNotification = (data) => {
      if (data.receiverid === id) {
        
        setNotifications((prev) => [data, ...prev]);
      }
    };
    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [id]);

  async function giveapprove(studentid)
  {
    try{
      const resp=await axios.put(`https://sangolacollage.onrender.com/api/give-approve/${studentid}`);
      
      setNotifications((prev)=>prev.filter((notif)=> notif.data.id !== studentid));
    }
    catch(err){
      console.log("error at Give Approve",err);
    }
  }
  async function givereject(studentid)
  {
    try{
      const resp=await axios.put(`https://sangolacollage.onrender.com/api/give-reject/${studentid}`);
      setNotifications((prev)=>prev.filter((notif)=> notif.data.id !== studentid));
    }
    catch(err){
      console.log("error at Give reject",err);
    }
  }
  return (
    <div className="notifications-panel">
      
      <h2 className="panel-title">Notifications</h2>
      {loding && (
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      )}
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif._id} className={`notification-card ${!notif.read ? "unread" : ""}`}>
              <div className="notification-header">
                <span className="notification-type">{notif.type}</span>
                <button type="button" class="btn btn-primary position-relative">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                    <span class="visually-hidden">unread messages</span>
                    </span>
                </button>
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
                    <strong>Parent Whatsapp No:</strong>  {notif.data.parentno}
                  </p>
                </div>
                <p><strong>Student Mobile No:</strong> {notif.data.mobileno}</p>
              </div>
              <div className="notification-actions">
                <a href={`tel:${notif.data.parentno}`}> 
                    <button className="call-btn">
                      <i className="bi bi-telephone-fill"></i> Call 
                    </button>
                </a>
                <button className="approve-btn" onClick={()=>{giveapprove(notif.data.id)}}>
                  <i className="bi bi-check-lg"></i>
                </button>

                <button className="reject-btn" onClick={()=>{givereject(notif.data.id)}}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { MentorDashboardContent };