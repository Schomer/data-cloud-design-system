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

/**
 * Q3PerformanceSummary
 * An executive dashboard providing high-level metrics and growth tracking.
 */
export default function Q3PerformanceSummary() {
  // State for active view (if needed) - Keeping it simple for Executive Persona
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- MOCK DATA GENERATION ---

  // KPI Metrics
  const kpis = [
    { title: "Total Revenue", value: "$4,285,120", trend: "+12.4%", status: "positive" },
    { title: "Profit Margin", value: "24.8%", trend: "+2.1%", status: "positive" },
    { title: "Customer Acquisition Cost", value: "$14.22", trend: "-5.3%", status: "positive" } // Lower is better
  ];

  // Growth vs Target Data (Q3 July, Aug, Sept)
  const growthData = useMemo(() => {
    return [
      { month: 'Jul 1', actual: 1100000, target: 1000000 },
      { month: 'Jul 8', actual: 1150000, target: 1050000 },
      { month: 'Jul 15', actual: 1220000, target: 1100000 },
      { month: 'Jul 22', actual: 1180000, target: 1150000 },
      { month: 'Jul 29', actual: 1250000, target: 1200000 },
      { month: 'Aug 5', actual: 1300000, target: 1250000 },
      { month: 'Aug 12', actual: 1380000, target: 1300000 },
      { month: 'Aug 19', actual: 1420000, target: 1350000 },
      { month: 'Aug 26', actual: 1480000, target: 1400000 },
      { month: 'Sep 2', actual: 1550000, target: 1450000 },
      { month: 'Sep 9', actual: 1620000, target: 1500000 },
      { month: 'Sep 16', actual: 1700000, target: 1550000 },
      { month: 'Sep 23', actual: 1780000, target: 1600000 },
      { month: 'Sep 30', actual: 1850000, target: 1650000 },
    ];
  }, []);

  // Top 3 Biggest Deals
  const topDeals = [
    { id: 48291, client: "Global Logistics Corp", value: "$245,000", status: "Closed", date: "2023-09-12" },
    { id: 48312, client: "Starlight Tech", value: "$182,500", status: "Closed", date: "2023-08-28" },
    { id: 48405, client: "Omni Retailers", value: "$156,000", status: "Closed", date: "2023-09-25" }
  ];

  // --- STYLE TOKENS (From visual_spec.skill.md) ---
  const theme = isDarkMode ? 'dark' : 'light';
  const tokens = {
    bg: isDarkMode ? '#1a1a1a' : '#ffffff',
    bgSecondary: isDarkMode ? '#1e293b' : '#e2e8f0',
    textPrimary: isDarkMode ? '#dbdbdb' : '#5c5c5c',
    textSecondary: isDarkMode ? '#cbd5e1' : '#475569',
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    chartPalette: ["#62a8ea", "#aaa47c", "#a8d95e"],
    kpiValue: isDarkMode ? '#c2cadb' : '#6e99c4', // valueColor from cards_kpi
    success: isDarkMode ? '#34d399' : '#047857',
    error: isDarkMode ? '#fb7185' : '#be123c'
  };

  return (
    <div 
      className="min-h-screen p-8 transition-colors duration-200"
      style={{ 
        backgroundColor: tokens.bg, 
        color: tokens.textPrimary,
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10 border-b pb-6" style={{ borderColor: tokens.border }}>
        <div>
          <h2 style={{ 
            fontSize: '30px', 
            fontWeight: '600', 
            letterSpacing: '-0.025em',
            color: tokens.textPrimary 
          }}>
            Q3 Performance Executive Summary
          </h2>
          <p className="mt-1" style={{ fontSize: '14px', color: tokens.textSecondary }}>
            Reviewing July 1 - September 30 company-wide performance metrics.
          </p>
        </div>

        {/* Simple Toggle - Functional */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 rounded-lg text-xs font-medium border"
          style={{ 
            borderColor: tokens.border, 
            backgroundColor: tokens.bgSecondary,
            color: tokens.textPrimary
          }}
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx}
            className="p-6 border"
            style={{ 
              backgroundColor: tokens.bg, 
              borderColor: tokens.border, 
              borderRadius: '12px' 
            }}
          >
            <h6 style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: isDarkMode ? '#94a3b8' : '#64748b',
              marginBottom: '8px'
            }}>
              {kpi.title}
            </h6>
            <div className="flex items-baseline justify-between">
              <span style={{ 
                fontSize: '30px', 
                fontWeight: '600', 
                color: tokens.kpiValue 
              }}>
                {kpi.value}
              </span>
              <div className="flex items-center space-x-1">
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: kpi.status === 'positive' ? tokens.success : tokens.error 
                }}>
                  {kpi.trend}
                </span>
                {kpi.status === 'positive' ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9V3M6 3L3 6M6 3L9 6" stroke={kpi.status === 'positive' ? tokens.success : tokens.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3V9M6 9L9 6M6 9L3 6" stroke={kpi.status === 'positive' ? tokens.success : tokens.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 gap-10 mb-10">
        <div 
          className="p-8 border"
          style={{ 
            backgroundColor: tokens.bg, 
            borderColor: tokens.border, 
            borderRadius: '12px' 
          }}
        >
          <h5 className="mb-8" style={{ fontSize: '18px', fontWeight: '500', color: tokens.textPrimary }}>
            Growth Trajectory vs. Q3 Targets
          </h5>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#262626' : '#f1f5f9'} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: tokens.textSecondary }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: tokens.textSecondary }}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tokens.bg, 
                    borderColor: tokens.border, 
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: tokens.textPrimary
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual Revenue" 
                  stroke={tokens.chartPalette[0]} 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Target Goal" 
                  stroke={tokens.chartPalette[1]} 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-4xl">
        <h5 className="mb-4" style={{ fontSize: '18px', fontWeight: '500', color: tokens.textPrimary }}>
          Largest Q3 Closures
        </h5>
        <div 
          className="overflow-hidden border"
          style={{ 
            backgroundColor: tokens.bg, 
            borderColor: tokens.border, 
            borderRadius: '12px' 
          }}
        >
          <table className="w-full text-left border-collapse">
            <thead style={{ backgroundColor: isDarkMode ? '#262626' : '#f8fafc' }}>
              <tr>
                <th className="px-6 py-4" style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Client Name</th>
                <th className="px-6 py-4" style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Deal Value</th>
                <th className="px-6 py-4" style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                <th className="px-6 py-4" style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Close Date</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: tokens.border }}>
              {topDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                  <td className="px-6 py-4" style={{ fontSize: '12px', color: tokens.textPrimary, fontWeight: '500' }}>{deal.client}</td>
                  <td className="px-6 py-4" style={{ fontSize: '12px', color: tokens.textPrimary }}>{deal.value}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" 
                      style={{ 
                        backgroundColor: tokens.success + '20', 
                        color: tokens.success 
                      }}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ fontSize: '12px', color: tokens.textSecondary }}>{deal.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}