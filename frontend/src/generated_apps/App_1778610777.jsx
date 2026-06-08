import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  User, 
  TrendingUp, 
  Search, 
  EyeOff, 
  DollarSign,
  Trophy,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

/**
 * SalesCommissionLeaderboard Component
 * 
 * Features:
 * 1. Role-based Visibility: Toggle between Manager and Representative.
 * 2. Identity Verification: Representatives must input their name to unlock their row.
 * 3. Dynamic Leaderboard: Rankings based on Total Sales.
 * 4. Data Protection: Blurs sensitive commission/notes for peers.
 * 5. Robust Mock Data: 200 dynamically generated records.
 */
export default function SalesCommissionLeaderboard() {
  const [userRole, setUserRole] = useState('Regional Manager'); // 'Regional Manager' | 'Sales Representative'
  const [repIdentity, setRepIdentity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');

  // 1. Generate Robust Mock Data
  const salesData = useMemo(() => {
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const regions = ['North America', 'EMEA', 'APAC', 'LATAM'];
    const notesPool = [
      "Consistent closer, exceeds monthly target.",
      "Developing strong pipeline for Q3.",
      "High client retention rate.",
      "Needs focus on enterprise-level deals.",
      "Exceptional performance in APAC market.",
      "Lead generation improved by 20%.",
      "Struggling with CRM compliance.",
      "Top performer for three consecutive months."
    ];

    return Array.from({ length: 200 }, (_, i) => {
      const name = `${firstNames[i % 10]} ${lastNames[Math.floor(i / 20) % 10]} ${i + 1}`;
      const region = regions[i % 4];
      const sales = Math.floor(Math.random() * 85000) + 15000;
      const commissionRate = region === 'North America' ? 0.12 : 0.10;

      return {
        id: i + 1,
        name,
        region,
        totalSales: sales,
        commission: Math.floor(sales * commissionRate),
        notes: notesPool[i % notesPool.length],
        rank: 0 // Will be calculated after sorting
      };
    })
    .sort((a, b) => b.totalSales - a.totalSales)
    .map((item, index) => ({ ...item, rank: index + 1 }));
  }, []);

  // 2. Filter Logic
  const filteredData = useMemo(() => {
    return salesData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = regionFilter === 'All' || item.region === regionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [salesData, searchQuery, regionFilter]);

  // 3. Top Performers for Chart
  const topPerformers = useMemo(() => {
    return salesData.slice(0, 10);
  }, [salesData]);

  // 4. Visibility Logic Helper
  const canViewSensitive = (repName) => {
    if (userRole === 'Regional Manager') return true;
    if (userRole === 'Sales Representative' && repIdentity.trim().toLowerCase() === repName.toLowerCase()) return true;
    return false;
  };

  const isSelf = (repName) => {
    return userRole === 'Sales Representative' && repIdentity.trim().toLowerCase() === repName.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      {/* Header & Controls */}
      <div className="max-w-7xl mx-auto mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="text-amber-500 w-8 h-8" />
              Sales Commission Leaderboard
            </h1>
            <p className="text-slate-500 mt-1">Real-time performance tracking and commission analysis.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400 ml-1">Simulated User Role</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setUserRole('Regional Manager')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${userRole === 'Regional Manager' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ShieldCheck size={18} />
                  Manager
                </button>
                <button 
                  onClick={() => {
                    setUserRole('Sales Representative');
                    setRepIdentity(''); // Reset identity for security simulation
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${userRole === 'Sales Representative' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <User size={18} />
                  Sales Rep
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Identity Prompt for Sales Reps */}
        {userRole === 'Sales Representative' && (
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-6 transition-all animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-full">
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Identity Verification Required</h3>
                <p className="text-blue-100 text-sm">Please enter your full name exactly as it appears in the system to view your commission data.</p>
              </div>
            </div>
            <div className="w-full md:w-80">
              <input 
                type="text"
                placeholder="Example: James Smith 1"
                value={repIdentity}
                onChange={(e) => setRepIdentity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Global Sales</p>
                <h4 className="text-2xl font-bold mt-1 text-slate-800">$11,402,300</h4>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="mt-4 text-xs text-emerald-600 font-semibold">+12.5% from last month</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Top Regional Margin</p>
                <h4 className="text-2xl font-bold mt-1 text-slate-800">12.0%</h4>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Filter size={20} />
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-600 font-semibold">North America Region</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Reps Active</p>
                <h4 className="text-2xl font-bold mt-1 text-slate-800">200</h4>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4 text-xs text-purple-600 font-semibold">98.5% Quota Achievement</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={20} />
            Top 10 Performers
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPerformers}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="totalSales" radius={[4, 4, 0, 0]}>
                  {topPerformers.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={isSelf(entry.name) ? '#2563eb' : '#94a3b8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-800">Full Performance Dataset</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search Rep Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
              <select 
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">All Regions</option>
                <option value="North America">North America</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
                <option value="LATAM">LATAM</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rep Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales ($)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commission ($)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((rep) => {
                  const isVisible = canViewSensitive(rep.name);
                  const isRowSelf = isSelf(rep.name);

                  return (
                    <tr 
                      key={rep.id} 
                      className={`group hover:bg-slate-50 transition-colors ${isRowSelf ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                          rep.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {rep.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            isRowSelf ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {rep.name.charAt(0)}
                          </div>
                          <div>
                            <span className={`font-semibold ${isRowSelf ? 'text-blue-700' : 'text-slate-700'}`}>
                              {rep.name}
                            </span>
                            {isRowSelf && <span className="ml-2 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full uppercase">You</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">
                          {rep.region}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-slate-700">
                        ${rep.totalSales.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {isVisible ? (
                          <div className="flex items-center gap-1 text-emerald-600 font-bold font-mono">
                            <DollarSign size={14} />
                            {rep.commission.toLocaleString()}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-300 blur-[4px] select-none">
                            <EyeOff size={14} />
                            $00,000
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isVisible ? (
                          <span className="text-sm text-slate-600 line-clamp-1 italic">
                            "{rep.notes}"
                          </span>
                        ) : (
                          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse opacity-50"></div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-block p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                <Search size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-700">No Representatives Found</h4>
              <p className="text-slate-500">Adjust your filters or search query to find the data you're looking for.</p>
            </div>
          )}

          <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              Displaying {filteredData.length} of 200 Total Records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}