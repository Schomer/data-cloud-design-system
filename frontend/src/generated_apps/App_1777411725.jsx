import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Menu, X, Filter, Download, Calendar, ChevronDown, User, ShoppingBag, DollarSign, Users, TrendingUp } from 'lucide-react';

/**
 * RetailDashboard - A comprehensive eCommerce performance monitor.
 * Designed for Operations Managers to track daily sales, geographic trends, and customer metrics.
 */
export default function RetailDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRange, setActiveRange] = useState('Last 30 Days');
  const [isDarkMode, setIsDarkMode] = useState(true); // Defaulting to dark as per spec preference

  // Mock Data Generation
  const data = useMemo(() => {
    // Daily Sales Trend
    const dailyTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: Math.floor(Math.random() * 5000) + 3000,
        orders: Math.floor(Math.random() * 100) + 40,
      };
    });

    // Top States (Map data representation)
    const statePerformance = [
      { region: 'California', value: 125400, color: '#62a8ea' },
      { region: 'Texas', value: 98200, color: '#aaa47c' },
      { region: 'New York', value: 84500, color: '#a8d95e' },
      { region: 'Florida', value: 71200, color: '#40bdd4' },
      { region: 'Illinois', value: 45600, color: '#7375c9' },
      { region: 'Ohio', value: 38900, color: '#ea75b0' },
      { region: 'Georgia', value: 32100, color: '#f59e0b' },
    ];

    // Top Customers Table (200+ rows generated dynamically)
    const names = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia'];
    const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    const customers = Array.from({ length: 200 }, (_, i) => {
      const name = `${names[Math.floor(Math.random() * 10)]} ${surnames[Math.floor(Math.random() * 10)]}`;
      return {
        id: `USR-${10000 + i}`,
        name: name,
        orders: Math.floor(Math.random() * 45) + 5,
        totalSpent: parseFloat((Math.random() * 8000 + 1200).toFixed(2)),
        lastOrder: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
        status: i < 20 ? 'Platinum' : i < 80 ? 'Gold' : 'Silver'
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);

    return { dailyTrend, statePerformance, customers };
  }, []);

  // Theme Helpers
  const colors = {
    bg: isDarkMode ? '#1a1a1a' : '#ffffff',
    bgSec: isDarkMode ? '#1e293b' : '#e2e8f0',
    text: isDarkMode ? '#dbdbdb' : '#5c5c5c',
    textSec: isDarkMode ? '#cbd5e1' : '#475569',
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    kpiValue: isDarkMode ? '#3b82f6' : '#5f6972',
    kpiTitle: isDarkMode ? '#94a3b8' : '#457bb4',
    palette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9", "#ea75b0", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"]
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: colors.bg }}>

      {/* Top Header */}
      <header 
        className="z-50 h-16 border-b flex items-center justify-between px-6 sticky top-0"
        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-opacity-10 hover:bg-gray-500 rounded transition-colors"
          >
            <Menu size={24} color={colors.text} />
          </button>
          <h1 
            style={{ fontSize: '24px', fontWeight: '600', color: colors.text }}
          >
            Retail Performance <span className="text-[#62a8ea]">Intelligence</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div 
            className="flex items-center px-3 py-1.5 rounded-md border text-sm cursor-pointer"
            style={{ backgroundColor: colors.bgSec, borderColor: colors.border, color: colors.textSec }}
          >
            <Calendar size={14} className="mr-2" />
            {activeRange}
            <ChevronDown size={14} className="ml-2" />
          </div>
          <button 
            className="px-4 py-2 rounded-md font-medium text-sm transition-all active:scale-95"
            style={{ backgroundColor: '#598dc5', color: '#ffffff' }}
          >
            Refresh Data
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar Nav (Under Header) */}
        <aside 
          className={`transition-all duration-300 border-r overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}
          style={{ backgroundColor: colors.bg, borderColor: colors.border }}
        >
          <nav className="p-4 space-y-2">
            {['Dashboard', 'Orders', 'Customers', 'Inventory', 'Reports', 'Settings'].map((item) => (
              <div 
                key={item}
                className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${item === 'Dashboard' ? 'bg-[#598dc5] bg-opacity-10' : 'hover:bg-gray-500 hover:bg-opacity-5'}`}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: item === 'Dashboard' ? '#62a8ea' : 'transparent', border: item === 'Dashboard' ? 'none' : `1px solid ${colors.textSec}` }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500', color: item === 'Dashboard' ? '#62a8ea' : colors.textSec }}>
                  {item}
                </span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">

          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: '$1.42M', change: '+12.5%', icon: DollarSign },
              { label: 'Active Orders', value: '18,245', change: '+4.3%', icon: ShoppingBag },
              { label: 'Avg Order Value', value: '$78.40', change: '-1.2%', icon: TrendingUp },
              { label: 'New Customers', value: '4,120', change: '+22.1%', icon: Users },
            ].map((kpi, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-xl border flex flex-col justify-between shadow-sm"
                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff', borderColor: colors.border }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span style={{ fontSize: '12px', fontWeight: '600', color: colors.kpiTitle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {kpi.label}
                  </span>
                  <div className={`text-xs font-bold px-2 py-0.5 rounded ${kpi.change.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                    {kpi.change}
                  </div>
                </div>
                <div style={{ fontSize: '30px', fontWeight: '600', color: colors.kpiValue }}>
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Main Visual Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daily Sales Trend (2/3 width) */}
            <div 
              className="lg:col-span-2 p-6 rounded-2xl border bg-opacity-50 backdrop-blur-sm"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <h4 className="mb-6" style={{ fontSize: '20px', fontWeight: '600', color: colors.text }}>Daily Sales Volume</h4>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyTrend}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#262626' : '#f1f5f9'} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: colors.textSec, fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: colors.textSec, fontSize: 12 }}
                      tickFormatter={(val) => `$${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: colors.bgSec, border: `1px solid ${colors.border}`, borderRadius: '8px', color: colors.text }}
                      itemStyle={{ color: '#62a8ea' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#62a8ea" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Geographic Distribution (1/3 width) */}
            <div 
              className="p-6 rounded-2xl border"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <h4 className="mb-6" style={{ fontSize: '20px', fontWeight: '600', color: colors.text }}>Transaction Map (States)</h4>
              <div className="h-[300px] w-full flex flex-col justify-center">
                {/* Visual Representation of Map via Horizontal Bars for clarity in Mock environment */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.statePerformance} layout="vertical" margin={{ left: 40 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="region" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: colors.text, fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {data.statePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors.palette[index % 10]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Customer Table Section */}
          <div 
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
          >
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
              <h4 style={{ fontSize: '20px', fontWeight: '600', color: colors.text }}>Top Value Customers</h4>
              <div className="flex gap-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search customers..."
                    className="pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-[#598dc5]"
                    style={{ backgroundColor: colors.bgSec, borderColor: colors.border, color: colors.text }}
                  />
                  <Filter className="absolute left-3 top-2.5 text-slate-400" size={14} />
                </div>
                <button className="p-2 border rounded-lg hover:bg-gray-500 hover:bg-opacity-10" style={{ borderColor: colors.border }}>
                  <Download size={18} color={colors.textSec} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10" style={{ backgroundColor: colors.bgSec }}>
                  <tr>
                    {['Customer Name', 'Status', 'Order Count', 'Total Lifetime Spent', 'Last Transaction'].map((header) => (
                      <th 
                        key={header}
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: colors.kpiTitle }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: colors.border }}>
                  {data.customers.slice(0, 50).map((customer, i) => (
                    <tr 
                      key={customer.id} 
                      className="hover:bg-gray-500 hover:bg-opacity-5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#598dc5] bg-opacity-20 text-[#598dc5] font-bold text-xs">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>{customer.name}</div>
                            <div style={{ fontSize: '12px', color: colors.textSec }}>{customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          customer.status === 'Platinum' ? 'bg-indigo-500/20 text-indigo-400' :
                          customer.status === 'Gold' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: colors.text }}>
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
                        ${customer.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: colors.textSec }}>
                        {customer.lastOrder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t text-center" style={{ borderColor: colors.border }}>
               <span style={{ fontSize: '12px', color: colors.textSec }}>Showing top 50 of 200 records</span>
            </div>
          </div>
        </main>
      </div>

      {/* Footer / Status Bar */}
      <footer 
        className="h-8 border-t flex items-center justify-between px-6 bg-opacity-50"
        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
      >
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-slate-500">
          <span>Region: North America</span>
          <span>System Status: Optimal</span>
          <span>Last Sync: 2m ago</span>
        </div>
        <div className="text-[10px] text-slate-500 italic">
          v2.4.0 Experimental Build
        </div>
      </footer>
    </div>
  );
}