import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';

/**
 * Q3 Performance Summary Dashboard
 * Built for Executive Persona
 */
export default function Q3ExecutiveSummary() {
  const [activeMonth, setActiveMonth] = useState('All Q3');

  // --- MOCK DATA GENERATION ---

  // Growth vs Target Data (Q3 July-Sept)
  const performanceData = useMemo(() => [
    { date: '2025-07-01', growth: 120000, target: 110000, month: 'July' },
    { date: '2025-07-08', growth: 125000, target: 112000, month: 'July' },
    { date: '2025-07-15', growth: 118000, target: 115000, month: 'July' },
    { date: '2025-07-22', growth: 130000, target: 118000, month: 'July' },
    { date: '2025-07-29', growth: 135000, target: 120000, month: 'July' },
    { date: '2025-08-05', growth: 140000, target: 122000, month: 'August' },
    { date: '2025-08-12', growth: 138000, target: 125000, month: 'August' },
    { date: '2025-08-19', growth: 145000, target: 128000, month: 'August' },
    { date: '2025-08-26', growth: 150000, target: 130000, month: 'August' },
    { date: '2025-09-02', growth: 155000, target: 132000, month: 'September' },
    { date: '2025-09-09', growth: 160000, target: 135000, month: 'September' },
    { date: '2025-09-16', growth: 158000, target: 138000, month: 'September' },
    { date: '2025-09-23', growth: 165000, target: 140000, month: 'September' },
    { date: '2025-09-30', growth: 172000, target: 145000, month: 'September' },
  ], []);

  // Large dataset for deals (200 records as per instructions)
  const allDeals = useMemo(() => {
    const companies = ['TechCorp Solutions', 'Global Logistics', 'BioHealth Inc', 'Astro Dynamics', 'Apex Retail', 'Lumina Energy', 'Velox Systems'];
    return Array.from({ length: 200 }, (_, i) => ({
      id: `DL-${1000 + i}`,
      client: companies[i % companies.length],
      value: Math.floor(Math.random() * 500000) + 100000,
      representative: ['John Smith', 'Sarah Chen', 'Mike Ross', 'Elena Gilbert'][i % 4],
      status: 'Closed-Won',
      month: i < 70 ? 'July' : i < 140 ? 'August' : 'September'
    })).sort((a, b) => b.value - a.value);
  }, []);

  // --- FILTER LOGIC ---
  const filteredGrowth = activeMonth === 'All Q3' 
    ? performanceData 
    : performanceData.filter(d => d.month === activeMonth);

  const topDeals = allDeals
    .filter(d => activeMonth === 'All Q3' || d.month === activeMonth)
    .slice(0, 3);

  const kpis = {
    revenue: activeMonth === 'All Q3' ? '$4.28M' : activeMonth === 'July' ? '$1.15M' : activeMonth === 'August' ? '$1.42M' : '$1.71M',
    margin: activeMonth === 'All Q3' ? '24.2%' : activeMonth === 'July' ? '22.8%' : activeMonth === 'August' ? '24.5%' : '25.3%',
    cac: activeMonth === 'All Q3' ? '$142' : activeMonth === 'July' ? '$151' : activeMonth === 'August' ? '$138' : '$137',
    revenueTrend: '+12.4%',
    marginTrend: '+1.2%',
    cacTrend: '-5.1%'
  };

  // --- STYLES (Based on visual_spec.skill.md) ---
  const theme = {
    bg: "bg-[#ffffff] dark:bg-[#1a1a1a]",
    cardBg: "bg-[#ffffff] dark:bg-[#1a1a1a]",
    cardBorder: "border-[#e2e8f0] dark:border-[#1e293b]",
    textPrimary: "text-[#5c5c5c] dark:text-[#dbdbdb]",
    textSecondary: "text-[#475569] dark:text-[#cbd5e1]",
    chartColors: ["#62a8ea", "#aaa47c"],
    metricColor: "text-[#b624eb] dark:text-[#60a5fa]",
    success: "text-[#10b981]",
    error: "text-[#ef4444]",
    filterBg: "bg-[#d4dee8] dark:bg-[#121212]",
    filterSelected: "bg-[#ffffff] dark:bg-[#262626]"
  };

  return (
    <div className={`min-h-screen p-8 font-sans ${theme.bg} ${theme.textPrimary}`}>

      {/* HEADER & FILTERS */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: '600', lineHeight: '1.25' }} className="mb-2">
            Q3 Company Performance
          </h1>
          <p style={{ fontSize: '14px', fontWeight: '400' }} className={theme.textSecondary}>
            High-level strategic overview of regional sales and acquisitions.
          </p>
        </div>

        {/* Month Selector (Functional Filter) */}
        <div className={`flex p-1 rounded-lg ${theme.filterBg}`}>
          {['All Q3', 'July', 'August', 'September'].map(month => (
            <button
              key={month}
              onClick={() => setActiveMonth(month)}
              className={`px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-200 ${
                activeMonth === month 
                ? `${theme.filterSelected} shadow-sm text-[#457bb5] dark:text-[#60a5fa]` 
                : `text-[#598dc5] dark:text-[#94a3b8] hover:bg-white/10`
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </header>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KPICard 
          title="TOTAL REVENUE" 
          value={kpis.revenue} 
          trend={kpis.revenueTrend} 
          isPositive={true}
          theme={theme}
        />
        <KPICard 
          title="PROFIT MARGIN" 
          value={kpis.margin} 
          trend={kpis.marginTrend} 
          isPositive={true}
          theme={theme}
        />
        <KPICard 
          title="CUSTOMER ACQUISITION COST" 
          value={kpis.cac} 
          trend={kpis.cacTrend} 
          isPositive={true} // CAC going down is positive
          theme={theme}
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* GROWTH CHART (Spans 2 columns) */}
        <div className={`lg:col-span-2 p-6 rounded-xl border ${theme.cardBorder} ${theme.cardBg}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Growth Trends vs Target</h3>
            <div className="flex gap-4 items-center">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#62a8ea]"></div>
                 <span className="text-[12px] opacity-70">Actual Growth</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#aaa47c]"></div>
                 <span className="text-[12px] opacity-70">Target</span>
               </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredGrowth}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#62a8ea" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorGrowth)" 
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#aaa47c" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP DEALS TABLE */}
        <div className={`p-6 rounded-xl border ${theme.cardBorder} ${theme.cardBg}`}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }} className="mb-6">Biggest Closing Deals</h3>
          <div className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th style={{ fontSize: '11px', fontWeight: '600' }} className="pb-4 text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Client</th>
                  <th style={{ fontSize: '11px', fontWeight: '600' }} className="pb-4 text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {topDeals.map((deal) => (
                  <tr key={deal.id} className="group transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-4">
                      <div style={{ fontSize: '13px', fontWeight: '500' }} className={theme.textPrimary}>{deal.client}</div>
                      <div style={{ fontSize: '11px', fontWeight: '400' }} className="text-[#64748b] dark:text-[#64748b]">{deal.id}</div>
                    </td>
                    <td className="py-4 text-right">
                      <div style={{ fontSize: '14px', fontWeight: '600' }} className={theme.metricColor}>
                        ${(deal.value / 1000).toFixed(1)}k
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '400' }} className="text-[#10b981]">Won</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button 
            className="w-full mt-8 py-2.5 rounded-lg border border-[#e2e8f0] dark:border-[#1e293b] text-[#598dc5] dark:text-[#a0a7b0] text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            onClick={() => console.log('Viewing all 200 records...')}
          >
            View Full Pipeline
          </button>
        </div>

      </div>
    </div>
  );
}

/**
 * KPI Card Sub-component
 */
function KPICard({ title, value, trend, isPositive, theme }) {
  return (
    <div className={`p-6 rounded-xl border ${theme.cardBorder} ${theme.cardBg} flex flex-col justify-between`}>
      <h6 style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em' }} className="text-[#64748b] dark:text-[#94a3b8] uppercase mb-4">
        {title}
      </h6>
      <div>
        <div style={{ fontSize: '36px', fontWeight: '600', letterSpacing: '-0.05em' }} className={`mb-1 ${theme.metricColor}`}>
          {value}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={isPositive ? theme.success : theme.error}>
            {isPositive ? '↑' : '↓'}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '500' }} className={isPositive ? theme.success : theme.error}>
            {trend}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '400' }} className="text-[#64748b] dark:text-[#64748b] ml-1">
            vs previous quarter
          </span>
        </div>
      </div>
    </div>
  );
}