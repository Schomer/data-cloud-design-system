import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * CUSTOMER CHURN EXPLORER
 * Built for Data Cloud Playground
 */

// --- MOCK DATA GENERATION ---
const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
const TIERS = ['Free', 'Basic', 'Pro', 'Enterprise'];

const generateMockData = () => {
  return Array.from({ length: 200 }, (_, i) => {
    const age = Math.floor(Math.random() * 1000) + 1;
    const ltv = Math.floor(Math.random() * 15000) + 500;
    const churnProb = Math.random();
    // High correlation: Enterprise usually higher age/ltv, Free higher churn
    return {
      id: i,
      accountAge: age,
      ltv: ltv,
      churnScore: Math.round(churnProb * 100),
      region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
      tier: TIERS[Math.floor(Math.random() * TIERS.length)],
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString().split('T')[0]
    };
  });
};

const MOCK_DATA = generateMockData();

// --- COMPONENTS ---

const Header = () => (
  <header className="w-full h-16 flex items-center px-6 border-b bg-[#ffffff] dark:bg-[#1a1a1a] border-[#e2e8f0] dark:border-[#1e293b] z-10">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded bg-[#5aa1d8] flex items-center justify-center text-white font-bold">C</div>
      <h1 className="text-[18px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb] tracking-tight">
        Churn Investigator <span className="text-[#64748b] font-normal ml-2">/ Discovery</span>
      </h1>
    </div>
  </header>
);

const FilterPanel = ({ filters, setFilters }) => {
  const toggleTier = (tier) => {
    const next = filters.tiers.includes(tier)
      ? filters.tiers.filter(t => t !== tier)
      : [...filters.tiers, tier];
    setFilters({ ...filters, tiers: next });
  };

  return (
    <aside className="w-[300px] border-r h-[calc(100vh-64px)] overflow-y-auto bg-[#ffffff] dark:bg-[#1a1a1a] border-[#e2e8f0] dark:border-[#1e293b] p-6 flex flex-col gap-8">
      {/* Account Age Filter */}
      <section>
        <h6 className="text-[11px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-4">Account Age (Days)</h6>
        <div className="flex flex-col gap-2">
          <input 
            type="range" min="0" max="1000" 
            value={filters.ageLimit} 
            onChange={(e) => setFilters({...filters, ageLimit: parseInt(e.target.value)})}
            className="w-full accent-[#5aa1d8]"
          />
          <div className="flex justify-between text-[12px] text-[#475569] dark:text-[#94a3b8]">
            <span>0</span>
            <span className="font-bold">Up to {filters.ageLimit}</span>
            <span>1000</span>
          </div>
        </div>
      </section>

      {/* Subscription Tier Filter */}
      <section>
        <h6 className="text-[11px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-4">Subscription Tier</h6>
        <div className="flex flex-col gap-3">
          {TIERS.map(tier => (
            <label key={tier} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.tiers.includes(tier)}
                onChange={() => toggleTier(tier)}
                className="w-4 h-4 rounded border-[#e2e8f0] dark:border-[#1e293b] accent-[#5aa1d8]"
              />
              <span className="text-[14px] text-[#475569] dark:text-[#cbd5e1] group-hover:text-[#5aa1d8] transition-colors">
                {tier}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Last Login Date Filter */}
      <section>
        <h6 className="text-[11px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-4">Last Login Since</h6>
        <input 
          type="date" 
          value={filters.lastLoginSince}
          onChange={(e) => setFilters({...filters, lastLoginSince: e.target.value})}
          className="w-full h-10 px-3 bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg text-[14px] text-[#0f172a] dark:text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
        />
      </section>

      <button 
        onClick={() => setFilters({ ageLimit: 1000, tiers: TIERS, lastLoginSince: '2026-01-01' })}
        className="mt-4 w-full py-2 rounded-lg bg-[#292929] dark:bg-[#292929] border border-[#1e293b] text-[#a0a7b0] text-[14px] hover:bg-[#122940] transition-colors"
      >
        Reset Filters
      </button>
    </aside>
  );
};

const ChurnHeatmap = ({ data }) => {
  // Aggregate churn avg by Region and Tier
  const matrix = useMemo(() => {
    return REGIONS.map(region => {
      return TIERS.map(tier => {
        const cellData = data.filter(d => d.region === region && d.tier === tier);
        const avgChurn = cellData.length 
          ? cellData.reduce((acc, curr) => acc + curr.churnScore, 0) / cellData.length 
          : 0;
        return { region, tier, value: Math.round(avgChurn) };
      });
    });
  }, [data]);

  const getColor = (value) => {
    if (value > 75) return '#ef4444'; // High
    if (value > 50) return '#f59e0b'; // Med
    if (value > 25) return '#62a8ea'; // Low
    return '#10b981'; // Very Low
  };

  return (
    <div className="bg-[#ffffff] dark:bg-[#1a1a1a] p-6 rounded-xl border border-[#e2e8f0] dark:border-[#1e293b]">
      <div className="mb-6">
        <h4 className="text-[20px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb]">Regional Churn Intensity</h4>
        <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Average churn risk score by geography vs service tier</p>
      </div>

      <div className="grid grid-cols-5 gap-1">
        <div className="h-8"></div>
        {TIERS.map(t => <div key={t} className="text-[10px] text-center uppercase text-[#94a3b8] font-bold">{t}</div>)}

        {matrix.map((row, idx) => (
          <React.Fragment key={REGIONS[idx]}>
            <div className="text-[12px] text-[#475569] dark:text-[#cbd5e1] flex items-center pr-2 truncate">
              {REGIONS[idx]}
            </div>
            {row.map((cell, cidx) => (
              <div 
                key={`${idx}-${cidx}`}
                className="h-12 rounded-sm flex items-center justify-center text-[10px] font-bold text-white group relative"
                style={{ backgroundColor: getColor(cell.value) }}
              >
                {cell.value}%
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#334155] text-white p-2 rounded text-[10px] whitespace-nowrap z-20">
                  {cell.region} - {cell.tier}: {cell.value}% Risk
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4 text-[11px] text-[#94a3b8]">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#10b981]"></div> Low</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#62a8ea]"></div> Moderate</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#f59e0b]"></div> Elevated</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-[#ef4444]"></div> Critical</div>
      </div>
    </div>
  );
};

const AgeLtvScatter = ({ data }) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#1a1a1a] p-6 rounded-xl border border-[#e2e8f0] dark:border-[#1e293b] h-[500px]">
      <div className="mb-6">
        <h4 className="text-[20px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb]">Age vs Lifetime Value</h4>
        <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Point color denotes churn risk probability</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
          <XAxis 
            type="number" 
            dataKey="accountAge" 
            name="Age" 
            unit="d" 
            stroke="#94a3b8" 
            fontSize={12}
            label={{ value: 'Account Age (Days)', position: 'bottom', offset: 20, fill: '#64748b' }}
          />
          <YAxis 
            type="number" 
            dataKey="ltv" 
            name="LTV" 
            unit="$" 
            stroke="#94a3b8" 
            fontSize={12}
            label={{ value: 'Lifetime Value ($)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
          />
          <ZAxis type="number" dataKey="churnScore" range={[20, 400]} name="Churn Risk" />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
          />
          <Scatter name="Customers" data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.churnScore > 60 ? '#ef4444' : entry.churnScore > 30 ? '#62a8ea' : '#10b981'} 
                fillOpacity={0.6}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function ChurnExplorer() {
  const [filters, setFilters] = useState({
    ageLimit: 1000,
    tiers: TIERS,
    lastLoginSince: '2026-01-01'
  });

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(d => 
      d.accountAge <= filters.ageLimit &&
      filters.tiers.includes(d.tier) &&
      new Date(d.lastLogin) >= new Date(filters.lastLoginSince)
    );
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col font-sans">
      <Header />

      <div className="flex flex-1">
        <FilterPanel filters={filters} setFilters={setFilters} />

        <main className="flex-1 p-8 bg-[#f8fafc] dark:bg-[#121212] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Stats Header */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Sample Population', value: filteredData.length, color: '#3b82f6' },
                { label: 'Avg Churn Risk', value: `${Math.round(filteredData.reduce((a,c) => a+c.churnScore,0)/filteredData.length || 0)}%`, color: '#ef4444' },
                { label: 'Average LTV', value: `$${Math.round(filteredData.reduce((a,c) => a+c.ltv,0)/filteredData.length || 0).toLocaleString()}`, color: '#10b981' },
                { label: 'Retention Health', value: 'Moderate', color: '#f59e0b' }
              ].map((kpi, i) => (
                <div key={i} className="bg-[#ffffff] dark:bg-[#1a1a1a] p-5 rounded-xl border border-[#e2e8f0] dark:border-[#1e293b]">
                  <p className="text-[12px] font-[500] text-[#64748b] dark:text-[#94a3b8] mb-1">{kpi.label}</p>
                  <p className="text-[24px] font-[600]" style={{ color: kpi.color }}>{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AgeLtvScatter data={filteredData} />
              <ChurnHeatmap data={filteredData} />
            </div>

            {/* Bottom Audit Table Sample */}
            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] p-6 rounded-xl border border-[#e2e8f0] dark:border-[#1e293b]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-[20px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb]">High Risk Cohort</h4>
                  <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Showing 10 highest risk customers in filtered set</p>
                </div>
                <button className="text-[14px] text-[#3b82f6] hover:underline">Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] dark:border-[#262626]">
                      {['ID', 'Tier', 'Region', 'Age', 'LTV', 'Last Login', 'Risk'].map(h => (
                        <th key={h} className="pb-3 text-[11px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.sort((a,b) => b.churnScore - a.churnScore).slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b border-[#f1f5f9] dark:border-[#262626] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors">
                        <td className="py-3 text-[13px] font-mono text-[#475569] dark:text-[#cbd5e1]">#USR-{row.id.toString().padStart(4, '0')}</td>
                        <td className="py-3 text-[13px] text-[#475569] dark:text-[#cbd5e1]">{row.tier}</td>
                        <td className="py-3 text-[13px] text-[#475569] dark:text-[#cbd5e1]">{row.region}</td>
                        <td className="py-3 text-[13px] text-[#475569] dark:text-[#cbd5e1]">{row.accountAge}d</td>
                        <td className="py-3 text-[13px] text-[#475569] dark:text-[#cbd5e1]">${row.ltv.toLocaleString()}</td>
                        <td className="py-3 text-[13px] text-[#475569] dark:text-[#cbd5e1]">{row.lastLogin}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${row.churnScore > 70 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {row.churnScore}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}