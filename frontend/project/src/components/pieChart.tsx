import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type SegResponse = Record<string, number>;

export default function ChurnSegmentationx(): JSX.Element {
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
  const fallbackColor = "#60a5fa";

  // Ordered labels: ensure High/Medium/Low first (if present), then extras in stable order
  const orderedLabels = useMemo(() => {
    if (!data) return [] as string[];
    const presentOrdered = order.filter((k) => k in data);
    const extras = Object.keys(data).filter((k) => !presentOrdered.includes(k));
    return [...presentOrdered, ...extras];
  }, [data]);

  // chart data memoized and following orderedLabels
  const chart = useMemo(() => {
    if (!data) return null;
    const labels = orderedLabels;
    const values = labels.map((k) => data[k] ?? 0);
    const bg = labels.map((k, i) => colors[i] ?? fallbackColor);
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: bg,
          borderColor: bg,
          borderWidth: 1,
        },
      ],
    } as any;
  }, [data, orderedLabels]);

  // Summary (percentages) aligned to orderedLabels
  const summary = useMemo(() => {
    if (!data) return [];
    const total = Object.values(data).reduce((s, v) => s + v, 0);
    return orderedLabels.map((label, i) => {
      const value = data[label] ?? 0;
      return {
        label,
        value,
        pct: `${Math.round((value / Math.max(1, total)) * 100)}%`,
        color: colors[i] ?? fallbackColor,
      };
    });
  }, [data, orderedLabels]);

  // Faster, ordered CSV export
  async function exportCSV() {
    if (!data || orderedLabels.length === 0) return;
    // Build CSV rows in memory (small overhead). This is fast for tens/hundreds of rows.
    const header = ["segment", "count"];
    const rows: string[] = [];
    rows.push(header.join(","));
    for (const label of orderedLabels) {
      const count = data[label] ?? 0;
      // Escape quotes if any (not likely here) — keep CSV safe
      const safeLabel = `"${String(label).replace(/"/g, '""')}"`;
      rows.push([safeLabel, String(count)].join(","));
    }

    try {
      const blob = new Blob([rows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const filename = `churn_segmentation_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.csv`;
      // Use a short defer to ensure UI updates before download (helps with huge payloads)
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      // For some browsers, clicking immediately from JS can block UI briefly on huge blobs;
      // scheduling the click keeps it responsive.
      requestAnimationFrame(() => a.click());
      // release url
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error("Export failed:", err);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Customer Segmentation by Churn Likelihood
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={!data || loading || orderedLabels.length === 0}
            className={`flex items-center px-3 py-1 rounded text-xs ${
              !data || loading || orderedLabels.length === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            title={
              !data || loading || orderedLabels.length === 0
                ? "No data to export"
                : "Export CSV"
            }
          >
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row md:space-x-8 md:items-stretch mt-2">
        {/* Left: Chart */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8 md:mb-0 p-4">
          <div className="w-full max-w-xs">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-500">Error: {error}</div>
            ) : chart ? (
              <Doughnut
                data={chart}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: { legend: { display: false } },
                }}
              />
            ) : (
              <div className="text-sm text-gray-500">No data</div>
            )}
          </div>

          {/* Legend below chart → left aligned */}
          {/* <div className="mt-4 text-sm w-full text-left">
            {summary.map((s) => (
              <div key={s.label} className="flex items-center gap-2 mt-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="font-medium">{s.label}</span>
                <span className="text-gray-500 ml-2">
                  {s.pct} ({s.value})
                </span>
              </div>
            ))}
          </div> */}
        </div>

        {/* Right: Big Centered Counts (respect orderedLabels) */}
        <div className="flex-1 p-6 flex flex-col justify-center items-center">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6 underline">
            Detailed Counts
          </div>
          <div className="space-y-6 text-center w-full">
            {data &&
              orderedLabels.map((k, idx) => (
                <div
                  key={k}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="flex items-center gap-3 text-2xl font-semibold">
                    <span
                      className="inline-block w-6 h-6 rounded-full"
                      style={{ background: colors[idx] ?? fallbackColor }}
                    />
                    <div>{k}</div>
                  </div>
                  <div className="text-4xl font-extrabold text-blue-600 mt-2">
                    {data[k]}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
