import "./Main_pageComponent.css";
import { useEffect,useState} from "react";

function StudentDashboardContent()
{
  const[totalStudent,setTotalStudent]=useState(0);
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

    </div>
  </div> 
  );
}

export {StudentDashboardContent};