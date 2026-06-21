import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Sparkles, 
  Trash2, 
  Moon, 
  Sun, 
  TrendingUp, 
  Target, 
  History,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function MetricTallyDashboard() {
  // Theme state (Strict token mapping applied dynamically)
  const [theme, setTheme] = useState('dark');

  // Counter States
  const [count, setCount] = useState(10);
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState(100);
  
  // History State for Chart and Table
  const [history, setHistory] = useState([
    { id: 1, timestamp: '12:00:00 PM', action: 'Initialization', delta: 0, value: 10 }
  ]);

  // Helper to log actions
  const logAction = (actionName, delta, newValue) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    setHistory(prev => [
      {
        id: Date.now(),
        timestamp: timeStr,
        action: actionName,
        delta: delta,
        value: newValue
      },
      ...prev
    ]);
  };

  // Core Counter Handlers
  const handleIncrement = () => {
    const nextVal = count + step;
    setCount(nextVal);
    logAction('Increment', step, nextVal);
  };

  const handleDecrement = () => {
    const nextVal = count - step;
    setCount(nextVal);
    logAction('Decrement', -step, nextVal);
  };

  const handleReset = () => {
    setCount(0);
    logAction('Reset', -count, 0);
  };

  const handleRandomBoost = () => {
    const boost = Math.floor(Math.random() * 15) + 5;
    const nextVal = count + boost;
    setCount(nextVal);
    logAction('Boost Tally', boost, nextVal);
  };

  const handleClearLogs = () => {
    setHistory([{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), action: 'Logs Cleared', delta: 0, value: count }]);
  };

  // Derived Metrics
  const progressPercent = useMemo(() => {
    if (target <= 0) return 0;
    const percent = (count / target) * 100;
    return Math.min(Math.max(Math.round(percent), 0), 100);
  }, [count, target]);

  const stats = useMemo(() => {
    const increments = history.filter(h => h.delta > 0).length;
    const decrements = history.filter(h => h.delta < 0).length;
    const totalActions = history.length;
    return { increments, decrements, totalActions };
  }, [history]);

  // Recharts chart data (reverse history to show chronological order)
  const chartData = useMemo(() => {
    return [...history].reverse().map((h, index) => ({
      stepNum: index + 1,
      value: h.value,
      timestamp: h.timestamp
    }));
  }, [history]);

  // Theme-based style variables mapped directly to design tokens
  const isDark = theme === 'dark';
  
  const colors = {
    bgPrimary: isDark ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]',
    bgSecondary: isDark ? 'bg-[#1e293b]' : 'bg-[#e2e8f0]',
    textPrimary: isDark ? 'text-[#dbdbdb]' : 'text-[#5c5c5c]',
    textSecondary: isDark ? 'text-[#cbd5e1]' : 'text-[#475569]',
    borderColor: isDark ? 'border-[#1e293b]' : 'border-[#e2e8f0]',
    cardBg: isDark ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]',
    cardBorder: isDark ? 'border-[#1e293b]' : 'border-[#e2e8f0]',
    
    // Component specific buttons
    btnPrimaryBg: isDark ? 'bg-[#5aa1d8] hover:bg-[#3875a3]' : 'bg-[#598dc5] hover:bg-[#054aa3]',
    btnPrimaryText: isDark ? 'text-[#000000]' : 'text-[#ffffff]',
    
    btnSecondaryBg: isDark ? 'bg-[#292929] hover:bg-[#122940] text-[#a0a7b0]' : 'bg-[#ffffff] hover:bg-[#f8fafc] text-[#598dc5]',
    btnSecondaryBorder: isDark ? 'border-[#1e293b]' : 'border-[#e2e8f0]',
    
    btnDestructiveBg: isDark ? 'bg-[#25a77c] hover:bg-[#610f24] text-[#cfcfcf]' : 'bg-[#ea7676] hover:bg-[#a91439] text-[#ffffff]',
    
    // Input
    inputBg: isDark ? 'bg-[#121212]' : 'bg-[#ffffff]',
    inputBorder: isDark ? 'border-[#1e293b]' : 'border-[#e2e8f0]',
    inputTextColor: isDark ? 'text-[#f8fafc]' : 'text-[#0f172a]'
  };

  return (
    <div className={`min-h-screen ${colors.bgPrimary} ${colors.textPrimary} transition-colors duration-200 font-sans p-6`}>
      
      {/* HEADER SECTION */}
      <header className={`w-full max-w-7xl mx-auto mb-8 pb-4 border-b ${colors.borderColor} flex justify-between items-center`}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: '600', letterSpacing: '-0.025em' }} className="flex items-center gap-2">
            Metric Tally & Event Simulator
          </h1>
          <p style={{ fontSize: '14px', fontWeight: '400' }} className={colors.textSecondary}>
            An interactive counter application with goal tracking, historical trends, and real-time audit logs.
          </p>
        </div>
        
        {/* Theme Switcher Button */}
        <button 
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`p-2.5 rounded-lg border ${colors.btnSecondaryBorder} ${colors.btnSecondaryBg} transition-all duration-150`}
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </header>

      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CONTROLLER & KPI CARDS (7 COLS) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* MAIN COUNTER INTERFACE CARD */}
          <div className={`p-6 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#64748b] dark:text-[#94a3b8]">
                PRIMARY TALLY CONTROLLER
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                  Active Simulator
                </span>
              </div>
            </div>

            {/* The Huge Counter Display */}
            <div className="flex flex-col items-center justify-center py-8 bg-[#f8fafc]/50 dark:bg-[#121212]/30 rounded-xl border border-dashed border-[#e2e8f0] dark:border-[#1e293b] mb-6">
              <span className="text-xs text-[#94a3b8] uppercase tracking-widest font-mono mb-1">Current Value</span>
              <span className="text-7xl font-extrabold tracking-tight tabular-nums text-[#598dc5] dark:text-[#5aa1d8]">
                {count}
              </span>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-[#64748b] dark:text-[#94a3b8]">Velocity:</span>
                <span className="text-xs font-mono font-bold bg-[#e2e8f0] dark:bg-[#1e293b] px-2 py-0.5 rounded">
                  {step > 0 ? `+${step}` : step} / click
                </span>
              </div>
            </div>

            {/* Core Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <button
                onClick={handleDecrement}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${colors.btnSecondaryBg} border ${colors.btnSecondaryBorder}`}
              >
                <Minus className="w-4 h-4" />
                <span>Sub {step}</span>
              </button>

              <button
                onClick={handleIncrement}
                className={`col-span-1 sm:col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${colors.btnPrimaryBg} ${colors.btnPrimaryText}`}
              >
                <Plus className="w-5 h-5" />
                <span>Add {step}</span>
              </button>

              <button
                onClick={handleReset}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all text-[#ea7676] dark:text-[#25a77c] border border-red-500/20 dark:border-emerald-500/20 bg-red-500/5 dark:bg-emerald-500/5 hover:bg-red-500/10 dark:hover:bg-emerald-500/10`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Advanced Multipliers & Boosters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#e2e8f0] dark:border-[#1e293b]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setStep(1); logAction('Config: Step = 1', 0, count); }}
                  className={`px-3 py-1 text-xs rounded border ${step === 1 ? 'bg-[#598dc5] text-white border-[#598dc5]' : `${colors.btnSecondaryBg} ${colors.btnSecondaryBorder}`}`}
                >
                  Step 1
                </button>
                <button
                  onClick={() => { setStep(5); logAction('Config: Step = 5', 0, count); }}
                  className={`px-3 py-1 text-xs rounded border ${step === 5 ? 'bg-[#598dc5] text-white border-[#598dc5]' : `${colors.btnSecondaryBg} ${colors.btnSecondaryBorder}`}`}
                >
                  Step 5
                </button>
                <button
                  onClick={() => { setStep(10); logAction('Config: Step = 10', 0, count); }}
                  className={`px-3 py-1 text-xs rounded border ${step === 10 ? 'bg-[#598dc5] text-white border-[#598dc5]' : `${colors.btnSecondaryBg} ${colors.btnSecondaryBorder}`}`}
                >
                  Step 10
                </button>
              </div>

              <button
                onClick={handleRandomBoost}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Random Boost (+5 to +20)</span>
              </button>
            </div>

          </div>

          {/* TARGET GOAL PROGRESS CARD */}
          <div className={`p-6 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold tracking-wider uppercase text-[#64748b] dark:text-[#94a3b8]">
                  Target Optimization Goal
                </span>
              </div>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {progressPercent}% Met
              </span>
            </div>

            {/* Target Settings */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">Interactive Step Size</label>
                <input
                  type="number"
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                  className={`w-full px-3 py-1.5 text-sm rounded border ${colors.inputBg} ${colors.inputBorder} ${colors.inputTextColor} focus:outline-none focus:ring-1 focus:ring-[#3b82f6]`}
                />
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">Target Threshold Goal</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className={`w-full px-3 py-1.5 text-sm rounded border ${colors.inputBg} ${colors.inputBorder} ${colors.inputTextColor} focus:outline-none focus:ring-1 focus:ring-[#3b82f6]`}
                />
              </div>
            </div>

            {/* Progress Bar (Legitimate progress calculation based on dynamic target) */}
            <div className="w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full h-3 overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#94a3b8] mt-1.5 font-mono">
              <span>0</span>
              <span>Current Status: {count} / {target}</span>
              <span>{target}</span>
            </div>
          </div>

          {/* KPI METRIC CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} flex items-center justify-between`}>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] block">Total Operations</span>
                <span className="text-2xl font-bold font-mono text-[#5c5c5c] dark:text-[#dbdbdb]">{stats.totalActions}</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <History className="w-5 h-5" />
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} flex items-center justify-between`}>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] block">Increments</span>
                <span className="text-2xl font-bold font-mono text-emerald-500">{stats.increments}</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${colors.cardBorder} ${colors.cardBg} flex items-center justify-between`}>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] block">Decrements</span>
                <span className="text-2xl font-bold font-mono text-rose-500">{stats.decrements}</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>

          </div>

        </section>

        {/* RIGHT COLUMN: VISUALIZATION & AUDIT LOGS (5 COLS) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* RECHARTS AREA CHART */}
          <div className={`p-6 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#598dc5]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#64748b] dark:text-[#94a3b8]">
                Tally Value Trend Line
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#598dc5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#598dc5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#f1f5f9'} />
                  <XAxis dataKey="stepNum" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1a1a1a' : '#ffffff', 
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      color: isDark ? '#dbdbdb' : '#5c5c5c',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#598dc5" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-[11px] text-[#94a3b8] mt-2 italic">
              Tracking sequence of state variations over timeline steps
            </div>
          </div>

          {/* AUDIT LOG TABLE */}
          <div className={`p-6 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm flex-1 flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#64748b] dark:text-[#94a3b8]">
                Event Audit Log
              </span>
              <button
                onClick={handleClearLogs}
                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 bg-rose-500/5 px-2.5 py-1 rounded border border-rose-500/10 transition-all"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Logs</span>
              </button>
            </div>

            {/* Table Container */}
            <div className="overflow-y-auto max-h-64 border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-[#121212]/50 border-b border-[#e2e8f0] dark:border-[#1e293b]">
                    <th className="p-2.5 text-xs font-semibold text-[#64748b] dark:text-[#94a3b8]">Time</th>
                    <th className="p-2.5 text-xs font-semibold text-[#64748b] dark:text-[#94a3b8]">Action</th>
                    <th className="p-2.5 text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] text-right">Delta</th>
                    <th className="p-2.5 text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr 
                      key={h.id} 
                      className="border-b border-[#f1f5f9] dark:border-[#262626] hover:bg-[#f8fafc]/40 dark:hover:bg-[#121212]/20 transition-colors"
                    >
                      <td className="p-2.5 text-xs font-mono text-[#94a3b8]">{h.timestamp}</td>
                      <td className="p-2.5 text-xs font-medium">{h.action}</td>
                      <td className={`p-2.5 text-xs font-mono font-bold text-right ${h.delta > 0 ? 'text-emerald-500' : h.delta < 0 ? 'text-rose-500' : 'text-[#94a3b8]'}`}>
                        {h.delta > 0 ? `+${h.delta}` : h.delta}
                      </td>
                      <td className="p-2.5 text-xs font-mono font-bold text-right">{h.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto mt-12 pt-6 border-t border-[#e2e8f0] dark:border-[#1e293b] text-center">
        <p className="text-xs text-[#94a3b8]">
          Data Cloud Sandbox Environment • Metric Tally Engine v1.4.0
        </p>
      </footer>

    </div>
  );
}