import React, { useState,useEffect,useContext} from "react";
import "./settings.css";
import { AuthContext } from '../Authintication';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../footer";
import axiosInstance from "../axiosInstance";
function Settings() {
   const {id,token,role,profilepic}=useContext(AuthContext);
   const navigate=useNavigate();
   const [message,setmessage]=useState("");
   const [search,setsearch]=useState("");
   const [loading, setLoading] = useState(true);
   const [profiledetails,setprofiledetails]=useState([]);
   const [showToast,setShowToast]=useState(false);
   const [personalDetails,setpersonalDetails]=useState({
      aadharno:"",
      address:"",
      dob:"",
      fathername:"",
      mothername:"",
      mobileno:"",
      parentno:"",
      pincode:"",
      name:"",

   })
   const [profileImage, setProfileImage] = useState(profilepic ||"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png");
   const showtoast = (msg) => {
      setmessage(msg);
      setShowToast(true);

      setTimeout(() => {
      setShowToast(false);
      }, 8000);
   };

   useEffect(()=>{
        if(!token || !id) return ;//https://sangolacollage.onrender.com
        async function getProfiledetails(){
            try{
               setLoading(true);
                const resp= await axiosInstance.get(`/profile/get-profiledetails/${id}`);
                setprofiledetails(resp.data.profileDetails);
               
                const data=resp.data.profileDetails.personaldetails;
                if(data)
                {
                  setpersonalDetails(data);
                }
                console.log(resp.data.profileDetails);
            }
            catch(err)
            {
               console.log(err.response);
               console.log(err.response?.data);
               console.log(err.response?.status);
            }
            finally{
               setLoading(false);
            }
        }
        getProfiledetails();
   },[token,id]);




   const handleImage = (e) => {

      const file = e.target.files[0];

      if(file)
      {
         setProfileImage(
            URL.createObjectURL(file)
         );
      }
   };

   async function updateinfo()
   {
      if(!token || !id) return ; 
      try{
         setLoading(true);
         const resp=await axiosInstance.put(`/profile/updateprofile-details`,{personalDetails,id,role});
         showtoast(resp.data.message);
      }
      catch(err)
      {
         console.log(err.message);
      }
      finally{
         setLoading(false);
      }
   }

   const handleChange = (e) => {

   const { name, value } = e.target;

   setpersonalDetails(prev => ({
      ...prev,
      [name]: value
   }));

   };
   const handleSearch = (e) => {
   setLoading(true);
   setsearch(e.target.value);

   setTimeout(() => {
      setLoading(false);
   }, 1000);
};
   const filterstudent=profiledetails?.studentdetails?.filter((student)=>{
        const query = search.toLowerCase().trim();
      return (
          student.personaldetails.name.toLowerCase().includes(query) ||
            student.studentid.toLowerCase().includes(query) ||
        student.collagedetails.rollno.toString().includes(query) ||
        student.collagedetails.course.toLowerCase().includes(query) ||
        student.collagedetails.department.toLowerCase().includes(query) ||
        student.collagedetails.year.toLowerCase().includes(query) ||
        student.collagedetails.division.includes(query)
      );
   })||[];
   const fetchdetails =(studentid)=>{

   }
   return (
      <div className="settings-page">
         <div className="container-fluid px-2 px-md-4 py-4">
            <div className="settings-card">
               <div className="row">
                  <div className="col-lg-4">
                        {loading  ? (<>
                           <div className="profile-section">

    <div className="profile-image-wrapper">
        <div className="profile-image skeleton"></div>

        <div className="upload-profile-btn skeleton"></div>
    </div>

    <div className="profile-name skeleton"></div>

    <div className="profile-role skeleton"></div>

    <div className="profile-info">

        <div>
            <div className="profile-label skeleton"></div>
            <div className="profile-value skeleton"></div>
        </div>

        <div>
            <div className="profile-label skeleton"></div>
            <div className="profile-value skeleton"></div>
        </div>

        <div>
            <div className="profile-label skeleton"></div>
            <div className="profile-value skeleton"></div>
        </div>

    </div>

</div>
                           </>
                        ):
                        (<>
                        <div className="profile-section">
                        <div className="profile-image-wrapper">

                           <img src={profileImage}  className="profile-image"/>
                           <label className="upload-profile-btn">
                              Change Photo
                              <input type="file" hidden onChange={handleImage}/>
                           </label>
                        </div>
                        <h3>{personalDetails?.name || profiledetails?.name }</h3>
                        <p className="role-text">{role}</p>

                        <div className="profile-info">
                           <div>
                              <span>Email</span>
                              <p>{profiledetails?.emailid}</p>
                           </div>
                           <div>
                              <span>Department</span>
                              <p>{profiledetails?.collagedetails?.department}</p>
                           </div>
                           <div>
                              <span>Status</span>
                              <p className="active-status">
                                 ● Active
                              </p>
                           </div>
                        </div>
                     </div></>)}
                  </div>

                  <div className="col-lg-8">
                     <div className="settings-content">
                        <div className="settings-section">
                           <div className="profile-update-info">
                              <h4>Profile Update Policy</h4>
                              <p>
                                  <i className="bi bi-megaphone-fill me-2"></i>You can update your details only once every 7 days.
                              </p>
                           </div> 
                           <div className="section-header">
                              <h3>Personal Details</h3>
                              <p>Update your personal information and contact details.</p>
                           </div>
                           {loading ?(
                           Array.from({length:2}).map((_,i)=>(
                              <div key={i} className="row">

    <div className="col-md-6 mb-3">

        <div className="input-group-custom">

            <div className="skeleton skeleton-label"></div>

            <div className="skeleton skeleton-input"></div>

        </div>

    </div>

</div>
                           ))):(
                           <div className="row">
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>Full Name</label>
                                    <input type="text" name="name" value={personalDetails.name || profiledetails?.name} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>
                              {role !== "Admin" && (
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       Address
                                    </label>
                                    <input type="text" name="address" value={personalDetails.address} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>)}
                              {role === "Student" && (
                              <>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label> Pincode </label>
                                    <input type="text" name="pincode" value={personalDetails.pincode} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       Aadhar No
                                    </label>
                                    <input type="text" name="aadharno" value={personalDetails.aadharno} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>  
                               <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                      Father Name
                                    </label>
                                    <input type="text" name="fathername" value={personalDetails.fathername} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                      Mother Name
                                    </label>
                                    <input type="text" name="mothername" value={personalDetails.mothername} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                      Parent Mobile No.
                                    </label>
                                    <input type="text" value={personalDetails.parentno} disabled className="disabled-input underline-input"/>
                                 </div>
                              </div>                      
                              </>
                           )}
                           {role !== "Admin" &&(
                              <>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       DOB
                                    </label>
                                    <input type="text" value={ new Date(personalDetails.dob).toLocaleDateString("en-IN",{
                                                    day:"numeric",
                                                    month:"short",
                                                    year:"numeric"
                                                })} disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                      Mobile No
                                    </label>
                                    <input type="text" name="mobileno" value={personalDetails.mobileno} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>
                              </>)}
                           </div>)}
                        </div>
                        {role === "Student" && (
                           <>
                           {loading ?(<>{
                              Array.from({length:2}).map((_,i)=>(
                                 <div key={i} className="row">

                                    <div className="col-md-6 mb-3">

                                       <div className="input-group-custom">

                                             <div className="skeleton skeleton-label"></div>

                                             <div className="skeleton skeleton-input"></div>

                                       </div>

                                    </div>

                                 </div>
                              ))}
                           
                           <div className="notificationss-card">
                              <div className="profile-myskeleton"></div> 
                              <div className="notification-details-skeleton">
                                 <div className="skeleton-mytitle"></div> 
                                 <div className="skeleton-bottom"></div>
                              </div>
                           </div>
                           {
                              Array.from({length:2}).map((_,i)=>(
                                 <div key={i} className="row">

                                    <div className="col-md-6 mb-3">

                                       <div className="input-group-custom">

                                             <div className="skeleton skeleton-label"></div>

                                             <div className="skeleton skeleton-input"></div>

                                       </div>

                                    </div>

                                 </div>
                              ))}
                           
                           
                           </>
                        ):(
                        <>
                        <div className="settings-section">
                           <div className="section-header">
                              <h3>
                                 College Details
                              </h3>
                              <div className="profile-update-info">
                              <h4>Profile Update Policy</h4>
                              <p>
                                 <i className="bi bi-megaphone-fill me-2"></i> Only Mentor Can Change Your College Details .
                              </p>
                           </div> 
                           </div>
                           <div className="row">
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       College Name
                                    </label>
                                    <input type="text" value="Sangola Mahavidyalaya Sangola" disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Course
                                    </label>
                                    <input type="text" value={profiledetails?.collagedetails?.course} disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Year
                                    </label>
                                    <input type="text" value={profiledetails?.collagedetails?.year} disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Division
                                    </label>
                                    <input type="text" value={profiledetails?.collagedetails?.division} disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Roll Number
                                    </label>
                                    <input type="text" value={profiledetails?.collagedetails?.rollno} disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Id No.
                                    </label>
                                    <input type="text" value={profiledetails?.collagedetails?.idno} disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="section-header">
                              <h3>Mentor Details</h3>
                              
                           </div>
                        <div className="mentor-header">

                           <img  src={profiledetails?.collagedetails?.mentor?.profileurl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"} className="mentor-image" />
                           <div>
                              <h5> Prof. {profiledetails?.collagedetails?.mentor?.personaldetails?.name} </h5>
                              <p>Mentor </p>
                           </div>
                        </div>
                        <div className="row">
                           <div className="col-md-6">
                              <div className="input-group-custom">
                                 <label>
                                    Department
                                 </label>
                                 <input type="text" value={profiledetails?.collagedetails?.mentor?.professionaldetails?.department} disabled className="underline-input disabled-input"/>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="input-group-custom">
                                 <label>
                                    Exprience
                                 </label>
                                 <input type="text" value={profiledetails?.collagedetails?.mentor?.professionaldetails?.exprience} disabled className="underline-input disabled-input"/>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="input-group-custom">
                                 <label>
                                    Mobile No.
                                 </label>
                                 <input type="text" value={profiledetails?.collagedetails?.mentor?.contactdetails?.mobileno} disabled className="underline-input disabled-input"/>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="input-group-custom">
                                 <label>
                                    Email Id 
                                 </label>
                                 <input type="email" value={profiledetails?.collagedetails?.mentor?.contactdetails?.emailid} disabled className="underline-input disabled-input"/>
                              </div>
                           </div>
                        </div></>)}
                        </>
                     )}
                     {role==="Mentor" && (
                        <div className="students-section">
    
                           <div className="students-header">
                              <div>
                                 <h3>
                                 👨‍🎓 Assigned Students
                                 </h3>
                                 <p className="students-subtitle"> Students assigned under your mentorship </p>
                              </div>

                              <div className="student-count-badge">
                                 {filterstudent?.length || 0} 
                              </div>
                           </div>

                           <div className="students-toolbar">
                              <input
   type="text" 
   placeholder="Search by name or roll no..."
   value={search}
   onChange={handleSearch}
   className="student-search"
/>
                           </div>
                        
                           {
                              loading ? (
                                 <div className="notificationss-card">
                                    <div className="profile-myskeleton"></div> 
                                    <div className="notification-details-skeleton">
                                       <div className="skeleton-mytitle"></div> 
                                       <div className="skeleton-bottom"></div>
                                    </div>
                                 </div>
                              ) : (
                                 <>
                                 {filterstudent.map((student)=>(
                              <div key={student._id}>
                                 <div className="wa-student-card">

    <div className="wa-student-left">

        <div className="wa-student-avatar">
            {
                student.profileurl ? (
                    <img
                        src={student.profileurl}
                        alt={student.personaldetails.name}
                        className="wa-avatar-img"
                    />
                ) : (
                    student.personaldetails.name
                        ?.split(" ")
                        .map(word => word[0])
                        .slice(0,2)
                        .join("")
                        .toUpperCase()
                )
            }
        </div>

        <div className="wa-student-content">

            <div className="wa-student-top">
                <h5>{student.personaldetails.name}</h5>

                <span className="wa-student-id">
                    {student.studentid}
                </span>
            </div>

            <p className="wa-course">
                🎓 {student.collagedetails.course}
            </p>

            <p className="wa-course">
                 🎗️ {student.collagedetails.rollno}
            </p>
            <p className="wa-course">
                💼  {student.collagedetails.year} Year
            </p>

            <p className="wa-course">
                 📝  { student.collagedetails.division}
            </p>

        </div>

    </div>

    <button className="wa-view-btn" onClick={()=>navigate(`/mentor/student/${student._id}`)}>
        View
    </button>

</div>
                              </div>
                           ))}
                           </>
                              )
                           }
                           
                           {
    search && filterstudent.length === 0 && (
        <div className="wa-empty-state">

            <div className="wa-empty-icon">
                <i className="bi bi-search"></i>
            </div>

            <h4>No students found</h4>

            <p>
                No results for <span>"{search}"</span>
            </p>

            <small>
                Try searching with name, roll number or student ID.
            </small>

        </div>
    )
}
                        {profiledetails?.studentdetails?.length === 0 && (
                           <div className="empty-state">
                              <div className="empty-icon">👨‍🎓</div>
                                 <h4>No Students Assigned</h4>
                                 <p>
                                    You don't have any assigned students yet.
                                 </p>
                              </div>
                           )
                        }
                     </div>)}
                     <br/><br/>
                     <div className="settings-section">
                           <div className="section-header">
                              <h3>
                                 Change Password
                              </h3>
                              <p>
                                 Update your password to keep your account secure.
                              </p>
                           </div>
                           <div className="row">
                              <div className="col-12">
                                 <div className="input-group-custom">
                                    <label>
                                       Current Password
                                    </label>
                                    <input type="password" className="underline-input" />
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       New Password
                                    </label>
                                    <input type="password" className="underline-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       Confirm Password
                                    </label>
                                    <input type="password" className="underline-input" />
                                 </div>
                              </div>
                           </div>
                        </div>
                        
                        <div className="save-btn-wrapper">
                           <button className="save-btn" onClick={updateinfo}>
                              Save Changes
                           </button>
                        </div>
                        {showToast && (
                           <div className="toast-overlay">
                              <div id="liveToast" className="toast show custom-toast" role="alert" aria-live="assertive" aria-atomic="true">
                                 <div className="toast-header">
                                    <strong className="me-auto">Profile Info</strong>
                                    <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
                                 </div>

                                 <div className="toast-body">
                                    <p>
                                       update your details only once every 7 days.
                                    </p>
                                    {message}
                                 </div>
                              </div>
                           </div> 
                        )}
                     </div>  
                          
                  </div>
               </div>
            </div>
         </div>
         <Footer/>
      </div>
   );
}

export default Settings;