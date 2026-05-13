import { useState } from "react";
import "./student.css";

function LeaveApplication() {

  const [selectedFile, setSelectedFile] = useState(null);

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
            Pending Review
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
              <label className="custom-upload-btn">
                Choose File
                <input type="file" onChange={handleFileChange} hidden />
              </label>
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