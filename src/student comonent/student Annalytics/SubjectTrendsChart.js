import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell
} from "recharts";

import "./StudentAnnalytics.css";


function SubjectAttendanceChart({
    SubjectTrends = []
}) {

    const chartData = SubjectTrends.map((item) => ({

        subject: item.subject,

        totalLecture: item.totalLecture,

        totalPresent: item.totalPresent,

        totalAbsent: item.totalAbsent,

        percentage:

            item.totalLecture > 0

                ? Math.round(

                    (
                        item.totalPresent /
                        item.totalLecture

                    ) * 100

                )

                : 0

    }));


    return (

        <div className="subject-chart-wrapper">

            {chartData.length > 0 ? (

                <div className="subject-chart-scroll">

                    <div
                        className="subject-chart-inner"
                        style={{
                            height: Math.max(
                                280,
                                chartData.length * 55
                            )
                        }}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart

                                data={chartData}

                                layout="vertical"

                                margin={{
                                    top: 10,
                                    right: 25,
                                    left: 10,
                                    bottom: 10
                                }}

                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke="rgba(255,255,255,0.08)"
                                />

                                <XAxis

                                    type="number"

                                    domain={[0, 100]}

                                    tickFormatter={(value) =>
                                        `${value}%`
                                    }

                                    tick={{
                                        fill: "#8696a0",
                                        fontSize: 10
                                    }}

                                    axisLine={false}

                                    tickLine={false}

                                />

                                <YAxis

                                    type="category"

                                    dataKey="subject"

                                    width={95}

                                    tick={{
                                        fill: "#d1d7db",
                                        fontSize: 10
                                    }}

                                    axisLine={false}

                                    tickLine={false}

                                />

                                <Tooltip
                                    content={<SubjectTooltip />}
                                />

                                <Bar

                                    dataKey="percentage"

                                    barSize={20}

                                    radius={[
                                        0,
                                        8,
                                        8,
                                        0
                                    ]}

                                    animationDuration={1000}

                                >

                                    {chartData.map(
                                        (entry, index) => (

                                            <Cell

                                                key={index}

                                                fill={

                                                    entry.percentage >= 75

                                                        ? "#25D366"

                                                        : entry.percentage >= 50

                                                            ? "#f7b731"

                                                            : "#ff5c5c"

                                                }

                                            />

                                        )

                                    )}

                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            ) : (

                <div className="subject-empty">

                    📚

                    <p>
                        No subject attendance data
                    </p>

                </div>

            )}

        </div>

    );

}


function SubjectTooltip({
    active,
    payload
}) {

    if (
        !active ||
        !payload ||
        !payload.length
    ) {
        return null;
    }


    const data = payload[0].payload;


    return (

        <div className="subject-tooltip">

            <strong>
                {data.subject}
            </strong>

            <div>
                Attendance: {data.percentage}%
            </div>

            <div>
                Present: {data.totalPresent}
            </div>

            <div>
                Absent: {data.totalAbsent}
            </div>

            <div>
                Total Lectures: {data.totalLecture}
            </div>

        </div>

    );

}


export default SubjectAttendanceChart;