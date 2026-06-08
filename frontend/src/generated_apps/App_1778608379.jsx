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
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  Server, 
  Clock, 
  ShieldAlert
} from 'lucide-react';

/**
 * ServerHealthAnomalyMonitor
 * A comprehensive dashboard for tracking server logs, visualizing response time trends,
 * and managing critical incidents.
 */
export default function ServerHealthAnomalyMonitor() {
  // 1. STATE & DATA GENERATION
  const [logs, setLogs] = useState([]);
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'incidents'

  // Generate 200 rows of mock data on mount
  useEffect(() => {
    const services = ['Auth-Service', 'API-Gateway', 'Payment-DB', 'Redis-Cache', 'User-Profile-Svc'];
    const startTime = new Date().getTime() - (24 * 60 * 60 * 1000); // 24 hours ago

    const generatedLogs = Array.from({ length: 200 }, (_, i) => {
      const timestamp = new Date(startTime + (i * 7 * 60 * 1000)); // Every 7 mins approx
      const isIncident = Math.random() > 0.85;

      let statusCode = 200;
      let responseTime = Math.floor(Math.random() * 400) + 100; // Normal range 100-500ms

      if (isIncident) {
        if (Math.random() > 0.5) {
          statusCode = [500, 502, 503, 504][Math.floor(Math.random() * 4)];
        } else {
          responseTime = Math.floor(Math.random() * 1200) + 801; // Latency Spike
        }
      }

      return {
        id: `log-${i}`,
        timestamp: timestamp.toISOString(),
        timeLabel: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        serviceName: services[Math.floor(Math.random() * services.length)],
        responseTime,
        statusCode
      };
    });

    setLogs(generatedLogs);
  }, []);

  // 2. DERIVED DATA & LOGIC
  const incidents = useMemo(() => {
    return logs.filter(log => {
      const isCritical = log.statusCode.toString().startsWith('5') || log.responseTime > 800;
      return isCritical && !resolvedIds.has(log.id);
    });
  }, [logs, resolvedIds]);

  const chartData = useMemo(() => {
    // Sampling 30 points for the chart for better visibility
    return logs.filter((_, i) => i % 6 === 0);
  }, [logs]);

  const clearResolved = () => {
    const newResolved = new Set(resolvedIds);
    incidents.forEach(incident => newResolved.add(incident.id));
    setResolvedIds(newResolved);
  };

  // 3. UI COMPONENTS
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="text-emerald-400 w-8 h-8" />
            Server Health & Anomaly Monitor
          </h1>
          <p className="text-slate-400 mt-1">Real-time log ingestion and latency analysis engine.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-center gap-4">
            <div className="text-center">
              <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Active Logs</span>
              <span className="text-xl font-mono text-emerald-400">{logs.length}</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Unresolved</span>
              <span className={`text-xl font-mono ${incidents.length > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                {incidents.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="text-blue-400 w-5 h-5" />
                Response Time Trend (24h)
              </h2>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full" /> Normal
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-3 h-3 bg-rose-500 rounded-full" /> Latency Spike
                </span>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="timeLabel" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    unit="ms"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorLatency)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Raw Log Table Component */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-300">Detailed Logs</h3>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${activeTab === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  All Traffic
                </button>
                <button 
                  onClick={() => setActiveTab('incidents')}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${activeTab === 'incidents' ? 'bg-rose-900/40 text-rose-200' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Critically Flagged
                </button>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="sticky top-0 bg-slate-900 text-slate-500 font-medium">
                  <tr>
                    <th className="p-3 border-b border-slate-800">Timestamp</th>
                    <th className="p-3 border-b border-slate-800">Service</th>
                    <th className="p-3 border-b border-slate-800 text-right">Latency</th>
                    <th className="p-3 border-b border-slate-800 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs
                    .filter(l => activeTab === 'all' || (l.statusCode.toString().startsWith('5') || l.responseTime > 800))
                    .slice(0, 50) // Showing first 50 for performance, but 200 are in state
                    .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="p-3 text-slate-400 font-mono text-xs">{log.timestamp.replace('T', ' ').substring(0, 19)}</td>
                      <td className="p-3">
                        <span className="flex items-center gap-2">
                          <Server className="w-3 h-3 text-blue-500" />
                          {log.serviceName}
                        </span>
                      </td>
                      <td className={`p-3 text-right font-mono ${log.responseTime > 800 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {log.responseTime}ms
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          log.statusCode >= 500 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                          log.statusCode >= 400 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {log.statusCode}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activeTab === 'incidents' && incidents.length === 0 && (
                <div className="p-10 text-center text-slate-500">
                  <CheckCircle className="w-12 h-12 text-emerald-500/20 mx-auto mb-3" />
                  <p>No critical incidents detected.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Incident Feed Sidebar */}
        <aside className="lg:col-span-1 space-y-4 flex flex-col h-full">
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex-grow overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="text-rose-500 w-5 h-5" />
                Incident Feed
              </h2>
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                LIVE
              </span>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {incidents.length > 0 ? (
                incidents.map((incident) => (
                  <div 
                    key={incident.id} 
                    className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />

                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Critical Alert</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{incident.timeLabel}</span>
                    </div>

                    <h4 className="font-semibold text-slate-200 text-sm mb-1">{incident.serviceName}</h4>
                    <p className="text-xs text-slate-400 mb-3">
                      {incident.statusCode >= 500 
                        ? `Server responded with error status ${incident.statusCode}.` 
                        : `Response time exceeded threshold (${incident.responseTime}ms).`}
                    </p>

                    <div className="flex items-center gap-2">
                       <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                         ID: {incident.id}
                       </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50 space-y-2">
                  <AlertTriangle className="w-10 h-10" />
                  <p className="text-sm font-medium">Clear for now...</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
              <button 
                onClick={clearResolved}
                disabled={incidents.length === 0}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  incidents.length > 0 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Clear Resolved Incidents
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-500 block mb-1">Avg Latency</span>
              <span className="text-xl font-bold font-mono">
                {Math.round(logs.reduce((acc, curr) => acc + curr.responseTime, 0) / (logs.length || 1))}ms
              </span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-500 block mb-1">Reliability</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {((logs.filter(l => l.statusCode < 400).length / (logs.length || 1)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
        @keyframes blinkingRed {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}