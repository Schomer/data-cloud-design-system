import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Anchor, 
  Clock, 
  DollarSign, 
  Filter, 
  Grid, 
  List, 
  MoreHorizontal,
  Search,
  Ship,
  Truck,
  Warehouse
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- STAGE DEFINITIONS ---
const STAGES = ['At Sea', 'Custom Clearance', 'RDC Transit', 'At RDC Yard'];
const ORIGIN_PORTS = ['Shanghai', 'Rotterdam', 'Singapore', 'Los Angeles', 'Savannah', 'Hamburg', 'Busan', 'Jebel Ali'];
const BASELINE_DAYS = 4;

// --- MOCK DATA GENERATION ---
const generateMockData = () => {
  return Array.from({ length: 250 }, (_, i) => {
    const status = STAGES[Math.floor(Math.random() * STAGES.length)];
    const days = Math.floor(Math.random() * 12) + 1; // 1 to 12 days
    const dailyFee = Math.floor(Math.random() * 450) + 50; // $50 - $500

    return {
      id: `CNTR-${10000 + i}`,
      origin: ORIGIN_PORTS[Math.floor(Math.random() * ORIGIN_PORTS.length)],
      status: status,
      daysInStatus: days,
      dailyFee: dailyFee,
      isDelayed: days > BASELINE_DAYS,
      currentBleed: days > BASELINE_DAYS ? dailyFee : 0,
      stageIndex: STAGES.indexOf(status)
    };
  });
};

const DATA = generateMockData();

// --- COMPONENTS ---

const KPI_Card = ({ title, value, subValue, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{subValue}</p>
    </div>
  </div>
);

const ProgressBar = ({ stageIndex, isCritical }) => {
  const progress = ((stageIndex + 1) / STAGES.length) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
        <span>Origin</span>
        <span>RDC</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default function InboundSupplyChainBottleneckRadar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'pivot'
  const [statusFilter, setStatusFilter] = useState('All');

  // --- DERIVED DATA ---
  const filteredData = useMemo(() => {
    return DATA.filter(item => {
      const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.origin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalBleed = useMemo(() => {
    return DATA.reduce((sum, item) => sum + item.currentBleed, 0);
  }, []);

  const delayedCount = useMemo(() => {
    return DATA.filter(item => item.isDelayed).length;
  }, []);

  const pivotMatrix = useMemo(() => {
    const matrix = {};
    ORIGIN_PORTS.forEach(port => {
      matrix[port] = {};
      STAGES.forEach(status => {
        matrix[port][status] = DATA.filter(d => d.origin === port && d.status === status && d.isDelayed).length;
      });
    });
    return matrix;
  }, []);

  const chartData = useMemo(() => {
    return ORIGIN_PORTS.map(port => ({
      name: port,
      bleed: DATA.filter(d => d.origin === port).reduce((sum, item) => sum + item.currentBleed, 0)
    })).sort((a, b) => b.bleed - a.bleed);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Inbound Supply Chain Bottleneck Radar
          </h1>
          <p className="text-slate-500 mt-1">Real-time container throughput & demurrage analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={18} className="text-slate-600" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Container ID or Port..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPI_Card 
          title="Total Accruing Bleed" 
          value={`$${totalBleed.toLocaleString()}`} 
          subValue="Active daily demurrage fees"
          icon={DollarSign}
          colorClass="bg-red-100 text-red-600"
        />
        <KPI_Card 
          title="Delayed Containers" 
          value={delayedCount} 
          subValue={`${((delayedCount / DATA.length) * 100).toFixed(1)}% of total inventory`}
          icon={AlertTriangle}
          colorClass="bg-amber-100 text-amber-600"
        />
        <KPI_Card 
          title="Avg. Days in Status" 
          value="5.2 Days" 
          subValue="+1.2 days vs enterprise baseline"
          icon={Clock}
          colorClass="bg-blue-100 text-blue-600"
        />
        <KPI_Card 
          title="Active Vessels" 
          value="14" 
          subValue="In-transit tracking active"
          icon={Ship}
          colorClass="bg-indigo-100 text-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <button 
                  onClick={() => setActiveTab('list')}
                  className={`flex items-center space-x-2 pb-4 -mb-4 border-b-2 transition-all font-medium ${activeTab === 'list' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={18} />
                  <span>Container List</span>
                </button>
                <button 
                  onClick={() => setActiveTab('pivot')}
                  className={`flex items-center space-x-2 pb-4 -mb-4 border-b-2 transition-all font-medium ${activeTab === 'pivot' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  <Grid size={18} />
                  <span>Pivot Matrix</span>
                </button>
              </div>
              <select 
                className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="p-0 overflow-auto max-h-[600px]">
              {activeTab === 'list' ? (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Container ID</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origin Port</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Bleed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.slice(0, 100).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700">{item.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 flex items-center space-x-2">
                          <Anchor size={14} className="text-slate-400" />
                          <span>{item.origin}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isDelayed ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {item.status} ({item.daysInStatus}d)
                          </div>
                        </td>
                        <td className="px-6 py-4 w-48">
                          <ProgressBar stageIndex={item.stageIndex} isCritical={item.isDelayed} />
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                          {item.currentBleed > 0 ? `$${item.currentBleed}/day` : '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 border bg-slate-50 text-xs font-bold text-slate-500 uppercase">Origin Port / Status (Delayed Only)</th>
                        {STAGES.map(status => (
                          <th key={status} className="p-4 border bg-slate-50 text-xs font-bold text-slate-500 uppercase">{status}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ORIGIN_PORTS.map(port => (
                        <tr key={port}>
                          <td className="p-4 border font-bold text-slate-700 bg-slate-50/50">{port}</td>
                          {STAGES.map(status => {
                            const count = pivotMatrix[port][status];
                            return (
                              <td key={status} className={`p-4 border text-center font-medium ${count > 5 ? 'bg-red-50 text-red-600' : count > 0 ? 'bg-amber-50 text-amber-600' : 'text-slate-300'}`}>
                                {count}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {activeTab === 'list' && (
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-400 text-center">
                Showing first 100 of 250 containers
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Additional Analytics */}
        <div className="space-y-8">
          {/* Bleed by Port Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <DollarSign size={20} className="text-red-500" />
              <span>Bleed by Origin Port</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80} 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="bleed" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Highest Risk Port:</span>
                <span className="font-bold text-red-600">{chartData[0].name}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions / Alerts */}
          <div className="bg-indigo-900 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Enterprise Alert</h3>
              <p className="text-indigo-200 text-sm mb-6">
                Total demurrage bleed has increased by 14% since the last reporting cycle.
              </p>
              <button className="w-full bg-white text-indigo-900 font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                Escalate Bottlenecks
              </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-800 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-blue-700 rounded-full opacity-50 blur-2xl"></div>
          </div>

          {/* Legend / Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Journey Mapping</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-md"><Ship size={14}/></div>
                  <span className="text-sm font-medium">Stage 1: At Sea</span>
                </div>
                <span className="text-xs font-mono text-slate-400">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-md"><AlertTriangle size={14}/></div>
                  <span className="text-sm font-medium">Stage 2: Customs</span>
                </div>
                <span className="text-xs font-mono text-slate-400">50%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-md"><Truck size={14}/></div>
                  <span className="text-sm font-medium">Stage 3: Transit</span>
                </div>
                <span className="text-xs font-mono text-slate-400">75%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-md"><Warehouse size={14}/></div>
                  <span className="text-sm font-medium">Stage 4: RDC Yard</span>
                </div>
                <span className="text-xs font-mono text-slate-400">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}