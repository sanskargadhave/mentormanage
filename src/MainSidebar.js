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
        {`Welcome ${role} 👋`}
      </div>
      {role==="Admin" && (
        <ul>

        <li onClick={() => {navigate("/admin/add-student")}}>
          <i className="bi bi-person-add set-icon"></i> Add Student
        </li>

        <li onClick={() => {navigate("/admin/add-mentor")}}>
          <i className="bi bi-person-x set-icon"></i> Add Mentor
        </li>

        <li onClick={() =>{ navigate("/admin/add-teacher")}}>
          <i className="bi bi-binoculars set-icon"></i> Add Teacher
        </li>

        <li onClick={()=>{navigate("/admin/add-lecture")}}>
          <i className="bi bi-calendar-check set-icon"></i>Add Lecture
        </li>

        <li onClick={() =>{ navigate("/admin/delete-user")}}>
          <i className="bi bi-clipboard-data set-icon"></i>Delete User
        </li>

        <li onClick={() => {navigate("/admin/view-users")}}>
            <i className="bi bi-clipboard-data set-icon"></i>View User
        </li>

        <li onClick={() => {navigate("/admin/assign-mentor")}}>
            <i className="bi bi-clipboard-data set-icon"></i>Assign Mentor
        </li>

        <li onClick={() => {navigate("/admin/add-admission-details")}}>
            <i className="bi bi-clipboard-data set-icon"></i>Add Admission Details
        </li>
        
      </ul>

      )}
      { role==="Mentor" && (
        <ul>
          <li onClick={()=>navigate("/mentor/add-student")}>
            <i className="bi bi-person-add set-icon"></i>Add Student
          </li>

          <li onClick={()=>navigate("/mentor/delete-user")}>
            <i className="bi bi-person-x set-icon"></i>Delete Student
          </li>

        <li onClick={()=>navigate("/mentor/view-student")}>
          <i className="bi bi-binoculars set-icon"></i>View Student
        </li>

        <li onClick={()=>navigate("/mentor/add-attendance")}>
          <i className="bi bi-calendar-check set-icon"></i>Add Attendance
        </li>

        <li onClick={()=>navigate("/mentor/add-test-result")}>
          <i className="bi bi-clipboard-data set-icon"></i>Add Test Result
        </li>

      </ul>
      )}
      {role ==="Student" && (
        <ul>
        <li onClick={()=>navigate("/student/leave-application-to-mentor")}>
          <i className="bi bi-clipboard-data set-icon"></i>  
          Apply For Leave 
        </li>
        </ul>
      )}
      <div className="sidebar-bottom">
        <button className="logouts" onClick={()=>navigate("/warning-logout")}>
            <i className="bi bi-box-arrow-right"></i> Logout
           
        </button>
      </div>
    </div>

  )

}

export default MainSidebar;