import "./StudentAnnalytics.css";
import { useEffect,useState,useMemo} from "react";

function AttendanceHeatmapChart({AttendanceHeatmap=[]})
{
     const semesterStartDate = new Date("2026-06-15");
    const semesterEndDate = new Date("2026-11-30");

    const heatmapData = useMemo(() => {

        const attendanceMap = new Map();

        AttendanceHeatmap.forEach((item) => {

            const date = new Date(item.date);

            const dateKey = date
                .toISOString()
                .split("T")[0];

            attendanceMap.set(dateKey, item);

        });


        const result = [];

        const currentDate = new Date(
            semesterStartDate
        );


        while (
            currentDate <= semesterEndDate
        ) {

            const dateKey = currentDate
                .toISOString()
                .split("T")[0];


            const attendance =
                attendanceMap.get(dateKey);


            let status = "none";


            if (!attendance) {

                status = "none";

            }

            else if (
                attendance.TotalCount === 0
            ) {

                status = "none";

            }

            else if (
                attendance.PresentCount ===
                attendance.TotalCount
            ) {

                status = "present";

            }

            else if (
                attendance.PresentCount > 0
            ) {

                status = "partial";

            }

            else {

                status = "absent";

            }


            result.push({

                date: dateKey,

                present:
                    attendance?.PresentCount || 0,

                absent:
                    attendance?.AbsentCount || 0,

                total:
                    attendance?.TotalCount || 0,

                status

            });


            currentDate.setDate(
                currentDate.getDate() + 1
            );

        }


        return result;

    }, [AttendanceHeatmap]);


    return (

        <div className="attendance-heatmap">

            <div className="heatmap-header">
                <span>Jan</span>
                <span>Feb</span>
                <span>March</span>
                <span>Apr</span>
                <span>may</span>
                <span>Jun</span>
                
               

                <span>Jul</span>

                <span>Aug</span>

                <span>Sep</span>
                <span>Oct</span>

            </div>


            <div className="heatmap-body">

                <div className="weekday-labels">

                    <span>Mon</span>
                    <span>Tue</span>

                    <span>Wed</span>
                    <span>Thur</span>
                    <span>Fri</span>

                </div>


                <div className="heatmap-grid">

                    {heatmapData.map((day) => (

                        <div

                            key={day.date}

                            className={`
                                heatmap-cell
                                ${day.status}
                            `}

                            title={`
                                ${day.date}
                                | Present: ${day.present}
                                | Absent: ${day.absent}
                                | Total: ${day.total}
                            `}

                        />

                    ))}

                </div>

            </div>


            <div className="heatmap-legend">

                <span>Less</span>

                <span className="legend-box none" />

                <span className="legend-box absent" />

                <span className="legend-box partial" />

                <span className="legend-box present" />

                <span>More</span>

            </div>

        </div>);
}

export default AttendanceHeatmapChart;