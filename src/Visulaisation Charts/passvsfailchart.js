import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ResultChart({ pass, fail,present,absent }) {

  const data = {
    labels: ["Pass", "Fail","Present","Absent"],
    datasets: [
      {
        label: "Test Result",
        data: [pass, fail,present,absent],
        backgroundColor: ["#28a745", "#dc6235","#c3dc35","#dc3535"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "200px" }}>
      <Pie data={data} />
    </div>
  );
}

export {ResultChart}