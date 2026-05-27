import { useState,useEffect,useContext} from "react";
import "./student.css";
import { supabase}  from "../supabase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../Authintication';
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
function LeaveApplication() {
  const navigate=useNavigate();
  const {id,token}=useContext(AuthContext);
  const [message,setmessage]=useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [MentorDetails,setMentorDetails]=useState(null);
  const [studentDetails,setStudentDetails]=useState(null);
  const [leaveType,setLeaveType]=useState("");
  const [fromDate,setFromDate]=useState("");
  const [toDate,setToDate]=useState("");
  const [reason,setReason]=useState("");
  const [loding,setloding]=useState(false);

  const showtoast = (tmessage) => {
      setmessage(tmessage);
      const toastElement = document.getElementById("liveToast");
      const toast = new bootstrap.Toast(toastElement, { delay: 8000 });
      toast.show();
    }

  useEffect(()=>{
    axios.get(`https://sangolacollage.onrender.com/api/student/get-mentordetails/${id}`,{
                headers: {
                  Authorization: `Bearer ${token}`, 
                  "Content-Type": "application/json"
                }
              })
              .then((resp)=>{setMentorDetails(resp.data.MentorDetails);setStudentDetails(resp.data.StudentDetails)})
              .catch((err)=>alert(err.message))
  },[token,id])
  function handleFileChange(e) {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  }
  const uploadImage = async () => {
  
         
          if(!selectedFile){ return ""}
          const filename = `${Date.now()}-${studentDetails?.collagedetails?.rollno}-${studentDetails?.personaldetails?.name}`;
  
          const { error } = await supabase.storage
              .from("medical_certificate")
              .upload(filename, selectedFile);
  
          if(error){
              console.log(error);
              console.log(error.message);
              return "";
          }
  
          const { data } = supabase.storage
              .from("medical_certificate")
              .getPublicUrl(filename);
              return data.publicUrl;
      }
  async function sendApplication()
  {
    try{
      
      if(!leaveType || !fromDate || !toDate || !reason)
      {
        return alert("Please Fill All Required fields");
      }
      setloding(true);
      const data = {
        leaveType,
        fromDate,
        toDate,
        reason,
        senderId: studentDetails._id,
        receiver_Id: MentorDetails._id,
        receiverid: MentorDetails.mentorId,
        message: `${studentDetails?.personaldetails?.name} has Requested For Leave`,
        certificateUrl: ""
      };

      if(selectedFile){
        
        const imageUrl = await uploadImage();
        data.certificateUrl = imageUrl;
        
      }
      
      const resp = await axios.post("https://sangolacollage.onrender.com/api/student/send-application",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    
      showtoast(resp.data.message);
    }
    catch(err)
    {
      showtoast(err.response?.data?.message||err.message);
    }
    finally{
      setloding(false);
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
              To Your Mentor <b>Prof. {MentorDetails?.personaldetails?.name}</b>
            </p>
          </div>
        </div>
        <form className="leave-form-grid">
          <div className="leave-student-header">
            <div>
              <h2>
                Name: {studentDetails?.personaldetails?.name}
              </h2>
              <p>
                Roll No :{studentDetails?.collagedetails?.rollno}
              </p>
            </div>
          </div>
          <div className="input-box">
            Select Type Of Leave
            <select onChange={(e)=>{setLeaveType(e.target.value)}}>
              <option>Select Type</option>
              <option>Medical Leave</option>
              <option>Emergency Leave</option>
              <option>Personal Leave</option>
            </select>
          </div>
          <div className="input-box">  
            From --
            <input type="date" placeholder="From Date" onChange={(e)=>{setFromDate(e.target.value)}}/>
          </div>
          <div className="input-box">
            To -- 
            <input type="date" placeholder="To Date" onChange={(e)=>{setToDate(e.target.value)}}/>
          </div>
          <div className="input-box full-width">
            <textarea rows="5" placeholder="Write detailed reason for leave..." onChange={(e)=>{setReason(e.target.value)}} ></textarea>
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
            {!loding && (
            <button type="button" className="cancel-btn" onClick={()=>{navigate("/student")}}>
              Cancel
            </button>)}
            <button type="button" className="submit-btn" onClick={sendApplication} disabled={loding}>
              
              {loding ? (
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ):(<>Submit Application</>)}
              
            </button>
          </div>
          <div aria-live="polite" aria-atomic="true" classNa  me="d-flex justify-content-center align-items-center w-100 mt-8">

                <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

                    <div className="toast-header">

                        <strong class="me-auto">Leave Application</strong>
                        <small>For Your Service</small>

                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                        ></button>

                    </div>

                    <div className="toast-body">
                        {message}
                    </div>

                </div>

            </div>

        </form>
      </div>
      
            
    </div>
  );
}

export default LeaveApplication;