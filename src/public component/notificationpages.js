import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Authintication";
import { useEffect, useState, useContext } from "react";
import "./notification.css"
function StudentDetails(){
     const {token} = useContext(AuthContext);   
     const { id } = useParams();
     const [studentinfo,setstudentinfo]=useState([]);
     const navigate=useNavigate();

      useEffect(() => {
         const getdetails = async () =>{
          try{
            const resp = await axios.get(`https://sangolacollage.onrender.com/api/mentor/student/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            setstudentinfo(resp.data);
          }
          catch(err)
          {
            alert(err.message);
          }
            
          }
          getdetails();
    }, [id]);

    const Reject = async ()=> {
      try{
        const resp=await axios.put(`https://sangolacollage.onrender.com/api/mentor/give-reject/${id}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        setstudentinfo((prev)=>({...prev,registrationStatus:"Rejected"}));

        alert(resp.data.message);
      }
      catch(err)
      {
        alert(err.message);
      }
    }
    const Approve = async ()=> {
      try{
        const resp=await axios.put(`https://sangolacollage.onrender.com/api/mentor/give-approve/${studentinfo._id}}/${id}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        setstudentinfo((prev)=>({...prev,registrationStatus:"Approved"}));
       
      }
      catch(err)
      {
        alert(err.message);
      }
    }
    return (
    <div >
      <div className="student-details-container">

      <div className="student-header">

        <button className="back-btn" onClick={()=>navigate("/mentor")}>
            <i className="bi bi-arrow-left"></i>
        </button>

        <h2>Student Verification</h2>

    </div>

    <div className="student-profile-card">

        <img
            src={studentinfo?.profileurl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"}
            alt="profile"
            className="student-profile-image"
        />

        <h3>{studentinfo?.personaldetails?.name}</h3>

        <p>{studentinfo?.studentid}</p>

        <span className="student-course">
            {studentinfo?.collagedetails?.course}  • 
              {studentinfo?.collagedetails?.year} Year  •
            Division {studentinfo?.collagedetails?.division}
        </span>

        <div className={`status-badge ${studentinfo?.registrationStatus}`}>
          {
            studentinfo?.registrationStatus === "Approved" ? "Approved"
              : studentinfo?.registrationStatus === "Rejected" ? "Rejected"
              : "Pending Verification"
            }
        </div>  
        

    </div>


    <div className="details-section">

        <h3>Personal Information</h3>

        <div className="details-grid">

            <div className="detail-card">
               <span>Mobile Number</span>

    <div className="contact-row">
        <h4>{studentinfo?.personaldetails?.mobileno}</h4>

        <a
            href={`tel:${studentinfo?.personaldetails?.mobileno}`}
            className="call-btn-circle"
        >
            <i className="bi bi-telephone-fill"></i>
        </a>
    </div>
</div>
                
            

            <div className="detail-card">
               <span>Parent Number</span>

    <div className="contact-row">
        <h4>{studentinfo?.personaldetails?.parentno}</h4>

        <a
            href={`tel:${studentinfo?.personaldetails?.parentno}`}
            className="call-btn-circle"
        >
            <i className="bi bi-telephone-fill"></i>
        </a>
    </div>
</div>

            <div className="detail-card">
                <span>Email</span>
                <h4>{studentinfo?.emailid}</h4>
            </div>

            <div className="detail-card">
                <span>Aadhar Number</span>
                <h4>{studentinfo?.personaldetails?.aadharno}</h4>
            </div>

        </div>

    </div>

    

    <div className="details-section">

        <h3>Academic Information</h3>

        <div className="details-grid">

            <div className="detail-card">
                <span>Department</span>
                <h4>{studentinfo?.collagedetails?.department}</h4>
            </div>

            <div className="detail-card">
                <span>Course</span>
                <h4>{studentinfo?.collagedetails?.course}</h4>
            </div>

            <div className="detail-card">
                <span>Year</span>
                <h4>{studentinfo?.collagedetails?.year}</h4>
            </div>

            <div className="detail-card">
                <span>Division</span>
                <h4>{studentinfo?.collagedetails?.division}</h4>
            </div>

            <div className="detail-card">
                <span>Roll Number</span>
                <h4>{studentinfo?.collagedetails?.rollno}</h4>
            </div>

            <div className="detail-card">
                <span>Mentor ID</span>
                <h4>{studentinfo?.collagedetails?.mentorId}</h4>
            </div>

        </div>

    </div>

  
    {studentinfo?.registrationStatus==="Pending" && (
      <div className="action-buttons">

        <button className="reject-btn" onClick={()=>Reject()}>
            Reject Registration
        </button>

        <button className="approve-btn" onClick={()=>Approve()}>
            Approve Registration
        </button>

      </div>
    )}
    

</div>








    </div>);
}
function LeaveDetails()
{
    const {token} = useContext(AuthContext);   
     const { id } = useParams();
     const [leaveinfo,setleaveinfo]=useState([]);
     const navigate=useNavigate();
    useEffect(() => {
         const getdetails = async () =>{
          try{
            const resp = await axios.get(`https://sangolacollage.onrender.com/api/mentor/get-student-application/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            setleaveinfo(resp.data);
          }
          catch(err)
          {
            alert(err.message);
          }
            
          }
          getdetails();
    }, [id]);

  return (
    <div>
      <div className="leave-alert-card">

    <div className="leave-alert-top">

        <img
            src={leaveinfo.metadata?.profileurl}
            alt="profile"
            className="leave-alert-avatar"
        />

        <div className="leave-alert-user-info">
            <h4>{leaveinfo.metadata?.name}</h4>
            <span>{leaveinfo.metadata?.department}</span>
        </div>

        <div className="leave-alert-time">
            {new Date(leaveinfo.createdAt).toLocaleString("en-IN",{
                day:"numeric",
                month:"short",
                hour:"2-digit",
                minute:"2-digit"
            })}
        </div>

    </div>

    <div className="leave-alert-body">

        <div className="leave-alert-type">
            🌿 {leaveinfo.metadata?.leaveType}
        </div>

        <p className="leave-alert-message">
            {leaveinfo.message}
        </p>

        <div className="leave-alert-dates">

            <div className="leave-date-box">
                <span>From</span>
                <h5>{leaveinfo.metadata?.fromDate}</h5>
            </div>

            <div className="leave-arrow">
                →
            </div>

            <div className="leave-date-box">
                <span>To</span>
                <h5>{leaveinfo.metadata?.toDate}</h5>
            </div>

        </div>

        <div className="leave-alert-footer">

            <div className="leave-total-days">
                {leaveinfo.metadata?.totalDays} Days
            </div>

            <div className="leave-status-chip pending-chip">
                Pending
            </div>

        </div>

    </div>

</div>
    </div>


  )
}
export {StudentDetails,LeaveDetails};