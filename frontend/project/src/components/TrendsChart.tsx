import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import type { FilterState } from "./DashboardContent";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AgeGroup {
  group: string;
  value: number;
}

const ageGroups: AgeGroup[] = [
  { group: "18-25", value: 120 },
  { group: "26-35", value: 180 },
  { group: "36-45", value: 150 },
  { group: "46-60", value: 100 },
  { group: "60+", value: 70 },
];

const PIE_COLORS = ["#60a5fa", "#818cf8", "#f472b6", "#34d399", "#fbbf24"];

export const TrendsChart: React.FC<{ filters: FilterState }> = ({
  filters,
}) => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const endpoint =
      view === "monthly"
        ? "http://192.168.182.1:5000/api/monthly_sales"
        : "http://192.168.182.1:5000/api/yearly_sales";

    setLoading(true);
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setSalesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales data:", err);
        setLoading(false);
      });
  }, [view]);

  if (loading) return <div className="text-center p-4">Loading chart...</div>;

  const chartData = {
    labels: salesData.map((item) =>
      view === "monthly" ? item.month : item.year?.toString()
    ),
    datasets: [
      {
        label:
          view === "monthly"
            ? "Total Quantity (Monthly)"
            : "Total Quantity (Yearly)",
        data: salesData.map((item) => item.total_quantity),
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96, 165, 250, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: view === "monthly" ? "Monthly Sales Trend" : "Yearly Sales Trend",
        font: { size: 18 },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-full">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sales Trend Chart */}
        <div className="flex-1">
          <div className="flex justify-end mb-4 space-x-2">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                view === "monthly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setView("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                view === "yearly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setView("yearly")}
            >
              Yearly
            </button>
          </div>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Age Group Pie Chart */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sales by Age Group
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pie chart of age group sales
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <svg width="240" height="240" viewBox="0 0 120 120">
              {(() => {
                const total = ageGroups.reduce((sum, a) => sum + a.value, 0);
                let startAngle = 0;
                return ageGroups.map((age, i) => {
                  const angle = (age.value / total) * 2 * Math.PI;
                  const endAngle = startAngle + angle;
                  const x1 = 60 + 50 * Math.cos(startAngle);
                  const y1 = 60 + 50 * Math.sin(startAngle);
                  const x2 = 60 + 50 * Math.cos(endAngle);
                  const y2 = 60 + 50 * Math.sin(endAngle);
                  const largeArc = angle > Math.PI ? 1 : 0;
                  const path = `M60,60 L${x1},${y1} A50,50 0 ${largeArc},1 ${x2},${y2} Z`;
                  startAngle = endAngle;
                  return (
                    <path
                      key={age.group}
                      d={path}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  );
                });
              })()}
            </svg>

            <div className="flex flex-row items-center justify-center mt-4 gap-4 flex-wrap w-full">
              {ageGroups.map((age, i) => (
                <div key={age.group + "legend"} className="flex items-center">
                  <span
                    style={{
                      background: PIE_COLORS[i % PIE_COLORS.length],
                      width: 16,
                      height: 16,
                      display: "inline-block",
                      borderRadius: 3,
                      marginRight: 6,
                    }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {age.group}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Young adults (26-35) are the highest contributors to sales.
          </div>
        </div>
      </div>
    </div>
  );
};
