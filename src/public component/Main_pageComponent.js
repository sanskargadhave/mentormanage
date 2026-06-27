import "./Main_pageComponent.css";
import { useEffect,useState,useContext} from "react";
import { Link } from "react-router-dom";
import { PersonPlusFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom"; 
import collagephoto from "../collageassets/collagephoto.jpeg";
import { DashbordContext } from "../DashbordAuthContext";
import { AuthContext } from "../Authintication";
function StudentDashboardContent()
{
 
  const {totalStudent,totalMentor}=useContext(DashbordContext);
  const {role}=useContext(AuthContext);
  const navigate =useNavigate();
  const getHomeRoute = () => {
    if (role === "Admin") return "/admin";
    if (role === "Mentor") return "/mentor";
    if (role === "Student") return "/student";
    
  };
  return (
  <div className="container" style={{marginTop:"100px"}}>

    {/* NOTICE */}
    <div className="noticeClass">
      <div className="notice-scroll">
        🔔 Important Notice: Attendance is mandatory today &nbsp;&nbsp;&nbsp;
        🔔 Result Soon: BSc ECS-II Sem 3
      </div>
    </div>
    <div class="college-info-section animate__animated animate__backInUp">
      <div className="dashboard-hero">
        <div className="dashboard-content">
          <h1>Welcome Back, {role} 👋</h1>

          <p className="subtitle">
              Your academic ecosystem is ready.
          </p>

            {role ==="Guest" 
              ?(<>
                  <p className="description">
                    You're currently exploring MentorManage in guest mode.

                    Login to access personalized dashboards,
                    attendance records, academic performance tracking,
                    and powerful mentorship tools designed for your success.

                    🚀 Login to Unlock Your Dashboard
                  </p>
                  
                   <button className="launch-btn" onClick={() => navigate("/login")}>
                      🚀 Login to Continue
                  </button>
                </>
                )

              :(<>                
                  <p className="description">
                    Manage students, mentors, attendance, results,
                    and institutional operations from one centralized platform.
                  </p>
                  <button className="launch-btn" onClick={() =>  navigate(getHomeRoute())} >
                    🚀 Launch Dashboard
                  </button>
                </>

                )
            }

            
          
        </div>    
      </div>


      
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
        {role ==="Student" && (
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
          </div>)}
          <div className="portal-container">

    <h1 className="portal-title">
        📊 Academic Performance & Attendance Transparency Portal
    </h1>

    <p className="portal-description">
        Sangola College proudly provides a modern digital platform for attendance tracking,
        academic performance monitoring, and leave management for students, mentors, and parents.
    </p>
    
    <div className="portal-section">
        <h2>👨‍🏫 Benefits for Mentors</h2>

        <div className="portal-item">✅ Easily search and find student attendance records.</div>
        <div className="portal-item">✅ Quickly identify low attendance students.</div>
        <div className="portal-item">✅ Monitor test performance and academic progress.</div>
        <div className="portal-item">✅ No need to store paper leave applications.</div>
        <div className="portal-item">✅ Review and manage leave requests digitally.</div>
    </div>

    <div className="portal-section">
        <h2>🎓 Benefits for Students</h2>

        <div className="portal-item">✅ Check attendance anytime.</div>
        <div className="portal-item">✅ Know exactly when you were absent.</div>
        <div className="portal-item">✅ View test results and academic progress.</div>
        <div className="portal-item">✅ Submit leave applications online.</div>
        <div className="portal-item">✅ Access everything from one dashboard.</div>
    </div>

    <div className="portal-section">
        <h2>👨‍👩‍👧‍👦 Benefits for Parents</h2>

        <div className="portal-item">✅ Verify whether your child attends college regularly.</div>
        <div className="portal-item">✅ Monitor attendance percentage.</div>
        <div className="portal-item">✅ Stay updated with test performance.</div>
        <div className="portal-item">✅ Track leave applications and absences.</div>
    </div>

    <div className="portal-section">
        <h2>🚀 Smart Features</h2>

        <div className="portal-item">🔍 Powerful student search system.</div>
        <div className="portal-item">📈 Attendance analytics dashboard.</div>
        <div className="portal-item">📄 Paperless leave management.</div>
        <div className="portal-item">🔒 Secure role-based access.</div>
    </div>
    <div className="portal-item whatsapp-feature">
      <i className="bi bi-whatsapp whatsapp-icon"></i>
      <span>
        📱 Automatic WhatsApp Absence Alerts for Parents.

If a student is marked absent for the day, the system can automatically send a WhatsApp notification to the parent or guardian informing them about the absence.

This helps parents stay informed in real time and encourages better attendance and accountability.

      </span>
    </div>
</div>
      
          
      </div> 
    );
  }

export {StudentDashboardContent};