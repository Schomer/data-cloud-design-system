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
  Area
} from 'recharts';

/**
 * RetailMonitor - A comprehensive retail performance dashboard.
 */
export default function RetailMonitor() {
  // Theme & Visual Tokens (Derived from visual_spec.skill.md)
  const theme = {
    light: {
      background: '#ffffff',
      backgroundSecondary: '#e2e8f0',
      textPrimary: '#5c5c5c',
      textSecondary: '#475569',
      border: '#e2e8f0',
      chartPalette: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9'],
      kpiTitle: '#457bb4',
      kpiValue: '#5f6972',
      tableHeader: '#457bba',
      tableRow: '#657281'
    },
    dark: {
      background: '#1a1a1a',
      backgroundSecondary: '#1e293b',
      textPrimary: '#dbdbdb',
      textSecondary: '#cbd5e1',
      border: '#1e293b',
      chartPalette: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9'],
      kpiTitle: '#94a3b8',
      kpiValue: '#3b82f6',
      tableHeader: '#94a3b8',
      tableRow: '#cbd5e1'
    }
  };

  // State for Global Filters
  const [dateRange, setDateRange] = useState('All');

  // MOCK DATA GENERATION: Daily Sales (Based on SQL output provided in context)
  // Reconstructing a representative subset for interactivity
  const salesRaw = [
    { sale_date: '2020-01-01', total_revenue: 7433.97, order_count: 144 },
    { sale_date: '2020-01-02', total_revenue: 1118.67, order_count: 23 },
    { sale_date: '2020-01-03', total_revenue: 1956.11, order_count: 44 },
    { sale_date: '2020-01-04', total_revenue: 1111.41, order_count: 20 },
    { sale_date: '2020-01-05', total_revenue: 832.10, order_count: 21 },
    { sale_date: '2020-01-06', total_revenue: 2211.26, order_count: 47 },
    { sale_date: '2020-01-07', total_revenue: 3318.48, order_count: 53 },
    { sale_date: '2020-01-08', total_revenue: 1813.65, order_count: 35 },
    { sale_date: '2020-01-09', total_revenue: 2747.93, order_count: 52 },
    { sale_date: '2020-01-10', total_revenue: 1336.24, order_count: 31 },
    { sale_date: '2020-01-11', total_revenue: 459.00, order_count: 10 },
    { sale_date: '2020-01-12', total_revenue: 745.87, order_count: 14 },
    { sale_date: '2020-01-13', total_revenue: 1743.51, order_count: 43 },
    { sale_date: '2020-01-14', total_revenue: 1490.54, order_count: 36 },
    { sale_date: '2020-01-15', total_revenue: 1618.32, order_count: 38 }
  ];

  // MOCK DATA GENERATION: USA Map Data (States with mock revenue)
  const mapData = [
    { state: 'California', value: 125000 },
    { state: 'Texas', value: 98000 },
    { state: 'New York', value: 87000 },
    { state: 'Florida', value: 65000 },
    { state: 'Illinois', value: 45000 },
    { state: 'Ohio', value: 38000 },
    { state: 'Georgia', value: 32000 },
    { state: 'Washington', value: 55000 }
  ];

  // MOCK DATA GENERATION: Top Customers (Based on SQL output)
  const topCustomers = [
    { user_id: 19495, total_spent: 2222.48, total_orders: 10 },
    { user_id: 12580, total_spent: 1412.29, total_orders: 11 },
    { user_id: 95486, total_spent: 1391.68, total_orders: 9 },
    { user_id: 22632, total_spent: 1369.04, total_orders: 6 },
    { user_id: 35924, total_spent: 1324.70, total_orders: 8 },
    { user_id: 3341, total_spent: 1300.30, total_orders: 9 },
    { user_id: 10915, total_spent: 1230.93, total_orders: 7 },
    { user_id: 34966, total_spent: 1227.51, total_orders: 4 },
    { user_id: 28696, total_spent: 1223.32, total_orders: 3 },
    { user_id: 14516, total_spent: 1219.86, total_orders: 8 }
  ];

  // Calculations
  const totalRevenue = useMemo(() => salesRaw.reduce((sum, d) => sum + d.total_revenue, 0), []);
  const totalOrders = useMemo(() => salesRaw.reduce((sum, d) => sum + d.order_count, 0), []);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] p-6 font-['Inter',sans-serif]">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-[#e2e8f0] dark:border-[#1e293b] pb-4">
        <div>
          <h1 className="text-[36px] font-semibold text-[#5c5c5c] dark:text-[#f8fafc] tracking-tight leading-none mb-2">
            Retail Performance Dashboard
          </h1>
          <p className="text-[14px] text-[#64748b] dark:text-[#94a3b8]">
            Overview of sales velocity, geographic distribution, and high-value customers.
          </p>
        </div>

        {/* Global Filter: Date Range */}
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">
            Time Period:
          </span>
          <div className="flex bg-[#d4dee8] dark:bg-[#121212] rounded-[5px] p-1">
            {['All', 'Last 7 Days', 'Monthly'].map((opt) => (
              <button
                key={opt}
                onClick={() => setDateRange(opt)}
                className={`px-3 py-1 text-[12px] font-medium rounded-[4px] transition-colors ${
                  dateRange === opt
                    ? 'bg-white dark:bg-[#262626] text-[#457bb5] dark:text-[#60a5fa] shadow-sm'
                    : 'text-[#598dc5] dark:text-[#94a3b8] hover:text-[#457bb5] dark:hover:text-[#60a5fa]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="+12.5%" />
        <KPICard title="Total Orders" value={totalOrders.toLocaleString()} change="+8.2%" />
        <KPICard title="Avg. Order Value" value={`$${avgOrderValue.toFixed(2)}`} change="-1.4%" />
        <KPICard title="Total Users" value="2,481" change="+5.1%" />
      </div>

      {/* MAIN VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Sales Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6 shadow-sm">
          <h5 className="text-[18px] font-medium text-[#5c5c5c] dark:text-[#dbdbdb] mb-6">
            Daily Sales Revenue
          </h5>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesRaw}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#62a8ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="sale_date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total_revenue"
                  stroke="#62a8ea"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* USA Map (Conceptual State Breakdown) */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6 shadow-sm">
          <h5 className="text-[18px] font-medium text-[#5c5c5c] dark:text-[#dbdbdb] mb-2">
            Regional Distribution
          </h5>
          <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] mb-6">
            Revenue intensity across the United States.
          </p>
          <div className="space-y-4">
            {mapData.map((item, idx) => (
              <div key={item.state} className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[14px] font-medium text-[#475569] dark:text-[#cbd5e1]">
                    {item.state}
                  </span>
                  <span className="text-[14px] text-[#64748b] dark:text-[#94a3b8]">
                    ${item.value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-[#f1f5f9] dark:bg-[#262626] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#62a8ea]"
                    style={{ width: `${(item.value / 125000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-8 pt-4 border-t border-[#f1f5f9] dark:border-[#1e293b]">
              <p className="text-[12px] italic text-[#94a3b8] dark:text-[#64748b]">
                West Coast leads in transaction volume.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TOP CUSTOMERS TABLE */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e2e8f0] dark:border-[#1e293b]">
          <h5 className="text-[18px] font-medium text-[#5c5c5c] dark:text-[#dbdbdb]">
            Top Customers by Lifetime Spend
          </h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#121212]">
                <th className="px-6 py-4 text-[14px] font-semibold text-[#457bba] dark:text-[#94a3b8]">
                  User ID
                </th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#457bba] dark:text-[#94a3b8]">
                  Total Orders
                </th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#457bba] dark:text-[#94a3b8]">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#457bba] dark:text-[#94a3b8]">
                  Loyalty Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
              {topCustomers.map((cust) => (
                <tr key={cust.user_id} className="hover:bg-[#f8fafc] dark:hover:bg-[#262626] transition-colors">
                  <td className="px-6 py-4 text-[14px] text-[#657281] dark:text-[#cbd5e1] font-mono">

#{cust.user_id}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#657281] dark:text-[#cbd5e1]">
                    {cust.total_orders}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#657281] dark:text-[#cbd5e1] font-medium">
                    ${cust.total_spent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#ecfdf5] dark:bg-[#064e3b] text-[#047857] dark:text-[#a7f3d0] text-[12px] rounded-full font-medium">
                      High Value
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Sub-component: KPI Card
 */
function KPICard({ title, value, change }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-5 shadow-sm">
      <h6 className="text-[12px] font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-2">
        {title}
      </h6>
      <div className="flex items-baseline justify-between">
        <span className="text-[30px] font-semibold text-[#5c5c5c] dark:text-[#3b82f6]">
          {value}
        </span>
        <span
          className={`text-[12px] font-medium px-2 py-1 rounded-md ${
            isPositive
              ? 'bg-[#ecfdf5] text-[#047857]'
              : 'bg-[#fff1f2] text-[#be123c]'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}