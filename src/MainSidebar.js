import "./Sidebar.css";
import "./mentor component/mentor.css";
import { useNavigate} from "react-router-dom";
import { AuthContext } from "./Authintication";
import { useContext } from "react";

function MainSidebar({collapsed}){

  const navigate = useNavigate();
  
  const {role} = useContext(AuthContext);
  return(

    <div className={`mentor-sidebar ${collapsed ? "collapsed" : ""}`}>
    
      <div className="mentor-logo">
        {collapsed ? "" : `Welcome ${role} 👋`}
      </div>
      {role==="Admin" && (
        <ul>

        <li onClick={() => {navigate("/admin/add-student")}}>
          <i className="bi bi-person-add set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Student"}</span>
        </li>

        <li onClick={() => {navigate("/admin/add-mentor")}}>
          <i className="bi bi-person-x set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Mentor"}</span>
        </li>

        <li onClick={() =>{ navigate("/admin/add-teacher")}}>
          <i className="bi bi-binoculars set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Teacher"}</span>
        </li>

        <li onClick={()=>{navigate("/admin/add-lecture")}}>
          <i className="bi bi-calendar-check set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Lecture"}</span>
        </li>

        <li onClick={() =>{ navigate("/admin/delete-user")}}>
          <i className="bi bi-clipboard-data set-icon"></i>
          <span className="menu-text">{!collapsed && "Delete User"}</span>
        </li>

        <li onClick={() => {navigate("/admin/view-users")}}>
            <i className="bi bi-clipboard-data set-icon"></i>
            <span className="menu-text">{!collapsed && "View User"}</span>
        </li>

        <li onClick={() => {navigate("/admin/assign-mentor")}}>
            <i className="bi bi-clipboard-data set-icon"></i>
            <span className="menu-text">{!collapsed && "Assign Mentor"}</span>
        </li>

        <li onClick={() => {navigate("/admin/add-admission-details")}}>
            <i className="bi bi-clipboard-data set-icon"></i>
            <span className="menu-text">{!collapsed && "Add Admission Details"}</span>
        </li>
        
      </ul>

      )}
      { role==="Mentor" && (
        <ul>
          <li onClick={()=>navigate("/mentor/add-student")}>
            <i className="bi bi-person-add set-icon"></i>
            <span className="menu-text">{!collapsed && "Add Student"}</span>
          </li>

          <li onClick={()=>navigate("/mentor/delete-user")}>
            <i className="bi bi-person-x set-icon"></i>
            <span className="menu-text">{!collapsed && "Delete Student"}</span>
          </li>

        <li onClick={()=>navigate("/mentor/view-student")}>
          <i className="bi bi-binoculars set-icon"></i>
          <span className="menu-text">{!collapsed && "View Student"}</span>
        </li>

        <li onClick={()=>navigate("/mentor/add-attendance")}>
          <i className="bi bi-calendar-check set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Attendance"}</span>
        </li>

        <li onClick={()=>navigate("/mentor/add-test-result")}>
          <i className="bi bi-clipboard-data set-icon"></i>
          <span className="menu-text">{!collapsed && "Add Test Result"}</span>
        </li>

      </ul>
      )}
      <div className="sidebar-bottom">
        <button className="logouts" onClick={()=>navigate("/warning-logout")}>
            <i className="bi bi-box-arrow-right"></i>
            {!collapsed && " Logout"}
        </button>
      </div>
    </div>

  )

}

export default MainSidebar;