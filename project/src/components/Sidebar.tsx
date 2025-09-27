import React, { useState } from 'react';
import { BarChart3, TrendingUp, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuConfig = [
  {
    icon: BarChart3,
    label: 'Sales Forecast',
    subItems: [
      { label: 'Quarterly Forecast' },
      { label: 'Yearly Forecast' },
      { label: 'Top Products' },
      { label: 'Revenue Trends' }
    ]
  },
  {
    icon: TrendingUp,
    label: 'Churn Prediction',
    subItems: [
      { label: 'Customer Churn Rate' },
      { label: 'Retention Analysis' },
      { label: 'Churn Drivers' },
      { label: 'Segment Insights' }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const [activeMain, setActiveMain] = useState(0);
  const [activeSub, setActiveSub] = useState<number | null>(null);

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-gray-500 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuConfig.map((main, mainIdx) => {
            const Icon = main.icon;
            const isActiveMain = mainIdx === activeMain;
            return (
              <li key={mainIdx}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMain(mainIdx);
                    setActiveSub(null);
                    // @ts-ignore
                    if (typeof window.setDashboardActive === 'function') {
                      // @ts-ignore
                      window.setDashboardActive(mainIdx, null);
                    }
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group focus:outline-none ${
                    isActiveMain
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium">{main.label}</span>
                  )}
                </button>
                {/* Sub-items */}
                {isActiveMain && !collapsed && (
                  <ul className="ml-8 mt-2 space-y-1">
                    {main.subItems.map((sub, subIdx) => (
                      <li key={subIdx}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSub(subIdx);
                            // @ts-ignore
                            if (typeof window.setDashboardActive === 'function') {
                              // @ts-ignore
                              window.setDashboardActive(mainIdx, subIdx);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none ${
                            activeSub === subIdx
                              ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 font-semibold'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {sub.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};