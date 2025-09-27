import React from 'react';
import { LineChart, TrendingUp } from 'lucide-react';
import type { FilterState } from './DashboardContent';

interface TrendsChartProps {
	filters: FilterState;
}

const mockTrends = [
	{ month: 'Jan', value: 120 },
	{ month: 'Feb', value: 150 },
	{ month: 'Mar', value: 170 },
	{ month: 'Apr', value: 140 },
	{ month: 'May', value: 180 },
	{ month: 'Jun', value: 210 },
	{ month: 'Jul', value: 190 },
	{ month: 'Aug', value: 230 },
	{ month: 'Sep', value: 220 },
	{ month: 'Oct', value: 250 },
	{ month: 'Nov', value: 240 },
	{ month: 'Dec', value: 260 },
];

export const TrendsChart: React.FC<TrendsChartProps> = ({ filters }) => {
	const maxValue = Math.max(...mockTrends.map(t => t.value));
	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-full">
			<div className="flex items-center space-x-3 mb-6">
				<div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
					<LineChart className="w-5 h-5 text-green-600 dark:text-green-400" />
				</div>
				<div>
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trends Overview</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400">Monthly sales trends</p>
				</div>
			</div>
			<div className="w-full h-40 flex items-end space-x-2">
				{mockTrends.map((trend, idx) => (
					<div key={trend.month} className="flex flex-col items-center justify-end h-full">
						<div
							className="w-4 rounded bg-green-400 dark:bg-green-600 transition-all duration-300"
							style={{ height: `${(trend.value / maxValue) * 100}%` }}
						></div>
						<span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{trend.month}</span>
					</div>
				))}
			</div>
			<div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
					<TrendingUp className="w-4 h-4 text-green-500" />
					<span>Positive growth trend</span>
				</div>
				<span className="text-xs text-gray-500 dark:text-gray-400">Updated 2 hours ago</span>
			</div>
		</div>
	);
};