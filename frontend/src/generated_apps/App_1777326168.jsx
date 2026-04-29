import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Percent, ArrowUpRight, ArrowDownRight, Calendar,
  Filter, Download, ChevronLeft, ChevronRight
} from 'lucide-react';

/**
 * EcommerceSalesMonitor - A comprehensive dashboard for tracking sales performance.
 * Features:
 * - Global Date Range Picker
 * - KPI Cards with trend indicators
 * - Area Chart: Gross vs Net Sales
 * - Pie Chart: Traffic Sources
 * - Transaction Log (200+ rows)
 */
export default function EcommerceSalesMonitor() {
  // State for date range filtering
  const [dateRange, setDateRange] = useState({
    start: '2026-04-01',
    end: '2026-04-27'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // 1. Generate Daily Sales Data (30 days)
  const salesData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(2026, 3, i + 1).toISOString().split('T')[0];
      const gross = Math.floor(Math.random() * 5000) + 3000;
      const net = Math.floor(gross * (0.8 + Math.random() * 0.15)); // Net is usually 80-95% of gross
      return { date, gross, net };
    }).filter(d => d.date >= dateRange.start && d.date <= dateRange.end);
  }, [dateRange]);

  // 2. Generate Traffic Source Data
  const trafficData = [
    { name: 'Organic', value: 45, color: '#3B82F6' },
    { name: 'Social', value: 25, color: '#10B981' },
    { name: 'Direct', value: 20, color: '#F59E0B' },
    { name: 'Referral', value: 10, color: '#EF4444' }
  ];

  // 3. Generate Large Transaction Dataset (200+ rows)
  const transactions = useMemo(() => {
    const statuses = ['Delivered', 'Shipped', 'Processing', 'Cancelled', 'Returned'];
    return Array.from({ length: 220 }, (_, i) => ({
      id: 1000 + i,
      order_id: 50000 + i,
      user_id: Math.floor(Math.random() * 10000),
      sale_price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(2026, 3, Math.floor(Math.random() * 27) + 1).toISOString().split('T')[0],
      source: trafficData[Math.floor(Math.random() * trafficData.length)].name
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, []);

  // Filtered transactions for the table
  const filteredTransactions = transactions.filter(t => 
    t.created_at >= dateRange.start && t.created_at <= dateRange.end
  );

  // Pagination logic
  const paginatedData = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage, 
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  // KPI Calculations
  const totalGross = salesData.reduce((acc, curr) => acc + curr.gross, 0);
  const totalNet = salesData.reduce((acc, curr) => acc + curr.net, 0);
  const avgConversion = 3.42; // Mock static %
  const cartAbandonment = 68.4; // Mock static %

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      {/* Top Navigation & Date Picker */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-200 md:flex-row">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Sales Monitor</h1>
          <p className="text-sm text-slate-500">Real-time e-commerce performance</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Calendar size={16} className="text-slate-400" />
            <input 
              type="date" 
              className="bg-transparent text-sm outline-none" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span className="text-slate-300">to</span>
            <input 
              type="date" 
              className="bg-transparent text-sm outline-none" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Gross Sales Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center text-emerald-500">
              <span className="text-sm font-medium">+12.5%</span>
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Gross Sales</p>
          <h2 className="text-3xl font-bold">${totalGross.toLocaleString()}</h2>
          <div className="mt-4 h-1 w-full rounded-full bg-slate-100">
            <div className="h-1 rounded-full bg-blue-500" style={{ width: '70%' }}></div>
          </div>
        </div>

        {/* Net Conversions Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Percent size={24} />
            </div>
            <div className="flex items-center text-emerald-500">
              <span className="text-sm font-medium">+2.1%</span>
              <ArrowUpRight size={16} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Net Conversions</p>
          <h2 className="text-3xl font-bold">{avgConversion}%</h2>
          <p className="mt-2 text-xs text-slate-400">Target: 3.5%</p>
        </div>

        {/* Cart Abandonment Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <ShoppingCart size={24} />
            </div>
            <div className="flex items-center text-rose-500">
              <span className="text-sm font-medium">-4.2%</span>
              <ArrowDownRight size={16} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Cart Abandonment</p>
          <h2 className="text-3xl font-bold">{cartAbandonment}%</h2>
          <p className="mt-2 text-xs text-slate-400">Industry average: 70.1%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Area Chart */}
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Sales Trend: Gross vs Net</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs font-medium text-slate-500">Gross</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs font-medium text-slate-500">Net</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="gross" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorGross)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorNet)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Source Pie Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="mb-6 font-bold text-slate-800">Traffic Sources</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500 font-medium">Top Performer</span>
              <span className="text-xs font-bold text-blue-600">Organic (45%)</span>
            </div>
            <div className="pt-2">
              <p className="text-[10px] text-slate-400 italic leading-tight">
                Conversion rate from Social traffic up 14% compared to last month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Log Table (200+ rows) */}
      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h3 className="font-bold text-slate-800">Transaction Log</h3>
          <div className="flex items-center gap-2">
            <button className="rounded p-1 hover:bg-slate-100"><Filter size={18} className="text-slate-400" /></button>
            <span className="text-sm text-slate-400">Showing {filteredTransactions.length} orders</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedData.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-blue-600">#{t.order_id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">{t.user_id}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-800">${t.sale_price}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      t.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                      t.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{t.created_at}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{t.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <p className="text-sm text-slate-500">
            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded border border-slate-200 p-1 transition-colors hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded border border-slate-200 p-1 transition-colors hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}