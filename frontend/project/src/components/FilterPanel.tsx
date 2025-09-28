import React from 'react';
import { Calendar, MapPin, Tag, X } from 'lucide-react';
import type { FilterState } from './DashboardContent';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const categories = [
    'all', 'Electronics', 'Appliances', 'Furniture', 'Wearables', 'Health', 'Home', 'Fitness'
  ];

  const regions = [
    'all', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'
  ];

  const timeFrames = [
    '2024', '2023', 'Last 12 months', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
  ];

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      timeFrame: '2024',
      category: 'all',
      region: 'all'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
        <button
          onClick={resetFilters}
          className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Frame Filter */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Calendar className="w-4 h-4" />
            <span>Time Frame</span>
          </label>
          <div className="space-y-2">
            {timeFrames.map((timeFrame) => (
              <label key={timeFrame} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeFrame"
                  value={timeFrame}
                  checked={filters.timeFrame === timeFrame}
                  onChange={(e) => updateFilter('timeFrame', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{timeFrame}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Region Filter */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <MapPin className="w-4 h-4" />
            <span>Region</span>
          </label>
          <div className="space-y-2">
            {regions.map((region) => (
              <label key={region} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="region"
                  value={region}
                  checked={filters.region === region}
                  onChange={(e) => updateFilter('region', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{region}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Active Filters:</h4>
        <div className="flex flex-wrap gap-2">
          {filters.timeFrame !== '2024' && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm">
              Time: {filters.timeFrame}
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
              Category: {filters.category}
            </span>
          )}
          {filters.region !== 'all' && (
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm">
              Region: {filters.region}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};