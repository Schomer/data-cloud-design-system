import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Menu, ArrowUp, ArrowDown, Minus } from 'lucide-react';

/**
 * EXECUTIVE SUMMARY DASHBOARD - Q3 PERFORMANCE
 * Built with strict adherence to Visual Spec and Component Skills.
 */

// --- MOCK DATA GENERATION ---
const generateGrowthData = () => [
  { month: 'July', actual: 4.2, target: 4.0 },
  { month: 'August', actual: 5.8, target: 5.5 },
  { month: 'September', actual: 7.4, target: 8.0 },
];

const generateTopDeals = () => [
  { id: 'D-001', company: 'Global Logistics Corp', value: 850000, owner: 'Sarah Chen', status: 'Closed-Won' },
  { id: 'D-002', company: 'TechFlow Systems', value: 620000, owner: 'Marcus Wright', status: 'Closed-Won' },
  { id: 'D-003', company: 'Nexus Infrastructure', value: 540000, owner: 'Elena Rodriguez', status: 'Closed-Won' },
];

const KPI_DATA = {
  revenue: { title: 'Total Revenue', value: '$4.25M', trend: '+12.4%', type: 'positive' },
  profit: { title: 'Profit Margin', value: '24.8%', trend: '-1.2%', type: 'stable' },
  cac: { title: 'Customer Acquisition Cost', value: '$142.50', trend: '-8.5%', type: 'positive' }, // Improvement is positive
};

// --- COMPONENTS ---

const KPICard = ({ title, value, trend, type }) => {
  const isPositive = type === 'positive';
  const isNegative = type === 'negative';

  // Design Tokens
  const titleColor = "#968f64"; // Light mode token
  const darkTitleColor = "#94a3b8";
  const valueColor = "#6e99c4";
  const darkValueColor = "#3b82f6";
  const successColor = "#10b981";
  const errorColor = "#ef4444";
  const stableColor = "#64748b";

  return (
    <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-[20px] shadow-sm">
      <div 
        style={{ fontSize: '14px', fontWeight: '500', color: titleColor }}
        className="dark:text-[#94a3b8] mb-2 font-['Inter']"
      >
        {title}
      </div>
      <div className="flex items-baseline gap-3">
        <div 
          style={{ fontSize: '30px', fontWeight: '600', color: valueColor }}
          className="dark:text-[#3b82f6] font-['Inter']"
        >
          {value}
        </div>
        <div className="flex items-center gap-1">
          {isPositive ? <ArrowUp size={14} color={successColor} /> : isNegative ? <ArrowDown size={14} color={errorColor} /> : <Minus size={14} color={stableColor} />}
          <span 
            style={{ fontSize: '12px', fontWeight: '400', color: isPositive ? successColor : isNegative ? errorColor : stableColor }}
            className="font-['Inter']"
          >
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ExecutiveSummaryQ3() {
  const [activeRange, setActiveRange] = useState('Q3');
  const growthData = useMemo(() => generateGrowthData(), []);
  const dealsData = useMemo(() => generateTopDeals(), []);

  // Visual Spec Helpers
  const bgPrimary = "bg-[#ffffff] dark:bg-[#1a1a1a]";
  const textPrimary = "text-[#5c5c5c] dark:text-[#dbdbdb]";
  const borderPrimary = "border-[#e2e8f0] dark:border-[#1e293b]";

  return (
    <div className={`min-h-screen ${bgPrimary} font-['Inter']`}>
      {/* GLOBAL NAVIGATION HEADER */}
      <header className={`w-full border-b ${borderPrimary} py-4 px-8 flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <Menu className={`${textPrimary} cursor-pointer`} size={24} />
          <h1 
            style={{ fontSize: '24px', fontWeight: '600' }}
            className={textPrimary}
          >
            Strategic Insights
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#e5e6db] dark:bg-[#121212] rounded-[8px] p-1">
            {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
              <button
                key={q}
                onClick={() => setActiveRange(q)}
                style={{ fontSize: '12px', fontWeight: '500' }}
                className={`px-4 py-1.5 rounded-[6px] transition-all ${
                  activeRange === q 
                    ? 'bg-[#ffffff] dark:bg-[#262626] text-[#868764] dark:text-[#60a5fa] shadow-sm' 
                    : 'text-[#858764] dark:text-[#94a3b8] hover:text-[#5c5c5c]'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-8 space-y-8">
        {/* PAGE TITLE */}
        <div className="flex justify-between items-end">
          <div>
            <h2 
              style={{ fontSize: '30px', fontWeight: '600' }}
              className={textPrimary}
            >
              Q3 Company Performance
            </h2>
            <p 
              style={{ fontSize: '14px', fontWeight: '400', color: '#64748b' }}
              className="mt-1"
            >
              High-level overview of quarterly strategic goals and closing volume.
            </p>
          </div>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard {...KPI_DATA.revenue} />
          <KPICard {...KPI_DATA.profit} />
          <KPICard {...KPI_DATA.cac} />
        </div>

        {/* MAIN CHART AREA */}
        <div className={`border ${borderPrimary} rounded-[12px] p-8`}>
          <div className="mb-8">
            <h3 
              style={{ fontSize: '20px', fontWeight: '600' }}
              className={textPrimary}
            >
              Growth vs. Quarterly Target
            </h3>
            <p className="text-[12px] text-[#64748b] mt-1">
              Percentage growth relative to Q3 forecast (USD Millions).
            </p>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => `$${val}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px' 
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#62a8ea" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#62a8ea', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }}
                  name="Actual Growth"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#aaa47c" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                  name="Q3 Target Path"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP DEALS TABLE */}
        <div className={`border ${borderPrimary} rounded-[12px] overflow-hidden`}>
          <div className="p-6 border-b border-[#e2e8f0] dark:border-[#1e293b]">
             <h4 
              style={{ fontSize: '18px', fontWeight: '500' }}
              className={textPrimary}
            >
              Top Closing Deals
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] dark:bg-[#121212]">
                  <th style={{ fontSize: '11px', fontWeight: '600', color: '#a0a46a' }} className="px-6 py-4 uppercase tracking-wider">Company</th>
                  <th style={{ fontSize: '11px', fontWeight: '600', color: '#a0a46a' }} className="px-6 py-4 uppercase tracking-wider">Deal Value</th>
                  <th style={{ fontSize: '11px', fontWeight: '600', color: '#a0a46a' }} className="px-6 py-4 uppercase tracking-wider">Owner</th>
                  <th style={{ fontSize: '11px', fontWeight: '600', color: '#a0a46a' }} className="px-6 py-4 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                {dealsData.map((deal) => (
                  <tr key={deal.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors">
                    <td style={{ fontSize: '12px', color: '#8392b4' }} className="px-6 py-4 font-medium dark:text-[#cbd5e1]">{deal.company}</td>
                    <td style={{ fontSize: '12px', color: '#8392b4' }} className="px-6 py-4 dark:text-[#cbd5e1] font-mono">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deal.value)}
                    </td>
                    <td style={{ fontSize: '12px', color: '#8392b4' }} className="px-6 py-4 dark:text-[#cbd5e1]">{deal.owner}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-1 rounded-[4px] bg-[#ecfdf5] text-[#047857] text-[10px] font-semibold uppercase">
                        {deal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-[#f8fafc] dark:bg-[#121212] flex justify-center">
            <button 
              style={{ fontSize: '13px', fontWeight: '500', color: '#909362' }}
              className="hover:underline dark:text-[#60a5fa]"
            >
              View All Pipeline Activities
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}