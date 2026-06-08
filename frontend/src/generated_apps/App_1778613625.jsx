import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Shield, 
  Battery, 
  Weight, 
  Navigation, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Menu, 
  Search, 
  RefreshCcw 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

/**
 * Autonomous Delivery Fleet Hub
 * Built with strict adherence to Data App Skills & Visual Specs.
 */

// --- DATA GENERATION & INTERFACES ---

const DESTINATIONS = [
  'Sector 7-A', 'Downtown Core', 'Westside Depot', 'Industrial Zone', 
  'Suburban Hub 4', 'Coastal Station', 'Greenway Park', 'Skyline Tower'
];

const generateFleet = (count = 200) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `DRN-${1000 + i}`,
    battery: Math.floor(Math.random() * 95) + 5,
    payload: (Math.random() * 12.5).toFixed(1),
    destination: DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)],
    exception: Math.random() > 0.85,
    slaSeconds: Math.floor(Math.random() * 1200) + 60, // 1m to 20m
    status: 'Active'
  }));
};

export default function FleetHub() {
  const [fleet, setFleet] = useState([]);
  const [command, setCommand] = useState('');
  const [isRecallActive, setIsRecallActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('telemetry');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize fleet
  useEffect(() => {
    setFleet(generateFleet(200));
  }, []);

  // Real-time ticking (SLA and Battery depletion)
  useEffect(() => {
    const timer = setInterval(() => {
      setFleet(currentFleet => 
        currentFleet.map(drone => ({
          ...drone,
          slaSeconds: Math.max(0, drone.slaSeconds - 1),
          // Subtle battery depletion every tick
          battery: Math.max(0, drone.battery - (Math.random() > 0.9 ? 1 : 0))
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Command Parser
  const handleCommandSubmit = (e) => {
    if (e.key === 'Enter') {
      const normalized = command.toLowerCase().trim();
      if (normalized === 'recall low battery vehicles') {
        setIsRecallActive(true);
      } else if (normalized === 'reset') {
        setIsRecallActive(false);
        setCommand('');
      }
    }
  };

  // Filtered Logic
  const displayFleet = useMemo(() => {
    if (isRecallActive) {
      return fleet.filter(d => d.battery < 20);
    }
    return fleet;
  }, [fleet, isRecallActive]);

  // KPI Calculations
  const stats = useMemo(() => {
    const lowBatt = fleet.filter(d => d.battery < 20).length;
    const exceptions = fleet.filter(d => d.exception).length;
    const avgSla = Math.floor(fleet.reduce((acc, curr) => acc + curr.slaSeconds, 0) / fleet.length);
    return { lowBatt, exceptions, avgSla, total: fleet.length };
  }, [fleet]);

  // Formatting seconds to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- STYLES (Arbitrary Tailwind Mapped to Visual Spec) ---
  const theme = {
    bg: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]',
    bgSecondary: isDarkMode ? 'bg-[#1e293b]' : 'bg-[#e2e8f0]',
    textPrimary: isDarkMode ? 'text-[#dbdbdb]' : 'text-[#5c5c5c]',
    textSecondary: isDarkMode ? 'text-[#cbd5e1]' : 'text-[#475569]',
    border: isDarkMode ? 'border-[#1e293b]' : 'border-[#e2e8f0]',
    cardBg: isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]',
    tableHeader: isDarkMode ? 'text-[#94a3b8]' : 'text-[#457bba]',
    tableRow: isDarkMode ? 'text-[#cbd5e1]' : 'text-[#657281]',
    chartColors: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"]
  };

  const typography = {
    h2: { fontSize: '30px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    h4: { fontSize: '20px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    p: { fontSize: '14px', fontWeight: '400', fontFamily: 'Inter, sans-serif' },
    kpi: { fontSize: '30px', fontWeight: '600', fontFamily: 'Inter, sans-serif' },
    label: { fontSize: '12px', fontWeight: '400', color: '#64748b' }
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textPrimary} transition-colors duration-300 font-sans`}>
      {/* TOP HEADER */}
      <header className={`w-full h-16 flex items-center justify-between px-6 border-b ${theme.border} z-20 sticky top-0 ${theme.bg}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-[#262626] rounded transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="text-[#62a8ea]" size={28} />
            <h1 style={typography.h2} className="hidden md:block">Autonomous Delivery Fleet Hub</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-[#121212] border border-[#1e293b] rounded-lg px-3 py-1.5 items-center gap-3 w-48 md:w-80">
            <Search size={16} className="text-[#64748b]" />
            <input 
              className="bg-transparent border-none outline-none text-sm w-full"
              placeholder="Search Drone ID..."
            />
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 border border-[#1e293b] rounded-full hover:bg-[#1e293b] transition-colors"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className={`fixed md:relative h-[calc(100vh-64px)] ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r ${theme.border} ${theme.bg} z-10`}>
          <nav className="p-4 space-y-2">
            {[
              { id: 'telemetry', label: 'Fleet Telemetry', icon: Navigation },
              { id: 'analytics', label: 'Battery Analytics', icon: Zap },
              { id: 'settings', label: 'SLA Protocols', icon: Clock }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                  ? 'bg-[#1e3a8a] text-white border border-[#3b82f6]' 
                  : 'text-[#64748b] hover:bg-[#1e293b] hover:text-[#e2e8f0]'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CANVAS */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* KPI ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Drones', value: stats.total, icon: Navigation, color: '#62a8ea' },
              { label: 'Low Battery (Critical)', value: stats.lowBatt, icon: Battery, color: '#ef4444' },
              { label: 'Route Exceptions', value: stats.exceptions, icon: AlertTriangle, color: '#f59e0b' },
              { label: 'Avg SLA Remaining', value: formatTime(stats.avgSla), icon: Clock, color: '#10b981' }
            ].map((kpi, idx) => (
              <div key={idx} className={`${theme.cardBg} border ${theme.border} p-5 rounded-xl shadow-sm`}>
                <div className="flex justify-between items-start mb-2">
                  <span style={typography.label} className="uppercase tracking-wider font-semibold">{kpi.label}</span>
                  <kpi.icon size={20} style={{ color: kpi.color }} />
                </div>
                <div style={typography.kpi} className={isDarkMode ? 'text-[#3b82f6]' : 'text-[#457bb4]'}>
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* COMMAND PANEL & ANALYTICS PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${theme.cardBg} border ${theme.border} p-6 rounded-xl`}>
               <h3 style={typography.h4} className="mb-4">System Command Prompt</h3>
               <div className="relative">
                  <input 
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleCommandSubmit}
                    placeholder="Type command (e.g., 'Recall low battery vehicles') and press Enter..."
                    className={`w-full bg-[#121212] border-2 ${isRecallActive ? 'border-[#ef4444]' : theme.border} rounded-xl px-5 py-4 outline-none focus:border-[#3b82f6] transition-all font-mono text-sm`}
                  />
                  {isRecallActive && (
                    <div className="absolute right-4 top-4 flex items-center gap-2 text-[#ef4444] animate-pulse">
                      <Zap size={18} fill="#ef4444" />
                      <span className="text-xs font-bold">RECALL PROTOCOL ACTIVE</span>
                    </div>
                  )}
               </div>
               <p style={typography.p} className="mt-3 text-[#64748b] italic">
                 Hint: Try "Recall low battery vehicles" to isolate critical units. Type "Reset" to clear.
               </p>
            </div>

            <div className={`${theme.cardBg} border ${theme.border} p-6 rounded-xl`}>
               <h3 style={typography.h4} className="mb-4">Fleet Health Distribution</h3>
               <div className="h-[120px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Critical', val: stats.lowBatt },
                      { name: 'Warn', val: 45 },
                      { name: 'Optimal', val: stats.total - stats.lowBatt - 45 }
                    ]}>
                      <Bar dataKey="val">
                        { [0,1,2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#10b981'} />
                        ))}
                      </Bar>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #1e293b' }}
                        itemStyle={{ color: '#dbdbdb' }}
                      />
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* TELEMETRY GRID */}
          <div className={`${theme.cardBg} border ${theme.border} rounded-xl overflow-hidden`}>
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
              <h3 style={typography.h4}>Active Fleet Telemetry</h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-[#1e293b] text-[#60a5fa] text-[10px] font-bold rounded">LIVE STREAMING</span>
                <span className="px-2 py-1 bg-[#1e293b] text-[#94a3b8] text-[10px] font-bold rounded">{displayFleet.length} UNITS</span>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left border-collapse">
                <thead className={`sticky top-0 ${theme.bgSecondary} z-10`}>
                  <tr>
                    {['Drone ID', 'Battery %', 'Payload (kg)', 'Destination', 'Exception', 'SLA Countdown'].map((head) => (
                      <th 
                        key={head} 
                        className={`px-6 py-4 font-semibold border-b ${theme.border} ${theme.tableHeader}`}
                        style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {displayFleet.map((drone) => {
                    const isCritical = drone.battery < 20;
                    const isRecallWarning = isRecallActive && isCritical;

                    return (
                      <tr 
                        key={drone.id} 
                        className={`group transition-all duration-500 ${
                          isRecallWarning 
                          ? 'bg-[#450a0a] border-l-4 border-l-[#ef4444] animate-pulse' 
                          : `hover:${isDarkMode ? 'bg-[#1e294b]' : 'bg-[#f8fafc]'}`
                        }`}
                      >
                        <td className={`px-6 py-4 font-mono font-medium ${theme.tableRow}`}>{drone.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-2 bg-[#262626] rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${
                                  drone.battery < 20 ? 'bg-[#ef4444]' : drone.battery < 50 ? 'bg-[#f59e0b]' : 'bg-[#10b981]'
                                }`}
                                style={{ width: `${drone.battery}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${drone.battery < 20 ? 'text-[#ef4444]' : ''}`}>
                              {drone.battery}%
                            </span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${theme.tableRow}`}>{drone.payload} kg</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Navigation size={14} className="text-[#64748b]" />
                            <span className={`text-sm ${theme.tableRow}`}>{drone.destination}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {drone.exception ? (
                            <div className="flex items-center gap-1.5 text-[#f59e0b] bg-[#422006] px-2 py-1 rounded text-[10px] font-bold w-fit">
                              <AlertTriangle size={12} />
                              REROUTING
                            </div>
                          ) : (
                            <div className="text-[#10b981] text-[10px] font-bold px-2 py-1 bg-[#064e3b] rounded w-fit">NORMAL</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-2 font-mono text-sm ${drone.slaSeconds < 60 ? 'text-[#ef4444] font-bold' : theme.tableRow}`}>
                            <Clock size={14} />
                            {formatTime(drone.slaSeconds)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className={`h-10 border-t ${theme.border} flex items-center px-6 justify-between ${theme.bgSecondary} z-30`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span className="text-[10px] text-[#94a3b8] uppercase font-bold">Grid Sync: OK</span>
          </div>
          <span className="text-[10px] text-[#64748b] font-mono">Uptime: 492:12:04</span>
        </div>
        <div className="flex gap-4">
           <span className="text-[10px] text-[#64748b]">v2.4.0-STABLE</span>
        </div>
      </footer>
    </div>
  );
}