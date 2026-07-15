import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { AuthContext } from "../Authintication";
import { useNavigate } from "react-router-dom";
import "./mentor.css";
import React, { Fragment } from "react";
import axiosInstance from "../axiosInstance"

function ReportProcessingCard() {

    const steps = [
        "Fetching Attendance Records",
        "Calculating Student Statistics",
        "Preparing Attendance Summary",
        "Rendering PDF Report",
        "Uploading Report to Cloud",
        "Finalizing Report"
    ];

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentStep((prev) => {

                if (prev >= steps.length - 1) return prev;

                return prev + 1;

            });

        }, 1800);

        return () => clearInterval(interval);

    }, []);

    return (

        <div className="processing-card">

            <div className="processing-header">

                <div className="pdf-icon">
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                </div>

                <div>

                    <h2>Generating Attendance Report</h2>

                    <p>Please wait while your report is being prepared.</p>

                </div>

            </div>

            <div className="processing-list">

                {steps.map((step, index) => (

                    <div
                        key={index}
                        className={`processing-step
                        ${
                            index < currentStep
                                ? "completed"
                                : index === currentStep
                                ? "active"
                                : ""
                        }`}
                    >

                        <span className="step-icon">

                            {index < currentStep ? (
                                <i className="bi bi-check-circle-fill"></i>
                            ) : index === currentStep ? (
                                <div className="loader-circle"></div>
                            ) : (
                                <i className="bi bi-circle"></i>
                            )}

                        </span>

                        <span>{step}</span>

                    </div>

                ))}

            </div>

            <div className="progress-bars">

                <div
                    className="progress-fill"
                    style={{
                        width: `${((currentStep + 1) / steps.length) * 100}%`
                    }}
                ></div>

            </div>

            <p className="progress-text">

                {Math.round(((currentStep + 1) / steps.length) * 100)}%

            </p>

        </div>

    );

}


function MentorDashboardContent() {

    const [reportType,setReportType]=useState("oneday");
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [reportUrl,setreportUrl]=useState("");
    const [loading,setloading]=useState(true);
    const [event,setevent]=useState("");
    const {token,id}=useContext(AuthContext);
    const [reports,setreports]=useState([]);
    const [search,setsearch]=useState("");
    const [formdata,setformdata]=useState({
    Dates: "",
    Department:"",
    FromDate:"",
    ToDate:"",
    Class:"",
    Year:"",
    Division:""
  })


   
  const courses={
    Science:["Physics","Zoology","Mathematics","Chemistry","Botany","BSC"],
    ComputerScience:["Data Science","BCA","BSC [ECS]"],
    Art:["Economics","English","Marathi","History","Geography","Hindi"],
    Commerce:["Commerce"],
  }

  const handleChange = (e) => {

    const { name, value } = e.target;

    setformdata(prev => {

        const updated = {
            ...prev,
            [name]: value
        };

        if (reportType === "oneday" && name === "Dates") {
            updated.FromDate = value;
            updated.ToDate = value;
        }

        return updated;

    });

};
  async function getpreview()
  {
    if(!formdata.Department || !formdata.Class || !formdata.Year || !formdata.Division || !formdata.FromDate || !formdata.ToDate){
        return alert("Please Fill All Required Fields");
    }
    try{
        setevent("loadingpreview");
        const resp=await axiosInstance.post("/mentor/give-preview-report",formdata)
        console.log(resp.data);
        setreports(resp.data);
    }
    catch(err)
    {
        console.log(err.message);
       
    }
    finally{
        setevent("showpreview");
    }
  }
  async function generateReport()
  {
    try{
        setevent("generateloading");
        const resp=await axiosInstance.post(`/mentor/make-attendance-report/${id}`,{cacheId: reports.cacheId});
        setreportUrl(resp?.data?.url);        
    }
    catch(err)
    {
        console.log(err.message);
    }
    finally{
        setevent("showreport");
    }
  }

  const handleViewAttendance = (rollno) => {

    if (expandedStudent === rollno) {
        setExpandedStudent(null);
    } else {
        setExpandedStudent(rollno);
    }

};

    const resetForm = () => {

        setformdata({
            Dates: "",
            Department: "",
            FromDate: "",
            ToDate: "",
            Class: "",
            Year: "",
            Division: ""
        });

        setreports([]);
        setreportUrl("");
        setevent("");
        setReportType("oneday");

    };
    const filteredReports = reports?.report?.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        String(student.rollno).includes(search)
    );
  return (
    <div>   
        
        <div className="report-page">
           
            <div className="report-type">

                <button className={`type-btn ${reportType==="oneday" ? "active" : ""}`} onClick={()=>setReportType("oneday")}>
                    <i className="bi bi-calendar-day me-2"></i>Daily Report
                </button>

                <button className={`type-btn ${reportType==="multiday" ? "active" : ""}`} onClick={()=>setReportType("multiday")}>
                    <i className="bi bi-calendar-range me-2"></i>Multi Day
                </button>

            </div>

            <div className="container-fluid">

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
                            <select className="form-control" name="Class" value={formdata.Course} onChange={handleChange}>
                                <option value="">select Course</option>
                                {
                                    courses[formdata.Department]?.map((course,index)=>
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
                                    className="form-control"  value={formdata.Dates} name="Dates" onChange={handleChange}
                                />

                            </div>

                        </div>

                        )}

                    </div>

                    {/* Buttons */}

                    <div className="filter-buttons" >

                        <button className="btn-reset" onClick={()=>resetForm()}>

                            <i className="bi bi-arrow-clockwise me-2"></i>

                            Reset

                        </button>
                        {event!=="loadingpreview" && (
                        <button className="btn-generate" onClick={()=>getpreview()} >

                            <i className="bi bi-search me-2"></i>

                            Preview Report

                        </button>)}

                    </div>

                </div>

                
            </div>

        </div>
        {/* ================= Preview Section ================= */}
        {event==="loadingpreview"&&(
            <div className="preview-skeleton">

                <div className="preview-title skeleton"></div>

                <div className="summary-skeleton">

                    <div className="summary-card skeleton"></div>
                    <div className="summary-card skeleton"></div>
                    <div className="summary-card skeleton"></div>
                    <div className="summary-card skeleton"></div>

                </div>

                <div className="table-skeleton">

                    <div className="table-header">

                        <div className="cell roll skeleton"></div>
                        <div className="cell name skeleton"></div>

                        {Array.from({ length: 8 }).map((_, i) => (
                            <div className="cell date skeleton" key={i}></div>
                        ))}

                    </div>

                    {Array.from({ length: 8 }).map((_, row) => (

                        <div className="table-row" key={row}>

                            <div className="cell roll skeleton"></div>

                            <div className="cell name skeleton"></div>

                            {Array.from({ length: 8 }).map((_, col) => (
                                <div className="cell status skeleton" key={col}></div>
                            ))}

                        </div>

                    ))}

                </div>

            </div>
        )}

        {event==="showpreview"   && (
            <div className="report-preview">
                {reports?.report?.length===0 ? (
                    <div className="empty-preview">

                        <div className="empty-icon">
                            <i className="bi bi-calendar-x"></i>
                        </div>

                        <h3>No Attendance Records Found</h3>

                        <p>
                            No attendance records were found for the selected
                            filters. Try changing the date range, class, or
                            department and preview again.
                        </p>

                    </div>

                    ):(<>
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
                                    placeholder="Search student..." onChange={(e)=>setsearch(e.target.value)}
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

                                {filteredReports.length === 0 ? (
    <tr>
        <td colSpan="4" className="text-center">
            No student found.
        </td>
    </tr>
) : (<>
        
   
                                {filteredReports.map((student) => (
                                    <React.Fragment key={student.rollno}>
                                        <tr>

                                            <td>{student.rollno}</td>

                                            <td>{student.name}</td>

                                            <td>

                                                <button className="btn btn-success btn-sm" onClick={() => handleViewAttendance(student.rollno)}>
                                                    {expandedStudent === student.rollno ? "Hide" : "View"}
                                                </button>

                                            </td>

                                        </tr>
                                        
                                        {expandedStudent === student.rollno && (
                                            <tr>
                                                <td colSpan={5}>
                                                    <div className="attendance-preview">
                                                        {student.attendance.map((day, index) => (
                                                            <div className="attendance-day" key={index}>
                                                                <span>
                                                                    {new Date(day.date).toLocaleDateString("en-IN",
                                                                        {
                                                                            day: "2-digit",
                                                                            month: "short"
                                                                        }
                                                                    )}

                                                                </span>                                                
                                                                <span className={ day.status === "Present" ? "text-success" : "text-danger"}>

                                                                    {day.status}

                                                                </span>

                                                            </div>

                                                        ))}

                                                    </div>

                                                </td>

                                            </tr>

                                        )}

                                    </React.Fragment>

                                ))}</>
)}

                                </tbody>

                            </table>

                        </div></>)
                    }

            </div>)}

            {event==="generateloading" && (
                <ReportProcessingCard/>
            )}

            {event==="showreport" && (
                <div className="report-success-card">

                    <div className="success-icon">
                        <i className="bi bi-check-circle-fill"></i>
                    </div>

                    <div className="success-content">

                        <h3>Report Generated Successfully</h3>

                        <p>
                            Your attendance report has been securely generated
                            and uploaded. Use the link below to view or download it.
                        </p>

                        <div className="report-url-box">

                            <i className="bi bi-link-45deg"></i>

                            <input
                                type="text"
                                value={reportUrl}
                                readOnly
                            />

                            <button className="copy-btn">
                                <i className="bi bi-copy"></i>
                            </button>

                        </div>

                    </div>

                </div>
            )

            }
        </div>
    );
}

export { MentorDashboardContent };