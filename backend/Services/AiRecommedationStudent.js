const mongoose=require("mongoose")
async function generateStudentRecommendation(analyticsData){
    
    const {SubjectTrends,AttendanceDistribution,AttendanceTrends,LeaveStatus,AttendanceHeatmap,currentSemester}=analyticsData;
    const total=AttendanceDistribution?.TotalCount || 0;
    const present=AttendanceDistribution?.PresentCount || 0;
    const absent=AttendanceDistribution?.AbsentCount ||0;
    const requiredAttendance=currentSemester.minimumAttendance;
    const attendancePercentage=total>0?(present/total)*100:0;
    let riskScore=0;
    const reasons=[];
    const recommendations=[];
    const positiveIndications = [];
    //Attendance Annalysis
   
    if(attendancePercentage<requiredAttendance){
        if (attendancePercentage < 60) {
            riskScore += 60;
            reasons.push("Attendance is critically low.");
        }
        else {
            riskScore += 40;
            reasons.push( `Attendance is ${Number(attendancePercentage.toFixed(1))}%, which is below the required ${requiredAttendance}%.`);
        }
        recommendations.push({
            priority:"High",
            title: "Improve Attendance",
            message:"Attend Upcoming Lectures Regularly To Improve Your Attendance"
        })
    }
    
    //AttendanceRecovery
    let AttendanceRecovery={
        required:false,
        currentPercentage:Number(attendancePercentage.toFixed(1)),
        requiredPercentage:requiredAttendance,
        lecturesToAttend:0,
        expectedPercentage:Number(attendancePercentage.toFixed(1)),
        message:"Required attendance percentage already achieved."
    }
    if(total>0 && attendancePercentage < requiredAttendance)
    {   
        const lecturesToAttend = Math.ceil(
            (requiredAttendance * total - 100 * present ) / ( 100 - requiredAttendance)
        );

        const futurePresent=present+lecturesToAttend;
        const futureTotal=total+lecturesToAttend;
        const expectedPercentage=(futurePresent/futureTotal)*100;
        AttendanceRecovery={
            required:true,
            expectedPercentage:Number(expectedPercentage.toFixed(1)),
            requiredPercentage:requiredAttendance,
            currentPercentage:Number(attendancePercentage.toFixed(1)),
            lecturesToAttend,
            message:`Attend the next ${lecturesToAttend} lectures continuously to reach ${requiredAttendance}% attendance.`
        };
    }

    if ( AttendanceTrends.length >= 2) {

        const latest = AttendanceTrends .at(-1);
        const previous = AttendanceTrends.at(-2);
        const latestPercentage = latest.totalLecture > 0 ? ( latest.totalPresent / latest.totalLecture ) * 100: 0;
        const previousPercentage = previous.totalLecture > 0 ? ( previous.totalPresent / previous.totalLecture) * 100: 0;

        if ( latestPercentage > previousPercentage ) {
            positiveIndications.push({
                type: "Improvement",
                title: "Recovery Progress",
                message: "Your latest attendance is improving. Continue attending upcoming lectures to recover your attendance."
            });
        }
    }

    //Subject Annalysis
    const WeakSubject=SubjectTrends.map((subject)=>{
        const percentage=subject.totalLecture>0 ? (subject.totalPresent/subject.totalLecture)*100 :0;
        return {...subject,percentage:Number(percentage.toFixed(1))}
    }).filter(subject=>subject.percentage<requiredAttendance).sort((a,b)=>a.percentage-b.percentage);

    if(WeakSubject.length>0){
        riskScore+=20;
        WeakSubject.forEach(subject=>{
            reasons.push(`${subject.subject} attendance is ${subject.percentage}%.`);
        })
        recommendations.push({
            priority:"Medium",
            title:"Focus on weak subjects ",
            message:`Pay special attention to ${WeakSubject.map(subject=>subject.subject).join(", ")}.`
        })
    }
    
    const StrongSubjects = SubjectTrends.map(subject => {
        const percentage = subject.totalLecture > 0 ? ( subject.totalPresent / subject.totalLecture) * 100 : 0;
        return { 
            ...subject,percentage: Number( percentage.toFixed(1))
        };

    }).filter( subject => subject.percentage >= 85)
    .sort( (a, b) => b.percentage - a.percentage);

    if (StrongSubjects.length > 0) {
    positiveIndications.push({
        type: "Achievement",
        title: "Strong Subject Performance",
        message: `Excellent attendance in ${StrongSubjects.map(subject => `${subject.subject} (${subject.percentage}%)`).join(", ")}.`

    });

}

    //Trend Analysis
    if(AttendanceTrends.length>=3)
    {
        const sortedTrends = [...AttendanceTrends].sort((a, b) => a.weekNumber - b.weekNumber);

        const lastThree = sortedTrends.slice(-3);
        const percentages=lastThree.map(week=>
            week.totalLecture>0?(week.totalPresent/week.totalLecture)*100:0
        );
        const declining=percentages[0]>percentages[1] && percentages[1]>percentages[2];
        if(declining)
        {
            riskScore+=20;
            reasons.push("Attendance has declined for three consecutive weeks.");
            recommendations.push({
                priority:"High",
                title:"Reverse Declining Trend",
                message:"Your Attendance is Declining . Try to attend every upcoming Lecture"
            })
        }
    }
    if (AttendanceTrends.length >= 3) {
        const sortedTrends = [...AttendanceTrends].sort( (a, b) => a.weekNumber - b.weekNumber);
        const lastThree = sortedTrends.slice(-3);
        const percentages = lastThree.map(week =>
            week.totalLecture > 0 ? ( week.totalPresent / week.totalLecture ) * 100 : 0);
        const improving =
            percentages[0] <
            percentages[1] &&
            percentages[1] <
            percentages[2];
        if (improving) {
            positiveIndications.push({
                type: "Improvement",
                title: "Attendance Is Improving",
                message: "Great progress! Your attendance has improved for three consecutive weeks. Keep it up!"
            });
        }
    }

    if (attendancePercentage >= requiredAttendance) {
        positiveIndications.push({
            type: "Success",
            title: "Good Attendance",
            message:
                `Excellent! Your attendance is ${Number(attendancePercentage.toFixed(1))}%, above the required ${requiredAttendance}%.`
        });
    }

    if (attendancePercentage >= 90) {

        positiveIndications.push({
            type: "Achievement",
            title: "Excellent Attendance",
            message:
            "Outstanding attendance! Keep maintaining this consistency."
        });

    }

    //leave Analysis
    if(LeaveStatus.Total>=5)
    {
        riskScore+=10;
        reasons.push( "Multiple leave applications were submitted.");      
    }

    if ( LeaveStatus.Total > 0 && LeaveStatus.Pending === 0) {
        positiveIndications.push({  
            type: "Good Management",
            title: "Leave Applications Managed",
            message: "You currently have no pending leave applications."
        });

    }
    if ( LeaveStatus.Total === 0 ) {
            positiveIndications.push({
            type: "Positive",
            title: "Excellent Regularity",
            message: "You have not submitted any leave applications during this semester."
        });
    }

    //limit Score 
    riskScore=Math.min(riskScore,100);
    let riskLevel;
    let status;
    
    if(riskScore>=70)
    {
        riskLevel="High Risk";
        status = "Danger";
    }
    else if(riskScore>=40)
    {
        riskLevel="Medium Risk";
        status="Warning"
    }
    else {
        riskLevel="Low Risk";
        status="Safe"
    }

    return {
        attendancePercentage:Number(attendancePercentage.toFixed(1)),
        riskScore,
        reasons,
        recommendations,
        riskLevel,
        status,
        WeakSubject,
        AttendanceRecovery,
        positiveIndications,
        StrongSubjects,

    }

}

module.exports={generateStudentRecommendation};