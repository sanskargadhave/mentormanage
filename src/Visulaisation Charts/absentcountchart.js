import {Chart as ChartJs,BarElement,CategoryScale,LinearScale,Tooltip,Legend} from "chart.js";
import {Bar} from "react-chartjs-2";

ChartJs.register(BarElement,CategoryScale,LinearScale,Tooltip,Legend);


function AbsentChartByLecture()
{
     const chartData = {
        labels: ["Present", "Absent"],
        datasets: [
        {
            label: "Java (Second - A)",
            data: [88, 12],
            backgroundColor: ["#4CAF50", "#F44336"]
        }
    ]
  };
}