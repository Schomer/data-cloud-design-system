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
  LabelList
} from 'recharts';
import { Menu, RefreshCcw, Info } from 'lucide-react';

/**
 * MACROECONOMIC HEADWIND SIMULATOR
 * 
 * An executive dashboard for stress-testing fiscal year revenue/profit
 * against inflation, tariffs, and interest rates.
 */

// --- MOCK DATA GENERATOR ---
const PRODUCT_LINES = [
  "Consumer Electronics", "Luxury Goods", "Industrial Equipment", 
  "Home Appliances", "Automotive Parts", "Smartphones", 
  "Cloud Services", "Textiles", "Furniture", "Pet Food", 
  "Pharmaceuticals", "Beauty & Care", "Beverages", "Office Supplies", "Hardware"
];

const generateBaseData = () => {
  return PRODUCT_LINES.map((line, index) => {
    const revenue = 5000000 + (Math.random() * 10000000);
    const margin = 0.15 + (Math.random() * 0.25); // 15% to 40%
    const cogs = revenue * (1 - margin);
    return {
      id: index,
      productLine: line,
      revenue,
      baseCogs: cogs,
      baseProfit: revenue - cogs,
    };
  });
};

const BASE_DATA = generateBaseData();

// --- THEME TOKENS (from visual_spec) ---
const THEME = {
  background: "#1a1a1a",
  cardBg: "#262626",
  border: "#1e293b",
  textPrimary: "#dbdbdb",
  textSecondary: "#94a3b8",
  accent: "#3b82f6",
  success: "#10b981",
  error: "#fb7185",
  chartPalette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9", "#ea75b0"]
};

export default function HeadwindSimulator() {
  const [inflation, setInflation] = useState(0);
  const [tariff, setTariff] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // --- SIMULATION LOGIC ---
  const simulation = useMemo(() => {
    let totalTargetProfit = 0;
    let totalSimulatedProfit = 0;

    const items = BASE_DATA.map(item => {
      totalTargetProfit += item.baseProfit;

      // Compound Erosion Formula:
      // 1. Inflation increases COGS
      // 2. Tariffs apply on top of inflated COGS
      // 3. Interest rate acts as a flat erosion on Revenue (cost of capital/financing)
      const simulatedCogs = item.baseCogs * (1 + (inflation / 100)) * (1 + (tariff / 100));
      const interestImpact = item.revenue * (interestRate / 100);
      const simulatedProfit = item.revenue - simulatedCogs - interestImpact;

      totalSimulatedProfit += simulatedProfit;

      return {
        ...item,
        simulatedProfit,
        leak: simulatedProfit - item.baseProfit
      };
    });

    // Formatting data for Waterfall Chart
    // We want to show "Target" -> Product 1 Leak -> Product 2 Leak ... -> "Simulated Result"
    let currentLevel = totalTargetProfit;
    const waterfallData = [
      { name: 'Target', start: 0, end: totalTargetProfit, isTotal: true }
    ];

    items.forEach(item => {
      const start = currentLevel;
      currentLevel += item.leak;
      waterfallData.push({
        name: item.productLine,
        start: currentLevel,
        end: start,
        value: item.leak
      });
    });

    waterfallData.push({ name: 'Simulated', start: 0, end: totalSimulatedProfit, isTotal: true });

    return {
      targetProfit: totalTargetProfit,
      simulatedProfit: totalSimulatedProfit,
      delta: totalSimulatedProfit - totalTargetProfit,
      waterfallData
    };
  }, [inflation, tariff, interestRate]);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col min-h-screen font-['Inter']" style={{ backgroundColor: THEME.background, color: THEME.textPrimary }}>

      {/* HEADER */}
      <header className="h-16 flex items-center justify-between px-6 border-b" style={{ borderColor: THEME.border, backgroundColor: THEME.background }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#262626] rounded-md transition-colors"
          >
            <Menu size={20} color={THEME.textPrimary} />
          </button>
          <h1 className="text-xl font-semibold tracking-tight uppercase" style={{ color: THEME.textPrimary }}>
            Macroeconomic Headwind Simulator
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest" style={{ color: THEME.textSecondary }}>Fiscal Year 2026 Simulation</span>
          <button 
            onClick={() => { setInflation(0); setTariff(0); setInterestRate(0); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all"
            style={{ backgroundColor: "#262626", color: THEME.accent }}
          >
            <RefreshCcw size={14} /> Reset Scenario
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR LEVERS */}
        <aside 
          className={`transition-all duration-300 border-r overflow-y-auto ${isSidebarOpen ? 'w-80' : 'w-0'}`}
          style={{ borderColor: THEME.border, backgroundColor: THEME.background }}
        >
          <div className="p-6 space-y-8 w-80">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color: THEME.textSecondary }}>
                Macro Levers <Info size={14} />
              </h3>

              {/* SLIDER: INFLATION */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium">Inflation Spike</label>
                  <span className="text-lg font-bold" style={{ color: THEME.accent }}>{inflation}%</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.5"
                  value={inflation}
                  onChange={(e) => setInflation(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[10px]" style={{ color: THEME.textSecondary }}>Impacts direct COGS (Labor, Raw Materials)</p>
              </div>

              {/* SLIDER: TARIFFS */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium">Supply Chain Tariff</label>
                  <span className="text-lg font-bold" style={{ color: THEME.accent }}>{tariff}%</span>
                </div>
                <input 
                  type="range" min="0" max="25" step="1"
                  value={tariff}
                  onChange={(e) => setTariff(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[10px]" style={{ color: THEME.textSecondary }}>Import duties and logistical penalties</p>
              </div>

              {/* SLIDER: INTEREST */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium">Interest Rate Hike</label>
                  <span className="text-lg font-bold" style={{ color: THEME.accent }}>{interestRate}%</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[10px]" style={{ color: THEME.textSecondary }}>Increase in cost of short-term financing</p>
              </div>
            </div>

            <div className="pt-6 border-t" style={{ borderColor: THEME.border }}>
              <div className="p-4 rounded-lg bg-[#262626] border" style={{ borderColor: THEME.border }}>
                <p className="text-xs italic leading-relaxed" style={{ color: THEME.textSecondary }}>
                  "Simulation assumes zero price elasticity. In high inflation scenarios, revenue may vary based on market pricing adjustments."
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CANVAS */}
        <main className="flex-1 p-8 overflow-y-auto">

          {/* KPI ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* TARGET */}
            <div className="p-6 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }}>
              <span className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: THEME.textSecondary }}>Target Net Profit</span>
              <span className="text-4xl font-bold tracking-tighter">{formatCurrency(simulation.targetProfit)}</span>
              <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: THEME.textSecondary }}>
                <div className="w-2 h-2 rounded-full bg-slate-500"></div> Baseline FY26
              </div>
            </div>

            {/* SIMULATED */}
            <div className="p-6 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }}>
              <span className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: THEME.textSecondary }}>Simulated Net Profit</span>
              <span className="text-4xl font-bold tracking-tighter" style={{ color: simulation.delta < 0 ? THEME.error : THEME.success }}>
                {formatCurrency(simulation.simulatedProfit)}
              </span>
              <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: THEME.textSecondary }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: THEME.accent }}></div> Scenario Result
              </div>
            </div>

            {/* DELTA */}
            <div className="p-6 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }}>
              <span className="text-[10px] uppercase font-bold tracking-widest mb-2" style={{ color: THEME.textSecondary }}>Delta ($ Variance)</span>
              <span className="text-4xl font-bold tracking-tighter" style={{ color: simulation.delta < 0 ? THEME.error : THEME.success }}>
                {simulation.delta > 0 ? '+' : ''}{formatCurrency(simulation.delta)}
              </span>
              <div className="mt-4 flex items-center gap-2 text-xs">
                 <span style={{ color: simulation.delta < 0 ? THEME.error : THEME.success }}>
                   {((simulation.delta / simulation.targetProfit) * 100).toFixed(1)}% erosion
                 </span>
              </div>
            </div>
          </div>

          {/* WATERFALL CHART */}
          <div className="p-8 rounded-xl border" style={{ backgroundColor: THEME.cardBg, borderColor: THEME.border }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold">Profit Erosion Analysis</h2>
                <p className="text-sm" style={{ color: THEME.textSecondary }}>Revenue leaks identified by product line (Waterfall)</p>
              </div>
              <div className="flex items-center gap-6 text-xs uppercase font-bold tracking-tighter">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-600"></div> Total</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3" style={{ backgroundColor: THEME.error }}></div> Leak</div>
              </div>
            </div>

            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simulation.waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: THEME.textSecondary, fontSize: 10 }} 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: THEME.textSecondary, fontSize: 11 }}
                    tickFormatter={(val) => `$${(val/1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 border rounded-lg shadow-xl" style={{ backgroundColor: THEME.background, borderColor: THEME.border }}>
                            <p className="text-xs font-bold uppercase mb-1">{data.name}</p>
                            {data.isTotal ? (
                              <p className="text-lg font-bold">{formatCurrency(data.end)}</p>
                            ) : (
                              <p className="text-lg font-bold" style={{ color: THEME.error }}>{formatCurrency(data.value)}</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* The "Waterfall" trick: Transparent Bar for offset */}
                  <Bar dataKey="start" stackId="a" fill="transparent" />
                  {/* The actual value bar */}
                  <Bar dataKey="end" stackId="a">
                    {simulation.waterfallData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isTotal ? '#475569' : THEME.error} 
                        fillOpacity={entry.isTotal ? 1 : 0.8}
                      />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      formatter={(v) => v ? `-$${(Math.abs(v)/1000).toFixed(0)}k` : ''}
                      style={{ fill: THEME.textSecondary, fontSize: 9, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="h-10 border-t flex items-center px-6 justify-between" style={{ borderColor: THEME.border, backgroundColor: THEME.background }}>
         <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest" style={{ color: THEME.textSecondary }}>
            <span>Model: StressTest-v4.2</span>
            <span>Data Latency: 0ms (Local Simulator)</span>
         </div>
         <div className="text-[10px] uppercase font-bold tracking-widest" style={{ color: THEME.accent }}>
            System Healthy • Simulation Ready
         </div>
      </footer>
    </div>
  );
}