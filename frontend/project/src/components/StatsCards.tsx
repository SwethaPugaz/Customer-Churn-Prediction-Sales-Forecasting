import {
  AlertTriangle,
  DollarSign,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export interface KpisType {
  average_daily_sales: number;
  best_month: string;
  best_month_sales: number;
  total_revenue: number;
  worst_month: string;
  worst_month_sales: number;
}

type Props = {
  /** Optional: pass KPIs directly */
  initialKpis?: KpisType | null;
  /** Optional: URL to fetch KPIs from if initialKpis isn't provided */
  apiUrl?: string;
};

const formatCurrency = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(2)}`;

export const StatsCards: React.FC<Props> = ({
  initialKpis = null,
  apiUrl = "http://192.168.182.1:5000/api/sales_kpis",
}) => {
  const [kpis, setKpis] = useState<KpisType | null>(initialKpis);
  const [loading, setLoading] = useState<boolean>(!initialKpis);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialKpis) return; // already provided
    let cancelled = false;
    setLoading(true);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setKpis(data as KpisType);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error fetching sales KPIs:", err);
        setError(String(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiUrl, initialKpis]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "green":
        return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      case "amber":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "purple":
        return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      default:
        return "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  const cards = kpis
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(kpis.total_revenue),
          change: undefined,
          changeType: "increase" as const,
          icon: DollarSign,
          color: "blue",
          period: "since inception",
        },
        {
          title: "Average Daily Sales",
          value: formatCurrency(kpis.average_daily_sales),
          change: undefined,
          changeType: "increase" as const,
          icon: Package,
          color: "green",
          period: "daily average",
        },
        {
          title: "Best Month",
          value: `${kpis.best_month} · ${formatCurrency(
            kpis.best_month_sales
          )}`,
          change:
            kpis.best_month_sales && kpis.total_revenue
              ? `${((kpis.best_month_sales / kpis.total_revenue) * 100).toFixed(
                  1
                )}% of revenue`
              : undefined,
          changeType: "increase" as const,
          icon: TrendingUp,
          color: "purple",
          period: "peak month",
        },
        {
          title: "Worst Month",
          value: `${kpis.worst_month} · ${formatCurrency(
            kpis.worst_month_sales
          )}`,
          change: undefined,
          changeType: "decrease" as const,
          icon: AlertTriangle,
          color: "amber",
          period: "needs attention",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="w-full grid place-items-center p-6">
        <div className="text-sm text-gray-500">Loading KPIs…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="text-sm text-red-500">Error loading KPIs: {error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <Icon className="w-6 h-6" />
              </div>

              {stat.change ? (
                <div
                  className={`flex items-center text-sm font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat.changeType === "increase" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              ) : (
                <div className="text-sm text-gray-400">&nbsp;</div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.period}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
