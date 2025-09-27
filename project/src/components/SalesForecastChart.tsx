import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import type { FilterState } from './DashboardContent';

interface SalesForecastChartProps {
  filters: FilterState;
}

export const SalesForecastChart: React.FC<SalesForecastChartProps> = ({ filters }) => {
  const [activeTab, setActiveTab] = useState<'quarterly' | 'yearly'>('quarterly');

  // Mock data for different time frames
  const quarterlyData = [
    { period: 'Q1 2024', actual: 180000, forecast: 195000, confidence: 85 },
    { period: 'Q2 2024', actual: 220000, forecast: 235000, confidence: 88 },
    { period: 'Q3 2024', actual: 0, forecast: 275000, confidence: 82 },
    { period: 'Q4 2024', actual: 0, forecast: 315000, confidence: 79 },
  ];

  const yearlyData = [
    { period: '2022', actual: 680000, forecast: 680000, confidence: 100 },
    { period: '2023', actual: 820000, forecast: 820000, confidence: 100 },
    { period: '2024', actual: 400000, forecast: 1020000, confidence: 84 },
    { period: '2025', actual: 0, forecast: 1180000, confidence: 76 },
  ];

  const data = activeTab === 'quarterly' ? quarterlyData : yearlyData;
  const maxValue = Math.max(...data.map(d => Math.max(d.actual || 0, d.forecast)));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Forecast</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Actual vs Predicted Performance</p>
          </div>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTab('quarterly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'quarterly'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setActiveTab('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'yearly'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.period} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.period}</span>
              <div className="flex items-center space-x-4">
                {item.actual > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ${(item.actual / 1000).toFixed(0)}K
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full opacity-60"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    ${(item.forecast / 1000).toFixed(0)}K ({item.confidence}%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {/* Forecast bar (background) */}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-purple-600 opacity-30 rounded-lg transition-all duration-1000 ease-out"
                style={{ width: `${(item.forecast / maxValue) * 100}%` }}
              />
              
              {/* Actual bar (foreground) */}
              {item.actual > 0 && (
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm transition-all duration-1000 ease-out group-hover:shadow-md"
                  style={{ 
                    width: `${(item.actual / maxValue) * 100}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
              )}
              
              {/* Confidence indicator */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <TrendingUp className={`w-3 h-3 ${
                  item.confidence >= 85 ? 'text-green-500' : 
                  item.confidence >= 70 ? 'text-yellow-500' : 'text-red-500'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Actual Sales</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 opacity-60 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Forecasted Sales</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>Updated 2 hours ago</span>
        </div>
      </div>
    </div>
  );
};