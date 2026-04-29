import React, { useState, useMemo } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  Tooltip, ResponsiveContainer, Cell,
  CartesianGrid
} from 'recharts';
import { 
  Filter, Users, TrendingDown, Map, 
  Search, Calendar, Layout, BarChart3, 
  Settings, LogOut, Info, AlertTriangle
} from 'lucide-react';

// --- Configuration & Constants ---
const SUBSCRIPTION_TIERS = ['Basic', 'Pro', 'Enterprise', 'Ultimate'];
const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM', 'Middle East'];

/**
 * Generates robust, realistic mock data for churn analysis.
 * Ensures LTV correlates broadly with Account Age but includes outliers.
 */
const generateMockData = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const accountAgeDays = Math.floor(Math.random() * 1460); // 0-4 years
    const ltv = Math.floor(Math.random() * 5000) + (accountAgeDays * 2.5);
    const tier = SUBSCRIPTION_TIERS[Math.floor(Math.random() * SUBSCRIPTION_TIERS.length)];
    const lastLoginDaysAgo = Math.floor(Math.pow(Math.random(), 2) * 90); // Weighted towards more recent
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];

    // Derived churn probability for visualization coloring
    const churnProb = (lastLoginDaysAgo / 90) * 0.7 + (tier === 'Basic' ? 0.2 : -0.1);

    return {
      id: 10000 + i,
      accountAge: accountAgeDays,
      ltv: ltv,
      tier: tier,
      lastLogin: lastLoginDaysAgo,
      region: region,
      churnProb: Math.max(0, Math.min(churnProb, 1)),
    };
  });
};

const MOCK_DATA = generateMockData(300);

/**
 * Heatmap Matrix generation for churn correlation across geographical regions.
 */
const HEATMAP_MATRIX = REGIONS.flatMap((r1, i) => 
  REGIONS.map((r2, j) => ({
    r1,
    r2,
    correlation: i === j ? 1 : Math.random() * 0.7,
    riskLevel: Math.random() > 0.8 ? 'High' : 'Moderate'
  }))
);

export default function ChurnExplorer() {
  const [filters, setFilters] = useState({
    minAge: 0,
    maxAge: 1460,
    tiers: [...SUBSCRIPTION_TIERS],
    maxLastLogin: 90,
    search: ''
  });

  const [activeTab, setActiveTab] = useState('scatter');
  const [hoveredNode, setHoveredNode] = useState(null);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesAge = item.accountAge >= filters.minAge && item.accountAge <= filters.maxAge;
      const matchesTier = filters.tiers.includes(item.tier);
      const matchesLogin = item.lastLogin <= filters.maxLastLogin;
      const matchesSearch = item.id.toString().includes(filters.search) || item.region.toLowerCase().includes(filters.search.toLowerCase());
      return matchesAge && matchesTier && matchesLogin && matchesSearch;
    });
  }, [filters]);

  const toggleTier = (tier) => {
    setFilters(prev => ({
      ...prev,
      tiers: prev.tiers.includes(tier) 
        ? prev.tiers.filter(t => t !== tier) 
        : [...prev.tiers, tier]
    }));
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* --- SIDEBAR: COMPLEX FILTERING --- */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col p-6 overflow-y-auto shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <TrendingDown size={22} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Retention Hub
          </h1>
        </div>

        <div className="space-y-8">
          {/* General Search */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Global Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="User ID or Region..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>

          {/* Account Age Range */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Tenure</label>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Days</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="1460" 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  value={filters.maxAge}
                  onChange={(e) => setFilters({...filters, maxAge: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>0d</span>
                <span className="text-indigo-400 font-bold">{filters.maxAge}d</span>
                <span>1460d</span>
              </div>
            </div>
          </div>

          {/* Subscription Tiers */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Subscription Tier</label>
            <div className="grid grid-cols-1 gap-2">
              {SUBSCRIPTION_TIERS.map(tier => (
                <button
                  key={tier}
                  onClick={() => toggleTier(tier)}
                  className={`flex items-center justify-between text-xs py-2.5 px-4 rounded-lg border transition-all ${
                    filters.tiers.includes(tier) 
                    ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-100' 
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${filters.tiers.includes(tier) ? 'bg-indigo-400' : 'bg-slate-700'}`} />
                    {tier}
                  </div>
                  {filters.tiers.includes(tier) && <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* Last Login Recency */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Last Login Threshold</label>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
               <div className="flex justify-between text-xs mb-3">
                <span className="text-slate-400">Activity Within:</span>
                <span className="text-indigo-400 font-bold">{filters.maxLastLogin} Days</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="90" 
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                value={filters.maxLastLogin}
                onChange={(e) => setFilters({...filters, maxLastLogin: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 flex gap-4">
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-lg transition-colors">
            Export Cohort
          </button>
        </div>
      </aside>

      {/* --- MAIN CANVAS --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header Navigation */}
        <header className="h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-10 flex items-center justify-between z-10">
          <div className="flex items-center gap-10">
            <button 
              onClick={() => setActiveTab('scatter')}
              className={`relative h-20 flex items-center gap-2 text-sm font-bold transition-all ${activeTab === 'scatter' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <BarChart3 size={18} />
              Retention Explorer
              {activeTab === 'scatter' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_-4px_12px_rgba(99,102,241,0.5)]" />}
            </button>
            <button 
              onClick={() => setActiveTab('heatmap')}
              className={`relative h-20 flex items-center gap-2 text-sm font-bold transition-all ${activeTab === 'heatmap' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Map size={18} />
              Geographical Correlation
              {activeTab === 'heatmap' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_-4px_12px_rgba(99,102,241,0.5)]" />}
            </button>
          </div>

          <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
             <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-black leading-none">Active Filter Set</p>
              <p className="text-sm font-mono text-indigo-400 font-bold leading-none mt-1">{filteredData.length} Users</p>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">
              SYS
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)]">
          {activeTab === 'scatter' ? (
            <div className="space-y-10">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Avg LTV', val: `$${(filteredData.reduce((a,b)=>a+b.ltv,0)/filteredData.length || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`, icon: TrendingDown, color: 'text-emerald-400' },
                  { label: 'Churn Risk', val: `${((filteredData.filter(d=>d.churnProb > 0.6).length / filteredData.length || 0) * 100).toFixed(1)}%`, icon: AlertTriangle, color: 'text-rose-400' },
                  { label: 'Enterprise %', val: `${((filteredData.filter(d=>d.tier === 'Enterprise').length / filteredData.length || 0) * 100).toFixed(0)}%`, icon: Users, color: 'text-indigo-400' },
                  { label: 'Idle Users', val: filteredData.filter(d=>d.lastLogin > 30).length, icon: Calendar, color: 'text-amber-400' }
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:bg-slate-900/60 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon size={16} className="text-slate-500" />
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Live Metric</span>
                    </div>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Main Chart Container */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold">LTV Distribution by Tenure</h3>
                    <p className="text-sm text-slate-500 mt-1">Dense scatter plot identifying high-value customers with attrition signals</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <div className="w-3 h-3 rounded-full bg-emerald-500/60" /> Healthy
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <div className="w-3 h-3 rounded-full bg-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.4)]" /> High Attrition Risk
                    </div>
                  </div>
                </div>

                <div className="h-[500px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        type="number" 
                        dataKey="accountAge" 
                        name="Account Age" 
                        unit="d" 
                        stroke="#475569" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Account Age (Days)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="ltv" 
                        name="Lifetime Value" 
                        unit="$" 
                        stroke="#475569" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Lifetime Value (USD)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                      />
                      <ZAxis type="number" dataKey="churnProb" range={[40, 400]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3', stroke: '#4f46e5' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-950 border border-indigo-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                                <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Customer Profile #{data.id}</p>
                                <div className="space-y-1.5">
                                  <div className="flex justify-between gap-8"><span className="text-slate-500 text-xs">Tier:</span><span className="text-white text-xs font-bold">{data.tier}</span></div>
                                  <div className="flex justify-between gap-8"><span className="text-slate-500 text-xs">LTV:</span><span className="text-emerald-400 text-xs font-bold">${data.ltv}</span></div>
                                  <div className="flex justify-between gap-8"><span className="text-slate-500 text-xs">Churn Prob:</span><span className={`${data.churnProb > 0.6 ? 'text-rose-400' : 'text-emerald-400'} text-xs font-bold`}>{(data.churnProb * 100).toFixed(1)}%</span></div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter name="Customers" data={filteredData}>
                        {filteredData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.churnProb > 0.6 ? '#f43f5e' : '#10b981'} 
                            fillOpacity={0.5}
                            stroke={entry.churnProb > 0.6 ? '#f43f5e' : '#10b981'}
                            strokeWidth={entry.churnProb > 0.6 ? 2 : 0}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            /* --- HEATMAP SECTION --- */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black text-white">Regional Correlation Matrix</h3>
                  <p className="text-slate-500 mt-2 max-w-xl">
                    Analyzing how churn triggers synchronize across server clusters. High correlation (darker blue) 
                    suggests systemic cross-regional risks like global outage impacts or localized policy shifts.
                  </p>
                </div>
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-indigo-500 rounded-lg"><Info size={20} /></div>
                  <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                    Strong correlation detected between <span className="font-bold">APAC</span> and <span className="font-bold">EMEA</span>.<br/>
                    Investigate shared data residency updates.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-[140px_repeat(5,1fr)] gap-4 mb-4">
                    <div />
                    {REGIONS.map(r => (
                      <div key={r} className="text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">
                        {r}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {REGIONS.map((r1, i) => (
                      <div key={r1} className="grid grid-cols-[140px_repeat(5,1fr)] gap-4">
                        <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-end pr-6">
                          {r1}
                        </div>
                        {REGIONS.map((r2, j) => {
                          const cell = HEATMAP_MATRIX.find(d => d.r1 === r1 && d.r2 === r2);
                          const intensity = cell.correlation;
                          return (
                            <div 
                              key={`${r1}-${r2}`}
                              className="aspect-video rounded-xl border border-white/5 flex items-center justify-center group relative cursor-crosshair overflow-hidden transition-transform hover:scale-105 hover:z-10"
                              style={{ 
                                backgroundColor: `rgba(99, 102, 241, ${intensity})`,
                                boxShadow: intensity > 0.8 ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none'
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                              <span className="text-xs font-black text-white drop-shadow-md">
                                {intensity === 1 ? '1.0' : intensity.toFixed(2)}
                              </span>

                              {/* Hover Detail Overlay */}
                              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center">
                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Sync Index</p>
                                <p className="text-sm font-bold text-white">{(intensity * 100).toFixed(0)}%</p>
                                <div className={`mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${cell.riskLevel === 'High' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                  {cell.riskLevel} Risk
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Low Sync</span>
                <div className="flex gap-1">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map(op => (
                    <div key={op} className="w-8 h-2 rounded-full" style={{ backgroundColor: `rgba(99, 102, 241, ${op})` }} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">High Correlation</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}