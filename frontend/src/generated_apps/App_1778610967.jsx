import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ChevronDown, Search, ShieldCheck, User, LayoutDashboard, Info } from 'lucide-react';

/**
 * SALES COMMISSION LEADERBOARD
 * Built for Data Cloud Playground
 * Features: Role-based data masking, dynamic leaderboard, regional breakdown.
 */

// --- MOCK DATA GENERATION ---
const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM'];
const NAMES = [
  'Jordan Smith', 'Taylor Reed', 'Morgan Vance', 'Casey Blair', 'Riley Quinn',
  'Alex Rivera', 'Jamie Fox', 'Skyler Lane', 'Peyton Brooks', 'Drew Meyer',
  'Cameron Holt', 'Blake West', 'Avery Page', 'Parker Nash', 'Hayden Cole',
  'Quinn Dale', 'Sage Burke', 'Robin Hart', 'Phoenix Low', 'Emerson Day'
];

const PERFORMANCE_PHRASES = [
  "Exceeded Q1 targets by 15%", "Top performer in New Logo acquisition", 
  "Consistent upsell growth", "Needs focus on CRM hygiene", 
  "Highest conversion rate in region", "Excellent pipeline management",
  "Nurturing enterprise accounts", "Lagging in multi-product sales"
];

const rawData = Array.from({ length: 20 }, (_, i) => {
  const sales = Math.floor(Math.random() * 500000) + 150000;
  const commissionRate = 0.05 + (Math.random() * 0.05);
  return {
    id: i + 1,
    name: NAMES[i % NAMES.length],
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    totalSales: sales,
    commissionEarned: Math.round(sales * commissionRate),
    notes: PERFORMANCE_PHRASES[Math.floor(Math.random() * PERFORMANCE_PHRASES.length)]
  };
}).sort((a, b) => b.totalSales - a.totalSales);

// --- DESIGN TOKENS (from visual_spec.skill.md) ---
const TOKENS = {
  light: {
    bg: '#ffffff',
    bgSecondary: '#e2e8f0',
    text: '#5c5c5c',
    textSecondary: '#475569',
    border: '#e2e8f0',
    primary: '#598dc5',
    chart: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9']
  },
  dark: {
    bg: '#1a1a1a',
    bgSecondary: '#1e293b',
    text: '#dbdbdb',
    textSecondary: '#cbd5e1',
    border: '#1e293b',
    primary: '#5aa1d8',
    chart: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9']
  }
};

export default function SalesCommissionLeaderboard() {
  const [role, setRole] = useState('Regional Manager'); // 'Regional Manager' | 'Sales Representative'
  const [repSearch, setRepSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Leaderboard');

  // Logic to determine if a specific row's sensitive data should be hidden
  const shouldMaskData = (rowName) => {
    if (role === 'Regional Manager') return false;
    if (repSearch.toLowerCase() === rowName.toLowerCase()) return false;
    return true;
  };

  // Aggregated Data for Charts
  const regionalData = useMemo(() => {
    const map = {};
    rawData.forEach(item => {
      map[item.region] = (map[item.region] || 0) + item.totalSales;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const topPerformanceData = useMemo(() => rawData.slice(0, 5), []);

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] text-[#5c5c5c] dark:text-[#dbdbdb] font-['Inter',sans-serif]">

      {/* TOP HEADER */}
      <header className="w-full h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-8 bg-[#ffffff] dark:bg-[#1a1a1a] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#598dc5] dark:bg-[#5aa1d8] rounded flex items-center justify-center text-white font-bold">L</div>
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Commission Central</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4">
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Simulated User Role</span>
            <div className="relative inline-block">
              <select 
                value={role}
                onChange={(e) => {
                    setRole(e.target.value);
                    setRepSearch(''); // Reset search when switching roles
                }}
                className="appearance-none bg-[#f1f5f9] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-md px-4 py-1.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#598dc5] cursor-pointer"
              >
                <option>Regional Manager</option>
                <option>Sales Representative</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#e2e8f0] dark:bg-[#262626] flex items-center justify-center border border-[#cbd5e1] dark:border-[#334155]">
            {role === 'Regional Manager' ? <ShieldCheck size={20} /> : <User size={20} />}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">

        {/* SIDEBAR */}
        <aside className="w-64 border-r border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] p-4 flex flex-col gap-2">
            <button 
                onClick={() => setActiveTab('Leaderboard')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'Leaderboard' ? 'bg-[#ebf5ff] dark:bg-[#1e3a8a] text-[#457bb5] dark:text-[#bfdbfe]' : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
                <LayoutDashboard size={18} />
                <span style={{ fontWeight: activeTab === 'Leaderboard' ? '600' : '400' }}>Leaderboard</span>
            </button>
            <button 
                onClick={() => setActiveTab('Analytics')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'Analytics' ? 'bg-[#ebf5ff] dark:bg-[#1e3a8a] text-[#457bb5] dark:text-[#bfdbfe]' : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
                <Info size={18} />
                <span style={{ fontWeight: activeTab === 'Analytics' ? '600' : '400' }}>Insights</span>
            </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#ffffff] dark:bg-[#1a1a1a]">

          {activeTab === 'Leaderboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">

              {/* PAGE HEADER */}
              <div className="flex justify-between items-end">
                <div>
                    <h2 style={{ fontSize: '30px', fontWeight: '600', marginBottom: '4px' }}>Sales Performance</h2>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>Real-time ranking and commission breakdown for the current fiscal period.</p>
                </div>
                {role === 'Sales Representative' && (
                  <div className="w-80">
                    <label className="block mb-2 ml-1" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#94a3b8' }}>Identity Verification</label>
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Type your name to reveal details..."
                            value={repSearch}
                            onChange={(e) => setRepSearch(e.target.value)}
                            className="w-full bg-[#f8fafc] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#598dc5] dark:text-white"
                        />
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: '$' + (rawData.reduce((acc, curr) => acc + curr.totalSales, 0) / 1000000).toFixed(2) + 'M', color: '#598dc5' },
                    { label: 'Total Commission', value: '$' + (rawData.reduce((acc, curr) => acc + curr.commissionEarned, 0) / 1000).toFixed(0) + 'K', color: '#10b981' },
                    { label: 'Top Rep', value: rawData[0].name, color: '#f59e0b' },
                    { label: 'Avg Sale', value: '$' + (rawData.reduce((acc, curr) => acc + curr.totalSales, 0) / rawData.length / 1000).toFixed(0) + 'K', color: '#8b5cf6' }
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] p-6 rounded-xl shadow-sm">
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>{kpi.label}</span>
                        <div className="mt-2" style={{ fontSize: '24px', fontWeight: '600', color: kpi.color }}>{kpi.value}</div>
                    </div>
                ))}
              </div>

              {/* MAIN TABLE */}
              <div className="bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8fafc] dark:bg-[#1a1a1a] border-b border-[#e2e8f0] dark:border-[#1e293b]">
                        <tr>
                            <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: '#457bba', textTransform: 'uppercase' }}>Rank</th>
                            <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: '#457bba', textTransform: 'uppercase' }}>Rep Name</th>
                            <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: '#457bba', textTransform: 'uppercase' }}>Region</th>
                            <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: '#457bba', textTransform: 'uppercase' }}>Total Sales</th>
                            <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: '#457bba', textTransform: 'uppercase' }}>Commission Earned</th>
                            <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: '#457bba', textTransform: 'uppercase' }}>Performance Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                        {rawData.map((row, idx) => {
                            const isMasked = shouldMaskData(row.name);
                            const isCurrentRep = repSearch.toLowerCase() === row.name.toLowerCase() && role === 'Sales Representative';

                            return (
                                <tr key={row.id} className={`${isCurrentRep ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'} transition-colors`}>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-400">#{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span style={{ fontSize: '14px', fontWeight: '500', color: isCurrentRep ? '#598dc5' : '#475569' }}>{row.name}</span>
                                            {isCurrentRep && <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">You</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#64748b]">{row.region}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-[#475569] dark:text-[#cbd5e1]">${row.totalSales.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {isMasked ? (
                                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded blur-[4px] animate-pulse"></div>
                                        ) : (
                                            <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">${row.commissionEarned.toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isMasked ? (
                                            <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded blur-[3px]"></div>
                                        ) : (
                                            <span style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>"{row.notes}"</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* REGIONAL PERFORMANCE */}
                    <div className="bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 shadow-sm">
                        <h3 className="mb-6" style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }}>Revenue Distribution by Region</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={regionalData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {regionalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={TOKENS.light.chart[index % TOKENS.light.chart.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        formatter={(val) => [`$${(val / 1000).toFixed(0)}K`, 'Total Sales']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center mt-4">
                            {regionalData.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TOKENS.light.chart[i % TOKENS.light.chart.length] }}></div>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOP PERFORMERS TREND */}
                    <div className="bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 shadow-sm">
                        <h3 className="mb-6" style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }}>Top 5 Representative Comparison</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topPerformanceData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        width={100} 
                                        axisLine={false} 
                                        tickLine={false}
                                        style={{ fontSize: '12px', fill: '#64748b' }}
                                    />
                                    <Tooltip 
                                         cursor={{ fill: 'transparent' }}
                                         contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                         formatter={(val) => [`$${val.toLocaleString()}`, 'Total Sales']}
                                    />
                                    <Bar dataKey="totalSales" radius={[0, 4, 4, 0]} barSize={24}>
                                        {topPerformanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#598dc5' : '#94a3b8'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="mt-4 text-center" style={{ fontSize: '12px', color: '#94a3b8' }}>
                            Currently showing the top revenue generators for the month.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-8 text-center max-w-2xl mx-auto shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="text-[#598dc5] dark:text-[#5aa1d8]" size={32} />
                    </div>
                    <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Privacy Awareness</h4>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                        This application demonstrates Role-Based Access Control (RBAC). In 'Representative' mode, sensitive commission data and managerial performance notes are restricted for peers to comply with privacy regulations while maintaining a healthy competitive environment through total sales rankings.
                    </p>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}