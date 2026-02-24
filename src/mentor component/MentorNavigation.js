import "./mentor.css";
import "animate.css";

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutWarning from "../admin component/AdminNevbar";

import { AuthContext } from "../Authintication";
function MentorNavbar() {
  const { login,logout } = useContext(AuthContext);
  const nevigate = useNavigate();


  return (
    <div className="mentor-nevigation animate__animated animate__fadeInLeft animate__slow">
      <nav className="navbar navbar-dark bg-dark flex-colunimate_animate__animated mn align-items-start">

        {/* Header */}
        <div className="navbar-brand ms-1 mb-1 adminlogo  sidebar-btn">
          Welcome Mentor 👋
        </div>

        {/* Menu */}
        <ul className="navbar-nav w-100 px-2">

          <li className="nav-item mb-2">
            <button className="btn btn-dark w-100 text-start sidebar-btn"  onClick={() => nevigate("/mentor/add-student")}  >
              <i className="bi bi-person-fill-add me-2 set-icon"></i>
              Add Student
            </button>
          </li>

          <li className="nav-item mb-2">
            <button  className="btn btn-dark w-100 text-start  sidebar-btn sidebar-btn-delete"  onClick={() => nevigate("/mentor/delete-user")}  >
              <i className="bi bi-person-x me-2 set-icon"></i>
              Delete Student
            </button>
          </li>

          <li className="nav-item mb-2">
            <button className="btn btn-dark w-100 text-start sidebar-btn"  onClick={() => nevigate("/mentor/view-student")}  >
              <i className="bi bi-binoculars me-2 set-icon"></i>
              View Student
            </button>
          </li>

          <li className="nav-item mb-2">
            <button className="btn btn-dark w-100 text-start sidebar-btn" onClick={()=>{nevigate("/mentor/add-attendance")}}>
              <i className="bi bi-calendar-check me-2 set-icon"></i>
              Add Attendance
            </button>
          </li>

          <li className="nav-item mb-2">
            <button className="btn btn-dark w-100 text-start sidebar-btn">
              <i className="bi bi-journal-plus me-2 set-icon"></i>
              Add Assignment
            </button>
          </li>

          <li className="nav-item mb-2">
            <button className="btn btn-dark w-100 text-start sidebar-btn">
              <i className="bi bi-clipboard-data me-2 set-icon"></i>
              View Attendance
            </button>
          </li>
          <button className="confirm-btn" onClick={()=>{nevigate("/admin/warning-logout")}}>
              <i className="bi bi-box-arrow-right"></i>
              Logout
          </button>
        </ul>
      </nav>
    </div>
  );
}

export { MentorNavbar };
