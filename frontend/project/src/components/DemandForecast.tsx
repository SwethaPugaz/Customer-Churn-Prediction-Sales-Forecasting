import React, { useEffect, useState } from "react";

interface Forecast {
  product_id: string | number;
  forecasted_demand_30_days: number;
}

const DemandForecast: React.FC = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://192.168.182.1:5000/api/product_demand_forecast")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error from backend:", data.error);
          setForecasts([]);
        } else {
          setForecasts(data as Forecast[]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching demand forecast:", error);
        setLoading(false);
      });
  }, []);

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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Demand Forecast (Next 30 Days)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Product ID
              </th>
              <th className="p-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Predicted Units to Sell
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {forecasts.map((product) => (
              <tr key={product.product_id} className="hover:bg-gray-50">
                <td className="p-3 whitespace-nowrap font-medium text-gray-900">
                  {product.product_id}
                </td>
                <td className="p-3 whitespace-nowrap text-blue-600 font-semibold">
                  {product.forecasted_demand_30_days} Units
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemandForecast;
