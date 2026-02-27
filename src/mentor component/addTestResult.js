import axios from "axios";
import { useEffect,useState} from "react";
import Select from "react-select";
export default function AssignMarks({date,studentdata,lectureid,totalmarks,testname})
{
    
    return(
        <div className="mentor-content">
            <div>
                <tabel className="attendance-table">
                    <thead>
                        <tr>
                            <th>Rollno</th>
                            <th>Student Name</th>
                            <th>Marks</th>
                            <th>Click P/A</th>
                            <th></th>
                        </tr>
                    </thead>
                </tabel>
            </div>
        </div>
    );
}
function AddTestResult()
{
    const today = new Date().toISOString().split("T")[0];
    const [studentdata,setstudentdata]=useState([]);
    const [subjects,setsubjects]=useState([]);
    const [selected,setselected]=useState(null);
    const [testname,settestname]=useState("");
    const [totalmarks,settotalmarks]=useState("");
    const [date,setdate]=useState(today);
    const [step,setstep] = useState("getdetails");
    useEffect(()=>{
        const getsubjectdetails= async ()=>{
            const resp=await axios.get("http://localhost:5000/api/getlecture");
            setsubjects(resp.data);
        }
        getsubjectdetails();
    },[]);

    useEffect(()=>{
        const getstudentdetails = async ()=>{
            if(!selected) return;
            const response=await axios.get(`http://localhost:5000/api/serach-student/${selected.value}`); 
            setstudentdata(response.data);
        }
        getstudentdetails();
    },[selected]);

     const options = subjects.map((s) =>({
        value: s.lectureid,
        label: `${s.lectureid} | Subject: ${s.subject}`
    }));

    return (
        <div className="mentor-content animate__animated animate__zoomIn animate__slow">
            {step==="getdetails" && (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label">
                            <i className="bi bi-person-vcard"></i> Select Appropriate Subject *
                        </label>
                        <Select options={options} placeholder="Select Subject With Appropriate Class Division" maxMenuHeight={300} value={selected} onChange={setselected} isClearable/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i> Give Name for This Test </label>
                        <input type="text" className="form-control" placeholder="Give Name For This Test" onChange={(e)=>{settestname(e.target.value)}}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10">
                        {selected && 
                        (
                            <div className="mt-3 text-success">
                                Selected Subject: <b>{selected.value}</b>
                            </div>
                        )}
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-calendar-heart"></i> Select Date *  </label>
                        <input type="date" className="form-control" value={date} max={today} placeholder="Select Date " onChange={(e)=>{setdate(e.target.value)}}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><i className="bi bi-bar-chart me-2"></i> Enter Total Marks *  </label>
                        <input type="text" className="form-control" placeholder="Enter Total Marks" onChange={(e)=>{settotalmarks(e.target.value)}}/>
                    </div>
                    <div className="col-md-4">
                        <button className="search-btn" onClick={() => { 
                                if (!selected || !testname || !totalmarks) { alert("Please fill all required fields!"); return;}
                                setstep("summery");
                            }}>
                            <i className="bi bi-clipboard-plus"></i>
                            <span>Add Result</span>
                        </button>
                    </div>
                </div>
               
            </div>)}
             {step === "summery" && selected && (
                    <AssignMarks date={date} studentdata={studentdata} lectureid={selected.value} totalmarks={totalmarks} testname={testname}/>
                )}
        </div>
    );
}

export {AddTestResult};