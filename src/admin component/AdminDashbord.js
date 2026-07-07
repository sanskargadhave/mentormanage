import { AuthContext } from "../Authintication";
import { useEffect, useState, useContext } from "react";
import socket from "../socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css"
function AdminDashbord()
{
    const [analysis,setanalysis]=useState([]);
    const {token}=useContext(AuthContext);   
    useEffect(()=>{
        async function fetchanalysis() {
            try{
                const resp= await axios.get("https://sangolacollage.onrender.com/api/admin/dashboard-analysis",{
                headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                console.log(resp.data);
            }
            catch(err)
            {
                alert(err.message);
            }
        }
        fetchanalysis();

        
    },[token])
    return (
        <div>
            <div className="container-fluid mt-3">
    <div className="row g-3">

        <div className="col-12 col-sm-6 col-lg-3">
            <div className="dashboard-card">
                <div className="card-icon bg-success-subtle">
                    <i className="bi bi-people-fill"></i>
                </div>

                <div className="card-content">
                    <h6>Total Students</h6>
                    <h2>250</h2>
                    <span className="increase">
                        <i className="bi bi-arrow-up"></i> 8% this month
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
                    <h6>Total Mentors</h6>
                    <h2>18</h2>
                    <span>Active</span>
                </div>
            </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
            <div className="dashboard-card">
                <div className="card-icon bg-warning-subtle">
                    <i className="bi bi-person-workspace"></i>
                </div>

                <div className="card-content">
                    <h6>Total Teachers</h6>
                    <h2>35</h2>
                    <span>Faculty Members</span>
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
                    <h2>420</h2>
                    <span>This Semester</span>
                </div>
            </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
            <div className="dashboard-card">
                <div className="card-icon bg-danger-subtle">
                    <i className="bi bi-journal-text"></i>
                </div>

                <div className="card-content">
                    <h6>Total Tests</h6>
                    <h2>28</h2>
                    <span>Completed</span>
                </div>
            </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
            <div className="dashboard-card">
                <div className="card-icon bg-success-subtle">
                    <i className="bi bi-calendar-check-fill"></i>
                </div>

                <div className="card-content">
                    <h6>Today's Attendance</h6>
                    <h2>92%</h2>
                    <span className="increase">Excellent</span>
                </div>
            </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
            <div className="dashboard-card">
                <div className="card-icon bg-danger-subtle">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>

                <div className="card-content">
                    <h6>Total Defaulters</h6>
                    <h2>15</h2>
                    <span>Need Attention</span>
                </div>
            </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
            <div className="dashboard-card">
                <div className="card-icon bg-secondary-subtle">
                    <i className="bi bi-megaphone-fill"></i>
                </div>

                <div className="card-content">
                    <h6>Active Notices</h6>
                    <h2>6</h2>
                    <span>Latest Updates</span>
                </div>
            </div>
        </div>

    </div>
</div>
        </div>
    );
}
export {AdminDashbord};