import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, ZAxis, Cell, Legend
} from 'recharts';
import { 
  Trees, Activity, Info, Calendar, Filter, ChevronDown, 
  Map as MapIcon, Table as TableIcon, LayoutGrid, Search 
} from 'lucide-react';

/**
 * SANTA CRUZ TREE INVENTORY EXPLORER
 * 
 * A high-fidelity React application built to visualize urban forest data.
 * Adheres to strict visual specifications for Dark Mode and interactive state.
 */

// --- MOCK DATA GENERATION ---
const SPECIES = ['Coast Redwood', 'Monterey Cypress', 'Blue Gum Eucalyptus', 'Coast Live Oak', 'Douglas Fir'];
const STATUSES = ['Healthy', 'Fair', 'Critical'];
const NEIGHBORHOODS = ['Westside', 'Eastside', 'Downtown', 'Seabright', 'Upper Westside'];

const MOCK_TREES = Array.from({ length: 50 }, (_, i) => ({
  id: `TREE-${1000 + i}`,
  species: SPECIES[Math.floor(Math.random() * SPECIES.length)],
  status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
  neighborhood: NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)],
  age: Math.floor(Math.random() * 120) + 5,
  dbh: Math.floor(Math.random() * 80) + 10, // Diameter at Breast Height (inches)
  lat: 36.9741 + (Math.random() - 0.5) * 0.05,
  lng: -122.0308 + (Math.random() - 0.5) * 0.05,
  plantedDate: new Date(2024 - (Math.floor(Math.random() * 20)), Math.floor(Math.random() * 12), 1).toISOString().split('T')[0]
}));

const CHART_COLORS = ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9", "#ea75b0", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];

export default function SantaCruzTreeInventory() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSpecies, setFilterSpecies] = useState('All');
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard | table

  // --- DERIVED STATE / FILTERING ---
  const filteredData = useMemo(() => {
    return MOCK_TREES.filter(t => 
      (filterStatus === 'All' || t.status === filterStatus) &&
      (filterSpecies === 'All' || t.species === filterSpecies)
    );
  }, [filterStatus, filterSpecies]);

  const kpis = useMemo(() => {
    const total = filteredData.length;
    const avgAge = total ? (filteredData.reduce((acc, curr) => acc + curr.age, 0) / total).toFixed(1) : 0;
    const healthyCount = filteredData.filter(t => t.status === 'Healthy').length;
    const healthRate = total ? ((healthyCount / total) * 100).toFixed(0) : 0;
    const diversity = new Set(filteredData.map(t => t.species)).size;
    return { total, avgAge, healthRate, diversity };
  }, [filteredData]);

  const speciesDist = useMemo(() => {
    const map = {};
    filteredData.forEach(t => { map[t.species] = (map[t.species] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const ageData = useMemo(() => {
    const bins = { '0-20': 0, '21-50': 0, '51-80': 0, '81+': 0 };
    filteredData.forEach(t => {
      if (t.age <= 20) bins['0-20']++;
      else if (t.age <= 50) bins['21-50']++;
      else if (t.age <= 80) bins['51-80']++;
      else bins['81+']++;
    });
    return Object.entries(bins).map(([range, count]) => ({ range, count }));
  }, [filteredData]);

  // --- STYLES (From Visual Spec) ---
  const styles = {
    app: "min-h-screen bg-[#1a1a1a] text-[#dbdbdb] font-['Inter',_sans-serif] p-6",
    header: "flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#1e293b]",
    h1: { fontSize: '36px', fontWeight: '600', color: '#dbdbdb' },
    h2: { fontSize: '30px', fontWeight: '600', color: '#dbdbdb' },
    h4: { fontSize: '20px', fontWeight: '500', color: '#dbdbdb' },
    p: { fontSize: '16px', fontWeight: '400', color: '#cbd5e1' },
    card: "bg-[#1a1a1a] border border-[#1e293b] rounded-[12px] p-5 shadow-sm",
    kpiValue: { fontSize: '30px', fontWeight: '600', color: '#3b82f6' },
    kpiLabel: { fontSize: '12px', fontWeight: '400', color: '#94a3b8', textTransform: 'uppercase' },
    button: (active) => `px-4 py-2 rounded-[8px] transition-all flex items-center gap-2 text-[14px] font-[500] ${
      active ? 'bg-[#5aa1d8] text-[#000000]' : 'bg-[#292929] text-[#a0a7b0] hover:bg-[#122940]'
    }`,
    input: "bg-[#121212] border border-[#1e293b] text-[#f8fafc] px-3 py-2 rounded-[8px] outline-none focus:ring-1 focus:ring-[#3b82f6] text-[14px]"
  };

  return (
    <div className={styles.app}>
      {/* HEADER SECTION */}
      <header className={styles.header}>
        <div>
          <h1 style={styles.h1}>Santa Cruz Tree Inventory</h1>
          <p style={styles.p} className="mt-1">Urban Forest Monitoring & Geospatial Analysis</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-[#94a3b8]" />
            <div className="bg-[#121212] p-1 rounded-[8px] border border-[#1e293b] flex">
              <button 
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1 rounded-[6px] text-[12px] transition-colors ${viewMode === 'dashboard' ? 'bg-[#262626] text-[#60a5fa]' : 'text-[#94a3b8]'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-[6px] text-[12px] transition-colors ${viewMode === 'table' ? 'bg-[#262626] text-[#60a5fa]' : 'text-[#94a3b8]'}`}
              >
                Data Grid
              </button>
            </div>
          </div>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.input}
          >
            <option value="All">All Health Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className={styles.input}
          >
            <option value="All">All Species</option>
            {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button className={styles.button(true)}>
             Update View
          </button>
        </div>
      </header>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Monitored", value: kpis.total, icon: <Trees size={20} /> },
          { label: "Health Index", value: `${kpis.healthRate}%`, icon: <Activity size={20} /> },
          { label: "Average Age (Yrs)", value: kpis.avgAge, icon: <Calendar size={20} /> },
          { label: "Species Count", value: kpis.diversity, icon: <Info size={20} /> },
        ].map((kpi, idx) => (
          <div key={idx} className={styles.card}>
            <div className="flex items-center justify-between mb-2">
              <span style={styles.kpiLabel}>{kpi.label}</span>
              <div className="text-[#3b82f6]">{kpi.icon}</div>
            </div>
            <div style={styles.kpiValue}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {viewMode === 'dashboard' ? (
        <div className="space-y-6">
          {/* MAIN VISUALS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MAP COMPONENT */}
            <div className={`${styles.card} lg:col-span-2 min-h-[450px]`}>
              <div className="flex items-center justify-between mb-4">
                <h4 style={styles.h4} className="flex items-center gap-2"><MapIcon size={18} /> Geospatial Distribution</h4>
                <div className="text-[12px] text-[#94a3b8]">Coordinates around Santa Cruz, CA</div>
              </div>
              <div className="h-[380px] w-full bg-[#121212] rounded-[8px] overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis type="number" dataKey="lng" name="Longitude" domain={['auto', 'auto']} tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis type="number" dataKey="lat" name="Latitude" domain={['auto', 'auto']} tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                    <ZAxis type="number" dataKey="dbh" range={[50, 400]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#dbdbdb', fontSize: '12px' }}
                    />
                    <Scatter name="Trees" data={filteredData}>
                      {filteredData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.status === 'Healthy' ? '#10b981' : 
                          entry.status === 'Fair' ? '#f59e0b' : '#ef4444'
                        } />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SPECIES BREAKDOWN */}
            <div className={styles.card}>
              <h4 style={styles.h4} className="mb-6">Species Density</h4>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speciesDist} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fill: '#cbd5e1', fontSize: 11 }} 
                      width={100}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      cursor={{ fill: '#262626' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {speciesDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SECONDARY ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={styles.card}>
              <h4 style={styles.h4} className="mb-4">Maturity Profile (Age)</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="range" tick={{fill: '#64748b', fontSize: 11}} axisLine={false} />
                    <YAxis tick={{fill: '#64748b', fontSize: 11}} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #1e293b' }} />
                    <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4, fill: '#60a5fa' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.card}>
              <h4 style={styles.h4} className="mb-4">Inventory Audit Summary</h4>
              <div className="space-y-4">
                {NEIGHBORHOODS.map((nh, i) => {
                  const count = filteredData.filter(t => t.neighborhood === nh).length;
                  const percentage = ((count / filteredData.length) * 100).toFixed(0);
                  return (
                    <div key={nh} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#cbd5e1]">{nh}</span>
                        <span className="text-[#94a3b8] font-mono">{count} Trees</span>
                      </div>
                      <div className="w-full bg-[#121212] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#3b82f6]" 
                          style={{ width: `${percentage}%`, opacity: 0.7 + (i * 0.05) }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className={styles.card}>
          <div className="flex items-center justify-between mb-6">
            <h4 style={styles.h4} className="flex items-center gap-2"><TableIcon size={18} /> Detailed Inventory Records</h4>
            <div className="relative">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
               <input 
                type="text" 
                placeholder="Search inventory..." 
                className={`${styles.input} pl-9 w-64`} 
               />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e293b]">
                  {['Tree ID', 'Species', 'Neighborhood', 'Age (Y)', 'Status', 'Lat/Lng'].map(h => (
                    <th key={h} className="pb-4 px-4 text-[#94a3b8] font-[400] text-[12px] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {filteredData.slice(0, 15).map((tree) => (
                  <tr key={tree.id} className="border-b border-[#262626] hover:bg-[#121212] transition-colors">
                    <td className="py-4 px-4 font-mono text-[#60a5fa]">{tree.id}</td>
                    <td className="py-4 px-4 text-[#cbd5e1]">{tree.species}</td>
                    <td className="py-4 px-4 text-[#cbd5e1]">{tree.neighborhood}</td>
                    <td className="py-4 px-4 text-[#cbd5e1]">{tree.age}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-[500] ${
                        tree.status === 'Healthy' ? 'bg-[#064e3b] text-[#a7f3d0]' : 
                        tree.status === 'Fair' ? 'bg-[#78350f] text-[#fcd34d]' : 'bg-[#881337] text-[#fda4af]'
                      }`}>
                        {tree.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#64748b] text-[12px]">
                      {tree.lat.toFixed(4)}, {tree.lng.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 15 && (
              <div className="py-4 text-center text-[#64748b] text-[12px] italic">
                Showing top 15 of {filteredData.length} records...
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-12 pt-6 border-t border-[#1e293b] flex justify-between items-center text-[#64748b] text-[12px]">
        <div>Data Playground v2.4 • System Active</div>
        <div className="flex gap-4">
          <button className="hover:text-[#dbdbdb]">Documentation</button>
          <button className="hover:text-[#dbdbdb]">Export PDF</button>
        </div>
      </footer>
    </div>
  );
}