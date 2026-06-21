import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { 
  Bike, MapPin, Search, Download, Sun, CloudRain, Cloud, AlertTriangle, 
  TrendingUp, DollarSign, Clock, X, Info, Moon, CheckCircle2, RefreshCw
} from 'lucide-react';

// ==========================================
// MOCK DATA GENERATION (State-Driven)
// ==========================================

const STATIONS_PRESETS = [
  { id: 1, name: "Grand Ave & 12th St", lat: 35, lng: 40, totalDocks: 30, bikes: 18, status: "Active" },
  { id: 2, name: "Broadway & W 24th St", lat: 45, lng: 70, totalDocks: 24, bikes: 2, status: "Low Inventory" },
  { id: 3, name: "Millennium Park Plaza", lat: 20, lng: 55, totalDocks: 40, bikes: 38, status: "Near Capacity" },
  { id: 4, name: "Union Station South", lat: 60, lng: 30, totalDocks: 50, bikes: 25, status: "Active" },
  { id: 5, name: "Clark St & Elm St", lat: 80, lng: 45, totalDocks: 20, bikes: 0, status: "Empty" },
  { id: 6, name: "Lake Shore Dr & Monroe", lat: 30, lng: 85, totalDocks: 35, bikes: 15, status: "Active" },
  { id: 7, name: "University Campus East", lat: 75, lng: 80, totalDocks: 30, bikes: 12, status: "Active" },
  { id: 8, name: "Tech District Plaza", lat: 15, lng: 25, totalDocks: 25, bikes: 8, status: "Maintenance" },
  { id: 9, name: "Waterfront Boulevard", lat: 50, lng: 90, totalDocks: 28, bikes: 19, status: "Active" },
  { id: 10, name: "Museum Campus Loop", lat: 85, lng: 20, totalDocks: 32, bikes: 31, status: "Near Capacity" }
];

// Generate hourly trends based on weather and timeframe
const generateHourlyData = (timeFrame, weather) => {
  const points = timeFrame === 'today' ? 24 : timeFrame === '7d' ? 7 : 30;
  const weatherMultiplier = weather === 'sunny' ? 1.3 : weather === 'rainy' ? 0.5 : 0.9;
  
  return Array.from({ length: points }, (_, i) => {
    const baseRides = timeFrame === 'today' 
      ? Math.sin((i - 6) * Math.PI / 12) * 150 + 200 // Peaks around 8 AM and 5 PM
      : Math.floor(Math.random() * 800) + 1200;
    
    const rides = Math.max(20, Math.floor(baseRides * weatherMultiplier));
    const casual = Math.floor(rides * (weather === 'rainy' ? 0.15 : 0.35));
    const member = rides - casual;

    return {
      label: timeFrame === 'today' ? `${i}:00` : timeFrame === '7d' ? `Day ${i + 1}` : `Oct ${i + 1}`,
      Rides: rides,
      Member: member,
      Casual: casual,
      Revenue: Math.floor(rides * 2.5)
    };
  });
};

export default function BikeRentalDashboard() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [theme, setTheme] = useState('dark'); // 'light' | 'dark'
  const [timeFrame, setTimeFrame] = useState('7d'); // 'today' | '7d' | '30d'
  const [weatherFilter, setWeatherFilter] = useState('all'); // 'all' | 'sunny' | 'rainy' | 'cloudy'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapHoverStation, setMapHoverStation] = useState(null);

  // Toggle Theme
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Dynamic Data Calculation based on filters
  const trendData = useMemo(() => {
    return generateHourlyData(timeFrame, weatherFilter);
  }, [timeFrame, weatherFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalRides = trendData.reduce((acc, curr) => acc + curr.Rides, 0);
    const totalRevenue = trendData.reduce((acc, curr) => acc + curr.Revenue, 0);
    const activeBikes = weatherFilter === 'sunny' ? 3840 : weatherFilter === 'rainy' ? 1420 : 2950;
    const avgDuration = weatherFilter === 'rainy' ? '12.4 min' : '18.7 min';

    return {
      totalRides,
      totalRevenue,
      activeBikes,
      avgDuration
    };
  }, [trendData, weatherFilter]);

  // Member vs Casual Split
  const userSegmentData = useMemo(() => {
    const totalMember = trendData.reduce((acc, curr) => acc + curr.Member, 0);
    const totalCasual = trendData.reduce((acc, curr) => acc + curr.Casual, 0);
    return [
      { name: 'Subscriber/Member', value: totalMember, color: '#62a8ea' },
      { name: 'Casual Rider', value: totalCasual, color: '#ea75b0' }
    ];
  }, [trendData]);

  // Filter Stations List
  const filteredStations = useMemo(() => {
    return STATIONS_PRESETS.filter(station => {
      const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || station.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Dynamic Station Alert Count
  const criticalStationsCount = useMemo(() => {
    return STATIONS_PRESETS.filter(s => s.status === 'Empty' || s.status === 'Low Inventory' || s.status === 'Maintenance').length;
  }, []);

  // CSV Export Action
  const handleExportCSV = () => {
    const headers = ["Station Name", "Total Docks", "Available Bikes", "Occupancy (%)", "Status"];
    const rows = filteredStations.map(s => [
      s.name,
      s.totalDocks,
      s.bikes,
      Math.round((s.bikes / s.totalDocks) * 100),
      s.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bike_stations_export_${timeFrame}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Visual Palette Tokens (Strictly mapped to Visual Specs)
  const colors = {
    bgPrimary: theme === 'light' ? 'bg-[#ffffff]' : 'bg-[#1a1a1a]',
    bgSecondary: theme === 'light' ? 'bg-[#e2e8f0]' : 'bg-[#1e293b]',
    textPrimary: theme === 'light' ? 'text-[#5c5c5c]' : 'text-[#dbdbdb]',
    textSecondary: theme === 'light' ? 'text-[#475569]' : 'text-[#cbd5e1]',
    border: theme === 'light' ? 'border-[#e2e8f0]' : 'border-[#1e293b]',
    cardBg: theme === 'light' ? 'bg-[#ffffff]' : 'bg-[#1a1a1a]',
    cardBorder: theme === 'light' ? 'border-[#e2e8f0]' : 'border-[#1e293b]',
    buttonPrimary: theme === 'light' ? 'bg-[#598dc5] hover:bg-[#054aa3] text-[#ffffff]' : 'bg-[#5aa1d8] hover:bg-[#3875a3] text-[#000000]',
    buttonSecondary: theme === 'light' ? 'bg-[#ffffff] hover:bg-[#f8fafc] text-[#598dc5] border-[#e2e8f0]' : 'bg-[#292929] hover:bg-[#122940] text-[#a0a7b0] border-[#1e293b]'
  };

  return (
    <div className={`min-h-screen ${colors.bgPrimary} ${colors.textPrimary} transition-colors duration-200 font-sans p-6`}>
      
      {/* ==========================================
          HEADER SECTION
          ========================================== */}
      <header className={`flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 mb-6 border-b ${colors.border} gap-4`}>
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#598dc5]/20 rounded-lg">
              <Bike className="w-8 h-8 text-[#598dc5] dark:text-[#5aa1d8]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">MetroRide Operations</h1>
              <p className={`text-xs ${colors.textSecondary}`}>Network Performance & Station Inventory Control Board • v3.2</p>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Weather Filter */}
          <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-lg p-1 border border-neutral-300 dark:border-neutral-800">
            <button 
              onClick={() => setWeatherFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${weatherFilter === 'all' ? 'bg-[#598dc5] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              All Weather
            </button>
            <button 
              onClick={() => setWeatherFilter('sunny')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${weatherFilter === 'sunny' ? 'bg-amber-500 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setWeatherFilter('rainy')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${weatherFilter === 'rainy' ? 'bg-blue-500 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setWeatherFilter('cloudy')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${weatherFilter === 'cloudy' ? 'bg-gray-500 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              <Cloud className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-black/10 dark:bg-white/5 rounded-lg p-1 border border-neutral-300 dark:border-neutral-800">
            {['today', '7d', '30d'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-3 py-1 text-xs font-medium rounded-md uppercase transition-all ${timeFrame === tf ? 'bg-[#598dc5] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-lg border ${colors.border} ${colors.bgSecondary} transition-all hover:opacity-80`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* ==========================================
          KPI METRIC CARDS
          ========================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Total Rides */}
        <div className={`p-5 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm relative overflow-hidden`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Rides</span>
            <TrendingUp className="w-4 h-4 text-[#62a8ea]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{metrics.totalRides.toLocaleString()}</span>
            <span className="text-xs text-emerald-500 font-medium">+12.4%</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Adjusted for selected filters</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#62a8ea] to-transparent opacity-40" />
        </div>

        {/* Active Bikes */}
        <div className={`p-5 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm relative overflow-hidden`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Active Fleet</span>
            <Bike className="w-4 h-4 text-[#7375c9]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{metrics.activeBikes.toLocaleString()}</span>
            <span className="text-xs text-emerald-500 font-medium">94% Deploy</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Bikes currently on active trips</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7375c9] to-transparent opacity-40" />
        </div>

        {/* Avg Duration */}
        <div className={`p-5 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm relative overflow-hidden`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Avg Trip Time</span>
            <Clock className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{metrics.avgDuration}</span>
            <span className="text-xs text-amber-500 font-medium">-1.2m vs avg</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Reflects commuter rush hours</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f59e0b] to-transparent opacity-40" />
        </div>

        {/* Total Revenue */}
        <div className={`p-5 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm relative overflow-hidden`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Est. Revenue</span>
            <DollarSign className="w-4 h-4 text-[#aaa47c]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">${metrics.totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-emerald-500 font-medium">+$4.2k today</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Includes passes & overage fees</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#aaa47c] to-transparent opacity-40" />
        </div>

      </section>

      {/* ==========================================
          ANALYTICS CHARTS SECTION
          ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Main Trend Chart */}
        <div className={`lg:col-span-2 p-5 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-semibold">Rental Volume Trend</h3>
              <p className="text-xs text-neutral-400">Visualizing fleet usage distribution</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#62a8ea]" />Subscriber</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ea75b0]" />Casual</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMember" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCasual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea75b0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ea75b0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'light' ? '#e2e8f0' : '#262626'} />
                <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'light' ? '#ffffff' : '#1e293b', 
                    borderColor: theme === 'light' ? '#cbd5e1' : '#334155',
                    borderRadius: '8px',
                    color: theme === 'light' ? '#0f172a' : '#f8fafc'
                  }} 
                />
                <Area type="monotone" dataKey="Member" stroke="#62a8ea" strokeWidth={2} fillOpacity={1} fill="url(#colorMember)" name="Subscriber" />
                <Area type="monotone" dataKey="Casual" stroke="#ea75b0" strokeWidth={2} fillOpacity={1} fill="url(#colorCasual)" name="Casual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Segment Proportions */}
        <div className={`p-5 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm flex flex-col justify-between`}>
          <div>
            <h3 className="text-base font-semibold mb-1">User Demographics</h3>
            <p className="text-xs text-neutral-400 mb-4">Proportion of subscription levels</p>
          </div>
          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userSegmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userSegmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-2xl font-bold block">
                {Math.round((userSegmentData[0].value / (userSegmentData[0].value + userSegmentData[1].value)) * 100)}%
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Members</span>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {userSegmentData.map((seg, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-neutral-300 font-medium">{seg.name}</span>
                </span>
                <span className="font-semibold">{seg.value.toLocaleString()} trips</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ==========================================
          INTERACTIVE MAP & INVENTORY AUDIT SECTION
          ========================================== */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        
        {/* SVG Map Representation */}
        <div className={`xl:col-span-1 p-5 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-semibold">Live Station Map</h3>
                <p className="text-xs text-neutral-400">Interactive telemetry grid</p>
              </div>
              {criticalStationsCount > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {criticalStationsCount} Alerts
                </span>
              )}
            </div>
            
            {/* Styled Map Canvas */}
            <div className="relative bg-neutral-900/40 rounded-xl border border-neutral-800 h-64 overflow-hidden my-4 flex items-center justify-center">
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
              
              {/* SVG Map Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M 10 100 Q 150 150 300 80 T 500 200" fill="none" stroke="#5aa1d8" strokeWidth="2" strokeDasharray="4" />
                <path d="M 50 200 Q 200 80 400 250" fill="none" stroke="#5aa1d8" strokeWidth="1" />
              </svg>

              {/* Dynamic Map Nodes */}
              {STATIONS_PRESETS.map((station) => {
                const isHovered = mapHoverStation === station.id;
                const occupancy = station.bikes / station.totalDocks;
                let dotColor = "bg-emerald-500";
                if (station.status === "Empty") dotColor = "bg-rose-600";
                else if (station.status === "Low Inventory") dotColor = "bg-amber-500";
                else if (station.status === "Near Capacity") dotColor = "bg-sky-500";
                else if (station.status === "Maintenance") dotColor = "bg-neutral-500";

                return (
                  <button
                    key={station.id}
                    onMouseEnter={() => setMapHoverStation(station.id)}
                    onMouseLeave={() => setMapHoverStation(null)}
                    onClick={() => setSelectedStation(station)}
                    style={{ left: `${station.lng}%`, top: `${station.lat}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 group"
                  >
                    <span className={`absolute -inset-2 rounded-full animate-ping opacity-20 ${dotColor} ${isHovered ? 'scale-150' : 'scale-0'}`} />
                    <span className={`relative block w-3.5 h-3.5 rounded-full border-2 border-neutral-900 shadow-md ${dotColor} ${isHovered ? 'scale-125' : ''}`} />
                  </button>
                );
              })}

              {/* Interactive Map Tooltip */}
              {mapHoverStation && (() => {
                const station = STATIONS_PRESETS.find(s => s.id === mapHoverStation);
                return (
                  <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/90 border border-neutral-800 p-2.5 rounded-lg text-xs pointer-events-none">
                    <div className="flex justify-between font-bold">
                      <span>{station.name}</span>
                      <span className="text-[#5aa1d8]">{station.bikes}/{station.totalDocks} Bikes</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                      <span>Status: {station.status}</span>
                      <span>Occupancy: {Math.round((station.bikes / station.totalDocks) * 100)}%</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          <p className="text-[11px] text-neutral-500">Hover nodes to preview live docking metrics. Click a node to open full analytics.</p>
        </div>

        {/* Station Inventory Table */}
        <div className={`xl:col-span-2 p-5 rounded-xl border ${colors.cardBorder} ${colors.cardBg} shadow-sm`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-base font-semibold">Station Inventory Control</h3>
              <p className="text-xs text-neutral-400">Audit and balance station dock capacities</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleExportCSV}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${colors.buttonSecondary}`}
              >
                <Download className="w-3.5 h-3.5" /> Export Data
              </button>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-black/10 dark:bg-white/5 border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#598dc5]"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {['All', 'Active', 'Low Inventory', 'Near Capacity', 'Empty', 'Maintenance'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${statusFilter === status ? 'bg-[#598dc5]/20 text-[#598dc5] dark:text-[#5aa1d8] border border-[#598dc5]/30' : 'text-neutral-400 hover:bg-neutral-800'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 dark:border-neutral-800 text-[11px] uppercase text-neutral-400 tracking-wider">
                  <th className="pb-2 font-semibold">Station Name</th>
                  <th className="pb-2 font-semibold text-center">Bikes Available</th>
                  <th className="pb-2 font-semibold text-center">Empty Docks</th>
                  <th className="pb-2 font-semibold">Occupancy Rate</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300 dark:divide-neutral-800/50 text-xs">
                {filteredStations.length > 0 ? (
                  filteredStations.map((station) => {
                    const occupancy = Math.round((station.bikes / station.totalDocks) * 100);
                    let statusBadge = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                    if (station.status === "Empty") statusBadge = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                    else if (station.status === "Low Inventory") statusBadge = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                    else if (station.status === "Near Capacity") statusBadge = "bg-sky-500/10 text-sky-500 border-sky-500/20";
                    else if (station.status === "Maintenance") statusBadge = "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";

                    return (
                      <tr key={station.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-medium flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {station.name}
                        </td>
                        <td className="py-3 text-center font-semibold">{station.bikes}</td>
                        <td className="py-3 text-center text-neutral-400">{station.totalDocks - station.bikes}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2 w-32">
                            <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${occupancy > 80 ? 'bg-sky-500' : occupancy < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                style={{ width: `${occupancy}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px]">{occupancy}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${statusBadge}`}>
                            {station.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button 
                            onClick={() => setSelectedStation(station)}
                            className="text-xs text-[#598dc5] dark:text-[#5aa1d8] hover:underline"
                          >
                            Analyze
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-neutral-500 italic">
                      No stations match your query. Try adjusting your search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* ==========================================
          MODAL OVERLAY (Station Deep Dive)
          ========================================== */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl rounded-2xl border ${colors.cardBorder} ${colors.cardBg} p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150`}>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#598dc5]/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-[#598dc5] dark:text-[#5aa1d8]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedStation.name}</h3>
                  <p className="text-xs text-neutral-400">Station ID: #00{selectedStation.id} • Real-time Telemetry</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStation(null)}
                className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-neutral-300 dark:border-neutral-800/50 text-center">
                <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Available Bikes</span>
                <span className="text-2xl font-bold">{selectedStation.bikes}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-neutral-300 dark:border-neutral-800/50 text-center">
                <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Empty Docks</span>
                <span className="text-2xl font-bold">{selectedStation.totalDocks - selectedStation.bikes}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-neutral-300 dark:border-neutral-800/50 text-center">
                <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Total Capacity</span>
                <span className="text-2xl font-bold">{selectedStation.totalDocks}</span>
              </div>
            </div>

            {/* Dynamic Simulated Load Graph for Station */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Hourly Occupancy Profile (Typical Weekday)</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { hour: '8 AM', load: 85 },
                    { hour: '10 AM', load: 40 },
                    { hour: '12 PM', load: 55 },
                    { hour: '2 PM', load: 60 },
                    { hour: '5 PM', load: 90 },
                    { hour: '7 PM', load: 75 },
                    { hour: '9 PM', load: 30 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'light' ? '#e2e8f0' : '#262626'} />
                    <XAxis dataKey="hour" stroke="#888888" fontSize={10} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="load" fill="#5aa1d8" radius={[4, 4, 0, 0]} name="Occupancy %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-neutral-300 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Info className="w-4 h-4 text-sky-500" />
                <span>Rebalancing recommended for peak commute (5:00 PM)</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedStation(null)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${colors.buttonSecondary}`}
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    alert(`Dispatched rebalancing crew to ${selectedStation.name}`);
                    setSelectedStation(null);
                  }}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${colors.buttonPrimary}`}
                >
                  Dispatch Rebalance Crew
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}