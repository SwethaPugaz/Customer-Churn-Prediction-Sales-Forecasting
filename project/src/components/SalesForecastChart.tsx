// SalesForecastChart.tsx
import {
  CategoryScale,
  ChartData,
  ChartDataset,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/** API response shape */
interface SalesApiResponse {
  historical_dates: string[];
  forecast_dates: string[];
  historical_sales: number[]; // same length as historical_dates
  forecast_sales: number[]; // same length as forecast_dates
}

const API_BASE = "http://192.168.182.1:5000"; // <-- endpoint you provided

function SalesForecastChart(): JSX.Element {
  const [chartData, setChartData] = useState<ChartData<
    "line",
    (number | null)[]
  > | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [forecastDays, setForecastDays] = useState<number>(90); // default next quarter

  useEffect(() => {
    setLoading(true);
    const url = `${API_BASE}/api/full_sales_view?days=${forecastDays}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<SalesApiResponse>;
      })
      .then((data) => {
        const allLabels = [...data.historical_dates, ...data.forecast_dates];

        const historicalDataset: ChartDataset<"line", number[]> = {
          label: "Historical Daily Sales",
          data: data.historical_sales,
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f6",
          pointRadius: 1,
          tension: 0.3,
          fill: false,
        };

        const forecastDataset: ChartDataset<"line", (number | null)[]> = {
          label: "Forecasted Sales",
          // pad with nulls for historical portion, then add forecast values
          data: Array(data.historical_sales.length)
            .fill(null)
            .concat(data.forecast_sales),
          borderColor: "#3b82f6",
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.3,
          fill: true,
          // Chart.js allows backgroundColor to be a scriptable function
          backgroundColor: (context: ScriptableContext<"line">) => {
            const chartCtx = context.chart.ctx as CanvasRenderingContext2D;
            const gradient = chartCtx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
            gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
            return gradient;
          },
        };

        const chartData: ChartData<"line", (number | null)[]> = {
          labels: allLabels,
          datasets: [historicalDataset as any, forecastDataset],
        };

        setChartData(chartData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales data:", err);
        setLoading(false);
      });
  }, [forecastDays]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Historical Sales & ${forecastDays}-Day Forecast`,
        font: { size: 18, weight: "600" } as any,
        color: "#334155",
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Sales Amount ($)" },
        grid: { color: "#e2e8f0" },
      },
    },
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md h-[450px] flex flex-col">
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={() => setForecastDays(90)}
          className={`px-3 py-1 text-sm rounded-md ${
            forecastDays === 90
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Next Quarter
        </button>
        <button
          onClick={() => setForecastDays(365)}
          className={`px-3 py-1 text-sm rounded-md ${
            forecastDays === 365
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Next Year
        </button>
      </div>

      <div className="flex-grow">
        {loading ? (
          <div className="text-center p-4">Loading sales chart...</div>
        ) : (
          chartData && <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
}

export default SalesForecastChart;
