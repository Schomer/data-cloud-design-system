import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { ArrowUp, ArrowDown, Sun, Moon } from 'lucide-react';

/**
 * MOCK DATA GENERATION
 */
const generateUserGrowthData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: `2026-04-${String(i + 1).padStart(2, '0')}`,
    users: Math.floor(800000 + Math.random() * 400000),
    activeSessions: Math.floor(35000 + Math.random() * 15000),
  }));
};

const regionData = [
  { region: 'North America', revenue: 1200000 },
  { region: 'Europe', revenue: 850000 },
  { region: 'Asia Pacific', revenue: 650000 },
  { region: 'Latin America', revenue: 300000 },
  { region: 'Middle East', revenue: 150000 },
];

/**
 * OPERATIONAL DASHBOARD COMPONENT
 */
export default function OperationalAnalyticsDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [timeRange, setTimeRange] = useState('30D');

  const userGrowthData = useMemo(() => generateUserGrowthData(), []);

  // Theme Helpers based on visual_spec.skill.md
  const theme = isDark ? 'dark' : 'light';
  const colors = {
    background_primary: isDark ? '#1a1a1a' : '#ffffff',
    background_secondary: isDark ? '#1e293b' : '#e2e8f0',
    text_primary: isDark ? '#dbdbdb' : '#5c5c5c',
    text_secondary: isDark ? '#cbd5e1' : '#475569',
    border: isDark ? '#1e293b' : '#e2e8f0',
    chart_palette: [
      "#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9", 
      "#ea75b0", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"
    ]
  };

  const typography = {
    h2: { fontSize: '30px', fontWeight: '600', color: isDark ? '#f8fafc' : '#5c5c5c' },
    h4: { fontSize: '20px', fontWeight: '600', color: isDark ? '#dbdbdb' : '#5c5c5c' },
    p: { fontSize: '14px', fontWeight: '400', color: isDark ? '#cbd5e1' : '#475569' },
    kpiTitle: { fontSize: '14px', fontWeight: '500', color: isDark ? '#94a3b8' : '#64748b' },
    kpiValue: { fontSize: '30px', fontWeight: '600', color: isDark ? '#f8fafc' : '#ff4d94' },
    cardValue: { color: isDark ? '#3b82f6' : '#6e99c4' } // Based on cards_kpi specific tokens
  };

  /**
   * KPI CARD SUB-COMPONENT
   */
  const KpiCard = ({ title, value, trend, isPositive }) => (
    <div 
      className="flex flex-col p-[20px] rounded-[12px] border"
      style={{ 
        backgroundColor: colors.background_primary, 
        borderColor: colors.border 
      }}
    >
      <span style={{ 
        ...typography.kpiTitle, 
        color: isDark ? '#94a3b8' : '#968f64' // titleColor from card tokens
      }}>
        {title}
      </span>
      <div className="flex items-baseline gap-2 mt-1">
        <span style={{ 
          ...typography.kpiValue,
          color: typography.cardValue.color // valueColor from card tokens
        }}>
          {value}
        </span>
      </div>
      <div className="flex items-center gap-1 mt-2">
        {isPositive ? (
          <ArrowUp size={14} color="#10b981" />
        ) : (
          <ArrowDown size={14} color="#ef4444" />
        )}
        <span style={{ fontSize: '12px', fontWeight: '500', color: isPositive ? '#10b981' : '#ef4444' }}>
          {trend}
        </span>
        <span style={{ fontSize: '12px', color: colors.text_secondary }} className="ml-1">vs last period</span>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen font-['Inter',_sans-serif] p-8 transition-colors duration-300"
      style={{ backgroundColor: colors.background_primary, color: colors.text_primary }}
    >
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center mb-10 border-b pb-6" style={{ borderColor: colors.border }}>
        <div>
          <h1 style={typography.h2}>Operational Overview</h1>
          <p style={typography.p}>Real-time performance tracking for DAU and MRR</p>
        </div>

        <div className="flex items-center gap-4">
          {/* FUNCTIONAL THEME TOGGLE */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg border transition-all"
            style={{ borderColor: colors.border, backgroundColor: colors.background_secondary }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* FUNCTIONAL GRANULARITY TOGGLE */}
          <div className="flex p-1 rounded-lg" style={{ backgroundColor: colors.background_secondary }}>
            {['7D', '30D', '90D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  timeRange === range 
                    ? 'shadow-sm' 
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: timeRange === range ? colors.background_primary : 'transparent',
                  color: colors.text_primary 
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* KPI TOP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <KpiCard title="Total Active Users" value="1,248,302" trend="5.2%" isPositive={true} />
        <KpiCard title="Total Revenue (MRR)" value="$2,410,500" trend="12.4%" isPositive={true} />
        <KpiCard title="User Churn Rate" value="2.14%" trend="0.4%" isPositive={false} />
        <KpiCard title="Active Sessions" value="45,201" trend="8.1%" isPositive={true} />
      </div>

      {/* MAIN VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 30-DAY USER GROWTH LINE CHART */}
        <div 
          className="lg:col-span-2 p-6 rounded-[12px] border"
          style={{ backgroundColor: colors.background_primary, borderColor: colors.border }}
        >
          <div className="mb-6">
            <h3 style={typography.h4}>30-Day User Growth</h3>
            <p style={{ ...typography.p, fontSize: '12px' }}>Daily active users (DAU) trend over the last 30 days</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.chart_palette[0]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.chart_palette[0]} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.text_secondary, fontSize: 10 }}
                  tickFormatter={(str) => str.split('-')[2]}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.text_secondary, fontSize: 10 }}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.background_primary, 
                    borderColor: colors.border,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: colors.chart_palette[0] }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke={colors.chart_palette[0]} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REVENUE BY REGION BAR CHART */}
        <div 
          className="p-6 rounded-[12px] border"
          style={{ backgroundColor: colors.background_primary, borderColor: colors.border }}
        >
          <div className="mb-6">
            <h3 style={typography.h4}>Revenue by Region</h3>
            <p style={{ ...typography.p, fontSize: '12px' }}>Categorical breakdown of MRR</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.text_secondary, fontSize: 10 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <YAxis 
                  dataKey="region" 
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={100}
                  tick={{ fill: colors.text_primary, fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: colors.background_secondary, opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: colors.background_primary, 
                    borderColor: colors.border,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill={colors.chart_palette[1]} 
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* FOOTER ACTION */}
      <footer className="mt-12 flex justify-end gap-4">
        <button 
          className="px-6 py-2 rounded-lg font-medium transition-colors"
          style={{ 
            backgroundColor: isDark ? '#292929' : '#ffffff',
            color: isDark ? '#a0a7b0' : '#909362',
            border: `1px solid ${colors.border}`,
            fontSize: '14px'
          }}
        >
          Export CSV
        </button>
        <button 
          className="px-6 py-2 rounded-lg font-medium transition-all hover:brightness-110 active:scale-95"
          style={{ 
            backgroundColor: isDark ? '#5aa1d8' : '#bbbe8e',
            color: isDark ? '#000000' : '#ffffff',
            fontSize: '14px'
          }}
          onClick={() => alert('Generating full operational report...')}
        >
          Generate Report
        </button>
      </footer>
    </div>
  );
}