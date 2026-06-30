import { useState} from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import "animate.css";
import '../admin component/admin.css';
function AddMentor()
{
    const navigate=useNavigate();
    const token = localStorage.getItem("token");
    const [MentorId,setMentorId]=useState("");
     const [preview,setPreview]=useState("");
     const [profile,setProfile]=useState(null);
    const [loding,setloding]=useState(false);
    const [formdata,setFormData]=useState(
    {
        Name:"",
        Gender:"",
        DOB:"",
        Department:"",
        Qualification:"",
        Exprience:"",
        JoinDate:"",
        MobileNo:"",
        EmailId:"",
        Address:"",
        Password:"",
        RePassword:""
    });
    const [errors, setErrors]=useState({
        Name:"",
        Gender:"",
        DOB:"",
        Department:"",
        Qualification:"",
        Exprience:"",
        JoinDate:"",
        MobileNo:"",
        EmailId:"",
        Address:"",
        Password:"",
        RePassword:""
    });
    const [err,seterr]=useState("");
    const [showconfirm,setshowconfirm]=useState(false);
    const [showform,setshowform]=useState(true);
    const [showpassword,setshowpassword]=useState(false);
    const [showerror,setshowerror]=useState(false);
    function handleChange(e)
    {
        const isEmpty= (v) => v.trim() === "";
        const hasDigit= (v) => /\d/.test(v);
        const isNumber= (v) => /^\d+$/.test(v);

        const { name, value } = e.target;
        setFormData({ ...formdata, [name]: value });
        let error = "";

        switch(name)
        {
            case "Address":
                if (isEmpty(value)) error = "Address is required";
                else error="";
                break;
            case "DOB":
            case "JoinDate":
                if (isEmpty(value)) error = "DOB is required";
                else error="";
                break;
            case "Gender":
                if (!["male", "female"].includes(value.toLowerCase()))
                error = "Invalid gender";
                else error="";
                break;
            case "MobileNo":
                if (!isNumber(value)) error = "Only digits allowed";
                else if (value.length !== 10) error = "Must be 10 digits";
                else error="";
                break;
            case "Name":
                if (isEmpty(value)) error = "Name is required";
                else if (hasDigit(value)) error = "Digits not allowed";
                else error="";
                break;
            case "EmailId":
                if(!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid Email";
                else if (isEmpty(value)) error = "Email is required";
                else error="";
                break;
            case "Department":
            case "Qualification":
            case "Exprience":
                if (isEmpty(value)) error = "Selection required";
                else error="";
                break;
            case "Password":
                if (isEmpty(value)) error = "Selection required";
                else error="";
                break;
            case "RePassword":
                if (isEmpty(value)) error = "Selection required";
                else if(formdata.Password!==value) error = "Password Not Match";
                else error = "";
                break;

            default: break;
        }
        setErrors({ ...errors, [name]: error});
    }
    function isAllvalid() 
    {
        const { Password, RePassword, ...rest } = formdata;
        const hasEmptyField = Object.values(rest).some(v => v === "");
        const isFormValid = Object.entries(errors)
            .filter(([key]) => key !== "Password" && key !== "RePassword")
            .every(([, msg]) => msg === "");

    if (hasEmptyField || !isFormValid) {
        alert("Please fill all fields or check validation");
        return;
    }
    setshowerror(false);
    setshowform(false);
    setshowpassword(true);
}

    const  submitdata= async ()=>
    {
        const isFormValid = Object.values(errors).every((msg) => msg === "");
        const hasEmptyField = Object.values(formdata).some((v) => v === "");

         if (hasEmptyField||!isFormValid) {
            alert("Please fill all fields or check Validaton");
            return;
        }
        else{
            setloding(true);
            try {
                const datas = new FormData();
                datas.append("profileImage", profile);
                datas.append(
                    "personaldetails",
                    JSON.stringify({
                        name: formdata.Name,
                        gender: formdata.Gender,
                        dob: formdata.DOB
                    })
                );
                datas.append(
                    "professionaldetails",
                    JSON.stringify({
                        department: formdata.Department,
                        qualification: formdata.Qualification,
                        exprience: formdata.Exprience,
                        joiningdate: formdata.JoinDate
                    })
                );
                datas.append(
                    "contactdetails",
                    JSON.stringify({
                        mobileno: formdata.MobileNo,
                        emailid: formdata.EmailId,
                        address: formdata.Address
                    })
                );
                datas.append("password", formdata.Password);
                const res = await axios.post( "https://sangolacollage.onrender.com/api/common/add-mentor",datas,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );



                const data = res.data;

                if (data.message === "Mentor Add Sucessfully") {
                    setMentorId(data.mentorId);
                    setshowerror(false);
                    setshowpassword(false);
                    setshowconfirm(true);
                }
                else {
                    seterr(data.message || data.error);
                    setshowerror(true);
                    setshowform(false);
                    setshowpassword(false);
                }

            }
            catch (errs) {
    console.log("Status:", errs.response?.status);
    console.log("Response Data:", errs.response?.data);
    console.log("Message:", errs.message);

    seterr(
        errs.response?.data?.message ||
        errs.response?.data?.error ||
        errs.message
    );

    setshowerror(true);
}
            setloding(false);
        }
    }
    return(
        <div className="container-fluid admin-content">
            {showform && (
            <div className="add-student-form animate__animated animate__slow animate__fadeInDown ">
                <div className="row">
                    <div className="col-md-3">
                        <h4><i className="bi bi-person-circle">  Personal Details</i></h4>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Mentor Full Name </label>  
                        <input type="text" value={formdata.Name} className={`form-control ${errors.Name ? "is-invalid" : ""}`} name="Name" placeholder="Enter Full Name" onChange={handleChange}/>
                        {errors.Name && (<label className="showError">{errors.Name}</label>)}
                    </div>

                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"> <i className="bi bi-gender-ambiguous"></i>  Gender</label>
                        <input type="text" value={formdata.Gender} className={`form-control ${errors.Gender ? "is-invalid" : ""}`} name="Gender" placeholder="Enter Gender" onChange={handleChange}/>
                        {errors.Gender && (<label className="showError">{errors.Gender}</label>)}
                    </div>

                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i>  DOB</label>
                        <input type="date" value={formdata.DOB} className={`form-control ${errors.DOB ? "is-invalid" : ""}`} name="DOB" placeholder="Enter DOB" onChange={handleChange}/>
                        {errors.DOB && (<label className="showError">{errors.DOB}</label>)}
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <h4><i className="bi bi-briefcase">  Professional Details</i></h4>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-building"></i> select Department Name</label>
                        <select value={formdata.Department} className={`form-select form-select-sm ${errors.Department ? "is-invalid" : ""}`}  aria-label="Small select example" name="Department" onChange={handleChange}>
                            <option value=""> Select Department </option>
                            <option value="ComputerScience">Computer Science</option>  
                            <option value="Science">Science</option>  
                            <option value="Art">Art</option>
                            <option value="Commerce">Commerce</option>
                        </select>
                        {errors.Department && (<label className="showError">{errors.Department}</label>)}   
                    </div>
                    <div className="col-12 col-md-4 mb-3 ">
                        <label className="form-label"><i className="bi bi-award"></i> Qualification</label>  
                        <input type="text" value={formdata.Qualification } className={`form-control ${errors.Qualification ? "is-invalid" : ""}`} name="Qualification" placeholder="Enter Mentor Qualification" onChange={handleChange}/>
                        {errors.Qualification && (<label className="showError">{errors.Qualification}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3 ">
                        <label className="form-label"><i className="bi bi-clock-history"></i>  Mentor Exprience</label>  
                        <input type="text" value={formdata.Exprience} className={`form-control ${errors.Exprience ? "is-invalid" : ""}`} name="Exprience" placeholder="Enter Mentor Expreience" onChange={handleChange}/>
                        {errors.Exprience && (<label className="showError">{errors.Exprience}</label>)}
                    </div>
                </div>
              
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i>  Joining Date </label>
                        <input type="date" value={formdata.JoinDate} className={`form-control ${errors.JoinDate ? "is-invalid" : ""}`} name="JoinDate" placeholder="Enter Joining Date" onChange={handleChange}/>
                        {errors.JoinDate && (<label className="showError">{errors.JoinDate}</label>)}
                    </div>
                </div>
               
                <div className="row">
                    <div className="col-12 col-md-3 mb-3">
                        <h4><i className="bi bi-telephone">  Contact Details</i></h4>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-phone"></i>  Mentor Mobile No. </label>  
                        <input type="text" value={formdata.MobileNo} className={`form-control ${errors.MobileNo ? "is-invalid" : ""}`} name="MobileNo" placeholder="Enter Mobile No." onChange={handleChange}/>
                        {errors.MobileNo && (<label className="showError">{errors.MobileNo}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"> <i className="bi bi-envelope"></i>  Email Id</label>
                        <input type="email" value={formdata.EmailId} className={`form-control ${errors.EmailId ? "is-invalid" : ""}`} name="EmailId" placeholder="Enter Email Id" onChange={handleChange}/>
                        {errors.EmailId && (<label className="showError">{errors.EmailId}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-geo-alt"></i>  Address</label>
                        <input type="text" value={formdata.Address} className={`form-control ${errors.Address ? "is-invalid" : ""}`} name="Address" placeholder="Enter Address" onChange={handleChange}/>
                        {errors.Address && (<label className="showError">{errors.Address}</label>)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                        <div className="profile-upload-card">
                            <div className="profile-preview-wrapper">
      
                                {
                                    preview ? (
                                        <img src={preview} alt="profile" className="profile-preview"/>
                                    ) : 
                                    (
                                        <div className="profile-placeholder">
                                            <i className="bi bi-person-fill"></i>
                                        </div>
                                    )
                                }
                                <label className="upload-btn">
                                    <i className="bi bi-camera-fill"></i>

                                    <input type="file" accept="image/*" hidden onChange={(e)=>{ const file = e.target.files[0]; setProfile(file);
                                        if(file){
                                            setPreview(URL.createObjectURL(file));
                                        }
                                        }}
                                    />
                                </label>
                            </div>
                            <div className="upload-content">
                                <h5>Upload  Profile Picture</h5>
                                <p>Choose a clear profile picture </p>
                            </div>
                        </div>
                    </div>  
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                        {loding ? (
                            <div class="spinner-border" role="status">
                               <span class="visually-hidden">Loading...</span>
                            </div>
                        ):(
                        <button className="btn btn-primary" type="button" onClick={isAllvalid}><i className="bi bi-file-plus-fill"></i>   Add Mentor</button>
                        )}
                    </div>
                    
                </div>
            </div>)}
            { showconfirm && (
                <div className="toast-overlay">
                            <div id="liveToast" className="toast show custom-toast" role="alert" aria-live="assertive" aria-atomic="true">
                                <div className="toast-header">
                                    <strong className="me-auto">Registration successfully.</strong>
                                    <button type="button" className="btn-close" onClick={() => {setshowconfirm(false);setshowpassword(false);setshowform(true)}}></button>
                                </div>

                                <div className="toast-body">
                                    <h3>Your Application Has Send To Admin  🎉</h3>
                                    <h5>Please Wait For Your Verification </h5>
                                    <p><strong>Name:</strong> {formdata.Name}</p>
                                    <p><strong>ID:</strong> {MentorId}</p>
                                    <button className="btn btn-primary w-100"
                                        onClick={() => navigate("/")}>
                                        Go to Dashboard
                                    </button>
                                </div>
                            </div>
                    </div>
            )}
            {showpassword &&(
             <div className="toast-overlay">
                              <div id="liveToast" className="toast show custom-toast" role="alert" aria-live="assertive" aria-atomic="true">
                                <div className="toast-header">
                                    <strong className="me-auto">Do Not Share Password</strong>
                                    <button type="button" className="btn-close" onClick={() => {setshowpassword(false);setshowform(true)}}></button>
                                </div>

                                <div className="toast-body">
                                    <h5 className="title">
                                        <i className="bi bi-shield-lock"></i> Set Password
                                    </h5>
                    

                                    <div className="form-group">
                                        <label>Enter Password</label>
                                        <input type="password" name="Password" placeholder="Set password" onChange={handleChange} className={`form-control ${errors.Password ? "is-invalid" : ""}`}/>
                                        {errors.Password && <small className="showError">{errors.Password}</small>}
                                    </div>

                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input type="password" name="RePassword" placeholder="Confirm password" onChange={handleChange}  className={`form-control ${errors.RePassword ? "is-invalid" : ""}`} />
                                        {errors.RePassword && <small className="showError">{errors.RePassword}</small>}
                                    </div>
                                    {loding ? (
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    ):(
                                        <button className="set-btn" onClick={submitdata}>
                                            <i className="bi bi-check-circle"></i> Set Password
                                        </button>
                                     )}
                                </div>
                                </div>
                            </div>)}
            {showerror && (
             <div className="toast-overlay">
                            <div id="liveToast" className="toast show custom-toast" role="alert" aria-live="assertive" aria-atomic="true">
                                <div className="toast-header">
                                    <strong className="me-auto">Something Went Worng !</strong>
                                    <button type="button" className="btn-close" onClick={() => {setshowerror(false);setshowform(true)}}></button>
                                </div>
                                
                                <div className="toast-body">
                                    <h5 className="title">{err}</h5>

                                </div>
                            </div>
                        </div>  )}
            
        </div>
    );  
}
export {AddMentor};