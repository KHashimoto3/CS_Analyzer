type Props = {
  label: string;
  datasets: {
    label: string;
    data: {
      x: number;
      y: number;
    }[];
    backgroundColor: string;
  }[];
};

import { Scatter } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

export const ScatterChart = (props: Props) => {
  const { label, datasets } = props;

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>散布図</h2>
      <p>散布図を表示する</p>
      <div style={{ width: 600, height: 400 }}>
        <Scatter data={{ datasets }} width={600} height={400} />
      </div>
    </div>
  );
};
