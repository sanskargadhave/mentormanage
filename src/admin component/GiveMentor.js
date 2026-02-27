import "./admin.css";
import axios from "axios";
import { useEffect,useState } from "react";
import Select from 'react-select';
import { GiveError } from "../WarningOrSucess";

function AssignMentor()
{
    const courses={
       Science:["Physics","Zoology","Mathematics","Chemistry","Botany","BSC"],
        ComputerScience:["Data Science","BCA","BSC [ECS]"],
       Art:["Economics","English","Marathi","History","Geography","Hindi"],
       Commerce:["Commerce"],
    } 
    const [selected,setselected]=useState(null);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedDivision, setSelectedDivision] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [mentor,setmentor]=useState([]);
    const [studentdata,setstudentdata]=useState([]);
    const [assigndata,setassigndata]=useState([]);
    const [showerror,setshowerror]=useState(false);
    const [message,setmessage]=useState("");
    const [event,setevent]=useState("showselect");
    const [from,setfrom]=useState("");
    const [to,setto]=useState("");
    const [data,setdata]=useState({
        mentorid:"",
        name:"",
        department:"",
        exprience:""
    });
    useEffect(()=>{
        axios.get("http://localhost:5000/api/getmentor")
        .then((resp)=>setmentor(resp.data))
        .catch((err)=>console.log(err.message))
    },[])
    
   
    const option=mentor.map((data)=>({
        value:data._id,
        label:` Prof. ${data.personaldetails.name} `
    }));

    function setmentordetails(selectedoption)
    {
        setselected(selectedoption);
        const fulldetails=mentor.find((data)=>data._id===selectedoption.value);
        setdata({
            mentorid:fulldetails.mentorId,
            name:fulldetails.personaldetails.name,
            department:fulldetails.professionaldetails.department,
            exprience:fulldetails.professionaldetails.exprience
        });
    }
    const assignmentor = async () => {
        if(!from.length>0 || !to.length>0)
        {
            setmessage("Please Provide Appropriate Range")
            return (setshowerror(true));
        }
        else if(Number(to)<=Number(from))
        {
            setmessage("Please Select Appropriate Roll NO Range...")
            return (setshowerror(true));
        }
        try {
            const resp = await axios.put("http://localhost:5000/api/assign-mentors",
                {
                    from: from,
                    to: to,
                    mentorid: data.mentorid
                }
            );
            setmessage(resp.data.message);
            setshowerror(true);
            setevent("showselect")
        }
        catch (err) {
            setmessage(err.response?.data?.message);
            setshowerror(true);
        }
    }
    function getstudentdata()
    {
        if(!selectedCourse && !selectedClass && !selectedDivision)
        {
            setmessage("Please Provide All Details");
            return(setshowerror(true));
        }
        axios.get("http://localhost:5000/api/get-students", {
            params: {
                course: selectedCourse,
                department: data.department,
                Class: selectedClass,
                division: selectedDivision
            }
        })
        .then((resp) => {
            setstudentdata(resp.data.students);  
            setassigndata(resp.data.assigndata);
            console.log(resp.data.assigndata);
            setevent("showassign");
        })
        .catch((err) => alert(err.message));
        
    }
    return (
        <div className="admin-content">
            {event==="showselect"&&(
                
            <div className="animate__animated animate__slow animate__fadeInDown ">
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}
                
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label"><i className="bi bi-person-vcard"></i>Select  Mentor For Assign    </label>
                        <Select options={option} placeholder="Search And Select" maxMenuHeight={200} value={selected} onChange={setmentordetails}/>
                    </div>
                    
                    { data.mentorid && (
                    <div className="col-md-6">
                        <div className="cards animate__animated animate__backInUp">
                            <label className="label-head-effect"> <i className="bi bi-person-workspace set-icon"></i> Mentor Details</label>
                            <br/>
                            <label className="label-effect">• Mentor Id : {data.mentorid}</label><br/>
                            <label className="label-effect">• Name : Prof. {data.name}</label><br/>
                            <label className="label-effect">• Department : {data.department}</label><br/>
                            <label className="label-effect">• Exprience : {data.exprience}</label><br/>
                        </div>
                    </div>)}
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-book-half"></i>  Select Course </label>
                        <select className="form-select form-select-sm" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                            <option value="">Select Course</option>
                            {data.department && courses[data.department]?.map((c, index) => (
                            <option key={index} value={c}> {c} </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">  
                        <label className="form-label"><i className="bi bi-mortarboard"></i> Select Class </label>      
                        <select className="form-select form-select-sm" aria-label="Small select example" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">select Class</option>
                            <option value="first">First</option>
                            <option value="second">Second</option>
                            <option value="third">Third</option>
                        </select>
                    </div>
                    <div className="col-md-4">        
                        <label className="form-label"><i className="bi bi-diagram-3"></i> Select Division </label>      
                        <select className="form-select form-select-sm" aria-label="Small select example"   value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
                            <option value="">select Division</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <form className="d-flex" role="search">
                            <button className="btn btn-outline-success lm" type="button" onClick={getstudentdata}><i className="bi bi-search-heart set-icon"></i>Search</button>
                        </form> 
                    </div>
                    
                </div>
            </div>)}
            {
            event ==="showassign" && (
                <div className="animate__animated animate__slow animate__fadeInDown">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="cards animate__animated animate__backInUp">
                                <h5 className="total">
                                    <i className="bi bi-tag-fill set-icon"></i>
                                    {selectedCourse}--{selectedClass}--{selectedDivision}
                                </h5>
                                
                                <h5 className="total"> Total Students : {studentdata.length}</h5>
                                <h5 className="total-present"> Assigned Students : {studentdata.filter((data)=>data.collagedetails.mentor!==null).length}</h5>
                                <h5 className="total-absent"> Not Assigned Students  : {studentdata.length-studentdata.filter((data)=>data.collagedetails.mentor!==null).length}</h5>
                            </div>
                        </div>
                        <div className="col-md-7">
                            
                            <div className="data-card animate__animated animate__backInUp">
                                <h5 className="total">
                                    <i className="bi bi-tag-fill set-icon"></i>
                                    List Of Assigned Roll No And Thier Mentors
                                </h5>
                                
                                <div className="row">
                                    <div className="col-md-3">
                                        <h5>Division</h5>
                                    </div>
                                    <div className="col-md-4">
                                        <h5>From -- TO</h5>
                                    </div>
                                    <div className="col-md-5">
                                        <h5>Mentor Name</h5>
                                    </div>
                                </div>
                                <hr/>
                                { 
                                    assigndata.map((data,index)=>(
                                        <div key={index} className="row">
                                            <div className="col-md-3">
                                                <span className="badge text-bg-primary">{data.division}</span>
                                            </div>
                                            <div className="col-md-4">
                                                <span className="badge text-bg-success">{data.from}</span>------
                                                <span className="badge text-bg-success">{data.to}</span>
                                            </div>
                                            <div className="col-md-5">
                                                <span className="badge text-bg-dark">Prof. {data.mentorname} </span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-12">
                            <h5 className="form-label"><i className="bi bi-arrow-bar-right set-icon"></i>  Please Select First Your Range Of Roll No </h5>
                            <label className="total-absent">* Make Sure Above List Of Roll No Assigned Mentor Already </label>
                        </div>
                    </div><br/>
                    {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}

                    <div className="row">
                        
                        <div className="col-md-4">
                            <label className="form-label"><i className="bi bi-person-vcard"></i>  From : </label>  
                            <input type="text" className="form-control" name="Subject" placeholder="Enter From This Roll No." onChange={(e)=>setfrom(e.target.value)}/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label"><i className="bi bi-person-vcard"></i>  To : </label>  
                            <input type="text" className="form-control" name="Subject" placeholder="Enter To This Roll No." onChange={(e)=>setto(e.target.value)}/>
                        </div>
                        <div className="col-md-4">
                            <form className="d-flex" role="search">
                            <button className="btn btn-outline-success lm" type="button" onClick={assignmentor}><i className="bi bi-search-heart set-icon"></i>Assign Students</button>
                        </form>
                        </div>
                    </div>
                    
                </div>
            )}         
        </div>
    );
}

export {AssignMentor};