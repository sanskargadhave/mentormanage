import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import { useNavigate } from "react-router-dom";
import "./mentor.css";

function MentorDashboardContent() {
  const { id,token} = useContext(AuthContext);
  const navigate=useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loding,setloding]=useState({});
  const [show,setshow]=useState(true);
  const [event,setevent]=useState("");
  const [subjects,setSubjects]=useState([]);
  const [message,setmessage]=useState("");
  const [url,seturl]=useState("");
  const [filters, setFilters] = useState({
    department:"",
    course: "",
    year: "",
    division: "",
    date: ""
  });
  const courses={
    Science:["Physics","Zoology","Mathematics","Chemistry","Botany","BSC"],
    ComputerScience:["Data Science","BCA","BSC [ECS]"],
    Art:["Economics","English","Marathi","History","Geography","Hindi"],
    Commerce:["Commerce"],
  }

  const fetchTodayAttendance = async () => {
    try {
      setloding((prev)=>({...prev,fetchTodayAttendance:true}));
      if (!filters.department || !filters.course || !filters.year || !filters.division) {
        alert("Please select all filters");
        return;
      }
      const res = await fetch(`https://sangolacollage.onrender.com/api/mentor/get-today-attendance?department=${filters.department}&course=${filters.course}&year=${filters.year}&division=${filters.division}`,{
             headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
      const data = await res.json();
      setSubjects(data.completeLecture || []);
      setevent("showsubmitedattendance");
      
    } 
    catch (err) {
      if(err.response?.status === 401){
        localStorage.clear();
        navigate("/unauthorized");
        return;
      }
      console.log(err);
    }
    finally{
      setloding((prev)=>({...prev,fetchTodayAttendance:false}));    }
  };

  const generateReport=async ()=>{
    try{
      setloding((prev)=>({...prev,generateReport:true}));
      const res=await fetch(`https://sangolacollage.onrender.com/api/mentor/make-attendance-report?department=${filters.department}&course=${filters.course}&year=${filters.year}&division=${filters.division}`,{
             headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
      const result=await res.json();
      setmessage(result.message);
      seturl(result.url);
      
      setevent("showmessage");
    }
    catch(err)
    {
      if(err.response?.status === 401){
        localStorage.clear();
        navigate("/unauthorized");
        return;
      }
      console.log(err);
      setevent("showmessage");
    }
    finally{
      setloding((prev)=>({...prev,generateReport:false}))
    }

  }
  
  return (
    <div className="admin-content">   
    {event === "" && (
      <div className="attendance-report-section">
        <div className="attendance-report-content">
          <div className="attendance-report-icon">
            <i className="bi bi-clipboard-data-fill"></i>
          </div>
          <div className="attendance-report-text">
            <h3>Daily Attendance Management</h3>
            <p>
              Generate and upload today’s attendance report
              to maintain accurate student records and lecture tracking.
            </p>
          </div>
        </div>
        <button className="attendance-upload-btn" onClick={() => setevent("showoptions")}>
          <i className="bi bi-cloud-arrow-up-fill"></i>
          Upload Today Attendance
        </button>

      </div>
    )}

    {event ==="showoptions" && (
      <div className="report-filter-box ">

        <h5>Uplode Attendance Report
        <button className="close-btn" onClick={() => setevent("")}>
          <i className="bi bi-x-lg"></i>
        </button></h5>
        <div className="filter-row">

          <select  className="filter-input" id="department" value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})}>
            <option value="">Select Department</option>
            <option value="Science">Science</option>
            <option value="ComputerScience"> Computer Science</option>
            <option value="Art">Art</option>
            <option value="Commerce">Commerce</option>
          </select>

          {filters.department && 
            (
              <select className="filter-input" id="course" value={filters.course} onChange={(e) => setFilters({...filters, course: e.target.value})}> 
                <option value="">select Course</option>
                  {
                    courses[filters.department].map((course,index)=>
                    (
                      <option key={index} value={course}>{course}</option>
                    )
                  )}
              </select>
            )
          }

          <select className="filter-input" id="year" value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
            <option value="">Select Year</option>
            <option value="first">First</option>
            <option value="second">Second</option>
            <option value="third">Third</option>
          </select>

          <select className="filter-input" id="division" value={filters.division} onChange={(e) => setFilters({...filters, division: e.target.value})}>
            <option value="">Select Division</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>


        </div>

      <button className="report-btn" onClick={fetchTodayAttendance} disabled={loding["fetchTodayAttendance"]}>
        {loding["fetchTodayAttendance"] ? (
          <div className="spinner-grow text-danger" role="status">
              <span className="visually-hidden">loding...</span>
            </div>
        ):(
          <h6>📄 Generate Report</h6>  
        )}
      </button>
      
    </div>)}
    {event === "showmessage" && (
      <>
      <button className="close-btn" onClick={() => setevent("")}>
              <i className="bi bi-x-lg"></i>
            </button>
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
            {message}
               
          </h4>
          {url?.length > 0 && (
            <>
              <p className="text-sm text-gray-500 mb-2">Your Report Link:</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-words font-medium">
                {url.length > 35 ? url.slice(0, 35) + "..." : url}
              </a>
            </>
          )}
          </>
        
    )}

      {event === "showsubmitedattendance" && (
        <>
          <div className="attendance-header">
            <h5>Today's Attendance</h5>
            <button className="close-btn" onClick={() => setevent("showoptions")}>
              <i className="bi bi-x-lg"></i>
            </button>          
          </div>

          {subjects.length === 0 ? (
            <div className="empty-state">
              No attendance submitted today
            </div>
            ) : (
              <div className="card-grid">
                {subjects.map((item, index) => (
                  <div className="attendance-card" key={index}>
                    <h3>{item.subject}</h3>
                    <p className="status success">✔ Submitted</p>
                  </div>
                ))}
                <div className="report-action-container">
                  <button className="generate-report-btn" onClick={generateReport} disabled={loding["generateReport"]}>
                    {loding["generateReport"] ? (
                      <div className="spinner-grow text-danger" role="status">
                        <span className="visually-hidden">loding...</span>
                      </div>
                      
                    ):(
                      <h6>📄 Generate Report</h6>  
                    )}
                  </button>
                </div>
              </div>
              
            )
          }
        </>
        )}
    
  </div>
  );
}

export { MentorDashboardContent };