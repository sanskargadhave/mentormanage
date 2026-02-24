import { useState} from "react";
import { useNavigate } from "react-router-dom";

import './mentor.css';
import "animate.css";

function Addstudent()
{
    const nevigate=useNavigate();
    const [showconfirm,setshowconfirm]=useState(false);
    const [showform,setshowform]=useState(true);
   const courses={
       Science:["Physics","Zoology","Mathematics","Chemistry","Botany","BSC"],
       ComputerScience:["Data Science","BCA","BSC [ECS]"],
       Art:["Economics","English","Marathi","History","Geography","Hindi"],
       Commerce:["Commerce"],
    } 
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
        Id:""
    });

    const [errors, setErrors] = useState({
        Name: "",
        Address: "",
        Pincode: "",
        DOB: "",
        Gender: "",
        AadharNo: "",
        FatherName: "",
        MotherName: "",
        StudentMobileNo: "",
        ParentWhatsappNo: "",
        SscPercentage: "",
        HscPercentage: "",
        Department: "",
        Course: "",
        Year: "",
        Division: "",
        RollNo: "",
        Id: ""
    });

    function handleChange(e) {
        const isEmpty= (v) => v.trim() === "";
        const hasDigit= (v) => /\d/.test(v);
        const hasChar= (v) => /[A-Za-z]/.test(v);
        const isNumber= (v) => /^\d+$/.test(v);
        const { name, value } = e.target;
        setFormData({ ...FormData, [name]: value });
        let error = "";
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
                if (!["male", "female"].includes(value.toLowerCase()))
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
            default:
                break;
        }
        setErrors({ ...errors, [name]: error});
    }
     function isAllvalid()
    {
        
        const isFormValid = Object.values(errors).every(
        (msg) => msg === "");
        const hasEmptyField = Object.values(FormData).some(
        (v) => v === "");

        if (hasEmptyField||!isFormValid) {
            alert("Please fill all fields or check Validaton");
            return;
        }
        else
        {
            fetch("http://localhost:5000/add-student",{
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
                        idno:FormData.Id
                    }
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.message.includes("exists") || data.message.includes("Duplicate")) {
                alert(data.message);
                }
                else
                {
                    setshowform(false);
                    setshowconfirm(true);
                }
            });
            
        }
    }
    return(
    <div className="container-fluid mentor-content">
    {showform && (
        <div className="add-student-form animate__animated animate__slow animate__fadeInDown ">
            <h3 className="form-label">
                <i className="bi bi-person-fill me-2"></i>
                personal Details
            </h3>
            <br></br>
            {/* Includes Name, Address, Pincode */}
            <div className="row">
                <div className="col-12 col-md-4 ">
                    <label className="form-label"><i className="bi bi-card-text"></i>  Name</label>  
                    <input type="text" className="form-control" name="Name" placeholder="Enter name" onChange={handleChange}/>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"> <i className="bi bi-geo-alt-fill"></i>  Address</label>
                    <input type="text" className="form-control" name="Address" placeholder="Enter email" onChange={handleChange}/>
                </div>
                <div className="col-12 col-md-4 ">
                    <label className="form-label"><i className="bi bi-broadcast-pin"></i>  Pincode</label>
                    <input type="text" className="form-control" name="Pincode" placeholder="Enter Pincode" onChange={handleChange}/>
                </div>
            </div>
            {/* Warning Label */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Name}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Address}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Pincode}</label>
                </div>
            </div>
            <br></br>
            {/* Includes DOB, Gender, Aadhar No. */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-calendar3"></i>  Date Of Birth</label>
                    <input type="date" className="form-control" placeholder="Enter Date of Birth" name="DOB" onChange={handleChange}/> 
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-gender-ambiguous"></i>  Gender</label>
                    <select className="form-select form-select-sm" aria-label="Small select example" name="Gender" onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-list-ol"></i>  Aadhar No.</label>
                    <input type="tel" className="form-control" placeholder="Enter Aadhar No." name="AadharNo" onChange={handleChange}/>
                </div>
            </div>

            {/* Warning Label */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.DOB}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Gender}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.AadharNo}</label>
                </div>
            </div>
            <br></br>

            {/* Includes Father Name, Mother Name, Student Mobile No. */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="form-label"> <i className="bi bi-person-arms-up"></i>  Father Full Name</label>
                    <input type="text" className="form-control" placeholder="Enter Father Full Name" name="FatherName" onChange={handleChange}/> 
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"> <i className="bi bi-person-hearts"></i>  Mother Name</label>
                    <input type="text" className="form-control" placeholder="Enter Mother Name" name="MotherName"  onChange={handleChange}/>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-phone"></i>   Student Mobile No.</label>
                    <input type="text" className="form-control" placeholder="Enter mobile number" name="StudentMobileNo" onChange={handleChange}/>
                </div>
            </div>

            {/* Warning Label */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.FatherName}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.MotherName}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.StudentMobileNo}</label>
                </div>
            </div>
            <br></br>
            {/* Includes Whatsapp No., SSC percentage, HSC percenatge */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-people-fill"></i>  Parent Whatsapp No.</label>
                    <input type="text" className="form-control" placeholder="Enter Parent Whatsapp No." name="ParentWhatsappNo" onChange={handleChange}/> 
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-clipboard-pulse"></i>  SSC Exam Precentage</label>
                    <input type="text" className="form-control" placeholder="Enter SSC Exam Percentage" name="SscPercentage" onChange={handleChange}/>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-clipboard2-pulse-fill"></i>  HSC Exam Precentage</label>
                    <input type="text" className="form-control" placeholder="Enter HSC Exam Percentage" name="HscPercentage" onChange={handleChange}/>
                </div>
            </div>

            {/* Warning Label */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.ParentWhatsappNo}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.SscPercentage}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.HscPercentage}</label>
                </div>
            </div>
            <br></br>

            {/*collage Background Details*/}
            <h3 className="form-label">
                <i className="bi bi-columns-gap me-2"></i>
                <strong>Collage Backgrounds</strong>
            </h3>
            <br></br>
            {/* Includes Department, Course, Year */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-claude"></i> select Department Name</label>
                    <select  className="form-select form-select-sm" aria-label="Small select example" name="Department" value={FormData.Department} onChange={handleChange}>
                        <option value="">Select Department</option>
                        <option value="Science">Science</option>
                        <option value="Art">Art</option>
                        <option value="Commerce">Commerce</option>
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-exclude"></i> In {FormData.Department} Department which Course </label>
                    {FormData.Department && 
                    (
                        <select className="form-select form-select-sm" aria-label="Small select example" name="Course" value={FormData.Course} onChange={handleChange}>
                            <option value="">select Course</option>
                            {
                                courses[FormData.Department].map((course,index)=>
                                (
                                <option key={index}>{course}</option>
                                )
                            )}
                        </select>
                    )}
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-circle-square"></i>  In {FormData.Course} Course which Year</label>
                    <select className="form-select form-select-sm" aria-label="Small select example" name="Year" onChange={handleChange}>
                        <option value=""> Select Year </option>
                        <option value="first">first Year</option>  
                        <option value="second">second Year</option>
                        <option value="third">third Year</option>
                    </select>
                </div>
            </div>

            {/* Warning Label */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Department}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Course}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Year}</label>
                </div>
            </div>
            <br></br>

            {/* Includes Division, rollNo, Pincode */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-union"></i> In {FormData.Year} Year which Division </label>
                    <select className="form-select form-select-sm" aria-label="Small select example" name="Division" onChange={handleChange}>
                        <option value=""> Select Division </option>
                        <option value="A">A</option>  
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-emoji-heart-eyes"></i> In {FormData.Division} Division What is Roll NO.</label>
                    <input type="text" className="form-control" name="RollNo" placeholder="Enter Roll No."onChange={handleChange}/>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label"><i className="bi bi-hr"></i> Id / BT.NO Of {FormData.RollNo}</label>
                    <input type="text" className="form-control" name="Id" placeholder="Enter Id BT.No" onChange={handleChange}/>
                </div>
            </div>

            {/* Warning Label */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Division}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.RollNo}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.Id}</label>
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                    <button className="btn btn-primary" type="button" onClick={isAllvalid}><i className="bi bi-file-plus-fill"></i>   Add Student</button>
                </div>
            </div>
            <br/><br/>
        </div>)};
            { showconfirm && (
                <div className="add-student-form mentor-content animate__animated animate__slow animate__fadeInDown ">
                    <div className="row">
                        <div className="col-md-12">
                            <center><h2>Student Add In EduMentor @Sangolacollage</h2></center>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-12">
                            <h5>Student Name: {FormData.Name}</h5>
                            <h5>Student Roll No.: {FormData.RollNo}</h5>
                        </div> 
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <button className="btn btn-primary btn-mentor" onClick={()=>nevigate("/mentor")}>
                                <i className="bi bi-box-arrow-right"></i>    exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </div>
    );
}
export {Addstudent};    