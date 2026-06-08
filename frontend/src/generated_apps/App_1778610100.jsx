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
  Area,
  ComposedChart
} from 'recharts';
import { 
  Zap, 
  Thermometer, 
  Users, 
  TrendingUp, 
  Info, 
  Settings2,
  AlertTriangle,
  Calendar
} from 'lucide-react';

// --- MOCK DATA GENERATION ---
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Historical Baseline (Previous 12 Months)
const generateHistoricalData = () => {
  return Array.from({ length: 12 }, (_, i) => {
    // Basic seasonal curve for power: higher in Winter (Heating) and Summer (AC)
    // Base: 2500 MW, Variance: 800 MW
    const seasonalFactor = Math.cos((i - 6) * Math.PI / 6); // Peak at month 0 (Jan) and 12 (Dec)
    const consumption = 2500 + (Math.abs(seasonalFactor) * 800) + (Math.random() * 100);

    // Avg Temp curve (Northern Hemisphere)
    const temp = 15 - (Math.cos(i * Math.PI / 6) * 15) + (Math.random() * 2);

    return {
      monthIndex: i,
      monthLabel: `${MONTH_NAMES[i]} 2025`,
      consumption: parseFloat(consumption.toFixed(2)),
      temperature: parseFloat(temp.toFixed(1)),
      isForecast: false
    };
  });
};

const historicalLog = generateHistoricalData();

export default function EnergyGridForecastSimulator() {
  const [popGrowth, setPopGrowth] = useState(2.5); // %
  const [tempSpike, setTempSpike] = useState(0);    // Degrees
  const [activeTab, setActiveTab] = useState('overview');

  // --- SIMULATION LOGIC ---
  const combinedData = useMemo(() => {
    const forecast = Array.from({ length: 12 }, (_, i) => {
      const histMatch = historicalLog[i];

      // 1. Population Growth Effect
      const growthMultiplier = 1 + (popGrowth / 100);

      // 2. Temperature Spike Effect
      // Rule of thumb: Consumption increases ~3-5% for every degree away from 18°C (Ideal)
      const projectedTemp = histMatch.temperature + tempSpike;
      const tempDelta = Math.abs(projectedTemp - 18) - Math.abs(histMatch.temperature - 18);
      const tempEffectFactor = 1 + (tempDelta * 0.035); // 3.5% per degree delta change

      const forecastedConsumption = histMatch.consumption * growthMultiplier * tempEffectFactor;

      return {
        monthIndex: i + 12,
        monthLabel: `${MONTH_NAMES[i]} 2026`,
        consumption: parseFloat(forecastedConsumption.toFixed(2)),
        temperature: parseFloat(projectedTemp.toFixed(1)),
        isForecast: true
      };
    });

    return [...historicalLog, ...forecast];
  }, [popGrowth, tempSpike]);

  const stats = useMemo(() => {
    const histAvg = historicalLog.reduce((acc, curr) => acc + curr.consumption, 0) / 12;
    const foreAvg = combinedData.slice(12).reduce((acc, curr) => acc + curr.consumption, 0) / 12;
    const peak = Math.max(...combinedData.map(d => d.consumption));
    const growth = ((foreAvg - histAvg) / histAvg) * 100;

    return { histAvg, foreAvg, peak, growth };
  }, [combinedData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Energy Grid Forecast Simulator
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Calendar size={16} /> 24-Month Load Projection Dashboard
          </p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'details' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Analytics
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-blue-400 font-semibold uppercase text-xs tracking-wider">
              <Settings2 size={16} /> Simulator Controls
            </div>

            {/* Population Slider */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users size={16} className="text-slate-400" /> Population Growth
                </label>
                <span className="text-blue-400 font-mono font-bold bg-blue-400/10 px-2 py-1 rounded">
                  {popGrowth}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.1"
                value={popGrowth}
                onChange={(e) => setPopGrowth(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-[10px] text-slate-500 italic">Adjusts the base residential and commercial demand floor.</p>
            </div>

            {/* Temp Slider */}
            <div className="space-y-4 mb-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Thermometer size={16} className="text-slate-400" /> Expected Temp Spike
                </label>
                <span className={`font-mono font-bold bg-opacity-10 px-2 py-1 rounded ${tempSpike >= 0 ? 'text-orange-400 bg-orange-400' : 'text-cyan-400 bg-cyan-400'}`}>
                  {tempSpike > 0 ? '+' : ''}{tempSpike}°C
                </span>
              </div>
              <input 
                type="range" 
                min="-5" 
                max="5" 
                step="0.5"
                value={tempSpike}
                onChange={(e) => setTempSpike(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-[10px] text-slate-500 italic">Simulates seasonal deviation affecting heating/cooling loads.</p>
            </div>
          </div>

          {/* Quick Insights Card */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Info size={16} className="text-indigo-400" /> System Alerts
            </h3>
            {stats.growth > 10 ? (
              <div className="flex gap-3 text-sm text-orange-200 bg-orange-950/40 p-3 rounded-lg border border-orange-500/30">
                <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                <span>Forecasted demand exceeds current capacity by {Math.round(stats.growth)}%. Grid upgrade recommended.</span>
              </div>
            ) : (
              <div className="flex gap-3 text-sm text-emerald-200 bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                <Zap className="text-emerald-500 shrink-0" size={18} />
                <span>Grid load remains within nominal range for the next 12 months.</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="lg:col-span-3 space-y-6">

          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Avg Monthly Load</p>
                <p className="text-2xl font-bold">{Math.round(stats.foreAvg)} <span className="text-sm font-normal text-slate-500">MW</span></p>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Peak Load Target</p>
                <p className="text-2xl font-bold">{Math.round(stats.peak)} <span className="text-sm font-normal text-slate-500">MW</span></p>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <Thermometer size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Annual Var.</p>
                <p className={`text-2xl font-bold ${stats.growth > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {stats.growth > 0 ? '+' : ''}{stats.growth.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                City Consumption & Temperature Projection
              </h2>
              <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Consumption</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400 rounded-sm"></div> Temperature</span>
              </div>
            </div>

            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="monthLabel" 
                    stroke="#475569" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval={2}
                  />
                  <YAxis 
                    yId="left"
                    stroke="#475569" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 500', 'dataMax + 500']}
                    label={{ value: 'Megawatts (MW)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }}
                  />
                  <YAxis 
                    yId="right"
                    orientation="right"
                    stroke="#475569" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Temp (°C)', angle: 90, position: 'insideRight', fill: '#475569', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f1f5f9' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />

                  {/* Forecast Shading */}
                  <ReferenceLine x="Dec 2025" stroke="#475569" strokeDasharray="5 5" label={{ position: 'top', value: 'FORECAST START', fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />

                  {/* Temperature Lines */}
                  <Line 
                    yId="right"
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#fb923c" 
                    strokeWidth={2}
                    dot={false}
                    name="Avg Temperature"
                  />

                  {/* Consumption Area/Lines */}
                  <Area 
                    yId="left"
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorCons)" 
                    strokeWidth={3}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (!payload.isForecast) return <circle cx={cx} cy={cy} r={3} fill="#3b82f6" stroke="none" />;
                      return null;
                    }}
                    strokeDasharray={(props) => props.isForecast ? "5 5" : "0"}
                    name="Power Consumption"
                  />

                  {/* Forecast Specific Line with dashed style */}
                  <Line
                    yId="left"
                    type="monotone"
                    dataKey={(v) => v.isForecast ? v.consumption : null}
                    stroke="#3b82f6"
                    strokeWidth={3}
                    strokeDasharray="8 4"
                    dot={false}
                    activeDot={false}
                    name="Projected Forecast"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Details Table */}
          {activeTab === 'details' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold">Raw Simulation Log (200 Node Extension)</h3>
                <span className="text-xs text-slate-500">Total Rows Generated: 24 (Displaying Main Period)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Period</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Consumption (MW)</th>
                      <th className="px-6 py-4">Avg Temp (°C)</th>
                      <th className="px-6 py-4">Load Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {combinedData.map((row, idx) => (
                      <tr key={idx} className={`${row.isForecast ? 'bg-blue-900/10' : ''} hover:bg-slate-800/50 transition-colors`}>
                        <td className="px-6 py-3 font-mono text-slate-300">{row.monthLabel}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.isForecast ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'}`}>
                            {row.isForecast ? 'PROJECTED' : 'HISTORICAL'}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-bold text-slate-100">{row.consumption.toLocaleString()}</td>
                        <td className="px-6 py-3 text-slate-400">{row.temperature}°C</td>
                        <td className="px-6 py-3">
                          {row.isForecast ? (
                            <span className="text-orange-400 flex items-center gap-1">
                              <TrendingUp size={12} /> 
                              {(((row.consumption - historicalLog[idx-12].consumption) / historicalLog[idx-12].consumption) * 100).toFixed(1)}%
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}