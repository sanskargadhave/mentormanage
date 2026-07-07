import { AuthContext } from "../Authintication";
import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css"
function AdminDashbord()
{
    const [analysis,setanalysis]=useState([]);
    const [filter,setfilter]=useState("");
    const {token}=useContext(AuthContext);  
    const [page,setpage]=useState(1);
    useEffect(()=>{
        async function fetchanalysis() {
            try{
                const resp= await axios.get("https://sangolacollage.onrender.com/api/admin/dashboard-analysis",{
                headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                console.log(resp.data)
                setanalysis(resp.data);
            }
            catch(err)
            {
                alert(err.message);
            }
        }
        fetchanalysis();

        
    },[token])


    useEffect(()=>{
        async function fetchdata()
        {
            try{
                const resp=await axios.get(`https://sangolacollage.onrender.com/api/admin/fetchstudent-details?page=${page}&limit=${10}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                console.log(resp.data)
            }
            catch(err)
            {
                alert(err.message);
            }
                
        }
    },[token]);


    return (
        <div>
            <div className="container-fluid mt-4">
                <div className="semester-card">

    <div className="semester-icon">
        <i className="bi bi-calendar3"></i>
    </div>

    <div className="semester-info">

        <h4>{analysis?.semester?.name}</h4>

        <p>
            <i className="bi bi-mortarboard-fill"></i>
            Academic Year : <strong>{analysis?.semester?.academicYear}</strong>
        </p>

        <p>
            <i className="bi bi-calendar-event"></i>
            {new Date(analysis?.semester?.startDate).toLocaleDateString("en-GB")}
            {"  "} - {"  "}
            {new Date(analysis?.semester?.endDate).toLocaleDateString("en-GB")}
        </p>

    </div>

    <div className="semester-status">
        <span className="badge bg-success">
            Current Semester
        </span>
    </div>

</div>

    {/* Active Users */}
    <h5 className="dashboard-section-title">
        <i className="bi bi-check-circle-fill text-success me-2"></i>
        Active Users
    </h5>

    <div className="row g-3 mb-4">

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-success-subtle">
            <i className="bi bi-people-fill"></i>
        </div>

        <div className="card-content">
            <h6>Active Students</h6>
            <h2>{analysis?.users?.activeStudents}</h2>
            <span className="increase">
                <i className="bi bi-check-circle-fill set-icon"></i> Approved
            </span>
        </div>
    </div>
</div>

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-primary-subtle">
            <i className="bi bi-person-badge-fill"></i>
        </div>

        <div className="card-content">
            <h6>Active Mentors</h6>
            <h2>{analysis?.users?.activeMentors}</h2>
            <span>
                <i className="bi bi-person-check-fill set-icon"></i> Working
            </span>
        </div>
    </div>
</div>

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-warning-subtle">
            <i className="bi bi-person-workspace"></i>
        </div>

        <div className="card-content">
            <h6>Active Teachers</h6>
            <h2>{analysis?.users?.activeTeachers}</h2>
            <span>
                <i className="bi bi-mortarboard-fill set-icon"></i> Faculty
            </span>
        </div>
    </div>
</div>

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-info-subtle">
            <i className="bi bi-book-half"></i>
        </div>

        <div className="card-content">
            <h6>Total Lectures</h6>
            <h2>{analysis?.academic?.totalLectures}</h2>
            <span>
                <i className="bi bi-calendar-week set-icon"></i> This Semester
            </span>
        </div>
    </div>
</div>

    </div>

    {/* Academic */}
    <h5 className="dashboard-section-title">
        <i className="bi bi-bar-chart-fill text-primary me-2"></i>
        Academic Overview
    </h5>

    <div className="row g-3 mb-4">

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-danger-subtle">
            <i className="bi bi-journal-text"></i>
        </div>

        <div className="card-content">
            <h6>Total Tests</h6>
            <h2>{analysis?.academic?.totalTests}</h2>
            <span>
                <i className="bi bi-clipboard-check-fill set-icon"></i> Conducted
            </span>
        </div>
    </div>
</div>

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-secondary-subtle">
            <i className="bi bi-envelope-paper-fill"></i>
        </div>

        <div className="card-content">
            <h6>Leave Requests</h6>
            <h2>{analysis?.academic?.leaveRequests}</h2>
            <span>
                <i className="bi bi-clipboard-check-fill set-icon"></i> This Semester
            </span>
        </div>
    </div>
</div>

    </div>

    {/* Inactive */}
    <h5 className="dashboard-section-title">
        <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
        Inactive Accounts
    </h5>

    <div className="row g-3">

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-danger-subtle">
            <i className="bi bi-person-x-fill"></i>
        </div>

        <div className="card-content">
            <h6>Inactive Students</h6>
            <h2>{analysis?.users?.inactiveStudents}</h2>
            <span className="text-danger">
                <i className="bi bi-exclamation-circle-fill set-icon"></i> Inactive
            </span>
        </div>
    </div>
</div>

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-dark-subtle">
            <i className="bi bi-person-slash"></i>
        </div>

        <div className="card-content">
            <h6>Inactive Mentors</h6>
            <h2>{analysis?.users?.inactiveMentors}</h2>
            <span>
                <i className="bi bi-pause-circle-fill set-icon"></i> Not Active
            </span>
        </div>
    </div>
</div>

        <div className="col-12 col-sm-6 col-lg-3">
    <div className="dashboard-card">
        <div className="card-icon bg-light border">
            <i className="bi bi-person-dash-fill"></i>
        </div>

        <div className="card-content">
            <h6>Inactive Teachers</h6>
            <h2>{analysis?.users?.inactiveTeachers}</h2>
            <span>
                <i className="bi bi-x-circle-fill set-icon"></i> Not Working
            </span>
        </div>
    </div>
</div>

    </div>

</div>
        <div className="student-container">

    <div className="student-header">

        <div>
            <h4>
                <i className="bi bi-people-fill me-2"></i>
                Students Management
            </h4>

            <small>
                Manage students, search, filter and update records.
            </small>

        </div>

        <button className="btn btn-success">
            <i className="bi bi-plus-circle me-2"></i>
            Add Student
        </button>

    </div>


    <div className="filter-box">

        <div className="row g-3">

            <div className="col-lg-4">

                <div className="search-box">

                    <i className="bi bi-search"></i>

                    <input
                        className="form-control"
                        placeholder="Search student..."
                    />

                </div>

            </div>

            <div className="col-lg-2">

                <select className="form-select">

                    <option>Department</option>

                </select>

            </div>

            <div className="col-lg-2">

                <select className="form-select">

                    <option>Year</option>

                </select>

            </div>

            <div className="col-lg-2">

                <select className="form-select">

                    <option>Division</option>

                </select>

            </div>

            <div className="col-lg-2">

                <button className="btn btn-outline-secondary w-100">

                    Reset

                </button>

            </div>

        </div>

    </div>


    <div className="table-responsive">

        <table className="table table-hover align-middle">

            ....

        </table>

    </div>


    <div className="pagination-box">

        <span>

            Showing 1 - 10 of 245 Students

        </span>

        <nav>

            <ul className="pagination mb-0">

                <li className="page-item">

                    <button className="page-link">

                        <i className="bi bi-chevron-left"></i>

                    </button>

                </li>

                <li className="page-item active">

                    <button className="page-link">

                        1

                    </button>

                </li>

                <li className="page-item">

                    <button className="page-link">

                        2

                    </button>

                </li>

                <li className="page-item">

                    <button className="page-link">

                        3

                    </button>

                </li>

                <li className="page-item">

                    <button className="page-link">

                        <i className="bi bi-chevron-right"></i>

                    </button>

                </li>

            </ul>

        </nav>

    </div>

</div>
        </div>
    );
}
export {AdminDashbord};