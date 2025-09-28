// src/components/ChurnRiskSummary.tsx
import { useEffect, useState } from "react";

type DbStats = {
  cancelled_count: number;
  cancelled_percentage: number;
  total_entries?: number;
};

const API_URL = "http://192.168.182.1:5000/api/db_stats";

export default function ChurnRiskSummary(): JSX.Element {
  const [stats, setStats] = useState<DbStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: DbStats) => {
        if (!mounted) return;
        setStats(json);
      })
      .catch((err) => {
        console.error("Failed to fetch db stats:", err);
        if (mounted) setError(err.message || "Failed to load stats");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-IN").format(Math.round(n));

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">
        Churn Risk Summary
      </h3>

      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-800 dark:text-blue-200">
            Loading...
          </span>
        </div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : stats ? (
        <div className="flex gap-8 items-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {formatNumber(stats.cancelled_count)}
            </span>
            <span className="text-xs text-blue-700 dark:text-blue-400">
              Total churn
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              {Number(stats.cancelled_percentage).toFixed(1)}%
            </span>
            <span className="text-xs text-red-600 dark:text-red-400">
              Churn rate
            </span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600">No data</div>
      )}
    </div>
  );
}
