import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import "./mentor.css";

function MentorDashboardContent() {
  const { id } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loding,setloding]=useState(false);
  const [show,setshow]=useState(true);
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
    <div className="admin-content">
      <h5 className="panel-title">

        <div className="title-left">
          <i className="fa fa-bell notification-icon"></i>
          <span className="title-text">Notifications</span>
          <span className="notification-badge">
            {notifications.length}
          </span>
        </div>
        <div className="notification-wrapper">
          <i className="fa fa-bell notification-icon"></i>

          {notifications.length > 0 && (
            <span className="notification-count">
              {notifications.length}
            </span>
          )}
        </div>
        <div className="title-right">

          {show ? (
            <button className="hide-btn" onClick={() => setshow(false)}>
              Hide
            </button>
          ) : (
          <button className="show-btn" onClick={() => setshow(true)}>
            Show
          </button>)}

        </div>

      </h5>
    {show && (
    <div className="notifications-panel">
      {loding && (
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      )}
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications yet</p>
      ) 
       :(
        <div className="notifications-list">
          
          {notifications.map((notif) => (
            <div key={notif._id} className={`notification-card ${!notif.read ? "unread" : ""}`}>
              <div className="notification-header">
                <span className="notification-type">New Student Registered Verify </span>
                <span className="notification-time">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="notification-message"><span class="badge rounded-pill bg-success">{notif.message}</span></div>
              <div className="notification-details">
                <h6><strong>Name:</strong> {notif.data.name}</h6>
                <h6><strong>Department:</strong> {notif.data.department}</h6>
                <h6><strong>Course:</strong>  {notif.data.course}</h6>
                <h6><strong>Year:</strong>  {notif.data.year}</h6>
                <h6><strong>Division:</strong>  {notif.data.division}</h6>
                <div className="verify-parent-number">
                  <span className="badge rounded-pill bg-warning text-dark">
                    Please Verify This Parent Whatsapp No
                  </span>
                  <p>
                    <strong>Parent Whatsapp No:</strong>  {notif.data.parentno}
                  </p>
                </div>
                <p><strong>Student Mobile No:</strong>  {notif.data.mobileno}</p>
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
    </div>)}
  </div>
  );
}

export { MentorDashboardContent };