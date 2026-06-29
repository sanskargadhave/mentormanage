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

        return () => socket.off("notification", handleNotification);
    }, [id]);

    return (
        <div className="admin-content">
            <div className="mentor-dashboard-hero">

                <div>
                    <h1>Mentor Control Panel</h1>
                    <p>
                        Manage student verifications,
                        leave approvals and attendance reports.
                    </p>
                    <div className="live-status">
                        <label className="animate__animated animate__pulse animate__slow animate__infinite"> 🟢 </label>   Live Notification System Active
                    </div>
                </div>
            </div>
      
        </div>
    );
}
export {AdminDashbord}