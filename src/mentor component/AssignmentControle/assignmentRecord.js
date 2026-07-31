import "./assignmentRecord.css";
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { AuthContext } from "../../Authintication";
import axiosInstance from "../../axiosInstance";
import { showToast } from "../../utils/showToast";

function AssignmentRecord() {

    const { _id, token } = useContext(AuthContext);
    const [subjects, setSubjects] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        year: "",
        division: "",
        subjectId: "",
        type: ""
    });

    const courses={
       Science:["Physics","Zoology","Mathematics","Chemistry","Botany","BSC"],
        ComputerScience:["Data Science","BCA","BSC [ECS]"],
       Art:["Economics","English","Marathi","History","Geography","Hindi"],
       Commerce:["Commerce"],
    }

    const options = subjects.map(subject => ({
        value: subject._id,
        label: `${subject.lectureid} | ${subject.subject}`
    }));

    useEffect(() => {
        if (!token) return;
        const getSubjects = async () => {
            try {
                const resp = await axiosInstance.get("/common/getlecture");
                setSubjects(resp.data);
            }
            catch (err) {
                console.log(err);
                showToast.error("Unable to load subjects.");
            }
        };
        getSubjects();
    }, [token]);
    
    useEffect(() => {
        if (!token) return;
        const timer = setTimeout(() => {
            fetchAssignments();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters, token, _id]);

    const fetchAssignments = async () => {
        try {
            const resp = await axiosInstance.get( "/assignment/get-assignment-for-mentor",{
                params: {
                    mentorId: _id,
                    search: filters.search,
                    year: filters.year,
                    division: filters.division,
                    subjectId: filters.subjectId,
                    type: filters.type
                }
            });
            setAssignments(resp.data.assignments);
        }
        catch (err) {
            console.log(err);
            showToast.error(
                err.response?.data?.message ||
                "Unable to fetch assignments."
            );
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "reset") {
            setFilters({
                search: "",
                year: "",
                division: "",
                subjectId: "",
                type: ""
            });
            return;
        }

        setFilters(prev => ({ ...prev, [name]: value}));
    };
        return (
        <div className="assignment-record-container">
            <div className="assignment-list-header">
                <div className="assignment-list-top">
                    <div className="assignment-list-title">
                        <div className="assignment-list-icon">
                            <i className="bi bi-journal-check"></i>
                        </div>
                        <div>
                            <h2>Assignment List</h2>
                            <p>
                                Manage, search and monitor all assignments.
                            </p>
                        </div>
                    </div>
                    <button className="assignment-new-btn">
                        <i className="bi bi-plus-circle-fill"></i>
                        New Assignment
                    </button>
                </div>

                <div className="assignment-filter-area">
                    <div className="assignment-search-box">
                        <i className="bi bi-search"></i>
                        <input type="text" name="search" value={filters.search} placeholder="Search assignment..." onChange={handleChange} />
                    </div>

                    <select className="assignment-filter" name="year" value={filters.year} onChange={handleChange} >
                        <option value="">
                            All Years
                        </option>

                        <option value="first">
                            First Year
                        </option>

                        <option value="second">
                            Second Year
                        </option>

                        <option value="third">
                            Third Year
                        </option>

                    </select>

                    <select className="assignment-filter" name="division" value={filters.division} onChange={handleChange}>
                        <option value="">
                            All Divisions
                        </option>

                        <option value="A">A</option>

                        <option value="B">B</option>

                        <option value="C">C</option>

                        <option value="D">D</option>
                    </select>
                    <Select className="assignment-select" classNamePrefix="assignment-select" options={options} placeholder="Select Subject" maxMenuHeight={300} value={ options.find( option => option.value === filters.subjectId ) || null }
                        onChange={(option) =>
                            setFilters(prev => ({
                                ...prev,
                                subjectId: option
                                    ? option.value
                                    : ""

                    }))} isClearable/>

                    <select className="assignment-filter" name="type" value={filters.type} onChange={handleChange}>
                        <option value="">
                            All Types
                        </option>

                        <option value="Theory">
                            Theory
                        </option>

                        <option value="Practical">
                            Practical
                        </option>

                    </select>

                   <button type="button" name="reset" className="assignment-reset-btn" onClick={handleChange}>
                        <i className="bi bi-arrow-counterclockwise"></i>
                        Reset   
                    </button>

                </div>
            </div>

            <div className="assignment-list-container">
                {
                    assignments.length === 0 ?
                        (
                            <div className="assignment-empty">
                                <i className="bi bi-journal-x"></i>
                                <h3>
                                    No Assignments Found
                                </h3>
                                <p>
                                    Try changing your filters or create a new assignment.
                                </p>
                            </div>
                        )
                        :
                        (
                            assignments.map((assignment) => (
                                <div className="assignment-card" key={assignment._id}>

    <div className="assignment-top-ass">

        <div>

            <h3>{assignment.title}</h3>

            <p>{assignment.subjectId?.subject}</p>

        </div>

        <span className={`assignment-badge-ass ${assignment.status.toLowerCase()}`}>
            {assignment.status}
        </span>

    </div>
    <br/>
    <div className="assignment-details-ass">

        <div className="assignment-info-ass">

            <span>
                <i className="bi bi-book-fill"></i>
                {assignment.assignmentType}
            </span>

            <span>
                <i className="bi bi-award-fill"></i>
                {assignment.maxMarks} Marks
            </span>

            <span>
                <i className="bi bi-calendar-event-fill"></i>
                {new Date(assignment.dueDate).toLocaleDateString()}
            </span>

        </div>

        <div className="assignment-class-ass">

            <span>{assignment.course}</span>

            <span>{assignment.year} Year</span>

            <span>Division {assignment.division}</span>

        </div>

    </div>
    <br/>

    <div className="assignment-progress-ass">

        <div className="progress-title-ass">

            <span>Submission Progress</span>

            <span>42 / 60</span>

        </div>

        <div className="progress-bar-ass">

            <div
                className="progress-fill-ass"
                style={{ width: "70%" }}
            ></div>

        </div>

    </div>
    <br/>

    <div className="assignment-stats-ass">

        <div>

            <h5>60</h5>

            <p>Total</p>

        </div>

        <div>

            <h5>42</h5>

            <p>Submitted</p>

        </div>

        <div>

            <h5>15</h5>

            <p>Checked</p>

        </div>

        <div>

            <h5>18</h5>

            <p>Pending</p>

        </div>

    </div>
    <br/>

    <div className="assignment-actions-ass">

        <button className="view-btn-ass">

            <i className="bi bi-eye-fill"></i>

            View

        </button>

        <button className="edit-btn-ass">

            <i className="bi bi-pencil-fill"></i>

            Edit

        </button>

        <button className="delete-btn-ass">

            <i className="bi bi-trash-fill"></i>

            Delete

        </button>

    </div>

</div>
                            ))

                        )

                }

            </div>

        </div>

    );

}

export default AssignmentRecord;