import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Battery, 
  Package, 
  MapPin, 
  AlertTriangle, 
  Terminal, 
  Activity, 
  Shield, 
  Clock,
  Search,
  Zap,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

/**
 * AutonomousDeliveryFleetHub
 * A mission control dashboard for tracking 200+ autonomous drones in real-time.
 */
export default function AutonomousDeliveryFleetHub() {
  const [drones, setDrones] = useState([]);
  const [command, setCommand] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, low_battery, exception
  const [recallActive, setRecallActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Generate robust mock data for 200 drones
  useEffect(() => {
    const destinations = ["Downtown Hub A", "Westside Station", "SkyPort North", "Industrial Zone 4", "Suburbia East", "Medical Plaza"];
    const initialDrones = Array.from({ length: 200 }, (_, i) => ({
      id: `DRN-${1000 + i}`,
      battery: Math.floor(Math.random() * 100),
      payload: (Math.random() * 25).toFixed(1),
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      exception: Math.random() > 0.9,
      slaTime: Math.floor(Math.random() * 3600), // Seconds remaining
      status: Math.random() > 0.3 ? 'In Flight' : 'Hovering',
    }));
    setDrones(initialDrones);
  }, []);

  // 2. SLA Countdown Timer Logic (Real-time seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setDrones(prevDrones => 
        prevDrones.map(drone => ({
          ...drone,
          slaTime: drone.slaTime > 0 ? drone.slaTime - 1 : 0
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Command Prompt Processing
  const handleCommandSubmit = (e) => {
    if (e.key === 'Enter') {
      const input = command.toLowerCase().trim();
      if (input === 'recall low battery vehicles') {
        setRecallActive(true);
        setActiveFilter('low_battery');
      } else if (input === 'reset') {
        setRecallActive(false);
        setActiveFilter('all');
        setCommand('');
      }
    }
  };

  // Filter Logic
  const filteredDrones = useMemo(() => {
    return drones.filter(d => {
      const matchesSearch = d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            d.destination.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeFilter === 'low_battery') return d.battery < 20 && matchesSearch;
      if (activeFilter === 'exception') return d.exception && matchesSearch;
      return matchesSearch;
    });
  }, [drones, activeFilter, searchTerm]);

  // Stats for Charts
  const batteryStats = [
    { name: 'Critical (<20%)', value: drones.filter(d => d.battery < 20).length, color: '#ef4444' },
    { name: 'Low (20-50%)', value: drones.filter(d => d.battery >= 20 && d.battery < 50).length, color: '#f59e0b' },
    { name: 'Healthy (>50%)', value: drones.filter(d => d.battery >= 50).length, color: '#10b981' },
  ];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-slate-200 font-sans overflow-hidden">
      {/* CSS For Warning Animation */}
      <style>
        {`
          @keyframes pulse-red {
            0% { background-color: rgba(239, 68, 68, 0); }
            50% { background-color: rgba(239, 68, 68, 0.2); }
            100% { background-color: rgba(239, 68, 68, 0); }
          }
          .animate-pulse-red {
            animation: pulse-red 1.5s infinite;
          }
        `}
      </style>

      {/* Top Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f0f12]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AUTONOMOUS DELIVERY FLEET HUB
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Streaming API Active</span>
          </div>
          <div className="text-xs font-mono text-slate-500">{new Date().toISOString()}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex gap-4 p-4 overflow-hidden">

        {/* Left Column: Telemetry & Controls */}
        <div className="flex-[3] flex flex-col gap-4 overflow-hidden">

          {/* Controls Bar */}
          <div className="grid grid-cols-12 gap-4 h-24 shrink-0">
            {/* Command Prompt */}
            <div className="col-span-8 bg-[#15151a] rounded-xl border border-white/5 p-4 flex flex-col justify-center relative group">
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Command Prompt
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full bg-transparent border-none focus:ring-0 text-lg font-mono placeholder:text-slate-700 text-white"
                  placeholder="Type 'Recall low battery vehicles'..."
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleCommandSubmit}
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 px-2 py-1 bg-white/5 rounded">
                  ENTER TO EXECUTE
                </div>
              </div>
            </div>

            {/* Quick Filter Search */}
            <div className="col-span-4 bg-[#15151a] rounded-xl border border-white/5 p-4 flex flex-col justify-center">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Search className="w-3 h-3" /> Fleet ID Search
              </label>
              <input 
                type="text" 
                className="w-full bg-transparent border-none focus:ring-0 text-lg font-mono placeholder:text-slate-700 text-white"
                placeholder="Search DRN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="flex-1 bg-[#0f0f12] rounded-xl border border-white/5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex gap-4">
                <button 
                  onClick={() => {setActiveFilter('all'); setRecallActive(false);}}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'}`}
                >
                  ALL UNITS ({drones.length})
                </button>
                <button 
                  onClick={() => setActiveFilter('low_battery')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeFilter === 'low_battery' ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-400'}`}
                >
                  LOW POWER ({drones.filter(d => d.battery < 20).length})
                </button>
                <button 
                  onClick={() => setActiveFilter('exception')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeFilter === 'exception' ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-400'}`}
                >
                  EXCEPTIONS ({drones.filter(d => d.exception).length})
                </button>
              </div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Showing {filteredDrones.length} Active Drones
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-[#15151a] text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
              <div className="col-span-1">Drone ID</div>
              <div className="col-span-1 text-center">Battery</div>
              <div className="col-span-1">Payload (kg)</div>
              <div className="col-span-1">Destination</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">SLA Countdown</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Scrollable Table Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredDrones.map((drone) => (
                <div 
                  key={drone.id} 
                  className={`grid grid-cols-7 gap-4 px-6 py-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors group
                    ${(recallActive && drone.battery < 20) ? 'animate-pulse-red' : ''}
                  `}
                >
                  <div className="col-span-1 flex items-center gap-3">
                    <Activity className={`w-4 h-4 ${drone.exception ? 'text-orange-500' : 'text-blue-500'}`} />
                    <span className="font-mono text-sm font-bold text-white">{drone.id}</span>
                  </div>

                  <div className="col-span-1 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Battery className={`w-3 h-3 ${drone.battery < 20 ? 'text-red-500' : 'text-green-500'}`} />
                      <span className={`text-sm font-mono ${drone.battery < 20 ? 'text-red-400 font-bold' : ''}`}>
                        {drone.battery}%
                      </span>
                    </div>
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${drone.battery < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${drone.battery}%` }}
                      />
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center gap-2">
                    <Package className="w-3 h-3 text-slate-500" />
                    <span className="text-sm">{drone.payload}kg</span>
                  </div>

                  <div className="col-span-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-300 truncate">{drone.destination}</span>
                  </div>

                  <div className="col-span-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${drone.exception ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {drone.exception ? 'Exception' : drone.status}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center gap-2">
                    <Clock className={`w-3 h-3 ${drone.slaTime < 300 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                    <span className={`text-sm font-mono ${drone.slaTime < 300 ? 'text-red-400 font-bold' : 'text-blue-400'}`}>
                      {formatTime(drone.slaTime)}s
                    </span>
                  </div>

                  <div className="col-span-1 text-right">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors text-slate-500 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredDrones.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                  <AlertTriangle className="w-12 h-12 mb-2 text-slate-500" />
                  <p className="text-sm font-mono">No matching telemetry units found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Analytics Sidebar */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Battery Distribution Chart */}
          <div className="h-1/2 bg-[#0f0f12] rounded-xl border border-white/5 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> Fleet Energy Health
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={batteryStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {batteryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#15151a', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {batteryStats.map((stat, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                    {stat.name}
                  </span>
                  <span className="font-mono font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log / Overview */}
          <div className="h-1/2 bg-[#0f0f12] rounded-xl border border-white/5 p-6 flex flex-col">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Quick Snapshot
            </h3>

            <div className="space-y-4">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Average Payload</div>
                <div className="text-2xl font-mono text-white">
                  {(drones.reduce((acc, d) => acc + parseFloat(d.payload), 0) / drones.length).toFixed(2)} <span className="text-xs text-slate-500 italic font-sans">kg</span>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Route Exceptions</div>
                <div className="text-2xl font-mono text-orange-500">
                  {drones.filter(d => d.exception).length}
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Fleet Range Potential</div>
                <div className="text-2xl font-mono text-green-500">
                  {(drones.reduce((acc, d) => acc + d.battery, 0) / 100 * 20).toFixed(0)} <span className="text-xs text-slate-500 italic font-sans">miles</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4">
               <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all">
                Generate Full Log Report
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="h-8 border-t border-white/5 bg-[#0f0f12] px-6 flex items-center justify-between text-[10px] text-slate-600 font-mono">
        <div>SYSTEM STATUS: NOMINAL</div>
        <div>TOTAL CONNECTED UNITS: {drones.length}</div>
        <div>LAST UPDATED: {new Date().toLocaleTimeString()}</div>
      </footer>
    </div>
  );
}