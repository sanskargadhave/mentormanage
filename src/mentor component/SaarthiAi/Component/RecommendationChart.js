import "./RecommendationChart.css";
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer
} from "recharts";

function RecommendationChart() {

    const score = 91;

    const data = [
        {
            name: "AI Score",
            value: score,
            fill: "#25D366"
        }
    ];

    return (

        <div className="recommendation-chart">

            <div className="recommendation-header">

                <h3>🧠 AI Confidence Score</h3>

                <span>Overall Mentor Performance</span>

            </div>

            <div className="recommendation-chart-wrapper">

                <ResponsiveContainer
                    width="100%"
                    height={220}
                >

                    <RadialBarChart
                        innerRadius="72%"
                        outerRadius="100%"
                        barSize={14}
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >

                        <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={12}
                        />

                    </RadialBarChart>

                </ResponsiveContainer>

                <div className="recommendation-score">

                    <h1>{score}%</h1>

                    <span>Excellent</span>

                </div>

            </div>

            <div className="recommendation-footer">

                <div>

                    <strong>Attendance</strong>

                    <span>96%</span>

                </div>

                <div>

                    <strong>Assignments</strong>

                    <span>89%</span>

                </div>

                <div>

                    <strong>Student Activity</strong>

                    <span>92%</span>

                </div>

            </div>

        </div>

    );

}

export default RecommendationChart;