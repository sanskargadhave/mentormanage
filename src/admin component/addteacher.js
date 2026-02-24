import { useState} from "react";
import {useNavigate} from 'react-router-dom';
import "animate.css";
import './admin.css';
function AddTeacher()
{
    const nevigate=useNavigate();
    const [teacherId,setTeacherId]=useState("");
    const [FormData,setFormData]=useState(
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
    const [showconfirm,setshowconfirm]=useState(false);
    const [showform,setshowform]=useState(true);
    const [showpassword,setshowpassword]=useState(false);
    function handleChange(e)
    {
        const isEmpty= (v) => v.trim() === "";
        const hasDigit= (v) => /\d/.test(v);
        const isNumber= (v) => /^\d+$/.test(v);

        const { name, value } = e.target;
        setFormData({ ...FormData, [name]: value });
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
                else if(FormData.Password!==value) error = "Password Not Match";
                else error = "";
                break;

            default: break;
        }
        setErrors({ ...errors, [name]: error});
    }
    function isAllvalid() 
    {
        const { Password, RePassword, ...rest } = FormData;
        const hasEmptyField = Object.values(rest).some(v => v === "");
        const isFormValid = Object.entries(errors)
            .filter(([key]) => key !== "Password" && key !== "RePassword")
            .every(([, msg]) => msg === "");

    if (hasEmptyField || !isFormValid) {
        alert("Please fill all fields or check validation");
        return;
    }

    setshowform(false);
    setshowpassword(true);
}

    function submitdata()
    {
        const isFormValid = Object.values(errors).every((msg) => msg === "");
        const hasEmptyField = Object.values(FormData).some((v) => v === "");

         if (hasEmptyField||!isFormValid) {
            alert("Please fill all fields or check Validaton");
            return;
        }
        else{
            fetch("http://localhost:5000/api/add-teacher",{
            method:"POST",
            headers:{
                    "Content-Type":"application/json"
                },
            body:JSON.stringify({
                personaldetails:{
                    name:FormData.Name,
                    gender:FormData.Gender,
                    dob:FormData.DOB,
                },
                professionaldetails:{
                    department:FormData.Department,
                    qualification:FormData.Qualification,
                    exprience:FormData.Exprience,
                    joiningdate:FormData.JoinDate,
                },
                contactdetails:{
                    mobileno:FormData.MobileNo,
                    emailid:FormData.EmailId,
                    address:FormData.Address
                },
                password:FormData.Password
            })
           }).then(res=>res.json())
           .then(data=>{
            if(data.message)
            {
                setTeacherId(data.teacherId);
                setshowpassword(false);
                setshowconfirm(true);
            }
            else{
                alert(data.error);
            }})
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
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Teacher Full Name </label>  
                        <input type="text" className="form-control" name="Name" placeholder="Enter Full Name" onChange={handleChange}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"> <i className="bi bi-gender-ambiguous"></i>  Gender</label>
                        <input type="text" className="form-control" name="Gender" placeholder="Enter Gender" onChange={handleChange}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i>  DOB</label>
                        <input type="date" className="form-control" name="DOB" placeholder="Enter DOB" onChange={handleChange}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <label className="showError">{errors.Name}</label>
                    </div>
                    <div className="col-md-4">
                        <label className="showError">{errors.Gender}</label>
                    </div>
                    <div className="col-md-4">
                        <label className="showError">{errors.DOB}</label>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-3">
                        <h4><i className="bi bi-briefcase">  Professional Details</i></h4>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-building"></i> select Department Name</label>
                        <select className="form-select form-select-sm" aria-label="Small select example" name="Department" onChange={handleChange}>
                            <option value=""> Select Department </option>
                            <option value="ComputerScience">Computer Science</option>  
                            <option value="Science">Science</option>  
                            <option value="Art">Art</option>
                            <option value="Commerce">Commerce</option>
                        </select>
                    </div>
                    <div className="col-md-4 ">
                        <label className="form-label"><i className="bi bi-award"></i> Qualification</label>  
                        <input type="text" className="form-control" name="Qualification" placeholder="Enter Teacher Qualification" onChange={handleChange}/>
                    </div>
                    <div className="col-md-4 ">
                        <label className="form-label"><i className="bi bi-clock-history"></i>  Teacher Exprience</label>  
                        <input type="text" className="form-control" name="Exprience" placeholder="Enter Teacher Expreience" onChange={handleChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <label className="showError">{errors.Department}</label>
                    </div>
                    <div className="col-md-4">
                        <label className="showError">{errors.Qualification}</label>
                    </div>
                    <div className="col-md-4">
                        <label className="showError">{errors.Exprience}</label>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i>  Joining Date </label>
                        <input type="date" className="form-control" name="JoinDate" placeholder="Enter Joining Date" onChange={handleChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <label className="showError">{errors.JoinDate}</label>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-3">
                        <h4><i className="bi bi-telephone">  Contact Details</i></h4>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-phone"></i>  Teacher Mobile No. </label>  
                        <input type="text" className="form-control" name="MobileNo" placeholder="Enter Mobile No." onChange={handleChange}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"> <i className="bi bi-envelope"></i>  Email Id</label>
                        <input type="email" className="form-control" name="EmailId" placeholder="Enter Email Id" onChange={handleChange}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-geo-alt"></i>  Address</label>
                        <input type="text" className="form-control" name="Address" placeholder="Enter Address" onChange={handleChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <label className="showError">{errors.MobileNo}</label>
                    </div>
                    <div className="col-md-4">
                        <label className="showError">{errors.EmailId}</label>
                    </div>
                    <div className="col-md-4">
                        <label className="showError">{errors.Address}</label>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                        <button className="btn btn-primary" type="button" onClick={isAllvalid}><i className="bi bi-file-plus-fill"></i>   Add Teacher</button>
                    </div>
                </div>
            </div>)}
            { showconfirm && (
                <div className="add-student-form animate__animated animate__slow animate__fadeInDown ">
                    <div className="row">
                        <div className="col-md-12">
                            <center><h2>Teacher Add In EduMentor @Sangolacollage</h2></center>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-12">
                            <h5>Teacher Name: {FormData.Name}</h5>
                            <h5>Teacher Id: {teacherId}</h5>
                        </div> 
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-4">
                            <button className="btn btn-primary btn-mentor" onClick={()=>nevigate("/admin")}>
                                <i className="bi bi-box-arrow-right"></i>    exit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            { showpassword &&(
                    <div className="set-password-card animate__animated animate__fadeInDown">
                        <h5 className="title">
                         <i className="bi bi-shield-lock"></i> Set Password
                        </h5>

                        <div className="form-group">
                            <label>Enter Password</label>
                                <input type="password" name="Password" placeholder="Set password" onChange={handleChange}/>
                                <label className="showError">{errors.Password}</label>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="RePassword" placeholder="Confirm password" onChange={handleChange}/>
                            <label className="showError">{errors.RePassword}</label>
                        </div>

                        <button className="set-btn" onClick={submitdata}>
                            <i className="bi bi-check-circle"></i> Set Password
                        </button>
                    </div>
                
            )}
        </div>
    );  
}
export {AddTeacher};