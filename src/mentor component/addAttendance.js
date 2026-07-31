import { useEffect, useState } from "react";
import "animate.css";
import axios from "axios";
import "../admin component/admin.css";
import Select from "react-select";
import { GiveError } from "../WarningOrSucess";
import "./mentor.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authintication";
import logo from "../collageassets/logo-college.png";
import axiosInstance from "../axiosInstance";
import { showToast } from "../utils/showToast";

export default function ShowAttendance({total,lectureid})
{
    const today = new Date().toISOString().split("T")[0];
    const token=localStorage.getItem("token");
    const [data, setData] = useState([]);
    const [loding,setloding]=useState(false);
    const [counts,setcounts]=useState([]);
    const fetchData = async () => 
    {
        try 
        {
            setloding(true);
            const response = await axiosInstance.get(`/common/get-attendance/${lectureid}`);

            setData(response.data.result);
            setcounts(response.data.counts);
        } 
        catch (error) 
        {
            console.error(error.message);
        }
        finally
        {
            setloding(false);
        }
    };
    useEffect(() => {
    if(lectureid && token){
        fetchData();
    }
}, [lectureid, token]);
    return (
        <div className="animate__animated animate__zoomIn">
            <div className="attendance-header">

                <div className="header-top">
                    <img src={logo} alt="logo" className="header-logo" />
                    <h4 className="college-name">SANGOLA MAHAVIDYALAYA SANGOLA</h4>
                </div>
 
                <div className="header-info">

                    <div className="info-box">
                        <span className="label">Lecture ID</span>
                        <span className="value">{lectureid}</span>
                    </div>

                    <div className="info-box">
                        <span className="label">Date</span>
                        <span className="value">{today}</span>
                    </div>

                    <div className="info-box">
                        <span className="label">Total Students</span>
                        <span className="value">{total.totalStudents}</span>
                    </div>

                    <div className="info-box">
                        <span className="label">Present</span>
                        <span className="value text-success">{total.presentStudents}</span>
                    </div>

                    <div className="info-box">
                        <span className="label">Absent</span>
                        <span className="value text-danger">{total.absentStudents}</span>
                    </div>

                    <div className="info-box">
                        <span className="label">Percentage</span>
                        <span className="value">
                        {total.attendancePercentage}%
                        </span>
                    </div>

                </div>
            </div>
            {data.length===0 
                ? (<h5></h5>)
                : (
                    <div className="mobile-report">
                    <br/>
                        {data.map((student,index)=>(
                            <div key={index} className="report-card">
                                <p><strong>Roll No: </strong>{student.rollno}</p>
                                <p><strong>Absents: </strong>{student.totalabsent}</p>
                                <p><strong>Status: </strong>{""}
                                    {student.totalabsent>5 ? "🚫Alert" : "⭕Normal"}
                                </p>
                            </div>
                        ))}
                    </div>
                )
            }<br/>
            <div className="completed-section-session">

                <div className="completed-header-session">

                    <div>
                        <h4>📚 Today's Completed Sessions</h4>
                        <p>  Every completed lecture contributes to students' academic success. </p>
                    </div>

                    <span className="completed-count-session">
                        {counts.length} Sessions
                    </span>

                </div>

                <div className="completed-grid-session">

                    {counts.map((item, index) => {

                        const total = item.presentcount + item.absentcount;

                        const percentage =
                            total === 0
                                ? 0
                                : ((item.presentcount / total) * 100).toFixed(1);

                        return (

                            <div className="completed-card-session" key={index}>

                                <div className="completed-title-session">

                                    <div className="subject-info">

                                        <div className="subject-icon">
                                            📚
                                        </div>

                                        <div>

                                            <h5>{item.subject}</h5>

                                            <small>Lecture Successfully Completed</small>

                                        </div>

                                    </div>

                                    <span className="completed-status-session">
                                        <i className="bi bi-check-circle-fill"></i>
                                        Completed
                                    </span>

                                </div>

                                <div className="completed-info-session">

                                    <span>
                                        🏫   {item.department}
                                    </span>
                                    <span>
                                        🏷   Course {item.course}
                                    </span>
                                    <span>
                                        🎓 {item.Class} Year
                                    </span>

                                    <span>
                                        🏷   Division {item.division}
                                    </span>

                                    

                                </div>

                                <div className="attendance-box-session">

                                    <div>

                                        <small>Present</small>

                                        <h4>{item.presentcount}</h4>

                                    </div>

                                    <div>

                                        <small>Absent</small>

                                        <h4>{item.absentcount}</h4>

                                    </div>

                                    <div>

                                        <small>Total</small>

                                        <h4>{total}</h4>

                                    </div>

                                </div>

                                <div className="progress-head-session">

                                    <span>Attendance</span>

                                    <strong>{percentage}%</strong>

                                </div>

                                <div className="progress-session">

                                    <div
                                        className="progress-fill-session"
                                        style={{
                                            width: `${percentage}%`
                                        }}
                                    />

                                </div>

                                <div className="lecture-id-session">

                                    🆔 {item.attendanceid}

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>
        </div>
    );
}

function AddAttendance() {
    const {id,token}=useContext(AuthContext);
    const today = new Date().toISOString().split("T")[0];
    const nevigate=useNavigate();
    const [selected, setselected] = useState(null);
    const [lecture, setlecture] = useState([]);
    const [date,setdate]=useState(today);
    const [showerror,setshowerror]=useState(false);
    const [message,setmessage]=useState("");
    const [studentdata,setstudentdata]=useState([]);
    const [attendance, setAttendance] = useState({});
    const [total, settotal] = useState({});
    const [step,setstep]=useState("search");
    const [present,setpresent]=useState("");
    const [absent,setabsent]=useState("");
    const [loding,setloding]=useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

useEffect(() => {
    if (studentdata.length === 0) return;

    const initial = {};

    studentdata.forEach(student => {
        initial[student.collagedetails.rollno] = {
            status: "Present",
            studentId: student._id,
        };
    });

    setAttendance(initial);
}, [studentdata]);

    useEffect(() => {
        if(!token) return;
        async function getlecture()
        {
            try{
                const resp=await axiosInstance.get("/common/getlecture");
                setlecture(resp.data);
            }
            catch(err)
            {
                console.log(err.message);
            }
        }
        getlecture();
    }, [token]);

    const options = lecture.map((s) => ({
        value: s.lectureid,
        label: `${s.lectureid} | Subject: ${s.subject}`
    }));

    const setStudentAttendance = (rollno, status) => {
    setAttendance(prev => ({
        ...prev,
        [rollno]: {
            ...prev[rollno],
            status,
        },
    }));
};
    async function storeattendance()
    {
        const totalstudent=Object.keys(attendance).length;
        const totalabsent = Object.values(attendance).filter(status => status === "Absent").length;

        const totalpresent = Object.values(attendance).filter(status => status === "Present").length;
        const attendanceArray = Object.entries(attendance).map(
    ([rollno, value]) => ({
        rollno,
        status: value.status,
        studentId: value.studentId,
    })
);  
        try{
            setloding(true);
            const resp=await axiosInstance.post("/common/store-attendance",{date:date,lectureid:selected.value,attendance:attendanceArray,submitedby:id});
            settotal(resp.data.total);
            setstep("summery");
            if(resp.data.success) showToast.success(resp.data.message);

        }
        catch(err)
        {
            console.log(err.message);
        }
        finally{
            setloding(false);
        }
    }

    async function searchstudent() 
    {
        if(!selected)
        {
            return showToast.warning("Please Select Lecture First");
        }
        else{
            try{
                setloding(true);
                const resp=await axiosInstance.get(`/mentor/serach-student/${selected.value}`);
                setstudentdata(resp.data.students);
                setstep("attendance");
            }
            catch(err)
            {
                console.log(err.message);
            }
            finally{
                setloding(false);
            }
        }
    }
    
    return (
        <div className="admin-content">
            {step==="search" && (
            <div className="add-student-form animate__animated animate__slow animate__fadeInDown">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <label className="form-label">
                            <i className="bi bi-person-vcard"></i> Select Lecture
                        </label>
                        <Select options={options} placeholder="Search and select lecture" maxMenuHeight={300} value={selected} onChange={setselected} isClearable/>
                    </div>
                    <div className="col-12 col-md-4">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i> Date </label>
                        <input type="date" className="form-control" value={date} max={today} onChange={(e) => setdate(e.target.value)}/>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-12 col-md-10">
                        {selected && 
                        (
                            <div className="mt-3 text-success">
                            Selected Lecture ID: <b>{selected.value}</b>
                        </div>
                        )}
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-12 col-md-4">
                        {!loding && (
                        <button className="search-btn" onClick={searchstudent}>
                                <i className="bi bi-search"></i>
                           <span> Search Student</span>
                        </button>)}
                        {loding && (
                        <button className="search-btn" >
                            <div className="spinner-grow text-danger" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </button>)}
                    </div>
                </div>
            </div>)}
           {step === "attendance" && (
            <div className="animate__animated animate__jackInTheBox">
                <div className="attendance-header">

                    <div className="header-top">
                        <img src={logo} alt="logo" className="header-logo" />
                            <h4 className="college-name">SANGOLA MAHAVIDYALAYA SANGOLA</h4>
                    </div>

                    <div className="header-info">

                        <div className="info-box">
                            <span className="label">Lecture ID</span>
                            <span className="value">{selected.value}</span>
                        </div>

                        <div className="info-box">
                            <span className="label">Subject</span>
                            <span className="value">{selected.value.split("-")[1]}</span>
                        </div>

                        <div className="info-box">
                            <span className="label">Date</span>
                            <span className="value">{date}</span>
                        </div>

                        <div className="info-box">
                            <span className="label">Total Students</span>
                            <span className="value">{studentdata.length}</span>
                        </div>

                    </div>
                </div>
                
                <div className="mobile-attendance">
                    {studentdata.map((student) => (
                        <div key={student._id} className="student-cardss">

                            <div className="student-infoaa">
                                <strong>Roll: {student.collagedetails.rollno}</strong>
                                <p>{student.personaldetails.name}</p>
                            </div>

                            <div className="attendance-buttonsw">
                                <button className={ attendance[student.collagedetails.rollno]?.status === "Present" ? "active-present" : ""} onClick={() => setStudentAttendance(student.collagedetails.rollno,"Present" )}>
                                    Present
                                </button>

                                <button className={ attendance[student.collagedetails.rollno]?.status === "Absent" ? "active-absent" : ""} onClick={() => setStudentAttendance( student.collagedetails.rollno, "Absent")}>
                                    Absent
                                </button>
                            </div>

                        </div>
                        ))}
                    </div>
                
    

   
    <br />
    {!loding && (
        <button className="search-btn" onClick={storeattendance}>
            <i className="bi bi-search"></i>
            <span>Add Attendance</span>
        </button>
    )}
    {loding && (
        <button className="search-btn" >
            <div className="spinner-grow text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </button>
    )}
            
   
  </div>
)}
            {step==="summery" && (
                <ShowAttendance total={total} lectureid={selected.value}/>
            )}
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}

        </div>
    );
}

export { AddAttendance };
