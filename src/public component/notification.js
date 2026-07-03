import "./notification.css";
import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import { useNavigate } from "react-router-dom";
function Notification() {
    const { id,token} = useContext(AuthContext);
  const navigate=useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loding,setloding]=useState({});
  const [show,setshow]=useState(true);
  const [event,setevent]=useState("");
  const [subjects,setSubjects]=useState([]);
  const [message,setmessage]=useState("");
  const [url,seturl]=useState("");

  useEffect(() => {
  if (id) {
    socket.emit("join_room", {
      userid: id,
      role: "Mentor"
    });
  }
}, [id]);


    useEffect(() => {
  if (!token || !id) return; 

  async function getNotifications() {
    try {
      setloding((prev)=>({...prev,getNotifications:true}));//https://sangolacollage.onrender.com

      const resp = await axios.get(
        `https://sangolacollage.onrender.com/api/mentor/get-notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sorted = resp.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(sorted);
    } 
    catch (err) 
    {
      if(err.response?.status === 401){
        localStorage.clear();
        navigate("/unauthorized");
        return;
      }
      
    } 
    finally {
     setloding((prev)=>({...prev,getNotifications:false}));
    }
  }

  getNotifications();
}, [id, token]);

 useEffect(() => {
    const handleNotification = (data) => {
      if (data.receiverid === id) {
        
        setNotifications((prev) => [data, ...prev]);
      }
    };
    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [id]);


    const handleNotificationClick = (notification) => {
      if(!notification.isRead)
      {
        axios.put(`https://sangolacollage.onrender.com/api/mentor/notification-isread/${notification._id}`,{},
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        )
      }
      navigate(notification.actionUrl);
    }
    return (
        <div className="notification-container">
            <div className="notification-filter">
                <button>All</button>
                <button>Unread</button>
                <button>Message</button>
            </div>

            <div className="notification-list">

                 {
                  notifications.length === 0 ? (
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
                    notifications.map((item) => (
                        <div key={item._id} className={`notificationss-card ${!item.isread ? "unread" : ""}`} onClick={()=>handleNotificationClick(item)}> 
                           <div className="notification-avatar">
                                <img src={ item.metadata?.profileurl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"} alt={item.metadata?.name} className="notification-profile-pic"/>
                            </div>
                            <div className="notification-details">
                                <div className="notification-top">
                                    <h4>{item.metadata?.name || item.title}</h4>
                                    <span>{new Date(item.createdAt).toLocaleDateString("en-IN",{
                                                    day:"numeric",
                                                    month:"short",
                                                    year:"numeric"
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