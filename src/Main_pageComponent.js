import "./Main_pageComponent.css";
import { useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { PersonPlusFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom"; 
function StudentDashboardContent()
{
  const[totalStudent,setTotalStudent]=useState(0);
  const navigate =useNavigate();
  const token=localStorage.getItem("token");
  useEffect(()=>{
    
    fetch("https://sangolacollage.onrender.com/api/common/students/count",{
             headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    .then(res=>res.json())
    .then(data=>setTotalStudent(data.count))
  },[token]);

  const[totalMentor,setTotalMentor]=useState(0);

  useEffect(()=>{
    
    fetch("https://sangolacollage.onrender.com/api/common/Mentor/count",{
             headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    .then(res=>res.json())
    .then(data=>setTotalMentor(data.count))
  },[token]);

  return (
  <div className="container" style={{marginTop:"100px"}}>

    {/* NOTICE */}
    <div className="noticeClass">
      <div className="notice-scroll">
        🔔 Important Notice: Attendance is mandatory today &nbsp;&nbsp;&nbsp;
        🔔 Result Soon: BSc ECS-II Sem 3
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
    </div> 
  );
}

export {StudentDashboardContent};