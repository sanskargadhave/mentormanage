import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import { useNavigate } from "react-router-dom";
import "./mentor.css";
import React, { Fragment } from "react";
function MentorDashboardContent() {

    const [reportType,setReportType]=useState("oneday");
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [event,setevent]=useState("preview");
    const {token}=useContext(AuthContext);
    const [reports,setreports]=useState([]);
    const [formdata,setformdata]=useState({
    Date: new Date().toISOString().split("T")[0],
    Department:"",
    FromDate:"",
    ToDate:"",
    Class:"",
    Year:"",
    Division:""
  })

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

  function handleChange(e)
  {
    
    const { name, value } = e.target;
    setformdata({ ...formdata, [name]: value });
  }

  async function getpreview()
  {
    try{
        
        const resp=await axios.post("https://sangolacollage.onrender.com/api/mentor/give-preview-report",formdata,{
            headers: {
                Authorization: `Bearer ${token}`,
            }       
        })
        console.log(resp.data);
        setreports(resp.data);
    }
    catch(err)
    {
        console.log(err.message);
        alert(err.message);
    }
  }
  async function generateReport()
  {
    try{
        
        const resp=await axios.post("https://sangolacollage.onrender.com/api/mentor/make-attendance-report",reports.cacheId,{
            headers: {
                Authorization: `Bearer ${token}`,
            }       
        })
        console.log(resp.data);
        
    }
    catch(err)
    {
        console.log(err.message);
        alert(err.message);
    }
  }
  const handleViewAttendance = (rollno) => {

    if (expandedStudent === rollno) {
        setExpandedStudent(null);
    } else {
        setExpandedStudent(rollno);
    }

};

  return (
    <div>   
        
        <div className="report-page">
            <div className="report-type">

    <button
        className={`type-btn ${reportType==="oneday" ? "active" : ""}`}
        onClick={()=>setReportType("oneday")}
    >
        <i className="bi bi-calendar-day me-2"></i>

       Daily Report
    </button>

    <button
        className={`type-btn ${reportType==="multiday" ? "active" : ""}`}
        onClick={()=>setReportType("multiday")}
    >
        <i className="bi bi-calendar-range me-2"></i>

        Multi Day
    </button>

</div>

            <div className="container-fluid">

                {/* Header */}

                <div className="report-header">

                    <span className="report-tag">
                        📄 Attendance Report
                    </span>
                  {reportType==="multiday" ? (
                    <h2>Generate Multi-Day Attendance Report</h2>
                  ):(
                    <h2> Generate Daily Attendance Report</h2>
                  )}

                    <p>
                        Select class details and date range to preview attendance
                        before exporting PDF or Excel.
                    </p>

                </div>

                {/* Filter Card */}

                <div className="report-filter-card">

                    <div className="filter-title">

                        <i className="bi bi-funnel-fill"></i>

                        Report Filters

                    </div>

                    <div className="row g-3">

                        {/* Department */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="form-group">

                                <label>
                                    <i className="bi bi-building me-2"></i>
                                    Department
                                </label>

                                <select className="form-control" value={formdata.Department} name="Department" onChange={handleChange}>

                                    <option>Select Department</option>
                                    <option>ComputerScience</option>
                                    <option>Art</option>
                                    <option>Science</option>
                                    <option>Commerce</option>

                                </select>

                            </div>

                        </div>

                        {/* Course */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="form-group">

                                <label>
                                    <i className="bi bi-book me-2"></i>
                                    Course
                                </label>

                                {formdata.Department && 
                        (
                            <select value={formdata.Department} className="form-control" name="Class" value={formdata.Course} onChange={handleChange}>
                                <option value="">select Course</option>
                                {
                                    courses[formdata.Department].map((course,index)=>
                                    (
                                    <option key={index}>{course}</option>
                                    )
                                )}
                            </select>
                        )}

                            </div>

                        </div>

                        {/* Year */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="form-group">

                                <label>
                                    <i className="bi bi-calendar-event me-2"></i>
                                    Year
                                </label>

                                <select className="form-control" value={formdata.Year} name="Year" onChange={handleChange}>

                                    <option>Select Year</option>
                                    <option value="first">First Year</option>
                                    <option value="second">Second Year</option>
                                    <option value="third">Third Year</option>

                                </select>

                            </div>

                        </div>

                        {/* Division */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="form-group">

                                <label>
                                    <i className="bi bi-people-fill me-2"></i>
                                    Division
                                </label>

                                <select className="form-control" value={formdata.Division} name="Division" onChange={handleChange}>

                                    <option>Select Division</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>

                            </div>

                        </div>

                        {/* From Date */}
                        {reportType === "multiday" ? (<>
                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="form-group">

                                <label>
                                    <i className="bi bi-calendar-check me-2"></i>
                                    From Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control" value={formdata.FromDate} name="FromDate" onChange={handleChange}
                                />

                            </div>

                        </div>

                       

                        <div className="col-12 col-md-6 col-lg-4">

                            <div className="form-group">

                                <label>
                                    <i className="bi bi-calendar2-week me-2"></i>
                                    To Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control" value={formdata.ToDate} name="ToDate" onChange={handleChange}
                                />

                            </div>

                        </div></>):(
                          <div className="col-12 col-md-6 col-lg-4">

                            <div className="form-group">

                                <label>
                                    <i className="bi bi-calendar-check me-2"></i>
                                   Select Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control"  value={formdata.Date} name="Date" onChange={handleChange}
                                />

                            </div>

                        </div>

                        )}

                    </div>

                    {/* Buttons */}

                    <div className="filter-buttons">

                        <button className="btn-reset">

                            <i className="bi bi-arrow-clockwise me-2"></i>

                            Reset

                        </button>

                        <button className="btn-generate" onClick={()=>getpreview()}>

                            <i className="bi bi-search me-2"></i>

                            Preview Report

                        </button>

                    </div>

                </div>

                
            </div>

        </div>
        {/* ================= Preview Section ================= */}
    {event==="preview" && (
    <div className="report-preview">

    {/* Top */}

    <div className="preview-header">

        <div>

            <h3>
                <i className="bi bi-bar-chart-fill"></i>
                Attendance Report Preview
            </h3>

            <p>
                Review attendance before generating PDF or Excel.
            </p>

        </div>

        <div className="preview-actions">

            <button className="btn-export excel">

                <i className="bi bi-file-earmark-excel-fill"></i>

                Excel

            </button>

            <button className="btn-export pdf" onClick={()=>generateReport()}>

                <i className="bi bi-file-earmark-pdf-fill"></i>

                PDF

            </button>

        </div>

    </div>

    {/* Summary */}

    <div className="row g-3">

        <div className="col-6 col-lg-3">

            <div className="summary-cards">

                <i className="bi bi-people-fill"></i>

                <h2>{reports?.report?.length}</h2>

                <span>Total Students</span>

            </div>

        </div>

        <div className="col-6 col-lg-3">

            <div className="summary-cards">

                <i className="bi bi-journal-bookmark-fill"></i>

                <h2>24</h2>

                <span>Total Lectures</span>

            </div>

        </div>

        <div className="col-6 col-lg-3">

            <div className="summary-cards">

                <i className="bi bi-check-circle-fill"></i>

                <h2>91%</h2>

                <span>Attendance</span>

            </div>

        </div>

        <div className="col-6 col-lg-3">

            <div className="summary-cards">

                <i className="bi bi-exclamation-triangle-fill"></i>

                <h2>8</h2>

                <span>Defaulters</span>

            </div>

        </div>

    </div>

    {/* Class Details */}

    <div className="preview-info">

        <div>

            <span>Department</span>

            <strong>{formdata.Department}</strong>

        </div>

        <div>

            <span>Course</span>

            <strong>{formdata.Class}</strong>

        </div>

        <div>

            <span>Year</span>

            <strong>{formdata.Year}</strong>

        </div>

        <div>

            <span>Division</span>

            <strong>{formdata.Division}</strong>

        </div>

        <div>

            <span>Date</span>

           <strong>
                {new Date(formdata.FromDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })}
                {" - "}
                {new Date(formdata.ToDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })}
            </strong>

        </div>

    </div>

    {/* Search */}

    <div className="preview-search">

        <div className="search-box">

            <i className="bi bi-search"></i>

            <input
                type="text"
                placeholder="Search student..."
            />

        </div>

    </div>

    {/* Student Table */}

    <div className="table-responsive">

        <table className="table preview-table">

            <thead>

                <tr>

                    <th>RollNo</th>

                    <th>Student Name</th>
           

                    <th>Actions</th>

                </tr>

            </thead>

           <tbody>

                {reports?.report?.map((student) => (
                    <React.Fragment key={student.rollno}>
                        <tr>

                            <td>{student.rollno}</td>

                            <td>{student.name}</td>

                            <td>

                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                        handleViewAttendance(student.rollno)
                                    }
                                >
                                    {expandedStudent === student.rollno
                                        ? "Hide"
                                        : "View"}
                                </button>

                            </td>

                        </tr>

                        {expandedStudent === student.rollno && (

                            <tr>

                                <td colSpan={5}>

                                    <div className="attendance-preview">

                                        {student.attendance.map((day, index) => (

                                            <div
                                                className="attendance-day"
                                                key={index}
                                            >

                                                <span>

                                                    {new Date(day.date).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short"
                                                        }
                                                    )}

                                                </span>

                                                

                                                <span
                                                    className={
                                                        day.status === "Present"
                                                            ? "text-success"
                                                            : "text-danger"
                                                    }
                                                >

                                                    {day.status}

                                                </span>

                                            </div>

                                        ))}

                                    </div>

                                </td>

                            </tr>

                        )}

                    </React.Fragment>

                ))}

                </tbody>

                        </table>

    </div>

</div>)}
  </div>
  );
}

export { MentorDashboardContent };