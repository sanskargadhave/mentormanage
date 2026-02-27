import { useEffect, useState } from "react";
import "animate.css";
import axios from "axios";
import "../admin component/admin.css";
import Select from "react-select";
import { GiveError } from "../WarningOrSucess";
import "./mentor.css";
import { useContext } from "react";
import { AuthContext } from "../Authintication";
export default function ShowAttendance({totalstudent,totalabsent,totalpresent,lectureid})
{
    const today = new Date().toISOString().split("T")[0];
    const [data, setData] = useState([]);
    const [counts,setcounts]=useState([]);
    const fetchData = async () => 
    {
        try 
        {
            const response = await axios.get(`http://localhost:5000/api/get-attendance/${lectureid}`);
            setData(response.data.result);
            setcounts(response.data.counts);
        } 
        catch (error) 
        {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchData();
      }, [lectureid]
    );
    return (
        <div className=" animate__animated animate__zoomIn">
            <div className="row">
                <div className="col-md-6">
                        <h5 className="total side">
                            <i className="bi bi-tag-fill set-icon"></i>
                           {lectureid}
                        </h5>
                    <div className="professional-card">
                        <h5 className="total">
                            <i className="bi bi-people-fill set-icon"></i>
                            Total students :  {totalstudent}
                        </h5>
                        <h5 className="total-present">
                            <i className="bi bi-check-circle-fill set-icon"></i>
                            Total Present :  {totalpresent}
                        </h5>
                        <h5 className="total-absent">
                            <i className="bi bi-x-circle-fill set-icon"></i>
                            Total Absent :  {totalabsent}
                        </h5>
                    </div>
                </div>
                <div className="col-md-6">
                    <h5 className="total side">
                        <i className="bi bi-tag-fill set-icon"></i>
                        Monthly Absent Count Report
                    </h5>
                    <div className="professional-card ">
                    {
                        data.length!==0 &&(
                        <h5 className="total">RollNo Total Status</h5> 
                    )}
                    {
                        data.length===0 ? 
                        (
                           <h5>Nothing else AnyOne Break EduMentor Rule 🎉</h5>
                        ): 
                        (
                            data.map((student,index)=>(
                                <div key={index} className="roll-item">
                                    <span className={student.totalabsent>5 ? "hint-item":"roll-item"}>{student.rollno}</span>
                                    <span className={student.totalabsent>5 ? "hint-item":"roll-item"}>{student.totalabsent}</span>
                                    <span className={student.totalabsent>5 ? "hint-item":"roll-item"}>{student.totalabsent>5 ?"🚫 Alert":"⭕ Normal"}</span>
                                </div>
                            ))
                        )
                    }
                    </div>
                </div>
            </div>
            <br/>
            <div className="row">
                <div className="col-md-12 table-card">
                     <h5 className="total">
                        <i className="bi bi-tag-fill set-icon"></i>
                       Today All Lectures Attendance | Date: {today}
                    </h5>
                    <table className="count-table">
                        <thead className="bor">
                            <tr>
                                <th>Class</th>
                                <th>Division</th>
                                <th>Subject</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Total</th>
                                <th>percentage</th>
                                <th>Submited Time </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                counts.map((data,index)=>{
                                    const total = data.presentcount + data.absentcount;
                                    const percentage = total > 0? ((data.presentcount / total) * 100).toFixed(2): 0;
                                    let Time = "";
                                    if (data.attendanceid) {
                                        const parts = data.attendanceid.split("-");
                                        if (parts.length === 2) {
                                            const timestamp = parts[1];
                                            const dateObj = new Date(Number(timestamp));
                                            Time = dateObj.toLocaleTimeString("en-IN", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        });
                                    }
                                    else if (parts.length === 3) {
                                        const timePart = parts[2];
                                        if (timePart && timePart.length === 4) {
                                            let hours = parseInt(timePart.substring(0, 2));
                                            let minutes = timePart.substring(2, 4);
                                            const ampm = hours >= 12 ? "PM" : "AM";
                                            hours = hours % 12 || 12;
                                            Time = `${hours}:${minutes} ${ampm}`;
                                        }
                                    }}

                                    return (
                                    <tr key={index}>
                                        <td className={percentage>=80?"data-table":"data-table-war"}>{data.Class}</td>
                                        <td className={percentage>=80?"data-table":"data-table-war"}>{data.division}</td>
                                        <td className={percentage>=80?"data-table":"data-table-war"}>{data.subject}</td>
                                        <td className={percentage>=80?"data-table":"data-table-war"}>{data.presentcount}</td>
                                        <td className={percentage>=80?"data-table":"data-table-war"}>{data.absentcount}</td>
                                        <td className={percentage>=80?"data-table":"data-table-war"}>{total}</td>
                                        <td className={percentage>=80?"data-table":"data-table-war"}>{percentage}%</td>
                                        <td className={percentage>=80?"data-table":"data-table-war"}>{Time}</td>
                                    </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AddAttendance() {
    const {id}=useContext(AuthContext);
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
        axios.get("http://localhost:5000/api/getlecture")
            .then((resp) => {
                setlecture(resp.data);
            })  
            .catch((err) => {setmessage(err.message);setshowerror(true)});
    }, []);

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
        fetch("http://localhost:5000/api/store-attendance",{
             method:"POST", 
                headers:{
                    "Content-Type":"application/json"
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
            axios.get(`http://localhost:5000/api/serach-student/${selected.value}`)
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
                    <div className="col-md-6">
                        <label className="form-label">
                            <i className="bi bi-person-vcard"></i> Select Lecture
                        </label>
                        <Select options={options} placeholder="Search and select lecture" maxMenuHeight={300} value={selected} onChange={setselected} isClearable/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i> Date </label>
                        <input type="date" className="form-control" value={date} max={today} onChange={(e) => setdate(e.target.value)}/>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-10">
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
                    <div className="col-md-4">
                        <button className="search-btn" onClick={searchstudent}>
                            <i className="bi bi-search"></i>
                            <span>Search Student</span>
                        </button>
                    </div>
                </div>
            </div>)}
            {step==="attendance" && (
            <div className="animate__animated animate__jackInTheBox ">
                <h5 className="absent-row">Lecture id :  {selected.value}</h5>
                <h5 className="absent-row">Date :  {date}</h5>
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
                        {studentdata.map((student)=>(
                              <tr key={student._id}  className={attendance[student.collagedetails.rollno] === "Absent"? "absent-row": "present-row"}>
                                <td>{student.collagedetails.rollno}</td>
                                <td>{student.personaldetails.name}</td>
                                <td>
                                    <label className="attendance-check">
                                        <input type="checkbox" checked={attendance[student.collagedetails.rollno] === "Present"} onChange={(e) => setStudentAttendance(student.collagedetails.rollno, e.target.checked)}/>
                                        <span className="box"></span>
                                    </label>
                                </td>
                                <td>{attendance[student.collagedetails.rollno]}</td>
                              </tr>   
                            ))
                        }
                    </tbody>        
                </table>
                <br/>
                <div className="row">
                    <div className="col-md-12">
                        <button className="search-btn" onClick={storeattendance}>
                            <i className="bi bi-folder-plus"></i>
                            <span>Add Attendance</span>
                        </button>
                    </div>
                </div>
            </div>)}
            {step==="summery" && (
                <ShowAttendance totalstudent={totalstudent} totalabsent={absent} totalpresent={present} lectureid={selected.value}/>
            )}
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}

        </div>
    );
}

export { AddAttendance };
