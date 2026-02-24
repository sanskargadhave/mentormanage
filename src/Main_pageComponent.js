import "./Main_pageComponent.css";
import { useEffect,useState} from "react";
function StudentDashboardContent()
{
  const[totalStudent,setTotalStudent]=useState(0);
  useEffect(()=>{
    fetch("http://localhost:5000/api/students/count")
    .then(res=>res.json())
    .then(data=>setTotalStudent(data.count))
  },[]);

  const[totalMentor,setTotalMentor]=useState(0);
  useEffect(()=>{
    fetch("http://localhost:5000/api/Mentor/count")
    .then(res=>res.json())
    .then(data=>setTotalMentor(data.count))
  },[]);

  return (
  <div className="container" style={{marginTop:"100px"}}>
    <marquee className="noticeClass" behavior="scroll" direction="left">
    🔔 Important Notice: Attendance is mandatory today
    🔔 Result Soon : BSc Ecs-II Sem 3 
    </marquee>

    <div className="card TotalStudent animate__animated animate__bounce animate__slow animate__infinite" >
      <div className="card-body">
        <br></br>
        <i className="bi bi-mortarboard icon-text "><h2>Total Students </h2></i>
        <br></br><br></br>
        <h3>{totalStudent}</h3>
      </div>
    </div>

    <div className="card TotalStudent animate__animated animate__bounce animate__slow animate__infinite" >
      <div className="card-body">
        <br></br>
        <i className="bi-person-workspace icon-text"><h2>Total Mentors </h2></i>
        <br></br><br></br>
        <h3>{totalMentor}</h3>
      </div>
    </div>

    <div className="card TotalStudent animate__animated animate__bounce animate__slow animate__infinite" >
      <div className="card-body">
        <br></br>
        <i className="bi bi-journal-bookmark icon-text"><h2>Attendance Rate</h2></i>
        <br></br><br></br>
        <h3>00</h3>
      </div>
    </div>
  </div> 
  );
}
export {StudentDashboardContent};
