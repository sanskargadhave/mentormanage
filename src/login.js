import "./Main_pageComponent.css";
import "animate.css";
import {useState } from "react";
import {useNavigate} from "react-router-dom";
import { useContext} from "react";
import { AuthContext } from "../src/Authintication";


function AdminLogin()
{
    const { login } = useContext(AuthContext);
    const [error,seterror]=useState("");
    const [showlogin,setshowlogin]=useState(true);
    const [showerror,setshowerror]=useState(false);
    const [showsucess,setshowsucess]=useState(false);

    const [data,setdata]=useState({
        emailid:"",
        password:"",
    });

    function handleChange(e)
    {
        const {name,value}=e.target;
        setdata({...data,[name]:value});
    }
    async function iscorrect()
    {
        try 
        {
            const resp = await fetch("https://sangolacollage.onrender.com/api/admin-login",{
                method:"POST",
                headers:{
                "Content-Type":"application/json"},
                body:JSON.stringify(data),
            });

            const result = await resp.json(); 
            
            if (!resp.ok) 
            {
                seterror(result.message);
                setshowlogin(false);
                setshowerror(true);
                return;
            }
            seterror(result.message);
            setshowlogin(false);
            setshowerror(false);
            setshowsucess(true);
                login({
                    id:result.admin._id,
                    role:result.admin.role,
                    email:result.admin.emailid,
                    name:"Sanskar Gadhave"
                });
        } 
        catch (err) 
        {
            seterror(err.message);
            setshowlogin(false);
            setshowerror(true);
        }
    }
    const nevigate=useNavigate();
    return (
        <div className="login-wrapper">
            {showlogin && (
            <div className="login-card animate__animated animate__fadeInDown">

                <h2 className="title">Admin Login</h2>
                <p className="subtitle">Login using your Admin credentials</p>

                <div className="input-group">
                    <i className="bi bi-person-badge-fill"></i>
                    <input type="email" name="emailid" placeholder="Admin Email" onChange={handleChange}/>
                </div>

                <div className="input-group">
                    <i className="bi bi-lock-fill"></i>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
                </div>

                <button className="role-btn mentor" onClick={iscorrect}>
                    <i className="bi bi-box-arrow-in-right"></i>
                    Login
                </button>
                <p className=" war">* Please Do Not Share Password With Others</p>
            </div>)}

            {showerror && (
            <div className="login-card animate__animated animate__fadeInDown">
                <h2 className="title">{error}</h2>
                <div className="action-buttons">
                    <button className="retry-btn" onClick={()=>{
                        setshowerror(false);
                        setshowlogin(true);
                    }}>
                        <i className="bi bi-arrow-repeat"></i>
                            Try Again
                        </button>

                    <button className="exit-btn" onClick={()=>nevigate("/")}>
                        <i className="bi bi-door-open"></i>
                        Exit
                    </button>
                </div>
            </div>)}

            {showsucess && (
            <div className="login-card animate__animated animate__fadeInDown">
                <h2 className="title">{error}</h2>
                <button className="btn btn-success" onClick={()=>{nevigate("/admin")}}>
                    <i className="bi bi-check-lg"></i> Sign in
                </button>        
            </div>
            )}   
        </div>
    );
}






function Login() {

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [showPassword,setShowPassword]=useState(false);
    const [error,seterror]=useState("");
    const nevigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const { login } = useContext(AuthContext);
    const handleSubmit=async (e)=>{
        e.preventDefault();
        await verifyData();
    };
    async function verifyData()
    {
        try{
            setLoading(true);
            const resp=await fetch("http://localhost:5000/api/user-login",{
                method:"POST",
                headers:{
                "Content-Type":"application/json"},
                body:JSON.stringify({
                    emailid:email,
                    password:password
                })
            })
            const data=await resp.json();
            if(data.islogin)
            {
                login({
                    id:data.userdetails.userid,
                    role:data.userdetails.role,
                    email:data.userdetails.emailid,
                    name:"Sanskar Gadhave"
                }); 
                const role=data.userdetails.role;
                if(role==="Admin")
                {
                    nevigate("/admin");
                }  
                else if(role==="Mentor")
                {
                    nevigate("/mentor");
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
            seterror(err);
        }
        setLoading(false);
    }
    return(

        <div className="login-page">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-sub">Login to continue</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-box">
                    <input type="email" placeholder=" " value={email} required onChange={(e)=>setEmail(e.target.value)}/>
                    <label>Email ID</label>
                </div>

                <div className="input-box password-box">
                    <input type={showPassword ? "text" : "password"} placeholder=" " value={password} required onChange={(e)=>setPassword(e.target.value)} />
                    <label>Password</label>

                    <span className="toggle-pass" onClick={()=>setShowPassword(!showPassword)}>
                        {showPassword ? "🙈" : "🐵"}
                    </span>

                </div>

                {error && <p className="error">{error}</p>}

                <button className={`login-btn ${loading ? "loading" : ""}`}  disabled={loading} >
                    {loading ? (
                        <div class="spinner-border text-danger" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    ) : ("Login")}
                </button>


            </form>

        </div>
    );
}





function MentorLogin()
{
    const { login } = useContext(AuthContext);
    const [error,seterror]=useState("");
    const [showlogin,setshowlogin]=useState(true);
    const [showerror,setshowerror]=useState(false);
    const [showsucess,setshowsucess]=useState(false);

    const [data,setdata]=useState({
        emailid:"",
        password:"",
    });

    function handleChange(e)
    {
        const {name,value}=e.target;
        setdata({...data,[name]:value});
    }
    async function iscorrect()
    {
        try 
        {
            const resp = await fetch("https://sangolacollage.onrender.com/api/mentor-login",{
                method:"POST",
                headers:{
                "Content-Type":"application/json"},
                body:JSON.stringify(data),
            });

            const result = await resp.json(); 
            if (!resp.ok) 
            {
                seterror(result.message);
                setshowlogin(false);
                setshowerror(true);
                return;
            }
            seterror(result.message);
            setshowlogin(false);
            setshowerror(false);
            setshowsucess(true);

            login({
                    id:result.mentor.mentorId,
                    role:"Mentor",
                    email:result.mentor.contactdetails.emailid,
                    name:result.mentor.personaldetails.name
                });
          
        } 
        catch (err) 
        {
            seterror(err.message);
            setshowlogin(false);
            setshowerror(true);
        }
    }
    const nevigate=useNavigate();
    return (
        <div className="login-wrapper">
            {showlogin && (
            <div className="login-card  animate__animated animate__fadeInDown">

                <h2 className="title">Mentor Login</h2>
                <p className="subtitle">Login using your mentor credentials</p>

                <div className="input-group">
                    <i className="bi bi-person-badge-fill"></i>
                    <input type="email" name="emailid" placeholder="Mentor Emailid" onChange={handleChange}/>
                </div>

                <div className="input-group">
                    <i className="bi bi-lock-fill"></i>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
                </div>

                <button className="role-btn mentor" onClick={iscorrect}>
                    <i className="bi bi-box-arrow-in-right"></i>
                    Login
                </button>

            </div>)}
            {showerror && (
            <div className="login-card animate__animated animate__fadeInDown">
                <h2 className="title">{error}</h2>
                <div className="action-buttons">
                    <button className="retry-btn" onClick={()=>{
                        setshowerror(false);
                        setshowlogin(true);
                    }}>
                        <i className="bi bi-arrow-repeat"></i>
                            Try Again
                        </button>

                    <button className="exit-btn" onClick={()=>nevigate("/")}>
                        <i className="bi bi-door-open"></i>
                        Exit
                    </button>
                </div>
            </div>)}

            {showsucess && (
            <div className="login-card animate__animated animate__fadeInDown">
                <h2 className="title">{error}</h2>
                <br/><br/>
                <button className="btn btn-success" onClick={()=>{nevigate("/mentor")}}>
                    <i className="bi bi-check-lg"></i> Sign in
                </button>        
            </div>
            )}   
        </div>
    );
}
export {AdminLogin,MentorLogin,Login};