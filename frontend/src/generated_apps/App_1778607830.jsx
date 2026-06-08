import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area
} from 'recharts';

/**
 * SaaSPerformanceAudit Component
 * A robust dashboard for tracking recurring software costs and usage value.
 */
export default function SaaSPerformanceAudit() {
  // --- MOCK DATA GENERATION ---
  const generateInitialData = () => {
    const apps = [
      { name: 'AWS', cost: 1200, freq: 'Monthly', usage: 'High', category: 'Infrastructure' },
      { name: 'GitHub Enterprise', cost: 2500, freq: 'Annual', usage: 'High', category: 'DevTools' },
      { name: 'Slack', cost: 450, freq: 'Monthly', usage: 'High', category: 'Productivity' },
      { name: 'Zoom', cost: 150, freq: 'Monthly', usage: 'Medium', category: 'Productivity' },
      { name: 'Adobe CC', cost: 600, freq: 'Annual', usage: 'Low', category: 'Design' },
      { name: 'Figma', cost: 45, freq: 'Monthly', usage: 'High', category: 'Design' },
      { name: 'Datadog', cost: 800, freq: 'Monthly', usage: 'High', category: 'Monitoring' },
      { name: 'Salesforce', cost: 5000, freq: 'Annual', usage: 'Medium', category: 'Sales' },
      { name: 'Intercom', cost: 200, freq: 'Monthly', usage: 'Low', category: 'Support' },
      { name: 'Notion', cost: 20, freq: 'Monthly', usage: 'High', category: 'Productivity' },
      { name: 'Jira', cost: 120, freq: 'Monthly', usage: 'Medium', category: 'DevTools' },
      { name: 'Vercel', cost: 50, freq: 'Monthly', usage: 'High', category: 'Infrastructure' }
    ];

    return Array.from({ length: 200 }, (_, i) => {
      const baseApp = apps[i % apps.length];
      const randomDate = new Date();
      randomDate.setMonth(randomDate.getMonth() + (i % 12));
      randomDate.setDate(1 + (i % 28));

      return {
        id: `sub-${i}`,
        name: i < apps.length ? baseApp.name : `${baseApp.name} #${Math.floor(i / apps.length)}`,
        cost: Math.round(baseApp.cost * (0.8 + Math.random() * 0.4)),
        frequency: baseApp.freq,
        nextRenewal: randomDate.toISOString().split('T')[0],
        usage: baseApp.usage,
        category: baseApp.category
      };
    });
  };

  const [subscriptions, setSubscriptions] = useState(generateInitialData());
  const [filter, setFilter] = useState('');
  const [usageFilter, setUsageFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Subscription Form State
  const [newSub, setNewSub] = useState({
    name: '',
    cost: '',
    frequency: 'Monthly',
    nextRenewal: '',
    usage: 'Medium',
    category: 'General'
  });

  // --- CALCULATIONS ---
  const stats = useMemo(() => {
    const monthlyTotal = subscriptions.reduce((acc, sub) => {
      const amount = parseFloat(sub.cost);
      return acc + (sub.frequency === 'Monthly' ? amount : amount / 12);
    }, 0);

    const highWaste = subscriptions.filter(s => s.usage === 'Low').length;
    const upcomingRenewals = subscriptions.filter(s => {
      const days = (new Date(s.nextRenewal) - new Date()) / (1000 * 60 * 60 * 24);
      return days > 0 && days <= 30;
    }).length;

    return {
      monthlyBurn: monthlyTotal,
      annualBurn: monthlyTotal * 12,
      wasteCount: highWaste,
      upcomingCount: upcomingRenewals
    };
  }, [subscriptions]);

  const chartData = useMemo(() => {
    const groups = subscriptions.reduce((acc, sub) => {
      acc[sub.usage] = (acc[sub.usage] || 0) + (sub.frequency === 'Monthly' ? sub.cost : sub.cost / 12);
      return acc;
    }, {});

    return [
      { name: 'High Usage', value: Math.round(groups['High'] || 0), color: '#10b981' },
      { name: 'Medium Usage', value: Math.round(groups['Medium'] || 0), color: '#f59e0b' },
      { name: 'Low Usage', value: Math.round(groups['Low'] || 0), color: '#ef4444' }
    ];
  }, [subscriptions]);

  const timelineData = useMemo(() => {
    // Generate 12 month forecast
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(m => ({
      name: m,
      spend: Math.round(stats.monthlyBurn * (0.95 + Math.random() * 0.1))
    }));
  }, [stats.monthlyBurn]);

  // --- ACTIONS ---
  const addSubscription = (e) => {
    e.preventDefault();
    if (!newSub.name || !newSub.cost) return;

    const id = `sub-${Date.now()}`;
    setSubscriptions([ { ...newSub, id, cost: parseFloat(newSub.cost) }, ...subscriptions]);
    setNewSub({ name: '', cost: '', frequency: 'Monthly', nextRenewal: '', usage: 'Medium', category: 'General' });
    setIsAddModalOpen(false);
  };

  const deleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const filteredSubs = subscriptions.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(filter.toLowerCase());
    const matchesUsage = usageFilter === 'All' || s.usage === usageFilter;
    return matchesSearch && matchesUsage;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SaaS Subscription Audit</h1>
          <p className="text-slate-500">Analyze your cloud footprint and optimize recurring expenses.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Add Subscription
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><TrendingUp size={24} /></div>
            <span className="text-sm font-medium text-slate-500">Monthly Burn</span>
          </div>
          <div className="text-2xl font-bold">${stats.monthlyBurn.toLocaleString()}</div>
          <div className="text-xs text-indigo-600 mt-1 font-medium">↑ 4.2% from last month</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={24} /></div>
            <span className="text-sm font-medium text-slate-500">Annual Run-rate</span>
          </div>
          <div className="text-2xl font-bold">${stats.annualBurn.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Projected FY2026 spend</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={24} /></div>
            <span className="text-sm font-medium text-slate-500">Underutilized</span>
          </div>
          <div className="text-2xl font-bold">{stats.wasteCount} Apps</div>
          <div className="text-xs text-amber-600 mt-1 font-medium">Marked as Low Usage</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Clock size={24} /></div>
            <span className="text-sm font-medium text-slate-500">Renewals</span>
          </div>
          <div className="text-2xl font-bold">{stats.upcomingCount} Total</div>
          <div className="text-xs text-purple-600 mt-1 font-medium">Due in next 30 days</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Visualizations */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600" />
            Spend Forecast
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Total Spend']}
                />
                <Area type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Filter size={20} className="text-indigo-600" />
            Spend by Usage
          </h2>
          <div className="h-64 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              {chartData.map((item) => (
                <div key={item.name} className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{item.name}</div>
                  <div className="text-sm font-bold" style={{color: item.color}}>${item.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Inventory */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold">Subscription Inventory</h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <select 
              className="bg-slate-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              value={usageFilter}
              onChange={(e) => setUsageFilter(e.target.value)}
            >
              <option value="All">All Usage</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">SaaS Tool</th>
                <th className="px-6 py-4">Cost</th>
                <th className="px-6 py-4">Billing</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Next Renewal</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubs.slice(0, 50).map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{sub.name}</div>
                        <div className="text-[10px] text-slate-400">{sub.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">${sub.cost.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      sub.frequency === 'Monthly' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {sub.frequency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        sub.usage === 'High' ? 'bg-emerald-500' : sub.usage === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span className="text-sm font-medium">{sub.usage}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} />
                      {new Date(sub.nextRenewal).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteSubscription(sub.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSubs.length > 50 && (
            <div className="p-4 text-center text-slate-400 text-xs italic bg-slate-50">
              Showing top 50 of {filteredSubs.length} subscriptions.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="text-xl font-bold">New SaaS Entry</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="hover:rotate-90 transition-transform">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={addSubscription} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Software Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Adobe Creative Cloud"
                  value={newSub.name}
                  onChange={e => setNewSub({...newSub, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cost</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      type="number" 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="0.00"
                      value={newSub.cost}
                      onChange={e => setNewSub({...newSub, cost: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Billing</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={newSub.frequency}
                    onChange={e => setNewSub({...newSub, frequency: e.target.value})}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Usage</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={newSub.usage}
                    onChange={e => setNewSub({...newSub, usage: e.target.value})}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. Design"
                    value={newSub.category}
                    onChange={e => setNewSub({...newSub, category: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Renewal Date</label>
                <input 
                  required
                  type="date" 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newSub.nextRenewal}
                  onChange={e => setNewSub({...newSub, nextRenewal: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 mt-4"
              >
                Create Audit Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}