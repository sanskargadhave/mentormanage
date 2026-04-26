import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import "./mentor.css";

function MentorDashboardContent() {
  const { id } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loding,setloding]=useState(false);
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


  useEffect(() => {
    async function getNotifications() {
      try {
        setloding(true);
        const resp = await axios.get(`https://sangolacollage.onrender.com/api/get-notifications/${id}`);
        //const resp=await axios.get(`http://localhost:3000/api/get-notifications/${id}`);
        const sorted = resp.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
        setloding(false);
      } catch (err) {
        console.error("Error fetching stored notifications", err);
      }
    }
    getNotifications();
  }, [id]);

  useEffect(() => {
  if (id) {
    socket.emit("join_room", {
      userid: id,
      role: "Mentor"
    });
  }
}, [id]);

  useEffect(() => {
    const handleNotification = (data) => {
      if (data.receiverid === id) {
        
        setNotifications((prev) => [data, ...prev]);
      }
    };
    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [id]);

  async function giveapprove(studentid)
  {
    try{
      const resp=await axios.put(`https://sangolacollage.onrender.com/api/give-approve/${studentid}`);
      
      setNotifications((prev)=>prev.filter((notif)=> notif.data.id !== studentid));
    }
    catch(err){
      console.log("error at Give Approve",err);
    }
  }
  async function givereject(studentid)
  {
    try{
      const resp=await axios.put(`https://sangolacollage.onrender.com/api/give-reject/${studentid}`);
      setNotifications((prev)=>prev.filter((notif)=> notif.data.id !== studentid));
    }
    catch(err){
      console.log("error at Give reject",err);
    }
  }
  const fetchTodayAttendance = async () => {
    try {

      if (!filters.department || !filters.course || !filters.year || !filters.division) {
        alert("Please select all filters");
        return;
      }
      const res = await fetch(`https://sangolacollage.onrender.com/api/get-today-attendance?department=${filters.department}&course=${filters.course}&year=${filters.year}&division=${filters.division}`);
      const data = await res.json();

      setSubjects(data.completeLecture);
      setevent("showsubmitedattendance");
    } 
    catch (err) {
      console.log(err);
    }
  };
  const generateReport=async ()=>{
    try{
      setloding(true);
      const res=await fetch(`https://sangolacollage.onrender.com/api/make-attendance-report?department=${filters.department}&course=${filters.course}&year=${filters.year}&division=${filters.division}`);
      const result=await res.json();
      setmessage(result.message);
      seturl(result.url);
      setloding(false);
      setevent("showmessage");
    }
    catch(err)
    {
      console.log(err);
      setevent("showmessage");
    }

  }

  return (
    <div className="admin-content">
      

      <h5 className="panel-title">

        <div className="title-left">
          <i className="fa fa-bell notification-icon"></i>
          <span className="title-text">Registered Students</span>
          <span className="notification-badge">
            {notifications.length}
          </span>
        </div>
        <div className="notification-wrapper">
          <i className="fa fa-bell notification-icon"></i>

          {notifications.length > 0 && (
            <span className="notification-count">
              {notifications.length}
            </span>
          )}
        </div>
        <div className="title-right">

          {show ? (
            <button className="hide-btn" onClick={() => setshow(false)}>
              Hide
            </button>
          ) : (
          <button className="show-btn" onClick={() => setshow(true)}>
            Show
          </button>)}

        </div>

      </h5>
    {show && (
    <div className="notifications-panel">
      {loding && (
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {notifications.length === 0 ? (
        <p className="no-notifications">No Student Registered yet</p>
      ) 
       :(
        <div className="notifications-list">
          
          {notifications.map((notif) => (
            <div key={notif._id} className={`notification-card ${!notif.read ? "unread" : ""}`}>
              <div className="notification-header">
                <span className="notification-type">New Student Registered Verify </span>
                <span className="notification-time">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="notification-message"><span className="badge rounded-pill bg-success">{notif.message}</span></div>
              <div className="notification-details">
                <h6><strong>Name:</strong> {notif.data.name}</h6>
                <h6><strong>Department:</strong> {notif.data.department}</h6>
                <h6><strong>Course:</strong>  {notif.data.course}</h6>
                <h6><strong>Year:</strong>  {notif.data.year}</h6>
                <h6><strong>Division:</strong>  {notif.data.division}</h6>
                <div className="verify-parent-number">
                  <span className="badge rounded-pill bg-warning text-dark">
                    Please Verify This Parent Whatsapp No
                  </span>
                  <p>
                    <strong>Parent Whatsapp No:</strong>  {notif.data.parentno}
                  </p>
                </div>
                <p><strong>Student Mobile No:</strong>  {notif.data.mobileno}</p>
              </div>
              <div className="notification-actions">
                <a href={`tel:${notif.data.parentno}`}> 
                    <button className="call-btn">
                      <i className="bi bi-telephone-fill"></i> Call 
                    </button>
                </a>
                <button className="approve-btn" onClick={()=>{giveapprove(notif.data.id)}}>
                  <i className="bi bi-check-lg"></i>
                </button>

                <button className="reject-btn" onClick={()=>{givereject(notif.data.id)}}>
                  <i className="bi bi-x-lg"></i>
                </button>

                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>)}
    {event === "" && (
      <button className="report-btn" onClick={()=>{setevent("showoptions")}}>
        <i className="fa fa-chart-bar"></i>
        Uplode Today Attendance Report
      </button>)}

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

      <button className="report-btn" onClick={fetchTodayAttendance}>
        <i className="fa fa-chart-bar"></i>
        Generate Report
      </button>
      
    </div>)}
    {event=== "showmessage" && (
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 text-center border">
        <h2 className="text-xl font-semibold text-gray-800">
          {message}
        </h2>
        <div class="bg-gray-100 rounded-lg p-2 mt-4 text-sm text-gray-700 break-all">
          {url}
        </div>
      </div>
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
                  <button className="generate-report-btn" onClick={generateReport} disable={loding}>
                    {!loding && (
                      <h6>📄 Generate Report</h6>
                    )}
                    {loding && (
                    <div className="spinner-grow text-danger" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>)}
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