import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

type Props = {
  titleText: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = (props: Props) => {
  const { titleText, labels, datasets } = props;
  const options = {
    responsive: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: titleText,
      },
    },
  };

  const data = {
    labels,
    datasets,
  };

  return (
    <div>
      <h2>棒グラフ</h2>
      <Bar options={options} data={data} width={600} height={400} />
    </div>
  );
};
