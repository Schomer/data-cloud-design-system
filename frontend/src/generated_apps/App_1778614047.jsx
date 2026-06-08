import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Table as TableIcon,
  BarChart3,
  GitMerge,
  Download,
  Filter,
  Save,
  Edit3,
  Check,
  X,
  Settings2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

/**
 * DataWranglerStudio - A comprehensive React app for viewing and manipulating order data.
 * Features: Inline editing, dynamic column creation, searching, merging, and analytics.
 */
export default function DataWranglerStudio() {
  // --- MOCK DATA GENERATION ---
  const generateInitialData = () => {
    const statuses = ['Cancelled', 'Shipped', 'Delivered', 'Processing', 'Returned'];
    return Array.from({ length: 200 }, (_, i) => ({
      id: 30000 + i,
      order_id: 1000 + i,
      user_id: 500 + Math.floor(Math.random() * 50),
      inventory_item_id: 5000 + Math.floor(Math.random() * 100),
      sale_price: parseFloat((Math.random() * 200 + 5).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      shipped_at: Math.random() > 0.3 ? new Date().toISOString().split('T')[0] : null,
    }));
  };

  const productData = Array.from({ length: 100 }, (_, i) => ({
    inventory_item_id: 5000 + i,
    product_name: `Product ${String.fromCharCode(65 + (i % 26))}${i}`,
    category: ['Electronics', 'Apparel', 'Home', 'Beauty'][Math.floor(Math.random() * 4)]
  }));

  // --- STATE ---
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    'id', 'order_id', 'user_id', 'inventory_item_id', 'sale_price', 'status', 'created_at'
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState(null); // { rowIndex, colKey }
  const [view, setView] = useState('table'); // 'table' | 'analytics'
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isAddColModalOpen, setIsAddColModalOpen] = useState(false);
  const [newColConfig, setNewColConfig] = useState({ name: '', multiplier: 1 });

  // Load initial data
  useEffect(() => {
    setData(generateInitialData());
  }, []);

  // --- HANDLERS ---
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredData = useMemo(() => {
    return data.filter(row =>
      Object.values(row).some(val =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const updateCellValue = (rowIndex, colKey, newValue) => {
    const newData = [...data];
    // Find the actual index in the full 'data' array
    const actualIndex = data.indexOf(filteredData[rowIndex]);
    if (actualIndex > -1) {
      newData[actualIndex][colKey] = colKey === 'sale_price' ? parseFloat(newValue) : newValue;
      setData(newData);
    }
    setEditingCell(null);
  };

  const deleteRow = (rowIndex) => {
    const actualIndex = data.indexOf(filteredData[rowIndex]);
    const newData = data.filter((_, i) => i !== actualIndex);
    setData(newData);
  };

  const addNewColumn = () => {
    if (!newColConfig.name) return;
    const colName = newColConfig.name.toLowerCase().replace(/\s+/g, '_');
    setColumns([...columns, colName]);
    setData(data.map(row => ({
      ...row,
      [colName]: parseFloat((row.sale_price * (newColConfig.multiplier || 1)).toFixed(2))
    })));
    setIsAddColModalOpen(false);
    setNewColConfig({ name: '', multiplier: 1 });
  };

  const performMerge = () => {
    const mergedData = data.map(row => {
      const product = productData.find(p => p.inventory_item_id === row.inventory_item_id);
      return {
        ...row,
        product_name: product ? product.product_name : 'N/A',
        category: product ? product.category : 'General'
      };
    });
    if (!columns.includes('product_name')) {
      setColumns([...columns, 'product_name', 'category']);
    }
    setData(mergedData);
    setIsMergeModalOpen(false);
  };

  // --- ANALYTICS DATA ---
  const statusStats = useMemo(() => {
    const counts = {};
    data.forEach(d => counts[d.status] = (counts[d.status] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const priceDistribution = useMemo(() => {
    const bins = Array(10).fill(0);
    data.forEach(d => {
      const idx = Math.min(Math.floor(d.sale_price / 20), 9);
      bins[idx]++;
    });
    return bins.map((val, i) => ({ range: `$${i * 20}-${(i + 1) * 20}`, count: val }));
  }, [data]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Settings2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">WranglePro Studio</h1>
            <p className="text-xs text-slate-500 font-medium">Dataset: ecomm.order_items • {data.length} records</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search across all fields..."
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button 
            onClick={() => setView('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'table' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'}`}
          >
            <TableIcon size={18} /> Table
          </button>
          <button 
            onClick={() => setView('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'analytics' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'}`}
          >
            <BarChart3 size={18} /> Analytics
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transformations</label>
            <div className="mt-4 flex flex-col gap-2">
              <button 
                onClick={() => setIsAddColModalOpen(true)}
                className="flex items-center gap-2 w-full p-3 text-left rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-sm font-medium"
              >
                <Plus size={18} className="text-emerald-500" /> Create Column
              </button>
              <button 
                onClick={() => setIsMergeModalOpen(true)}
                className="flex items-center gap-2 w-full p-3 text-left rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-sm font-medium"
              >
                <GitMerge size={18} className="text-indigo-500" /> Merge Products
              </button>
              <button className="flex items-center gap-2 w-full p-3 text-left rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-sm font-medium opacity-50 cursor-not-allowed">
                <Filter size={18} className="text-orange-500" /> Add Filter
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Export</label>
            <div className="mt-4 flex flex-col gap-2">
              <button className="flex items-center gap-2 w-full p-3 text-left rounded-xl bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-all text-sm font-medium">
                <Download size={18} /> Download CSV
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-900">Pro Tip</p>
              <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                Double-click any cell in the table to edit its value directly.
              </p>
            </div>
          </div>
        </aside>

        {/* Workspace */}
        <section className="flex-1 p-8 overflow-auto relative bg-slate-50">
          {view === 'table' ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-full">
              <div className="overflow-auto">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead className="sticky top-0 bg-slate-50 z-20">
                    <tr>
                      <th className="px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">Actions</th>
                      {columns.map(col => (
                        <th key={col} className="px-6 py-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {col.replace('_', ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button 
                            onClick={() => deleteRow(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                        {columns.map(col => (
                          <td 
                            key={col} 
                            className="px-6 py-3 text-sm text-slate-600"
                            onDoubleClick={() => setEditingCell({ rowIndex: idx, colKey: col })}
                          >
                            {editingCell?.rowIndex === idx && editingCell?.colKey === col ? (
                              <div className="flex items-center gap-1">
                                <input
                                  autoFocus
                                  className="border-2 border-indigo-500 rounded px-2 py-1 w-full outline-none text-sm"
                                  defaultValue={row[col]}
                                  onBlur={(e) => updateCellValue(idx, col, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') updateCellValue(idx, col, e.target.value);
                                    if (e.key === 'Escape') setEditingCell(null);
                                  }}
                                />
                              </div>
                            ) : (
                              <span className="cursor-text">
                                {col === 'sale_price' ? `$${row[col]}` : String(row[col])}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 h-full">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 flex flex-col h-[450px]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                  Price Distribution
                </h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceDistribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {priceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 flex flex-col h-[450px]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                  Order Status Breakdown
                </h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusStats}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#64748b'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-span-2 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Ready to Deploy?</h3>
                  <p className="text-slate-400 max-w-lg mb-6">Your data transformations are held in a virtual state. Export your work to apply these changes permanently to your BigQuery production instance.</p>
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                    <Save size={18} /> Commit to Production
                  </button>
                </div>
                <GitMerge className="absolute right-[-40px] bottom-[-40px] text-white/5 w-96 h-96 pointer-events-none rotate-12" />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* --- MODALS --- */}

      {/* Create Column Modal */}
      {isAddColModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Create New Column</h2>
            <p className="text-sm text-slate-500 mb-6">Apply a simple calculation to create a new virtual field based on sale price.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Column Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tax Amount" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={newColConfig.name}
                  onChange={(e) => setNewColConfig({...newColConfig, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Multiplier (of Sale Price)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="e.g. 0.08" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={newColConfig.multiplier}
                  onChange={(e) => setNewColConfig({...newColConfig, multiplier: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsAddColModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={addNewColumn}
                className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merge Modal */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <GitMerge size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Join with Product Metadata</h2>
            <p className="text-sm text-slate-500 mb-6">
              We'll match your <span className="font-mono bg-slate-100 px-1">inventory_item_id</span> with our Master Product Catalog to pull in Product Names and Categories.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                <span>Join Type</span>
                <span className="text-indigo-600">Left Outer Join</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-full h-2 bg-indigo-200 rounded-full"></div>
                <div className="w-24 h-2 bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsMergeModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={performMerge}
                className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Start Merge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}