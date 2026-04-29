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
 * EXECUTIVE SUMMARY DASHBOARD - Q3 PERFORMANCE
 * 
 * This component implements the "Executive Summary" archetype.
 * It features large KPI cards, a growth-vs-target line chart, 
 * and a summary table for high-level business monitoring.
 */

export default function Q3ExecutiveSummary() {
  // --- DESIGN TOKENS (from visual_spec.skill.md) ---
  const theme = {
    bg: '#ffffff',
    bgDark: '#1a1a1a',
    bgSecondary: '#e2e8f0',
    bgSecondaryDark: '#1e293b',
    textPrimary: '#5c5c5c',
    textPrimaryDark: '#dbdbdb',
    textSecondary: '#475569',
    textSecondaryDark: '#cbd5e1',
    border: '#e2e8f0',
    borderDark: '#1e293b',
    chartPalette: [
      "#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", 
      "#7375c9", "#ea75b0", "#f59e0b", "#ef4444"
    ],
    success: '#047857',
    error: '#be123c',
    kpiValue: '#ff4d94',
    kpiValueDark: '#f8fafc'
  };

  // --- MOCK DATA GENERATION ---
  const performanceData = useMemo(() => [
    { name: 'Jul 1', growth: 1200000, target: 1100000 },
    { name: 'Jul 15', growth: 1450000, target: 1350000 },
    { name: 'Aug 1', growth: 1900000, target: 1800000 },
    { name: 'Aug 15', growth: 2300000, target: 2400000 },
    { name: 'Sep 1', growth: 3100000, target: 2900000 },
    { name: 'Sep 15', growth: 4200000, target: 3800000 },
    { name: 'Sep 30', growth: 5400000, target: 5000000 }
  ], []);

  const topDeals = [
    { id: 'D-8472', company: 'Global Corp Inc.', value: '$2,450,000', status: 'Closed' },
    { id: 'D-9121', company: 'Tech Solutions Ltd', value: '$1,820,000', status: 'Closed' },
    { id: 'D-7734', company: 'Future Systems', value: '$1,540,000', status: 'Closed' }
  ];

  // --- SUB-COMPONENTS ---

  const KPICard = ({ title, value, trend, isPositive }) => (
    <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-[20px] shadow-sm flex flex-col justify-between">
      <span 
        className="text-[12px] font-[500] uppercase tracking-wider mb-2"
        style={{ color: theme.textSecondary }}
      >
        {title}
      </span>
      <div className="flex items-baseline justify-between">
        <span 
          className="text-[30px] font-[600] tracking-tighter"
          style={{ color: theme.kpiValue }}
        >
          {value}
        </span>
        <div className="flex items-center ml-2">
          {isPositive ? (
            <svg width="12" height="12" viewBox="0 0 12 12" className="mr-1" style={{ fill: theme.success }}>
              <path d="M6 1L11 6H8V11H4V6H1L6 1Z" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" className="mr-1" style={{ fill: theme.error }}>
              <path d="M6 11L1 6H4V1H8V6H11L6 11Z" />
            </svg>
          )}
          <span 
            className="text-[12px] font-[500]"
            style={{ color: isPositive ? theme.success : theme.error }}
          >
            {trend}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] p-8 font-['Inter',_sans-serif]">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-[36px] font-[600] tracking-tight mb-2" style={{ color: theme.textPrimary }}>
          Q3 Executive Summary
        </h1>
        <p className="text-[14px]" style={{ color: theme.textSecondary }}>
          Performance review for the period July 1, 2026 - September 30, 2026
        </p>
      </div>

      {/* KPI GRID - 3 Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <KPICard 
          title="Total Revenue" 
          value="$12,450,000" 
          trend="+14.2%" 
          isPositive={true} 
        />
        <KPICard 
          title="Profit Margin" 
          value="24.8%" 
          trend="+2.1%" 
          isPositive={true} 
        />
        <KPICard 
          title="Customer Acquisition Cost" 
          value="$148.50" 
          trend="-5.4%" 
          isPositive={true} // Lower CAC is positive
        />
      </div>

      {/* CHART SECTION: Growth vs Target */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-8 shadow-sm">
          <h2 className="text-[20px] font-[600] mb-6" style={{ color: theme.textPrimary }}>
            Growth vs. Q3 Target
          </h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.border} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme.textSecondary, fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme.textSecondary, fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000000}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bg
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  name="Actual Growth"
                  stroke={theme.chartPalette[0]} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: theme.chartPalette[0] }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Q3 Target"
                  stroke={theme.chartPalette[1]} 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLE SECTION: 3 Biggest Deals */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-[#e2e8f0] dark:border-[#1e293b]">
            <h2 className="text-[18px] font-[600]" style={{ color: theme.textPrimary }}>
              Top Q3 Closing Deals
            </h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr style={{ backgroundColor: theme.bgSecondary }}>
                <th className="px-8 py-3 text-[11px] font-[600] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Deal ID</th>
                <th className="px-8 py-3 text-[11px] font-[600] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Company</th>
                <th className="px-8 py-3 text-[11px] font-[600] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Deal Value</th>
                <th className="px-8 py-3 text-[11px] font-[600] uppercase tracking-wider" style={{ color: theme.textSecondary }}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
              {topDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
                  <td className="px-8 py-4 text-[13px] font-[500]" style={{ color: theme.textPrimary }}>{deal.id}</td>
                  <td className="px-8 py-4 text-[13px]" style={{ color: theme.textSecondary }}>{deal.company}</td>
                  <td className="px-8 py-4 text-[13px] font-[600]" style={{ color: theme.textPrimary }}>{deal.value}</td>
                  <td className="px-8 py-4">
                    <span className="px-2 py-1 text-[11px] font-[600] bg-[#ecfdf5] text-[#047857] rounded-full">
                      {deal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-8 py-4 bg-[#f8fafc] dark:bg-[#121212] border-t border-[#e2e8f0] dark:border-[#1e293b] flex justify-end">
            <button 
              className="text-[12px] font-[600] flex items-center hover:opacity-80 transition-opacity"
              style={{ color: '#0d67df' }}
            >
              View All Pipeline
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}