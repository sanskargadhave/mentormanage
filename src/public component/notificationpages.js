import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Authintication";
import { useEffect, useState, useContext } from "react";
import "./notification.css";

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
        const resp=await axios.put(`https://sangolacollage.onrender.com/api/mentor/give-approve/${studentinfo._id}/${id}`,{},
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
function MentorDetails(){
     const {token} = useContext(AuthContext);   
     const { id } = useParams();
     const [mentorinfo,setmentorinfo]=useState([]);
     const navigate=useNavigate();

      useEffect(() => {
         const getdetails = async () =>{
          try{
            const resp = await axios.get(`https://sangolacollage.onrender.com/api/admin/mentor/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            setmentorinfo(resp.data);
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
        const resp=await axios.put(`https://sangolacollage.onrender.com/api/admin/mentor/give-reject/${id}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        setmentorinfo((prev)=>({...prev,registrationStatus:"Rejected"}));

        alert(resp.data.message);
      }
      catch(err)
      {
        alert(err.message);
      }
    }
    const Approve = async ()=> {
      try{
        const resp=await axios.put(`https://sangolacollage.onrender.com/api/admin/mentor/give-approve/${mentorinfo.mentorId}/${id}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        setmentorinfo((prev)=>({...prev,registrationStatus:"Approved"}));
       
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

        <button className="back-btn" onClick={()=>navigate("/admin")}>
            <i className="bi bi-arrow-left"></i>
        </button>

        <h2>Mentor Verification</h2>

    </div>

    <div className="student-profile-card">

        <img
            src={mentorinfo?.profileurl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"}
            alt="profile"
            className="student-profile-image"
        />

        <h3>{mentorinfo?.personaldetails?.name}</h3>

        <p>{mentorinfo?.mentorId}</p>

        <span className="student-course">
            {mentorinfo?.professionaldetails?.department}  
              
        </span>

        <div className={`status-badge ${mentorinfo?.registrationStatus}`}>
          {
            mentorinfo?.registrationStatus === "Approved" ? "Approved"
              : mentorinfo?.registrationStatus === "Rejected" ? "Rejected"
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
        <h4>{mentorinfo?.contactdetails?.mobileno}</h4>

        <a
            href={`tel:${mentorinfo?.contactdetails?.mobileno}`}
            className="call-btn-circle"
        >
            <i className="bi bi-telephone-fill"></i>
        </a>
    </div>
</div>
                
            <div className="detail-card">
                <span>Email</span>
                <h4>{mentorinfo?.contactdetails?.emailid}</h4>
            </div>

            <div className="detail-card">   
                <span>Qualification</span>
                <h4>{mentorinfo?.professionaldetails?.qualification}</h4>
            </div>
            <div className="detail-card">
                <span>Address</span>
                <h4>{mentorinfo?.contactdetails?.address}</h4>
            </div>

        </div>

    </div>

    

    <div className="details-section">

        <h3>Academic Information</h3>

        <div className="details-grid">

            <div className="detail-card">
                <span>Department</span>
                <h4>{mentorinfo?.professionaldetails?.department}</h4>
            </div>

            
            <div className="detail-card">
                <span>Exprience</span>
                <h4>{mentorinfo?.professionaldetails?.exprience}</h4>
            </div>

 
        </div>

    </div>

  
    {mentorinfo?.registrationStatus==="Pending" && (
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
function TeacherDetails(){
     const {token} = useContext(AuthContext);   
     const { id } = useParams();
     const [teacherinfo,setteacherinfo]=useState([]);
     const navigate=useNavigate();

      useEffect(() => {
         const getdetails = async () =>{
          try{
            const resp = await axios.get(`https://sangolacollage.onrender.com/api/admin/teacher/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            setteacherinfo(resp.data);
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
        const resp=await axios.put(`https://sangolacollage.onrender.com/api/admin/teacher/give-reject/${id}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        setteacherinfo((prev)=>({...prev,registrationStatus:"Rejected"}));

        alert(resp.data.message);
      }
      catch(err)
      {
        alert(err.message);
      }
    }
    const Approve = async ()=> {
      try{
        const resp=await axios.put(`https://sangolacollage.onrender.com/api/admin/teacher/give-approve/${teacherinfo._id}/${id}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )
        setteacherinfo((prev)=>({...prev,registrationStatus:"Approved"}));
       
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

        <button className="back-btn" onClick={()=>navigate("/admin")}>
            <i className="bi bi-arrow-left"></i>
        </button>

        <h2>Teacher Verification</h2>

    </div>

    <div className="student-profile-card">

        <img
            src={teacherinfo?.profileurl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"}
            alt="profile"
            className="student-profile-image"
        />

        <h3>{teacherinfo?.personaldetails?.name}</h3>

        <p>{teacherinfo?.TeacherId}</p>

        <span className="student-course">
            {teacherinfo?.professionaldetails?.department}  
              
        </span>

        <div className={`status-badge ${teacherinfo?.registrationStatus}`}>
          {
            teacherinfo?.registrationStatus === "Approved" ? "Approved"
              : teacherinfo?.registrationStatus === "Rejected" ? "Rejected"
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
        <h4>{teacherinfo?.contactdetails?.mobileno}</h4>

        <a
            href={`tel:${teacherinfo?.contactdetails?.mobileno}`}
            className="call-btn-circle"
        >
            <i className="bi bi-telephone-fill"></i>
        </a>
    </div>
</div>
                
            <div className="detail-card">
                <span>Email</span>
                <h4>{teacherinfo?.contactdetails?.emailid}</h4>
            </div>

            <div className="detail-card">   
                <span>Qualification</span>
                <h4>{teacherinfo?.professionaldetails?.qualification}</h4>
            </div>
            <div className="detail-card">
                <span>Address</span>
                <h4>{teacherinfo?.contactdetails?.address}</h4>
            </div>

        </div>

    </div>

    

    <div className="details-section">

        <h3>Academic Information</h3>

        <div className="details-grid">

            <div className="detail-card">
                <span>Department</span>
                <h4>{teacherinfo?.professionaldetails?.department}</h4>
            </div>

            
            <div className="detail-card">
                <span>Exprience</span>
                <h4>{teacherinfo?.professionaldetails?.exprience}</h4>
            </div>

 
        </div>

    </div>

  
    {teacherinfo?.registrationStatus==="Pending" && (
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
     const [studentinfo,setstudentinfo]=useState([]);
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
            setleaveinfo(resp.data.application);
            setstudentinfo(resp.data.student);
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
     <div className="student-details-container">

      <div className="student-header">

        <button className="back-btn" onClick={()=>navigate("/mentor")}>
            <i className="bi bi-arrow-left"></i>
        </button>

        <h2>Leave Requested</h2>

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
          </div>
          <div className="leave-details-section">

    <h3>Leave Application Details</h3>

    <div className="leave-details-grid">

        <div className="leave-detail-card">
            <span>Leave Type</span>
            <h4>{leaveinfo?.data?.leaveType}</h4>
        </div>

        <div className="leave-detail-card">
            <span>From Date</span>
            <h4>
                {new Date(leaveinfo?.data?.fromDate).toLocaleDateString("en-IN")}
            </h4>
        </div>

        <div className="leave-detail-card">
            <span>To Date</span>
            <h4>
                {new Date(leaveinfo?.data?.toDate).toLocaleDateString("en-IN")}
            </h4>
        </div>

        <div className="leave-detail-card">
            <span>Total Days</span>
            <h4>{leaveinfo?.data?.totalDays} Days</h4>
        </div>

        <div className="leave-detail-card full-width">
            <span>Reason</span>
            <p>{leaveinfo?.data?.reason}</p>
        </div>

        {
            leaveinfo?.data?.certificateUrl && (
                <div className="certificate-card">
    <div className="certificate-info">
        <i className="bi bi-file-earmark-medical-fill"></i>

        <div>
            
            <span>Attached Document</span>
        </div>
    </div>

    <a
        href={leaveinfo?.data?.certificateUrl}
        target="_blank"
        rel="noreferrer"
        className="certificate-view-btn"
    >
        View
    </a>
</div>
            )
        }

    </div>

    <div className="leave-action-buttons">

        <button className="approve-leave-btn">
            <i className="bi bi-check-circle-fill set-icon"></i>
            Approve
        </button>

        <button className="reject-leave-btn">
            <i className="bi bi-x-circle-fill set-icon"></i>
            Reject
        </button>

    </div>

</div>  
        </div>
    </div>


  )
}

function ReportDetails()
{
    return(
        <div>

        </div>

    );
}
export {StudentDetails,MentorDetails,TeacherDetails,LeaveDetails,ReportDetails};