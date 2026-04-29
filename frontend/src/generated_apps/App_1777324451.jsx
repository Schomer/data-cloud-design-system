import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Filter, ChevronDown, Download } from 'lucide-react';

/**
 * Q3ExecutiveSummary
 * A high-level dashboard for C-Suite overview of Q3 performance.
 * Strictly adheres to the Visual Specification and Component skills provided.
 */
export default function Q3ExecutiveSummary() {
  // State for global Q3 filtering
  const [selectedPeriod, setSelectedPeriod] = useState('Q3 2025');

  // 1. DATA GENERATION (at least 200 rows for table, 15+ points for charts)
  const mockData = useMemo(() => {
    // Generate 200 deals for the data table
    const deals = Array.from({ length: 200 }, (_, i) => ({
      id: `DEAL-${1000 + i}`,
      company: [
        'TechNova Solutions', 'Global Logistics Inc', 'Swift Retail', 'Horizon Media', 
        'Peak Finance', 'Azure Healthcare', 'Velocity Auto', 'Emerald Energy'
      ][i % 8],
      amount: Math.floor(Math.random() * 500000) + 50000,
      representative: ['Sarah Jenkins', 'Michael Chen', 'Elena Rodriguez', 'David Smith'][i % 4],
      status: ['Closed Won', 'Closing', 'Contract Sent'][i % 3],
      date: `2025-0${7 + (i % 3)}-${10 + (i % 20)}`
    }));

    // Generate 15+ points for growth trend vs target
    const growthTrend = Array.from({ length: 18 }, (_, i) => {
      const actual = 100 + i * 12 + Math.random() * 20;
      const target = 105 + i * 11;
      return {
        week: `W${i + 27}`,
        growth: parseFloat(actual.toFixed(2)),
        target: parseFloat(target.toFixed(2))
      };
    });

    return { deals, growthTrend };
  }, []);

  // Filter 3 biggest closing deals for the requirement
  const topThreeDeals = [...mockData.deals]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // 2. DESIGN TOKENS (from visual_spec.skill.md)
  const tokens = {
    background: 'bg-[#ffffff] dark:bg-[#1a1a1a]',
    border: 'border-[#e2e8f0] dark:border-[#1e293b]',
    textPrimary: 'text-[#5c5c5c] dark:text-[#dbdbdb]',
    textSecondary: 'text-[#475569] dark:text-[#cbd5e1]',
    chartPalette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9", "#ea75b0"],
    kpi: {
      titleColor: 'text-[#968f64] dark:text-[#64748b]',
      valueColor: 'text-[#6e99c4] dark:text-[#3b82f6]',
      success: 'text-[#047857] dark:text-[#34d399]',
      error: 'text-[#be123c] dark:text-[#fb7185]'
    }
  };

  // 3. TYPOGRAPHY STYLES (from typography skill/visual_spec)
  const typography = {
    h2: { fontSize: '30px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    h4: { fontSize: '20px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    h6: { fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' },
    p: { fontSize: '14px', fontWeight: '400', fontFamily: 'Inter, sans-serif' },
    xs: { fontSize: '12px', fontWeight: '400', fontFamily: 'Inter, sans-serif' },
    kpiTitle: { fontSize: '14px', fontWeight: '500', fontFamily: 'Inter, sans-serif' },
    tableHeader: { fontSize: '11px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }
  };

  return (
    <div className={`min-h-screen ${tokens.background} transition-colors duration-200`}>
      {/* Navigation / Header */}
      <header className={`w-full ${tokens.border} border-b px-8 py-4 flex items-center justify-between`}>
        <h1 style={{ ...typography.h4 }} className={tokens.textPrimary}>Q3 Performance Overview</h1>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${tokens.border}`}>
            <span style={typography.p} className={tokens.textSecondary}>{selectedPeriod}</span>
            <ChevronDown size={16} className={tokens.textSecondary} />
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#bbbe8e] dark:bg-[#5aa1d8] rounded-lg transition-opacity hover:opacity-90"
            onClick={() => alert('Preparing executive report...')}
          >
            <Download size={16} className="text-white dark:text-black" />
            <span style={{ fontSize: '14px', fontWeight: '500' }} className="text-white dark:text-black">Export Report</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">

        {/* KPI Cards Row - Responsive Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard 
            title="TOTAL REVENUE" 
            value="$12.4M" 
            trend="+14.2%" 
            isPositive={true} 
            tokens={tokens} 
            typography={typography} 
          />
          <KPICard 
            title="PROFIT MARGIN" 
            value="24.8%" 
            trend="-1.4%" 
            isPositive={false} 
            tokens={tokens} 
            typography={typography} 
          />
          <KPICard 
            title="CUSTOMER ACQUISITION" 
            value="$420.00" 
            trend="+5.2%" 
            isPositive={true} 
            tokens={tokens} 
            typography={typography} 
          />
        </section>

        {/* Middle Section - Growth Trend Chart */}
        <section className={`p-6 rounded-xl border ${tokens.border} ${tokens.background}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 style={typography.h4} className={tokens.textPrimary}>Growth Against Target</h2>
              <p style={typography.p} className={tokens.textSecondary}>Weekly performance tracking vs. Q3 benchmarks</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#62a8ea]" />
                <span style={typography.xs} className={tokens.textSecondary}>Actual Growth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#aaa47c]" />
                <span style={typography.xs} className={tokens.textSecondary}>Q3 Target</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.growthTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.border.split('#')[1] ? `#${tokens.border.split('#')[1].slice(0,6)}` : '#e2e8f0'} />
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: tokens.textSecondary.split('-')[1] ? '#94a3b8' : '#64748b', ...typography.xs }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: tokens.textSecondary.split('-')[1] ? '#94a3b8' : '#64748b', ...typography.xs }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tokens.background.includes('dark') ? '#1a1a1a' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ ...typography.p }}
                />
                <Area 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#62a8ea" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorGrowth)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#aaa47c" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Bottom Section - Top 3 Deals Table */}
        <section className={`p-6 rounded-xl border ${tokens.border} ${tokens.background}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 style={typography.h4} className={tokens.textPrimary}>Top Closing Deals</h3>
            <span style={typography.xs} className={`${tokens.textSecondary} px-3 py-1 bg-[#e5e6db] dark:bg-[#262626] rounded-full`}>
              3 Records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f1f5f9] dark:border-[#262626]">
                  <th style={typography.tableHeader} className="text-left py-4 px-2 text-[#a0a46a] dark:text-[#94a3b8] uppercase tracking-wider">Company</th>
                  <th style={typography.tableHeader} className="text-left py-4 px-2 text-[#a0a46a] dark:text-[#94a3b8] uppercase tracking-wider">Representative</th>
                  <th style={typography.tableHeader} className="text-left py-4 px-2 text-[#a0a46a] dark:text-[#94a3b8] uppercase tracking-wider">Closing Date</th>
                  <th style={typography.tableHeader} className="text-right py-4 px-2 text-[#a0a46a] dark:text-[#94a3b8] uppercase tracking-wider">Deal Value</th>
                </tr>
              </thead>
              <tbody>
                {topThreeDeals.map((deal, idx) => (
                  <tr key={deal.id} className="border-b border-[#f1f5f9] dark:border-[#262626] last:border-0 hover:bg-[#f8fafc] dark:hover:bg-[#262626] transition-colors">
                    <td className="py-4 px-2">
                      <div style={typography.p} className="text-[#8392b4] dark:text-[#cbd5e1]">{deal.company}</div>
                      <div style={typography.xs} className="text-[#94a3b8]">{deal.id}</div>
                    </td>
                    <td style={typography.p} className="py-4 px-2 text-[#8392b4] dark:text-[#cbd5e1]">{deal.representative}</td>
                    <td style={typography.p} className="py-4 px-2 text-[#8392b4] dark:text-[#cbd5e1]">{deal.date}</td>
                    <td style={typography.p} className="py-4 px-2 text-right text-[#6e99c4] dark:text-[#3b82f6] font-semibold">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deal.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * KPICard Component
 * Renders a standard KPI card with trend indicators
 */
function KPICard({ title, value, trend, isPositive, tokens, typography }) {
  return (
    <div className={`p-6 rounded-xl border ${tokens.border} ${tokens.background} shadow-sm transition-transform hover:scale-[1.01]`}>
      <h3 
        style={{ ...typography.kpiTitle }} 
        className={`${tokens.kpi.titleColor} uppercase tracking-wide mb-2`}
      >
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <span 
          style={{ ...typography.h2 }} 
          className={tokens.kpi.valueColor}
        >
          {value}
        </span>
        <div className={`flex items-center gap-1 ${isPositive ? tokens.kpi.success : tokens.kpi.error}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span style={typography.xs} className="font-semibold">{trend}</span>
        </div>
      </div>
      <div className="mt-4 w-full bg-[#e2e8f0] dark:bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${isPositive ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}
          style={{ width: isPositive ? '75%' : '45%' }}
        />
      </div>
    </div>
  );
}