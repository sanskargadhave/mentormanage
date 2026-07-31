import "./addAssignment.css"
import {useEffect, useState ,useContext} from "react";
import Select from 'react-select';
import { AuthContext } from "../../Authintication";
import axiosInstance from "../../axiosInstance";
import { showToast } from "../../utils/showToast";
function AddAssignment()
{
    const {_id,token}=useContext(AuthContext);
    const [subjects,setSubjects]=useState([]);
    const [selected, setselected] = useState(null);
    const courses={
       Science:["Physics","Zoology","Mathematics","Chemistry","Botany","BSC"],
        ComputerScience:["Data Science","BCA","BSC [ECS]"],
       Art:["Economics","English","Marathi","History","Geography","Hindi"],
       Commerce:["Commerce"],
    }
    
    useEffect(() => {
            if(!token) return;
            async function getsubject()
            {
                try{
                    const resp=await axiosInstance.get("/common/getlecture");
                    setSubjects(resp.data);
                }
                catch(err)
                {
                    console.log(err.message);
                }
            }
            
            getsubject();
            
        }, [token,_id]);
        
    const options = subjects.map((s) => ({
        value: s._id,
        label: `${s.lectureid} | Subject: ${s.subject}`
    }));
    const initialData={
        AssignmentType:"Theory",
        AssignmentTitle:"",
        AssignmentDescription:"",
        Department:"",
        Course:"",
        Year:"",
        Division:"",
        SubjectId:"",
        DueDate:"",
        MaxMarks:"",
        Status:"Published",
        Instructions:"",
        AllowLateSubmission:true,
        mentorId:_id
    };
    const [formData,setformData]=useState(initialData);

    const SubmitData=async (e)=>{
        e.preventDefault();
        if (!formData.SubjectId) {
            showToast.error("Please select a subject.");
            return;
        }
        try{
            const resp=await axiosInstance.post("/assignment/add-assignment",formData);
            showToast.success(resp.data.message);
            setformData(initialData);
            setselected(null);
        }
        catch(err)
        {
            console.log(err.message);
        }
    }

    const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    if (name === "Department") {

        setformData(prev => ({
            ...prev,
            Department: value,
            Course: ""
        }));

        return;
    }

    setformData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
    }));

};


    return(
        <div className="add-assignment-container">

    {/* Header */}
        <div className="assignment-list-heading">

            <div className="assignment-heading-content">

                <div className="assignment-heading-icon">
                    <i className="bi bi-journal-text"></i>
                </div>

                <div>
                    <h2>Assignments</h2>

                    <p>
                        Create, manage and track your class assignments
                    </p>
                </div>

            </div>
        </div>

    <form onSubmit={SubmitData}>
        {/* Assignment Information */}
        <div className="assignment-card">

            <h5>
                <i className="bi bi-journal-bookmark-fill"></i>
                Assignment Information
            </h5>

            <div className="assignment-grid">

                <div className="input-group-ass">
                    <label>Assignment Title</label>
                    <input
                        type="text" name="AssignmentTitle" value={formData.AssignmentTitle} required
                        placeholder="Enter Assignment Title" onChange={handleChange}
                    />
                </div>

                <div className="input-group-ass">
                    <label>Assignment Type</label>
                    <select name="AssignmentType" value={formData.AssignmentType} onChange={handleChange}>
                        <option value="Theory">Theory</option>
                        <option value="Practical">Practical</option>
                    </select>
                </div>

                <div className="input-group-ass full-width">
                    <label>Description</label>
                    <textarea name="AssignmentDescription" value={formData.AssignmentDescription} onChange={handleChange}
                        rows="4"
                        placeholder="Assignment Description..."
                    ></textarea>
                </div>

            </div>

        </div>

        {/* Academic Details */}

        <div className="assignment-card">

            <h5>
                <i className="bi bi-mortarboard-fill"></i>
                Academic Details
            </h5>

            <div className="assignment-grid">

                <div className="input-group-ass">
                    <label>Department</label>
                    <select name="Department" value={formData.Department} onChange={handleChange} required>
                        <option value="">Select Department</option>
                        <option value="Science">Science</option>
                        <option value="ComputerScience"> Computer Science</option>
                        <option value="Art">Art</option>
                        <option value="Commerce">Commerce</option>
                    </select>
                </div>
                {formData.Department &&(
                <div className="input-group-ass">
                    <label>Course</label>
                    <select name="Course" onChange={handleChange} value={formData.Course} required>
                        <option value="">select Course</option>
                        {
                            courses[formData?.Department].map((course,index)=>
                            (
                                <option key={index}>{course}</option>
                            )
                        )}
                    </select>
                </div>)}

                <div className="input-group-ass">
                    <label>Year</label>
                    <select name="Year" onChange={handleChange} value={formData.Year} required>
                        <option value="">Select Year</option>
                        <option value="first">first Year</option>  
                        <option value="second">second Year</option>
                        <option value="third">third Year</option>
                    </select>
                </div>

                <div className="input-group-ass">
                    <label>Division</label>
                    <select name="Division" onChange={handleChange} value={formData.Division} required>
                        <option>Select Division</option>
                        <option value="A">A</option>  
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>

               <div className="input-group-ass">
                    <label>Subject</label>
                    <Select className="assignment-select" classNamePrefix="assignment-select" options={options} placeholder="Search and select Proper Subject" maxMenuHeight={300} value={selected}  onChange={(option) => {
                        setselected(option);
                        setformData(prev => ({
                         ...prev,
                            SubjectId: option ? option.value : ""
                        }));
                    }} isClearable required/>
                </div>
            </div>

        </div>

        {/* Submission Details */}

        <div className="assignment-card">

            <h5>
                <i className="bi bi-calendar-check-fill"></i>
                Submission Details
            </h5>

            <div className="assignment-grid">

                <div className="input-group-ass" >
                    <label>Due Date</label>
                    <input type="date" name="DueDate" value={formData.DueDate} onChange={handleChange} required/>
                </div>

                <div className="input-group-ass">
                    <label>Maximum Marks</label>
                    <input
                        type="number"
                        placeholder="20" name="MaxMarks" value={formData.MaxMarks} onChange={handleChange} required
                    />
                </div>

                <div className="input-group-ass">
                    <label>Status</label>
                    <select name="Status"  value={formData.Status} onChange={handleChange}>
                        <option>Published</option>
                    </select>
                </div>

                <div className="switch-box">

                    <span>Allow Late Submission</span>

                    <label className="switch">
                        <input type="checkbox" checked={formData.AllowLateSubmission} name="AllowLateSubmission" onChange={handleChange}/>
                        <span className="slider"></span>
                    </label>

                </div>

                

                <div className="input-group-ass full-width">

                    <label>Instructions</label>

                    <textarea
                        rows="4"
                        placeholder="Additional Instructions..." value={formData.Instructions} name="Instructions" onChange={handleChange}
                    ></textarea>

                </div>

            </div>

        </div>
        <div className="assignment-footer">

            

            <button type="submit" className="publish-btn" >
                <i className="bi bi-send-fill"></i>
                Publish Assignment
            </button>

        </div>
    </form>
    

    

</div>
    
    
    
    );
}
export default AddAssignment;