import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, 
  Battery, 
  Package, 
  MapPin, 
  AlertTriangle, 
  Terminal, 
  Clock, 
  ChevronRight,
  Menu,
  X,
  Search
} from 'lucide-react';

/**
 * AutonomousDeliveryFleetHub
 * 
 * A high-performance telemetry dashboard for autonomous drone fleet management.
 * Features real-time SLA tracking, battery monitoring, and command-driven filtering.
 */
export default function AutonomousDeliveryFleetHub() {
  // --- STATE ---
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [command, setCommand] = useState('');
  const [fleet, setFleet] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recallMode, setRecallMode] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ search: '' });

  // --- MOCK DATA GENERATION ---
  useEffect(() => {
    const destinations = ['Downtown Core', 'Industrial Zone B', 'Sector 7 G', 'Harbor District', 'Suburban Hub 4', 'Research Park', 'Medical Plaza'];

    const initialFleet = Array.from({ length: 200 }, (_, i) => {
      const battery = Math.floor(Math.random() * 95) + 5;
      const payload = (Math.random() * 12).toFixed(2);
      const slaSeconds = Math.floor(Math.random() * 1800) + 300; // 5 to 30 mins

      return {
        id: `DRN-${(i + 1).toString().padStart(3, '0')}`,
        battery,
        payloadWeight: parseFloat(payload),
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        exceptionFlag: Math.random() > 0.92, // 8% chance of exception
        expiryTime: Date.now() + (slaSeconds * 1000),
        status: 'Active',
      };
    });

    setFleet(initialFleet);
  }, []);

  // --- STREAMING SIMULATOR ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());

      setFleet(prevFleet => prevFleet.map(drone => {
        // Slowly deplete battery
        const batteryDrop = Math.random() > 0.8 ? 0.05 : 0;
        // Occasionally trigger/clear exceptions
        const exceptionFlip = Math.random() > 0.995;

        return {
          ...drone,
          battery: Math.max(0, drone.battery - batteryDrop),
          exceptionFlag: exceptionFlip ? !drone.exceptionFlag : drone.exceptionFlag
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- COMMAND PARSER ---
  const handleCommand = (e) => {
    const input = e.target.value;
    setCommand(input);

    if (input.toLowerCase() === 'recall low battery vehicles') {
      setRecallMode(true);
      // Auto-clear recall mode after 10 seconds if desired, or keep until manually cleared
    } else if (input === '') {
      setRecallMode(false);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredFleet = useMemo(() => {
    let data = [...fleet];

    if (recallMode) {
      data = data.filter(d => d.battery < 20);
    }

    if (activeFilters.search) {
      const s = activeFilters.search.toLowerCase();
      data = data.filter(d => 
        d.id.toLowerCase().includes(s) || 
        d.destination.toLowerCase().includes(s)
      );
    }

    return data;
  }, [fleet, recallMode, activeFilters]);

  // --- KPI CALCULATIONS ---
  const stats = useMemo(() => {
    const lowBatt = fleet.filter(d => d.battery < 20).length;
    const exceptions = fleet.filter(d => d.exceptionFlag).length;
    const avgSla = fleet.reduce((acc, d) => acc + (d.expiryTime - currentTime), 0) / fleet.length;

    return {
      total: fleet.length,
      lowBatt,
      exceptions,
      avgSla: Math.max(0, Math.floor(avgSla / 1000))
    };
  }, [fleet, currentTime]);

  // --- THEME TOKENS (Dark Mode) ---
  const theme = {
    bgPrimary: '#1a1a1a',
    bgSecondary: '#1e293b',
    textPrimary: '#dbdbdb',
    textSecondary: '#cbd5e1',
    border: '#1e293b',
    accent: '#5aa1d8',
    warning: '#ef4444',
    success: '#10b981'
  };

  return (
    <div 
      className="min-h-screen font-sans flex flex-col"
      style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary, fontFamily: 'Inter, sans-serif' }}
    >
      {/* TOP HEADER */}
      <header 
        className="h-16 px-6 flex items-center justify-between border-b z-30 sticky top-0"
        style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '600', letterSpacing: '-0.025em' }}>
            Autonomous Delivery Fleet Hub
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span style={{ fontSize: '12px', fontWeight: '500', color: theme.textSecondary }}>LIVE TELEMETRY</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <Activity size={14} className="text-blue-400" />
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside 
          className={`absolute lg:relative z-20 h-full w-64 border-r transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full lg:hidden'}`}
          style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
        >
          <nav className="p-4 space-y-2">
            <NavItem label="Fleet Overview" active icon={<Activity size={18}/>} theme={theme} />
            <NavItem label="Route Management" icon={<MapPin size={18}/>} theme={theme} />
            <NavItem label="Payload Analytics" icon={<Package size={18}/>} theme={theme} />
            <NavItem label="System Logs" icon={<Terminal size={18}/>} theme={theme} />
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* COMMAND PROMPT SECTION */}
          <section className="space-y-3">
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#7e8ea5', textTransform: 'uppercase' }}>
              Fleet Commander Console
            </label>
            <div 
              className="relative group border rounded-xl overflow-hidden shadow-2xl"
              style={{ borderColor: theme.border, backgroundColor: theme.bgSecondary }}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Terminal size={18} />
              </div>
              <input 
                type="text"
                placeholder="Enter command... (e.g. 'Recall low battery vehicles')"
                className="w-full pl-12 pr-4 py-4 bg-transparent outline-none border-none text-lg placeholder:text-slate-600"
                style={{ color: theme.textPrimary }}
                value={command}
                onChange={handleCommand}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-all">
                  Execute
                </button>
              </div>
            </div>
            {recallMode && (
              <div className="flex items-center gap-2 text-red-400 animate-pulse px-2">
                <AlertTriangle size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Emergency Recall Protocol Active</span>
              </div>
            )}
          </section>

          {/* KPI CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard 
              title="Active Fleet" 
              value={stats.total} 
              icon={<Activity size={20}/>} 
              trend="+3%" 
              theme={theme} 
            />
            <KPICard 
              title="Low Battery Alert" 
              value={stats.lowBatt} 
              icon={<Battery size={20}/>} 
              trend={stats.lowBatt > 10 ? "Critical" : "Stable"}
              variant={stats.lowBatt > 10 ? "danger" : "default"}
              theme={theme} 
            />
            <KPICard 
              title="Route Exceptions" 
              value={stats.exceptions} 
              icon={<AlertTriangle size={20}/>} 
              variant={stats.exceptions > 5 ? "warning" : "default"}
              theme={theme} 
            />
            <KPICard 
              title="Avg SLA Window" 
              value={`${stats.avgSla}s`} 
              icon={<Clock size={20}/>} 
              theme={theme} 
            />
          </div>

          {/* TELEMETRY TABLE */}
          <div 
            className="rounded-xl border shadow-sm overflow-hidden"
            style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
               <h3 style={{ fontSize: '18px', fontWeight: '500' }}>Active Drone Telemetry</h3>
               <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search ID/Dest..." 
                      className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => setActiveFilters({...activeFilters, search: e.target.value})}
                    />
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10" style={{ backgroundColor: '#262626' }}>
                  <tr>
                    <Th theme={theme}>Drone ID</Th>
                    <Th theme={theme}>Battery %</Th>
                    <Th theme={theme}>Payload (kg)</Th>
                    <Th theme={theme}>Target Destination</Th>
                    <Th theme={theme}>Status</Th>
                    <Th theme={theme}>SLA Countdown</Th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: '#262626' }}>
                  {filteredFleet.map((drone) => (
                    <DroneRow 
                      key={drone.id} 
                      drone={drone} 
                      currentTime={currentTime} 
                      theme={theme} 
                      isRecallTarget={recallMode && drone.battery < 20}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {filteredFleet.length === 0 && (
              <div className="py-20 text-center text-slate-500 italic">
                No vehicles matching the current commander parameters.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="h-10 border-t px-6 flex items-center justify-between" style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}>
         <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium">
            <span>Server: CLOUD-HUB-04</span>
            <span>Uptime: 142d 12h</span>
            <span>Latency: 14ms</span>
         </div>
         <div className="text-[10px] text-slate-500">
            © 2026 Autonomous Fleet Systems
         </div>
      </footer>

      {/* GLOBAL STYLES FOR RECALL ANIMATION */}
      <style>{`
        @keyframes emergency-pulse {
          0% { background-color: rgba(239, 68, 68, 0); }
          50% { background-color: rgba(239, 68, 68, 0.25); }
          100% { background-color: rgba(239, 68, 68, 0); }
        }
        .recall-row-animate {
          animation: emergency-pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function DroneRow({ drone, currentTime, theme, isRecallTarget }) {
  const remaining = Math.max(0, Math.floor((drone.expiryTime - currentTime) / 1000));

  return (
    <tr 
      className={`group transition-colors hover:bg-slate-900/50 ${isRecallTarget ? 'recall-row-animate' : ''}`}
    >
      <td className="p-4" style={{ fontSize: '14px', fontWeight: '500', color: theme.textPrimary }}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${drone.exceptionFlag ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-emerald-500'}`} />
          {drone.id}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden w-24">
             <div 
               className={`h-full transition-all duration-500 ${drone.battery < 20 ? 'bg-red-500' : drone.battery < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
               style={{ width: `${drone.battery}%` }}
             />
          </div>
          <span style={{ fontSize: '12px', color: theme.textSecondary }}>{Math.floor(drone.battery)}%</span>
        </div>
      </td>
      <td className="p-4" style={{ fontSize: '14px', color: theme.textSecondary }}>
        {drone.payloadWeight} kg
      </td>
      <td className="p-4" style={{ fontSize: '14px', color: theme.textSecondary }}>
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-slate-500" />
          {drone.destination}
        </div>
      </td>
      <td className="p-4">
        <span 
          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight"
          style={{ 
            backgroundColor: drone.exceptionFlag ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: drone.exceptionFlag ? '#ef4444' : '#10b981',
            border: `1px solid ${drone.exceptionFlag ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
          }}
        >
          {drone.exceptionFlag ? 'EXCEPTION' : 'NOMINAL'}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2 font-mono text-sm">
          <Clock size={12} className={remaining < 60 ? 'text-red-400' : 'text-slate-500'} />
          <span className={remaining < 60 ? 'text-red-400 font-bold' : 'text-slate-300'}>
            {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </td>
    </tr>
  );
}

function NavItem({ label, icon, active, theme }) {
  return (
    <div 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all group`}
      style={{ 
        color: active ? theme.accent : theme.textSecondary,
        backgroundColor: active ? 'rgba(90, 161, 216, 0.08)' : 'transparent'
      }}
    >
      <span className={active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}>{icon}</span>
      <span style={{ fontSize: '14px', fontWeight: active ? '600' : '400' }}>{label}</span>
      {active && <ChevronRight size={14} className="ml-auto" />}
    </div>
  );
}

function KPICard({ title, value, icon, trend, variant = "default", theme }) {
  const isDanger = variant === "danger";
  const isWarning = variant === "warning";

  return (
    <div 
      className="p-5 rounded-xl border flex flex-col gap-4 shadow-sm"
      style={{ 
        backgroundColor: theme.bgSecondary, 
        borderColor: isDanger ? 'rgba(239, 68, 68, 0.3)' : isWarning ? 'rgba(245, 158, 11, 0.3)' : theme.border 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDanger ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </h6>
        <div style={{ fontSize: '30px', fontWeight: '600', color: theme.textPrimary, lineHeight: '1.25' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function Th({ children, theme }) {
  return (
    <th 
      className="p-4 text-left border-b" 
      style={{ 
        color: '#94a3b8', 
        fontSize: '12px', 
        fontWeight: '600', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em',
        borderColor: theme.border
      }}
    >
      {children}
    </th>
  );
}