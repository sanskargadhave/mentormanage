import "./admin.css";
import { useState } from "react";
function DeleteUser()
{
    const [studentData,setStudentData]=useState(false);
    const [mentorData,setMentorData]=useState(false);
    const [show,showWarning]=useState(true);
    const [change,setChange]=useState(false);
    const [FormData,setFormData]=useState({
        MentorName:"",
        MentorId:"",
        StudentName:"",
        StudentRollno:"",
    });
    const [errors,setErrors]=useState({
        MentorName:"",
        MentorId:"",
        StudentName:"",
        StudentRollno:"",
    });
    function checkdata(e)
    {
        const isEmpty= (v) => v.trim() === "";
        const {name,value}=e.target;
        setFormData({...FormData,[name]:value});
        let error = "";
        switch(name)
        {
            case "MentorName":
            case "StudentName":
            case "MentorId":
            case "StudentRollno":
                if (isEmpty(value)) error = "required";
                break;
        }
        setErrors({ ...errors, [name]: error});
    }
    function isAllvalid()
    {
        let fieldsToCheck = {};
        let errorsToCheck = {};

        if (mentorData) {
            fieldsToCheck = {
                MentorName: FormData.MentorName,
                MentorId: FormData.MentorId,
            };
            errorsToCheck = {
                MentorName: errors.MentorName,
                MentorId: errors.MentorId,
            };
        }

        if (studentData) {
            fieldsToCheck = {
                StudentName: FormData.StudentName,
                StudentRollno: FormData.StudentRollno,
            };
            errorsToCheck = {
                StudentName: errors.StudentName,
                StudentRollno: errors.StudentRollno,
            };
        }

        const hasEmptyField = Object.values(fieldsToCheck).some(v => v === "");
        const hasError = Object.values(errorsToCheck).some(msg => msg !== "");

        if (hasEmptyField || hasError) {
            alert("Please fill all required fields correctly");
            return;
        }

        alert("User permanently deleted");
    }

    function getStudent()
    {
        showWarning(false);
        setStudentData(true);
        setMentorData(false);
    }

    function getMentor()
    {
        showWarning(false);
        setMentorData(true);
        setStudentData(false);
    }

    return(
        <div className="container-fluid admin-content">
            <div className="add-student-form animate__animated animate__slow animate__fadeInDown">
                {show && (
                <div className="row">
                    <div className="col-md-6">
                        <label className="delete-user">
                            <i className="bi bi-exclamation-triangle"></i>  Warning
                        </label>
                        <label className="delete-user">
                            <label className="delete-user"> Please confirm the user before Deleting the account. This action is permanent and cannot be undone.
                        </label>
                        </label>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-primary btn-student" onClick={getStudent}>
                            <i className="bi bi-mortarboard"></i> Student
                        </button>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-primary btn-mentor" onClick={getMentor}>
                            <i className="bi bi-person-badge-fill"></i> Mentor
                        </button>
                    </div>
                </div>)}
                {mentorData && (
                <div className="row animate__animated animate__slow animate__fadeInDown">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Mentor Full Name </label>  
                        <input type="text" className="form-control" name="MentorName" placeholder="Enter Full Name" onChange={checkdata}/>
                    </div> 
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Mentor Id </label>  
                        <input type="text" className="form-control" name="MentorId" placeholder="Enter Id" onChange={checkdata}/>
                    </div>
                </div>)}
                {mentorData &&(
                    <div className="row animate__animated animate__slow animate__fadeInDown ">
                        <div className="col-md-4">
                            <label className="showError">{errors.MentorName}</label>
                        </div>
                        <div className="col-md-4">
                            <label className="showError">{errors.MentorId}</label>
                        </div>
                        <div className="col-md-4">
                            <input type="checkbox" className="form-check-input" id="agree" onChange={(e)=>setChange(e.target.checked)}/>
                            <label htmlFor="agree" className="check-box">  I Agree To Delete This User</label>
                        </div>
                        <div className="col-md-4">    
                            <button className="btn btn-primary btn-student" disabled={!change} onClick={isAllvalid}>
                                <i className="bi bi-person-x me-2"></i>
                                Delete Mentor
                            </button>
                        </div>
                    </div>
                )}

                {studentData && (
                <div className="row animate__animated animate__slow animate__fadeInDown ">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Student Full Name </label>  
                        <input type="text" className="form-control" name="StudentName" placeholder="Enter Full Name" onChange={checkdata}/>
                    </div> 
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Student roll no. </label>  
                        <input type="text" className="form-control" name="StudentRollno" placeholder="Enter Roll No." onChange={checkdata}/>
                    </div>
                </div>)}
                {studentData &&(
                    <div className="row animate__animated animate__slow animate__fadeInDown ">  
                        <div className="col-md-4">
                            <label className="showError">{errors.StudentName}</label>
                        </div>
                        <div className="col-md-4">
                            <label className="showError">{errors.StudentRollno}</label>
                        </div>
                        <div className="col-md-4">
                            <input type="checkbox" className="form-check-input" id="Iagree" onChange={(e)=>setChange(e.target.checked)}/>
                            <label htmlFor="Iagree" className="check-box">  I Agree To Delete This User</label>
                        </div>
                        <div className="col-md-4">    
                            <button className="btn btn-primary btn-student" disabled={!change} onClick={isAllvalid}>
                                <i className="bi bi-person-x me-2"></i>
                                Delete Student
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export {DeleteUser};