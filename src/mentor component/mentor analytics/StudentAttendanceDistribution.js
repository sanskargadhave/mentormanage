import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";
import "./mentorAnalytics.css";
import {useState} from "react";
const COLORS = {
    Excellent: "#25D366",
    Good: "#4AA3FF",
    Warning: "#FFB020",
    Critical: "#FF4D4F"
};
function StudentAttendanceDistribution({ analytics }) {

    const data = analytics.map(item => ({
        name: item.category,
        value: item.count
    }));
    const [selectedCategory, setSelectedCategory] = useState(analytics[0]);
    const totalStudents = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="attendance-distribution-wrapper">
            <div className="attendance-distribution-chart">

                <ResponsiveContainer width="100%" height={260}>

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={95}
                            paddingAngle={3}
                            cornerRadius={8}
                        >

                            {
                                data.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={COLORS[entry.name]}
                                    />
                                ))
                            }

                        </Pie>

                        <Tooltip
                            formatter={(value, name) => [
                                `${value} Students`,
                                name
                            ]}
                            contentStyle={{
                                background: "#202C33",
                                border: "1px solid #2A3942",
                                borderRadius: "10px",
                                color: "#fff"
                            }}
                        />

                    </PieChart>

                </ResponsiveContainer>

                <div className="attendance-distribution-center">

                    <h2>{totalStudents}</h2>

                    <span>Total Students</span>

                </div>
                
            </div>
            <div className="attendance-category-container">

                    {analytics.map((item) => {

                        const percentage = (
                            (item.count /
                                analytics.reduce((sum, obj) => sum + obj.count, 0)
                            ) * 100
                        ).toFixed(1);

                        return (

                            <div
                                key={item.category}
                                className={`attendance-category-card ${item.category.toLowerCase()}`}
                                onClick={() => setSelectedCategory(item)}
                            >

                                <div className="attendance-category-left">

                                    <div className="attendance-category-icon"></div>

                                    <div>

                                        <h4>{item.category}</h4>

                                        <span>{item.count} Students</span>

                                    </div>

                                </div>

                                

                            </div>

                        );

                    })}

                </div>
                <div className="student-list-container">

    <div className="student-list-header">

        <h3>
            {selectedCategory?.category || "Students"}
        </h3>

        <span>
            {selectedCategory?.students?.length || 0} Students
        </span>

    </div>

    <div className="student-list-body">

        {selectedCategory?.students?.length > 0 ? (

            selectedCategory.students.map((student) => (

                <div
                    key={student.studentId}
                    className="student-card"
                >

                    <div className="student-info">

                        <div className="student-avatar">

                            {student.name.charAt(0)}

                        </div>

                        <div>

                            <h4>{student.name}</h4>

                            <span>
                                Roll No : {student.rollno}
                            </span>

                        </div>

                    </div>

                    <div className="student-attendance">

                        <div className="attendance-badge">

                            {student.attendancePercentage}%

                        </div>

                        <span>

                            Present {student.totalPresent} / {student.totalLecture}

                        </span>

                    </div>

                    

                </div>

            ))

        ) : (

            <div className="no-student">

                <i className="bi bi-people"></i>

                <p>No Students Found</p>

            </div>

        )}

    </div>

</div>
        </div>
    );

}

export default StudentAttendanceDistribution;