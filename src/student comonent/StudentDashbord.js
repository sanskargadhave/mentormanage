import "../admin component/admin.css";
import axios from "axios";
import { useContext,useEffect,useState } from "react";
import { AuthContext } from '../Authintication';

function StudentDashbord() {
    const {id,token}=useContext(AuthContext);
   
    const [applications,setapplications]=useState([]);

    useEffect(()=>{
        if(!token || !id) return ;
        async function getapplication(){
            try{
                const resp= await axios.get(`https://sangolacollage.onrender.com/api/student/get-student-applications/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setapplications(resp.data.applications);
                console.log(resp.data.applications);
            }
            catch(err)
            {
                alert(err.message);
            }
        }
        getapplication();
    },[token,id]);

    return (
        <div className="admin-content">
            <div className="student-application-wrapper">
                <div className="student-application-header">
                    <h2>Your Leave Applications</h2>
                    <p>
                        Track your submitted leave requests and monitor
                        approval status in real time.
                    </p>
                </div>
                <div className="student-application-grid">
                    {
                        applications.map((item) => {
                            const status = item.data?.status || "Pending";
                            return (
                                <div className="student-application-card" key={item._id}>
                                    <div className="application-top">
                                        <h3>
                                            {item.data?.leaveType}
                                        </h3>
                                        <span className={`application-status ${status.toLowerCase()}`}>
                                            {status}
                                        </span>
                                    </div>
                                    <p className="application-message">
                                        {item.message}
                                    </p>
                                    <div className="application-dates">
                                        <div>
                                            <small>From    </small><h5>
                                           {
                                                new Date(item.data?.fromDate).toLocaleDateString("en-IN",{
                                                    day:"numeric",
                                                    month:"short",
                                                    year:"numeric"
                                                })
                                            }
                                        </h5></div>
                                    <div>
                                    <small>To</small>
                                    <h5>
                                    {
                                        new Date(item.data?.toDate).toLocaleDateString("en-IN",{
                                        day:"numeric",
                                        month:"short",
                                        year:"numeric"
                                    })
                                    }
                                    </h5>
                                </div>
                            </div>
                            <div className="application-reason">
                                <small>Reason</small>
                                <p>
                                    {item.data?.reason}
                                </p>
                            </div>
                            <div className="application-footer">
                                <span>
                                    Submitted Successfully At
                                </span>
                                <small>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    );})}
                </div>
            </div>
        </div>
    );
}

export default StudentDashbord;