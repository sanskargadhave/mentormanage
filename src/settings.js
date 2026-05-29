import React, { useState,useEffect,useContext} from "react";
import "./settings.css";
import { AuthContext } from './Authintication';
import axios from "axios";
function Settings() {
   const {id,token}=useContext(AuthContext);
   const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/300");
   useEffect(()=>{
        if(!token || !id) return ;
        async function getProfiledetails(){
            try{
                const resp= await axios.get(`https://sangolacollage.onrender.com/api/student/get-profiledetails/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(resp.data.profileDetails);
            }
            catch(err)
            {
               alert(err.message);
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
                        <h3>Sanskar</h3>
                        <p className="role-text">Mentor</p>

                        <div className="profile-info">
                           <div>
                              <span>Email</span>
                              <p>sanskar@gmail.com</p>
                           </div>
                           <div>
                              <span>Department</span>
                              <p>Computer Science</p>
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
                                  You can update your personal details only once every 7 days.
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
                                    <input type="text" value="Sanskar" className="underline-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       Address
                                    </label>
                                    <input type="text" value="At Post Piliv " className="underline-input" />
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label> Pincode </label>
                                    <input type="text" value="413310" className="underline-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       DOB
                                    </label>
                                    <input type="date" value="02/01/2006" disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                       Aadhar No
                                    </label>
                                    <input type="text" value="818234391788" className="underline-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                      Father Name
                                    </label>
                                    <input type="text" value="Gadhave Shantinath Aba" className="underline-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                      Mother Name
                                    </label>
                                    <input type="text" value="Gadhave Sunita" className="underline-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                      Mobile No
                                    </label>
                                    <input type="text" value="7276699105" className="underline-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="input-group-custom">
                                    <label>
                                      Parent Mobile No.
                                    </label>
                                    <input type="text" value="9096269105" disabled className="disabled-input underline-input"/>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="settings-section">
                           <div className="section-header">
                              <h3>
                                 College Details
                              </h3>
                              <p className="mentor-note">
                                 Only Mentor can change your college details.
                              </p>
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
                                    <input type="text" value="Bsc [ECS]" disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Year
                                    </label>
                                    <input type="text" value="Second" disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Division
                                    </label>
                                    <input type="text" value="A" disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Roll Number
                                    </label>
                                    <input type="text" value="3121" disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                              <div className="col-md-6"> 
                                 <div className="input-group-custom">
                                    <label>
                                       Id No.
                                    </label>
                                    <input type="text" value="BT#192039" disabled className="underline-input disabled-input"/>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="section-header">
                              <h3>Your Mentor Details</h3>
                              
                           </div>
                        <div className="mentor-header">

                           <img  alt="" className="mentor-image" />
                           <div>
                              <h5> Prof. Subhash Patil Sir</h5>
                              <p>Mentor </p>
                           </div>
                        </div>
                        <div className="row">
                           <div className="col-md-6">
                              <div className="input-group-custom">
                                 <label>
                                    Department
                                 </label>
                                 <input type="text" value="Computer Science" disabled className="underline-input disabled-input"/>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="input-group-custom">
                                 <label>
                                    Exprience
                                 </label>
                                 <input type="text" value="11 Years" disabled className="underline-input disabled-input"/>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="input-group-custom">
                                 <label>
                                    Mobile No.
                                 </label>
                                 <input type="text" value="2838393983" disabled className="underline-input disabled-input"/>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="input-group-custom">
                                 <label>
                                    Email Id 
                                 </label>
                                 <input type="email" value="saasms@gmail.com" disabled className="underline-input disabled-input"/>
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
                           <button className="save-btn">
                              Save Changes
                           </button>
                        </div>
                     </div>  
                          
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Settings;