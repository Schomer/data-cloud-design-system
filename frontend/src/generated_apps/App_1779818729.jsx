import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from 'recharts';
import { Filter, ChevronDown, Menu, X, TreeDeciduous, Info } from 'lucide-react';

// --- MOCK DATA GENERATION ---
const SPECIES = ['Coast Redwood', 'Live Oak', 'Monterey Cypress', 'Douglas Fir', 'California Sycamore'];
const STATUSES = ['Healthy', 'Fair', 'Needs Attention', 'Critical'];

const generateMockData = () => {
  return Array.from({ length: 60 }, (_, i) => ({
    id: `TREE-${1000 + i}`,
    species: SPECIES[Math.floor(Math.random() * SPECIES.length)],
    dbh: Math.floor(Math.random() * 50) + 10, // Diameter at breast height (inches)
    age: Math.floor(Math.random() * 120) + 5,
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    // Santa Cruz approx bounding box: Lat 36.95-36.99, Lng -122.01 to -122.06
    lat: 36.95 + Math.random() * 0.04,
    lng: -122.06 + Math.random() * 0.05,
    plantedDate: new Date(2024 - (Math.random() * 100), Math.floor(Math.random() * 12)).toISOString().split('T')[0]
  }));
};

const INITIAL_DATA = generateMockData();

// --- COMPONENTS ---

const KPICard = ({ title, value, subtitle }) => (
  <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] p-5 rounded-[12px] flex flex-col justify-between shadow-sm">
    <div style={{ fontSize: '12px', fontWeight: '400', color: '#64748b' }}>{title}</div>
    <div style={{ fontSize: '30px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb] my-1">
      {value}
    </div>
    <div style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8' }}>{subtitle}</div>
  </div>
);

export default function SantaCruzTreeInventory() {
  const [data, setData] = useState(INITIAL_DATA);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    species: 'All',
    status: 'All',
  });

  // Filtering Logic
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter(tree => {
      const speciesMatch = activeFilters.species === 'All' || tree.species === activeFilters.species;
      const statusMatch = activeFilters.status === 'All' || tree.status === activeFilters.status;
      return speciesMatch && statusMatch;
    });
  }, [activeFilters]);

  // Aggregations
  const speciesStats = useMemo(() => {
    const counts = {};
    filteredData.forEach(t => counts[t.species] = (counts[t.species] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const kpis = {
    total: filteredData.length,
    avgAge: Math.round(filteredData.reduce((acc, curr) => acc + curr.age, 0) / filteredData.length) || 0,
    avgDbh: (filteredData.reduce((acc, curr) => acc + curr.dbh, 0) / filteredData.length).toFixed(1) || 0,
    healthRate: ((filteredData.filter(t => t.status === 'Healthy').length / filteredData.length) * 100).toFixed(0) || 0
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return '#10b981';
      case 'Fair': return '#f59e0b';
      case 'Needs Attention': return '#ef4444';
      case 'Critical': return '#7c2d12';
      default: return '#62a8ea';
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-6 z-30 bg-[#ffffff] dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] rounded transition-colors">
            <Menu size={20} className="text-[#475569] dark:text-[#cbd5e1]" />
          </button>
          <div className="flex items-center gap-2">
            <TreeDeciduous className="text-[#10b981]" size={24} />
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
              Santa Cruz Tree Canopy
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#dae4f1] dark:bg-[#425b9e] rounded-full">
          <span style={{ fontSize: '12px', fontWeight: '400', color: '#457bb5' }} className="dark:text-[#f8fafc]">
            Santa Cruz, CA
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        <aside 
          className={`transition-all duration-300 border-r border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
        >
          <div className="p-6 space-y-8 min-w-[256px]">
            <div>
              <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }} className="mb-4">Species Filter</h6>
              <div className="space-y-2">
                {['All', ...SPECIES].map(s => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="species" 
                      checked={activeFilters.species === s}
                      onChange={() => setActiveFilters(prev => ({ ...prev, species: s }))}
                      className="w-4 h-4 accent-[#598dc5]"
                    />
                    <span style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1] group-hover:text-[#598dc5] transition-colors">
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }} className="mb-4">Condition Status</h6>
              <div className="space-y-2">
                {['All', ...STATUSES].map(st => (
                  <label key={st} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={activeFilters.status === st || (activeFilters.status === 'All' && st === 'All')}
                      onChange={() => setActiveFilters(prev => ({ ...prev, status: st }))}
                      className="w-4 h-4 accent-[#598dc5] rounded"
                    />
                    <span style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1] group-hover:text-[#598dc5] transition-colors">
                      {st}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] dark:bg-[#121212]">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <KPICard title="Total Inventory" value={kpis.total} subtitle="Inventoried Trees" />
            <KPICard title="Canopy Health" value={`${kpis.healthRate}%`} subtitle="Healthy Status" />
            <KPICard title="Avg Size (DBH)" value={`${kpis.avgDbh}"`} subtitle="Inches in Diameter" />
            <KPICard title="Average Age" value={`${kpis.avgAge}y`} subtitle="Years since planting" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Map Visual (Scatter plot as mock map) */}
            <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-5">
              <div className="flex justify-between items-center mb-6">
                <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">Tree Distribution Map</h5>
                <span className="text-[10px] uppercase text-[#94a3b8]">Grid: Santa Cruz Coordinates</span>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis type="number" dataKey="lng" name="Longitude" domain={[-122.06, -122.01]} hide />
                    <YAxis type="number" dataKey="lat" name="Latitude" domain={[36.95, 36.99]} hide />
                    <ZAxis type="number" dataKey="dbh" range={[50, 400]} name="Size" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Trees" data={filteredData}>
                      {filteredData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-4 justify-center">
                {STATUSES.map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(s) }}></div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Species Breakdown */}
            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-5">
              <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#dbdbdb] mb-6">Species Breakdown</h5>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speciesStats} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px', fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      itemStyle={{ color: '#598dc5' }}
                    />
                    <Bar dataKey="value" fill="#62a8ea" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Data Table */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] overflow-hidden">
            <div className="p-5 border-b border-[#e2e8f0] dark:border-[#1e293b]">
              <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">Tree Inventory List</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-[#1a1a1a]">
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>ID</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Species</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Status</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Size (DBH)</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Age</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Planted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                  {filteredData.slice(0, 15).map((tree) => (
                    <tr key={tree.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors">
                      <td className="px-6 py-3 font-mono" style={{ fontSize: '14px', color: '#657281' }}>{tree.id}</td>
                      <td className="px-6 py-3" style={{ fontSize: '14px', color: '#657281' }}>{tree.species}</td>
                      <td className="px-6 py-3">
                        <span 
                          className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{ 
                            backgroundColor: `${getStatusColor(tree.status)}15`,
                            color: getStatusColor(tree.status)
                          }}
                        >
                          {tree.status}
                        </span>
                      </td>
                      <td className="px-6 py-3" style={{ fontSize: '14px', color: '#657281' }}>{tree.dbh}"</td>
                      <td className="px-6 py-3" style={{ fontSize: '14px', color: '#657281' }}>{tree.age} yrs</td>
                      <td className="px-6 py-3" style={{ fontSize: '14px', color: '#657281' }}>{tree.plantedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-[#e2e8f0] dark:border-[#1e293b] text-center">
                <button 
                  className="px-4 py-2 bg-[#ffffff] dark:bg-[#262626] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[5px] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]"
                  style={{ fontSize: '14px', fontWeight: '500', color: '#598dc5' }}
                >
                  View All Trees
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}