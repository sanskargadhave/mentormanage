import "./StudentProfileCard.css";

function StudentProfileCard({ student }) {

    if (!student) {

        return (

            <div className="student-profile-card empty">

                <div className="profile-avatar">
                    👨‍🎓
                </div>

                <h3>No Student Selected</h3>

                <p>
                    Search by Roll No or Name to view student profile.
                </p>

            </div>

        );

    }

    return (

        <div className="student-profile-card">

            <div className="profile-top">

                <div className="profile-avatar">

                    {student.image
                        ?
                        <img
                            src={student.image}
                            alt={student.name}
                        />
                        :
                        student.name.charAt(0).toUpperCase()
                    }

                </div>

                <div className="profile-info">

                    <h2>{student.name}</h2>

                    <span>
                        Roll No : {student.rollno}
                    </span>

                    <span>
                        Semester : {student.semester}
                    </span>

                </div>

            </div>

            <div className="profile-stats">

                <div className="profile-stat">

                    <h4>{student.attendance}%</h4>

                    <span>Attendance</span>

                </div>

                <div className="profile-stat">

                    <h4>{student.assignments}%</h4>

                    <span>Assignments</span>

                </div>

                <div className="profile-stat">

                    <h4>{student.tests}%</h4>

                    <span>Tests</span>

                </div>

            </div>

            <div className="profile-details">

                <div>

                    <strong>Mentor</strong>

                    <span>{student.mentor}</span>

                </div>

                <div>

                    <strong>Email</strong>

                    <span>{student.email}</span>

                </div>

                <div>

                    <strong>Mobile</strong>

                    <span>{student.mobile}</span>

                </div>

            </div>

            <button className="profile-report-btn">

                📄 View Complete Report

            </button>

        </div>

    );

}

export default StudentProfileCard;