import React from 'react';
import { LineChart, TrendingUp, Globe2, User } from 'lucide-react';
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

// Creative Graph 1: Sales by Age Group
const ageGroups = [
	{ group: '18-25', value: 120 },
	{ group: '26-35', value: 180 },
	{ group: '36-45', value: 150 },
	{ group: '46-60', value: 100 },
	{ group: '60+', value: 70 },
];

// Creative Graph 2: Sales by Geographic Region
const regions = [
	{ region: 'North America', value: 220 },
	{ region: 'Europe', value: 180 },
	{ region: 'Asia', value: 140 },
	{ region: 'South America', value: 90 },
	{ region: 'Africa', value: 60 },
];

export const TrendsChart: React.FC<TrendsChartProps> = ({ filters }) => {
		const maxValue = Math.max(...mockTrends.map(t => t.value));
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 h-full">
				{/* Three creative graphs in a single row */}
				<div className="flex flex-col md:flex-row gap-8">
					{/* Monthly Sales Trends: Line Chart */}
					<div className="flex-1">
						<div className="flex items-center space-x-3 mb-4">
							<div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
								<LineChart className="w-5 h-5 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Sales Trends</h2>
								<p className="text-sm text-gray-600 dark:text-gray-400">Line chart of monthly sales</p>
							</div>
						</div>
						<svg width="220" height="120" viewBox="0 0 220 120">
							{/* Line chart path */}
							<polyline
								fill="none"
								stroke="#22c55e"
								strokeWidth="4"
								points={mockTrends.map((trend, idx) => `${idx * 20},${120 - (trend.value / maxValue) * 100}`).join(' ')}
							/>
							{/* Month labels */}
							{mockTrends.map((trend, idx) => (
								<text key={trend.month} x={idx * 20} y={115} fontSize="10" fill="#6b7280" textAnchor="middle">{trend.month}</text>
							))}
						</svg>
						<div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Positive growth trend. Updated 2 hours ago.</div>
					</div>

					{/* Age Group Pie Chart */}
					<div className="flex-1">
						<div className="flex items-center space-x-3 mb-4">
							<div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
								<User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales by Age Group</h2>
								<p className="text-sm text-gray-600 dark:text-gray-400">Pie chart of age group sales</p>
							</div>
						</div>
									<div className="flex flex-col items-center justify-center">
										<svg width="120" height="120" viewBox="0 0 120 120">
											{/* Pie chart segments */}
											{(() => {
												const total = ageGroups.reduce((sum, a) => sum + a.value, 0);
												let startAngle = 0;
												const colors = ["#60a5fa", "#818cf8", "#f472b6", "#34d399", "#fbbf24"];
												return ageGroups.map((age, i) => {
													const angle = (age.value / total) * 2 * Math.PI;
													const endAngle = startAngle + angle;
													const x1 = 60 + 50 * Math.cos(startAngle);
													const y1 = 60 + 50 * Math.sin(startAngle);
													const x2 = 60 + 50 * Math.cos(endAngle);
													const y2 = 60 + 50 * Math.sin(endAngle);
													const largeArc = angle > Math.PI ? 1 : 0;
													const path = `M60,60 L${x1},${y1} A50,50 0 ${largeArc},1 ${x2},${y2} Z`;
													const seg = (
														<path key={age.group} d={path} fill={colors[i % colors.length]} />
													);
													startAngle = endAngle;
													return seg;
												});
											})()}
										</svg>
													{/* Legend below the pie chart, in a single line */}
													<div className="flex flex-row items-center justify-center mt-4 gap-4 flex-wrap w-full">
														{ageGroups.map((age, i) => (
															<div key={age.group + "legend"} className="flex items-center">
																<span style={{background: ["#60a5fa", "#818cf8", "#f472b6", "#34d399", "#fbbf24"][i % 5], width: 14, height: 14, display: 'inline-block', borderRadius: 3, marginRight: 6}}></span>
																<span className="text-sm text-gray-700 dark:text-gray-200">{age.group}</span>
															</div>
														))}
													</div>
									</div>
						<div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Young adults (26-35) are the highest contributors to sales.</div>
					</div>

					{/* Geographic Region Horizontal Bar Chart */}
					<div className="flex-1">
						<div className="flex items-center space-x-3 mb-4">
							<div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
								<Globe2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales by Geographic Region</h2>
								<p className="text-sm text-gray-600 dark:text-gray-400">Horizontal bar chart of regional sales</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 mt-2">
							{regions.map((region) => (
								<div key={region.region} className="flex items-center">
									<span className="text-xs text-gray-500 dark:text-gray-400 w-28">{region.region}</span>
									<div className="h-5 rounded bg-purple-400 dark:bg-purple-600 transition-all duration-300 ml-2" style={{ width: `${(region.value / Math.max(...regions.map(r => r.value))) * 100}%`, minWidth: '20px' }}></div>
									<span className="ml-2 text-xs text-gray-700 dark:text-gray-200 font-semibold">{region.value}</span>
								</div>
							))}
						</div>
						<div className="mt-2 text-xs text-gray-500 dark:text-gray-400">North America leads in sales, followed by Europe and Asia.</div>
					</div>
				</div>
			</div>
		);
};