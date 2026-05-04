import {useState} from "react";
import { GiveError,TypingEffect } from "../WarningOrSucess";
import "./mentor.css";
import "../admin component/admin.css";
function ViewStudent() {
    const today = new Date().toISOString().split("T")[0];
    const token=localStorage.getItem("token");
    const [data,setdata]=useState();
    const [rollno,setrollno]=useState("");
    const [showerror,setshowerror]=useState(false);
    const [event,setevent]=useState("");
    const [message,setmessage]=useState("");
    const [attendance,setattendance]=useState([]);
    const [date,setdate]=useState(today);
    const [fromdate,setfromdate]=useState(today);
    const [todate,settodate]=useState(today);
    
    const fetchrecord = async () => {
        if(!rollno.trim()) 
        {
            setmessage("Please Enter Roll No.....");
            setshowerror(true);
            return;
        }
        let url = `https://sangolacollage.onrender.com/api/mentor/get-studentdetails/${rollno}`;

        if (event === "bydate" && date) {
            url=url+`?date=${date}`;
        }
        else if (event === "byrange" && fromdate && todate) {
            url=url+`?fromdate=${fromdate}&todate=${todate}`;
        }

        try {
            const resp = await fetch(url,{
             headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
            if(resp.status === 404) {
                const errorData = await resp.json();
                setmessage(errorData.message || "Student Not Found");
                setshowerror(true);
                setevent("");
                return;
            }

            const result = await resp.json();
            setdata(result.student);
            setattendance(result.attendance);
            setevent("showdata");
        }
        catch(err) {
            setmessage(err.message);
            setshowerror(true);
        }
    }
    return (
        <div className="admin-content">
            <div className="row animate__animated animate__zoomIn">
                <h5 className="carddemo"><i className="bi bi-search-heart"></i>  Enter Roll No For Searching </h5>
                <form className="d-flex flex-wrap gap-2" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(e)=>{setrollno(e.target.value)}}/><br/>
                    <button className="btn btn-outline-success lm" type="button" onClick={()=>{setevent("bydate")}}><i className="bi bi-search-heart"></i> Search On Date</button>
                    <button className="btn btn-outline-success lm" type="button" onClick={()=>{setevent("byrange")}}><i className="bi bi-search-heart"></i>  Search On Range</button>
                </form>
            </div>  
            <hr/>
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}
            {event==="bydate" && (
                <div className="data-card animate__animated animate__zoomIn">
                    <form className="d-flex flex-wrap gap-2" role="search">
                        <input type="date" className="form-control" value={date} max={today} onChange={(e)=>{setdate(e.target.value)}}/>
                        <button className="btn btn-outline-success lm" type="button" onClick={fetchrecord}><i className="bi bi-search-heart"></i>  Search</button>
                    </form>
                </div>
            )}
            {event==="byrange" && (
                <div className="data-card animate__animated animate__zoomIn">
                    <label className="effective lm"><i className="bi bi-calendar-heart-fill set-icon"></i> From :</label>
                   <form className="d-flex flex-wrap gap-2" role="search">
                        <input type="date" className="form-control" value={fromdate} max={today} onChange={(e)=>{setfromdate(e.target.value)}}/>
                        <label className="effective lm"><i className="bi bi-calendar-heart-fill set-icon "></i>  To :</label>
                        <input type="date" className="form-control lm" value={todate} max={today} onChange={(e)=>{settodate(e.target.value)}}/>
                        <button className="btn btn-outline-success lm" type="button" onClick={fetchrecord}><i className="bi bi-search-heart"></i>Search</button>
                    </form>
                </div>
            )}
            {event==="showdata" && (
                    <div className="data-card animate__animated animate__zoomIn">
                        <div className="row">
                            <div className="col-12 col-md-12">
                                <label className="effective"><i className="bi bi-person-fill"></i>  Name : {data.personaldetails.name}</label>
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <label className="effective"><i className="bi bi-card-heading"></i>  Roll No: {data.collagedetails.rollno}</label>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="effective"><i className="bi bi-mortarboard-fill"></i>  Class : {data.collagedetails.year}</label>
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <label className="effective"><i className="bi bi-diagram-3-fill"></i>   Division : {data.collagedetails.division}</label>
                            </div>     
                            <div className="col-12 col-md-6">
                                <label className="effective"><i className="bi bi-phone-fill"></i>  Phone No : {data.personaldetails.mobileno}</label>
                            </div>                   
                        </div>
                    </div>        
            )}
            {
                event==="showdata" && (
                    <div className="animate__animated animate__zoomIn">
                        <br/>
                        <div className="row">
                            <div className="col-12 col-md-12 table-card">
                                <h5 className="total">
                                    <i className="bi bi-tag-fill set-icon"></i>
                                    <TypingEffect key={data.personaldetails.name.split(" ")[1].toLowerCase()} text={`😎Lets See  How Loyal Was ${data.personaldetails.name.split(" ")[1].toLowerCase()} to the Classroom Attendance 🤔? `}/>
                                </h5>
                                {
                                    attendance.map((data, index) => (
                                      <div key={data._id || index} className={`attendance-card premium-card ${data.absentcount > 0 ? "danger" : "success"}`}>
                                        <div className="card-header-row">
                                            <h6 className="date">
                                                <i className="bi bi-calendar-heart-fill set-icon"></i>
                                                {new Date(data._id).toLocaleDateString()}
                                            </h6>

                                            <span className={`status-badge ${data.absentcount > 0 ? "bad" : "good"}`}>
                                                {data.absentcount > 0 ? "⚠️ Warning" : "✅ Perfect"}
                                            </span>
                                        </div>

  
                                        <div className="card-stats">
                                            <div className="stat-box total">
                                                📚 <span>{data.lecturecount}</span>
                                            </div>

                                            <div className="stat-box present">
                                                ✅ <span>{data.presentcount}</span>
                                            </div>

                                            <div className="stat-box absent">
                                                ❌ <span>{data.absentcount}</span>
                                            </div>
                                        </div>

                                        {(() => {
                                            const percentage = data.lecturecount > 0
                                                ? ((data.presentcount / data.lecturecount) * 100).toFixed(0)
                                                : 0;

                                                return (
                                                    <div className="progress-container">
                                                        <div className="progress-bar">
                                                            <div className={`progress-fill ${percentage >= 75 ? "good" : "bad"}`} style={{ width: `${percentage}%` }}></div>
                                                        </div>
                                                        <small>{percentage}% Attendance</small>
                                                    </div>
                                                );
                                        })()}
                                        {data.absentSubjects?.length > 0 ? (
                                            <div className="absent-section">
                                                <small>Absent Lectures:</small>
                                                {data.absentSubjects.map((subdata, ind) => (
                                                    <div key={ind} className="absent-item">
                                                        • {subdata.subject} - {subdata.teacher}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                        <div className="present-msg">🎉 Full Attendance</div>
                                        )}

                                    </div>  
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export {ViewStudent};