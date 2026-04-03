import { useState,useContext,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../Authintication';
import Select from 'react-select';
import './admin.css';
import "animate.css";
import axios from "axios";

function AddStudent()
{
    const {role}=useContext(AuthContext);
    const nevigate=useNavigate();
    const [loding,setloding]=useState(false);
    const [showNotice, setShowNotice] = useState(true);
    const [showconfirm,setshowconfirm]=useState(false);
    const [showform,setshowform]=useState(true);
    const [showpassword,setshowpassword]=useState(false);
    const [showerror,setshowerror] = useState(false);
    const [err,seterr] = useState("");
    const [selected,setselected]=useState(null);
    const [mentor,setmentor]=useState([]);
    const courses={
       Science:["Physics","Zoology","Mathematics","Chemistry","Botany","BSC"],
        ComputerScience:["Data Science","BCA","BSC [ECS]"],
       Art:["Economics","English","Marathi","History","Geography","Hindi"],
       Commerce:["Commerce"],
    }
    useEffect(()=>{
            axios.get("https://sangolacollage.onrender.com/api/getmentor")
            .then((resp)=>setmentor(resp.data))
            .catch((err)=>console.log(err.message))
    },[])
    const option=mentor.map((data)=>({
        value:data._id,
        mentorId:data.mentorId,
        label:` Prof. ${data.personaldetails.name} `
    }));
    const [FormData,setFormData]=useState({
        Name:"",
        Address:"",
        Pincode:"",
        DOB:"",
        Gender:"",
        AadharNo:"",
        FatherName:"",
        MotherName:"",
        StudentMobileNo:"",
        ParentWhatsappNo:"",
        SscPercentage:"",
        HscPercentage:"",
        Department:"",
        Course:"",
        Year:"",
        Division:"",
        RollNo:"",
        Id:"",
        EmailId:"",
        Password:"",
        RePassword:""
    });

    const [errors, setErrors] = useState({
        Name:"",
        Address:"",
        Pincode:"",
        DOB:"",
        Gender:"",
        AadharNo:"",
        FatherName:"",
        MotherName:"",
        StudentMobileNo:"",
        ParentWhatsappNo:"",
        SscPercentage:"",
        HscPercentage:"",
        Department:"",
        Course:"",
        EmailId:"",
        Year:"",
        Division:"",
        RollNo:"",
        Id:"",
        Password:"",
        RePassword:""
    });

    function handleChange(e) {

        const isEmpty= (v) => v.trim() === "";
        const hasDigit= (v) => /\d/.test(v);
        const hasChar= (v) => /[A-Za-z]/.test(v);
        const isNumber= (v) => /^\d+$/.test(v);

        const { name, value } = e.target;

        setFormData({ ...FormData, [name]: value });

        let error="";

        switch (name)
        {

            case "Name":
            case "FatherName":
            case "MotherName":
                if (isEmpty(value)) error = "Name is required";
                else if (hasDigit(value)) error = "Digits not allowed";
                else error="";
                break;

            case "Address":
                if (isEmpty(value)) error = "Address is required";
                else error="";
                break;

            case "DOB":
                if (isEmpty(value)) error = "DOB is required";
                else error="";
                break;

            case "Pincode":
                if (isEmpty(value)) error = "Pincode required";
                else if (!isNumber(value)) error = "Only digits allowed";
                else if (value.length !== 6) error = "Pincode must be 6 digits";
                else error="";
                break;

            case "Gender":
                if (!["male","female"].includes(value.toLowerCase()))
                error = "Invalid gender";
                else error="";
                break;

            case "AadharNo":
                if (!isNumber(value)) error = "Only digits allowed";
                else if (value.length !== 12) error = "Aadhar must be 12 digits";
                else error="";
                break;

            case "StudentMobileNo":
            case "ParentWhatsappNo":
                if (!isNumber(value)) error = "Only digits allowed";
                else if (value.length !== 10) error = "Must be 10 digits";
                else error="";
                break;

            case "SscPercentage":
            case "HscPercentage":
                if (value < 0 || value > 100)
                error = "Percentage must be 0–100";
                else error="";
                break;

            case "Department":
            case "Course":
            case "Year":
            case "Division":
                if (isEmpty(value)) error = "Selection required";
                else error="";
                break;

            case "RollNo":
                if (hasChar(value)) error = "Only numbers allowed";
                else if (isEmpty(value)) error = "Selection required";
                else error="";
                break;

            case "Id":
                if (isEmpty(value)) error = "Selection required";
                else error="";
                break;

            case "Password":
                if (isEmpty(value)) error = "Selection required";
                else error="";
                break;

            case "RePassword":
                if (isEmpty(value)) error = "Selection required";
                else if(FormData.Password!==value) error = "Password Not Match";
                else error = "";
                break;
            case "EmailId":
                if(!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid Email";
                else if (isEmpty(value)) error = "Email is required";
                else error="";
                break;

            default:
                break;
        }

        setErrors({ ...errors, [name]: error});
    }

    function submitdata()
    {

        const isFormValid = Object.values(errors).every((msg)=>msg === "");
        const hasEmptyField = Object.values(FormData).some((v)=>v === "");

        if (hasEmptyField||!isFormValid)
        {
            alert("Please fill all fields or check Validaton");
            return;
        }

        setloding(true);

        fetch("https://sangolacollage.onrender.com/add-student",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                personaldetails:
                {
                    name:FormData.Name,
                    address:FormData.Address,
                    pincode:FormData.Pincode,
                    dob:FormData.DOB,
                    gender:FormData.Gender,
                    aadharno:FormData.AadharNo,
                    fathername:FormData.FatherName,
                    mothername:FormData.MotherName,
                    mobileno:FormData.StudentMobileNo,
                    parentno:FormData.ParentWhatsappNo,
                    sscpercentage:FormData.SscPercentage,
                    hscpercentage:FormData.HscPercentage
                },

                collagedetails:
                {
                    department:FormData.Department,
                    course:FormData.Course,
                    year:FormData.Year,
                    division:FormData.Division,
                    rollno:FormData.RollNo,
                    idno:FormData.Id,
                    mentor:selected.value,
                    mentorId:selected.mentorId
                },
                password:FormData.RePassword,
                emailid:FormData.EmailId
            })

        })
        .then(res=>res.json())
        .then(data=>{

            if (data.message === "Student added successfully") {
                    
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

        })
        .catch(()=>{
            setshowerror(true);
            seterr("Server Error");
        })
        .finally(()=>{
            setloding(false);
        });

    }

    function isAllvalid()
    {
        if(!selected)
        {
            alert("please select First Your Mentor");
        }
        const { Password, RePassword, ...rest } = FormData;

        const hasEmptyField = Object.values(rest).some(v => v === "");

        const isFormValid = Object.entries(errors)
            .filter(([key]) => key !== "Password" && key !== "RePassword")
            .every(([, msg]) => msg === "");

        if (hasEmptyField || !isFormValid)
        {
            alert("Please fill all fields or check validation");
            return;
        }

        setshowerror(false);
        setshowform(false);
        setshowpassword(true);
    }

    return(
    <div className="container-fluid admin-content">
        {showform && (
            <div className="add-student-form animate__animated animate__slow animate__fadeInDown ">
                {showNotice && (
                <div className="notice-box animate__animated animate__fadeInDown">
                    <i className="bi bi-megaphone-fill me-2"></i>
                        Please provide the correct Parent WhatsApp Number.
                        This number will be used to send important updates, notices, and academic information to parents. Entering the correct number ensures that parents stay informed and connected with the student’s progress.
                        Be responsible and double-check the number before submitting.
            
                    <button className="close-btn" onClick={() => setShowNotice(false)}>×</button>
                </div>)}

                <div className="col-md-3">
                    <h4><i className="bi bi-person-circle">  Personal Details </i></h4>
                </div><br/>
            

                {/* Includes Name, Address, Pincode */}
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-card-text"></i>  Name    <label className="showError">  * Enter Surname First</label></label>  
                        <input type="text" className={`form-control ${errors.Name ? "is-invalid" : ""}`}  name="Name" placeholder="Enter name" onChange={handleChange}/>
                        {errors.Name && (<label className="showError">{errors.Name}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"> <i className="bi bi-geo-alt-fill"></i>  Address</label>
                        <input type="text" className={`form-control ${errors.Address ? "is-invalid" : ""}`}  name="Address" placeholder="Enter Address" onChange={handleChange}/>
                        {errors.Address && (<label className="showError">{errors.Address}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-broadcast-pin"></i>  Pincode</label>
                        <input type="text" className={`form-control ${errors.Pincode ? "is-invalid" : ""}`}  name="Pincode" placeholder="Enter Pincode" onChange={handleChange}/>
                        {errors.Pincode && (<label className="showError">{errors.Pincode}</label>)}
                    </div>
                </div>
                    
                {/* Includes DOB, Gender, Aadhar No. */}
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-calendar3"></i>  Date Of Birth</label>
                        <input type="date" className={`form-control ${errors.DOB ? "is-invalid" : ""}`}  placeholder="Enter Date of Birth" name="DOB" onChange={handleChange}/> 
                        {errors.DOB && (<label className="showError">{errors.DOB}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-gender-ambiguous"></i>  Gender</label>
                        <select className={`form-select form-select-sm ${errors.Gender ? "is-invalid" : ""}`} aria-label="Small select example" name="Gender" onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.Gender && (<label className="showError">{errors.Gender}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-list-ol"></i>  Aadhar No.</label>
                        <input type="tel" className={`form-control ${errors.AadharNo ? "is-invalid" : ""}`}  placeholder="Enter Aadhar No." name="AadharNo" onChange={handleChange}/>
                        <label className="showError">{errors.AadharNo}</label>
                    </div>
                </div>

            

                {/* Includes Father Name, Mother Name, Student Mobile No. */}
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"> <i className="bi bi-person-arms-up"></i>  Father Full Name</label>
                        <input type="text" className={`form-control ${errors.FatherName? "is-invalid" : ""}`}  placeholder="Enter Father Full Name" name="FatherName" onChange={handleChange}/> 
                        {errors.FatherName && (<label className="showError">{errors.FatherName}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"> <i className="bi bi-person-hearts"></i>  Mother Name</label>
                        <input type="text" className={`form-control ${errors.MotherName ? "is-invalid" : ""}`}  placeholder="Enter Mother Name" name="MotherName"  onChange={handleChange}/>
                        {errors.MotherName && (<label className="showError">{errors.MotherName}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-phone"></i>   Student Mobile No.</label>
                        <input type="text" className={`form-control ${errors.StudentMobileNo ? "is-invalid" : ""}`}  placeholder="Enter mobile number" name="StudentMobileNo" onChange={handleChange}/>
                        {errors.StudentMobileNo && (<label className="showError">{errors.StudentMobileNo}</label>)}
                    </div>
                </div>

            
                {/* Includes Whatsapp No., SSC percentage, HSC percenatge */}
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-people-fill"></i>  Parent Whatsapp No. <label className="showError">  * Your Mentor Also  Verify This Number 😎. </label></label>
                        <input type="text" className={`form-control ${errors.ParentWhatsappNo ? "is-invalid" : ""}`}  placeholder="Enter Parent Whatsapp No." name="ParentWhatsappNo" onChange={handleChange}/> 
                        {errors.ParentWhatsappNo && (<label className="showError">{errors.ParentWhatsappNo}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-clipboard-pulse"></i>  SSC Exam Precentage</label>
                        <input type="text" className={`form-control ${errors.SscPercentage ? "is-invalid" : ""}`}  placeholder="Enter SSC Exam Percentage" name="SscPercentage" onChange={handleChange}/>
                        {errors.SscPercentage && (<label className="showError">{errors.SscPercentage}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-clipboard2-pulse-fill"></i>  HSC Exam Precentage</label>
                        <input type="text" className={`form-control ${errors.HscPercentage ? "is-invalid" : ""}`}  placeholder="Enter HSC Exam Percentage" name="HscPercentage" onChange={handleChange}/>
                        {errors.HscPercentage && (<label className="showError">{errors.HscPercentage}</label>)}
                    </div>
                </div>

            
                <br/>
                {/*collage Background Details*/}
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <h4><i className="bi bi-briefcase"> College Background</i></h4>
                    </div>
                </div>
            

                {/* Includes Department, Course, Year */}
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-claude"></i> select Department Name</label>
                        <select  className={`form-select form-select-sm ${errors.Department ? "is-invalid" : ""}`} aria-label="Small select example" name="Department" value={FormData.Department} onChange={handleChange}>
                            <option value="">Select Department</option>
                            <option value="Science">Science</option>
                            <option value="ComputerScience"> Computer Science</option>
                            <option value="Art">Art</option>
                            <option value="Commerce">Commerce</option>
                        </select>
                        {errors.Department && (<label className="showError">{errors.Department}</label>)}

                    </div>
                    <div className="col-12 col-md-4 ">
                        <label className="form-label"><i className="bi bi-exclude"></i> In {FormData.Department} Department which Course </label>
                        {FormData.Department && 
                        (
                            <select className={`form-select form-select-sm ${errors.Course ? "is-invalid" : ""}`} aria-label="Small select example" name="Course" value={FormData.Course} onChange={handleChange}>
                                <option value="">select Course</option>
                                {
                                    courses[FormData.Department].map((course,index)=>
                                    (
                                    <option key={index}>{course}</option>
                                    )
                                )}
                            </select>
                        )}
                        {errors.Course && (<label className="showError">{errors.Course}</label>)}

                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-circle-square"></i>  In {FormData.Course} Course which Year</label>
                        <select className={`form-select form-select-sm ${errors.Year ? "is-invalid" : ""}`} aria-label="Small select example" name="Year" onChange={handleChange}>
                            <option value=""> Select Year </option>
                            <option value="first">first Year</option>  
                            <option value="second">second Year</option>
                            <option value="third">third Year</option>
                        </select>
                        {errors.Year && (<label className="showError">{errors.Year}</label>)}
                    </div>
                </div>

           

                {/* Includes Division, rollNo, Pincode */}
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-union"></i> In {FormData.Year} Year which Division </label>
                        <select className={`form-select form-select-sm ${errors.Division ? "is-invalid" : ""}`} aria-label="Small select example" name="Division" onChange={handleChange}>
                            <option value=""> Select Division </option>
                            <option value="A">A</option>  
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                        {errors.Division && (<label className="showError">{errors.Division}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-emoji-heart-eyes"></i> In {FormData.Division} Division What is Roll NO.</label>
                        <input type="text" className={`form-control ${errors.RollNo ? "is-invalid" : ""}`}  name="RollNo" placeholder="Enter Roll No."onChange={handleChange}/>
                        {errors.RollNo && (<label className="showError">{errors.RollNo}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-hr"></i> Id / BT.NO Of {FormData.RollNo}</label>
                        <input type="text" className={`form-control ${errors.Id ? "is-invalid" : ""}`}   name="Id" placeholder="Enter Id BT.No" onChange={handleChange}/>
                        {errors.Id && (<label className="showError">{errors.Id}</label>)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"> <i className="bi bi-envelope"></i>  Email Id</label>
                        <input type="email" className={`form-control ${errors.EmailId ? "is-invalid" : ""}`} name="EmailId" placeholder="Enter Email Id" onChange={handleChange}/>
                        {errors.EmailId && (<label className="showError">{errors.EmailId}</label>)}
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>Select Your Mentor Name </label>
                        <Select options={option} placeholder="Search And Select" maxMenuHeight={200} value={selected} onChange={(option)=>setselected(option)}/>
                        {!selected  && (<label className="showError">Select Mentor</label>)}    
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb-3 d-flex justify-content-center">
                        {loding ? (
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>  
                            ):(
                        <button className="btn btn-primary" type="button" onClick={isAllvalid}><i className="bi bi-file-plus-fill "></i>  Add Student</button>
                        )}
                    </div>
                </div>
                <br/><br/>
            </div>


    )}

    { showconfirm && (

        <div className="add-student-form animate__animated animate__slow animate__fadeInDown ">

            <div className="success-card">

                <h3>Student Added Successfully 🎉</h3>

                <p><strong>Name:</strong> {FormData.Name}</p>
                <p><strong>Roll No:</strong> {FormData.RollNo}</p>

                <button className="btn btn-primary w-100"
                onClick={() =>
                    role==="Admin" ? nevigate("/admin")
                    : role==="Mentor" ? nevigate("/mentor")
                    : nevigate("/")
                }>
                    Go to Dashboard
                </button>

            </div>

        </div>

    )}

        {showpassword &&(
            <div className="password-wrapper">
                <div className="set-password-card animate__animated animate__fadeInDown">

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
            </div>)}
            {showerror && (
            <div className="login-card admin-content animate__animated animate__fadeInDown">
                <h2 className="title">{err}</h2>
                <div className="action-buttons">
                    <button className="retry-btn" onClick={()=>{
                        setshowpassword(false);
                        setshowerror(false);
                        setshowform(true);
                    }}>
                        <i className="bi bi-arrow-repeat"></i>
                            Try Again
                        </button>

                    <button className="exit-btn" onClick={()=>{nevigate("/")}}>
                        <i className="bi bi-door-open"></i>
                        Exit
                    </button>
                </div>
            </div>)}

    </div>
    )
}

export {AddStudent};