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
        alert(resp.data.message);
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

  

    <div className="action-buttons">

        <button className="reject-btn" onClick={()=>Reject()}>
            Reject Registration
        </button>

        <button className="approve-btn" onClick={()=>Approve()}>
            Approve Registration
        </button>

    </div>

</div>








    </div>);
}
export {StudentDetails};