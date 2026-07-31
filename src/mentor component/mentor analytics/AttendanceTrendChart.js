import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine
} from "recharts";

import "./mentorAnalytics.css";

function AttendanceTrend({ analytics = [] }) {

    if (!Array.isArray(analytics) || analytics.length === 0) {
        return (
            <div className="weekly-trend-empty-state">
                <i className="bi bi-bar-chart-line"></i>

                <h4>No attendance trend available</h4>

                <p>
                    Weekly attendance performance will appear here once attendance data is available.
                </p>
            </div>
        );
    }

    const averageAttendance = (
        analytics.reduce(
            (total, item) =>
                total + Number(item.attendancePercentage || 0),
            0
        ) / analytics.length
    ).toFixed(1);

    const latestData = analytics[analytics.length - 1];

    return (
        <div className="weekly-trend-wrapper">

            {/* ================================
                SUMMARY
            ================================= */}

            <div className="weekly-trend-summary">

                <div className="weekly-trend-stat-box">

                    <span>Average</span>

                    <strong>
                        {averageAttendance}%
                    </strong>

                </div>


                <div className="weekly-trend-stat-box">

                    <span>Latest Week</span>

                    <strong className="weekly-trend-green-value">
                        {latestData.attendancePercentage}%
                    </strong>

                </div>


                <div className="weekly-trend-stat-box">

                    <span>Weeks</span>

                    <strong>
                        {analytics.length}
                    </strong>

                </div>

            </div>


            {/* ================================
                INSIGHT
            ================================= */}

            <div className="weekly-trend-message">

                <i className="bi bi-graph-up-arrow"></i>

                <span>
                    {latestData.attendancePercentage >= 75
                        ? "Class attendance is performing above the required 75% benchmark."
                        : "Class attendance is below the required 75% benchmark."
                    }
                </span>

            </div>


            {/* ================================
                CHART
            ================================= */}

            <div className="weekly-trend-graph">

                <ResponsiveContainer
                    width="100%"
                    height={210}
                >

                    <LineChart
                        data={analytics}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 5
                        }}
                    >

                        <CartesianGrid
                            stroke="#2A3942"
                            strokeDasharray="3 3"
                            vertical={false}
                        />


                        <XAxis
                            dataKey="weekNumber"
                            tickFormatter={(value) => `W${value}`}
                            tick={{
                                fill: "#8696A0",
                                fontSize: 11
                            }}
                            axisLine={{
                                stroke: "#2A3942"
                            }}
                            tickLine={false}
                        />


                        <YAxis
                            domain={[50, 100]}
                            tickFormatter={(value) => `${value}%`}
                            tick={{
                                fill: "#8696A0",
                                fontSize: 10
                            }}
                            axisLine={false}
                            tickLine={false}
                            width={42}
                        />


                        <Tooltip
                            content={<WeeklyTrendTooltip />}
                        />


                        <ReferenceLine
                            y={75}
                            stroke="#FFB020"
                            strokeDasharray="5 5"
                        />


                        <Line
                            type="monotone"
                            dataKey="attendancePercentage"
                            stroke="#25D366"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#25D366",
                                stroke: "#202C33",
                                strokeWidth: 2
                            }}
                            activeDot={{
                                r: 7
                            }}
                            isAnimationActive={false}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>


            {/* ================================
                FOOTER
            ================================= */}

            <div className="weekly-trend-footer">

                <span>
                    <i className="bi bi-calendar3"></i>
                    Weekly performance
                </span>

                <span>
                    <i className="bi bi-check-circle"></i>
                    75% benchmark
                </span>

            </div>

        </div>
    );
}


/* ==========================================
   CUSTOM TOOLTIP
========================================== */

function WeeklyTrendTooltip({ active, payload, label }) {

    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0].payload;

    return (

        <div className="weekly-trend-tooltip">

            <strong>
                Week {label}
            </strong>

            <div className="weekly-trend-tooltip-percentage">
                {data.attendancePercentage}%
            </div>

            <div className="weekly-trend-tooltip-row">
                <span>Present</span>
                <b>{data.totalPresent}</b>
            </div>

            <div className="weekly-trend-tooltip-row">
                <span>Absent</span>
                <b>{data.totalAbsent}</b>
            </div>

            <div className="weekly-trend-tooltip-row">
                <span>Total</span>
                <b>{data.totalLecture}</b>
            </div>

        </div>
    );
}


export default AttendanceTrend;