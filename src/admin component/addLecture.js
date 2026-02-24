import { useEffect,useState } from "react";
import "animate.css"
import axios from "axios";
import "./admin.css";
import Select from 'react-select';
import { GiveError } from "../WarningOrSucess";
function AddLecture(){
    const [teachers,setteachers]=useState([]);
    const [selected,setselected]=useState(null);
    const [lectureid,stlectureid]=useState("");
    const [showerror,setshowerror]=useState(false);
    const [Class,setClass]=useState("");
    const [message,setmessage]=useState("");
    
    const [FormData,setFormData]=useState({
        Subject:"",
        Division:"",
        Class:"",
        Department:""
    });
    const [errors, setErrors]=useState({
        Subject:"",
        Division:"",
        Class:"",
        Department:""
    });
    useEffect(()=>{
        axios.get("http://localhost:5000/api/getteacher")
        .then((resp)=>setteachers(resp.data))
        .catch((err)=>alert(err));
    },[]);

    const option=teachers.map((s)=>({
        value:s.TeacherId,
        label:`${s.TeacherId}   Prof. ${s.personaldetails.name} `
    }));
    function handleChange(e)
    {
        const isEmpty= (v) => v.trim() === "";
        const hasDigit= (v) => /\d/.test(v);

        const { name, value } = e.target;
        setFormData({ ...FormData, [name]: value });
        let error = "";

        switch(name)
        {
            case "Class":
            case "Division":
            case "Department":
                if (isEmpty(value)) error = "Selection required";
                else error="";
                break;
            case "Subject":
                if (isEmpty(value)) error = "Selection required";
                else if(hasDigit(value)) error="Digits Not Allowed";
                else error="";
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

        if (hasEmptyField || !isFormValid || !selected) {
            setmessage("Please Fill All fields or Check Validation ");
            setshowerror(true);
            return;
        }
        else
        {
            fetch("http://localhost:5000/api/store-lecture",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    subject:FormData.Subject,
                    teacherid:selected.value,
                    division:FormData.Division,
                    Class:FormData.Class,
                    department:FormData.Department
                })
            }).then(resp=>resp.json())
            .then(data=>{
                stlectureid(data.lectureid);
                setmessage(data.message);
                setshowerror(true);
            });
        }
    }
    return (
        <div className="admin-content">
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}
            <div className="add-student-form animate__animated animate__slow animate__flip ">
                <div className="row">
                    <div className="col-md-5">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Subject </label>  
                        <input type="text" className="form-control" name="Subject" placeholder="Enter Lecture Subject" onChange={handleChange}/>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label"><i className="bi bi-person-vcard"></i> Teacher ID And Name  </label>
                        <Select options={option} placeholder="Search And select" maxMenuHeight={200} value={selected} onChange={setselected}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <label className="showError">{errors.Subject}</label>
                    </div>
                    <div className="col-md-6">
                        <label className="showError"></label>
                    </div>
                </div>
                <br/> 
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Division </label>
                        <select className="form-select form-select-sm" aria-label="Small select example" name="Division"  onChange={handleChange}>
                            <option value=""> Select Division </option>
                            <option value="A">A</option>  
                            <option value="B">B</option>  
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Year </label>
                        <select className="form-select form-select-sm" aria-label="Small select example" name="Class"  onChange={handleChange}>
                            <option value=""> Select Year </option>
                            <option value="first">I</option>  
                            <option value="second">II</option>  
                            <option value="third">III</option>
                        </select>
                    </div>
                
                     <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-person-vcard"></i> Department </label>
                        <select className="form-select form-select-sm" aria-label="Small select example" name="Department"  onChange={handleChange}>
                            <option value=""> Select Department </option>
                            <option value="ComputerScience">ComputerScience</option>  
                            <option value="Science">Science</option>  
                            <option value="Art">Art</option>
                            <option value="Commerce">Commerce</option>
                        </select>
                    </div>
               </div>
               <div className="row">
                    <div className="col-md-4">
                        <label className="showError">{errors.Division}</label>
                    </div>
                    <div className="col-md-4">
                        <label className="showError">{errors.Class}</label>
                    </div>
                    <div className="col-md-4">
                        <label className="showError">{errors.Department}</label>
                    </div>
               </div>
               <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-primary" type="button" onClick={isAllvalid}><i className="bi bi-file-plus-fill"></i>Add Lecture</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export {AddLecture};

