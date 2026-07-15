import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";
function ViewUser() {
    const [counts, setcounts] = useState({
        totalStudents: 0,
        totalMentors: 0,
        totalteachers: 0
    });
    const token=localStorage.getItem("token");
    
    useEffect(() => {
        if(!token) return;
        const fetchCounts = async () => {
            try {
                const response = await axiosInstance.get("/admin/get-usercounts");
                setcounts(response.data);
            } catch (err) {
                console.log("Error fetching counts", err.message);
            }
        };
        fetchCounts();
    }, [token]);

    
    return (
        <div className="admin-content">
            <h2>Total Students: {counts.totalStudents}</h2>
            <h2>Total Mentors: {counts.totalMentors}</h2>
            <h2>Total Teachers: {counts.totalteachers}</h2>
        </div>
    );
}

export { ViewUser };