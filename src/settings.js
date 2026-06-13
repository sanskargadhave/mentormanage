import React, { useState,useEffect,useContext} from "react";
import "./settings.css";
import { AuthContext } from './Authintication';
import axios from "axios";
function Settings() {
   const {id,token,role}=useContext(AuthContext);
   const [message,setmessage]=useState("");
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
   const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/300");
   const showtoast = (msg) => {
      setmessage(msg);
      setShowToast(true);

      setTimeout(() => {
      setShowToast(false);
      }, 8000);
   };

   useEffect(()=>{
        if(!token || !id) return ;
        async function getProfiledetails(){
            try{
                const resp= await axios.get(`https://sangolacollage.onrender.com/api/profile/get-profiledetails/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

                  alert(err.response?.data?.message || err.message);
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
            const resp=await axios.put(`https://sangolacollage.onrender.com/api/profile/updateprofile-details`,{personalDetails,id},{
                   headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json"
                  }
              });
              showtoast(resp.data.message);
      }
      catch(err)
      {
         showtoast(err.response?.data?.message||err.message);
      }
   }

   const handleChange = (e) => {

   const { name, value } = e.target;

   setpersonalDetails(prev => ({
      ...prev,
      [name]: value
   }));

};

   return (
      <div className="settings-page">
         <div className="container py-5">
            <div className="settings-card">
               <div className="row">
                  <div className="col-lg-4">
                     <div className="profile-section">
                        <div className="profile-image-wrapper">
                           <img src={profileImage} alt="" className="profile-image"/>
                           <label className="upload-btn">
                              Change Photo
                              <input type="file" hidden onChange={handleImage}/>
                           </label>
                        </div>
                        <h3>{personalDetails?.name}</h3>
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
                     </div>
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
                           <div className="row">
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>Full Name</label>
                                    <input type="text" name="name" value={personalDetails.name} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       Address
                                    </label>
                                    <input type="text" name="address" value={personalDetails.address} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label> Pincode </label>
                                    <input type="text" name="pincode" value={personalDetails.pincode} className="underline-input" onChange={handleChange}/>
                                 </div>
                              </div>
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
                                      Mobile No
                                    </label>
                                    <input type="text" name="mobileno" value={personalDetails.mobileno} className="underline-input" onChange={handleChange}/>
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
                           </div>
                        </div>
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

                           <img  alt="" className="mentor-image" />
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
                        </div>
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
      </div>
   );
}

export default Settings;