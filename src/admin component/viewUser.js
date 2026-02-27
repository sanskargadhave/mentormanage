import { useEffect, useState } from "react";
import axios from "axios";

function ViewUser() {
    const [counts, setcounts] = useState({
        totalStudents: 0,
        totalMentors: 0,
        totalteachers: 0
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/get-usercounts");
                setcounts(response.data);
            } catch (err) {
                alert("Error fetching counts", err);
            }
        };
        fetchCounts();
    }, []);

    
    return (
        <div className="admin-content">
            <h2>Total Students: {counts.totalStudents}</h2>
            <h2>Total Mentors: {counts.totalMentors}</h2>
            <h2>Total Teachers: {counts.totalteachers}</h2>
        </div>
    );
}

export { ViewUser };