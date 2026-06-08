import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Menu, X, Search, Filter, Download } from 'lucide-react';

/**
 * SANTA CRUZ URBAN FOREST DASHBOARD
 * Built following DAK Visual & Layout Specifications.
 */

// --- MOCK DATA GENERATION ---
const TREE_TYPES = ['Coast Redwood', 'Monterey Cypress', 'Coast Live Oak', 'Western Sycamore', 'California Buckeye'];
const STATUSES = ['Healthy', 'Stressed', 'Diseased', 'Dead'];
const SC_COORDS = { lat: 36.9741, lng: -122.0308 };

const rawData = Array.from({ length: 60 }, (_, i) => ({
  id: `TRE-${1000 + i}`,
  type: TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)],
  age: Math.floor(Math.random() * 120) + 5,
  size: Math.floor(Math.random() * 45) + 10, // Diameter in inches
  status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
  lat: SC_COORDS.lat + (Math.random() - 0.5) * 0.04,
  lng: SC_COORDS.lng + (Math.random() - 0.5) * 0.06
}));

// --- THEME TOKENS ---
const COLORS = {
  chart: ["#ea75b0", "#7375c9", "#f59e0b", "#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#ef4444"],
  light: { bg: '#ffffff', bgSec: '#e2e8f0', text: '#5c5c5c', border: '#e2e8f0', accent: '#598dc5' },
  dark: { bg: '#1a1a1a', bgSec: '#1e293b', text: '#dbdbdb', border: '#1e293b', accent: '#5aa1d8' }
};

export default function SantaCruzTreeMap() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return rawData.filter(t => 
      (typeFilter === 'All' || t.type === typeFilter) &&
      (statusFilter === 'All' || t.status === statusFilter)
    );
  }, [typeFilter, statusFilter]);

  // --- AGGREGATIONS ---
  const kpis = {
    total: filteredData.length,
    avgAge: Math.round(filteredData.reduce((acc, curr) => acc + curr.age, 0) / (filteredData.length || 1)),
    healthPct: Math.round((filteredData.filter(t => t.status === 'Healthy').length / (filteredData.length || 1)) * 100),
    canopyCover: (filteredData.length * 1.2).toFixed(1) + 'k sqft'
  };

  const typeData = TREE_TYPES.map(type => ({
    name: type,
    value: filteredData.filter(t => t.type === type).length
  })).sort((a, b) => b.value - a.value);

  const statusData = STATUSES.map(status => ({
    name: status,
    value: filteredData.filter(t => t.status === status).length
  }));

  const ageDist = Array.from({ length: 6 }, (_, i) => {
    const min = i * 20;
    const max = (i + 1) * 20;
    return {
      range: `${min}-${max}`,
      count: filteredData.filter(t => t.age >= min && t.age < max).length
    };
  });

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col font-['Inter',sans-serif]">
      {/* --- TOP HEADER --- */}
      <header className="w-full h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-6 bg-[#ffffff] dark:bg-[#1a1a1a] z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-[#475569] dark:text-[#cbd5e1] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] p-2"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
            Santa Cruz Urban Forest
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-[#f1f5f9] dark:bg-[#121212] rounded-md px-3 py-1.5 border border-[#e2e8f0] dark:border-[#1e293b]">
            <Search size={14} className="text-[#64748b] mr-2" />
            <input 
              placeholder="Search assets..." 
              className="bg-transparent text-sm outline-none text-[#0f172a] dark:text-[#f8fafc]"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* --- SIDEBAR --- */}
        <aside 
          className={`absolute lg:relative transition-all duration-300 border-r border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] z-40 
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'}`}
        >
          <nav className="p-4 space-y-2">
            {['Overview', 'Analysis', 'Tree Map', 'Inventory'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm font-medium
                ${activeTab === tab 
                  ? 'bg-[#ebf5ff] dark:bg-[#1e3a8a] text-[#457bb5] dark:text-[#bfdbfe]' 
                  : 'text-[#64748b] dark:text-[#cbd5e1] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Global Filters */}
          <section className="flex flex-wrap items-center gap-4 bg-[#ffffff] dark:bg-[#1a1a1a] p-4 border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Tree Species</span>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded px-3 py-1 text-sm text-[#475569] dark:text-[#cbd5e1]"
              >
                <option value="All">All Species</option>
                {TREE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Health Status</span>
              <div className="flex gap-2">
                {['All', ...STATUSES].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all
                    ${statusFilter === s 
                      ? 'bg-[#dae4f1] border-[#cbd7e7] text-[#457bb5]' 
                      : 'border-[#e2e8f0] dark:border-[#1e293b] text-[#64748b] dark:text-[#94a3b8]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'TOTAL TREES', value: kpis.total, sub: 'Logged Assets' },
              { label: 'AVG AGE', value: kpis.avgAge, sub: 'Years Old' },
              { label: 'HEALTH RATE', value: kpis.healthPct + '%', sub: 'In Healthy State' },
              { label: 'CANOPY COVER', value: kpis.canopyCover, sub: 'Est. Coverage' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-[#ffffff] dark:bg-[#1a1a1a] p-5 border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl">
                <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] font-semibold mb-1 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-[30px] font-bold text-[#5c5c5c] dark:text-[#3b82f6] leading-none mb-2">{kpi.value}</p>
                <p className="text-[12px] text-[#94a3b8] italic">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Middle Row: Map & Type Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 h-[500px] flex flex-col">
              <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#f8fafc] mb-4">Tree Location Map (Santa Cruz)</h5>
              <div className="flex-1 bg-[#f8fafc] dark:bg-[#121212] rounded-lg relative overflow-hidden">
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.3} />
                      <XAxis type="number" dataKey="lng" name="longitude" domain={['auto', 'auto']} hide />
                      <YAxis type="number" dataKey="lat" name="latitude" domain={['auto', 'auto']} hide />
                      <ZAxis type="number" dataKey="size" range={[50, 400]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Scatter name="Trees" data={filteredData} fill="#a8d95e">
                        {filteredData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                 </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6">
              <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#f8fafc] mb-4">Species Distribution</h5>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={typeData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS.chart[i % COLORS.chart.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row: Age and Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6">
              <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#f8fafc] mb-4">Age Bracket Inventory (Years)</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageDist}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7375c9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 flex flex-col items-center">
              <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#f8fafc] w-full text-left mb-4">Vitality Summary</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {statusData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.chart[i % COLORS.chart.length] }} />
                    <span className="text-xs text-[#64748b]">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#e2e8f0] dark:border-[#1e293b] flex justify-between items-center">
              <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#f8fafc]">Detailed Inventory</h5>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e2e8f0] dark:border-[#1e293b] rounded text-xs text-[#457bb5] dark:text-[#a0a7b0] hover:bg-[#f8fafc] dark:hover:bg-[#122940]">
                <Download size={14} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] dark:bg-[#121212]">
                  <tr>
                    {['Asset ID', 'Species', 'Age (Y)', 'Diameter (in)', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-[12px] font-semibold text-[#457bba] dark:text-[#94a3b8] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                  {filteredData.slice(0, 10).map((tree) => (
                    <tr key={tree.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#121212] transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-[#657281] dark:text-[#e2e8f0]">{tree.id}</td>
                      <td className="px-6 py-4 text-sm text-[#475569] dark:text-[#cbd5e1]">{tree.type}</td>
                      <td className="px-6 py-4 text-sm text-[#475569] dark:text-[#cbd5e1]">{tree.age}</td>
                      <td className="px-6 py-4 text-sm text-[#475569] dark:text-[#cbd5e1]">{tree.size}"</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tree.status === 'Healthy' ? 'bg-[#ecfdf5] text-[#047857]' : 
                          tree.status === 'Dead' ? 'bg-[#fff1f2] text-[#be123c]' : 'bg-[#fffbeb] text-[#b45309]'
                        }`}>
                          {tree.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length > 10 && (
                <div className="p-3 text-center border-t border-[#e2e8f0] dark:border-[#1e293b]">
                  <button className="text-[12px] text-[#598dc5] font-semibold">Load {filteredData.length - 10} More Records</button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}