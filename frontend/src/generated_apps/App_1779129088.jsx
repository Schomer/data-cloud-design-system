import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  RefreshCcw, 
  Search, 
  Filter, 
  Calendar,
  ChevronDown,
  MoreVertical
} from 'lucide-react';

/**
 * ECommerce Operations Dashboard
 * Built for Malloy-Data Ecomm dataset
 */

// Theme & Typography Constants from Visual Spec
const THEME = {
  light: {
    bg: "#ffffff",
    bgSecondary: "#e2e8f0",
    text: "#5c5c5c",
    textSecondary: "#475569",
    border: "#e2e8f0",
    primary: "#598dc5",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"]
  },
  dark: {
    bg: "#1a1a1a",
    bgSecondary: "#1e293b",
    text: "#dbdbdb",
    textSecondary: "#cbd5e1",
    border: "#1e293b",
    primary: "#5aa1d8",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"]
  }
};

const TYPOGRAPHY = {
  h2: { fontSize: '30px', fontWeight: '600', lineHeight: '1.25' },
  h4: { fontSize: '20px', fontWeight: '600', lineHeight: '1.375' },
  h6: { fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  p: { fontSize: '14px', fontWeight: '400', lineHeight: '1.6' },
  small: { fontSize: '12px', fontWeight: '400' },
  kpi: { fontSize: '28px', fontWeight: '700' }
};

export default function EcommDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Generate Realistic Mock Data based on BigQuery results
  // Revenue: ~$7.8M, Orders: ~164k, AOV: ~$46
  const kpis = [
    { label: 'Total Revenue', value: '$7,789,857', change: '+12.5%', icon: DollarSign, color: '#62a8ea' },
    { label: 'Total Orders', value: '164,358', change: '+8.2%', icon: Package, color: '#aaa47c' },
    { label: 'Avg Order Value', value: '$46.15', change: '-1.4%', icon: TrendingUp, color: '#a8d95e' },
    { label: 'Return Rate', value: '1.03%', change: '+0.2%', icon: RefreshCcw, color: '#ef4444' }
  ];

  const trendData = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: 400000 + Math.random() * 200000 + (i * 15000),
    orders: 8000 + Math.random() * 3000 + (i * 500)
  })), []);

  const statusData = [
    { name: 'Complete', value: 158939, color: '#62a8ea' },
    { name: 'Cancelled', value: 5949, color: '#ef4444' },
    { name: 'Returned', value: 1690, color: '#f59e0b' },
    { name: 'Shipped', value: 1310, color: '#10b981' },
    { name: 'Processing', value: 907, color: '#7375c9' }
  ];

  const recentOrders = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: 295950 - i,
    orderId: 295949 - i,
    customer: `User ${102496 - i}`,
    amount: (25 + Math.random() * 150).toFixed(2),
    status: ['Complete', 'Processing', 'Cancelled', 'Returned', 'Shipped'][Math.floor(Math.random() * 5)],
    date: new Date(Date.now() - (i * 3600000 * 4)).toLocaleString()
  })), []);

  // 2. State Logic & Filtering
  const filteredOrders = useMemo(() => {
    return recentOrders.filter(order => {
      const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
      const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           order.orderId.toString().includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, searchQuery, recentOrders]);

  const stats = {
    filteredTotal: filteredOrders.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2)
  };

  return (
    <div className="min-h-screen font-sans bg-[#ffffff] dark:bg-[#1a1a1a] text-[#5c5c5c] dark:text-[#dbdbdb] flex flex-col">
      {/* Top Header Section */}
      <header className="h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-6 bg-[#ffffff] dark:bg-[#1a1a1a] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#598dc5] rounded-md flex items-center justify-center text-white font-bold">E</div>
          <h1 style={TYPOGRAPHY.h4} className="text-[#5c5c5c] dark:text-[#f8fafc]">Ecomm Central</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#f8fafc] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-1.5 gap-2">
            <Calendar size={16} className="text-[#94a3b8]" />
            <span style={TYPOGRAPHY.small} className="text-[#64748b]">Last 30 Days</span>
            <ChevronDown size={14} className="text-[#94a3b8]" />
          </div>
          <button className="bg-[#598dc5] hover:bg-[#054aa3] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2" style={TYPOGRAPHY.small}>
            Update Data
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span style={TYPOGRAPHY.h6} className="text-[#64748b] dark:text-[#94a3b8]">{kpi.label}</span>
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                  <kpi.icon size={18} style={{ color: kpi.color }} />
                </div>
              </div>
              <div style={TYPOGRAPHY.kpi} className="text-[#5c5c5c] dark:text-[#3b82f6]">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span style={TYPOGRAPHY.small} className={kpi.change.startsWith('+') ? "text-[#10b981]" : "text-[#ef4444]"}>
                  {kpi.change}
                </span>
                <span style={TYPOGRAPHY.small} className="text-[#94a3b8]">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 style={TYPOGRAPHY.h5} className="text-[#457bb4] dark:text-[#f8fafc]">Revenue Trend</h3>
              <div className="flex bg-[#d4dee8] dark:bg-[#121212] p-1 rounded-lg">
                <button className="px-3 py-1 rounded-md bg-white dark:bg-[#262626] text-[#457bb5] dark:text-[#60a5fa] shadow-sm" style={TYPOGRAPHY.small}>Revenue</button>
                <button className="px-3 py-1 text-[#598dc5] dark:text-[#94a3b8]" style={TYPOGRAPHY.small}>Orders</button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#62a8ea" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-6 shadow-sm">
            <h3 style={TYPOGRAPHY.h5} className="text-[#457bb4] dark:text-[#f8fafc] mb-6">Order Breakdown</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#e2e8f0] dark:border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 style={TYPOGRAPHY.h5} className="text-[#457bb4] dark:text-[#f8fafc]">Recent Orders</h3>
              <p style={TYPOGRAPHY.small} className="text-[#64748b]">Real-time audit log of ecommerce activity</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input 
                  type="text"
                  placeholder="Search orders..."
                  className="bg-[#f8fafc] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg pl-9 pr-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-[#598dc5] outline-none"
                  style={TYPOGRAPHY.p}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex bg-[#f1f5f9] dark:bg-[#121212] p-1 rounded-lg">
                {['All', 'Complete', 'Returned'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-md transition-all ${filterStatus === s ? 'bg-white dark:bg-[#262626] text-[#598dc5] dark:text-[#60a5fa] shadow-sm' : 'text-[#64748b]'}`}
                    style={TYPOGRAPHY.small}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8fafc] dark:bg-[#121212]">
                  <th className="px-6 py-4" style={TYPOGRAPHY.h6}>Order ID</th>
                  <th className="px-6 py-4" style={TYPOGRAPHY.h6}>Customer</th>
                  <th className="px-6 py-4" style={TYPOGRAPHY.h6}>Date</th>
                  <th className="px-6 py-4" style={TYPOGRAPHY.h6}>Amount</th>
                  <th className="px-6 py-4" style={TYPOGRAPHY.h6}>Status</th>
                  <th className="px-6 py-4" style={TYPOGRAPHY.h6}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                {filteredOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors">
                    <td className="px-6 py-4" style={TYPOGRAPHY.p}>#{order.orderId}</td>
                    <td className="px-6 py-4" style={TYPOGRAPHY.p}>{order.customer}</td>
                    <td className="px-6 py-4 text-[#94a3b8]" style={TYPOGRAPHY.small}>{order.date}</td>
                    <td className="px-6 py-4 font-medium" style={TYPOGRAPHY.p}>${order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Complete' ? 'bg-[#ecfdf5] text-[#047857]' :
                        order.status === 'Cancelled' ? 'bg-[#fff1f2] text-[#be123c]' :
                        order.status === 'Returned' ? 'bg-[#fffbeb] text-[#b45309]' :
                        'bg-[#eff6ff] text-[#1d4ed8]'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#94a3b8] hover:text-[#598dc5]">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#e2e8f0] dark:border-[#1e293b] bg-[#f8fafc] dark:bg-[#121212] flex justify-between items-center">
            <span style={TYPOGRAPHY.small} className="text-[#94a3b8]">Showing {filteredOrders.length > 10 ? 10 : filteredOrders.length} of {filteredOrders.length} filtered results</span>
            <div className="flex gap-2">
              <button disabled className="p-2 border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg bg-white dark:bg-[#1a1a1a] opacity-50 cursor-not-allowed">
                <ChevronDown className="rotate-90" size={16} />
              </button>
              <button className="p-2 border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg bg-white dark:bg-[#1a1a1a] hover:bg-gray-50">
                <ChevronDown className="-rotate-90" size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Summary Footer */}
      <footer className="h-12 border-t border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] px-6 flex items-center justify-between text-[#94a3b8]">
        <div style={TYPOGRAPHY.small}>System Status: <span className="text-[#10b981]">Healthy</span></div>
        <div className="flex gap-4">
          <span style={TYPOGRAPHY.small}>Page Stats: ${stats.filteredTotal} Total Revenue in view</span>
          <span style={TYPOGRAPHY.small}>Malloy-Data V1.0</span>
        </div>
      </footer>
    </div>
  );
}