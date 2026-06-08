import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';

/**
 * EnergyGridForecastSimulator
 * A simulation-driven dashboard for city power consumption forecasting.
 */
export default function EnergyGridForecastSimulator() {
  // --- Simulation State ---
  const [popGrowth, setPopGrowth] = useState(2.5); // 0% to 5%
  const [tempSpike, setTempSpike] = useState(0);    // -5 to +5 degrees

  // --- Design Tokens (from visual_spec.skill.md) ---
  const theme = {
    dark: {
      bgPrimary: "#1a1a1a",
      bgSecondary: "#1e293b",
      textPrimary: "#dbdbdb",
      textSecondary: "#cbd5e1",
      border: "#1e293b",
      chartPalette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
      kpiValue: "#3b82f6",
      headerText: "#94a3b8"
    },
    typography: {
      h2: { fontSize: '30px', fontWeight: '600', color: '#dbdbdb' },
      h4: { fontSize: '20px', fontWeight: '500', color: '#dbdbdb' },
      h6: { fontSize: '14px', fontWeight: '600', color: '#7e8ea5', textTransform: 'uppercase' },
      p: { fontSize: '16px', fontWeight: '400', color: '#cbd5e1' },
      small: { fontSize: '12px', fontWeight: '400', color: '#94a3b8' }
    }
  };

  // --- Mock Data Generation ---
  // 12 Months Historical + 12 Months Forecast
  const data = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const results = [];
    const baseConsumption = 6500; // MW base
    const seasonality = [1.2, 1.1, 0.9, 0.8, 0.9, 1.3, 1.5, 1.4, 1.1, 0.9, 1.0, 1.2];
    const baseTemp = [2, 5, 12, 18, 24, 28, 32, 31, 25, 18, 10, 4];

    // Historical (Year 1)
    for (let i = 0; i < 12; i++) {
      results.push({
        month: `${months[i]} 2025`,
        type: 'Historical',
        consumption: Math.round(baseConsumption * seasonality[i] + Math.random() * 200),
        temp: baseTemp[i],
        isForecast: false
      });
    }

    // Forecast (Year 2)
    for (let i = 0; i < 12; i++) {
      const monthIdx = i % 12;
      // Population impact (compounding monthly)
      const popMultiplier = Math.pow(1 + (popGrowth / 100), (i + 1) / 12);
      // Temperature impact: assume 3% increase per degree spike (AC/Heating)
      const tempMultiplier = 1 + (Math.abs(tempSpike) * 0.035);

      const forecastConsumption = Math.round(
        baseConsumption * seasonality[monthIdx] * popMultiplier * tempMultiplier
      );

      results.push({
        month: `${months[monthIdx]} 2026`,
        type: 'Projected',
        consumption: forecastConsumption,
        temp: baseTemp[monthIdx] + tempSpike,
        isForecast: true
      });
    }

    return results;
  }, [popGrowth, tempSpike]);

  // --- KPI Calculations ---
  const currentTotal = data.slice(0, 12).reduce((acc, curr) => acc + curr.consumption, 0);
  const forecastTotal = data.slice(12).reduce((acc, curr) => acc + curr.consumption, 0);
  const percentChange = ((forecastTotal - currentTotal) / currentTotal * 100).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif]" style={{ backgroundColor: theme.dark.bgPrimary, color: theme.dark.textPrimary }}>

      {/* --- Top Navigation / Header --- */}
      <header className="w-full px-8 py-6 border-b" style={{ borderColor: theme.dark.border }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 style={theme.typography.h2}>Energy Grid Forecast Simulator</h1>
            <p style={theme.typography.small} className="mt-1">City Planning & Resource Allocation Hub</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full border text-[12px]" style={{ borderColor: theme.dark.border, color: theme.dark.textSecondary }}>
              Region: Metropolitan Area A
            </div>
            <div className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer hover:bg-[#1e293b]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-8 overflow-y-auto">

        {/* --- Top Row: Simulation Controls & KPIs --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

          {/* Controls Panel */}
          <div className="lg:col-span-4 p-6 rounded-xl border" style={{ backgroundColor: theme.dark.bgSecondary, borderColor: theme.dark.border }}>
            <h6 style={theme.typography.h6} className="mb-6">Simulation Parameters</h6>

            {/* Slider 1: Population */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label style={theme.typography.p}>Population Growth Rate</label>
                <span className="font-bold" style={{ color: theme.dark.kpiValue }}>{popGrowth}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.1" 
                value={popGrowth}
                onChange={(e) => setPopGrowth(parseFloat(e.target.value))}
                className="w-full h-2 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#5aa1d8]"
              />
              <div className="flex justify-between mt-1" style={theme.typography.small}>
                <span>0%</span>
                <span>5%</span>
              </div>
            </div>

            {/* Slider 2: Temp Spike */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <label style={theme.typography.p}>Expected Temp Spike</label>
                <span className="font-bold" style={{ color: theme.dark.kpiValue }}>{tempSpike > 0 ? `+${tempSpike}` : tempSpike}°C</span>
              </div>
              <input 
                type="range" 
                min="-5" 
                max="5" 
                step="1" 
                value={tempSpike}
                onChange={(e) => setTempSpike(parseInt(e.target.value))}
                className="w-full h-2 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#a8d95e]"
              />
              <div className="flex justify-between mt-1" style={theme.typography.small}>
                <span>-5°C</span>
                <span>+5°C</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl border flex flex-col justify-center" style={{ backgroundColor: theme.dark.bgSecondary, borderColor: theme.dark.border }}>
              <h6 style={theme.typography.h6} className="mb-2">Historical Total (MW)</h6>
              <div style={theme.typography.h2} className="text-[#cbd5e1]">{currentTotal.toLocaleString()}</div>
              <p style={theme.typography.small} className="mt-2 italic">Last 12 Month Actuals</p>
            </div>

            <div className="p-6 rounded-xl border flex flex-col justify-center" style={{ backgroundColor: theme.dark.bgSecondary, borderColor: theme.dark.border }}>
              <h6 style={theme.typography.h6} className="mb-2">Projected Total (MW)</h6>
              <div style={theme.typography.h2} className="text-[#3b82f6]">{forecastTotal.toLocaleString()}</div>
              <p style={theme.typography.small} className="mt-2 flex items-center gap-1">
                <span style={{ color: percentChange > 0 ? '#ef4444' : '#10b981' }}>
                  {percentChange > 0 ? '▲' : '▼'} {Math.abs(percentChange)}% 
                </span>
                from baseline
              </p>
            </div>

            <div className="p-6 rounded-xl border flex flex-col justify-center" style={{ backgroundColor: theme.dark.bgSecondary, borderColor: theme.dark.border }}>
              <h6 style={theme.typography.h6} className="mb-2">Peak Load Risk</h6>
              <div style={theme.typography.h2} className={forecastTotal > 95000 ? 'text-[#ef4444]' : 'text-[#a8d95e]'}>
                {forecastTotal > 100000 ? 'CRITICAL' : forecastTotal > 90000 ? 'HIGH' : 'STABLE'}
              </div>
              <div className="w-full h-1.5 bg-[#262626] rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min((forecastTotal / 120000) * 100, 100)}%`,
                    backgroundColor: forecastTotal > 90000 ? '#ef4444' : '#a8d95e'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Main Chart: Energy Forecast --- */}
        <div className="w-full p-6 rounded-xl border mb-8" style={{ backgroundColor: theme.dark.bgSecondary, borderColor: theme.dark.border }}>
          <div className="flex justify-between items-center mb-8">
            <h4 style={theme.typography.h4}>24-Month Consumption Forecast (MW)</h4>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#62a8ea]" />
                 <span style={theme.typography.small}>Historical</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full border border-dashed border-[#62a8ea]" />
                 <span style={theme.typography.small}>Projected</span>
               </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a8d95e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a8d95e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickMargin={10}
                  interval={2}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  domain={['dataMin - 1000', 'dataMax + 1000']}
                  label={{ value: 'Megawatts (MW)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 12 } }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <ReferenceLine x="Dec 2025" stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'top', value: 'Today', fill: '#ef4444', fontSize: 12 }} />

                <Area 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#62a8ea" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorHist)" 
                  dot={false}
                  activeDot={{ r: 6 }}
                  name="Consumption (MW)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Bottom Row: Data Detail Table --- */}
        <div className="w-full rounded-xl border overflow-hidden" style={{ backgroundColor: theme.dark.bgSecondary, borderColor: theme.dark.border }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: theme.dark.border }}>
            <h6 style={theme.typography.h6}>Monthly Log Detail</h6>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[#1e293b] z-10">
                <tr className="border-b" style={{ borderColor: theme.dark.border }}>
                  <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: theme.dark.headerText }}>Month</th>
                  <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: theme.dark.headerText }}>Type</th>
                  <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: theme.dark.headerText }}>Power Consumption (MW)</th>
                  <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: theme.dark.headerText }}>Avg Temperature (°C)</th>
                  <th className="px-6 py-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: theme.dark.headerText }}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: theme.dark.border }}>
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#262626] transition-colors">
                    <td className="px-6 py-4 text-[14px]" style={{ color: theme.dark.textPrimary }}>{row.month}</td>
                    <td className="px-6 py-4 text-[14px]">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.isForecast ? 'bg-[#1e3a8a] text-[#bfdbfe]' : 'bg-[#262626] text-[#94a3b8]'}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] font-mono" style={{ color: theme.dark.textSecondary }}>{row.consumption.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[14px]" style={{ color: theme.dark.textSecondary }}>{row.temp}°C</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${row.consumption > 9000 ? 'bg-[#ef4444]' : 'bg-[#10b981]'}`} />
                        <span style={theme.typography.small}>{row.consumption > 9000 ? 'High Demand' : 'Optimal'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <footer className="px-8 py-4 border-t flex justify-between items-center" style={{ borderColor: theme.dark.border, backgroundColor: theme.dark.bgSecondary }}>
         <span style={theme.typography.small}>System Status: Operational</span>
         <div className="flex gap-6">
            <button className="text-[12px] hover:text-[#3b82f6] transition-colors" style={{ color: theme.dark.textSecondary }}>Export CSV</button>
            <button className="text-[12px] hover:text-[#3b82f6] transition-colors" style={{ color: theme.dark.textSecondary }}>API Documentation</button>
         </div>
      </footer>
    </div>
  );
}