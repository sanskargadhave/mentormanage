import "./Main_pageComponent.css";
import { useEffect,useState,useContext} from "react";
import { Link } from "react-router-dom";
import { PersonPlusFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom"; 
import collagephoto from "./collageassets/collagephoto.jpeg";
import { DashbordContext } from "./DashbordAuthContext";
function StudentDashboardContent()
{
 
  const {totalStudent,totalMentor}=useContext(DashbordContext);
  const navigate =useNavigate();

  return (
  <div className="container" style={{marginTop:"100px"}}>

    {/* NOTICE */}
    <div className="noticeClass">
      <div className="notice-scroll">
        🔔 Important Notice: Attendance is mandatory today &nbsp;&nbsp;&nbsp;
        🔔 Result Soon: BSc ECS-II Sem 3
      </div>
    </div>
    <div class="college-info-section">

  <div class="college-card">
    <div class="college-image">
      <img src={collagephoto} alt="College Campus" />
    </div>

    <div class="college-content">
      <span class="college-tag">EduMentor @SangolaCollege</span>

      <h2>Welcome to Sangola College EduMentor Management System</h2>

      <p>
        A modern and secure platform designed to simplify student management,
        attendance tracking, academic monitoring, and campus communication
        for a smarter educational experience.
      </p>

      <div class="college-buttons">
        <button>Explore Dashboard</button>
        <button class="outline-btn">Learn More</button>
      </div>
    </div>
  </div>

</div>
    {/* NEW WRAPPER (important) */}
    <div className="dashboard-container">

      <div className="card TotalStudent animate__animated animate__fadeInUp">
        <div className="card-body">
          <div className="icon-text">
            <i className="bi bi-mortarboard"></i>
            <h5>Total Students</h5>
          </div>
          <h3>{totalStudent}</h3>
        </div>
      </div>

      <div className="card TotalStudent animate__animated animate__fadeInUp">
        <div className="card-body">
          <div className="icon-text">
            <i className="bi bi-person-workspace"></i>
            <h5>Total Mentors</h5>
          </div>
          <h3>{totalMentor}</h3>
        </div>
      </div>

      <div className="card TotalStudent animate__animated animate__fadeInUp">
        <div className="card-body">
          <div className="icon-text">
            <i className="bi bi-journal-bookmark"></i>
            <h5>Attendance Rate</h5>
          </div>
          <h3>00</h3>
        </div>
      </div>
      <div className="registration-card">
        <div className="blur-circle"></div>
        <div className="row align-items-center">
          <div className="col-12 col-lg-8 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="registration-icon">
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <div>
                <h3 className="registration-title">
                  Student Registration
                </h3>

                <span className="registration-badge">
                  Mentor Verifiacation
                </span>
              </div>
            </div>

            <p className="registration-description">
              Students who have not completed their registration can now
              submit their details using the official registration form.
              Please ensure all information is correct before final
              submission.
            </p>
            <div className="registration-link-box">
              <span className="registration-link-label">
                <i className="bi bi-link-45deg me-2"></i>
                Registration Link
              </span>

              <div className="registration-link-wrapper">
                <a href="/register-student" className="registration-link" target="_blank" rel="noopener noreferrer">
                  https://sangolacollagesangola.vercel.app/register-student
                </a>
              </div>
            </div>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <button className="registration-btn" onClick={()=>{navigate("/register-student")}}>
                <i className="bi bi-person-plus-fill me-2"></i>
                Add New Student
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="leave-banner-card">
        <div className="leave-banner-overlay"></div>

          <div className="leave-banner-content">
    
            

            <div className="leave-text-section">
              <span className="leave-tag">
                Student Excuse Department
              </span>

              <h2>
                “Not feeling well...  
                but feeling strong enough to submit leave online 😌”
              </h2>

              <p>
                Whether it’s fever, function, festival, or just needing a break from
                assignments — submit your leave request directly to your mentor in
                seconds.
              </p>

              <button className="leave-apply-btn" onClick={() => navigate("/student/leave-application-to-mentor")}>
                📄 Apply For Leave
              </button>
            </div>
          </div>
        </div>
    </div> 
  );
}

export {StudentDashboardContent};