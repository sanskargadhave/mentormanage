import { AuthContext } from "../Authintication";
import { useEffect, useState, useContext } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css";

function AdminDashbord()
{
    const [analysis,setanalysis]=useState({});
    const [students,setstudents]=useState([]);
    const [loading,setloading]=useState(true);
    const [pagininfo,setpagininfo]=useState({});
    
    const navigate=useNavigate();
    const [filters,setFilters]=useState({
        search:"",
        department:"",
        year:"",
        division:""
    });
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
                setloading(true);
                const resp=await axios.get(`https://sangolacollage.onrender.com/api/admin/fetch-details`,{
                    params:{
                        page,
                        limit:10,
                        ...filters
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                
                setstudents(resp.data.students);
                setpagininfo(resp.data.pagination)
            }
            catch(err)
            {
                alert(err.message);
            }
            finally{
                setloading(false);
            }
                
        }
        const timer = setTimeout(() => {
            fetchdata();
        }, 1000);

        return () => clearTimeout(timer);
    },[token,page,filters]);

    const handleChange = (e) =>{
       

            if (e.target.name === "reset") {
                setpage(1);
                setFilters({
                    search: "",
                    department: "",
                    year: "",
                    division: ""
                });
                return;
            }

            setpage(1);

            setFilters(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        
        };
            const getPages = () => {
                const pages = [];
            const total = pagininfo.totalPages;
            const current = pagininfo.currentPage;

            if (!total) return pages;

            pages.push(1);

            if (current > 4) {
                pages.push("...");
            }

            for (
                let i = Math.max(2, current - 2);
                i <= Math.min(total - 1, current + 2);
                i++
            ) {
                pages.push(i);
            }

            if (current < total - 3) {
                pages.push("...");
            }

            if (total > 1) {
                pages.push(total);
            }

            return [...new Set(pages)];
        
    }
    return (
        <div>
            <div className="container-fluid mt-4">
                {loading && ( 
                    <div className="semester-card">
                        <div className="profile-myskeleton"></div> 
                        <div className="notification-details-skeleton">
                            <div className="skeleton-mytitle"></div> 
                            <div className="skeleton-bottom"></div>
                        </div>
                    </div>
                )}
                {!loading && (
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
                )}
                



                
                
                    {/* Active Users */}
                    <h5 className="dashboard-section-title">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Active Users
                    </h5>
                    <div className="row g-3 mb-4">
                        {loading ? (
                        Array.from({length:4}).map((_,i)=>(
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="dashboard-card">
                                    <div className="card-icon skeleton skeleton-icon"></div>
                                    <div className="card-content">
                                        <div className="skeleton skeleton-title"></div>
                                        <div className="skeleton skeleton-number"></div>
                                        <div className="skeleton skeleton-status"></div>
                                    </div>
                                </div>
                            </div>
                            
                        ))
                        ):(<>
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
                                    <span>                                            <i className="bi bi-calendar-week set-icon"></i> This Semester
                                    </span>
                                </div>
                            </div>
                        </div></>)}

                    </div>

                    {/* Academic */}
                    <h5 className="dashboard-section-title">
                        <i className="bi bi-bar-chart-fill text-primary me-2"></i>
                        Academic Overview
                    </h5>

                    <div className="row g-3 mb-4">
                        {loading ? (
                        Array.from({length:2}).map((_,i)=>(
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="dashboard-card">
                                    <div className="card-icon skeleton skeleton-icon"></div>
                                    <div className="card-content">
                                        <div className="skeleton skeleton-title"></div>
                                        <div className="skeleton skeleton-number"></div>
                                        <div className="skeleton skeleton-status"></div>
                                    </div>
                                </div>
                            </div>
                            
                        ))
                        ):(<>
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
                        </div></>)}

                    </div>

                    {/* Inactive */}
                    <h5 className="dashboard-section-title">
                        <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                        Inactive Accounts
                    </h5>

                    <div className="row g-3">
                        {loading ? (
                        Array.from({length:3}).map((_,i)=>(
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="dashboard-card">
                                    <div className="card-icon skeleton skeleton-icon"></div>
                                    <div className="card-content">
                                        <div className="skeleton skeleton-title"></div>
                                        <div className="skeleton skeleton-number"></div>
                                        <div className="skeleton skeleton-status"></div>
                                    </div>
                                </div>
                            </div>
                            
                        ))
                        ):(<>
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
                        </div></>)}

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

                        <button className="btn btn-success" onClick={()=>{navigate("/register-student")}}>
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
                                        name="search" value={filters.search}
                                        onChange={(e)=>handleChange(e)}                 
                                    />

                                </div>

                            </div>

                            <div className="col-lg-2">

                                <select name="department" className="form-select" value={filters.department} onChange={(e)=>handleChange(e)} disabled={loading} >

                                    <option value="">Select Department</option>
                                    <option value="Science">Science</option>
                                    <option value="ComputerScience"> Computer Science</option>
                                    <option value="Art">Art</option>
                                    <option value="Commerce">Commerce</option>

                                </select>

                            </div>

                            <div className="col-lg-2">

                                <select className="form-select" name="year"  value={filters.year} onChange={(e)=>handleChange(e)} disabled={loading}>

                                    <option value="">Year</option>
                                    <option value="first">First</option>
                                    <option value="second"> Second</option>
                                    <option value="third">Third</option>
                                

                                </select>

                            </div>

                            <div className="col-lg-2">

                                <select className="form-select" name="division" value={filters.division} onChange={(e)=>handleChange(e)} disabled={loading}>

                                    <option value="">Division</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>

                            </div>

                            <div className="col-lg-2">

                                <button type="button" name="reset" className="btn btn-outline-secondary w-100" onClick={(e)=>handleChange(e)} disabled={loading}>

                                    Reset

                                </button>

                            </div>

                        </div>

                    </div>


                    <div className="table-responsive">

                    <table className="table student-table align-middle">

                        <thead>

                            <tr>

                                <th>Profile</th>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Course</th>
                                <th>Year</th>
                                <th>Division</th>
                                <th>Parent No</th>
                                <th>Active Status</th>
                                <th>Registration Status</th>
                            </tr>

                        </thead>
                        <tbody>

                {loading ? (

                    [...Array(10)].map((_, index) => (
                        <tr key={index}>

                            <td>
                                <div className="skeleton skeleton-circle"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-text short"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-text"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-text"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-text"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-text short"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-badge"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-badge"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-badge"></div>
                            </td>

                            <td>
                                <div className="skeleton skeleton-badge"></div>
                            </td>
                        </tr>
                    ))

                ) : students.length > 0 ? (

                    students.map((student) => (
                    <tr key={student?._id}>

                                        <td>

                                            <img
                                                src={student?.personaldetails?.profileImage || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"}
                                                alt="profile"
                                                className="student-profile"
                                            />

                                        </td>

                                        <td>

                                            <strong>
                                                {student?.collagedetails?.rollno}
                                            </strong>

                                        </td>

                                        <td>

                                            {student?.personaldetails?.name}

                                        </td>

                                        <td>

                                            {student?.collagedetails?.department}

                                        </td>

                                        <td>

                                            {student?.collagedetails?.course}

                                        </td>

                                        <td>

                                            {student?.collagedetails?.year}

                                        </td>

                                        <td>

                                            <span className="division-badge">

                                                {student?.collagedetails?.division}

                                            </span>

                                        </td>
                                        <td>
                                            {student?.personaldetails?.parentno}
                                        </td>
                                        <td>
                                            {student?.isactive || "--"}
                                        </td>
                                        <td>
                                            {student?.registrationStatus}
                                        </td>

                                    </tr>


                    ))

                ) : (

                    <tr>
                        <td colSpan="10" className="text-center py-5">
                            No Students Found
                        </td>
                    </tr>

                )}

                </tbody>

                    </table>

                </div>
                    <div className="pagination-box">

                        <span>

                            Showing {pagininfo.currentPage} - {pagininfo.currentPage+9} of {pagininfo.totalRecords} Students

                        </span>

                        <nav>

                            <ul className="pagination">

                    <li className="page-item">
                        <button
                            className="page-link"
                            disabled={!pagininfo.hasPrevious}
                            onClick={() => setpage(page - 1)}
                        >
                            &lt;
                        </button>
                    </li>

                    {getPages().map((item, index) => (

                        item === "..." ? (

                            <li key={index} className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>

                        ) : (

                            <li
                                key={index}
                                className={`page-item ${
                                    item === pagininfo.currentPage
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setpage(item)}
                                >
                                    {item}
                                </button>
                            </li>

                        )

                    ))}

                    <li className="page-item">
                        <button
                            className="page-link"
                            disabled={!pagininfo.hasNext}
                            onClick={() => setpage(page + 1)}
                        >
                            &gt;
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