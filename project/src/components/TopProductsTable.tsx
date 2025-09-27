import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Package } from 'lucide-react';
import type { FilterState } from './DashboardContent';

interface TopProductsTableProps {
  filters: FilterState;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ filters }) => {
  const products = [
    { rank: 1, name: 'Ultra Wireless Headphones', category: 'Electronics', sales: 12450, forecast: 15600, growth: 25.3, confidence: 92, status: 'high' },
    { rank: 2, name: 'Smart Fitness Watch', category: 'Wearables', sales: 9800, forecast: 11200, growth: 14.3, confidence: 88, status: 'high' },
    { rank: 3, name: 'Premium Coffee Maker', category: 'Appliances', sales: 7650, forecast: 8900, growth: 16.3, confidence: 85, status: 'medium' },
    { rank: 4, name: 'Ergonomic Office Chair', category: 'Furniture', sales: 6200, forecast: 7400, growth: 19.4, confidence: 83, status: 'high' },
    { rank: 5, name: 'Wireless Gaming Mouse', category: 'Electronics', sales: 5800, forecast: 6100, growth: 5.2, confidence: 90, status: 'medium' },
    { rank: 6, name: 'Smart Home Speaker', category: 'Electronics', sales: 5200, forecast: 5900, growth: 13.5, confidence: 87, status: 'high' },
    { rank: 7, name: 'Organic Protein Powder', category: 'Health', sales: 4900, forecast: 5300, growth: 8.2, confidence: 79, status: 'medium' },
    { rank: 8, name: 'LED Desk Lamp', category: 'Home', sales: 4400, forecast: 4800, growth: 9.1, confidence: 86, status: 'medium' },
    { rank: 9, name: 'Bluetooth Speaker', category: 'Electronics', sales: 3900, forecast: 4200, growth: 7.7, confidence: 84, status: 'low' },
    { rank: 10, name: 'Yoga Mat Premium', category: 'Fitness', sales: 3600, forecast: 3900, growth: 8.3, confidence: 81, status: 'low' },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
          <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top 10 Products</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Highest predicted sales performance</p>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="space-y-3">
          {products.map((product, index) => (
            <div
              key={product.rank}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`font-bold text-lg ${getRankColor(product.rank)}`}>
                  #{product.rank}
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {product.forecast.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {product.sales.toLocaleString()} sold
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {product.growth > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    product.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </span>
                </div>

                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Showing top performing products</span>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
            View All Products →
          </button>
        </div>
      </div>
    </div>
  );
};