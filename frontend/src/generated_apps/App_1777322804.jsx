import React, { useState, useMemo } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

/**
 * CHURN ANALYTICS EXPLORER
 * Built for Data Investigators / Business Analysts
 * Strictly adheres to the Cloud Data App Visual Specification & Layout Patterns.
 */

// --- MOCK DATA GENERATION ---
const TIERS = ['Basic', 'Pro', 'Enterprise', 'Ultimate'];
const REGIONS = ['North America', 'Europe', 'APAC', 'LATAM', 'EMEA', 'Canada', 'Oceania'];

const generateData = () => {
  return Array.from({ length: 300 }, (_, i) => {
    const accountAge = Math.floor(Math.random() * 60); // 0-60 months
    const lifetimeValue = Math.floor(Math.random() * 4500) + (accountAge * 50); // Correlation age/ltv
    const tier = TIERS[Math.floor(Math.random() * TIERS.length)];
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const lastLogin = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
    // High churn risk for Basic users with low LTV
    const churnRisk = (tier === 'Basic' && lifetimeValue < 1500) ? Math.random() * 0.4 + 0.6 : Math.random();

    return {
      id: `CUST-${1000 + i}`,
      accountAge,
      lifetimeValue,
      tier,
      region,
      lastLogin: lastLogin.toISOString().split('T')[0],
      churnRisk
    };
  });
};

const MOCK_DATA = generateData();

export default function ChurnExplorer() {
  // --- STATE ---
  const [data] = useState(MOCK_DATA);
  const [ageRange, setAgeRange] = useState([0, 60]);
  const [selectedTiers, setSelectedTiers] = useState(TIERS);
  const [dateRange, setDateRange] = useState({ 
    start: '2020-01-01', 
    end: new Date().toISOString().split('T')[0] 
  });

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const ageMatch = item.accountAge >= ageRange[0] && item.accountAge <= ageRange[1];
      const tierMatch = selectedTiers.includes(item.tier);
      const dateMatch = item.lastLogin >= dateRange.start && item.lastLogin <= dateRange.end;
      return ageMatch && tierMatch && dateMatch;
    });
  }, [data, ageRange, selectedTiers, dateRange]);

  // --- HEATMAP CALCULATION ---
  // Churn correlation by Region vs Subscription Tier
  const heatmapData = useMemo(() => {
    return REGIONS.map(region => {
      return TIERS.map(tier => {
        const segment = filteredData.filter(d => d.region === region && d.tier === tier);
        const avgRisk = segment.length > 0 
          ? segment.reduce((acc, curr) => acc + curr.churnRisk, 0) / segment.length 
          : 0;
        return { region, tier, value: avgRisk };
      });
    }).flat();
  }, [filteredData]);

  const toggleTier = (tier) => {
    setSelectedTiers(prev => 
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    );
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col font-['Inter',_sans-serif]">
      {/* TOP HEADER */}
      <header className="w-full h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center px-6 justify-between shrink-0">
        <h1 className="text-[20px] font-semibold text-[#5c5c5c] dark:text-[#dbdbdb] tracking-tight">
          Churn Analysis Explorer
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">
            {filteredData.length} records matched
          </div>
          <button className="bg-[#50af8b] hover:bg-[#054aa3] text-[#ffffff] px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors">
            Export Dataset
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - FILTER CONTROLS */}
        <aside className="w-80 border-r border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] p-6 flex flex-col gap-8 overflow-y-auto">
          <div>
            <h6 className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-4">
              Account Parameters
            </h6>

            {/* Account Age Slider */}
            <div className="mb-6">
              <label className="text-[14px] text-[#475569] dark:text-[#cbd5e1] block mb-2">
                Account Age (Months)
              </label>
              <input 
                type="range" 
                min="0" 
                max="60" 
                value={ageRange[1]} 
                onChange={(e) => setAgeRange([0, parseInt(e.target.value)])}
                className="w-full h-1.5 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#5aa1d8]"
              />
              <div className="flex justify-between mt-1 text-[12px] text-[#64748b]">
                <span>0</span>
                <span>{ageRange[1]} mo</span>
              </div>
            </div>

            {/* Subscription Tier Selection */}
            <div className="mb-6">
              <label className="text-[14px] text-[#475569] dark:text-[#cbd5e1] block mb-3">
                Subscription Tiers
              </label>
              <div className="flex flex-wrap gap-2">
                {TIERS.map(tier => (
                  <button
                    key={tier}
                    onClick={() => toggleTier(tier)}
                    className={`px-3 py-1.5 rounded-[6px] text-[12px] border transition-all ${
                      selectedTiers.includes(tier)
                        ? 'bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8] dark:bg-[#425b9e] dark:border-[#2d4dae] dark:text-[#f8fafc]'
                        : 'bg-[#ffffff] dark:bg-[#292929] border-[#e2e8f0] dark:border-[#1e293b] text-[#64748b] dark:text-[#a0a7b0]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Last Login Date Range */}
            <div>
              <label className="text-[14px] text-[#475569] dark:text-[#cbd5e1] block mb-2">
                Last Login Activity
              </label>
              <div className="flex flex-col gap-2">
                <input 
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(p => ({...p, start: e.target.value}))}
                  className="bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[8px] p-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] outline-none focus:ring-1 focus:ring-[#3b82f6]"
                />
                <input 
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(p => ({...p, end: e.target.value}))}
                  className="bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[8px] p-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] outline-none focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              setAgeRange([0, 60]);
              setSelectedTiers(TIERS);
              setDateRange({ start: '2020-01-01', end: new Date().toISOString().split('T')[0] });
            }}
            className="mt-auto py-2 text-[14px] font-medium text-[#0d67df] dark:text-[#9ea5ae] hover:underline"
          >
            Reset Filters
          </button>
        </aside>

        {/* MAIN CANVAS */}
        <main className="flex-1 p-8 bg-[#ffffff] dark:bg-[#1a1a1a] overflow-y-auto">
          <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">

            {/* SCATTER PLOT SECTION */}
            <section className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6">
              <div className="mb-6">
                <h3 className="text-[18px] font-semibold text-[#5c5c5c] dark:text-[#dbdbdb]">
                  Account Age vs. Lifetime Value
                </h3>
                <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">
                  Visualizing customer value trajectory and density across account tenure.
                </p>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      type="number" 
                      dataKey="accountAge" 
                      name="Age" 
                      unit="mo" 
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="lifetimeValue" 
                      name="LTV" 
                      unit="$" 
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <ZAxis type="number" dataKey="churnRisk" range={[50, 400]} name="Churn Risk" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0',
                        fontSize: '12px' 
                      }}
                    />
                    <Scatter 
                      name="Customers" 
                      data={filteredData} 
                      fill="#62a8ea" 
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* HEATMAP SECTION */}
            <section className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6">
              <div className="mb-6">
                <h3 className="text-[18px] font-semibold text-[#5c5c5c] dark:text-[#dbdbdb]">
                  Regional Churn Risk Matrix
                </h3>
                <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">
                  Heatmap of average churn risk correlation across geographic regions and subscription tiers.
                </p>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Heatmap Labels (Tiers) */}
                  <div className="flex ml-[120px]">
                    {TIERS.map(tier => (
                      <div key={tier} className="flex-1 text-center py-2 text-[11px] font-bold text-[#64748b] uppercase tracking-widest">
                        {tier}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Grid */}
                  <div className="space-y-1">
                    {REGIONS.map(region => (
                      <div key={region} className="flex items-center h-12">
                        <div className="w-[120px] text-[12px] font-medium text-[#475569] dark:text-[#cbd5e1] truncate pr-4 text-right">
                          {region}
                        </div>
                        <div className="flex-1 flex gap-1 h-full">
                          {TIERS.map(tier => {
                            const entry = heatmapData.find(h => h.region === region && h.tier === tier);
                            const val = entry?.value || 0;

                            // Map value (0-1) to opacity of a churn red/blue scale
                            const opacity = Math.max(0.05, val);
                            const color = val > 0.5 ? `rgba(239, 68, 68, ${opacity})` : `rgba(98, 168, 234, ${opacity})`;

                            return (
                              <div 
                                key={tier} 
                                title={`${region} - ${tier}: ${(val * 100).toFixed(1)}% risk`}
                                className="flex-1 rounded-[4px] flex items-center justify-center text-[10px] font-semibold transition-transform hover:scale-[1.02] cursor-pointer"
                                style={{ backgroundColor: color, color: val > 0.7 ? '#fff' : 'transparent' }}
                              >
                                {val > 0.7 ? 'High' : ''}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-8 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-[2px] bg-[#62a8ea]" />
                  <span className="text-[11px] text-[#64748b]">Lower Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-[2px] bg-[#ef4444]" />
                  <span className="text-[11px] text-[#64748b]">Higher Risk</span>
                </div>
                <div className="text-[11px] italic text-[#94a3b8] ml-4">
                  * Based on filtered sample size of {filteredData.length}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}