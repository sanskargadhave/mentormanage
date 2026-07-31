import axiosInstance from "../../axiosInstance";
import { useEffect, useState, useContext } from "react";
import ChartCard from "../../student comonent/student Annalytics/ChartCard";
import "../../student comonent/student Annalytics/StudentAnnalytics.css";
import ChartComingSoon from "../../student comonent/student Annalytics/ChartCommingSoon";
import { AuthContext } from "../../Authintication";
import LectureActivity from "./LectureActivityChart";
import AttendanceTrend from "./AttendanceTrendChart";
import StudentsBelow75 from "./StudentBelowLimit";
import StudentAttendanceDistribution from "./StudentAttendanceDistribution";
function MentorChart(){
    const {_id}=useContext(AuthContext);
    const [analytics, setAnalytics] = useState({
        LectureActivity:[],
        MentorOverview:[],
        StudentsBelow75:[],
        AverageClassPerformance:[],
        AttendanceTrends:[],
        StudentAttendanceDistribution:[]
    });
    useEffect(()=>{
        async function getAnalytics(){
            try{
                const resp=await axiosInstance.get(`/mentor/get-mentor-analytics/${_id}`);
                setAnalytics(resp.data.analyticsData);
            }
            catch(err)
            {
                console.log(err.message);
            }
        }
        getAnalytics();
    },[]);
    useEffect(() => {
        console.log("Updated Analytics:", analytics);
    }, [analytics]);
    return (
        <section className="student-dashboard-chart">
            <div className="dashboard-section">

                <ChartCard title="Lecture Activity" subtitle="Lecture Conducted By You">
                    <LectureActivity analytics={analytics.LectureActivity}/>
                </ChartCard>

                <ChartCard title="Attendance Trends " subtitle="Student Attendance for Lectures">
                    <AttendanceTrend analytics={analytics.AttendanceTrends}/>
                </ChartCard>

                <ChartCard title="Student Below Limit " subtitle="Need To Attendance">
                    <StudentsBelow75 analytics={analytics.StudentsBelow75}/>
                </ChartCard>

                <ChartCard title="Student Attendance Distribution" subtitle="You Need To Watch Them">
                    <StudentAttendanceDistribution analytics={analytics.StudentAttendanceDistribution}/>
                </ChartCard>

                <ChartCard title="Average Class Performance" subtitle="Its Your Point.">
                    <ChartComingSoon/>
                </ChartCard>
            </div>
        </section>
    );
}

export default MentorChart;


/*
<div className="lecture-insight">
                                            <div className="lecture-insight-icon">
                                                <i className="bi bi-lightning-charge-fill"></i>
                                            </div>
                                            <div>
                                                <h4> Your teaching momentum is visible 📈 </h4>
                                                <p>
                                                    You have conducted{" "}
                                                    <strong> {totalLectures} </strong>{" "}
                                                    lectures during the recorded period.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="lecture-summary">
                                            <div className="lecture-summary-box">
                                                <span>
                                                    Total Lectures
                                                </span>

                                                <strong>
                                                    {totalLectures}
                                                </strong>
                                            </div>

                                            <div className="lecture-summary-box">
                                                <span>
                                                    Peak Activity
                                                </span>

                                                <strong>
                                                    {highestActivity?.lectures || 0}
                                                </strong>

                                                <small>
                                                    {highestActivity?.week || "No data"}
                                                </small>

                                            </div>


                                            <div className="lecture-summary-box">

                                                <span>

                                                    Latest Week

                                                </span>

                                                <strong>

                                                    {latestWeek?.lectures || 0}

                                                </strong>

                                                <small>

                                                    {latestWeek?.week || "No data"}

                                                </small>

                                            </div>


                                        </div>






                                        <div className="lecture-bottom-message">
                                            <i className="bi bi-graph-up-arrow"></i>
                                            {
                                                highestActivity &&
                                                    latestWeek &&
                                                    latestWeek.lectures < highestActivity.lectures
                                                    ?
                                                    <span>
                                                        Activity has slowed recently. Keep your teaching momentum going 🚀
                                                    </span>
                                                    :
                                                    <span>
                                                        Great consistency! Your teaching activity is moving positively 🚀
                                                    </span>
                                            }
                                        </div>

*/