import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, Menu, X } from 'lucide-react';

/**
 * ECommerceSalesMonitor
 * 
 * A comprehensive dashboard for monitoring e-commerce performance.
 * Built with strict adherence to visual specifications and layout patterns.
 */
export default function ECommerceSalesMonitor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2026-04-01', end: '2026-04-27' });

  // --- MOCK DATA GENERATION ---
  const dailyData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(2026, 3, i + 1);
      const gross = Math.floor(Math.random() * 5000) + 15000;
      const net = gross * (0.85 - Math.random() * 0.1);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        grossSales: parseFloat(gross.toFixed(2)),
        netSales: parseFloat(net.toFixed(2)),
      };
    });
  }, []);

  const trafficData = [
    { name: 'Organic', value: 4500 },
    { name: 'Direct', value: 3200 },
    { name: 'Social', value: 2100 },
    { name: 'Paid', value: 1800 },
  ];

  const chartPalette = [
    "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa"
  ];

  // --- STYLING HELPERS ---
  const typography = {
    h1: { fontSize: '36px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    h2: { fontSize: '30px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    h3: { fontSize: '24px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    h4: { fontSize: '20px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    h5: { fontSize: '18px', fontWeight: '500', fontFamily: 'Inter, sans-serif' },
    h6: { fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    p: { fontSize: '14px', fontWeight: '400', fontFamily: 'Inter, sans-serif' },
    xs: { fontSize: '12px', fontWeight: '400', fontFamily: 'Inter, sans-serif' },
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col font-['Inter',_sans-serif]">

      {/* --- GLOBAL HEADER (Sticky) --- */}
      <header className="sticky top-0 z-50 w-full bg-[#ffffff] dark:bg-[#1a1a1a] border-b border-[#e2e8f0] dark:border-[#1e293b] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-[#f1f5f9] dark:hover:bg-[#262626] rounded-md transition-colors"
          >
            <Menu className="w-6 h-6 text-[#5c5c5c] dark:text-[#dbdbdb]" />
          </button>
          <h1 style={{ ...typography.h3, color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
            Sales Monitor
          </h1>
        </div>

        {/* --- GLOBAL DATE RANGE PICKER --- */}
        <div className="flex items-center gap-3 bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 cursor-pointer hover:border-[#3b82f6] transition-all">
          <Calendar className="w-4 h-4 text-[#64748b]" />
          <span style={{ ...typography.p, color: '#475569' }} className="dark:text-[#cbd5e1]">
            {dateRange.start} - {dateRange.end}
          </span>
          <ChevronDown className="w-4 h-4 text-[#64748b]" />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">

        {/* --- KPI SECTION --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gross Sales Card */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-[20px] space-y-2 shadow-sm">
            <h6 style={{ ...typography.xs, color: '#457bb4', textTransform: 'uppercase' }} className="dark:text-[#94a3b8]">
              Gross Sales
            </h6>
            <div className="flex items-baseline justify-between">
              <h2 style={{ ...typography.h2, color: '#5f6972' }} className="dark:text-[#3b82f6]">
                $542,890.00
              </h2>
              <div className="flex items-center text-[#10b981] text-[12px] font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                12.5%
              </div>
            </div>
            <p style={typography.xs} className="text-[#94a3b8]">vs. previous 30 days</p>
          </div>

          {/* Net Conversions Card */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-[20px] space-y-2 shadow-sm">
            <h6 style={{ ...typography.xs, color: '#457bb4', textTransform: 'uppercase' }} className="dark:text-[#94a3b8]">
              Net Conversions
            </h6>
            <div className="flex items-baseline justify-between">
              <h2 style={{ ...typography.h2, color: '#5f6972' }} className="dark:text-[#3b82f6]">
                3.42%
              </h2>
              <div className="flex items-center text-[#10b981] text-[12px] font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                0.8%
              </div>
            </div>
            <p style={typography.xs} className="text-[#94a3b8]">Industry benchmark: 2.5%</p>
          </div>

          {/* Cart Abandonment Card */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-[20px] space-y-2 shadow-sm">
            <h6 style={{ ...typography.xs, color: '#457bb4', textTransform: 'uppercase' }} className="dark:text-[#94a3b8]">
              Cart Abandonment
            </h6>
            <div className="flex items-baseline justify-between">
              <h2 style={{ ...typography.h2, color: '#5f6972' }} className="dark:text-[#3b82f6]">
                64.12%
              </h2>
              <div className="flex items-center text-[#ef4444] text-[12px] font-medium">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                4.2%
              </div>
            </div>
            <p style={typography.xs} className="text-[#94a3b8]">High abandonment on mobile</p>
          </div>
        </section>

        {/* --- CHARTS SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Daily Sales Area Chart */}
          <div className="lg:col-span-2 bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6 shadow-sm flex flex-col">
            <div className="mb-6">
              <h4 style={{ ...typography.h4, color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                Daily Revenue Trend
              </h4>
              <p style={{ ...typography.p, color: '#64748b' }}>Gross Sales vs Net Sales volume</p>
            </div>
            <div className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#e2e8f0', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="grossSales" 
                    stroke="#60a5fa" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorGross)" 
                    name="Gross Sales"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="netSales" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorNet)" 
                    name="Net Sales"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Source Pie Chart */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6 shadow-sm flex flex-col">
            <div className="mb-6">
              <h4 style={{ ...typography.h4, color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                Traffic Sources
              </h4>
              <p style={{ ...typography.p, color: '#64748b' }}>Distribution by channel</p>
            </div>
            <div className="flex-1 min-h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartPalette[index % chartPalette.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      borderColor: '#1e293b', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </section>
      </main>

      {/* --- SLIDE-OVER SIDEBAR --- */}
      <div className={`fixed inset-0 z-[60] bg-black/50 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-[#ffffff] dark:bg-[#1a1a1a] border-r border-[#e2e8f0] dark:border-[#1e293b] transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between">
            <h3 style={typography.h5} className="text-[#5c5c5c] dark:text-[#dbdbdb]">Menu</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="text-[#64748b] hover:text-[#334155]">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="px-4 space-y-2">
            {['Overview', 'Sales Analytics', 'Customer Insights', 'Inventory'].map((item, idx) => (
              <button 
                key={item} 
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${idx === 0 ? 'bg-[#ebf5ff] text-[#457bb5] dark:bg-[#1e3a8a] dark:text-[#bfdbfe]' : 'text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-[#262626]'}`}
              >
                <span style={typography.h6}>{item}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

    </div>
  );
}