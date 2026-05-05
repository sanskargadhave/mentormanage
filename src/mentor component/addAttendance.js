import { useEffect, useState } from "react";
import "animate.css";
import axios from "axios";
import "../admin component/admin.css";
import Select from "react-select";
import { GiveError } from "../WarningOrSucess";
import "./mentor.css";
import { useContext } from "react";
import { AuthContext } from "../Authintication";
import logo from "../collageassets/logo-college.png";
export default function ShowAttendance({totalstudent,totalabsent,totalpresent,lectureid})
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
            const response = await axios.get(`https://sangolacollage.onrender.com/api/common/get-attendance/${lectureid}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setData(response.data.result);
            setcounts(response.data.counts);
        } 
        catch (error) 
        {
            console.error(error);
        }
    };
    useEffect(() => {
        if(!token) return;
        fetchData();
      }, [lectureid,token]
    );
    return (
        <div className="admin-content animate__animated animate__zoomIn">
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
                        <span className="value">{totalstudent}</span>
                    </div>

                    <div className="info-box">
                        <span className="label">Present</span>
                        <span className="value text-success">{totalpresent}</span>
                    </div>

                    <div className="info-box">
                        <span className="label">Absent</span>
                        <span className="value text-danger">{totalabsent}</span>
                    </div>

                    <div className="info-box">
                        <span className="label">Percentage</span>
                        <span className="value">
                        {totalstudent > 0
                            ? ((totalpresent / totalstudent) * 100).toFixed(2)
                            : 0}%
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
            <div className="mobile-summary">
                <h6>Completed Sessions – Daily Overview</h6>
                {counts.map((data, index) => {
                const total = data.presentcount + data.absentcount;
                const percentage = total > 0 ? ((data.presentcount / total) * 100).toFixed(2) : 0;

                return (
                    <div key={index} className="summary-card">
                        <p><strong>Class:</strong> {data.Class}</p>
                        <p><strong>Division:</strong> {data.division}</p>
                        <p><strong>Subject:</strong> {data.subject}</p>
                        <p>Present: {data.presentcount}</p>
                        <p>Absent: {data.absentcount}</p>
                        <p>Total: {total}</p>
                        <p>Percentage:{" "}
                            <span className={percentage >= 80 ? "good" : "bad"}>
                                {percentage}%
                            </span>
                        </p>
                    </div>
                );})}
            </div>
        </div>
    );
}

function AddAttendance() {
    const {id,token}=useContext(AuthContext);
    const today = new Date().toISOString().split("T")[0];

    const [selected, setselected] = useState(null);
    const [lecture, setlecture] = useState([]);
    const [date,setdate]=useState(today);
    const [showerror,setshowerror]=useState(false);
    const [message,setmessage]=useState("");
    const [studentdata,setstudentdata]=useState([]);
    const [attendance, setAttendance] = useState({});
    const [totalstudent, settotalstudent] = useState(0);
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

    useEffect(() => 
    {
        if (studentdata.length === 0) return;

        const initial = {};
        studentdata.forEach(student => {
            initial[student.collagedetails.rollno] = "Present";
        });
        setAttendance(initial);
    }, [studentdata]);


    useEffect(() => {
        if(!token) return;
        axios.get("https://sangolacollage.onrender.com/api/common/getlecture",{
             headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
                setlecture(resp.data);
            })  
            .catch((err) => {setmessage(err.message);setshowerror(true)});
    }, [token]);

    const options = lecture.map((s) => ({
        value: s.lectureid,
        label: `${s.lectureid} | Subject: ${s.subject}`
    }));

    const setStudentAttendance = (rollno, isabsent) => 
    {
        setAttendance(prev => ({
            ...prev,
            [rollno]: isabsent ? "Present" : "Absent"
        }));
    };
    function storeattendance()
    {
        const totalstudent=Object.keys(attendance).length;
        const totalabsent = Object.values(attendance).filter(status => status === "Absent").length;

        const totalpresent = Object.values(attendance).filter(status => status === "Present").length;
        const attendanceArray = Object.entries(attendance).map(([rollno, status]) => 
        ({
            rollno,
            status
        }))
        fetch("https://sangolacollage.onrender.com/api/teacher/store-attendance",{
             method:"POST", 
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                },
                body:JSON.stringify({
                    date:date,
                    lectureid:selected.value,
                    attendance:attendanceArray,
                    submitedby:id
                })
        }).then((resp)=>resp.json())
        .then((data)=>{
         settotalstudent(totalstudent);
         setpresent(totalpresent);
         setabsent(totalabsent);
         setstep("summery");
        })
        .catch((err)=>{setmessage(err.message);setshowerror(true)})
    }

    function searchstudent() 
    {
        if(!selected)
        {
            setmessage("Please Select Lecture First");
            setshowerror("true");
        }
        else{
            axios.get(`https://sangolacollage.onrender.com/api/mentor/serach-student/${selected.value}`,{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((resp) => {
            setstudentdata(resp.data);
            })
            .catch((err) => {setmessage(err.message);setshowerror(true)});
            setstep("attendance")    
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
                        <button className="search-btn" onClick={searchstudent}>
                            <i className="bi bi-search"></i>
                            <span>Search Student</span>
                        </button>
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
                {isMobile ? (
                <div className="mobile-attendance">
                    {studentdata.map((student) => (
                        <div key={student._id} className="student-card">

                            <div className="student-info">
                                <strong>Roll: {student.collagedetails.rollno}</strong>
                                <p>{student.personaldetails.name}</p>
                            </div>

                            <div className="attendance-buttons">
                                <button className={ attendance[student.collagedetails.rollno] === "Present" ? "active-present" : ""} onClick={() => setStudentAttendance(student.collagedetails.rollno, true)}>
                                    Present
                                </button>

                                <button className={ attendance[student.collagedetails.rollno] === "Absent" ? "active-absent" : ""} onClick={() => setStudentAttendance(student.collagedetails.rollno, false)}>
                                    Absent
                                </button>
                            </div>

                        </div>
                        ))}
                    </div>
                ) : (
    
                    <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Student Name</th>
                            <th>Click For P/A</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentdata.map((student) => (
                        <tr
                            key={student._id}
                            className={
                            attendance[student.collagedetails.rollno] === "Absent"
                            ? "absent-row"
                            : "present-row"
                        }
            >
              <td>{student.collagedetails.rollno}</td>
              <td>{student.personaldetails.name}</td>
              <td>
                <label className="attendance-check">
                  <input
                    type="checkbox"
                    checked={
                      attendance[student.collagedetails.rollno] === "Present"
                    }
                    onChange={(e) =>
                      setStudentAttendance(
                        student.collagedetails.rollno,
                        e.target.checked
                      )
                    }
                  />
                  <span className="box"></span>
                </label>
              </td>
              <td>{attendance[student.collagedetails.rollno]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

   
    <br />
    <button className="search-btn" onClick={storeattendance}>
      Add Attendance
    </button>
  </div>
)}
            {step==="summery" && (
                <ShowAttendance totalstudent={totalstudent} totalabsent={absent} totalpresent={present} lectureid={selected.value}/>
            )}
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}

        </div>
    );
}

export { AddAttendance };
