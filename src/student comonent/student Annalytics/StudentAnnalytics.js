import "./StudentAnnalytics.css";
import ChartCard from "./ChartCard";
import axiosInstance from "../../axiosInstance";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Authintication";
import AttendanceTrendChart from "./AttendanceTrendChart.js";
import AttendanceDistributionChart from "./AttednanceDistributionChart.js";
import LeaveStatusChart from "./LeaveStatusChart.js";
import AttendanceHeatmapChart from "./AttendanceHeatmapChart.js";
import SubjectAttendanceChart from "./SubjectTrendsChart.js";
import AIRecommendationChart from "./AIRecommendationChart.js";
import ChartComingSoon from "./ChartCommingSoon.js";
function StudentChart() {
   const {_id}=useContext(AuthContext);
   const [analytics, setAnalytics] = useState({
    SubjectTrends: [],
    AttendanceDistribution: {
        PresentCount: 0,
        AbsentCount: 0,
        TotalCount: 0
    },
    AttendanceTrends: [],
    LeaveStatus: {
        Total: 0,
        Approved: 0,
        Rejected: 0,
        Pending: 0
    },
    Recommendation:{}
});
   
   useEffect(()=>{
      async function getAnalytics()
      {
        try{
        if(!_id) return ;
         const resp=await axiosInstance.get(`/student/get-student-analytics/${_id}`);
         setAnalytics(resp.data.FinalanalyticsData);
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

                <ChartCard title="Attendance Trend" subtitle="Monthly Attendance">
                  <AttendanceTrendChart AttendanceTrends={analytics.AttendanceTrends}/>
                </ChartCard>

                <ChartCard title="Attendance Distribution"  subtitle="Present vs Absent" >
                    <AttendanceDistributionChart AttendanceDistribution={analytics.AttendanceDistribution} />
                </ChartCard>

                <ChartCard title="Subject Attendance" subtitle="Current Semester">
                   <SubjectAttendanceChart SubjectTrends={analytics.SubjectTrends} />
                </ChartCard>

                <ChartCard  title="Attendance Heatmap" subtitle="Attendance Heatmap">
                   <AttendanceHeatmapChart AttendanceHeatmap={analytics.AttendanceHeatmap} />
                </ChartCard>

                <ChartCard  title="AI Feature Special For You" subtitle="EduMentor AI">
                   <AIRecommendationChart recommendation={analytics.Recommendation}/>
                </ChartCard>

                <ChartCard  title="Application Details" subtitle="Pending?" >
                    <LeaveStatusChart LeaveStatus={analytics.LeaveStatus}/>
                </ChartCard>

                <ChartCard  title="Semester Box" subtitle="Process" >
                    <ChartComingSoon />
                </ChartCard>
                
                <ChartCard  title="Leave Status" subtitle="Counts" >
                     <ChartComingSoon />
                </ChartCard>

                <ChartCard title="Performance Score"  subtitle="Radar System">
                   <ChartComingSoon />
                </ChartCard>

            </div>

        </section>
    );
}

export default StudentChart;