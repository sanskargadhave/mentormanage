import { useState,useEffect,useContext} from "react";
import "./student.css";

import axios from "axios";
import { AuthContext } from '../Authintication';
function LeaveApplication() {
  const {id,token}=useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [MentorDetails,setMentorDetails]=useState(null);
  useEffect(()=>{
    axios.get(`https://sangolacollage.onrender.com/api/student/get-mentordetails/${id}`,{
                headers: {
                  Authorization: `Bearer ${token}`, 
                  "Content-Type": "application/json"
                }
              })
              .then((resp)=>{setMentorDetails(resp.data.MentorDetails)})
              .catch((err)=>alert(err.message))
  },[token,id])
  function handleFileChange(e) {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  }

  return (
    <div className="leave-form-wrapper">
      <div className="leave-top-banner">
        <div className="banner-content">
          <span className="leave-mini-tag">
            📄 Smart Leave Portal
          </span>
          <h1>
            Apply Leave Without
            <br />
            Running Behind Mentors 😄
          </h1>
          <p>
            Submit leave applications digitally with instant mentor approval,
            live status tracking, and secure attendance integration.
          </p>
        </div>
        <div className="leave-banner-icon">
          🏖️
        </div>
      </div>
      <div className="leave-main-card">
        <div className="leave-card-header">
          <div>
            <h2>Leave Application Form</h2>
            <p className="small-text">
              Fill all required details carefully
            </p>
          </div>
          <span className="pending-status">
            {MentorDetails.personaldetails.name}
          </span>
        </div>
        <form className="leave-form-grid">
          <div className="input-box">
            <input type="text" placeholder="Enter full name" />
          </div>
          <div className="input-box">
            <input type="text" placeholder="Enter roll number" />
          </div>
          <div className="input-box">
            <select>
              <option>Select Department</option>
              <option>Science</option>
              <option>Computer Science</option>
              <option>Commerce</option>
            </select>
          </div>
          <div className="input-box">
            <select>
              <option>Select Type</option>
              <option>Medical Leave</option>
              <option>Emergency Leave</option>
              <option>Personal Leave</option>
            </select>
          </div>
          <div className="input-box">  
            <input type="date" placeholder="From Date"/>
          </div>
          <div className="input-box">
            <input type="date" placeholder="To Date"/>
          </div>
          <div className="input-box full-width">
            <textarea rows="5" placeholder="Write detailed reason for leave..." ></textarea>
          </div>
          <div className="input-box full-width">
            <div className="upload-area">
              <div className="upload-icon">
                📎
              </div>
              <h4>
                Upload Medical Certificate
              </h4>
              <p>
                JPG, PNG or PDF files supported
              </p>
              

              <input type="file" onChange={handleFileChange} />
              {
                selectedFile && (
                  <div className="selected-file">
                    ✅ {selectedFile.name}
                  </div>
                )
              }
            </div>
          </div>
          <div className="full-width action-buttons">
            <button type="button" className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveApplication;