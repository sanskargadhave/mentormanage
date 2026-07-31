import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import "./StudentAnnalytics.css";

function AttendanceDistributionChart({AttendanceDistribution }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const timer =
            setTimeout(() => {
                setIsVisible(true);
            }, 150);
        return () => clearTimeout(timer);
    }, []);

    const { PresentCount = 0, AbsentCount = 0, TotalCount = 0} = AttendanceDistribution;

    const attendanceData = [
        {
            name: "Present",
            value: PresentCount,
            color: "#25D366"
        },

        {
            name: "Absent",
            value: AbsentCount,
            color: "#ff5c5c"
        }
    ];


    const attendancePercentage = TotalCount > 0 ? Math.round( (PresentCount / TotalCount) * 100 ) : 0;
    const hasData = TotalCount > 0;
    return (
        <div className={` attendance-distribution ${isVisible ? "distribution-visible" : ""}`}>
            {hasData ? (
                <>
                    <div className="donut-chart-wrapper">

                        <ResponsiveContainer width="100%" height="100%" >
                            <PieChart>
                                <Pie
                                    data={attendanceData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="64%"
                                    outerRadius="82%"
                                    paddingAngle={4}
                                    cornerRadius={8}
                                    startAngle={90}
                                    endAngle={-270}
                                    stroke="none"
                                    animationBegin={200}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                >

                                    {attendanceData.map((entry, index) => (<Cell key={ `cell-${index}`} fill={entry.color} />))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />}/>
                            </PieChart>

                        </ResponsiveContainer>
                        <div className="donut-center-content">
                            <strong>
                                {attendancePercentage}%
                            </strong>
                            <span>
                                Attendance
                            </span>
                        </div>
                    </div>
                    <div className="distribution-stats">
                        <DistributionStat type="present" title="Present" value={PresentCount} total={TotalCount} />
                        <DistributionStat type="absent" title="Absent" value={AbsentCount} total={TotalCount}/>
                    </div>
                </>
            ) : (
                <div className="distribution-empty">

                    <div className="empty-circle" >📊</div>
                    <p>
                        No attendance data
                    </p>


                    <span>
                        Attendance distribution
                        will appear here
                    </span>

                </div>

            )}

        </div>

    );

}


function DistributionStat({type,title, value, total}) {
    const percentage =  total > 0 ? Math.round((value / total) * 100) : 0;


    return (
        <div className={`distribution-stat${type}`} >
            <div className="stat-heading" >
                <span className="stat-dot" />
                <span className="stat-title" >
                    {title}
                </span>
            </div>
            <strong className="stat-value" >
                {value}
            </strong>
            <span className="stat-percentage" >
                {percentage}%
            </span>
        </div>

    );

}


function CustomTooltip({ active, payload}) {
    if (!active ||!payload ||!payload.length ) {
        return null;
    }
    const data = payload[0].payload;
    return (
        <div className="distribution-tooltip">

            <div className="tooltip-title">
                <span className="tooltip-dot" style={{background:data.color }}/>
                {data.name}
            </div>
            <strong>
                {data.value} lectures
            </strong>
        </div>

    );

}


export default AttendanceDistributionChart;