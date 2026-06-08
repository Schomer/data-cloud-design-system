import React, { useState, useMemo, useEffect } from 'react';
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
  Legend
} from 'recharts';
import { Menu, Calendar, Filter, ChevronDown, Check } from 'lucide-react';

/**
 * THEME & DESIGN TOKENS (from visual_spec.skill.md)
 */
const THEME = {
  light: {
    bg_primary: "#ffffff",
    bg_secondary: "#e2e8f0",
    text_primary: "#5c5c5c",
    text_secondary: "#475569",
    border: "#e2e8f0",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
    sidebar: "#ffffff",
    header: "#ffffff"
  },
  dark: {
    bg_primary: "#1a1a1a",
    bg_secondary: "#1e293b",
    text_primary: "#dbdbdb",
    text_secondary: "#cbd5e1",
    border: "#1e293b",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
    sidebar: "#1a1a1a",
    header: "#1a1a1a"
  }
};

/**
 * MOCK DATA GENERATION
 */
const generateMockOrders = () => {
  const statuses = ['Complete', 'Cancelled', 'Shipped', 'Processing', 'Returned'];
  const categories = ['Electronics', 'Apparel', 'Home & Garden', 'Beauty', 'Sports'];

  // Generate 200 raw order items over the last 30 days
  return Array.from({ length: 200 }, (_, i) => {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: 10000 + i,
      order_id: 5000 + Math.floor(i / 1.5),
      sale_price: parseFloat((Math.random() * 150 + 20).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      created_at: date.toISOString()
    };
  });
};

const METRICS = [
  { id: 'total_sales', label: 'Total Sales', unit: '$' },
  { id: 'order_count', label: 'Order Volume', unit: '' },
  { id: 'avg_order_value', label: 'Avg Order Value', unit: '$' },
  { id: 'return_rate', label: 'Return Rate', unit: '%' },
  { id: 'active_customers', label: 'Active Users', unit: '' }
];

export default function EcommerceAnalyticsExplorer() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMetric, setActiveMetric] = useState('total_sales');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [rawData, setRawData] = useState([]);

  const colors = isDarkMode ? THEME.dark : THEME.light;

  useEffect(() => {
    setRawData(generateMockOrders());
  }, []);

  // Aggregation Logic for the Chart
  const chartData = useMemo(() => {
    if (rawData.length === 0) return [];

    // Filter by dimension
    const filtered = rawData.filter(d => statusFilter === 'All' || d.status === statusFilter);

    // Group by date
    const dailyMap = {};
    filtered.forEach(item => {
      const day = item.created_at.split('T')[0];
      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, sales: 0, orders: new Set(), returns: 0, users: new Set() };
      }
      dailyMap[day].sales += item.sale_price;
      dailyMap[day].orders.add(item.order_id);
      dailyMap[day].users.add(Math.floor(Math.random() * 100)); // Mocking user variation
      if (item.status === 'Returned') dailyMap[day].returns += 1;
    });

    return Object.keys(dailyMap)
      .sort()
      .map(date => {
        const d = dailyMap[date];
        const orderCount = d.orders.size;
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total_sales: parseFloat(d.sales.toFixed(2)),
          order_count: orderCount,
          avg_order_value: orderCount > 0 ? parseFloat((d.sales / orderCount).toFixed(2)) : 0,
          return_rate: orderCount > 0 ? parseFloat(((d.returns / orderCount) * 100).toFixed(1)) : 0,
          active_customers: d.users.size
        };
      });
  }, [rawData, statusFilter]);

  const activeMetricObj = METRICS.find(m => m.id === activeMetric);

  return (
    <div className={`flex flex-col min-h-screen font-sans bg-[${colors.bg_primary}] transition-colors duration-200`}>
      {/* TOP HEADER */}
      <header className={`h-16 flex items-center px-6 border-b border-[${colors.border}] bg-[${colors.header}] z-30`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <Menu size={20} color={colors.text_primary} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: colors.text_primary }}>
            E-Commerce Performance Insights
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
           <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1.5 rounded-md border border-[${colors.border}] text-[12px] font-medium text-[${colors.text_secondary}] hover:bg-slate-50 dark:hover:bg-slate-800`}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: THINGS TO MEASURE */}
        <aside className={`w-64 border-r border-[${colors.border}] bg-[${colors.sidebar}] flex flex-col p-4 gap-2 z-20`}>
          <div className="mb-4">
            <h6 style={{ fontSize: '12px', fontWeight: '600', color: colors.text_secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Metric
            </h6>
          </div>
          {METRICS.map(metric => (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric.id)}
              className={`w-full flex flex-col items-start p-3 rounded-lg border transition-all ${
                activeMetric === metric.id 
                ? `bg-[#ebf5ff] dark:bg-[#1e3a8a] border-[#3b82f6] shadow-sm` 
                : `bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800`
              }`}
            >
              <span style={{ 
                fontSize: '14px', 
                fontWeight: activeMetric === metric.id ? '600' : '400', 
                color: activeMetric === metric.id ? (isDarkMode ? '#bfdbfe' : '#2563eb') : colors.text_primary 
              }}>
                {metric.label}
              </span>
              <span style={{ fontSize: '12px', color: colors.text_secondary }}>
                {metric.unit === '$' ? 'Value in USD' : metric.unit === '%' ? 'Ratio' : 'Total Count'}
              </span>
            </button>
          ))}
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto flex flex-col p-8 gap-6">

          {/* DIMENSION FILTERS (ABOVE THE CHART) */}
          <section className={`flex flex-wrap items-center gap-4 p-4 rounded-xl border border-[${colors.border}] bg-[${colors.header}] shadow-sm`}>
            <div className="flex items-center gap-2">
              <Filter size={16} color={colors.text_secondary} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: colors.text_secondary }}>Filters:</span>
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <label className="absolute -top-2 left-2 px-1 bg-white dark:bg-[#1a1a1a] text-[10px] text-slate-400">Order Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`h-10 pl-3 pr-8 rounded-lg border border-[${colors.border}] bg-transparent text-[14px] text-[${colors.text_primary}] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="All">All Statuses</option>
                <option value="Complete">Complete</option>
                <option value="Shipped">Shipped</option>
                <option value="Processing">Processing</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-slate-400" />
            </div>

            {/* Time Filter */}
            <div className="relative group">
               <label className="absolute -top-2 left-2 px-1 bg-white dark:bg-[#1a1a1a] text-[10px] text-slate-400">Timeframe</label>
               <div className={`h-10 px-3 flex items-center gap-2 rounded-lg border border-[${colors.border}] bg-transparent text-[14px] text-[${colors.text_primary}] cursor-not-allowed opacity-70`}>
                <Calendar size={14} />
                <span>Last 30 Days</span>
              </div>
            </div>

            {/* Reset Action */}
            <button 
              onClick={() => { setStatusFilter('All'); setActiveMetric('total_sales'); }}
              className="ml-auto text-[13px] font-medium text-blue-500 hover:text-blue-600 px-2 py-1"
            >
              Reset All
            </button>
          </section>

          {/* LARGE CHART AREA */}
          <section className={`flex-1 flex flex-col p-6 rounded-2xl border border-[${colors.border}] bg-[${colors.header}] shadow-sm min-h-[450px]`}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', color: colors.text_primary }}>
                  {activeMetricObj.label} Trend
                </h3>
                <p style={{ fontSize: '14px', color: colors.text_secondary }}>
                  Showing daily performance for {statusFilter === 'All' ? 'all orders' : `${statusFilter} orders`}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#62a8ea]"></div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: colors.text_secondary }}>Current Period</span>
              </div>
            </div>

            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#2d3748' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: colors.text_secondary }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: colors.text_secondary }}
                    tickFormatter={(val) => activeMetricObj.unit === '$' ? `$${val}` : val}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', 
                      borderColor: colors.border,
                      borderRadius: '8px',
                      color: colors.text_primary,
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#62a8ea', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={activeMetric} 
                    stroke="#62a8ea" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMetric)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* SUMMARY TABLE (OPTIONAL BUT HELPFUL) */}
          <section className={`rounded-2xl border border-[${colors.border}] bg-[${colors.header}] shadow-sm overflow-hidden`}>
            <div className="p-4 border-b border-[${colors.border}] bg-slate-50/50 dark:bg-slate-800/50">
               <h5 style={{ fontSize: '16px', fontWeight: '600', color: colors.text_primary }}>Data Snapshot</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`border-b border-[${colors.border}]`}>
                    <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: colors.text_secondary }}>Date</th>
                    <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: colors.text_secondary }}>Total Sales</th>
                    <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: colors.text_secondary }}>Orders</th>
                    <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: colors.text_secondary }}>Avg Value</th>
                    <th className="px-6 py-4" style={{ fontSize: '12px', fontWeight: '600', color: colors.text_secondary }}>Return %</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.slice(-5).reverse().map((row, idx) => (
                    <tr key={idx} className={`border-b border-[${colors.border}] hover:bg-slate-50 dark:hover:bg-slate-800/40`}>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: colors.text_primary }}>{row.date}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '500', color: colors.text_primary }}>${row.total_sales.toLocaleString()}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: colors.text_primary }}>{row.order_count}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: colors.text_primary }}>${row.avg_order_value}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: row.return_rate > 5 ? '#ef4444' : colors.text_primary }}>
                        {row.return_rate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}