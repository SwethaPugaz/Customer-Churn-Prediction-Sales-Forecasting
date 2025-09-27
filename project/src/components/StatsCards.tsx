import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, Target } from 'lucide-react';

export const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue Forecast',
      value: '$2.4M',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'blue',
      period: 'vs last quarter'
    },
    {
      title: 'Top Product Sales',
      value: '89.2K',
      change: '+8.1%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'green',
      period: 'units predicted'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-15%',
      changeType: 'decrease' as const,
      icon: AlertTriangle,
      color: 'amber',
      period: 'items need restock'
    },
    {
      title: 'Target Achievement',
      value: '94%',
      change: '+6%',
      changeType: 'increase' as const,
      icon: Target,
      color: 'purple',
      period: 'of quarterly goal'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
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
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
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