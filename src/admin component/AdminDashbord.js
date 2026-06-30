import { AuthContext } from "../Authintication";
import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css"
function AdminDashbord()
{
    const navigate=useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loding,setloding]=useState({});
    const { id,token} = useContext(AuthContext);
    useEffect(() => {
        if (id) {
            socket.emit("join_room", {
                userid: id,
                role: "Admin"
            });
        }
    }, [id]);

    useEffect(()=>{
        if (!token || !id) return; 
        async function getNotifications() {
            try{
                setloding((prev)=>({...prev,getNotifications:true}));

                const resp = await axios.get(
                    `https://sangolacollage.onrender.com/api/admin/get-notifications/${id}`,
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
                console.error("Error fetching stored notifications", err);
            } 
            finally {
                setloding((prev)=>({...prev,getNotifications:false}));
            }
        }
        getNotifications();
    },[id,token]);

    useEffect(() => {
        const handleNotification = (data) => {
            if (data.receiverid === id) {
                setNotifications((prev) => [data, ...prev]);
            }
        };
        socket.on("notification", handleNotification);
        console.log(notifications);
        return () => socket.off("notification", handleNotification);
    }, [id]);

    return (
        <div className="admin-content">
            <div className="mentor-dashboard-hero">

                <div>
                    <h1>Admin Control Panel</h1>
                    <p>
                        Manage Mentor , Teacher  verifications,
                        leave approvals and attendance reports.
                    </p>
                    <div className="live-status">
                        <label className="animate__animated animate__pulse animate__slow animate__infinite"> 🟢 </label>   Live Notification System Active
                    </div>
                </div>
            </div>
            <div className="notifications-list">
                {notifications.map((notif) => {
                    return (
                    <div key={notif._id} className="verification-card mentor-card">

                        

    <div className="request-top">
        <span className="mentor-badge">
            Mentor Registration Request
        </span>

        <span className="request-date">
            {new Date(notif.createdAt).toLocaleString()}
        </span>
    </div>

    <div className="mentor-main">

        <img
            src={notif.data.profileurl}
            className="mentor-avatar"
            alt=""
        />

        <div className="mentor-details">

            <h3>{notif.data.name}</h3>

            <p>{notif.data.id}</p>

            <p>
                <i className="bi bi-building"></i>
                {notif.data.department}
            </p>

            <p>
                <i className="bi bi-award"></i>
                {notif.data.qualification}
            </p>

            <p>
                <i className="bi bi-clock-history"></i>
                {notif.data.exprience} Years Experience
            </p>

            <p>
                <i className="bi bi-phone"></i>
                {notif.data.mobileno}
            </p>

        </div>

    </div>

    <div className="status-bar">
        ⏳ Awaiting Verification
    </div>

    <div className="request-actions">
        <button className="view-btn">
            View Profile
        </button>

        <button className="approve-btn">
            Approve
        </button>

        <button className="reject-btn">
            Reject
        </button>
    </div>


                    </div>
                )})}
            </div>
        </div>
    );
}
export {AdminDashbord};