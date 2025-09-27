import { AlertCircle, Clock, Package2, TrendingUp, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ForecastItem {
  product_id: string;
  product_name: string;
  forecasted_demand_30_days: number;
}

export const DemandForecastCard: React.FC = () => {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.182.1:5000/api/product_demand_forecast")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error from backend:", data.error);
          setForecasts([]);
        } else {
          setForecasts(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching demand forecast:", error);
        setLoading(false);
      });
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getStockLevel = (current: number, predicted: number) => {
    const percentage = (current / predicted) * 100;
    if (percentage <= 50) return "critical";
    if (percentage <= 100) return "low";
    if (percentage <= 150) return "medium";
    return "good";
  };

  const getStockLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500";
      case "low":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "good":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Demand Forecast
        </h2>
        <div className="text-center p-4">Loading demand forecast...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Demand Forecast
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Inventory management insights
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {forecasts.map((item, index) => {
          const stockLevel = getStockLevel(
            item.forecasted_demand_30_days,
            item.forecasted_demand_30_days
          );
          return (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-white dark:bg-gray-800 rounded">
                    <Package2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.product_name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.forecasted_demand_30_days} units predicted demand
                    </p>
                  </div>
                </div>
                <span
                  className={
                    "px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(stockLevel)}"
                  }
                >
                  {stockLevel}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Predicted Demand
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {item.forecasted_demand_30_days} units
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getStockLevelColor(
                      stockLevel
                    )}`}
                    style={{
                      width:
                        "${Math.min((item.forecasted_demand_30_days / item.forecasted_demand_30_days) * 100, 100)}%",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      30 days forecast
                    </span>
                  </div>
                  {stockLevel === "critical" || stockLevel === "low" ? (
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Reorder now
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Stock adequate
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
