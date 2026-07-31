import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from "recharts";
import {useEffect,useState} from "react";
import "./StudentAnnalytics.css";

function AttendanceTrendChart({AttendanceTrends = []}) 
{
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(false);
        const timer =
            setTimeout(() => {
                setIsVisible(true);
            }, 150);
        return () => clearTimeout(timer);
    }, [AttendanceTrends]);


    const chartData =
        AttendanceTrends.map((item) => ({
            week: `Week ${item.weekNumber}`,

            present:
                item.totalPresent,

            absent:
                item.totalAbsent,

            total:
                item.totalLecture

        }));


    const totalPresent = AttendanceTrends.reduce((total, item) => total + item.totalPresent, 0);


    const totalAbsent = AttendanceTrends.reduce( (total, item) => total + item.totalAbsent,0);


    const totalLecture =
        AttendanceTrends.reduce( (total, item) => total + item.totalLecture, 0 );


    const attendancePercentage = totalLecture > 0 ? Math.round( (totalPresent / totalLecture) * 100 ): 0;


    return (

        <div className={` attendance-trend-container ${isVisible ? "chart-visible" : ""}`}>
            <div className="attendance-trend-summary" >
                <div className="attendance-main-score">
                    <span className="attendance-score" >
                        {attendancePercentage}%
                    </span>

                    <span className="attendance-score-label">
                        Overall attendance
                    </span>
                </div>

                <div className="attendance-mini-stats">
                    <div className="mini-stat">
                        <span className="mini-stat-dot present-dot"/>
                        <div>
                            <strong>
                                {totalPresent}
                            </strong>

                            <small>
                                Present
                            </small>

                        </div>

                    </div>
                    <div className="mini-stat">
                        <span className="mini-stat-dot absent-dot"/>
                        <div>
                            <strong>
                                {totalAbsent}
                            </strong>
                            <small>
                                Absent
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            {chartData.length === 0 ? (
                <div className="attendance-empty-state" >
                    <div className="empty-icon">
                        📊
                    </div>

                    <p>
                        No attendance data available
                    </p>

                    <span>
                        Your weekly attendance will appear here
                    </span>

                </div>

            ) : (
                <div  className="attendance-chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%" >
                        <AreaChart data={chartData} margin={{top: 15,right: 8,left: -20, bottom: 5 }} >
                            <defs>

                                <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1" >
                                    <stop offset="0%" stopColor="#25D366" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#25D366" stopOpacity={0} />
                                </linearGradient>


                                <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1" >
                                    <stop offset="0%" stopColor="#ff5c5c" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#ff5c5c" stopOpacity={0} />
                                </linearGradient>

                            </defs>


                            <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.07)" vertical={false}/>
                            <XAxis dataKey="week" tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false}/>


                            <Tooltip content={  <CustomTooltip /> } />
                            <Area
                                type="monotone"
                                dataKey="present"
                                name="Present"
                                stroke="#25D366"
                                strokeWidth={3}
                                fill="url(#presentGradient)"
                                dot={{
                                    r: 4,
                                    fill: "#25D366",
                                    stroke: "#111b21",
                                    strokeWidth: 2
                                }}
                                activeDot={{
                                    r: 7
                                }}
                                animationDuration={1400}
                                animationEasing="ease-out"
                            />
                            


                            <Area
                                type="monotone"
                                dataKey="absent"
                                name="Absent"
                                stroke="#ff5c5c"
                                strokeWidth={2}
                                fill="url(#absentGradient)"
                                dot={{
                                    r: 3,
                                    fill: "#ff5c5c",
                                    stroke: "#111b21",
                                    strokeWidth: 2
                                }}
                                activeDot={{
                                    r: 6
                                }}
                                animationDuration={1700}
                                animationEasing="ease-out"
                            />

                        </AreaChart>

                    </ResponsiveContainer>

                </div>

            )}

            <div className="attendance-chart-legend" >

                <div  className="legend-item">
                    <span className="legend-line present-line" />
                    <span>
                        Present lectures
                    </span>
                </div>
                <div className="legend-item" >
                    <span className="legend-line absent-line"/>
                    <span>
                        Absent lectures
                    </span>
                </div>
            </div>
        </div>
    );

}


function CustomTooltip({ active, payload, label}) {
    if (!active ||!payload ||!payload.length) {
        return null;
    }


    return (

        <div className="attendance-tooltip" >

            <p className="tooltip-week" >
                {label}
            </p>


            {payload.map((item) => (

                <div className="tooltip-row" key={item.dataKey} >

                    <span className="tooltip-color"  style={{  background: item.color }}/>
                    <span>
                        {item.name}
                    </span>
                    <strong>
                        {item.value}
                    </strong>
                </div>

            ))}

        </div>

    );

}


export default AttendanceTrendChart;