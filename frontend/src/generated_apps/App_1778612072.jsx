import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ComposedChart, Line
} from 'recharts';
import { Menu, X, Filter, ChevronRight, AlertCircle, Ship, Factory, ClipboardCheck, Warehouse } from 'lucide-react';

/**
 * INBOUND SUPPLY CHAIN BOTTLENECK RADAR
 * Persona: Logistics Operations Manager
 * Archetype: Process Monitor / Dashboard
 */

// --- Design Tokens (from visual_spec.skill.md) ---
const THEME = {
  light: {
    background_primary: "#ffffff",
    background_secondary: "#e2e8f0",
    text_primary: "#5c5c5c",
    text_secondary: "#475569",
    border: "#e2e8f0",
    chart_palette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
    success: "#047857",
    error: "#be123c",
    kpi_title: "#457bb4",
    kpi_value: "#5f6972"
  },
  dark: {
    background_primary: "#1a1a1a",
    background_secondary: "#1e293b",
    text_primary: "#dbdbdb",
    text_secondary: "#cbd5e1",
    border: "#1e293b",
    chart_palette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
    success: "#34d399",
    error: "#fb7185",
    kpi_title: "#94a3b8",
    kpi_value: "#3b82f6"
  }
};

const STAGES = ['At Sea', 'Custom Clearance', 'RDC Transit', 'At RDC Yard'];
const PORTS = ['Shanghai', 'Rotterdam', 'Long Beach', 'Singapore', 'Busan', 'Hamburg'];
const DELAY_THRESHOLD = 4;

// --- Mock Data Generation ---
const generateMockData = () => {
  return Array.from({ length: 200 }, (_, i) => {
    const status = STAGES[Math.floor(Math.random() * STAGES.length)];
    const days = Math.floor(Math.random() * 10) + 1; // 1 to 10 days
    const fee = Math.floor(Math.random() * 500) + 100; // $100 - $600
    return {
      id: `CONT-${1000 + i}`,
      port: PORTS[Math.floor(Math.random() * PORTS.length)],
      status,
      daysInStatus: days,
      dailyFee: fee,
      isDelayed: days > DELAY_THRESHOLD
    };
  });
};

export default function SupplyChainBottleneckRadar() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState('All Ports');

  useEffect(() => {
    setData(generateMockData());
  }, []);

  // --- Calculations ---
  const filteredData = useMemo(() => {
    if (selectedPort === 'All Ports') return data;
    return data.filter(item => item.port === selectedPort);
  }, [data, selectedPort]);

  const totalBleed = useMemo(() => {
    return filteredData
      .filter(item => item.isDelayed)
      .reduce((sum, item) => sum + item.dailyFee, 0);
  }, [filteredData]);

  const delayedCount = useMemo(() => {
    return filteredData.filter(item => item.isDelayed).length;
  }, [filteredData]);

  const matrixData = useMemo(() => {
    const matrix = PORTS.map(port => {
      const row = { port };
      STAGES.forEach(status => {
        row[status] = filteredData.filter(d => d.port === port && d.status === status && d.isDelayed).length;
      });
      return row;
    });
    return matrix;
  }, [filteredData]);

  // --- Components ---

  const KPICard = ({ title, value, subtext, isNegative }) => (
    <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-[20px] shadow-sm flex flex-col justify-between">
      <h6 style={{ fontSize: '12px', fontWeight: '600', color: THEME.light.kpi_title, textTransform: 'uppercase', marginBottom: '8px' }}>
        {title}
      </h6>
      <div className="flex items-baseline gap-2">
        <span style={{ fontSize: '30px', fontWeight: '600', color: THEME.light.kpi_value }}>
          {value}
        </span>
        {subtext && (
          <span style={{ fontSize: '12px', color: isNegative ? THEME.light.error : THEME.light.success }}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );

  const ProgressBar = ({ currentStatus, isDelayed }) => {
    const currentIndex = STAGES.indexOf(currentStatus);
    return (
      <div className="flex items-center gap-1 w-full max-w-md">
        {STAGES.map((_, idx) => (
          <div key={idx} className="flex-1 h-1.5 relative">
            <div 
              className={`h-full rounded-full ${idx <= currentIndex 
                ? (isDelayed ? 'bg-[#be123c]' : 'bg-[#62a8ea]') 
                : 'bg-[#e2e8f0] dark:bg-[#262626]'}`}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] font-sans text-[#475569] dark:text-[#cbd5e1]">

      {/* --- Top Header --- */}
      <header className="w-full h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-6 bg-[#ffffff] dark:bg-[#1a1a1a] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] rounded transition-colors"
          >
            <Menu className="w-6 h-6 text-[#5c5c5c] dark:text-[#dbdbdb]" />
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
            Inbound Supply Chain Bottleneck Radar
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            className="bg-[#f1f5f9] dark:bg-[#1e293b] border-none rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#62a8ea]"
          >
            <option>All Ports</option>
            {PORTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="w-8 h-8 rounded-full bg-[#62a8ea] flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">

        {/* --- Sidebar --- */}
        {isSidebarOpen && (
          <aside className="w-64 border-r border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] p-4 flex flex-col gap-2">
            {['Overview', 'Container Details', 'Port Analysis', 'Demurrage Risk'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-[#ebf5ff] dark:bg-[#1e3a8a] text-[#457bb5] dark:text-[#bfdbfe]' 
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]'
                }`}
              >
                {tab}
              </button>
            ))}
          </aside>
        )}

        {/* --- Main Content --- */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* --- KPI Grid --- */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard 
              title="Total Accruing Bleed" 
              value={`$${totalBleed.toLocaleString()}`} 
              subtext="Daily Fees"
              isNegative={true}
            />
            <KPICard 
              title="Delayed Containers" 
              value={delayedCount} 
              subtext={`${((delayedCount / filteredData.length) * 100).toFixed(1)}% of total`}
              isNegative={true}
            />
            <KPICard 
              title="Avg Residence Time" 
              value="5.2 Days" 
              subtext="+0.4 from baseline"
              isNegative={true}
            />
            <KPICard 
              title="Current Velocity" 
              value="84%" 
              subtext="Target 90%"
              isNegative={false}
            />
          </section>

          {/* --- Visualization Grid --- */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Pivot Matrix (Origin vs Status) */}
            <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                  Gridlock Pivot Matrix (Delayed Units)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#be123c]"></span>
                  <span style={{ fontSize: '12px' }}>Critical Delay Cluster</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="pb-4 text-xs font-semibold text-[#64748b] uppercase">Origin Port</th>
                      {STAGES.map(s => (
                        <th key={s} className="pb-4 text-xs font-semibold text-[#64748b] uppercase text-center px-2">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrixData.map((row, i) => (
                      <tr key={i} className="border-t border-[#f1f5f9] dark:border-[#262626]">
                        <td className="py-4 text-sm font-medium text-[#5c5c5c] dark:text-[#dbdbdb]">{row.port}</td>
                        {STAGES.map(s => {
                          const val = row[s];
                          const intensity = Math.min(val * 10, 100);
                          return (
                            <td key={s} className="py-2 px-1">
                              <div 
                                className="h-10 rounded flex items-center justify-center text-xs font-bold transition-all"
                                style={{ 
                                  backgroundColor: val > 0 ? `rgba(190, 18, 60, ${intensity / 100})` : 'transparent',
                                  color: intensity > 50 ? 'white' : '#5c5c5c',
                                  border: val > 0 ? 'none' : '1px dashed #e2e8f0'
                                }}
                              >
                                {val || '-'}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6 shadow-sm">
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb] mb-6">
                Bottleneck Concentration
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STAGES.map(s => ({ status: s, count: filteredData.filter(d => d.status === s && d.isDelayed).length }))} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="status" type="category" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#62a8ea" radius={[0, 4, 4, 0]} barSize={20}>
                      {STAGES.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 1 ? '#be123c' : '#62a8ea'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p style={{ fontSize: '12px' }} className="mt-4 text-[#94a3b8] italic">
                * Customs Clearance remains the primary bottleneck stage across all ports.
              </p>
            </div>
          </section>

          {/* --- Container Record List --- */}
          <section className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between bg-[#f8fafc] dark:bg-[#1a1a1a]">
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#457bb4' }}>
                Container Journey Tracking
              </h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#262626] border border-[#e2e8f0] dark:border-[#334155] rounded text-xs font-medium hover:bg-gray-50">
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] dark:bg-[#121212]">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase">Container ID</th>
                    <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase">Origin Port</th>
                    <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase">Journey Stage</th>
                    <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase text-center">Days in Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase text-right">Daily Fee</th>
                    <th className="px-6 py-3 text-xs font-semibold text-[#64748b] uppercase text-center">Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                  {filteredData.slice(0, 15).map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-[#475569] dark:text-[#dbdbdb]">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {item.port}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-medium text-[#64748b] uppercase tracking-wide">
                            {item.status}
                          </span>
                          <ProgressBar currentStatus={item.status} isDelayed={item.isDelayed} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-semibold ${item.isDelayed ? 'text-[#be123c]' : 'text-[#475569] dark:text-[#dbdbdb]'}`}>
                          {item.daysInStatus}d
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-[#64748b]">
                        ${item.dailyFee.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.isDelayed && (
                          <div className="flex justify-center">
                            <AlertCircle className="w-5 h-5 text-[#be123c]" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-[#e2e8f0] dark:border-[#1e293b] flex justify-center bg-[#f8fafc] dark:bg-[#121212]">
                 <button className="text-sm font-medium text-[#457bb5] hover:underline flex items-center gap-1">
                    Load More Containers <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* --- Footer Status Bar --- */}
      <footer className="h-8 border-t border-[#e2e8f0] dark:border-[#1e293b] bg-[#f8fafc] dark:bg-[#121212] flex items-center justify-between px-6 text-[10px] uppercase tracking-widest text-[#94a3b8]">
        <div className="flex items-center gap-4">
          <span>System Status: Optimal</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Sync
          </span>
        </div>
        <div>
          Data Refresh: 2026-05-12 11:53:57
        </div>
      </footer>
    </div>
  );
}