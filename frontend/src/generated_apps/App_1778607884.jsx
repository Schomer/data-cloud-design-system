import React, { useState, useMemo } from 'react';
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
  Pie,
  Legend
} from 'recharts';

/**
 * SaaS Subscription Audit Dashboard
 * A functional utility for monitoring software spend and usage.
 */

// --- DATA GENERATION ---
const SAAS_NAMES = [
  'Slack', 'Zoom', 'Salesforce', 'Figma', 'AWS', 'GCP', 'Linear', 'GitHub', 'Datadog', 
  'Notion', 'Intercom', 'Miro', 'Loom', 'Vercel', 'Postmark', 'Sentry', 'Segment', 
  'HubSpot', 'Zendesk', 'Asana'
];

const USAGE_LEVELS = ['High', 'Medium', 'Low'];
const BILLING_FREQS = ['Monthly', 'Annual'];

const generateMockData = () => {
  return Array.from({ length: 200 }, (_, i) => {
    const name = SAAS_NAMES[Math.floor(Math.random() * SAAS_NAMES.length)];
    const freq = BILLING_FREQS[Math.floor(Math.random() * BILLING_FREQS.length)];
    const cost = freq === 'Monthly' ? (Math.random() * 200 + 10) : (Math.random() * 2400 + 100);
    const usage = USAGE_LEVELS[Math.floor(Math.random() * USAGE_LEVELS.length)];

    // Random date in the next 12 months
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + Math.floor(Math.random() * 12));
    renewalDate.setDate(Math.floor(Math.random() * 28) + 1);

    return {
      id: i + 1,
      name: `${name} - Workspace ${Math.floor(Math.random() * 100)}`,
      cost: parseFloat(cost.toFixed(2)),
      frequency: freq,
      renewalDate: renewalDate.toISOString().split('T')[0],
      usage: usage,
    };
  });
};

const INITIAL_DATA = generateMockData();

// --- COMPONENTS ---

const Card = ({ title, value, subtext }) => (
  <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-[20px] flex flex-col justify-between shadow-sm">
    <span style={{ fontSize: '12px', fontWeight: '400', color: '#64748b' }} className="dark:text-[#94a3b8] uppercase tracking-wider mb-2">
      {title}
    </span>
    <span style={{ fontSize: '30px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#f8fafc]">
      {value}
    </span>
    {subtext && (
      <span style={{ fontSize: '12px', fontWeight: '400', color: '#64748b' }} className="mt-2">
        {subtext}
      </span>
    )}
  </div>
);

export default function SaasSubscriptionAudit() {
  const [subscriptions, setSubscriptions] = useState(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [usageFilter, setUsageFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Form State
  const [newSub, setNewSub] = useState({
    name: '',
    cost: '',
    frequency: 'Monthly',
    renewalDate: '',
    usage: 'Medium'
  });

  // Filter Logic
  const filteredData = useMemo(() => {
    return subscriptions.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase());
      const matchesUsage = usageFilter === 'All' || sub.usage === usageFilter;
      return matchesSearch && matchesUsage;
    });
  }, [subscriptions, search, usageFilter]);

  // KPI Calculations
  const totalAnnualSpend = useMemo(() => {
    return filteredData.reduce((acc, curr) => {
      return acc + (curr.frequency === 'Monthly' ? curr.cost * 12 : curr.cost);
    }, 0);
  }, [filteredData]);

  const avgMonthlySpend = totalAnnualSpend / 12;

  const upcomingRenewals = useMemo(() => {
    const today = new Date();
    const next30 = new Date();
    next30.setDate(today.getDate() + 30);
    return filteredData.filter(sub => {
      const d = new Date(sub.renewalDate);
      return d >= today && d <= next30;
    }).length;
  }, [filteredData]);

  // Chart Data
  const usageDistribution = useMemo(() => {
    return USAGE_LEVELS.map(level => ({
      name: level,
      count: filteredData.filter(d => d.usage === level).length,
      spend: filteredData.filter(d => d.usage === level).reduce((a, b) => a + (b.frequency === 'Monthly' ? b.cost * 12 : b.cost), 0)
    }));
  }, [filteredData]);

  const frequencyBreakdown = useMemo(() => {
    return BILLING_FREQS.map(f => ({
      name: f,
      value: filteredData.filter(d => d.frequency === f).length
    }));
  }, [filteredData]);

  const handleAddSubscription = (e) => {
    e.preventDefault();
    if (!newSub.name || !newSub.cost || !newSub.renewalDate) return;

    const item = {
      ...newSub,
      id: subscriptions.length + 1,
      cost: parseFloat(newSub.cost)
    };
    setSubscriptions([item, ...subscriptions]);
    setIsModalOpen(false);
    setNewSub({ name: '', cost: '', frequency: 'Monthly', renewalDate: '', usage: 'Medium' });
  };

  const COLORS = ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4"];

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col font-inter transition-colors duration-200">
      {/* Top Header */}
      <header className="h-[64px] border-b border-[#e2e8f0] dark:border-[#1e293b] px-6 flex items-center justify-between bg-[#ffffff] dark:bg-[#1a1a1a] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] rounded-md transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#475569] dark:text-[#cbd5e1]">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
            SaaS Subscription Audit
          </h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            backgroundColor: '#598dc5', 
            borderRadius: '5px', 
            padding: '8px 16px', 
            color: '#ffffff',
            fontWeight: '500',
            fontSize: '14px'
          }}
          className="hover:bg-[#054aa3] transition-colors"
        >
          Add Subscription
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-[#ffffff] dark:bg-[#1a1a1a] border-r border-[#e2e8f0] dark:border-[#1e293b] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[280px]' : 'w-0'} overflow-hidden`}
        >
          <div className="p-6 space-y-8 w-[280px]">
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }} className="block mb-3 dark:text-[#94a3b8] uppercase tracking-wide">
                Search Vendors
              </label>
              <input 
                type="text"
                placeholder="Find subscription..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] focus:ring-2 focus:ring-[#3b82f6] outline-none"
              />
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }} className="block mb-3 dark:text-[#94a3b8] uppercase tracking-wide">
                Usage Frequency
              </label>
              <div className="space-y-2">
                {['All', ...USAGE_LEVELS].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="usage" 
                      checked={usageFilter === level}
                      onChange={() => setUsageFilter(level)}
                      className="w-4 h-4 accent-[#598dc5]"
                    />
                    <span style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1] group-hover:text-[#598dc5] transition-colors">
                      {level}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card 
              title="Total Annual Spend" 
              value={`$${totalAnnualSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              subtext="Projected yearly software budget"
            />
            <Card 
              title="Avg. Monthly" 
              value={`$${avgMonthlySpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              subtext="Combined recurring monthly burn"
            />
            <Card 
              title="Active Licenses" 
              value={filteredData.length}
              subtext={`${filteredData.filter(d => d.usage === 'High').length} high-usage apps`}
            />
            <Card 
              title="Next 30 Days Renewals" 
              value={upcomingRenewals}
              subtext="Subscriptions requiring review"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Spend by Usage Level */}
            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6">
              <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb] mb-6">
                Annual Spend by Usage Level
              </h5>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="spend" radius={[0, 4, 4, 0]} barSize={40}>
                      {usageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Billing Frequency */}
            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6">
              <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb] mb-6">
                Billing Cycle Distribution
              </h5>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={frequencyBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {frequencyBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] overflow-hidden">
            <div className="p-6 border-b border-[#e2e8f0] dark:border-[#1e293b] flex justify-between items-center">
              <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                Subscription Registry
              </h5>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Showing {filteredData.length} records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-[#1e293b]">
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Vendor Name</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Cost</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Frequency</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Renewal Date</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#457bba' }}>Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                  {filteredData.slice(0, 15).map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors group">
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1]">{sub.name}</td>
                      <td className="px-6 py-4 font-mono" style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1]">${sub.cost.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[12px] ${sub.frequency === 'Annual' ? 'bg-[#ebf5ff] text-[#457bb5]' : 'bg-[#dae4f1] text-[#64748b]'}`}>
                          {sub.frequency}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1]">{sub.renewalDate}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-2 text-[14px] ${
                          sub.usage === 'High' ? 'text-[#10b981]' : sub.usage === 'Medium' ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            sub.usage === 'High' ? 'bg-[#10b981]' : sub.usage === 'Medium' ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                          }`} />
                          {sub.usage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length > 15 && (
                <div className="p-4 text-center border-t border-[#f1f5f9] dark:border-[#262626]">
                  <span style={{ fontSize: '12px', color: '#94a3b8' }} className="italic">
                    Scroll for more - {filteredData.length - 15} additional records hidden in view
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal / Overlay for Adding Subscription */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-[#e2e8f0] dark:border-[#1e293b] flex justify-between items-center">
              <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                Audit New Subscription
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94a3b8] hover:text-[#5c5c5c]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleAddSubscription} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Vendor Name</label>
                  <input 
                    required
                    type="text" 
                    value={newSub.name}
                    onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                    placeholder="e.g. Figma Pro"
                    className="w-full bg-transparent border border-[#e2e8f0] dark:border-[#1e293b] rounded-md px-3 py-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] focus:ring-1 focus:ring-[#598dc5] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#94a3b8]">$</span>
                    <input 
                      required
                      type="number" 
                      value={newSub.cost}
                      onChange={(e) => setNewSub({...newSub, cost: e.target.value})}
                      className="w-full bg-transparent border border-[#e2e8f0] dark:border-[#1e293b] rounded-md pl-7 pr-3 py-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Frequency</label>
                  <select 
                    value={newSub.frequency}
                    onChange={(e) => setNewSub({...newSub, frequency: e.target.value})}
                    className="w-full bg-transparent border border-[#e2e8f0] dark:border-[#1e293b] rounded-md px-3 py-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Next Renewal</label>
                  <input 
                    required
                    type="date" 
                    value={newSub.renewalDate}
                    onChange={(e) => setNewSub({...newSub, renewalDate: e.target.value})}
                    className="w-full bg-transparent border border-[#e2e8f0] dark:border-[#1e293b] rounded-md px-3 py-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Usage</label>
                  <select 
                    value={newSub.usage}
                    onChange={(e) => setNewSub({...newSub, usage: e.target.value})}
                    className="w-full bg-transparent border border-[#e2e8f0] dark:border-[#1e293b] rounded-md px-3 py-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] outline-none"
                  >
                    {USAGE_LEVELS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="submit"
                  style={{ backgroundColor: '#598dc5', color: '#ffffff' }}
                  className="flex-1 py-2 rounded-md font-medium text-[14px] hover:bg-[#054aa3] transition-colors"
                >
                  Confirm Audit
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-[#f1f5f9] dark:bg-[#1e293b] text-[#475569] dark:text-[#cbd5e1] rounded-md font-medium text-[14px] hover:bg-[#e2e8f0]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}