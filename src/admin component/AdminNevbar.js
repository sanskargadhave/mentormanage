import { useNavigate } from "react-router-dom";
import { useEffect,useContext } from "react";
import { AuthContext } from "../Authintication";
import "./adminNevbar.css";
import "./admin.css";


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



function AdminSidebar({collapsed}){

  const nevigate = useNavigate();

  return(

    <div className={`mentor-sidebar ${collapsed ? "collapsed" : ""}`}>
    
      <div className="mentor-logo">
        {collapsed ? "" : "Welcome Mentor 👋"}
      </div>

      <ul>

        <li onClick={() => {nevigate("/admin/add-student")}}>
          <i className="bi bi-person-add set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Student"}</span>
        </li>

        <li onClick={() => {nevigate("/admin/add-mentor")}}>
          <i className="bi bi-person-x set-icon"></i>
          <span className="menu-text">{!collapsed && "Delete Student"}</span>
        </li>

        <li onClick={() =>{ nevigate("/admin/add-teacher")}}>
          <i className="bi bi-binoculars set-icon"></i>
          <span className="menu-text">{!collapsed && "View Student"}</span>
        </li>

        <li onClick={()=>{nevigate("/admin/add-lecture")}}>
          <i className="bi bi-calendar-check set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Attendance"}</span>
        </li>

        <li onClick={() =>{ nevigate("/admin/delete-user")}}>
          <i className="bi bi-clipboard-data set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Test Result"}</span>
        </li>

        <li onClick={() => {nevigate("/admin/view-users")}}>
            <i className="bi bi-clipboard-data set-icon"></i>
            <span className="menu-text">{!collapsed && "Add Test Result"}</span>
        </li>

        <li onClick={() => {nevigate("/admin/assign-mentor")}}>
            <i className="bi bi-clipboard-data set-icon"></i>
            <span className="menu-text">{!collapsed && "Add Test Result"}</span>
        </li>

        
      </ul>

    </div>

  )

}



export {AdminSidebar};
