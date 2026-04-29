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
  Area 
} from 'recharts';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

// --- MOCK DATA GENERATION ---
const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const STATUSES = ['Complete', 'Shipped', 'Processing', 'Cancelled', 'Returned'];

const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 500; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    data.push({
      id: 1000 + i,
      order_id: 5000 + Math.floor(i / 2),
      user_id: Math.floor(Math.random() * 100) + 1,
      user_name: `Customer ${Math.floor(Math.random() * 100) + 1}`,
      sale_price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      created_at: date.toISOString(),
      state: STATES[Math.floor(Math.random() * STATES.length)]
    });
  }
  return data;
};

const RAW_DATA = generateMockData();

// --- COMPONENTS ---

export default function RetailOperationsDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('30D');

  // --- THEME TOKENS ---
  const t = isDarkMode ? {
    bg: '#1a1a1a',
    bgSecondary: '#1e293b',
    text: '#dbdbdb',
    textSec: '#cbd5e1',
    border: '#1e293b',
    chart: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9'],
    cardBg: '#1a1a1a',
    cardTitle: '#94a3b8',
    cardValue: '#3b82f6',
    tableHeader: '#94a3b8',
    tableRow: '#cbd5e1'
  } : {
    bg: '#ffffff',
    bgSecondary: '#e2e8f0',
    text: '#5c5c5c',
    textSec: '#475569',
    border: '#e2e8f0',
    chart: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9'],
    cardBg: '#ffffff',
    cardTitle: '#457bb4',
    cardValue: '#5f6972',
    tableHeader: '#457bba',
    tableRow: '#657281'
  };

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return RAW_DATA.filter(item => {
      const statusMatch = statusFilter === 'All' || item.status === statusFilter;
      // Date range logic (simplified for mock)
      return statusMatch;
    });
  }, [statusFilter]);

  // --- AGGREGATIONS ---
  const kpis = useMemo(() => {
    const totalSales = filteredData.reduce((acc, curr) => acc + curr.sale_price, 0);
    const totalOrders = new Set(filteredData.map(d => d.order_id)).size;
    const avgValue = totalSales / (totalOrders || 1);
    return {
      sales: totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      orders: totalOrders.toLocaleString(),
      avg: avgValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      customers: new Set(filteredData.map(d => d.user_id)).size.toLocaleString()
    };
  }, [filteredData]);

  const dailyTrend = useMemo(() => {
    const groups = {};
    filteredData.forEach(d => {
      const date = d.created_at.split('T')[0];
      groups[date] = (groups[date] || 0) + d.sale_price;
    });
    return Object.keys(groups).sort().map(date => ({
      date: date.split('-').slice(1).join('/'),
      sales: parseFloat(groups[date].toFixed(2))
    }));
  }, [filteredData]);

  const stateDistribution = useMemo(() => {
    const groups = {};
    filteredData.forEach(d => {
      groups[d.state] = (groups[d.state] || 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const topCustomers = useMemo(() => {
    const groups = {};
    filteredData.forEach(d => {
      if (!groups[d.user_id]) {
        groups[d.user_id] = { id: d.user_id, name: d.user_name, total: 0, count: 0 };
      }
      groups[d.user_id].total += d.sale_price;
      groups[d.user_id].count += 1;
    });
    return Object.values(groups)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [filteredData]);

  // --- ECHARTS USA MAP CONFIG ---
  useEffect(() => {
    // Note: In a real environment, we'd fetch the USA geoJSON.
    // Here we're assuming echarts has it or we're mocking the render intent.
    fetch('https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/usa.json')
      .then(res => res.json())
      .then(usaJson => {
        echarts.registerMap('USA', usaJson);
      });
  }, []);

  const mapOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} Transactions'
    },
    visualMap: {
      left: 'right',
      min: 0,
      max: 50,
      inRange: {
        color: ['#e0f2fe', '#0ea5e9', '#0369a1']
      },
      text: ['High', 'Low'],
      calculable: true,
      textStyle: { color: t.textSec }
    },
    series: [
      {
        name: 'USA Transactions',
        type: 'map',
        map: 'USA',
        roam: true,
        zoom: 1.2,
        center: [-96, 38],
        emphasis: {
          label: { show: true, color: '#fff' },
          itemStyle: { areaColor: '#f59e0b' }
        },
        data: stateDistribution.map(d => ({
          name: d.name === 'CA' ? 'California' : d.name, // Simplified mapping
          value: d.value
        }))
      }
    ]
  };

  return (
    <div className={`min-h-screen p-6 font-sans`} style={{ backgroundColor: t.bg, color: t.text, fontFamily: 'Inter, sans-serif' }}>

      {/* HEADER & NAVIGATION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b" style={{ borderColor: t.border }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: '600', color: t.text, letterSpacing: '-0.025em' }}>
            Retail Operations Center
          </h1>
          <p style={{ fontSize: '14px', color: t.textSec }}>Real-time performance monitoring across all US regions</p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <select 
            className="p-2 rounded border outline-none"
            style={{ backgroundColor: isDarkMode ? '#121212' : '#ffffff', borderColor: t.border, color: t.text, fontSize: '14px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-4 py-2 rounded text-xs font-medium uppercase tracking-wider"
            style={{ backgroundColor: t.bgSecondary, color: t.text }}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: kpis.sales, sub: '+12.5% vs LW' },
          { label: 'Active Orders', value: kpis.orders, sub: '84 Processing' },
          { label: 'Avg Order Value', value: kpis.avg, sub: 'Last 30 Days' },
          { label: 'Unique Customers', value: kpis.customers, sub: 'Active Base' }
        ].map((kpi, i) => (
          <div key={i} className="p-5 rounded-xl border shadow-sm" style={{ backgroundColor: t.cardBg, borderColor: t.border }}>
            <h6 style={{ fontSize: '12px', fontWeight: '600', color: t.cardTitle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {kpi.label}
            </h6>
            <div className="mt-2" style={{ fontSize: '30px', fontWeight: '600', color: t.cardValue }}>
              {kpi.value}
            </div>
            <p className="mt-1" style={{ fontSize: '12px', color: '#10b981' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* MAIN VISUALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl border" style={{ backgroundColor: t.cardBg, borderColor: t.border }}>
          <h5 className="mb-6" style={{ fontSize: '18px', fontWeight: '500', color: t.text }}>Daily Revenue Trend</h5>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={t.chart[0]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={t.chart[0]} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: t.textSec, fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: t.textSec, fontSize: 12 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: t.bg, borderColor: t.border, borderRadius: '8px', color: t.text }}
                />
                <Area type="monotone" dataKey="sales" stroke={t.chart[0]} strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* USA Map Breakdown */}
        <div className="p-6 rounded-xl border" style={{ backgroundColor: t.cardBg, borderColor: t.border }}>
          <h5 className="mb-6" style={{ fontSize: '18px', fontWeight: '500', color: t.text }}>Geographic Density</h5>
          <div className="h-[350px] w-full">
            <ReactECharts 
              option={mapOption} 
              style={{ height: '100%', width: '100%' }}
              theme={isDarkMode ? 'dark' : 'light'}
            />
          </div>
        </div>
      </div>

      {/* CUSTOMER TABLE */}
      <div className="p-6 rounded-xl border" style={{ backgroundColor: t.cardBg, borderColor: t.border }}>
        <div className="flex justify-between items-center mb-6">
          <h5 style={{ fontSize: '18px', fontWeight: '500', color: t.text }}>Top Value Customers</h5>
          <button 
            className="text-sm font-medium hover:underline" 
            style={{ color: t.chart[0] }}
            onClick={() => alert('Exporting Customer Data...')}
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {['Customer Name', 'User ID', 'Orders', 'Total Spend', 'Loyalty Tier'].map(h => (
                  <th key={h} className="py-4 px-4" style={{ color: t.tableHeader, fontSize: '14px', fontWeight: '600' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((cust, idx) => (
                <tr key={cust.id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: idx % 2 === 0 ? 'transparent' : (isDarkMode ? '#262626' : '#f8fafc'), borderBottom: `1px solid ${t.border}` }}>
                  <td className="py-4 px-4" style={{ color: t.text, fontSize: '14px', fontWeight: '500' }}>{cust.name}</td>
                  <td className="py-4 px-4" style={{ color: t.tableRow, fontSize: '14px' }}>USR-{cust.id}</td>
                  <td className="py-4 px-4" style={{ color: t.tableRow, fontSize: '14px' }}>{cust.count}</td>
                  <td className="py-4 px-4" style={{ color: t.text, fontSize: '14px', fontWeight: '600' }}>
                    {cust.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: cust.total > 1500 ? '#fef3c7' : '#f1f5f9', color: cust.total > 1500 ? '#92400e' : '#475569' }}>
                      {cust.total > 1500 ? 'Platinum' : 'Gold'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 pt-6 border-t flex justify-between items-center" style={{ borderColor: t.border }}>
        <p style={{ fontSize: '12px', color: t.textSec }}>Data Source: malloy-data.ecomm.order_items</p>
        <p style={{ fontSize: '12px', color: t.textSec }}>Last Sync: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}