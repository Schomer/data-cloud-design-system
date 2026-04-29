import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  Briefcase, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Legend,
  ReferenceLine
} from 'recharts';

/**
 * ExecutivePerformanceDashboard
 * A high-level executive summary for Q3 company performance.
 * Features massive KPI cards, a simple growth vs. target line chart, 
 * and a comprehensive deals table with a highlighted 'Top 3' view.
 */
export default function ExecutivePerformanceDashboard() {
  // --- MOCK DATA GENERATION ---

  // Generate 200 rows of deals data
  const allDeals = useMemo(() => {
    const companies = [
      'Stellar Dynamics', 'Apex Corp', 'Nebula Systems', 'Vertex Solutions', 
      'Quantum Fin', 'Echelon Logistics', 'Horizon Health', 'Lumina Tech',
      'Silverline', 'Pioneer Bio', 'Oasis Energy', 'Titan Manufacturing'
    ];
    const owners = ['Alex Rivera', 'Jordan Smith', 'Taylor Vance', 'Morgan Lee', 'Casey Wright'];

    return Array.from({ length: 200 }, (_, i) => {
      const value = Math.floor(Math.random() * 850000) + 15000;
      const month = Math.floor(Math.random() * 3) + 7; // July (7) to Sept (9)
      const day = Math.floor(Math.random() * 28) + 1;

      return {
        id: `D-${2000 + i}`,
        company: companies[i % companies.length],
        value: value,
        owner: owners[i % owners.length],
        status: i % 5 === 0 ? 'Closed Won' : 'Closing',
        date: `2025-0${month}-${day.toString().padStart(2, '0')}`
      };
    });
  }, []);

  // Top 3 deals for the summary
  const top3Deals = useMemo(() => {
    return [...allDeals].sort((a, b) => b.value - a.value).slice(0, 3);
  }, [allDeals]);

  // Generate 92 days of Q3 growth data (July 1 - Sept 30)
  const growthData = useMemo(() => {
    let currentActual = 500000;
    let currentTarget = 450000;

    return Array.from({ length: 92 }, (_, i) => {
      const day = i + 1;
      // Actual growth with some volatility
      currentActual += Math.floor(Math.random() * 150000) - 10000;
      // Target growth (linear with a slight curve)
      currentTarget += 120000 + (Math.sin(i / 10) * 5000);

      const date = new Date(2025, 6, day);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        actual: currentActual,
        target: currentTarget
      };
    });
  }, []);

  // KPI Calculations
  const totalRevenue = 14280500;
  const profitMargin = 28.4;
  const cac = 142.50;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Summary</h1>
          <p className="text-slate-500 font-medium">Q3 Fiscal Performance Overview • 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="w-4 h-4" />
            Q3 2025
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Massive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Revenue Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">
              <ArrowUpRight className="w-3 h-3" />
              12.5%
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <h2 className="text-5xl font-black text-slate-900">${(totalRevenue / 1000000).toFixed(1)}M</h2>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">
              <ArrowUpRight className="w-3 h-3" />
              2.1%
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Profit Margin</p>
            <h2 className="text-5xl font-black text-slate-900">{profitMargin}%</h2>
          </div>
        </div>

        {/* CAC Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-full text-xs font-bold">
              <ArrowDownRight className="w-3 h-3" />
              4.8%
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Acquisition Cost</p>
            <h2 className="text-5xl font-black text-slate-900">${cac.toFixed(0)}</h2>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Growth vs Target Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Revenue Growth vs Target</h3>
              <p className="text-sm text-slate-500 font-medium italic">Tracking Q3 momentum against fiscal milestones</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                <span className="text-slate-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                <span className="text-slate-400">Target</span>
              </div>
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  animationDuration={2000}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#e2e8f0" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biggest Closing Deals */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-900">Biggest Deals</h3>
              <div className="p-1.5 bg-slate-50 rounded-lg">
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">Top contributors to Q3 closing volume</p>
          </div>

          <div className="flex-1">
            {top3Deals.map((deal, idx) => (
              <div key={deal.id} className="p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-amber-100 text-amber-700' : 
                      idx === 1 ? 'bg-slate-100 text-slate-600' : 
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">{deal.company}</h4>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{deal.owner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">${(deal.value / 1000).toFixed(0)}K</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-tighter">
                      WON
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full group-hover:bg-indigo-400 transition-all duration-700"
                    style={{ width: `${(deal.value / top3Deals[0].value) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50/50">
            <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group shadow-sm">
              View All 200 Opportunities
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Deals Grid (Scrollable) */}
      <div className="mt-10 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-sm">Full Deal Ledger</h3>
          </div>
          <div className="text-xs font-bold text-slate-400">
            SHOWING TOP 10 OF 200 RECORDED ENTRIES
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4 text-center">Deal Value</th>
                <th className="px-6 py-4">Rep</th>
                <th className="px-6 py-4">Close Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {allDeals.slice(0, 10).map((deal) => (
                <tr key={deal.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">{deal.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{deal.company}</td>
                  <td className="px-6 py-4 text-sm font-black text-right pr-12">${deal.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{deal.owner}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{deal.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      deal.status === 'Closed Won' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {deal.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of Summary Ledger</p>
        </div>
      </div>
    </div>
  );
}