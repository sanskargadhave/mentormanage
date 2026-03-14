import axios from "axios";
import { useEffect,useState} from "react";
import Select from "react-select";
import { useRef } from "react";
import { GiveError } from "../WarningOrSucess";
import {ResultChart} from "../Visulaisation Charts/passvsfailchart";
import logo from "../collageassets/logo-college.png";
export function DataSummery({testid,message})
{
    const [counts,setcounts]=useState({});
    const [topStudents,setTopStudents]=useState([]);
    const [showerror,setshowerror]=useState(true);
    const [url,seturl]=useState("");
    useEffect(()=>{
        const getData = async ()=>{
            const response=await axios.get(`https://sangolacollage.onrender.com/api/get-test-summery/${testid}`);
            setcounts(response.data.testcounts[0]);
            setTopStudents(response.data.topstudents)
        }
        getData();
    },[testid]);
    useEffect(()=>{
        async function uploadReport() {
            try{    
                const response = await axios.get(
                    `https://sangolacollage.onrender.com/api/make-test-report/${testid}`
                );
                seturl(response.data.url);
               
            }
            catch(err){
                console.log(err);
                alert("Failed to generate report");
            }
        }
        uploadReport();
    },[testid]);
    const sendParentMessage = async () => {
        try{
            const response = await axios.post("https://sangolacollage.onrender.com/api/sendMessage",{
                name: "Vikram pawar",
                marks: 10,
                totalMarks: 100,
                phone:6361782144
            });

            console.log(response.data);
            
        }
        catch(err)
        {
            console.log(err);
            alert("Failed to send message");
        }
    }
    
    return (
        <div className=" animate__animated animate__rotateInDownLeft">
            {showerror && (<GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>)}
            
            <div className="row ">
                <div className="col-md-8">
                    <div className="professional-card">
                        <h5>
                            <i className="bi bi-airplane-engines set-icon"></i>
                            Meet the Top 3 Stars of the Class! ⭐⭐⭐
                        </h5><hr/>
                        <table className="count-table">
                            <thead className="bor">
                                <tr>
                                    <th></th>
                                    <th>RollNo</th>
                                    <th>Name</th>
                                    <th>Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topStudents.map((data,index)=>(
                                    <tr key={index}>
                                        <td><i className="bi bi-award-fill set-icon"></i></td>
                                        <td>{data.rollno}</td>
                                        <td>{data.name}</td>
                                        <td>{data.marks}</td>
                                    </tr>
                                ))

                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-4">
                   <div className="professional-card"> 
                        <h5>
                            <i className="bi bi-tag-fill set-icon"></i>
                             Report
                        </h5><hr/>
                        <h6 className="total"> 
                            <i className="bi bi-people-fill set-icon"></i> 
                            Total Student : {counts?.countpresent+counts?.countabsent} 
                        </h6> 
                        <h6 className="total-present"> 
                            <i className="bi bi-check-circle-fill set-icon"></i>
                             Total Present :{counts?.countpresent} 
                        </h6> 
                        <h6 className="total-absent"> 
                            <i className="bi bi-person-dash-fill set-icon"></i> 
                            Total Absent :{counts?.countabsent} 
                        </h6> 
                        <h6 className="total-present"> 
                            <i className="bi bi-trophy-fill set-icon"></i>
                            Total Pass :{counts?.countpass} 
                        </h6> 
                        <h6 className="total-absent"> 
                            <i className="bi bi-x-circle-fill set-icon"></i>            
                            Total Fail :{counts?.countfail} 
                        </h6>
                    </div> 
                   
                </div>
            </div><br/>
            <div className="row">
                <div className="col-md-6">
                    <div className="professional-card">
                        <h5>
                            <i className="bi bi-pie-chart-fill"></i> Result Chart
                        </h5>
                        <ResultChart pass={counts?.countpass} fail={counts?.countfail} present={counts?.countpresent} absent={counts?.countabsent}/>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="report-actions">

                        <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 set-icon" onClick={()=>sendParentMessage()}>
                          <i className="bi bi-send-arrow-up-fill"></i> Send Message TO Parent
                        </button>
                        
                    </div>
                </div>
            </div><br/><br/>
            
        </div>
    );
}



export  function AssignMarks({date,studentdata,lectureid,totalmarks,testname,passingmarks,subject,teacherid})
{
    
    let firstob=studentdata[0];
    const inputRefs = useRef({});
    const [result,setresult]=useState({});
    const [errors,seterror]=useState({});
    const [step,setstep] = useState("getresult");
    const [message,setmessage]=useState("")
    
    const [testid,settestid]=useState("");

    const isEmpty= (v) => v.trim() === "";
    const hasChar= (v) => /[A-Za-z]/.test(v);

    function calculateGrade(marks) 
    {

        const total = Number(totalmarks);
        const obtained = Number(marks);

        if (!obtained || obtained < 0) return "";

        const percentage = (obtained / total) * 100;

        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 10) return "D";
        return "";
    }

    useEffect(() => {
        if (studentdata.length > 0) {
            const initialResult = {};
            studentdata.forEach((student) => {
                initialResult[student._id] = null;
            });
            setresult(initialResult);
        }
    }, [studentdata]);

    function setstudentresult(studentid,marks)
    {
        setresult(data=>({
            ...data,
            [studentid]:marks 
        }));
        let error="";
        if(Number(marks)>Number(totalmarks)) error=`Marks Less Than ${totalmarks}`;
        else if(isEmpty(marks)) error="Marks Required";
        else if(Number(marks)<=0) error=`Marks greater Than 0`;
        else if(hasChar(marks)) error="Char Not Allowed ";
        else error="";
        seterror(prev=>({
            ...prev,
            [studentid]:error
        }));
    }
    function storeresult(){
        const resultarray=Object.entries(result).map(([studentid,marks])=>({
            studentid,
            marks: marks===null ? 0 : Number(marks),
            status:marks===null ? "Absent":"Present"
        }))
        
        const isFormValid = Object.values(errors).every((msg) => msg === "");
        if(!isFormValid)
        {
            alert("please Check Validations");
            return;
        }
        fetch("https://sangolacollage.onrender.com/api/store-test-result",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                    teacherid:teacherid,
                    subject:subject,
                    testName:testname,
                    totalmarks:totalmarks,
                    date:date,
                    passingmarks:passingmarks,
                    course:firstob.collagedetails.course,
                    department:firstob.collagedetails.department,
                    year:firstob.collagedetails.year,
                    division:firstob.collagedetails.division, 
                    students:resultarray
            })
        }).then((resp)=>resp.json())
        .then((data)=>{setmessage(data.message); settestid(data.testid); setstep("summery")})
        .catch((err)=>alert(err.message))
    }
    function handleKey(e, index) {
        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            const nextStudent = studentdata[index + 1];
            if (nextStudent) {
                inputRefs.current[nextStudent._id]?.focus();
            }
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            const prevStudent = studentdata[index - 1];
            if (prevStudent) {
                inputRefs.current[prevStudent._id]?.focus();
            }
        }
    }
    return(
        <div className="mentor-content animate__animated animate__rotateInDownLeft">
            {step==="getresult" && (
            <div>
                <div className="row">
                    <div className="col-12 col-md-12">
                        <center><h4><img src={logo} alt="College Logo" width="40" /> SANGOLA MAHAVIDYLAYA SANGOLA</h4></center>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-4">
                        <label>{firstob.collagedetails.department}</label>
                    </div>
                    <div className="col-12 col-md-4">
                        <label>{firstob.collagedetails.course}   {lectureid.split("-")[2]}   {lectureid.split("-")[3]}</label>
                    </div>
                    <div className="col-12 col-md-4">
                        <label> Subject :- {lectureid.split("-")[1]}</label>
                    </div>
                </div><br/>
                <div className="row">
                    <div className="col-md-2">
                        <label>Total : {totalmarks}  </label>
                    </div>
                    <div className="col-md-4">
                        <label>Date : {date}</label>
                    </div>
                    <div className="col-md-4">
                        <label>Test Name : {testname}</label>
                    </div>
                </div><br/>
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Rollno</th>
                            <th>Student Name</th>
                            <th>Marks</th>
                            <th>Status</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                       {studentdata.map((studentinfo,index)=>(
                        <tr key={studentinfo._id} >
                        <td>{studentinfo.collagedetails.rollno}</td>
                        <td>{studentinfo.personaldetails.name}</td>
                        <td>
                            <input type="text" 
                                className="form-control input-reduce" 
                                max={totalmarks} 
                                placeholder={`Enter Marks / ${totalmarks}`} 
                                onChange={(e)=>setstudentresult(studentinfo._id,e.target.value)}
                                ref={(el)=>(inputRefs.current[studentinfo._id]=el)} onKeyDown={(e) => handleKey(e, index)}
                            />
                                
                            {(errors[studentinfo._id])!=="" && (
                            <label className="total-absent">{errors[studentinfo._id]}</label>
                            )}
                        </td>
                        <td>
                            {
                                result[studentinfo._id] === null ? (<span className="badge text-bg-primary">Absent</span>)
                                : Number(result[studentinfo._id]) >= Number(passingmarks)
                                ? (<span className="badge text-bg-success">Pass</span>)
                                : (<span className="badge text-bg-danger">Fail</span>)
                            }
                        </td>
                        <td>
                            {
                                result[studentinfo._id] === null
                                ? ""
                                : calculateGrade(result[studentinfo._id])
                            }
                        </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <br/><br/>  
                <div className="row">
                    <div className="col-md-6">
                        <button className="search-btn" onClick={storeresult}>
                            <i className="bi bi-folder-plus"></i>
                            <span>Add result</span>
                        </button>
                    </div>
                </div>
            </div>)}
            {step==="summery" && (
                <div>
                    <DataSummery testid={testid} message={message}/>
                </div>
            )}
        </div>
    
    );
}



function AddTestResult()
{
    const today = new Date().toISOString().split("T")[0];
    const [studentdata,setstudentdata]=useState([]);
    const [subjects,setsubjects]=useState([]);
    const [step,setstep] = useState("getdetails");
    const [formdata,setformdata]=useState({
        selected:"",
        testname:"",
        totalmarks:"",
        date:today,
        passingmarks:""
    });
    const [errors,seterror]=useState({
        selected:"",
        testname:"",
        totalmarks:"",
        date:"",
        passingmarks:""
    });
    const isEmpty= (v) => v.trim() === "";
    const hasChar= (v) => /[A-Za-z]/.test(v);
    function handlechange(e)
    {
        const {name,value}=e.target;
        setformdata((prev)=>({...prev,[name]:value}));
        let error="";
        switch(name)
        {
            case "selected":
                if(isEmpty(value)) error="Subject required";
                else error="";
                break;
            case "testname":
                if(isEmpty(value)) error="Test Name required";
                else error="";
                break;
            case "totalmarks":
                if(isEmpty(value)) error="Total Marks required";
                else if(hasChar(value)) error="Char Not Allowed";
                else error="";
                break;
            case "date":
                if(isEmpty(value)) error="Date required";
                else error="";
                break;
            case "passingmarks":
                if(isEmpty(value)) error="passing Marks required";
                else if(hasChar(value)) error="Char Not Allowed";
                else if (Number(value)>=Number(formdata.totalmarks)) error="Marks Less than "+formdata.totalmarks;
                else error="";
                break;  
            default:
                break;
        }
        seterror((prev)=>({...prev,[name]:error})); 
    }

    useEffect(()=>{
        const getsubjectdetails= async ()=>{
            const resp=await axios.get("https://sangolacollage.onrender.com/api/getlecture");
            setsubjects(resp.data);
        }
        getsubjectdetails();
    },[]);
    
    function isAllvalid(){
        const isFormValid=Object.values(errors).every((msg) => msg === "")
        const isFillAll=Object.values(formdata).some((data)=>data==="")
         if (isFillAll||!isFormValid) {
            alert("Please fill all fields or check Validaton");
            return;
        }
        else{
            setstep("summery");
        }
    }
    useEffect(()=>{
        const getstudentdetails = async ()=>{
            if(!formdata.selected) return;
            const response=await axios.get(`https://sangolacollage.onrender.com/api/serach-student/${formdata.selected}`); 
            setstudentdata(response.data);
        }
        getstudentdetails();
    },[formdata.selected]);

     const options = subjects.map((s) =>({
        value: s.lectureid,
        label: `${s.lectureid} | Subject: ${s.subject}`
    }));
    const selectedSubject = subjects.find(
  (s) => s.lectureid === formdata.selected
);
    return (
        <div className="mentor-content animate__animated animate__zoomIn animate__slow">
            {step==="getdetails" && (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label">
                            <i className="bi bi-person-vcard"></i> Select Appropriate Subject *
                        </label>
                        <Select
                            className="form-label"
                            options={options}
                            placeholder="Select Subject With Appropriate Class Division"
                            maxMenuHeight={300}
                            value={options.find(opt => opt.value === formdata.selected) || null}
                            onChange={(e) =>
                            setformdata(prev => ({
                                ...prev,
                                selected: e ? e.value : ""
                            }))}isClearable
                        />    
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i> Give Name for This Test </label>
                        <input type="text" className="form-control" name="testname" placeholder="Give Name For This Test" onChange={handlechange}/>
                    </div>
                </div>
                
                {/* Warning Label */}
                <div className="row">
                    <div className="col-12 col-md-6">
                        <label className="showError">{errors.selected}</label>
                    </div>
                    <div className="col-12 col-md-4">
                        <label className="showError">{errors.testname}</label>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i> Select Date *  </label>
                        <input type="date" name="date" className="form-control" value={formdata.date} max={today} placeholder="Select Date " onChange={handlechange}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-bar-chart me-2"></i> Enter Total Marks *  </label>
                        <input type="text" name="totalmarks" className="form-control" placeholder="Enter Total Marks" onChange={handlechange}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-bar-chart me-2"></i>Set Passing Marks</label>
                        <input type="text" name="passingmarks"className="form-control" placeholder="Set Passing Marks" onChange={handlechange}/>
                    </div>
                </div>
                {/* Warning Label */}
            <div className="row">
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.date}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.totalmarks}</label>
                </div>
                <div className="col-12 col-md-4">
                    <label className="showError">{errors.passingmarks}</label>
                </div>
            </div>
            <br></br>

                <div className="row">
                    <div className="col-md-5">
                        <button className="search-btn" onClick={isAllvalid}>
                            <i className="bi bi-clipboard-plus"></i>
                            <span>Add Result</span>
                        </button>
                    </div>
                </div>
            </div>)}
            {step === "summery" && formdata.selected && (
                    <AssignMarks date={formdata.date} 
                        studentdata={studentdata} 
                        lectureid={formdata.selected} 
                        totalmarks={formdata.totalmarks} 
                        testname={formdata.testname} 
                        passingmarks={formdata.passingmarks}
                        subject={selectedSubject?.subject}
                        teacherid={selectedSubject?.teacherid}
                    />
                )}
        </div>
    );
}

export {AddTestResult};