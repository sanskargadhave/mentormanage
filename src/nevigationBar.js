import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Authintication";
import "./Nevigation_Bar.css";

function NevigationBar() {

    const {role,email,id,name}=useContext(AuthContext);
    const nevigate=useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top mentor-navbar">
      <div className="container mentor-nevbar">

        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center" href="/dashboard">
          <img src="/logo-college.png" alt="Logo" style={{ height: '40px', width: '40px' }}/>
          <span className="ms-2">EduMentor @Sangola Collage</span>
        </a>

        {/* Toggle button */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mentorNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="mentorNavbar">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <a className="nav-link " href="/dashboard">
                <i className="bi bi-house"></i>  Dashboard
              </a> 
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/dashboard">
                <i className="bi bi-people"></i>  Students 
              </a>             
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/dashboard">
                <i className="bi bi-person-lock"></i>  Mentors
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/dashboard">
                <i className="bi bi-building-check"></i>   Reports
              </a>
            </li>
            <li className="nav-item">
              { role ==="Guest" && (
              <div className="col-12">
                <button type="submit" className="btn btn-primary" onClick={()=>nevigate("/login")}>Sign in</button>
              </div>)}
              { role !== "Guest" && 
              (
                <li className="nav-item profile-hover">
                  <div className="profile-trigger d-flex align-items-center">
                    <i className="bi bi-person-circle profile-icon"></i>
                      <span className="ms-1">Profile</span>
                  </div>

                  <div className="profile-menu">
                    <div className="profile-header">
                      <i className="bi bi-person-circle big-icon"></i>
                      <h6 className="mb-2">Prof. {name}</h6>
                      <hr/>
                      <small className="text-muted">Role: {role}</small>
                      <br/>
                      <small className="text-muted">Id: {id}</small><br/>
                      <small className="text-muted">EmailId: {email}</small><br/>
                    </div>
                    <hr/>
                    <button className="logout" onClick={()=>{nevigate("/admin/warning-logout")}}>
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </button>
                    <br/>
                  </div>
                </li>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export {NevigationBar};
