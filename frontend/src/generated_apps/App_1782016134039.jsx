import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

// --- MOCK DATA GENERATOR ---
const generateMockData = () => {
  const stations = [
    { id: 'st-1', name: 'Central Park West', totalDocks: 40, availableBikes: 24, availableDocks: 15, status: 'Active', region: 'Uptown', maintenanceNeeded: 1 },
    { id: 'st-2', name: 'Times Square North', totalDocks: 50, availableBikes: 8, availableDocks: 41, status: 'Active', region: 'Midtown', maintenanceNeeded: 1 },
    { id: 'st-3', name: 'Brooklyn Bridge Park', totalDocks: 30, availableBikes: 18, availableDocks: 12, status: 'Active', region: 'Brooklyn', maintenanceNeeded: 0 },
    { id: 'st-4', name: 'Grand Central Terminal', totalDocks: 45, availableBikes: 35, availableDocks: 9, status: 'Active', region: 'Midtown', maintenanceNeeded: 1 },
    { id: 'st-5', name: 'Union Square South', totalDocks: 35, availableBikes: 3, availableDocks: 31, status: 'Low Inventory', region: 'Downtown', maintenanceNeeded: 1 },
    { id: 'st-6', name: 'Penn Station Plaza', totalDocks: 60, availableBikes: 52, availableDocks: 7, status: 'Full', region: 'Midtown', maintenanceNeeded: 1 },
    { id: 'st-7', name: 'City Hall Park', totalDocks: 25, availableBikes: 12, availableDocks: 13, status: 'Active', region: 'Downtown', maintenanceNeeded: 0 },
    { id: 'st-8', name: 'Wall St Ferry', totalDocks: 30, availableBikes: 15, availableDocks: 15, status: 'Active', region: 'Downtown', maintenanceNeeded: 0 },
  ];

  // Generate 30 days of trend data
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const baseSubscriber = 450 + Math.floor(Math.sin(day / 2) * 150) + Math.floor(Math.random() * 80);
    const baseCasual = 200 + Math.floor(Math.cos(day / 3) * 120) + Math.floor(Math.random() * 60);
    const avgDuration = Math.round(15 + Math.sin(day / 5) * 5 + Math.random() * 3);
    const revenue = Math.round(baseSubscriber * 1.5 + baseCasual * 4.5);

    return {
      date: `Oct ${day.toString().padStart(2, '0')}`,
      subscriberRentals: baseSubscriber,
      casualRentals: baseCasual,
      totalRentals: baseSubscriber + baseCasual,
      revenue,
      avgDuration,
    };
  });

  return { stations, trendData };
};

const { stations: initialStations, trendData: initialTrendData } = generateMockData();

// --- PALETTE CONSTANTS (from Visual Spec) ---
const LIGHT_THEME = {
  bgPrimary: '#ffffff',
  bgSecondary: '#e2e8f0',
  textPrimary: '#5c5c5c',
  textSecondary: '#475569',
  border: '#e2e8f0',
  cardBg: '#ffffff',
  cardTitle: '#457bb4',
  cardValue: '#5f6972',
  tableHeader: '#457bba',
  tableRowText: '#657281',
  tableRowBorder: '#f1f5f9',
};

const DARK_THEME = {
  bgPrimary: '#1a1a1a',
  bgSecondary: '#1e293b',
  textPrimary: '#dbdbdb',
  textSecondary: '#cbd5e1',
  border: '#1e293b',
  cardBg: '#1a1a1a',
  cardTitle: '#94a3b8',
  cardValue: '#cbd5e1',
  tableHeader: '#94a3b8',
  tableRowText: '#cbd5e1',
  tableRowBorder: '#262626',
};

const CHART_COLORS = [
  "#ea75b0",
  "#7375c9",
  "#f59e0b",
  "#62a8ea",
  "#aaa47c",
  "#a8d95e",
  "#40bdd4",
  "#ef4444"
];

export default function BikeRentalDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [dateRange, setDateRange] = useState('7d'); // '7d' | '30d'
  const [userTypeFilter, setUserTypeFilter] = useState('all'); // 'all' | 'subscriber' | 'casual'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  // --- FILTERED & DERIVED DATA ---
  const filteredTrendData = useMemo(() => {
    const daysToKeep = dateRange === '7d' ? 7 : 30;
    return initialTrendData.slice(-daysToKeep);
  }, [dateRange]);

  const kpis = useMemo(() => {
    let totalRentals = 0;
    let subscriberRentals = 0;
    let casualRentals = 0;
    let totalRevenue = 0;
    let totalDuration = 0;

    filteredTrendData.forEach(d => {
      subscriberRentals += d.subscriberRentals;
      casualRentals += d.casualRentals;
      totalRentals += d.totalRentals;
      totalRevenue += d.revenue;
      totalDuration += d.avgDuration * d.totalRentals;
    });

    const avgDuration = totalRentals > 0 ? Math.round(totalDuration / totalRentals) : 0;

    // Filter by user type if requested
    const displayRentals = userTypeFilter === 'all' 
      ? totalRentals 
      : userTypeFilter === 'subscriber' ? subscriberRentals : casualRentals;

    const displayRevenue = userTypeFilter === 'all'
      ? totalRevenue
      : userTypeFilter === 'subscriber' ? Math.round(subscriberRentals * 1.5) : Math.round(casualRentals * 4.5);

    return {
      totalRentals: displayRentals,
      activeRides: Math.floor(Math.random() * 150) + 80, // Simulated live rides
      revenue: displayRevenue,
      avgDuration,
    };
  }, [filteredTrendData, userTypeFilter]);

  const userTypeComposition = useMemo(() => {
    let subscriber = 0;
    let casual = 0;
    filteredTrendData.forEach(d => {
      subscriber += d.subscriberRentals;
      casual += d.casualRentals;
    });
    return [
      { name: 'Subscriber', value: subscriber },
      { name: 'Casual', value: casual }
    ];
  }, [filteredTrendData]);

  const popularStations = useMemo(() => {
    // Generate static popular ranking based on station regions
    return [
      { name: 'Central Park West', rides: 1420 },
      { name: 'Grand Central', rides: 1250 },
      { name: 'Times Square North', rides: 1100 },
      { name: 'Penn Station Plaza', rides: 980 },
      { name: 'Brooklyn Bridge Park', rides: 850 },
    ];
  }, []);

  const sortedStations = useMemo(() => {
    let result = initialStations.filter(station => 
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
    });

    return result;
  }, [searchTerm, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary, fontFamily: 'Inter, sans-serif' }}
    >
      {/* HEADER SECTION */}
      <header 
        className="w-full border-b px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{ borderColor: theme.border, backgroundColor: theme.bgPrimary }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.textPrimary }}>
            BikeShare Operations Portal
          </h1>
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Real-time fleet status, rental metrics, and station distribution.
          </p>
        </div>

        {/* Global Controls & Theme Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex rounded-md p-1" style={{ backgroundColor: theme.bgSecondary }}>
            <button
              onClick={() => setDateRange('7d')}
              className="px-3 py-1 text-xs font-medium rounded transition-all"
              style={{
                backgroundColor: dateRange === '7d' ? (isDark ? '#262626' : '#ffffff') : 'transparent',
                color: dateRange === '7d' ? (isDark ? '#cbd5e1' : '#457bb5') : theme.textSecondary,
              }}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className="px-3 py-1 text-xs font-medium rounded transition-all"
              style={{
                backgroundColor: dateRange === '30d' ? (isDark ? '#262626' : '#ffffff') : 'transparent',
                color: dateRange === '30d' ? (isDark ? '#cbd5e1' : '#457bb5') : theme.textSecondary,
              }}
            >
              30 Days
            </button>
          </div>

          {/* User Type Filter */}
          <div className="flex rounded-md p-1" style={{ backgroundColor: theme.bgSecondary }}>
            {['all', 'subscriber', 'casual'].map((type) => (
              <button
                key={type}
                onClick={() => setUserTypeFilter(type)}
                className="px-3 py-1 text-xs font-medium rounded capitalize transition-all"
                style={{
                  backgroundColor: userTypeFilter === type ? (isDark ? '#262626' : '#ffffff') : 'transparent',
                  color: userTypeFilter === type ? (isDark ? '#cbd5e1' : '#457bb5') : theme.textSecondary,
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded border transition-colors hover:opacity-80"
            style={{ 
              borderColor: theme.border, 
              backgroundColor: theme.bgSecondary,
              color: theme.textPrimary
            }}
            aria-label="Toggle Theme"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT CANVAS */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* KPI ROWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Rentals */}
          <div 
            className="p-5 border rounded-xl flex flex-col justify-between"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.cardTitle }}>
              Total Rentals
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight" style={{ color: theme.cardValue }}>
                {kpis.totalRentals.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-[#10b981]">+12.4%</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
              <div className="h-full bg-[#5aa1d8]" style={{ width: '75%' }}></div>
            </div>
          </div>

          {/* Card 2: Active Rides */}
          <div 
            className="p-5 border rounded-xl flex flex-col justify-between"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.cardTitle }}>
              Active Rides (Live)
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight" style={{ color: theme.cardValue }}>
                {kpis.activeRides}
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]"></span>
              </span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
              <div className="h-full bg-[#7375c9]" style={{ width: '45%' }}></div>
            </div>
          </div>

          {/* Card 3: Revenue */}
          <div 
            className="p-5 border rounded-xl flex flex-col justify-between"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.cardTitle }}>
              Gross Revenue
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight" style={{ color: theme.cardValue }}>
                ${kpis.revenue.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-[#10b981]">+8.2%</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
              <div className="h-full bg-[#f59e0b]" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* Card 4: Avg Trip Duration */}
          <div 
            className="p-5 border rounded-xl flex flex-col justify-between"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.cardTitle }}>
              Avg Trip Duration
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight" style={{ color: theme.cardValue }}>
                {kpis.avgDuration} min
              </span>
              <span className="text-xs font-medium text-[#94a3b8]">Steady</span>
            </div>
            <div className="mt-3 h-1 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
              <div className="h-full bg-[#62a8ea]" style={{ width: '52%' }}></div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: PRIMARY TRENDS & COMPOSITION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart */}
          <div 
            className="lg:col-span-2 p-5 border rounded-xl space-y-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold" style={{ color: theme.textPrimary }}>Rental Volume Over Time</h3>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Daily trip counts segmented by user type.</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#f1f5f9'} />
                  <XAxis dataKey="date" stroke={theme.textSecondary} fontSize={11} />
                  <YAxis stroke={theme.textSecondary} fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.cardBg, 
                      borderColor: theme.border, 
                      color: theme.textPrimary,
                      fontSize: '12px',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {userTypeFilter !== 'casual' && (
                    <Line 
                      type="monotone" 
                      dataKey="subscriberRentals" 
                      name="Subscribers" 
                      stroke={CHART_COLORS[3]} 
                      strokeWidth={2} 
                      dot={false}
                    />
                  )}
                  {userTypeFilter !== 'subscriber' && (
                    <Line 
                      type="monotone" 
                      dataKey="casualRentals" 
                      name="Casual Riders" 
                      stroke={CHART_COLORS[0]} 
                      strokeWidth={2} 
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Composition Donut Chart */}
          <div 
            className="p-5 border rounded-xl flex flex-col justify-between"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <div>
              <h3 className="text-base font-semibold" style={{ color: theme.textPrimary }}>Rider Profile Composition</h3>
              <p className="text-xs" style={{ color: theme.textSecondary }}>Proportion of Subscriber vs Casual trips.</p>
            </div>
            <div className="h-56 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypeComposition}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill={CHART_COLORS[3]} />
                    <Cell fill={CHART_COLORS[0]} />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.cardBg, 
                      borderColor: theme.border, 
                      color: theme.textPrimary,
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-2xl font-bold block" style={{ color: theme.textPrimary }}>
                  {Math.round((userTypeComposition[0].value / (userTypeComposition[0].value + userTypeComposition[1].value)) * 100)}%
                </span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: theme.textSecondary }}>
                  Subscribers
                </span>
              </div>
            </div>
            <div className="flex justify-around text-xs mt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[3] }}></span>
                <span style={{ color: theme.textSecondary }}>Subscriber ({userTypeComposition[0].value.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[0] }}></span>
                <span style={{ color: theme.textSecondary }}>Casual ({userTypeComposition[1].value.toLocaleString()})</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: POPULAR STATIONS & STATION INVENTORY TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Stations Bar Chart */}
          <div 
            className="p-5 border rounded-xl space-y-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <div>
              <h3 className="text-base font-semibold" style={{ color: theme.textPrimary }}>Top 5 Pick-up Stations</h3>
              <p className="text-xs" style={{ color: theme.textSecondary }}>Ranked by total rental departures.</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularStations} layout="vertical" margin={{ left: 15, right: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#f1f5f9'} horizontal={false} />
                  <XAxis type="number" stroke={theme.textSecondary} fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke={theme.textSecondary} fontSize={10} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.cardBg, 
                      borderColor: theme.border, 
                      color: theme.textPrimary,
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="rides" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]}>
                    {popularStations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Station Inventory Table */}
          <div 
            className="lg:col-span-2 p-5 border rounded-xl flex flex-col justify-between"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold" style={{ color: theme.textPrimary }}>Live Station Inventory</h3>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Real-time dock availability and maintenance status.</p>
                </div>
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search station or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded border outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  style={{ 
                    backgroundColor: isDark ? '#121212' : '#ffffff', 
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }}
                />
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: theme.border }}>
                      {['Station Name', 'Region', 'Bikes Available', 'Docks Available', 'Status'].map((header, i) => {
                        const fields = ['name', 'region', 'availableBikes', 'availableDocks', 'status'];
                        return (
                          <th 
                            key={header}
                            onClick={() => handleSort(fields[i])}
                            className="py-3 px-2 text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ color: theme.tableHeader }}
                          >
                            <div className="flex items-center gap-1">
                              {header}
                              {sortField === fields[i] && (sortOrder === 'asc' ? ' ▴' : ' ▾')}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStations.map((station) => (
                      <tr 
                        key={station.id} 
                        onClick={() => setSelectedStation(station)}
                        className="border-b cursor-pointer hover:bg-opacity-50 transition-colors"
                        style={{ 
                          borderColor: theme.tableRowBorder,
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#262626' : '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="py-2.5 px-2 text-xs font-medium" style={{ color: theme.textPrimary }}>
                          {station.name}
                        </td>
                        <td className="py-2.5 px-2 text-xs" style={{ color: theme.textSecondary }}>
                          {station.region}
                        </td>
                        <td className="py-2.5 px-2 text-xs font-semibold" style={{ color: theme.textPrimary }}>
                          {station.availableBikes} <span className="text-[10px] font-normal" style={{ color: theme.textSecondary }}>/ {station.totalDocks}</span>
                        </td>
                        <td className="py-2.5 px-2 text-xs" style={{ color: theme.textSecondary }}>
                          {station.availableDocks}
                        </td>
                        <td className="py-2.5 px-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            station.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            station.status === 'Low Inventory' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {station.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {sortedStations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs italic" style={{ color: theme.textSecondary }}>
                          No stations matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* DETAIL MODAL (Fully Functional Overlay) */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center p-4 z-50">
          <div 
            className="w-full max-w-md border rounded-xl shadow-2xl overflow-hidden transition-all"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          >
            {/* Modal Header */}
            <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
              <div>
                <h4 className="text-base font-bold" style={{ color: theme.textPrimary }}>
                  {selectedStation.name}
                </h4>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Station ID: {selectedStation.id} • {selectedStation.region}
                </p>
              </div>
              <button 
                onClick={() => setSelectedStation(null)}
                className="text-lg font-bold hover:opacity-70 transition-opacity px-2 py-1"
                style={{ color: theme.textSecondary }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: theme.bgSecondary }}>
                  <span className="text-[10px] uppercase font-semibold tracking-wider block" style={{ color: theme.textSecondary }}>
                    Bikes Available
                  </span>
                  <span className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                    {selectedStation.availableBikes}
                  </span>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: theme.bgSecondary }}>
                  <span className="text-[10px] uppercase font-semibold tracking-wider block" style={{ color: theme.textSecondary }}>
                    Empty Docks
                  </span>
                  <span className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                    {selectedStation.availableDocks}
                  </span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span style={{ color: theme.textSecondary }}>Capacity Utilization</span>
                  <span className="font-semibold" style={{ color: theme.textPrimary }}>
                    {Math.round((selectedStation.availableBikes / selectedStation.totalDocks) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#5aa1d8]" 
                    style={{ width: `${(selectedStation.availableBikes / selectedStation.totalDocks) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Status and Diagnostics */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs border-b pb-2" style={{ borderColor: theme.tableRowBorder }}>
                  <span style={{ color: theme.textSecondary }}>Operating Status</span>
                  <span className="font-semibold" style={{ color: theme.textPrimary }}>{selectedStation.status}</span>
                </div>
                <div className="flex justify-between text-xs border-b pb-2" style={{ borderColor: theme.tableRowBorder }}>
                  <span style={{ color: theme.textSecondary }}>Total Docks</span>
                  <span className="font-semibold" style={{ color: theme.textPrimary }}>{selectedStation.totalDocks}</span>
                </div>
                <div className="flex justify-between text-xs pb-2">
                  <span style={{ color: theme.textSecondary }}>Maintenance Required</span>
                  <span className={`font-semibold ${selectedStation.maintenanceNeeded ? 'text-[#ef4444]' : 'text-emerald-500'}`}>
                    {selectedStation.maintenanceNeeded ? 'Yes (Scheduled)' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: theme.border, backgroundColor: isDark ? '#121212' : '#f8fafc' }}>
              <button
                onClick={() => setSelectedStation(null)}
                className="px-4 py-2 text-xs font-semibold rounded transition-all border"
                style={{ 
                  backgroundColor: theme.bgPrimary, 
                  borderColor: theme.border,
                  color: theme.textPrimary 
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Dispatched maintenance crew to ${selectedStation.name}`);
                  setSelectedStation(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded text-white transition-all bg-[#598dc5] hover:bg-[#054aa3]"
              >
                Dispatch Crew
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}