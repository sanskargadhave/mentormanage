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
    const [loding,setloding]=useState(false);
    const [showerror,setshowerror]=useState(false);
    const [message,setmessage]=useState("");
    const courses={
       Science:["Physics","Zoology","Mathematics","Chemistry","Botany","BSC"],
        ComputerScience:["Data Science","BCA","BSC [ECS]"],
       Art:["Economics","English","Marathi","History","Geography","Hindi"],
       Commerce:["Commerce"],
    } 
    const [FormData,setFormData]=useState({
        Subject:"",
        Division:"",
        Class:"",
        Department:"",
        course:""
    });
    const [errors, setErrors]=useState({
        Subject:"",
        Division:"",
        Class:"",
        Department:"",
        course:""
    });
    useEffect(()=>{
        axios.get("https://sangolacollage.onrender.com/api/getteacher")
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
            case "course":
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
    const isAllvalid = async ()=> 
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
            try{
                setloding(true);
                const res = await axios.post(
                "https://sangolacollage.onrender.com/api/store-lecture",
                {
                    subject: FormData.Subject,
                    teacherid: selected.value,
                    division: FormData.Division,
                    Class: FormData.Class,
                    department: FormData.Department,
                    course: FormData.course
                }
            );

            const data = res.data;

            stlectureid(data.lectureid);
            setmessage(data.message);
            setshowerror(true);

            }
            catch(err)
            {
                console.log(err);
            }
            setloding(false);
        }
    }
    return (
        <div className="admin-content">
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}
            <div className="add-student-form animate__animated animate__slow animate__fadeInDown">
                <div className="row">
                    <div className="col-12 col-md-5 mb-3">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Subject </label>  
                        <input type="text" className={`form-control ${errors.Subject ? "is-invalid" : ""}`} name="Subject" placeholder="Enter Lecture Subject" onChange={handleChange}/>
                        {errors.Subject && ( <label className="showError">{errors.Subject}</label>)}
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label className="form-label"><i className="bi bi-person-vcard"></i> Teacher ID And Name  </label>
                        <Select options={option} placeholder="Search And select" maxMenuHeight={200} value={selected} onChange={setselected}/>
                    </div>
                </div>
                 
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Division </label>
                        <select className="form-select form-select-sm" aria-label="Small select example" name="Division"  onChange={handleChange}>
                            <option value=""> Select Division </option>
                            <option value="A">A</option>  
                            <option value="B">B</option>  
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                        {errors.Division && (<label className="showError">{errors.Division}</label>)}
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>  Year </label>
                        <select className="form-select form-select-sm" aria-label="Small select example" name="Class" onChange={handleChange}>
                            <option value=""> Select Year </option>
                            <option value="first">I</option>  
                            <option value="second">II</option>  
                            <option value="third">III</option>
                        </select>
                        {errors.Class && (<label className="showError">{errors.Class}</label>)}
                    </div>
                
                     <div className="col-12 col-md-4 mb-3">
                        <label className="form-label"><i className="bi bi-person-vcard"></i> Department </label>
                        <select className="form-select form-select-sm" aria-label="Small select example" name="Department"  onChange={handleChange}>
                            <option value=""> Select Department </option>
                            <option value="ComputerScience">ComputerScience</option>  
                            <option value="Science">Science</option>  
                            <option value="Art">Art</option>
                            <option value="Commerce">Commerce</option>
                        </select>
                        {errors.Department && (<label className="showError">{errors.Department}</label>)}
                    </div>
               </div>
               
               <div className="row">
                    <div className="col-12 col-md-4 w-100 mb-3">
                        <label className="form-label"><i className="bi bi-exclude"></i> In {FormData.Department} Department which Course </label>
                        {FormData.Department && 
                        (
                            <select className="form-select form-select-sm" aria-label="Small select example" name="course" value={FormData.course} onChange={handleChange}>
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
                    <div className="col-12 col-md-4 mb-3">
                        {loding ? (
                            <div class="spinner-border" role="status">
                               <span class="visually-hidden">Loading...</span>
                            </div>
                        ):(
                        <button className="btn btn-primary" type="button" onClick={isAllvalid}><i className="bi bi-file-plus-fill"></i>Add Lecture</button>
                        )}
                        </div>
                </div>
            </div>
        </div>
    );
}
export {AddLecture};

