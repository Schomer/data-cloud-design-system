import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { 
  ShoppingBag, Users, DollarSign, TrendingUp, Filter, CheckCircle, Clock, XCircle, ChevronDown, 
  Layers, MapPin, Package, RefreshCcw 
} from 'lucide-react';

/**
 * EcommercePerformanceDashboard
 * An interactive data application for exploring ecommerce order item metrics.
 */
export default function EcommercePerformanceDashboard() {
  // --- DATA GENERATION ---
  // Generating 200+ rows of realistic order item data
  const rawData = useMemo(() => {
    const statuses = ['Complete', 'Processing', 'Cancelled', 'Shipped', 'Returned'];
    const categories = ['Electronics', 'Clothing', 'Home & Decor', 'Beauty', 'Sports'];
    const regions = ['North America', 'Europe', 'Asia-Pacific', 'LATAM'];

    return Array.from({ length: 250 }, (_, i) => {
      const date = new Date(2026, 3, 1 + Math.floor(i / 8)); // 30+ days of data
      return {
        id: 1000 + i,
        order_id: 5000 + Math.floor(i / 1.5),
        user_id: 200 + (i % 50),
        sale_price: parseFloat((Math.random() * 150 + 10).toFixed(2)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        created_at: date.toISOString().split('T')[0],
        returned_at: Math.random() > 0.9 ? date : null,
      };
    });
  }, []);

  // --- STATE ---
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    region: 'All'
  });

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const statusMatch = filters.status === 'All' || item.status === filters.status;
      const categoryMatch = filters.category === 'All' || item.category === filters.category;
      const regionMatch = filters.region === 'All' || item.region === filters.region;
      return statusMatch && categoryMatch && regionMatch;
    });
  }, [rawData, filters]);

  // --- AGGREGATION FOR CHART ---
  const chartData = useMemo(() => {
    const dailyMap = {};
    filteredData.forEach(item => {
      const date = item.created_at;
      if (!dailyMap[date]) {
        dailyMap[date] = { date, revenue: 0, orders: new Set(), users: new Set(), units: 0, returns: 0 };
      }
      dailyMap[date].revenue += item.sale_price;
      dailyMap[date].units += 1;
      dailyMap[date].orders.add(item.order_id);
      dailyMap[date].users.add(item.user_id);
      if (item.status === 'Returned') dailyMap[date].returns += 1;
    });

    return Object.values(dailyMap)
      .map(d => ({
        ...d,
        revenue: parseFloat(d.revenue.toFixed(2)),
        orders: d.orders.size,
        users: d.users.size,
        aov: d.orders.size > 0 ? parseFloat((d.revenue / d.orders.size).toFixed(2)) : 0
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData]);

  // --- TOTALS ---
  const totals = useMemo(() => {
    const totalRev = filteredData.reduce((acc, curr) => acc + curr.sale_price, 0);
    const orderSet = new Set(filteredData.map(d => d.order_id));
    return {
      revenue: `$${totalRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      orders: orderSet.size,
      users: new Set(filteredData.map(d => d.user_id)).size,
      aov: orderSet.size > 0 ? `$${(totalRev / orderSet.size).toFixed(2)}` : '$0.00',
      returns: filteredData.filter(d => d.status === 'Returned').length
    };
  }, [filteredData]);

  // --- UI HELPERS ---
  const metrics = [
    { id: 'revenue', label: 'Total Revenue', icon: DollarSign, color: '#3b82f6', value: totals.revenue },
    { id: 'orders', label: 'Order Volume', icon: ShoppingBag, color: '#10b981', value: totals.orders },
    { id: 'users', label: 'Active Customers', icon: Users, color: '#8b5cf6', value: totals.users },
    { id: 'aov', label: 'Avg Order Value', icon: TrendingUp, color: '#f59e0b', value: totals.aov },
    { id: 'returns', label: 'Returned Items', icon: RefreshCcw, color: '#ef4444', value: totals.returns },
  ];

  const toggleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Top Header & Filters */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-blue-600">
            <Package className="w-6 h-6" />
            E-Commerce Insights Engine
          </h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Order Management Analytics</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterGroup 
            label="Status" 
            icon={CheckCircle} 
            current={filters.status} 
            options={['All', 'Complete', 'Processing', 'Cancelled', 'Shipped', 'Returned']}
            onSelect={(val) => toggleFilter('status', val)}
          />
          <FilterGroup 
            label="Category" 
            icon={Layers} 
            current={filters.category} 
            options={['All', 'Electronics', 'Clothing', 'Home & Decor', 'Beauty', 'Sports']}
            onSelect={(val) => toggleFilter('category', val)}
          />
          <FilterGroup 
            label="Region" 
            icon={MapPin} 
            current={filters.region} 
            options={['All', 'North America', 'Europe', 'Asia-Pacific', 'LATAM']}
            onSelect={(val) => toggleFilter('region', val)}
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Measures */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Key Metrics</h2>
            <div className="space-y-2">
              {metrics.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMetric(m.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                    activeMetric === m.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`p-2 rounded-lg ${activeMetric === m.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      <m.icon size={18} />
                    </div>
                    <span className={`text-sm font-semibold ${activeMetric === m.id ? 'text-blue-700' : 'text-gray-600'}`}>
                      {m.label}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${activeMetric === m.id ? 'text-blue-900' : 'text-gray-800'}`}>
                    {m.value}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <Clock size={12} />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </aside>

        {/* Main Content Area: Chart */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 capitalize">
                  {activeMetric.replace('_', ' ')} Trend Analysis
                </h3>
                <p className="text-sm text-gray-500">Visualization for filtered e-commerce order dataset</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">Real-time Data Stream</span>
              </div>
            </div>

            <div className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#94a3b8'}}
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#94a3b8'}}
                    tickFormatter={(val) => activeMetric === 'revenue' || activeMetric === 'aov' ? `$${val}` : val}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [activeMetric === 'revenue' || activeMetric === 'aov' ? `$${value}` : value, metrics.find(m => m.id === activeMetric).label]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={activeMetric} 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMetric)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Table Summary (Meeting the 200+ row requirement) */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-800">Raw Data Audit Log</h4>
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  Showing {filteredData.length} records
                </span>
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-lg max-h-60 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-600">Order ID</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredData.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-2 font-mono text-xs">#{row.order_id}</td>
                        <td className="px-4 py-2">{row.category}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            row.status === 'Complete' ? 'bg-green-100 text-green-700' :
                            row.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right font-medium">${row.sale_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * FilterGroup Component
 */
function FilterGroup({ label, icon: Icon, current, options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        <Icon size={16} className="text-gray-400" />
        <span className="text-gray-500">{label}:</span>
        <span className="text-blue-600 font-bold">{current}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                  current === opt ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}