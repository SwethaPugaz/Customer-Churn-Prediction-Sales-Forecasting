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
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import CsvUploadPage from "./CsvUploadPage";
import { DemandForecastCard } from "./DemandForecastCard";
import SalesForecastChart from "./SalesForecastChart";
import { StatsCards } from "./StatsCards";
import { TopProductsTable } from "./TopProductsTable";
import { TrendsChart } from "./TrendsChart";
import ChurnSegmentationx from "./pieChart";

// import { StatsCards } from "@/components/StatsCards";

// Dynamic Risk Scoring & Customer Profiles

type Churner = {
  churn_probability: number; // 0.0 - 1.0
  customer_id: string;
  last_purchase_date: string; // ISO date string
  subscription_status: string;
  total_cancellations: number;
};

export default function TopChurnCustomers() {
  const [churners, setChurners] = useState<Churner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [customerCount, setCustomerCount] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const pageSize = 10;

  const BASE = "http://192.168.182.1:5000";

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${BASE}/api/predict_churn?count=${customerCount}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Churner[];
        const normalized = data.map((d) => ({
          ...d,
          churn_probability: Number(d.churn_probability) || 0,
        }));
        setChurners(normalized);
        setPage(1);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Error fetching churn predictions:", err);
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [customerCount]);

  const filtered = churners.filter((c) =>
    c.customer_id.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "score") return b.churn_probability - a.churn_probability;
    return a.customer_id.localeCompare(b.customer_id);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [search, sortBy, customerCount]);

  function formatDate(d: string) {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-white">
          Top Customers Likely to Churn
        </h2>
        <div className="flex gap-2">
          {/* <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg"
            onClick={() => {
              const rows = paginated.map((c) => ({
                customer_id: c.customer_id,
                churn_probability: c.churn_probability,
                last_purchase_date: c.last_purchase_date,
                subscription_status: c.subscription_status,
                total_cancellations: c.total_cancellations,
              }));
              const csv = [
                Object.keys(rows[0] || {}).join(","),
                ...rows.map((r) =>
                  Object.values(r)
                    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                    .join(",")
                ),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `churners_page_${page}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-5 h-5 mr-2" /> Export
          </button> */}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer..."
          className="px-4 py-2 border rounded text-lg text-black"
        />

        <div className="flex gap-4 items-center">
          <label
            htmlFor="customerCount"
            className="text-lg font-semibold text-white"
          >
            Show:
          </label>
          <select
            id="customerCount"
            value={customerCount}
            onChange={(e) => setCustomerCount(Number(e.target.value))}
            className="px-3 py-2 rounded text-lg border text-black"
          >
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-lg">customers</span>
          <button
            className={`px-3 py-2 rounded text-lg ${
              sortBy === "score" ? "bg-blue-600 text-white" : "bg-gray-700"
            }`}
            onClick={() => setSortBy("score")}
          >
            Sort by Score
          </button>
          <button
            className={`px-3 py-2 rounded text-lg ${
              sortBy === "name" ? "bg-blue-600 text-white" : "bg-gray-700"
            }`}
            onClick={() => setSortBy("name")}
          >
            Sort by ID
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <span className="ml-4 text-lg">Loading data...</span>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-400">Error: {error}</div>
      ) : (
        <>
          <table className="w-full text-lg text-white">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="py-2">Customer ID</th>
                <th className="py-2">Churn %</th>
                <th className="py-2">Subscription</th>
                <th className="py-2">Last Purchase</th>
                <th className="py-2">Cancellations</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => (
                <tr
                  key={c.customer_id + i}
                  className="border-b border-gray-700"
                >
                  <td className="py-2 font-bold">{c.customer_id}</td>
                  <td className="py-2">
                    {Math.round(c.churn_probability * 100)}%
                  </td>
                  <td className="py-2">{c.subscription_status}</td>
                  <td className="py-2">{formatDate(c.last_purchase_date)}</td>
                  <td className="py-2">{c.total_cancellations}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className="px-4 py-2 rounded bg-gray-700 text-lg font-semibold disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-lg">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 rounded bg-gray-700 text-lg font-semibold disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>

          <div className="mt-6">
            {paginated[0] ? (
              <span className="px-4 py-2 bg-red-600 text-white rounded-full text-lg font-bold">
                Alert: {paginated[0].customer_id} is at highest risk! (
                {Math.round(paginated[0].churn_probability * 100)}%)
              </span>
            ) : (
              <span className="text-gray-400">No customers to show</span>
            )}
          </div>
        </>
      )}

      <div className="mt-4 text-sm text-gray-400">
        Note: Ensure your backend allows CORS from your frontend origin and that
        the endpoint path is <code>/api/predict_churn</code>.
      </div>
    </div>
  );
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type TrendsResponse = {
  churn_counts: number[];
  months: string[]; // ISO-like month strings: YYYY-MM
};

function ChurnRateTrends() {
  const [chartData, setChartData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE = "http://192.168.182.1:5000";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${BASE}/api/churn_trends`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: TrendsResponse) => {
        if (!mounted) return;
        setChartData({
          labels: data.months,
          datasets: [
            {
              label: "Number of Churned Customers",
              data: data.churn_counts,
              borderColor: "rgb(220,53,69)",
              backgroundColor: "rgba(220,53,69,0.2)",
              tension: 0.25,
              fill: true,
              pointRadius: 2,
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error fetching churn trend data:", err);
        setError(err.message || "Failed to load churn trends");
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Monthly Customer Churn Trends",
        font: { size: 16 },
      },
    },
    scales: {
      x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
      y: { beginAtZero: true },
    },
  };

  function exportCSV() {
    if (!chartData) return;
    const labels: string[] = chartData.labels || [];
    const values: number[] = chartData.datasets?.[0]?.data || [];
    const rows = [
      "month,churn_count",
      ...labels.map((m, i) => `${m},${values[i] ?? ""}`),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `churn_trends.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Churn Rate Trends</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
          >
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
        </div>
      </div>

      <div className="h-56 flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Loading churn trend chart...
            </span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">Error: {error}</div>
        ) : chartData ? (
          <div className="w-full">
            <Line options={options} data={chartData} />
          </div>
        ) : (
          <div className="text-sm text-gray-500">No data available</div>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Red line shows churn count over months
      </p>
    </div>
  );
}

// Improved Interactive Segmentation with Clear Insights
const ChurnSegmentation = () => {
  // Example segment data
  const segments = [
    {
      name: "High Risk",
      percent: 35,
      color: "#ef4444",
      insights: [
        "High Risk customers are likely to churn within the next 30 days.",
        "Average engagement score: 2.1/10 (vs. 7.8 for Low Risk).",
        "Frequent support tickets: 3.2 per month.",
        "Recent drop in purchase frequency and basket size.",
        "Top drivers: price sensitivity, unresolved issues, negative feedback.",
        "Recommended actions: Immediate retention offers, personal outreach, priority support.",
      ],
    },
    {
      name: "Medium Risk",
      percent: 25,
      color: "#fbbf24",
      insights: [
        "Medium Risk customers show fluctuating engagement.",
        "Average engagement score: 5.2/10.",
        "Occasional support tickets, mostly resolved.",
        "Responsive to targeted promotions and loyalty programs.",
        "Top drivers: service delays, onboarding issues.",
        "Recommended actions: Timely follow-ups, exclusive offers, improved onboarding.",
      ],
    },
    {
      name: "Low Risk",
      percent: 30,
      color: "#34d399",
      insights: [
        "Low Risk customers are highly loyal and engaged.",
        "Average engagement score: 7.8/10.",
        "Rarely contact support; high satisfaction ratings.",
        "Consistent purchase frequency and high basket size.",
        "Top drivers: positive experiences, rewards, regular communication.",
        "Recommended actions: Maintain engagement, reward programs, feedback collection.",
      ],
    },
    {
      name: "Critical",
      percent: 10,
      color: "#60a5fa",
      insights: [
        "Critical segment includes new, inactive, or unpredictable customers.",
        "Average engagement score: 3.5/10.",
        "Low purchase history, sporadic activity.",
        "Unclear churn drivers; may be affected by external factors.",
        "Recommended actions: Personalized outreach, onboarding support, engagement campaigns.",
      ],
    },
  ];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Customer Segmentation by Churn Likelihood
        </h2>
        {/* <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
          <Download className="w-4 h-4 mr-1" /> Export
        </button> */}
      </div>
      <div className="w-full flex flex-col md:flex-row md:space-x-8 md:items-stretch mt-2">
        {/* Detailed Pie Chart */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8 md:mb-0 p-4">
          {/* Pie chart using SVG arcs for perfect circle and accurate segments */}
          <svg width="100%" height="240" viewBox="0 0 240 240">
            <circle r="100" cx="120" cy="120" fill="#e5e7eb" />
            {/* Pie segments */}
            {/* High Risk: 35% */}
            <path
              d="M120 120 L120 20 A100 100 0 0 1 210.6 62.2 Z"
              fill="#ef4444"
            />
            {/* Medium Risk: 25% */}
            <path
              d="M120 120 L210.6 62.2 A100 100 0 0 1 195.6 195.6 Z"
              fill="#fbbf24"
            />
            {/* Low Risk: 30% */}
            <path
              d="M120 120 L195.6 195.6 A100 100 0 0 1 62.2 210.6 Z"
              fill="#34d399"
            />
            {/* Critical: 10% */}
            <path
              d="M120 120 L62.2 210.6 A100 100 0 0 1 20 120 Z"
              fill="#60a5fa"
            />
          </svg>
          <div className="mt-2 text-xs w-full text-center">
            <div className="flex items-center justify-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: "#ef4444" }}
              ></span>{" "}
              High Risk (35%)
            </div>
            <div className="flex items-center justify-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: "#fbbf24" }}
              ></span>{" "}
              Medium Risk (25%)
            </div>
            <div className="flex items-center justify-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: "#34d399" }}
              ></span>{" "}
              Low Risk (30%)
            </div>
            <div className="flex items-center justify-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: "#60a5fa" }}
              ></span>{" "}
              Critical (10%)
            </div>
          </div>
        </div>
        {/* Detailed Bar Chart */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8 md:mb-0 p-4">
          <svg width="100%" height="220" viewBox="0 0 320 220">
            {segments.map((seg, i) => (
              <rect
                key={seg.name}
                x={40 + i * 65}
                y={180 - seg.percent * 4.5}
                width="40"
                height={seg.percent * 4.5}
                fill={seg.color}
              />
            ))}
            {/* Y-axis labels */}
            <text x="15" y="40" fontSize="16" fill="#374151">
              100%
            </text>
            <text x="15" y="110" fontSize="16" fill="#374151">
              50%
            </text>
            <text x="15" y="180" fontSize="16" fill="#374151">
              0%
            </text>
            {/* Segment names below each bar, rotated for clarity */}
            {segments.map((seg, i) => (
              <text
                key={seg.name}
                x={60 + i * 65}
                y="210"
                fontSize="16"
                fill="#374151"
                textAnchor="middle"
                transform={`rotate(15 ${60 + i * 65},210)`}
              >
                {seg.name}
              </text>
            ))}
          </svg>
          <div className="mt-2 text-sm w-full text-center">
            Bar chart: Segment size by churn risk
          </div>
        </div>
        {/* Cluster Visualization with legend */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <svg width="100%" height="120" viewBox="0 0 140 120">
            <circle cx="40" cy="40" r="16" fill="#ef4444" />
            <circle cx="80" cy="40" r="13" fill="#fbbf24" />
            <circle cx="110" cy="70" r="18" fill="#34d399" />
            <circle cx="70" cy="90" r="10" fill="#60a5fa" />
          </svg>
          <div className="mt-2 text-xs w-full text-center">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: "#ef4444" }}
            ></span>{" "}
            High Risk
            <span
              className="inline-block w-3 h-3 rounded-full ml-2"
              style={{ background: "#fbbf24" }}
            ></span>{" "}
            Medium Risk
            <span
              className="inline-block w-3 h-3 rounded-full ml-2"
              style={{ background: "#34d399" }}
            ></span>{" "}
            Low Risk
            <span
              className="inline-block w-3 h-3 rounded-full ml-2"
              style={{ background: "#60a5fa" }}
            ></span>{" "}
            Critical
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((seg) => (
          <div
            key={seg.name}
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20"
          >
            <h4
              className="font-semibold text-sm mb-1"
              style={{ color: seg.color }}
            >
              {seg.name} ({seg.percent}%)
            </h4>
            <ul className="list-disc ml-5 text-xs text-gray-700 dark:text-gray-300">
              {seg.insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        ))}
        <ChurnSegmentation />
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Each segment shows its size and actionable insights for retention.
      </p>
    </div>
  );
};

// Enhanced Churn Driver Analysis & Customer Insights
const ChurnDrivers = () => {
  const [selected, setSelected] = React.useState("Price");
  const drivers = [
    {
      name: "Price",
      value: 40,
      suggestion: "Offer discounts or loyalty pricing.",
      insights: [
        'Customers in the "High Risk" segment are price sensitive.',
        "Recent price increases correlated with churn spikes.",
        "Top churned customers made fewer purchases after price changes.",
      ],
      chartColor: "#fbbf24",
      icon: "💸",
    },
    {
      name: "Service",
      value: 30,
      suggestion: "Improve support and onboarding.",
      insights: [
        "Negative service reviews precede churn events.",
        "Customers with onboarding issues are 2x more likely to churn.",
        'Service delays impact retention in the "Medium Risk" segment.',
      ],
      chartColor: "#60a5fa",
      icon: "🤝",
    },
    {
      name: "Support",
      value: 20,
      suggestion: "Provide 24/7 help and proactive outreach.",
      insights: [
        "Support tickets unresolved >48h increase churn risk.",
        "Proactive outreach reduces churn by 15%.",
        "High-risk customers contact support more frequently.",
      ],
      chartColor: "#ef4444",
      icon: "🛟",
    },
  ];
  const selectedDriver = drivers.find((d) => d.name === selected);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Churn Drivers & Customer Insights
        </h2>
        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
          <Download className="w-4 h-4 mr-1" /> Export
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        {drivers.map((d) => (
          <button
            key={d.name}
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 ${
              selected === d.name ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setSelected(d.name)}
          >
            <span>{d.icon}</span> {d.name}
          </button>
        ))}
      </div>
      <div className="h-40 flex items-center justify-center">
        <svg width="320" height="120" viewBox="0 0 320 120">
          {drivers.map((d, i) => (
            <circle
              key={d.name}
              cx={60 + i * 100}
              cy="60"
              r={selected === d.name ? 35 : 25}
              fill={selected === d.name ? d.chartColor : "#e5e7eb"}
            />
          ))}
          <text x="45" y="115" fontSize="12" fill="#6b7280">
            Price
          </text>
          <text x="145" y="115" fontSize="12" fill="#6b7280">
            Service
          </text>
          <text x="245" y="115" fontSize="12" fill="#6b7280">
            Support
          </text>
        </svg>
      </div>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Retention Strategy
        </h4>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          {selectedDriver?.suggestion}
        </p>
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mt-4 mb-2">
          Customer Insights
        </h4>
        <ul className="list-disc ml-5 text-xs text-blue-700 dark:text-blue-400">
          {selectedDriver?.insights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Bubble chart shows top churn drivers. Click to drill down for actionable
        insights.
      </p>
    </div>
  );
};

export const DashboardContent: React.FC = () => {
  // Track sidebar selection using window state (for demo, ideally use context)
  const [activeMain, setActiveMain] = useState(0);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark((prev) => {
      if (prev) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
      return !prev;
    });
  };

  // For demo, use window to sync with Sidebar
  (window as any).setDashboardActive = (main: number) => {
    setActiveMain(main);
  };

  // Top navigation bar
  const navItems = [
    { label: "Sales Forecast", icon: <span className="mr-2">📊</span> },
    { label: "Churn Prediction", icon: <span className="mr-2">🔄</span> },
    { label: "Upload", icon: <span className="mr-2">📤</span> },
  ];

  return (
    <div className="w-full">
      {/* Top navigation tabs, replacing filter/export area */}
      <div className="flex justify-center items-center gap-4 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        {navItems.map((item, idx) => (
          <button
            key={item.label}
            className={`flex items-center px-6 py-2 rounded-lg text-lg font-semibold transition-colors focus:outline-none ${
              activeMain === idx
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            }`}
            onClick={() => {
              setActiveMain(idx);
              // @ts-ignore
              if (typeof window.setDashboardActive === "function") {
                // @ts-ignore
                window.setDashboardActive(idx);
              }
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Render content based on top nav selection */}
      <div className="p-6">
        {activeMain === 0 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sales Forecasting Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitor and predict your sales performance
              </p>
            </div>
            <StatsCards />
            <TopProductsTable
              filters={{ timeFrame: "2024", category: "all", region: "all" }}
            />
            <SalesForecastChart />
            {/* //   filters={{ timeFrame: "Q1 2024", category: "all", region: "all" }}
            // /> */}

            <TrendsChart
              filters={{ timeFrame: "2024", category: "all", region: "all" }}
            />
            <DemandForecastCard />
            {/* <DemandForecast /> */}
          </div>
        )}
        {activeMain === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Churn Prediction Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitor and analyze customer churn risk
              </p>
            </div>
            <TopChurnCustomers />
            <ChurnSegmentationx />

            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              <div className="flex-1 min-w-0 flex flex-col gap-6">
                <ChurnRateTrends />
                {/* Churn Risk Summary Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                    Churn Risk Summary
                  </h3>
                  <div className="flex gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        1,250
                      </span>
                      <span className="text-xs text-blue-700 dark:text-blue-400">
                        Total Customers
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        8.2%
                      </span>
                      <span className="text-xs text-red-600 dark:text-red-400">
                        Churn Rate
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ↓ 0.3%
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Trend (vs last month)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <ChurnDrivers />
              </div>
            </div>
            {/* <ChurnSegmentation /> */}
          </div>
        )}
        {activeMain === 2 && <CsvUploadPage />}
      </div>
    </div>
  );
};
