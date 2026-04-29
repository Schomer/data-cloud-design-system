import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/**
 * CHURN DATA EXPLORER
 * 
 * A high-density analytical dashboard for churn correlation analysis.
 * Features:
 * - Left Sidebar with multi-dimensional filters
 * - Reactive state-based data filtering
 * - Dense Scatter Plot for LTV vs Account Age
 * - Matrix Heatmap for Churn Correlation across Regions
 */

// --- MOCK DATA GENERATION ---
const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM', 'Middle East'];
const TIERS = ['Basic', 'Professional', 'Enterprise', 'Legacy'];

const generateMockData = () => {
  return Array.from({ length: 350 }, (_, i) => {
    const accountAge = Math.floor(Math.random() * 60); // 0-60 months
    const tier = TIERS[Math.floor(Math.random() * TIERS.length)];
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];

    // Logic to make data "realistic": Enterprise usually has higher LTV and age
    const ltvBase = tier === 'Enterprise' ? 5000 : tier === 'Professional' ? 2000 : 500;
    const ltv = ltvBase + (accountAge * Math.random() * 100);

    // Last login within last 180 days
    const daysSinceLogin = Math.floor(Math.random() * 180);
    const lastLoginDate = new Date();
    lastLoginDate.setDate(lastLoginDate.getDate() - daysSinceLogin);

    // Churn Risk (higher for low age or long time since login)
    const churnRisk = (180 - daysSinceLogin) / 180 * 0.4 + (60 - accountAge) / 60 * 0.6;

    return {
      id: `CUST-${1000 + i}`,
      accountAge,
      subscriptionTier: tier,
      lastLoginDate,
      daysSinceLogin,
      lifetimeValue: Math.round(ltv),
      region,
      churnRisk: Math.min(Math.max(churnRisk, 0), 1),
    };
  });
};

const DATA = generateMockData();

// --- COMPONENTS ---

export default function ChurnDataExplorer() {
  // State
  const [selectedTiers, setSelectedTiers] = useState(TIERS);
  const [ageRange, setAgeRange] = useState([0, 60]);
  const [loginHorizon, setLoginHorizon] = useState(180); // Days ago
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter Logic
  const filteredData = useMemo(() => {
    return DATA.filter(item => {
      const tierMatch = selectedTiers.includes(item.subscriptionTier);
      const ageMatch = item.accountAge >= ageRange[0] && item.accountAge <= ageRange[1];
      const loginMatch = item.daysSinceLogin <= loginHorizon;
      return tierMatch && ageMatch && loginMatch;
    });
  }, [selectedTiers, ageRange, loginHorizon]);

  // Heatmap Data Aggregation (Region vs Churn Risk)
  const heatmapData = useMemo(() => {
    return REGIONS.map(region => {
      const regionItems = filteredData.filter(d => d.region === region);
      const avgChurn = regionItems.reduce((acc, curr) => acc + curr.churnRisk, 0) / (regionItems.length || 1);
      return { region, avgChurn, count: regionItems.length };
    });
  }, [filteredData]);

  // Handlers
  const toggleTier = (tier) => {
    setSelectedTiers(prev => 
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] text-[#5c5c5c] dark:text-[#dbdbdb] font-sans selection:bg-[#62a8ea]/30">

      {/* HEADER */}
      <header className="z-20 w-full h-16 flex items-center justify-between px-6 border-b border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-[#e2e8f0] dark:hover:bg-[#1e293b] rounded transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-[#5c5c5c] dark:text-[#f8fafc]">Churn Intelligence <span className="text-[#64748b] dark:text-[#94a3b8] font-normal">Explorer</span></h1>
        </div>
        <nav className="flex items-center gap-6">
          <span className="text-sm font-medium text-[#2563eb] dark:text-[#60a5fa] border-b-2 border-[#3b82f6] pb-5 translate-y-2.5">Discovery</span>
          <span className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1] hover:text-[#334155] dark:hover:text-[#e2e8f0] cursor-pointer">Cohorts</span>
          <span className="text-sm font-medium text-[#64748b] dark:text-[#cbd5e1] hover:text-[#334155] dark:hover:text-[#e2e8f0] cursor-pointer">Predictions</span>
        </nav>
      </header>

      <div className="flex flex-1 relative overflow-hidden">

        {/* LEFT SIDEBAR - FILTERS */}
        <aside 
          className={`z-10 bg-[#ffffff] dark:bg-[#1a1a1a] border-r border-[#e2e8f0] dark:border-[#1e293b] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-0'}`}
        >
          <div className={`p-6 space-y-8 min-w-[18rem] ${!isSidebarOpen && 'opacity-0 pointer-events-none'}`}>

            {/* Subscription Tier */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#64748b] dark:text-[#94a3b8] mb-4">Subscription Tier</h3>
              <div className="space-y-2">
                {TIERS.map(tier => (
                  <label key={tier} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedTiers.includes(tier)}
                        onChange={() => toggleTier(tier)}
                        className="peer h-4 w-4 rounded border-[#e2e8f0] dark:border-[#1e293b] bg-transparent text-[#50af8b] dark:text-[#5aa0d8] focus:ring-0 focus:ring-offset-0 appearance-none border-2 checked:bg-[#50af8b] dark:checked:bg-[#5aa0d8] checked:border-transparent transition-all"
                      />
                      <svg className="absolute w-3 h-3 text-white dark:text-black opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <span className="text-sm text-[#475569] dark:text-[#cbd5e1] group-hover:text-[#0f172a] dark:group-hover:text-[#f8fafc] transition-colors">{tier}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Account Age Slider */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#64748b] dark:text-[#94a3b8] mb-4">Account Age (Months)</h3>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  value={ageRange[1]} 
                  onChange={(e) => setAgeRange([0, parseInt(e.target.value)])}
                  className="w-full h-1.5 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#50af8b] dark:accent-[#5aa0d8]"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-[#94a3b8]">0m</span>
                  <span className="text-sm font-medium text-[#5c5c5c] dark:text-[#dbdbdb]">{ageRange[1]}m</span>
                  <span className="text-xs text-[#94a3b8]">60m</span>
                </div>
              </div>
            </section>

            {/* Last Login Horizon */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#64748b] dark:text-[#94a3b8] mb-4">Last Login Horizon</h3>
              <div className="grid grid-cols-2 gap-2">
                {[30, 60, 90, 180].map(days => (
                  <button
                    key={days}
                    onClick={() => setLoginHorizon(days)}
                    className={`py-2 px-3 text-xs font-medium rounded-md border transition-all ${
                      loginHorizon === days 
                        ? 'bg-[#ebf5ff] dark:bg-[#1e3a8a] border-[#3b82f6] text-[#1d4ed8] dark:text-[#bfdbfe]' 
                        : 'bg-white dark:bg-[#292929] border-[#e2e8f0] dark:border-[#1e293b] text-[#64748b] dark:text-[#a0a7b0] hover:border-[#3b82f6]'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </section>

            <div className="pt-6 border-t border-[#e2e8f0] dark:border-[#1e293b]">
              <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1e293b]/50">
                <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Active Filter Result</p>
                <p className="text-2xl font-bold text-[#b624eb] dark:text-[#60a5fa]">{filteredData.length}</p>
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">Matching Customers</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CANVAS */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#ffffff] dark:bg-[#1a1a1a]">

          <div className="max-w-7xl mx-auto space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* SCATTER PLOT - LTV vs AGE */}
              <div className="lg:col-span-2 p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-bold text-[#5c5c5c] dark:text-[#dbdbdb]">LTV vs. Account Maturity</h2>
                    <p className="text-sm text-[#475569] dark:text-[#94a3b8]">Analyzing customer value growth relative to tenure</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#94a3b8] uppercase"><div className="w-2 h-2 rounded-full bg-[#62a8ea]"></div> High Risk</span>
                  </div>
                </div>

                <div className="h-[450px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b22" />
                      <XAxis 
                        type="number" 
                        dataKey="accountAge" 
                        name="Account Age" 
                        unit="m" 
                        stroke="#94a3b8" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="lifetimeValue" 
                        name="LTV" 
                        unit="$" 
                        stroke="#94a3b8" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ZAxis type="number" dataKey="churnRisk" range={[50, 400]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #1e293b', 
                          borderRadius: '8px',
                          color: '#dbdbdb',
                          fontSize: '12px'
                        }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Scatter name="Customers" data={filteredData}>
                        {filteredData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.churnRisk > 0.6 ? '#ef4444' : '#62a8ea'} 
                            fillOpacity={0.6}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* HEATMAP - CHURN CORRELATION ACROSS REGIONS */}
              <div className="p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col">
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-[#5c5c5c] dark:text-[#dbdbdb]">Regional Churn Heat</h2>
                  <p className="text-sm text-[#475569] dark:text-[#94a3b8]">Density of churn risk by geography</p>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                  {heatmapData.map((item) => {
                    const intensity = Math.round(item.avgChurn * 100);
                    const color = intensity > 70 ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                : intensity > 40 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

                    return (
                      <div key={item.region} className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${color}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold uppercase tracking-wider">{item.region}</span>
                          <span className="text-xs font-mono">{intensity}% Risk</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-current transition-all duration-1000" 
                            style={{ width: `${intensity}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-[10px] opacity-70">Sample Size: {item.count}</span>
                          <span className="text-[10px] uppercase font-bold">
                            {intensity > 60 ? 'Critical' : intensity > 40 ? 'Stable' : 'Healthy'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-[#e2e8f0] dark:border-[#1e293b]">
                  <p className="text-[10px] text-[#94a3b8] italic">Correlation heatmap calculated based on current filtered cohort selection.</p>
                </div>
              </div>
            </div>

            {/* DATA TABLE - DETAILED INSPECTION */}
            <div className="p-6 rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a]">
               <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#5c5c5c] dark:text-[#dbdbdb]">Customer Audit Log</h3>
                <div className="flex gap-2">
                   <button className="px-3 py-1.5 text-xs font-medium rounded-md border border-[#e2e8f0] dark:border-[#1e293b] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors">Export CSV</button>
                </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-[#e2e8f0] dark:border-[#1e293b]">
                       <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">Customer ID</th>
                       <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">Tier</th>
                       <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">Account Age</th>
                       <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">LTV</th>
                       <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">Churn Risk</th>
                       <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">Last Login</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                     {filteredData.slice(0, 10).map((row) => (
                       <tr key={row.id} className="group hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30 transition-colors">
                         <td className="py-4 text-xs font-mono font-medium text-[#0f172a] dark:text-[#cbd5e1]">{row.id}</td>
                         <td className="py-4">
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] dark:bg-[#1e3a8a] text-[#1d4ed8] dark:text-[#bfdbfe]">
                             {row.subscriptionTier}
                           </span>
                         </td>
                         <td className="py-4 text-xs text-[#475569] dark:text-[#94a3b8]">{row.accountAge} Months</td>
                         <td className="py-4 text-xs font-bold text-[#0f172a] dark:text-[#f8fafc]">${row.lifetimeValue.toLocaleString()}</td>
                         <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-full overflow-hidden w-20">
                                <div 
                                  className={`h-full rounded-full ${row.churnRisk > 0.6 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${row.churnRisk * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-[#94a3b8]">{Math.round(row.churnRisk * 100)}%</span>
                            </div>
                         </td>
                         <td className="py-4 text-xs text-[#64748b] dark:text-[#94a3b8]">{row.lastLoginDate.toLocaleDateString()}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 <div className="py-4 text-center">
                    <p className="text-[10px] font-medium text-[#94a3b8] uppercase tracking-widest">Showing top 10 of {filteredData.length} filtered results</p>
                 </div>
               </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}