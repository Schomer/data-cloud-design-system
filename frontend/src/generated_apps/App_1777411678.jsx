import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { Menu, X, Filter, Download, Users, Briefcase, Clock, TrendingUp, ChevronRight, Search } from 'lucide-react';

/**
 * HRAnalyticsDashboard
 * A comprehensive workforce analytics page featuring retention metrics, 
 * departmental distribution, and detailed employee tracking.
 */

// --- MOCK DATA GENERATION ---
const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Product"];
const ROLES = ["Senior Engineer", "Product Manager", "Sales Exec", "HR Specialist", "Finance Analyst", "Ops Lead", "Junior Dev"];

const MOCK_EMPLOYEES = Array.from({ length: 250 }, (_, i) => ({
  id: `EMP-${1000 + i}`,
  name: [
    "Alex Rivera", "Jordan Smith", "Taylor Wong", "Casey Jones", "Morgan Lee", 
    "Riley Davis", "Quinn Brown", "Skyler Chen", "Avery Wilson", "Parker Hall"
  ][i % 10] + ` ${i}`,
  department: DEPARTMENTS[i % DEPARTMENTS.length],
  role: ROLES[i % ROLES.length],
  tenure: parseFloat((Math.random() * 7 + 0.2).toFixed(1)),
  salary: Math.floor(Math.random() * 80000) + 70000,
  performance: (Math.random() * 2 + 3).toFixed(1),
  status: Math.random() > 0.08 ? "Active" : "On Leave",
  lastPromotion: new Date(2023, Math.floor(Math.random() * 12), 1).toLocaleDateString(),
}));

const RETENTION_DATA = [
  { month: 'May 25', rate: 94.2, turnover: 1.2 },
  { month: 'Jun 25', rate: 93.8, turnover: 1.4 },
  { month: 'Jul 25', rate: 95.1, turnover: 0.9 },
  { month: 'Aug 25', rate: 94.5, turnover: 1.1 },
  { month: 'Sep 25', rate: 94.0, turnover: 1.3 },
  { month: 'Oct 25', rate: 93.5, turnover: 1.5 },
  { month: 'Nov 25', rate: 94.8, turnover: 1.0 },
  { month: 'Dec 25', rate: 95.5, turnover: 0.8 },
  { month: 'Jan 26', rate: 94.9, turnover: 1.1 },
  { month: 'Feb 26', rate: 94.2, turnover: 1.2 },
  { month: 'Mar 26', rate: 93.7, turnover: 1.5 },
  { month: 'Apr 26', rate: 94.4, turnover: 1.1 },
];

// --- DESIGN TOKENS (from visual_spec.skill.md) ---
const THEME = {
  dark: {
    bgPrimary: "#1a1a1a",
    bgSecondary: "#1e293b",
    textPrimary: "#dbdbdb",
    textSecondary: "#cbd5e1",
    border: "#1e293b",
    chartPalette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9", "#ea75b0"],
    cardBg: "#1a1a1a",
    tableHeader: "#94a3b8",
    rowBorder: "#262626",
    accent: "#5aa1d8"
  }
};

export default function HRAnalyticsDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");

  // Filter Logic
  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => {
      const matchesDept = selectedDept === "All Departments" || emp.department === selectedDept;
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [selectedDept, searchTerm]);

  const deptDistribution = useMemo(() => {
    return DEPARTMENTS.map(dept => ({
      name: dept,
      value: MOCK_EMPLOYEES.filter(e => e.department === dept).length
    })).sort((a, b) => b.value - a.value);
  }, []);

  const stats = useMemo(() => ({
    total: filteredEmployees.length,
    retention: "94.4%",
    avgTenure: (filteredEmployees.reduce((acc, curr) => acc + curr.tenure, 0) / filteredEmployees.length).toFixed(1),
    turnover: "1.1%"
  }), [filteredEmployees]);

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] font-['Inter',sans-serif] text-[#dbdbdb]">
      {/* SIDEBAR */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-[#1a1a1a] border-r border-[#1e293b] ${
          isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
        }`}
      >
        <div className="flex items-center h-16 px-6 border-b border-[#1e293b]">
          <span style={{ fontSize: '18px', fontWeight: '600', color: THEME.dark.accent }}>WorkforcePro</span>
        </div>
        <nav className="p-4 space-y-2">
          {["Overview", "Retention", "Compensation", "Performance", "Directory"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === item ? 'bg-[#1e3a8a] text-[#bfdbfe]' : 'text-[#64748b] hover:bg-[#1e293b] hover:text-[#dbdbdb]'
              }`}
            >
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{item}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-8 bg-[#1a1a1a] border-b border-[#1e293b]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#dbdbdb] hover:bg-[#1e293b] p-2 rounded">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#dbdbdb' }}>HR Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-[#64748b]" size={16} />
                <input 
                  type="text"
                  placeholder="Search employees..."
                  className="bg-[#121212] border border-[#1e293b] rounded-lg pl-10 pr-4 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="bg-[#292929] border border-[#1e293b] text-[#a0a7b0] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#122940] transition-colors flex items-center gap-2">
                <Download size={16} /> Export
             </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* FILTERS BAR */}
          <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] border border-[#1e293b] rounded-xl">
            <Filter size={18} className="text-[#64748b]" />
            <select 
              className="bg-transparent text-sm font-medium text-[#cbd5e1] focus:outline-none"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All Departments">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="h-4 w-px bg-[#1e293b]" />
            <span className="text-xs text-[#64748b] font-medium uppercase tracking-wider">Viewing data for: Apr 2026</span>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Headcount", value: stats.total, icon: <Users size={20}/>, trend: "+4% vs prev month" },
              { label: "Retention Rate", value: stats.retention, icon: <TrendingUp size={20}/>, trend: "+0.2% vs target" },
              { label: "Avg. Tenure", value: `${stats.avgTenure} yrs`, icon: <Clock size={20}/>, trend: "Consistent" },
              { label: "Monthly Turnover", value: stats.turnover, icon: <Briefcase size={20}/>, trend: "-0.1% Improvement" }
            ].map((kpi, i) => (
              <div key={i} className="p-6 bg-[#1a1a1a] border border-[#1e293b] rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8' }}>{kpi.label}</span>
                  <div className="p-2 bg-[#1e293b] rounded-lg text-[#3b82f6]">{kpi.icon}</div>
                </div>
                <div style={{ fontSize: '30px', fontWeight: '600', color: '#3b82f6' }}>{kpi.value}</div>
                <div className="mt-2 text-xs text-[#10b981] flex items-center gap-1">
                  <span>{kpi.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Retention Trend */}
            <div className="p-6 bg-[#1a1a1a] border border-[#1e293b] rounded-xl">
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#dbdbdb', marginBottom: '24px' }}>Retention & Turnover Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={RETENTION_DATA}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis 
                      dataKey="month" 
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
                      domain={[90, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#dbdbdb' }}
                    />
                    <Area type="monotone" dataKey="rate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRate)" name="Retention %" />
                    <Line type="monotone" dataKey="turnover" stroke="#f59e0b" dot={false} name="Turnover %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="p-6 bg-[#1a1a1a] border border-[#1e293b] rounded-xl">
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#dbdbdb', marginBottom: '24px' }}>Employee Distribution by Dept</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: '#1e293b' }}
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="#62a8ea" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* EMPLOYEE DATA TABLE */}
          <div className="bg-[#1a1a1a] border border-[#1e293b] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#dbdbdb' }}>Employee Directory</h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Showing {filteredEmployees.length} active records</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1a1a1a] border-b border-[#1e293b]">
                  <tr>
                    {["ID", "Name", "Department", "Role", "Tenure (Yrs)", "Status"].map((header) => (
                      <th key={header} className="px-6 py-4 text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {filteredEmployees.slice(0, 10).map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#122940] transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-[#a0a7b0]">{emp.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#dbdbdb]">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-[#cbd5e1]">{emp.department}</td>
                      <td className="px-6 py-4 text-sm text-[#cbd5e1]">{emp.role}</td>
                      <td className="px-6 py-4 text-sm text-[#cbd5e1]">{emp.tenure}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          emp.status === 'Active' ? 'bg-[#064e3b] text-[#a7f3d0]' : 'bg-[#78350f] text-[#fcd34d]'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#64748b] hover:text-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEmployees.length > 10 && (
                <div className="p-4 bg-[#1a1a1a] border-t border-[#1e293b] text-center">
                  <button className="text-sm font-medium text-[#3b82f6] hover:underline">View all {filteredEmployees.length} employees</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}