import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';
import { Menu, X, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/**
 * MACROECONOMIC HEADWIND SIMULATOR
 * 
 * A high-fidelity executive dashboard for simulating margin erosion.
 * Adheres strictly to the visual_spec.skill.md tokens.
 */

// --- DATA GENERATION ---
const PRODUCT_LINES = [
  { id: 1, name: 'Consumer Electronics', revenue: 12400000, cogs: 8500000 },
  { id: 2, name: 'Industrial Hardware', revenue: 8200000, cogs: 4100000 },
  { id: 3, name: 'Luxury Goods', revenue: 5600000, cogs: 1200000 },
  { id: 4, name: 'Retail Essentials', revenue: 15800000, cogs: 13200000 },
  { id: 5, name: 'Digital Services', revenue: 4200000, cogs: 600000 },
  { id: 6, name: 'Logistics & Freight', revenue: 3100000, cogs: 2800000 }
];

// --- STYLES FROM VISUAL SPEC ---
const TOKENS = {
  light: {
    bg: "#ffffff",
    bgSecondary: "#e2e8f0",
    textPrimary: "#5c5c5c",
    textSecondary: "#475569",
    border: "#e2e8f0",
    cardTitle: "#457bb4",
    cardValue: "#5f6972",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9", "#ea75b0"],
    success: "#10b981",
    error: "#ef4444"
  },
  dark: {
    bg: "#1a1a1a",
    bgSecondary: "#1e293b",
    textPrimary: "#dbdbdb",
    textSecondary: "#cbd5e1",
    border: "#1e293b",
    cardTitle: "#94a3b8",
    cardValue: "#3b82f6",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9", "#ea75b0"],
    success: "#34d399",
    error: "#fb7185"
  }
};

export default function MacroHeadwindSimulator() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simulation State (Levers)
  const [inflation, setInflation] = useState(0); // 0-10
  const [tariff, setTariff] = useState(0);       // 0-25
  const [rateHike, setRateHike] = useState(0);   // 0-5

  const theme = isDarkMode ? TOKENS.dark : TOKENS.light;

  // --- CALCULATION ENGINE ---
  const simulation = useMemo(() => {
    let targetNetProfit = 0;
    let simulatedNetProfit = 0;

    const productBreakdown = PRODUCT_LINES.map(p => {
      const baseProfit = p.revenue - p.cogs;
      targetNetProfit += baseProfit;

      // Compound Erosion Formula:
      // 1. Inflation impacts COGS
      // 2. Tariffs impact COGS (compounded on inflation)
      // 3. Interest rate hikes act as a direct revenue tax (cost of capital/debt)
      const erodedCogs = p.cogs * (1 + (inflation / 100)) * (1 + (tariff / 100));
      const interestCost = p.revenue * (rateHike / 100);
      const simProfit = p.revenue - erodedCogs - interestCost;

      simulatedNetProfit += simProfit;
      const leak = baseProfit - simProfit;

      return {
        name: p.name,
        leak: leak,
        profit: simProfit
      };
    });

    const delta = simulatedNetProfit - targetNetProfit;

    return {
      targetNetProfit,
      simulatedNetProfit,
      delta,
      productBreakdown
    };
  }, [inflation, tariff, rateHike]);

  // Formatters
  const fCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const fPercent = (val) => `${val}%`;

  // Waterfall Chart Preparation
  // In a waterfall leak chart, we show the erosion by category.
  const waterfallData = useMemo(() => {
    let runningTotal = simulation.targetNetProfit;
    const data = [{ name: 'Target', value: runningTotal, display: runningTotal, fill: theme.chart[0] }];

    simulation.productBreakdown.forEach((p, idx) => {
      const start = runningTotal;
      runningTotal -= p.leak;
      data.push({
        name: p.name,
        value: [start, runningTotal], // Recharts Bar range
        display: -p.leak,
        fill: theme.error
      });
    });

    data.push({ name: 'Simulated', value: runningTotal, display: runningTotal, fill: theme.chart[2] });
    return data;
  }, [simulation, theme]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]'}`}>

      {/* --- TOP HEADER --- */}
      <header className="w-full h-16 flex items-center justify-between px-6 border-b z-50 sticky top-0" 
        style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 transition-colors duration-200"
            style={{ color: theme.textPrimary }}
          >
            <Menu size={20} />
          </button>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: theme.textPrimary,
            letterSpacing: '-0.025em'
          }}>
            Macroeconomic Headwind Simulator
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-[#e2e8f0] dark:bg-[#121212] rounded-full p-1 border" style={{ borderColor: theme.border }}>
             <button 
                onClick={() => setIsDarkMode(false)}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${!isDarkMode ? 'bg-white shadow-sm text-[#457bb5]' : 'text-slate-400'}`}
             >Light</button>
             <button 
                onClick={() => setIsDarkMode(true)}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${isDarkMode ? 'bg-[#262626] shadow-sm text-[#60a5fa]' : 'text-slate-500'}`}
             >Dark</button>
          </div>
          <div className="h-8 w-[1px]" style={{ backgroundColor: theme.border }}></div>
          <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: '500' }}>FY2026 PROJECTION</span>
        </div>
      </header>

      <div className="flex">

        {/* --- SIDEBAR: MACRO LEVERS --- */}
        <aside 
          className={`transition-all duration-300 border-r overflow-hidden sticky top-16 h-[calc(100vh-64px)]`}
          style={{ 
            width: isSidebarOpen ? '320px' : '0px', 
            backgroundColor: theme.bg, 
            borderColor: theme.border 
          }}
        >
          <div className="p-8 w-[320px]">
            <h6 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: theme.textSecondary, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '24px'
            }}>
              Simulation Levers
            </h6>

            <div className="space-y-10">
              {/* Inflation Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>Inflation Spike</label>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: theme.cardTitle }}>{fPercent(inflation)}</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.1" value={inflation}
                  onChange={(e) => setInflation(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800 accent-[#5aa1d8]"
                />
                <p style={{ fontSize: '11px', color: theme.textSecondary }}>Impacts global COGS across all domestic and international raw materials.</p>
              </div>

              {/* Tariff Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>Supply Chain Tariff</label>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: theme.cardTitle }}>{fPercent(tariff)}</span>
                </div>
                <input 
                  type="range" min="0" max="25" step="0.5" value={tariff}
                  onChange={(e) => setTariff(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800 accent-[#5aa1d8]"
                />
                <p style={{ fontSize: '11px', color: theme.textSecondary }}>Compounded duty on imported inventory and freight components.</p>
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>Interest Rate Hike</label>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: theme.cardTitle }}>{fPercent(rateHike)}</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.25" value={rateHike}
                  onChange={(e) => setRateHike(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-800 accent-[#5aa1d8]"
                />
                <p style={{ fontSize: '11px', color: theme.textSecondary }}>Increase in cost of short-term debt and working capital financing.</p>
              </div>
            </div>

            <button 
              onClick={() => { setInflation(0); setTariff(0); setRateHike(0); }}
              className="w-full mt-12 py-3 rounded-md text-sm font-semibold transition-all border"
              style={{ 
                backgroundColor: theme.bgSecondary, 
                color: theme.textPrimary,
                borderColor: theme.border
              }}
            >
              Reset to Base Case
            </button>
          </div>
        </aside>

        {/* --- MAIN CANVAS --- */}
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">

          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Target Card */}
            <div className="border rounded-xl p-6 transition-all shadow-sm" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
              <h6 style={{ fontSize: '12px', fontWeight: '600', color: theme.cardTitle, textTransform: 'uppercase', marginBottom: '8px' }}>Target Net Profit</h6>
              <div className="flex items-end gap-2">
                <span style={{ fontSize: '30px', fontWeight: '600', color: theme.cardValue }}>{fCurrency(simulation.targetNetProfit)}</span>
                <span className="mb-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800" style={{ color: theme.textSecondary }}>BASE</span>
              </div>
            </div>

            {/* Simulated Card */}
            <div className="border rounded-xl p-6 transition-all shadow-md ring-1 ring-[#5aa1d8]/20" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
              <h6 style={{ fontSize: '12px', fontWeight: '600', color: theme.cardTitle, textTransform: 'uppercase', marginBottom: '8px' }}>Simulated Net Profit</h6>
              <div className="flex items-end gap-3">
                <span style={{ fontSize: '30px', fontWeight: '600', color: theme.cardValue }}>{fCurrency(simulation.simulatedNetProfit)}</span>
                <div className="mb-1.5 flex items-center gap-1">
                   {simulation.simulatedNetProfit < simulation.targetNetProfit ? (
                     <ArrowDownRight size={16} className="text-red-500" />
                   ) : (
                     <Minus size={16} className="text-slate-400" />
                   )}
                </div>
              </div>
            </div>

            {/* Delta Card */}
            <div className="border rounded-xl p-6 transition-all shadow-sm" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
              <h6 style={{ fontSize: '12px', fontWeight: '600', color: theme.cardTitle, textTransform: 'uppercase', marginBottom: '8px' }}>Delta ($ Variance)</h6>
              <div className="flex items-end gap-2">
                <span style={{ 
                  fontSize: '30px', 
                  fontWeight: '600', 
                  color: simulation.delta < 0 ? theme.error : (simulation.delta === 0 ? theme.cardValue : theme.success) 
                }}>
                  {fCurrency(simulation.delta)}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, marginBottom: '4px' }}>
                  ({((simulation.delta / simulation.targetNetProfit) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* WATERFALL CHART SECTION */}
          <div className="border rounded-xl p-8 mb-8" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', color: theme.textPrimary, marginBottom: '4px' }}>Net Profit Leakage Breakdown</h3>
                <p style={{ fontSize: '14px', color: theme.textSecondary }}>Analysis of profit erosion across product lines under simulated headwinds.</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: theme.chart[0] }}></div>
                    <span style={{ fontSize: '11px', color: theme.textSecondary }}>Target Baseline</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: theme.error }}></div>
                    <span style={{ fontSize: '11px', color: theme.textSecondary }}>Profit Leak</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: theme.chart[2] }}></div>
                    <span style={{ fontSize: '11px', color: theme.textSecondary }}>Simulated Result</span>
                 </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#262626' : '#f1f5f9'} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: theme.textSecondary }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: theme.textSecondary }}
                    tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? '#262626' : '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 border rounded-lg shadow-xl" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: theme.textPrimary, marginBottom: '4px' }}>{data.name}</p>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: data.display < 0 ? theme.error : theme.success }}>
                              {data.display < 0 ? '-' : ''}{fCurrency(Math.abs(data.display))}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" minPointSize={2}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.9} radius={[4, 4, 0, 0]} />
                    ))}
                    <LabelList 
                      dataKey="display" 
                      position="top" 
                      style={{ fontSize: '10px', fontWeight: '600', fill: theme.textSecondary }}
                      formatter={(val) => val === simulation.targetNetProfit || val === simulation.simulatedNetProfit ? '' : `${(val / 1000).toFixed(0)}k`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PRODUCT TABLE - DETAIL VIEW */}
          <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
             <table className="w-full text-left border-collapse">
                <thead style={{ backgroundColor: isDarkMode ? '#121212' : '#f8fafc' }}>
                   <tr>
                      <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: theme.textSecondary }}>PRODUCT CATEGORY</th>
                      <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: theme.textSecondary }}>BASE REVENUE</th>
                      <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: theme.textSecondary }}>SIMULATED PROFIT</th>
                      <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: theme.textSecondary }}>LEAKAGE</th>
                      <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: theme.textSecondary }}>MARGIN IMPACT</th>
                   </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: theme.border }}>
                   {simulation.productBreakdown.map((p, idx) => {
                     const original = PRODUCT_LINES.find(pl => pl.name === p.name);
                     const baseMargin = ((original.revenue - original.cogs) / original.revenue) * 100;
                     const simMargin = (p.profit / original.revenue) * 100;
                     const marginDelta = simMargin - baseMargin;

                     return (
                       <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>{p.name}</td>
                          <td className="px-6 py-4" style={{ fontSize: '14px', color: theme.textSecondary }}>{fCurrency(original.revenue)}</td>
                          <td className="px-6 py-4" style={{ fontSize: '14px', color: theme.textPrimary }}>{fCurrency(p.profit)}</td>
                          <td className="px-6 py-4" style={{ fontSize: '14px', color: theme.error }}>-{fCurrency(p.leak)}</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span style={{ fontSize: '14px', fontWeight: '600', color: theme.error }}>{marginDelta.toFixed(1)}%</span>
                                <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-red-400" style={{ width: `${Math.min(Math.abs(marginDelta) * 5, 100)}%` }}></div>
                                </div>
                             </div>
                          </td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>

        </main>
      </div>
    </div>
  );
}