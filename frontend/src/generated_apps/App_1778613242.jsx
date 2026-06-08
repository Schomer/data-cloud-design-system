import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { 
  MessageSquare, AlertCircle, Filter, ChevronRight, 
  Trash2, Save, X, Info, TrendingUp, TrendingDown 
} from 'lucide-react';

// --- MOCK DATA GENERATION ---
const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM'];
const MANAGERS = [
  { name: 'Sarah Jenkins', region: 'North America' },
  { name: 'Michael Chen', region: 'APAC' },
  { name: 'Elena Rodriguez', region: 'EMEA' },
  { name: 'David Smith', region: 'North America' },
  { name: 'Jessica Wu', region: 'APAC' },
  { name: 'Lars Nielsen', region: 'EMEA' },
  { name: 'Sofia Silva', region: 'LATAM' },
  { name: 'James Wilson', region: 'North America' }
];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const generateSalesData = () => {
  const data = [];
  MANAGERS.forEach(manager => {
    QUARTERS.forEach(q => {
      const target = Math.floor(Math.random() * 400000) + 500000;
      const performanceVariance = (Math.random() * 0.4) - 0.15; // -15% to +25%
      const actual = Math.floor(target * (1 + performanceVariance));
      data.push({
        id: `${manager.name}-${q}`,
        manager: manager.name,
        region: manager.region,
        quarter: q,
        target,
        actual,
        attainment: (actual / target) * 100
      });
    });
  });
  return data;
};

const INITIAL_SALES_DATA = generateSalesData();

// --- COMPONENTS ---

const AnnotationTooltip = ({ active, payload, label, onAnnotate }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 shadow-xl rounded-lg p-3 min-w-[200px]">
        <p className="font-bold text-slate-800 border-b pb-1 mb-2">{data.manager} - {data.quarter}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Actual:</span>
            <span className="font-semibold text-blue-600">${data.actual.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Target:</span>
            <span className="font-semibold text-slate-700">${data.target.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-slate-500">Attainment:</span>
            <span className={`font-bold ${data.attainment >= 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {data.attainment.toFixed(1)}%
            </span>
          </div>
        </div>
        <button 
          onClick={() => onAnnotate(data)}
          className="mt-3 w-full bg-slate-800 text-white text-xs py-2 rounded flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
        >
          <MessageSquare size={14} /> Add Context Note
        </button>
      </div>
    );
  }
  return null;
};

export default function QBRSalesPlanner() {
  const [activeRegion, setActiveRegion] = useState('All');
  const [annotations, setAnnotations] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [importance, setImportance] = useState('Medium');
  const [isLogOpen, setIsLogOpen] = useState(true);

  // Filtered Data
  const filteredData = useMemo(() => {
    return activeRegion === 'All' 
      ? INITIAL_SALES_DATA 
      : INITIAL_SALES_DATA.filter(d => d.region === activeRegion);
  }, [activeRegion]);

  // Aggregate data for Chart (Managers on X-axis, total annual for simplified view or per quarter)
  // We'll show Quarters for the selected region's managers
  const chartData = useMemo(() => {
    // Group by manager for the current view
    const managersInView = [...new Set(filteredData.map(d => d.manager))];
    return managersInView.map(name => {
      const managerItems = filteredData.filter(d => d.manager === name);
      const totalTarget = managerItems.reduce((acc, curr) => acc + curr.target, 0);
      const totalActual = managerItems.reduce((acc, curr) => acc + curr.actual, 0);
      return {
        manager: name,
        Target: totalTarget,
        Actual: totalActual,
        fullData: managerItems[0] // used for identifying for annotations
      };
    });
  }, [filteredData]);

  const handleSaveAnnotation = () => {
    if (!noteText.trim()) return;

    const newAnnotation = {
      id: Date.now(),
      dataId: selectedData.id,
      manager: selectedData.manager,
      quarter: selectedData.quarter || 'Annual',
      note: noteText,
      importance,
      timestamp: new Date().toLocaleTimeString(),
      region: selectedData.region
    };

    setAnnotations([newAnnotation, ...annotations]);
    setNoteText('');
    setSelectedData(null);
  };

  const removeAnnotation = (id) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

      {/* --- Main Content Area --- */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isLogOpen ? 'mr-80' : 'mr-0'}`}>

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">QBR Sales Planner</h1>
            <p className="text-slate-500 text-sm">Strategic Performance Review & Data Annotation</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['All', ...REGIONS].map(region => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeRegion === region 
                      ? 'bg-white shadow-sm text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsLogOpen(!isLogOpen)}
              className={`p-2 rounded-lg border ${isLogOpen ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 gap-8">

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="text-blue-500" size={20} />
                  Manager Performance: Actual vs. Target
                </h3>
                <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  Interactive: Click bars to annotate
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    onClick={(data) => {
                      if (data && data.activePayload) {
                        setSelectedData(data.activePayload[0].payload.fullData);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="manager" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(val) => `$${val/1000}k`}
                    />
                    <Tooltip content={<AnnotationTooltip onAnnotate={setSelectedData} />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          cursor="pointer" 
                          fill={entry.Actual >= entry.Target ? '#10b981' : '#3b82f6'} 
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold">Detailed Account Breakdown</h3>
                <span className="text-xs font-medium text-slate-500">{filteredData.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200">
                      <th className="px-6 py-4 font-semibold text-slate-600">Account Manager</th>
                      <th className="px-6 py-4 font-semibold text-slate-600">Region</th>
                      <th className="px-6 py-4 font-semibold text-slate-600">Period</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 text-right">Target</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actual</th>
                      <th className="px-6 py-4 font-semibold text-slate-600">Attainment</th>
                      <th className="px-6 py-4 font-semibold text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 15).map((row, idx) => (
                      <tr 
                        key={row.id} 
                        className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedData(row)}
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">{row.manager}</td>
                        <td className="px-6 py-4 text-slate-500">{row.region}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{row.quarter}</td>
                        <td className="px-6 py-4 text-right font-mono text-slate-600">${row.target.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">${row.actual.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${row.attainment >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(row.attainment, 100)}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs font-bold ${row.attainment >= 100 ? 'text-emerald-600' : 'text-slate-600'}`}>
                              {row.attainment.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-slate-400 group-hover:text-blue-600">
                            <MessageSquare size={16} />
                          </button>
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

      {/* --- SIDE PANEL: CONTEXT LOG --- */}
      <aside 
        className={`fixed right-0 top-0 h-full bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 z-20 ${isLogOpen ? 'translate-x-0' : 'translate-x-full'} w-80 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <h2 className="font-bold flex items-center gap-2">
            <Info size={18} /> Context Log
          </h2>
          <button onClick={() => setIsLogOpen(false)} className="hover:text-slate-300">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {annotations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <MessageSquare size={48} className="mb-4" />
              <p className="text-sm font-medium">No annotations yet.</p>
              <p className="text-xs">Click a chart bar or table row to add context.</p>
            </div>
          ) : (
            annotations.map(anno => (
              <div key={anno.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 relative group">
                <button 
                  onClick={() => removeAnnotation(anno.id)}
                  className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${
                    anno.importance === 'High' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 
                    anno.importance === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {anno.importance} Importance
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-800">{anno.manager} — {anno.quarter}</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{anno.note}</p>
                <div className="mt-3 flex justify-between items-center border-t border-slate-200 pt-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{anno.region}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{anno.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* --- MODAL: ANNOTATION TOOLTIP --- */}
      {selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare size={18} /> Add Performance Context
              </h3>
              <button onClick={() => setSelectedData(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</p>
                  <p className="font-bold text-slate-900">{selectedData.manager}</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Period</p>
                  <p className="font-bold text-slate-900">{selectedData.quarter || 'Annual'}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Importance Flag</label>
                <div className="flex gap-2">
                  {['High', 'Medium', 'Low'].map(level => (
                    <button
                      key={level}
                      onClick={() => setImportance(level)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        importance === level 
                          ? 'bg-slate-800 text-white border-slate-800 shadow-md translate-y-[-1px]' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contextual Notes</label>
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Explain performance drivers (e.g. Supply chain delays, Market expansion, Deal slippage...)"
                  className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setSelectedData(null)}
                  className="flex-1 py-3 text-slate-500 font-bold text-sm hover:text-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAnnotation}
                  disabled={!noteText.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save to Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistence Note Overlay */}
      <div className="fixed bottom-4 left-4 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <Info size={12} />
        <span>Annotations are anchored to account IDs and persist across region filters.</span>
      </div>

    </div>
  );
}