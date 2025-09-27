import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type SegResponse = Record<string, number>;

export default function ChurnSegmentation() {
  const [data, setData] = useState<SegResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE = "http://192.168.182.1:5000";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${BASE}/api/churn_segmentation`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: SegResponse) => {
        if (!mounted) return;
        setData(json);
      })
      .catch((err) => {
        console.error("Error fetching segmentation data:", err);
        setError(err.message || "Failed to fetch segmentation");
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // Desired order and colors
  const order = ["High Risk", "Medium Risk", "Low Risk"];
  const colors = ["#ef4444", "#fbbf24", "#34d399"]; // red, yellow, green

  const chart = React.useMemo(() => {
    if (!data) return null;
    // ensure values follow `order`, fallback to keys present
    const labels = order.filter((k) => k in data);
    // include any other keys after the ordered ones
    const extra = Object.keys(data).filter((k) => !labels.includes(k));
    const allLabels = [...labels, ...extra];
    const values = allLabels.map((k) => data[k] ?? 0);
    const bg = allLabels.map((k, i) => colors[i] ?? "#60a5fa");

    return {
      labels: allLabels,
      datasets: [
        {
          data: values,
          backgroundColor: bg,
          borderColor: bg.map((c) => c),
          borderWidth: 1,
        },
      ],
    } as any;
  }, [data]);

  function exportCSV() {
    if (!data) return;
    const rows = ["segment,count", ...Object.entries(data).map(([k, v]) => `${k},${v}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `churn_segmentation.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // compute percentages for legend
  const summary = React.useMemo(() => {
    if (!data) return [] as { label: string; value: number; pct: string; color: string }[];
    const total = Object.values(data).reduce((s, v) => s + v, 0);
    const entries = Object.entries(data).map(([k, v]) => ({ label: k, value: v }));
    // sort by our order
    entries.sort((a, b) => (order.indexOf(a.label) - order.indexOf(b.label)) || 0);
    return entries.map((e, i) => ({ label: e.label, value: e.value, pct: `${Math.round((e.value / Math.max(1, total)) * 100)}%`, color: colors[i] ?? "#60a5fa" }));
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Customer Segmentation by Churn Likelihood</h2>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row md:space-x-8 md:items-stretch mt-2">
        <div className="flex-1 flex flex-col items-center justify-center mb-8 md:mb-0 p-4">
          <div className="w-full max-w-xs">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-500">Error: {error}</div>
            ) : chart ? (
              <Doughnut data={chart} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }} />
            ) : (
              <div className="text-sm text-gray-500">No data</div>
            )}
          </div>

          <div className="mt-2 text-xs w-full text-center">
            {summary.map((s) => (
              <div key={s.label} className="flex items-center justify-center gap-2 mt-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: s.color }} />
                <span className="font-medium">{s.label}</span>
                <span className="text-gray-500 ml-2">{s.pct} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">Detailed counts</div>
          <div className="mt-3 space-y-2">
            {data && Object.entries(data).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: (colors[order.indexOf(k)] ?? "#60a5fa") }} />
                  <div className="font-medium">{k}</div>
                </div>
                <div className="font-semibold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Note: values are fetched from <code>/api/churn_segmentation</code></p>
    </div>
  );
}
