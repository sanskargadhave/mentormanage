import { useNavigate } from "react-router-dom";
import {useContext } from "react";
import { AuthContext } from "./Authintication";
import "./admin component/admin.css";
import "./admin component/adminNevbar.css";

export default function LogoutWarning()
{
    const { logout,role } = useContext(AuthContext);
    const nevigate=useNavigate();
    return(
        <div className="logout-overlay admin-content">
            <div className="logout-modal  animate__animated animate__zoomIn">
      
                <div className="logout-icon">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>

                <h2>Confirm Logout</h2>
                <p>
                    You are about to logout from your account.
                    <br/>
                    You Need To Sign in Again
                </p>

                <div className="logout-actions">
                    <button className="cancel-btn" onClick={()=>{role==="Admin"? nevigate("/admin") : nevigate("/mentor")}}>
                        <i className="bi bi-x-circle"></i>
                        Cancel
                    </button>

                    <button className="confirm-btn" onClick={()=>{
                        logout();
                        nevigate("/");
                    }}>
                        <i className="bi bi-box-arrow-right"></i>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
