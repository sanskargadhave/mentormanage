import { useNavigate } from "react-router-dom";
import { useEffect,useContext } from "react";
import { AuthContext } from "../Authintication";
import './admin.css';
import 'animate.css';

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

function AdminNavbar() {
    
    const nevigate = useNavigate();
    return (
        <div className="admin-sidebar animate__animated animate__fadeInLeft animate__slow">
            <div className="sidebar-header">
                <h5>Welcome Admin 👋</h5>
            </div>

            <ul className="sidebar-menu">
                <li>
                    <button className="sidebar-btn" onClick={() => {nevigate("/admin/add-student")}}>
                        <i className="bi bi-person-fill-add set-icon me-2"></i>
                        Add Student
                    </button>
                </li>

                <li>
                    <button className="sidebar-btn" onClick={() => {nevigate("/admin/add-mentor")}}>
                        <i className="bi bi-person-square set-icon me-2"></i>
                        Add Mentors
                    </button>
                </li>

                <li>
                    <button className="sidebar-btn" onClick={() =>{ nevigate("/admin/add-teacher")}}>
                        <i className="bi bi-person-video3 set-icon me-2"></i>
                        Add Teacher
                    </button>
                </li>
                
                <li className="nav-item mb-2">
                    <button className="btn btn-dark w-100 text-start sidebar-btn" onClick={()=>{nevigate("/admin/add-lecture")}}>
                        <i className="bi bi-calendar-check me-2 set-icon"></i>
                        Add Lecture
                    </button>
                </li>


                <li>
                    <button className="sidebar-btn delete" onClick={() =>{ nevigate("/admin/delete-user")}}>
                        <i className="bi bi-person-x set-icon me-2"></i>
                        Delete Users
                    </button>
                </li>

                <li>
                    <button className="sidebar-btn" onClick={() => {nevigate("/admin/view-users")}}>
                        <i className="bi bi-binoculars set-icon me-2"></i>
                        View Users
                    </button>
                </li>

                <li>
                    <button className="sidebar-btn" onClick={() => {nevigate("/admin/assign-mentor")}}>
                        <i className="bi bi-send set-icon me-2"></i>
                        Assign Mentor
                    </button>
                </li>

                <li>
                    <button className="logout-btn" onClick={()=>{nevigate("/admin/warning-logout")}}>
                        <i className="bi bi-box-arrow-right "></i>
                        Logout
                    </button>
                </li>

            </ul>
        </div>
    );
}

export { AdminNavbar};
