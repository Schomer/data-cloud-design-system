import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { AlertCircle, CheckCircle2, XCircle, Activity, Server, Clock, Filter } from 'lucide-react';

/**
 * SERVER HEALTH & ANOMALY MONITOR
 * A high-performance monitoring dashboard with incident management.
 */

// --- DATA GENERATOR ---
const generateLogs = (count = 200) => {
  const services = ['Auth Service', 'Payment API', 'Inventory DB', 'Frontend Gateway', 'Search Indexer'];
  const statusCodes = [200, 200, 200, 200, 201, 404, 500, 503, 504];
  const now = new Date();

  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(now.getTime() - (count - i) * 60000 * 5); // 5-minute intervals
    const serviceName = services[Math.floor(Math.random() * services.length)];
    const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];

    // Anomaly logic: occasional spikes
    const isAnomaly = Math.random() > 0.95;
    const responseTime = isAnomaly ? 800 + Math.random() * 400 : 50 + Math.random() * 450;

    return {
      id: `log-${i}`,
      timestamp,
      timestampStr: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      serviceName,
      responseTime: Math.round(responseTime),
      statusCode,
      isIncident: statusCode >= 500 || responseTime > 800
    };
  });
};

const RAW_LOGS = generateLogs(200);

export default function ServerHealthMonitor() {
  const [logs, setLogs] = useState(RAW_LOGS);
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');

  // --- DERIVED STATE ---
  const activeIncidents = useMemo(() => {
    return logs.filter(log => log.isIncident && !resolvedIds.has(log.id));
  }, [logs, resolvedIds]);

  const kpis = useMemo(() => {
    const avgResponse = logs.reduce((acc, curr) => acc + curr.responseTime, 0) / logs.length;
    const errorRate = (logs.filter(l => l.statusCode >= 400).length / logs.length) * 100;
    return {
      avgResponse: Math.round(avgResponse),
      errorRate: errorRate.toFixed(1),
      incidentCount: activeIncidents.length
    };
  }, [logs, activeIncidents]);

  // --- ACTIONS ---
  const handleClearIncidents = () => {
    const newlyResolved = new Set(resolvedIds);
    activeIncidents.forEach(incident => newlyResolved.add(incident.id));
    setResolvedIds(newlyResolved);
  };

  // --- THEME TOKENS (Visual Spec) ---
  const theme = {
    bg: '#ffffff',
    darkBg: '#1a1a1a',
    bgSecondary: '#e2e8f0',
    darkBgSecondary: '#1e293b',
    border: '#e2e8f0',
    darkBorder: '#1e293b',
    textPrimary: '#5c5c5c',
    darkTextPrimary: '#dbdbdb',
    textSecondary: '#475569',
    darkTextSecondary: '#cbd5e1',
    chartPalette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4"],
    critical: '#ef4444'
  };

  const typography = {
    h2: { fontSize: '30px', fontWeight: '600', color: theme.textPrimary },
    h4: { fontSize: '20px', fontWeight: '600', color: theme.textPrimary },
    h6: { fontSize: '14px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' },
    p: { fontSize: '14px', fontWeight: '400', color: '#475569' },
    value: { fontSize: '30px', fontWeight: '600', color: '#3b82f6' }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] flex flex-col font-sans">
      {/* HEADER */}
      <header className="w-full px-8 py-6 border-b border-[#e2e8f0] dark:border-[#1e293b] flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: '600' }} className="text-[#5c5c5c] dark:text-[#dbdbdb]">
            Server Health Monitor
          </h1>
          <p style={{ fontSize: '14px' }} className="text-[#475569] dark:text-[#94a3b8]">
            Real-time anomaly detection and response time tracking
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleClearIncidents}
            style={{ borderRadius: '5px', padding: '8px 16px', fontWeight: '500' }}
            className="bg-[#598dc5] hover:bg-[#054aa3] text-white transition-colors duration-200 flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Clear Resolved Incidents
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-hidden">

        {/* KPI ROW */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard 
            title="Avg Response Time" 
            value={`${kpis.avgResponse}ms`} 
            icon={<Clock className="text-blue-500" />} 
            theme={theme} 
          />
          <KPICard 
            title="Error Rate" 
            value={`${kpis.errorRate}%`} 
            icon={<AlertCircle className="text-amber-500" />} 
            theme={theme} 
          />
          <KPICard 
            title="Active Incidents" 
            value={kpis.incidentCount} 
            icon={<Activity className="text-red-500" />} 
            theme={theme} 
            isCritical={kpis.incidentCount > 0}
          />
          <KPICard 
            title="System Status" 
            value="Operational" 
            icon={<Server className="text-emerald-500" />} 
            theme={theme} 
          />
        </div>

        {/* TIME SERIES CHART */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 style={{ fontSize: '18px', fontWeight: '600' }} className="text-[#5c5c5c] dark:text-[#dbdbdb]">
              Response Time Trend (24h)
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-full bg-[#62a8ea]"></span> Response Time (ms)
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logs.slice(-40)}>
                <defs>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.darkBorder} />
                <XAxis 
                  dataKey="timestampStr" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  unit="ms"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#62a8ea' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#62a8ea" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRes)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INCIDENT FEED */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0] dark:border-[#1e293b] flex justify-between items-center bg-[#f8fafc] dark:bg-[#1e293b]/50">
            <h3 style={{ fontSize: '14px', fontWeight: '600' }} className="text-[#64748b] uppercase tracking-wider">
              Critical Incident Feed
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
              {activeIncidents.length} LIVE
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeIncidents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
                <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                <p style={{ fontSize: '14px' }}>All clear. No active anomalies detected.</p>
              </div>
            ) : (
              activeIncidents.map((incident) => (
                <IncidentRow key={incident.id} incident={incident} theme={theme} />
              ))
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-8 py-4 border-t border-[#e2e8f0] dark:border-[#1e293b] flex justify-between text-xs text-[#94a3b8]">
        <div>Engine Version: 2.4.1-Stable</div>
        <div>Last Update: {new Date().toLocaleTimeString()}</div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }
        .animate-critical {
          animation: blink 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function KPICard({ title, value, icon, theme, isCritical }) {
  return (
    <div className={`bg-white dark:bg-[#1a1a1a] border ${isCritical ? 'border-red-500/50' : 'border-[#e2e8f0] dark:border-[#1e293b]'} rounded-[12px] p-5 shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>
          {title}
        </h6>
        <div className="p-1.5 rounded-md bg-slate-50 dark:bg-slate-800/50">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span style={{ fontSize: '30px', fontWeight: '600' }} className="text-[#3b82f6]">
          {value}
        </span>
      </div>
    </div>
  );
}

function IncidentRow({ incident, theme }) {
  const isHighLatency = incident.responseTime > 800;
  const isServerError = incident.statusCode >= 500;

  return (
    <div className="p-4 border-b border-[#e2e8f0] dark:border-[#262626] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
      <div className="flex items-start gap-3">
        {/* Blinking Indicator */}
        <div className="mt-1.5 relative">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-critical" />
          <div className="absolute -inset-1 rounded-full bg-red-500/20 animate-ping" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span style={{ fontSize: '14px', fontWeight: '600' }} className="text-[#dbdbdb]">
              {incident.serviceName}
            </span>
            <span style={{ fontSize: '12px' }} className="text-[#64748b]">
              {incident.timestampStr}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {isServerError && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/30 text-red-500 bg-red-500/5">
                HTTP {incident.statusCode} ERROR
              </span>
            )}
            {isHighLatency && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-500 bg-amber-500/5">
                LATENCY {incident.responseTime}ms
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}