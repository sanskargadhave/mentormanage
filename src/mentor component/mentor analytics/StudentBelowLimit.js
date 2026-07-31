import "./mentorAnalytics.css";
import { Navigate, useNavigate } from "react-router-dom";
function StudentsBelow75({ analytics = [] }) {
    const navigate=useNavigate();
    if (!analytics.length) {
        return (
            <div className="risk-empty">

                <i className="bi bi-check-circle-fill"></i>

                <h3>Excellent Attendance</h3>

                <p>
                    All assigned students have maintained attendance above
                    the required 75%.
                </p>

            </div>
        );
    }

    return (

        <div className="risk-wrapper">

            <div className="risk-header">

                <div>

                    <h3>
                        {analytics.length}
                    </h3>

                    <span>Students Need Attention</span>

                </div>

                <div className="risk-badge">

                    Below 75%

                </div>

            </div>


            <div className="risk-list">

                {analytics.map((student, index) => {

                    return (

                        <div
                            key={index}
                            className="risk-card"
                        >

                            <div className="risk-avatar">

                                {student.name[0]}

                            </div>


                            <div className="risk-details">

                                <div className="risk-top">

                                    <div>

                                        <h4>

                                            {student.name}

                                        </h4>

                                        <span>

                                            Roll No : {student.rollno}

                                        </span>

                                    </div>


                                    <div
                                        className={`risk-percentage ${
                                            student.attendancePercentage < 60
                                                ? "critical"
                                                : "warning"
                                        }`}
                                    >

                                        {student.attendancePercentage}%

                                    </div>

                                </div>


                                <div className="risk-progress">

                                    <div
                                        className={`risk-progress-fill ${
                                            student.attendancePercentage < 60
                                                ? "critical-fill"
                                                : "warning-fill"
                                        }`}
                                        style={{
                                            width:
                                                student.attendancePercentage +
                                                "%"
                                        }}
                                    ></div>

                                </div>


                                <div className="risk-footer">

                                    <div className="risk-stats">

                                        <span>
                                            Present :
                                            <strong> {student.totalPresent}</strong>
                                        </span>

                                        <span>
                                            Total :
                                            <strong> {student.totalLecture}</strong>
                                        </span>

                                    </div>

                                    <button
                                        className="risk-profile-btn"
                                        onClick={() => {
                                            navigate(`/mentor/student/${student?._id}`)
                                        }}
                                    >
                                        <i className="bi bi-person-lines-fill"></i>

                                        View Profile
                                    </button>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default StudentsBelow75;