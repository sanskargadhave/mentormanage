import {useState} from "react";
import { GiveError,TypingEffect } from "../WarningOrSucess";
import "./mentor.css";
function ViewStudent() {
    const today = new Date().toISOString().split("T")[0];
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
        let url = `http://localhost:5000/api/get-studentdetails/${rollno}`;

        if (event === "bydate" && date) {
            url=url+`?date=${date}`;
        }
        else if (event === "byrange" && fromdate && todate) {
            url=url+`?fromdate=${fromdate}&todate=${todate}`;
        }

        try {
            const resp = await fetch(url);
        
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
        <div className="mentor-content">
            <div className="row animate__animated animate__zoomIn">
                <h5 className="carddemo"><i className="bi bi-search-heart"></i>  Enter Roll No For Searching </h5>
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(e)=>{setrollno(e.target.value)}}/><br/>
                    <button className="btn btn-outline-success lm" type="button" onClick={()=>{setevent("bydate")}}><i className="bi bi-search-heart"></i> Search On Date</button>
                    <button className="btn btn-outline-success lm" type="button" onClick={()=>{setevent("byrange")}}><i className="bi bi-search-heart"></i>  Search On Range</button>
                </form>
            </div>  
            <hr/>
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}
            {event==="bydate" && (
                <div className="data-card animate__animated animate__zoomIn">
                    <form className="d-flex" role="search">
                        <input type="date" className="form-control" value={date} max={today} onChange={(e)=>{setdate(e.target.value)}}/>
                        <button className="btn btn-outline-success lm" type="button" onClick={fetchrecord}><i className="bi bi-search-heart"></i>  Search</button>
                    </form>
                </div>
            )}
            {event==="byrange" && (
                <div className="data-card animate__animated animate__zoomIn">
                    <label className="effective lm"><i className="bi bi-calendar-heart-fill set-icon"></i> From :</label>
                    <label className="effective mm"><i className="bi bi-calendar-heart-fill set-icon "></i>  To :</label><br/>
                    <form className="d-flex" role="search">
                        <input type="date" className="form-control" value={fromdate} max={today} onChange={(e)=>{setfromdate(e.target.value)}}/>
                        <input type="date" className="form-control lm" value={todate} max={today} onChange={(e)=>{settodate(e.target.value)}}/>
                        <button className="btn btn-outline-success lm" type="button" onClick={fetchrecord}><i className="bi bi-search-heart"></i>Search</button>
                    </form>
                </div>
            )}
            {event==="showdata" && (
                    <div className="data-card animate__animated animate__zoomIn">
                        <div className="row">
                            <div className="col-md-12">
                                <label className="effective"><i className="bi bi-person-fill"></i>  Name : {data.personaldetails.name}</label>
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="effective"><i className="bi bi-card-heading"></i>  Roll No: {data.collagedetails.rollno}</label>
                            </div>
                            <div className="col-md-6">
                                <label className="effective"><i className="bi bi-mortarboard-fill"></i>  Class : {data.collagedetails.year}</label>
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="effective"><i className="bi bi-diagram-3-fill"></i>   Division : {data.collagedetails.division}</label>
                            </div>     
                            <div className="col-md-6">
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
                            <div className="col-md-12 table-card">
                                <h5 className="total">
                                    <i className="bi bi-tag-fill set-icon"></i>
                                    <TypingEffect key={data.personaldetails.name.split(" ")[1].toLowerCase()} text={`😎Lets See  How Loyal Was ${data.personaldetails.name.split(" ")[1].toLowerCase()} to the Classroom Attendance 🤔? `}/>
                                </h5>
                                {
                                    attendance.map((data, index) => (
                                    <div key={data._id || index} className="attendance-card mb-3 p-3 shadow-sm">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="fw-bold">
                                                <i className="bi bi-calendar-heart-fill set-icon "></i> {new Date(data._id).toLocaleDateString()}
                                            </h6>
                                            <div>
                                                <span className="badge bg-secondary me-4">
                                                    📚 {data.lecturecount}
                                                </span>

                                                <span className="badge bg-success me-4">
                                                    ✅ {data.presentcount}
                                                </span>

                                                <span className="badge bg-danger">
                                                    ❌ {data.absentcount}
                                                </span>
                                            </div>
                                        </div>
                                        {data.absentSubjects?.length > 0 ? (
                                            <div className="mt-2 ps-2 border-start border-danger">
                                                <small className="text-danger fw-semibold">
                                                    Absent Lectures:
                                                </small>

                                                {data.absentSubjects.map((subdata, ind) => (
                                                    <div key={ind} className="small text-muted">
                                                        • {subdata.subject} - Prof. {subdata.teacher}
                                                    </div>
                                                ))}
                                            </div>):
                                            <div className="mt-2 ps-2 border-start border-danger">
                                                <div className="small text-muted">
                                                    Present 🎉   
                                                </div>
                                            </div>

                                        }
                                        </div >))
                                    }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export {ViewStudent};