import "./Main_pageComponent.css";
import "animate.css";
import {useState } from "react";
import {useNavigate} from "react-router-dom";
import { useContext} from "react";
import { AuthContext } from "../src/Authintication";

function Login() {

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [showPassword,setShowPassword]=useState(false);
    const [error,seterror]=useState("");
    const nevigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const { login,token} = useContext(AuthContext);
    const handleSubmit=async (e)=>{
        e.preventDefault();
        await verifyData();
    };
    async function verifyData()
    {
        try{
            setLoading(true);
            const resp=await fetch("https://sangolacollage.onrender.com/api/authenticate/user-login",{
                method:"POST",
                headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
                body:JSON.stringify({
                    emailid:email,
                    password:password
                })
            })
            const data=await resp.json();
            if(data.islogin)
            {
                login({
                    id: data.user.id,
                    role: data.user.role,
                    email: data.user.emailid,
                    name: "Sanskar Gadhave",
                    token: data.token 
                }); 
                const role=data.user.role;
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
            seterror(err.message);
        }
        setLoading(false);
    }
    return(

        <div className="login-page ">
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

        </div>
    );
}






export {Login};