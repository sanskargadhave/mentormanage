import "./Main_pageComponent.css";
import "animate.css";
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { useContext} from "react";
import { AuthContext } from "../Authintication";
import { NotificationContext } from "../notificationAuthContext";
import axios from "axios";
import logo from "../collageassets/logo-college.png";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
function Login() {

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [showPassword,setShowPassword]=useState(false);
    const [error,seterror]=useState("");
    const nevigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const { login,token} = useContext(AuthContext);
    const {setNotifications}=useContext(NotificationContext);
    const handleSubmit=async (e)=>{
        e.preventDefault();
        await verifyData();
    };
    async function verifyData()
    {
        try{
            setLoading(true);
            const resp=await axiosInstance.post("/authenticate/user-login",{emailid:email,password:password});
            const data=resp.data;
            if(data.islogin)
            {
                login({
                    id: data.user.id,
                    role: data.user.role,
                    email: data.user.emailid,
                    name: "Sanskar Gadhave",
                    token: data.token,
                    profilepic:data.user.profileurl
                }); 
                
                const resp = await axiosInstance.get(`/common/get-notifications/${data.user.id}`);

                const notificationData = await resp.data;

                setNotifications(notificationData);
                localStorage.setItem("notifications",JSON.stringify(notificationData));
                
                const role=data.user.role;
                if(role==="Admin")
                {
                    nevigate("/admin");
                }  
                else if(role==="Mentor")
                {
                    nevigate("/mentor");
                }
                else if(role==="Student")
                {
                    nevigate("/student")
                }
                else
                {
                    nevigate("/");
                }
            }
            else
            {
                seterror(data.message);
            }
            
        }
        catch(err)
        {
           console.log(err.message);
        }
        finally{
        setLoading(false);}
    }
    return(

        <div className="login-page ">
            {!loading ?(<>
                <h2 className="login-title animate__animated animate__rotateInUpLeft">Welcome Back</h2>
                <p className="login-sub animate__animated animate__rotateInUpLeft">Login to continue</p>
                <form className="login-form animate__animated animate__fadeInDown" onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input type="email" placeholder=" " value={email} required onChange={(e)=>setEmail(e.target.value)}/>
                        <label>Email ID</label>
                    </div>

                    <div className="input-box password-box">
                        <input type={showPassword ? "text" : "password"} placeholder=" " value={password} required onChange={(e)=>setPassword(e.target.value)} />
                        <label>Password</label>

                        <span className="toggle-pass animate__animated animate__fadeInLeftBig" onClick={()=>setShowPassword(!showPassword)}>
                            {showPassword ? "🙈" : "🐵"}
                        </span>

                    </div>

                    {error && <p className="error">{error}</p>}

                    <button className={`login-btn ${loading ? "loading" : ""}`}  disabled={loading} >
                        {loading ? (
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : ("Login")}
                    </button>


                </form>
            </>):(<LoginLoader/>)}
            
        </div>
    );
}


 function LoginLoader() {

    const messages = [
        "Authenticating User...",
        "Loading Dashboard...",
        "Fetching Attendance...",
        "Preparing Reports...",
        "Loading Faculty Spotlight...",
        "Almost Ready..."
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setIndex((prev) => (prev + 1) % messages.length);

        }, 1200);

        return () => clearInterval(timer);

    }, []);

    return (


            <div className="loader-card">

                <div className="logo-wrapper">

                    <div className="ring"></div>

                    <img
                        src={logo}
                        className="college-logo"
                        alt=""
                    />

                    <span className="particle p1"></span>
                    <span className="particle p2"></span>
                    <span className="particle p3"></span>
                    <span className="particle p4"></span>

                </div>

                <h2>Sangola Mahavidyalaya</h2>

                <p className="subtitle">
                    Mentor Management System
                </p>

                <div className="status">

                    🔐 {messages[index]}

                </div>

                <div className="progress">

                    <div className="progress-fill"></div>

                </div>

                <p className="footer-text">

                    AI Powered Attendance & Report Platform

                </p>

            </div>

        

    );

}
function LiveNotification({ notification, onClose }) {
    const navigate =useNavigate();
    return (
        <div className="live-notification">
            <div className="live-notification-header">

                <img
                    src={
                        notification.metadata?.profileurl ||
                        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
                    }
                    alt=""
                    className="live-avatar"
                />

                <div className="live-title">
                    <h5>{notification.metadata?.name || notification.title}</h5>
                    <span>Now</span>
                </div>

                <button
                    className="live-close"
                    onClick={onClose}
                >
                    <i className="bi bi-x"></i>
                </button>

            </div>

            <div className="live-body">

                <p>{notification.message}</p>

            </div>

            <div className="live-footer">

                <button
                    className="view-btn"
                    onClick={()=>navigate(notification.actionUrl)}
                >
                    View
                </button>

            </div>
        </div>
    );
}



export {Login,LiveNotification};