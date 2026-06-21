import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Bike, DollarSign, Navigation, Activity, Search, Download, 
  Play, Square, Sun, Moon, MapPin, CheckCircle, AlertTriangle, X
} from 'lucide-react';

// ==========================================
// CONSTANTS & CONFIGURATIONS (Visual Spec)
// ==========================================
const LIGHT_THEME = {
  bgPrimary: 'bg-[#ffffff]',
  bgSecondary: 'bg-[#e2e8f0]',
  textPrimary: 'text-[#5c5c5c]',
  textSecondary: 'text-[#475569]',
  border: 'border-[#e2e8f0]',
  cardBg: 'bg-[#ffffff]',
  cardBorder: 'border-[#e2e8f0]',
  buttonPrimary: 'bg-[#598dc5] hover:bg-[#054aa3] text-[#ffffff]',
  buttonSecondary: 'bg-[#ffffff] hover:bg-[#f8fafc] text-[#598dc5] border-[#e2e8f0]',
  tableHeader: 'text-[#457bba]',
  tableRowText: 'text-[#657281]',
  tableRowBorder: 'border-[#f1f5f9]'
};

const DARK_THEME = {
  bgPrimary: 'bg-[#1a1a1a]',
  bgSecondary: 'bg-[#1e293b]',
  textPrimary: 'text-[#dbdbdb]',
  textSecondary: 'text-[#cbd5e1]',
  border: 'border-[#1e293b]',
  cardBg: 'bg-[#1a1a1a]',
  cardBorder: 'border-[#1e293b]',
  buttonPrimary: 'bg-[#5aa1d8] hover:bg-[#3875a3] text-[#000000]',
  buttonSecondary: 'bg-[#292929] hover:bg-[#122940] text-[#a0a7b0] border-[#1e293b]',
  tableHeader: 'text-[#94a3b8]',
  tableRowText: 'text-[#cbd5e1]',
  tableRowBorder: 'border-[#262626]'
};

const CHART_PALETTE = [
  "#ea75b0",
  "#7375c9",
  "#f59e0b",
  "#62a8ea",
  "#aaa47c",
  "#a8d95e"
];

// ==========================================
// INITIAL SEED DATA
// ==========================================
const INITIAL_STATIONS = [
  { id: 1, name: "Broadway & W 29 St", totalDocks: 30, availableBikes: 18, availableDocks: 12, status: "Active", lat: 40.746, lng: -73.988 },
  { id: 2, name: "1 Ave & E 16 St", totalDocks: 24, availableBikes: 5, availableDocks: 19, status: "Active", lat: 40.732, lng: -73.981 },
  { id: 3, name: "W 21 St & 6 Ave", totalDocks: 35, availableBikes: 0, availableDocks: 35, status: "Empty Alert", lat: 40.741, lng: -73.994 },
  { id: 4, name: "E 17 St & Broadway", totalDocks: 28, availableBikes: 26, availableDocks: 2, status: "Full Alert", lat: 40.737, lng: -73.990 },
  { id: 5, name: "Metropolitan Ave & Bedford Ave", totalDocks: 22, availableBikes: 11, availableDocks: 11, status: "Active", lat: 40.714, lng: -73.961 },
  { id: 6, name: "South St & Whitehall St", totalDocks: 40, availableBikes: 20, availableDocks: 20, status: "Active", lat: 40.702, lng: -74.012 },
  { id: 7, name: "8 Ave & W 31 St", totalDocks: 50, availableBikes: 3, availableDocks: 47, status: "Active", lat: 40.750, lng: -73.994 },
  { id: 8, name: "Grand St & Elizabeth St", totalDocks: 18, availableBikes: 14, availableDocks: 4, status: "Active", lat: 40.719, lng: -73.997 }
];

const HISTORICAL_TRENDS = {
  today: [
    { label: "00:00", rentals: 120, revenue: 360 },
    { label: "04:00", rentals: 45, revenue: 135 },
    { label: "08:00", rentals: 680, revenue: 2040 },
    { label: "12:00", rentals: 450, revenue: 1350 },
    { label: "16:00", rentals: 890, revenue: 2670 },
    { label: "20:00", rentals: 520, revenue: 1560 }
  ],
  "7d": [
    { label: "Mon", rentals: 3200, revenue: 9600 },
    { label: "Tue", rentals: 3400, revenue: 10200 },
    { label: "Wed", rentals: 3100, revenue: 9300 },
    { label: "Thu", rentals: 3800, revenue: 11400 },
    { label: "Fri", rentals: 4200, revenue: 12600 },
    { label: "Sat", rentals: 2900, revenue: 8700 },
    { label: "Sun", rentals: 2500, revenue: 7500 }
  ],
  "30d": [
    { label: "W1", rentals: 22000, revenue: 66000 },
    { label: "W2", rentals: 25000, revenue: 75000 },
    { label: "W3", rentals: 24000, revenue: 72000 },
    { label: "W4", rentals: 28000, revenue: 84000 }
  ]
};

export default function BikeRentalDashboardV2() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [darkMode, setDarkMode] = useState(true);
  const [timeframe, setTimeframe] = useState('today'); // 'today' | '7d' | '30d'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stations, setStations] = useState(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState([]);
  
  // Dynamic stats that can be modified by simulation actions
  const [systemStats, setSystemStats] = useState({
    totalRidesOffset: 0,
    revenueOffset: 0,
    activeBikesOffset: 0
  });

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  // ==========================================
  // SIMULATION ENGINE (Fully Functional)
  // ==========================================
  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        // Randomly pick a station to simulate a rent or return
        const stationIndex = Math.floor(Math.random() * stations.length);
        const actionType = Math.random() > 0.5 ? 'RENT' : 'RETURN';
        
        setStations(prevStations => {
          const updated = [...prevStations];
          const st = { ...updated[stationIndex] };

          if (actionType === 'RENT' && st.availableBikes > 0) {
            st.availableBikes -= 1;
            st.availableDocks += 1;
            // Update stats offsets
            setSystemStats(prev => ({
              ...prev,
              totalRidesOffset: prev.totalRidesOffset + 1,
              revenueOffset: prev.revenueOffset + 3.50, // $3.50 average ride cost
            }));
            // Add simulation log
            setSimulationLog(prevLog => [
              { time: new Date().toLocaleTimeString(), message: `1 bike rented from "${st.name}"` },
              ...prevLog.slice(0, 14)
            ]);
          } else if (actionType === 'RETURN' && st.availableDocks > 0) {
            st.availableBikes += 1;
            st.availableDocks -= 1;
            setSimulationLog(prevLog => [
              { time: new Date().toLocaleTimeString(), message: `1 bike returned to "${st.name}"` },
              ...prevLog.slice(0, 14)
            ]);
          }

          // Recalculate status
          if (st.availableBikes === 0) st.status = "Empty Alert";
          else if (st.availableDocks === 0) st.status = "Full Alert";
          else st.status = "Active";

          updated[stationIndex] = st;
          return updated;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, stations.length]);

  // ==========================================
  // DERIVED DATA & CALCULATIONS
  // ==========================================
  const totalBikes = useMemo(() => {
    return stations.reduce((acc, curr) => acc + curr.availableBikes, 0);
  }, [stations]);

  const totalDocks = useMemo(() => {
    return stations.reduce((acc, curr) => acc + curr.totalDocks, 0);
  }, [stations]);

  const availableDocks = useMemo(() => {
    return stations.reduce((acc, curr) => acc + curr.availableDocks, 0);
  }, [stations]);

  const kpiData = useMemo(() => {
    let baseRides = 0;
    let baseRevenue = 0;
    if (timeframe === 'today') {
      baseRides = 2685;
      baseRevenue = 8055;
    } else if (timeframe === '7d') {
      baseRides = 23100;
      baseRevenue = 69300;
    } else {
      baseRides = 99000;
      baseRevenue = 297000;
    }

    return {
      rides: baseRides + systemStats.totalRidesOffset,
      revenue: baseRevenue + systemStats.revenueOffset,
      activeBikes: totalBikes,
      availableDocks: availableDocks
    };
  }, [timeframe, systemStats, totalBikes, availableDocks]);

  // Filtered stations for the table
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || station.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [stations, searchQuery, statusFilter]);

  // Pie chart demographic data
  const userSegmentData = [
    { name: 'Subscribers', value: 78 },
    { name: 'Casual Riders', value: 22 }
  ];

  // Dynamic Chart Data based on timeframe
  const currentTrendData = useMemo(() => {
    const raw = HISTORICAL_TRENDS[timeframe];
    // Incorporate simulated offset into the last data point to show live updates
    if (systemStats.totalRidesOffset > 0 && raw.length > 0) {
      const updated = [...raw];
      const lastIdx = updated.length - 1;
      updated[lastIdx] = {
        ...updated[lastIdx],
        rentals: updated[lastIdx].rentals + systemStats.totalRidesOffset,
        revenue: updated[lastIdx].revenue + systemStats.revenueOffset
      };
      return updated;
    }
    return raw;
  }, [timeframe, systemStats]);

  // ==========================================
  // ACTION HANDLERS
  // ==========================================
  const handleRentBike = (stationId) => {
    setStations(prev => prev.map(st => {
      if (st.id === stationId && st.availableBikes > 0) {
        const updatedBikes = st.availableBikes - 1;
        const updatedDocks = st.availableDocks + 1;
        setSystemStats(prevStats => ({
          ...prevStats,
          totalRidesOffset: prevStats.totalRidesOffset + 1,
          revenueOffset: prevStats.revenueOffset + 3.50
        }));
        return {
          ...st,
          availableBikes: updatedBikes,
          availableDocks: updatedDocks,
          status: updatedBikes === 0 ? "Empty Alert" : "Active"
        };
      }
      return st;
    }));
  };

  const handleReturnBike = (stationId) => {
    setStations(prev => prev.map(st => {
      if (st.id === stationId && st.availableDocks > 0) {
        const updatedBikes = st.availableBikes + 1;
        const updatedDocks = st.availableDocks - 1;
        return {
          ...st,
          availableBikes: updatedBikes,
          availableDocks: updatedDocks,
          status: updatedDocks === 0 ? "Full Alert" : "Active"
        };
      }
      return st;
    }));
  };

  const handleExportCSV = () => {
    const headers = "Station Name,Total Docks,Available Bikes,Available Docks,Status\n";
    const rows = stations.map(s => `"${s.name}",${s.totalDocks},${s.availableBikes},${s.availableDocks},"${s.status}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `bike_stations_export.csv`);
    a.click();
  };

  return (
    <div className={`min-h-screen font-sans ${theme.bgPrimary} ${theme.textPrimary} transition-colors duration-300`}>
      
      {/* ==========================================
          HEADER SECTION
          ========================================== */}
      <header className={`border-b ${theme.border} py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#598dc5] rounded-lg text-white">
            <Bike size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: '600', lineHeight: '1.25' }} className="tracking-tight">
              Velocity Share
            </h1>
            <p style={{ fontSize: '12px' }} className={theme.textSecondary}>
              Real-Time Bike Rental Operations Hub v2.0
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              isSimulating 
                ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse' 
                : `${theme.buttonSecondary}`
            }`}
          >
            {isSimulating ? <Square size={16} /> : <Play size={16} />}
            {isSimulating ? "Stop Simulation" : "Live Simulation"}
          </button>

          {/* Export CSV Utility */}
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${theme.buttonSecondary}`}
          >
            <Download size={16} />
            Export CSV
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg border transition-all ${theme.buttonSecondary}`}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* ==========================================
          SUB-HEADER / FILTERS PANEL
          ========================================== */}
      <section className={`border-b ${theme.border} py-3 px-6 flex flex-col sm:flex-row justify-between items-center gap-4`}>
        {/* Timeframe Selector (Segmented Control) */}
        <div className="flex rounded-lg overflow-hidden border p-1 bg-[#d4dee8] dark:bg-[#121212] border-[#e2e8f0] dark:border-[#1e293b]">
          {['today', '7d', '30d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all uppercase ${
                timeframe === t
                  ? 'bg-white dark:bg-[#262626] text-[#457bb5] dark:text-[#60a5fa] shadow-sm'
                  : 'text-[#598dc5] dark:text-[#94a3b8] hover:text-[#054aa3]'
              }`}
            >
              {t === 'today' ? 'Today' : t === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>

        {/* Real-time Status Alert Banner */}
        {isSimulating && (
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Simulating real-time commuter traffic...
          </div>
        )}
      </section>

      {/* ==========================================
          MAIN CONTENT CONTAINER
          ========================================== */}
      <main className="p-6 space-y-6">

        {/* ==========================================
            KPI METRICS ROW (Responsive Grid)
            ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KPI 1: Total Rides */}
          <div className={`p-5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div>
                <p style={{ fontSize: '12px' }} className={`font-semibold uppercase tracking-wider ${theme.textSecondary}`}>
                  Total Rentals
                </p>
                <h3 style={{ fontSize: '30px', fontWeight: '600' }} className="mt-2 text-slate-800 dark:text-slate-100">
                  {kpiData.rides.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <Bike size={22} />
              </div>
            </div>
            {/* Legitimate target-based progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className={theme.textSecondary}>Daily Target Progress</span>
                <span className="font-semibold">{(kpiData.rides / 5000 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500" 
                  style={{ width: `${Math.min((kpiData.rides / 5000 * 100), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* KPI 2: Total Revenue */}
          <div className={`p-5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div>
                <p style={{ fontSize: '12px' }} className={`font-semibold uppercase tracking-wider ${theme.textSecondary}`}>
                  Est. Revenue
                </p>
                <h3 style={{ fontSize: '30px', fontWeight: '600' }} className="mt-2 text-slate-800 dark:text-slate-100">
                  ${kpiData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <DollarSign size={22} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className={theme.textSecondary}>Target: $15,000</span>
                <span className="font-semibold">{(kpiData.revenue / 15000 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${Math.min((kpiData.revenue / 15000 * 100), 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* KPI 3: Active Bikes */}
          <div className={`p-5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div>
                <p style={{ fontSize: '12px' }} className={`font-semibold uppercase tracking-wider ${theme.textSecondary}`}>
                  Active Bikes In-Station
                </p>
                <h3 style={{ fontSize: '30px', fontWeight: '600' }} className="mt-2 text-slate-800 dark:text-slate-100">
                  {kpiData.activeBikes} <span className="text-xs font-normal text-slate-400">/ {totalBikes + availableDocks}</span>
                </h3>
              </div>
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Activity size={22} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className={theme.textSecondary}>Utilization Rate</span>
                <span className="font-semibold">{(((totalBikes + availableDocks - kpiData.activeBikes) / (totalBikes + availableDocks)) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-500" 
                  style={{ width: `${((totalBikes + availableDocks - kpiData.activeBikes) / (totalBikes + availableDocks)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* KPI 4: Empty / Full Alerts */}
          <div className={`p-5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div>
                <p style={{ fontSize: '12px' }} className={`font-semibold uppercase tracking-wider ${theme.textSecondary}`}>
                  Critical Alerts
                </p>
                <h3 style={{ fontSize: '30px', fontWeight: '600' }} className="mt-2 text-slate-800 dark:text-slate-100">
                  {stations.filter(s => s.status !== "Active").length}
                </h3>
              </div>
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                <AlertTriangle size={22} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-rose-400 font-medium">
                {stations.filter(s => s.status === "Empty Alert").length} Empty Stations
              </span>
              <span className="text-amber-500 font-medium">
                {stations.filter(s => s.status === "Full Alert").length} Full Stations
              </span>
            </div>
          </div>

        </div>

        {/* ==========================================
            CHARTS SECTION (Mixed Grid)
            ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Trend Chart */}
          <div className={`lg:col-span-2 p-5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '500' }}>Rental Demand & Revenue Trend</h4>
                <p style={{ fontSize: '12px' }} className={theme.textSecondary}>Showing historical values with live updates incorporated</p>
              </div>
              <span className="text-xs font-semibold bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full uppercase">
                {timeframe} Data
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRentals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_PALETTE[3]} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={CHART_PALETTE[3]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_PALETTE[5]} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={CHART_PALETTE[5]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#e2e8f0"} />
                  <XAxis dataKey="label" stroke={darkMode ? "#94a3b8" : "#64748b"} style={{ fontSize: '11px' }} />
                  <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} style={{ fontSize: '11px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff', 
                      borderColor: darkMode ? '#334155' : '#cbd5e7',
                      color: darkMode ? '#cbd5e1' : '#475569',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area name="Rentals Count" type="monotone" dataKey="rentals" stroke={CHART_PALETTE[3]} fillOpacity={1} fill="url(#colorRentals)" strokeWidth={2} />
                  <Area name="Revenue ($)" type="monotone" dataKey="revenue" stroke={CHART_PALETTE[5]} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Chart: Demographics & Simulation Log */}
          <div className="space-y-6">
            
            {/* User Type Breakdown */}
            <div className={`p-5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm`}>
              <h4 style={{ fontSize: '18px', fontWeight: '500' }} className="mb-2">User Segmentation</h4>
              <div className="h-44 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userSegmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {userSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_PALETTE[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold">78%</span>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold">Subscribers</span>
                </div>
              </div>
              <div className="flex justify-around mt-2">
                {userSegmentData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_PALETTE[index] }}></span>
                    <span className="text-xs font-medium">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulation Logger */}
            <div className={`p-4 rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm h-[180px] flex flex-col`}>
              <div className="flex justify-between items-center mb-2 border-b border-slate-700/50 pb-1.5">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Traffic Logs</h5>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex-1 overflow-y-auto text-xs space-y-1.5 pr-2 custom-scrollbar">
                {simulationLog.length === 0 ? (
                  <p className="text-slate-500 italic text-center mt-6">No live events. Turn on 'Live Simulation' to observe traffic.</p>
                ) : (
                  simulationLog.map((log, idx) => (
                    <div key={idx} className="flex justify-between gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                      <span className="text-[10px] text-indigo-400">{log.time}</span>
                      <span className="text-left flex-1 truncate">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* ==========================================
            STATION MANAGEMENT & DATA TABLE
            ========================================== */}
        <div className={`p-5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-sm`}>
          
          {/* Table Header Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h4 style={{ fontSize: '20px', fontWeight: '600' }}>Station Status Directory</h4>
              <p style={{ fontSize: '12px' }} className={theme.textSecondary}>Monitor, inspect, and simulate individual station rentals</p>
            </div>
            
            {/* Search and Status filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border bg-slate-50 dark:bg-[#121212] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Empty Alert">Empty Alert</option>
                <option value="Full Alert">Full Alert</option>
              </select>
            </div>
          </div>

          {/* Interactive Data Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-slate-800">
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme.tableHeader}`}>Station Name</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme.tableHeader}`}>Capacity</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme.tableHeader}`}>Bikes Available</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme.tableHeader}`}>Docks Available</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme.tableHeader}`}>Status</th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${theme.tableHeader}`}>Interactive Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 italic">No stations matched your search criteria.</td>
                  </tr>
                ) : (
                  filteredStations.map((station) => (
                    <tr key={station.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {station.name}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                        {station.totalDocks}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        <span className={station.availableBikes === 0 ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                          {station.availableBikes}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium">
                        <span className={station.availableDocks === 0 ? 'text-amber-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                          {station.availableDocks}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          station.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : station.status === 'Empty Alert'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            station.status === 'Active' 
                              ? 'bg-emerald-500' 
                              : station.status === 'Empty Alert'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}></span>
                          {station.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleRentBike(station.id)}
                          disabled={station.availableBikes === 0}
                          className={`px-3 py-1 text-xs rounded font-medium transition-all ${
                            station.availableBikes === 0
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white'
                          }`}
                        >
                          Rent Bike
                        </button>
                        <button
                          onClick={() => handleReturnBike(station.id)}
                          disabled={station.availableDocks === 0}
                          className={`px-3 py-1 text-xs rounded font-medium transition-all ${
                            station.availableDocks === 0
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-white'
                          }`}
                        >
                          Return
                        </button>
                        <button
                          onClick={() => setSelectedStation(station)}
                          className="px-3 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-all"
                        >
                          Details & Map
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ==========================================
          MODAL OVERLAY: STATION DETAILS & MAP (Overlay Skill)
          ========================================== */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-2xl rounded-xl border ${theme.cardBorder} ${theme.cardBg} shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b ${theme.border} flex justify-between items-center`}>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MapPin className="text-blue-500" size={20} />
                  {selectedStation.name}
                </h3>
                <p className="text-xs text-slate-400">Station Coordinates: {selectedStation.lat}, {selectedStation.lng}</p>
              </div>
              <button 
                onClick={() => setSelectedStation(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Simulated Map Canvas */}
              <div className="relative h-60 w-full bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Map Mock Grid Graphics */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                {/* Simulated streets */}
                <div className="absolute inset-0 flex flex-col justify-around opacity-30 pointer-events-none">
                  <div className="h-6 bg-slate-400 dark:bg-slate-700 w-full"></div>
                  <div className="h-6 bg-slate-400 dark:bg-slate-700 w-full"></div>
                </div>
                <div className="absolute inset-0 flex justify-around opacity-30 pointer-events-none">
                  <div className="w-6 bg-slate-400 dark:bg-slate-700 h-full"></div>
                  <div className="w-6 bg-slate-400 dark:bg-slate-700 h-full"></div>
                </div>

                {/* Pin Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="p-3 bg-blue-500 text-white rounded-full shadow-lg animate-bounce">
                    <Bike size={24} />
                  </div>
                  <div className="mt-2 px-3 py-1 bg-slate-800 text-white text-xs rounded shadow-md font-semibold">
                    {selectedStation.name}
                  </div>
                </div>

                {/* Legend overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 text-[10px] text-slate-300 p-2.5 rounded-md space-y-1 border border-slate-700">
                  <p className="font-bold border-b border-slate-700 pb-1 mb-1 text-white">Simulated Map View</p>
                  <p>Latitude: {selectedStation.lat}</p>
                  <p>Longitude: {selectedStation.lng}</p>
                </div>
              </div>

              {/* Station Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Docks</span>
                  <span className="text-2xl font-bold">{selectedStation.totalDocks}</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Bikes Available</span>
                  <span className="text-2xl font-bold text-blue-500">{selectedStation.availableBikes}</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Docks Available</span>
                  <span className="text-2xl font-bold text-emerald-500">{selectedStation.availableDocks}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 bg-slate-50 dark:bg-[#121212] border-t ${theme.border} flex justify-end gap-3`}>
              <button
                onClick={() => setSelectedStation(null)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border ${theme.buttonSecondary}`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRentBike(selectedStation.id);
                  // Quick update on modal state
                  setSelectedStation(prev => ({
                    ...prev,
                    availableBikes: Math.max(0, prev.availableBikes - 1),
                    availableDocks: Math.min(prev.totalDocks, prev.availableDocks + 1)
                  }));
                }}
                disabled={selectedStation.availableBikes === 0}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
              >
                Rent Bike Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}