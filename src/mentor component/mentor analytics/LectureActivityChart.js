import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import "./mentorAnalytics.css";


function LectureActivity({ analytics = [] }) {

    // Protect against undefined or empty data
    if (!analytics || analytics.length === 0) {

        return (

            <div className="lecture-activity-empty">

                <div className="lecture-empty-icon">
                    <i className="bi bi-bar-chart-line"></i>
                </div>

                <h4>No Lecture Activity Yet</h4>

                <p>
                    Your weekly lecture activity will appear here
                    once lectures are conducted.
                </p>

            </div>

        );

    }


    // Convert API data into chart-friendly data
    const chartData = analytics.map((item) => ({

        week: `Week ${item.weekNumber}`,

        lectures: item.totalLecture

    }));


    // Calculate total lectures
    const totalLectures = analytics.reduce(

        (total, item) => total + item.totalLecture,

        0

    );


    // Find highest activity week
    const highestWeek = analytics.reduce(

        (max, item) =>

            item.totalLecture > max.totalLecture

                ? item

                : max,

        analytics[0]

    );


    return (

        <div className="lecture-activity-container">


            {/* ================================
                TOP SUMMARY
            ================================= */}

            <div className="lecture-activity-summary">


                <div className="lecture-summary-item">

                    <span className="lecture-summary-label">

                        Total Lectures

                    </span>

                    <strong>

                        {totalLectures}

                    </strong>

                </div>


                <div className="lecture-summary-divider"></div>


                <div className="lecture-summary-item">

                    <span className="lecture-summary-label">

                        Most Active

                    </span>

                    <strong>

                        Week {highestWeek.weekNumber}

                    </strong>

                </div>


            </div>


            {/* ================================
                CHART
            ================================= */}

            <div className="lecture-chart-wrapper">


                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <AreaChart

                        data={chartData}

                        margin={{

                            top: 10,

                            right: 8,

                            left: -20,

                            bottom: 0

                        }}

                    >


                        <defs>

                            <linearGradient

                                id="lectureGradient"

                                x1="0"

                                y1="0"

                                x2="0"

                                y2="1"

                            >

                                <stop

                                    offset="0%"

                                    stopColor="#25D366"

                                    stopOpacity={0.45}

                                />

                                <stop

                                    offset="100%"

                                    stopColor="#25D366"

                                    stopOpacity={0.02}

                                />

                            </linearGradient>

                        </defs>


                        <CartesianGrid

                            strokeDasharray="3 3"

                            stroke="#2A3942"

                            vertical={false}

                        />


                        <XAxis

                            dataKey="week"

                            tick={{

                                fill: "#8696A0",

                                fontSize: 11

                            }}

                            axisLine={false}

                            tickLine={false}

                        />


                        <YAxis

                            allowDecimals={false}

                            tick={{

                                fill: "#8696A0",

                                fontSize: 11

                            }}

                            axisLine={false}

                            tickLine={false}

                        />


                        <Tooltip

                            contentStyle={{

                                background: "#111B21",

                                border: "1px solid #25D366",

                                borderRadius: "10px",

                                color: "#FFFFFF"

                            }}

                            labelStyle={{

                                color: "#25D366",

                                fontWeight: "600"

                            }}

                            itemStyle={{

                                color: "#FFFFFF"

                            }}

                            formatter={(value) => [

                                `${value} Lectures`,

                                "Activity"

                            ]}

                        />


                        <Area

                            type="monotone"

                            dataKey="lectures"

                            stroke="#25D366"

                            strokeWidth={3}

                            fill="url(#lectureGradient)"

                            dot={{

                                r: 4,

                                fill: "#25D366",

                                stroke: "#111B21",

                                strokeWidth: 2

                            }}

                            activeDot={{

                                r: 6

                            }}

                        />


                    </AreaChart>

                </ResponsiveContainer>


            </div>


            {/* ================================
                FOOTER MESSAGE
            ================================= */}

            <div className="lecture-activity-message">

                <i className="bi bi-lightning-charge-fill"></i>

                <span>

                    {highestWeek.totalLecture >= 10

                        ? "Excellent lecture activity this week. Keep the momentum going!"

                        : "Keep conducting regular lectures to maintain consistent academic progress."

                    }

                </span>

            </div>


        </div>

    );

}


export default LectureActivity;