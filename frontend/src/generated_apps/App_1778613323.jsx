import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Menu, 
  X, 
  Save, 
  Flag, 
  Filter, 
  MessageSquare, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

/**
 * QBR SALES PLANNER
 * A data application for annotating sales performance against targets.
 */

// --- DATA GENERATION ---
const ACCOUNT_MANAGERS = ['Alex Rivera', 'Jordan Smith', 'Taylor Wong', 'Casey Jones', 'Morgan Lee'];
const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const generateSalesData = () => {
  return Array.from({ length: 200 }, (_, i) => {
    const manager = ACCOUNT_MANAGERS[i % ACCOUNT_MANAGERS.length];
    const quarter = QUARTERS[Math.floor(i / 5) % 4];
    const region = REGIONS[i % REGIONS.length];
    const target = Math.floor(Math.random() * 500000) + 200000;
    const actual = Math.floor(target * (0.7 + Math.random() * 0.6)); // 70% to 130% of target
    return {
      id: `row-${i}`,
      manager,
      quarter,
      region,
      target,
      actual,
      variance: actual - target,
      attainment: (actual / target) * 100
    };
  });
};

const RAW_DATA = generateSalesData();

export default function QBRSalesPlanner() {
  // --- STATE ---
  const [data, setData] = useState(RAW_DATA);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [annotations, setAnnotations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [importance, setImportance] = useState('Medium');

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    if (selectedRegion === 'All Regions') return data;
    return data.filter(d => d.region === selectedRegion);
  }, [data, selectedRegion]);

  const aggregatedData = useMemo(() => {
    const map = {};
    filteredData.forEach(d => {
      if (!map[d.manager]) {
        map[d.manager] = { manager: d.manager, target: 0, actual: 0 };
      }
      map[d.manager].target += d.target;
      map[d.manager].actual += d.actual;
    });
    return Object.values(map);
  }, [filteredData]);

  const kpis = useMemo(() => {
    const totalTarget = aggregatedData.reduce((acc, curr) => acc + curr.target, 0);
    const totalActual = aggregatedData.reduce((acc, curr) => acc + curr.actual, 0);
    return {
      totalTarget,
      totalActual,
      gap: totalTarget - totalActual,
      attainment: (totalActual / totalTarget) * 100
    };
  }, [aggregatedData]);

  // --- ACTIONS ---
  const openAnnotation = (item) => {
    setActiveItem(item);
    // Find existing note if any
    const existing = annotations.find(a => 
      a.manager === item.manager && (item.quarter ? a.quarter === item.quarter : true)
    );
    setNoteInput(existing ? existing.note : '');
    setImportance(existing ? existing.importance : 'Medium');
    setIsModalOpen(true);
  };

  const saveAnnotation = () => {
    if (!noteInput.trim()) return;

    const newAnnotation = {
      id: Date.now(),
      manager: activeItem.manager,
      quarter: activeItem.quarter || 'Annual',
      note: noteInput,
      importance,
      timestamp: new Date().toLocaleTimeString(),
      region: activeItem.region || selectedRegion
    };

    setAnnotations(prev => [newAnnotation, ...prev]);
    setIsModalOpen(false);
    setNoteInput('');
  };

  const importanceColors = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#10b981'
  };

  // --- THEME TOKENS ---
  const lightTheme = {
    bg: '#ffffff',
    bgSecondary: '#e2e8f0',
    border: '#e2e8f0',
    textPrimary: '#5c5c5c',
    textSecondary: '#475569',
    accent: '#598dc5',
    chart: ['#62a8ea', '#aaa47c']
  };

  const darkTheme = {
    bg: '#1a1a1a',
    bgSecondary: '#1e293b',
    border: '#1e293b',
    textPrimary: '#dbdbdb',
    textSecondary: '#cbd5e1',
    accent: '#5aa1d8',
    chart: ['#62a8ea', '#aaa47c']
  };

  return (
    <div className="min-h-screen font-['Inter'] bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col transition-colors duration-200">

      {/* HEADER SECTION */}
      <header className="h-[70px] border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-6 bg-[#ffffff] dark:bg-[#1a1a1a] z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#f1f5f9] dark:hover:bg-[#262626] rounded-md transition-colors"
          >
            <Menu size={20} className="text-[#5c5c5c] dark:text-[#dbdbdb]" />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
            QBR Sales Planner
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#f1f5f9] dark:bg-[#262626] px-3 py-1.5 rounded-lg border border-[#e2e8f0] dark:border-[#1e293b]">
            <Filter size={14} className="text-[#64748b]" />
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-none text-[14px] text-[#475569] dark:text-[#cbd5e1] focus:ring-0 cursor-pointer"
            >
              <option value="All Regions">All Regions</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* MAIN CANVAS */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Target', value: `$${(kpis.totalTarget / 1000000).toFixed(1)}M`, color: '#64748b' },
              { label: 'Total Actual', value: `$${(kpis.totalActual / 1000000).toFixed(1)}M`, color: '#62a8ea' },
              { label: 'Quota Attainment', value: `${kpis.attainment.toFixed(1)}%`, color: kpis.attainment >= 100 ? '#10b981' : '#ef4444' },
              { label: 'Plan Variance', value: `$${(kpis.gap / 1000).toFixed(0)}K`, color: '#f59e0b' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] p-5 rounded-xl shadow-sm">
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {kpi.label}
                </span>
                <div style={{ fontSize: '30px', fontWeight: '600', color: kpi.color }} className="mt-1">
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* CLUSTERED BAR CHART */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                Performance by Account Manager
              </h3>
              <span className="text-[12px] text-[#94a3b8] italic">Click bars to annotate</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="manager" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="target" 
                  name="Target" 
                  fill="#62a8ea" 
                  radius={[4, 4, 0, 0]} 
                  onClick={(data) => openAnnotation(data)}
                  style={{ cursor: 'pointer' }}
                />
                <Bar 
                  dataKey="actual" 
                  name="Actual" 
                  fill="#aaa47c" 
                  radius={[4, 4, 0, 0]} 
                  onClick={(data) => openAnnotation(data)}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* DATA TABLE */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#e2e8f0] dark:border-[#1e293b] flex justify-between items-center bg-[#f8fafc] dark:bg-[#1e293b]/50">
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                Detailed Regional Breakdown
              </h4>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="sticky top-0 bg-[#ffffff] dark:bg-[#1a1a1a] border-b border-[#e2e8f0] dark:border-[#1e293b]">
                    {['Account Manager', 'Quarter', 'Region', 'Target', 'Actual', 'Attainment', ''].map((h, i) => (
                      <th key={i} className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: '#457bba', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                  {filteredData.map((row, idx) => (
                    <tr key={idx} className="group hover:bg-[#f8fafc] dark:hover:bg-[#262626] transition-colors">
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#657281' }} className="dark:text-[#cbd5e1]">{row.manager}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#657281' }} className="dark:text-[#cbd5e1]">{row.quarter}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#657281' }} className="dark:text-[#cbd5e1]">{row.region}</td>
                      <td className="px-6 py-4 font-mono" style={{ fontSize: '13px', color: '#657281' }} className="dark:text-[#cbd5e1]">${row.target.toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono" style={{ fontSize: '13px', color: '#657281' }} className="dark:text-[#cbd5e1]">${row.actual.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${row.attainment >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {row.attainment.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openAnnotation(row)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#e2e8f0] dark:hover:bg-[#1e293b] rounded-md transition-all"
                        >
                          <MessageSquare size={16} className="text-[#598dc5]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* CONTEXT LOG SIDEBAR */}
        <aside 
          className={`transition-all duration-300 border-l border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col ${isSidebarOpen ? 'w-[350px]' : 'w-0 overflow-hidden'}`}
        >
          <div className="p-5 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between">
            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
              Context Log
            </h5>
            <span className="bg-[#598dc5] text-white text-[10px] px-2 py-0.5 rounded-full">
              {annotations.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {annotations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <AlertCircle size={40} className="mb-2 text-[#94a3b8]" />
                <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#94a3b8' }}>
                  No planning context added yet. Click on charts or rows to annotate.
                </p>
              </div>
            ) : (
              annotations.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl border border-[#e2e8f0] dark:border-[#1e293b] bg-[#f8fafc] dark:bg-[#262626] space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                        {ann.manager}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {ann.quarter} • {ann.region}
                      </span>
                    </div>
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: importanceColors[ann.importance] }}
                      title={`${ann.importance} Importance`}
                    />
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }} className="dark:text-[#cbd5e1]">
                    "{ann.note}"
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-[#e2e8f0] dark:border-[#1e293b]/50">
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>{ann.timestamp}</span>
                    <ChevronRight size={12} className="text-[#94a3b8]" />
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* ANNOTATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] w-full max-w-md rounded-2xl shadow-2xl border border-[#e2e8f0] dark:border-[#1e293b] overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between bg-[#f8fafc] dark:bg-[#1e293b]">
              <div className="flex flex-col">
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }} className="dark:text-[#f8fafc]">
                  Add Performance Context
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  {activeItem?.manager} — {activeItem?.quarter || 'Annual'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#64748b] hover:text-[#0f172a] dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748b] uppercase mb-2">Note Content</label>
                <textarea 
                  autoFocus
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="e.g., Supply chain disruption delayed closing..."
                  className="w-full h-32 p-4 bg-[#f8fafc] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl text-[14px] focus:ring-2 focus:ring-[#598dc5] focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#64748b] uppercase mb-2">Importance Flag</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setImportance(level)}
                      className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-medium border transition-all flex items-center justify-center gap-2 ${
                        importance === level 
                          ? 'bg-[#598dc5] border-[#598dc5] text-white shadow-md' 
                          : 'bg-[#ffffff] dark:bg-[#262626] border-[#e2e8f0] dark:border-[#1e293b] text-[#64748b] hover:border-[#598dc5]'
                      }`}
                    >
                      <Flag size={14} style={{ color: importance === level ? 'white' : importanceColors[level] }} />
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f8fafc] dark:bg-[#121212] border-t border-[#e2e8f0] dark:border-[#1e293b] flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[14px] font-medium text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveAnnotation}
                className="flex-1 py-2.5 bg-[#598dc5] hover:bg-[#054aa3] rounded-xl text-[14px] font-medium text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
              >
                <Save size={16} />
                Save to Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="h-10 border-t border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] flex items-center justify-between px-6">
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
          Data Source: Annual Sales Target Spreadsheet • Updated Live
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Live Annotation Engine Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}