
import React, { useState } from 'react';
import { StatsCards } from './StatsCards';
import { SalesForecastChart } from './SalesForecastChart';
import { TopProductsTable } from './TopProductsTable';
import { TrendsChart } from './TrendsChart';
import { DemandForecastCard } from './DemandForecastCard';
import { FilterPanel } from './FilterPanel';
import { Download } from 'lucide-react';

// Dynamic Risk Scoring & Customer Profiles
const TopChurnCustomers = () => {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'score'|'name'>('score');
  const customers = Array.from({length: 10}, (_, i) => ({
    name: `Customer #${i+1}`,
    score: Math.round(80 + Math.random() * 20),
    segment: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
    lastPurchase: ['2025-09-01', '2025-08-15', '2025-07-30'][Math.floor(Math.random() * 3)],
    risk: 'High Risk',
    profile: {
      age: 25 + i,
      region: ['North America','Europe','Asia'][i%3],
      purchases: Math.floor(Math.random()*20)+1
    }
  }));
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a,b) => sortBy==='score'?b.score-a.score:a.name.localeCompare(b.name));
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Top 10 Customers Likely to Churn</h2>
        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
          <Download className="w-4 h-4 mr-1" /> Export
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customer..." className="px-3 py-1 border rounded text-sm" />
        <div className="flex gap-2">
          <button className={`px-2 py-1 rounded text-xs ${sortBy==='score'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setSortBy('score')}>Sort by Score</button>
          <button className={`px-2 py-1 rounded text-xs ${sortBy==='name'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setSortBy('name')}>Sort by Name</button>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 dark:text-gray-400">
            <th>Customer</th>
            <th>Score</th>
            <th>Segment</th>
            <th>Last Purchase</th>
            <th>Risk</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c,i)=>(
            <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
              <td>{c.name}</td>
              <td>{c.score}%</td>
              <td>{c.segment}</td>
              <td>{c.lastPurchase}</td>
              <td><span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">{c.risk}</span></td>
              <td>
                <span className="text-xs text-gray-500">Age: {c.profile.age}, {c.profile.region}, Purchases: {c.profile.purchases}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Alert: {sorted[0]?.name} is at highest risk!</span>
      </div>
    </div>
  );
};

const ChurnRateTrends = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">Churn Rate Trends</h2>
      <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
        <Download className="w-4 h-4 mr-1" /> Export
      </button>
    </div>
    <div className="h-40 flex items-center justify-center">
      <svg width="320" height="120" viewBox="0 0 320 120">
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          points="0,80 40,60 80,70 120,50 160,40 200,60 240,30 280,50 320,40"
        />
        <text x="10" y="110" fontSize="12" fill="#6b7280">Q1</text>
        <text x="80" y="110" fontSize="12" fill="#6b7280">Q2</text>
        <text x="160" y="110" fontSize="12" fill="#6b7280">Q3</text>
        <text x="240" y="110" fontSize="12" fill="#6b7280">Q4</text>
      </svg>
    </div>
    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Red line shows churn rate over quarters</p>
  </div>
);

// Improved Interactive Segmentation with Clear Insights
const ChurnSegmentation = () => {
  // Example segment data
  const segments = [
    {
      name: 'High Risk',
      percent: 35,
      color: '#ef4444',
      insights: [
        'High Risk customers are likely to churn within the next 30 days.',
        'Average engagement score: 2.1/10 (vs. 7.8 for Low Risk).',
        'Frequent support tickets: 3.2 per month.',
        'Recent drop in purchase frequency and basket size.',
        'Top drivers: price sensitivity, unresolved issues, negative feedback.',
        'Recommended actions: Immediate retention offers, personal outreach, priority support.'
      ]
    },
    {
      name: 'Medium Risk',
      percent: 25,
      color: '#fbbf24',
      insights: [
        'Medium Risk customers show fluctuating engagement.',
        'Average engagement score: 5.2/10.',
        'Occasional support tickets, mostly resolved.',
        'Responsive to targeted promotions and loyalty programs.',
        'Top drivers: service delays, onboarding issues.',
        'Recommended actions: Timely follow-ups, exclusive offers, improved onboarding.'
      ]
    },
    {
      name: 'Low Risk',
      percent: 30,
      color: '#34d399',
      insights: [
        'Low Risk customers are highly loyal and engaged.',
        'Average engagement score: 7.8/10.',
        'Rarely contact support; high satisfaction ratings.',
        'Consistent purchase frequency and high basket size.',
        'Top drivers: positive experiences, rewards, regular communication.',
        'Recommended actions: Maintain engagement, reward programs, feedback collection.'
      ]
    },
    {
      name: 'Critical',
      percent: 10,
      color: '#60a5fa',
      insights: [
        'Critical segment includes new, inactive, or unpredictable customers.',
        'Average engagement score: 3.5/10.',
        'Low purchase history, sporadic activity.',
        'Unclear churn drivers; may be affected by external factors.',
        'Recommended actions: Personalized outreach, onboarding support, engagement campaigns.'
      ]
    }
  ];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Customer Segmentation by Churn Likelihood</h2>
        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
          <Download className="w-4 h-4 mr-1" /> Export
        </button>
      </div>
      <div className="space-y-8 mt-2">
        {/* Detailed Pie Chart */}
        <div className="flex flex-col items-center">
          {/* Pie chart using SVG arcs for perfect circle and accurate segments */}
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle r="100" cx="120" cy="120" fill="#e5e7eb" />
            {/* Pie segments */}
            {/* High Risk: 35% */}
            <path d="M120 120 L120 20 A100 100 0 0 1 210.6 62.2 Z" fill="#ef4444" />
            {/* Medium Risk: 25% */}
            <path d="M120 120 L210.6 62.2 A100 100 0 0 1 195.6 195.6 Z" fill="#fbbf24" />
            {/* Low Risk: 30% */}
            <path d="M120 120 L195.6 195.6 A100 100 0 0 1 62.2 210.6 Z" fill="#34d399" />
            {/* Critical: 10% */}
            <path d="M120 120 L62.2 210.6 A100 100 0 0 1 20 120 Z" fill="#60a5fa" />
          </svg>
          <div className="mt-2 text-xs">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#ef4444'}}></span> High Risk (35%)</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#fbbf24'}}></span> Medium Risk (25%)</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#34d399'}}></span> Low Risk (30%)</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#60a5fa'}}></span> Critical (10%)</div>
          </div>
        </div>
        {/* Detailed Bar Chart */}
        <div className="flex flex-col items-center">
          <svg width="320" height="220" viewBox="0 0 320 220">
            {segments.map((seg, i) => (
              <rect key={seg.name} x={40 + i * 65} y={180 - seg.percent * 4.5} width="40" height={seg.percent * 4.5} fill={seg.color} />
            ))}
            {/* Y-axis labels */}
            <text x="15" y="40" fontSize="16" fill="#374151">100%</text>
            <text x="15" y="110" fontSize="16" fill="#374151">50%</text>
            <text x="15" y="180" fontSize="16" fill="#374151">0%</text>
            {/* Segment names below each bar, rotated for clarity */}
            {segments.map((seg, i) => (
              <text key={seg.name} x={60 + i * 65} y="210" fontSize="16" fill="#374151" textAnchor="middle" transform={`rotate(15 ${60 + i * 65},210)`}>{seg.name}</text>
            ))}
          </svg>
          <div className="mt-2 text-sm">Bar chart: Segment size by churn risk</div>
        </div>
        {/* Cluster Visualization with legend */}
        <div className="flex flex-col items-center">
          <svg width="140" height="120" viewBox="0 0 140 120">
            <circle cx="40" cy="40" r="16" fill="#ef4444" />
            <circle cx="80" cy="40" r="13" fill="#fbbf24" />
            <circle cx="110" cy="70" r="18" fill="#34d399" />
            <circle cx="70" cy="90" r="10" fill="#60a5fa" />
          </svg>
          <div className="mt-2 text-xs">
            <span className="inline-block w-3 h-3 rounded-full" style={{background:'#ef4444'}}></span> High Risk
            <span className="inline-block w-3 h-3 rounded-full ml-2" style={{background:'#fbbf24'}}></span> Medium Risk
            <span className="inline-block w-3 h-3 rounded-full ml-2" style={{background:'#34d399'}}></span> Low Risk
            <span className="inline-block w-3 h-3 rounded-full ml-2" style={{background:'#60a5fa'}}></span> Critical
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map(seg => (
          <div key={seg.name} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
            <h4 className="font-semibold text-sm mb-1" style={{color: seg.color}}>{seg.name} ({seg.percent}%)</h4>
            <ul className="list-disc ml-5 text-xs text-gray-700 dark:text-gray-300">
              {seg.insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Each segment shows its size and actionable insights for retention.</p>
    </div>
  );
};

// Enhanced Churn Driver Analysis & Customer Insights
const ChurnDrivers = () => {
  const [selected, setSelected] = React.useState('Price');
  const drivers = [
    {
      name: 'Price',
      value: 40,
      suggestion: 'Offer discounts or loyalty pricing.',
      insights: [
        'Customers in the "High Risk" segment are price sensitive.',
        'Recent price increases correlated with churn spikes.',
        'Top churned customers made fewer purchases after price changes.'
      ],
      chartColor: '#fbbf24',
      icon: '💸'
    },
    {
      name: 'Service',
      value: 30,
      suggestion: 'Improve support and onboarding.',
      insights: [
        'Negative service reviews precede churn events.',
        'Customers with onboarding issues are 2x more likely to churn.',
        'Service delays impact retention in the "Medium Risk" segment.'
      ],
      chartColor: '#60a5fa',
      icon: '🤝'
    },
    {
      name: 'Support',
      value: 20,
      suggestion: 'Provide 24/7 help and proactive outreach.',
      insights: [
        'Support tickets unresolved >48h increase churn risk.',
        'Proactive outreach reduces churn by 15%.',
        'High-risk customers contact support more frequently.'
      ],
      chartColor: '#ef4444',
      icon: '🛟'
    }
  ];
  const selectedDriver = drivers.find(d => d.name === selected);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Churn Drivers & Customer Insights</h2>
        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">
          <Download className="w-4 h-4 mr-1" /> Export
        </button>
      </div>
      <div className="flex gap-4 mb-4">
        {drivers.map(d => (
          <button key={d.name} className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 ${selected === d.name ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setSelected(d.name)}>
            <span>{d.icon}</span> {d.name}
          </button>
        ))}
      </div>
      <div className="h-40 flex items-center justify-center">
        <svg width="320" height="120" viewBox="0 0 320 120">
          {drivers.map((d, i) => (
            <circle key={d.name} cx={60 + i * 100} cy="60" r={selected === d.name ? 35 : 25} fill={selected === d.name ? d.chartColor : '#e5e7eb'} />
          ))}
          <text x="45" y="115" fontSize="12" fill="#6b7280">Price</text>
          <text x="145" y="115" fontSize="12" fill="#6b7280">Service</text>
          <text x="245" y="115" fontSize="12" fill="#6b7280">Support</text>
        </svg>
      </div>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Retention Strategy</h4>
        <p className="text-xs text-blue-700 dark:text-blue-400">{selectedDriver?.suggestion}</p>
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mt-4 mb-2">Customer Insights</h4>
        <ul className="list-disc ml-5 text-xs text-blue-700 dark:text-blue-400">
          {selectedDriver?.insights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Bubble chart shows top churn drivers. Click to drill down for actionable insights.</p>
    </div>
  );
};

export const DashboardContent: React.FC = () => {
  // Track sidebar selection using window state (for demo, ideally use context)
  const [activeMain, setActiveMain] = useState(0);
  const [activeSub, setActiveSub] = useState<number | null>(null);

  // For demo, use window to sync with Sidebar
  (window as any).setDashboardActive = (main: number, sub: number | null) => {
    setActiveMain(main);
    setActiveSub(sub);
  };

  // Render content based on sidebar selection
  if (activeMain === 0) {
    // Sales Forecast
    switch (activeSub) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quarterly Sales Forecast</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Interactive forecast for next quarter</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                <Download className="w-4 h-4 mr-2" /> Export Report
              </button>
            </div>
            <FilterPanel filters={{ timeFrame: 'Q1 2024', category: 'all', region: 'all' }} onFiltersChange={() => {}} />
            <SalesForecastChart filters={{ timeFrame: 'Q1 2024', category: 'all', region: 'all' }} />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yearly Sales Forecast</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Forecast for the next year</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                <Download className="w-4 h-4 mr-2" /> Export Report
              </button>
            </div>
            <FilterPanel filters={{ timeFrame: '2024', category: 'all', region: 'all' }} onFiltersChange={() => {}} />
            <SalesForecastChart filters={{ timeFrame: '2024', category: 'all', region: 'all' }} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Top Products</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Products with highest predicted sales</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                <Download className="w-4 h-4 mr-2" /> Export List
              </button>
            </div>
            <FilterPanel filters={{ timeFrame: '2024', category: 'all', region: 'all' }} onFiltersChange={() => {}} />
            <TopProductsTable filters={{ timeFrame: '2024', category: 'all', region: 'all' }} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Trends</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Key high/low sales periods</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                <Download className="w-4 h-4 mr-2" /> Export Chart
              </button>
            </div>
            <FilterPanel filters={{ timeFrame: '2024', category: 'all', region: 'all' }} onFiltersChange={() => {}} />
            <TrendsChart filters={{ timeFrame: '2024', category: 'all', region: 'all' }} />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Forecasting Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and predict your sales performance</p>
            </div>
            <StatsCards />
            <TopProductsTable filters={{ timeFrame: '2024', category: 'all', region: 'all' }} />
            <SalesForecastChart filters={{ timeFrame: 'Q1 2024', category: 'all', region: 'all' }} />
            <TrendsChart filters={{ timeFrame: '2024', category: 'all', region: 'all' }} />
            <DemandForecastCard />
          </div>
        );
    }
  } else if (activeMain === 1) {
    // Churn Prediction
    switch (activeSub) {
      case 0:
        return <TopChurnCustomers />;
      case 1:
        return <ChurnRateTrends />;
      case 2:
        return <ChurnDrivers />;
      case 3:
        return <ChurnSegmentation />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Churn Prediction Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and analyze customer churn risk</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                <Download className="w-4 h-4 mr-2" /> Export All
              </button>
            </div>
            <TopChurnCustomers />
            <ChurnRateTrends />
            <ChurnDrivers />
            <ChurnSegmentation />
          </div>
        );
    }
  }

  // Default: General Dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">General Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of key metrics and top products</p>
      </div>
      <StatsCards />
      <TopProductsTable filters={{ timeFrame: '2024', category: 'all', region: 'all' }} />
    </div>
  );
};