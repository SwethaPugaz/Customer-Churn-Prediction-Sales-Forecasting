import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Package } from 'lucide-react';
import type { FilterState } from './DashboardContent';

interface TopProductsTableProps {
  filters: FilterState;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ filters }) => {
  const products = [
    { rank: 1, name: 'Ultra Wireless Headphones', category: 'Electronics', sales: 12450, forecast: 15600, growth: 25.3, confidence: 92, status: 'high', supplier: 'TechCorp', stockLevel: 320, lastRestock: '2025-09-10' },
    { rank: 2, name: 'Smart Fitness Watch', category: 'Wearables', sales: 9800, forecast: 11200, growth: 14.3, confidence: 88, status: 'high', supplier: 'FitGear', stockLevel: 210, lastRestock: '2025-09-15' },
    { rank: 3, name: 'Premium Coffee Maker', category: 'Appliances', sales: 7650, forecast: 8900, growth: 16.3, confidence: 85, status: 'medium', supplier: 'BrewMaster', stockLevel: 150, lastRestock: '2025-09-12' },
    { rank: 4, name: 'Ergonomic Office Chair', category: 'Furniture', sales: 6200, forecast: 7400, growth: 19.4, confidence: 83, status: 'high', supplier: 'ChairWorks', stockLevel: 80, lastRestock: '2025-09-18' },
    { rank: 5, name: 'Wireless Gaming Mouse', category: 'Electronics', sales: 5800, forecast: 6100, growth: 5.2, confidence: 90, status: 'medium', supplier: 'GameTech', stockLevel: 200, lastRestock: '2025-09-14' },
    { rank: 6, name: 'Smart Home Speaker', category: 'Electronics', sales: 5200, forecast: 5900, growth: 13.5, confidence: 87, status: 'high', supplier: 'HomeSound', stockLevel: 110, lastRestock: '2025-09-11' },
    { rank: 7, name: 'Organic Protein Powder', category: 'Health', sales: 4900, forecast: 5300, growth: 8.2, confidence: 79, status: 'medium', supplier: 'NutriLife', stockLevel: 300, lastRestock: '2025-09-16' },
    { rank: 8, name: 'LED Desk Lamp', category: 'Home', sales: 4400, forecast: 4800, growth: 9.1, confidence: 86, status: 'medium', supplier: 'BrightLite', stockLevel: 90, lastRestock: '2025-09-13' },
    { rank: 9, name: 'Bluetooth Speaker', category: 'Electronics', sales: 3900, forecast: 4200, growth: 7.7, confidence: 84, status: 'low', supplier: 'SoundWave', stockLevel: 60, lastRestock: '2025-09-17' },
    { rank: 10, name: 'Yoga Mat Premium', category: 'Fitness', sales: 3600, forecast: 3900, growth: 8.3, confidence: 81, status: 'low', supplier: 'FlexFit', stockLevel: 180, lastRestock: '2025-09-19' },
  ];

  // Utility functions for color classes
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank <= 3) return 'text-gray-800 dark:text-gray-100';
    return 'text-gray-500 dark:text-gray-400';
  };
  const getStatusColor = (status: string) => {
    if (status === 'high') return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    if (status === 'medium') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-6 px-2">
      <div className="w-full max-w-5xl">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-left">Top 10 Products</h2>
        <div className="grid grid-cols-1 gap-4">
        {products.map((product, index) => (
          <div
            key={product.rank}
            className="w-full flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group p-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center space-x-4 flex-1 min-w-[200px]">
              {/* Product image placeholder */}
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-2">
                <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className={`font-bold text-lg ${getRankColor(product.rank)}`}>#{product.rank}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">{product.sales.toLocaleString()} sold</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900 dark:text-white">{product.forecast.toLocaleString()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Forecast</div>
              </div>
              <div className="flex items-center space-x-2">
                {product.growth > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-base font-medium ${product.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{product.growth > 0 ? '+' : ''}{product.growth}%</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-base font-medium ${getStatusColor(product.status)}`}>{product.confidence}%</span>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold">{product.supplier}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Stock: {product.stockLevel}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Restocked: {product.lastRestock}</div>
            </div>
          </div>
        ))}
         </div>
      </div>
    </div>
  );
}