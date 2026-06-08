import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Briefcase, 
  Clock, 
  Calendar, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Table as TableIcon,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

/**
 * ProjectTimesheetMatrix
 * A robust application for visualizing employee hours across projects in a matrix format.
 */
export default function ProjectTimesheetMatrix() {
  // --- Data Generation (MANDATORY 200+ ROWS) ---
  const rawData = useMemo(() => {
    const employeeList = [
      'Alice Smith', 'Bob Johnson', 'Charlie Davis', 'Diana Prince', 
      'Ethan Hunt', 'Fiona Gallagher', 'George Miller', 'Hannah Abbott',
      'Ian Wright', 'Jenna Ortega'
    ];
    const projectList = [
      'Quantum Leap', 'Nebula UI', 'Project Phoenix', 'Data Stream', 
      'Apollo Engine', 'Cyber Shield'
    ];

    return Array.from({ length: 300 }, (_, i) => {
      // Create dates spread over the last 4 weeks relative to a fixed start
      const baseDate = new Date(2026, 4, 1); // May 2026
      const randomDays = Math.floor(Math.random() * 28);
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + randomDays);

      return {
        id: i,
        employee: employeeList[i % employeeList.length],
        project: projectList[Math.floor(Math.random() * projectList.length)],
        date: date.toISOString().split('T')[0],
        hours: Math.floor(Math.random() * 8) + 1,
      };
    });
  }, []);

  // --- State Management ---
  const [viewMode, setViewMode] = useState('matrix'); // 'matrix' or 'analytics'
  const [selectedWeek, setSelectedWeek] = useState(1); // 1 to 4
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // --- Logic: Filter & Pivot ---
  const filteredData = useMemo(() => {
    // We split our 28-day range into 4 logical weeks
    const startDay = (selectedWeek - 1) * 7;
    const endDay = selectedWeek * 7;

    return rawData.filter(entry => {
      const entryDate = new Date(entry.date);
      const dayDiff = Math.floor((entryDate.getTime() - new Date(2026, 4, 1).getTime()) / (1000 * 3600 * 24));
      return dayDiff >= startDay && dayDiff < endDay;
    });
  }, [rawData, selectedWeek]);

  const pivotData = useMemo(() => {
    const employees = [...new Set(rawData.map(d => d.employee))].sort();
    const projects = [...new Set(rawData.map(d => d.project))].sort();

    const matrix = employees.map(emp => {
      const row = { employee: emp, total: 0 };
      projects.forEach(proj => {
        const hours = filteredData
          .filter(d => d.employee === emp && d.project === proj)
          .reduce((sum, d) => sum + d.hours, 0);
        row[proj] = hours;
        row.total += hours;
      });
      return row;
    });

    const projectTotals = projects.map(proj => {
      return {
        project: proj,
        total: matrix.reduce((sum, row) => sum + (row[proj] || 0), 0)
      };
    });

    const grandTotal = projectTotals.reduce((sum, p) => sum + p.total, 0);

    return { matrix, projects, projectTotals, grandTotal };
  }, [filteredData, rawData]);

  // --- UI Components ---
  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <Clock className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && <span className="font-bold text-white text-lg tracking-tight">TimeGrid</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button 
            onClick={() => setViewMode('matrix')}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${viewMode === 'matrix' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <TableIcon className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3 font-medium">Timesheet Matrix</span>}
          </button>
          <button 
            onClick={() => setViewMode('analytics')}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${viewMode === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <BarChart3 className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3 font-medium">Project Insights</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-white"
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Project Timesheet Matrix</h1>
            <p className="text-sm text-slate-500">Resource allocation for May 2026</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              {[1, 2, 3, 4].map(wk => (
                <button
                  key={wk}
                  onClick={() => setSelectedWeek(wk)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${selectedWeek === wk ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Week {wk}
                </button>
              ))}
            </div>
            <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* Dashboard Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Users} label="Total Staff" value={pivotData.matrix.length} color="bg-indigo-500" />
            <StatCard icon={Briefcase} label="Active Projects" value={pivotData.projects.length} color="bg-emerald-500" />
            <StatCard icon={Clock} label="Total Hours" value={pivotData.grandTotal} color="bg-amber-500" />
            <StatCard icon={Calendar} label="Target Week" value={`W${selectedWeek} May`} color="bg-blue-500" />
          </div>

          {viewMode === 'matrix' ? (
            /* --- MATRIX VIEW --- */
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-sm font-bold text-slate-600 sticky left-0 bg-slate-50 z-20 w-64 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                        Employee Name
                      </th>
                      {pivotData.projects.map(proj => (
                        <th key={proj} className="px-6 py-4 text-sm font-bold text-slate-600 min-w-[120px]">
                          {proj}
                        </th>
                      ))}
                      <th className="px-6 py-4 text-sm font-bold text-blue-600 bg-blue-50/50 sticky right-0 z-20 text-right">
                        Total Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pivotData.matrix.map((row, idx) => (
                      <tr key={row.employee} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                        <td className="px-6 py-4 font-semibold text-slate-800 sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                          {row.employee}
                        </td>
                        {pivotData.projects.map(proj => (
                          <td key={proj} className="px-6 py-4 text-sm">
                            <span className={row[proj] > 0 ? 'font-medium text-slate-900' : 'text-slate-300'}>
                              {row[proj] || '-'}
                            </span>
                          </td>
                        ))}
                        <td className="px-6 py-4 text-sm font-bold text-right text-blue-700 bg-blue-50/30 sticky right-0 z-10">
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900 text-white font-bold">
                      <td className="px-6 py-4 sticky left-0 bg-slate-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                        Project Totals
                      </td>
                      {pivotData.projectTotals.map(p => (
                        <td key={p.project} className="px-6 py-4 text-sm">
                          {p.total}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-sm text-right bg-blue-600 sticky right-0 z-10">
                        {pivotData.grandTotal}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            /* --- ANALYTICS VIEW --- */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                  Hours per Project
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pivotData.projectTotals}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="project" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                      />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {pivotData.projectTotals.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6'][index % 6]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-500" />
                  Employee Workload Distribution
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pivotData.matrix}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="total"
                        nameKey="employee"
                        label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {pivotData.matrix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#14b8a6'][index % 7]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 text-slate-800">Summary Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Avg Hours / Employee</p>
                    <p className="text-xl font-bold text-slate-900">{(pivotData.grandTotal / pivotData.matrix.length).toFixed(1)} hrs</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Top Project</p>
                    <p className="text-xl font-bold text-slate-900">
                      {[...pivotData.projectTotals].sort((a,b) => b.total - a.total)[0]?.project}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Max Workload</p>
                    <p className="text-xl font-bold text-slate-900">
                      {[...pivotData.matrix].sort((a,b) => b.total - a.total)[0]?.total} hrs
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Capacity Utilization</p>
                    <p className="text-xl font-bold text-slate-900">
                      {Math.min(100, (pivotData.grandTotal / (pivotData.matrix.length * 40) * 100)).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}