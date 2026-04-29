import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, LineChart, Line, Legend
} from 'recharts';
import { Menu, X, Search, Filter, ChevronDown, Download, Users, TrendingDown, Clock, Briefcase } from 'lucide-react';

// --- MOCK DATA GENERATION ---
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Product', 'HR', 'Operations', 'Finance'];
const LOCATIONS = ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo'];
const ROLES = ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director', 'VP'];

const generateMockData = () => {
  const employees = Array.from({ length: 200 }, (_, i) => {
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const joinDate = new Date(2018, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2018, 0, 1).getTime());
    const tenure = (new Date().getTime() - joinDate) / (1000 * 60 * 60 * 24 * 365);

    return {
      id: `EMP-${1000 + i}`,
      name: `Employee ${i + 1}`,
      email: `emp${i + 1}@company.com`,
      department: dept,
      role: ROLES[Math.floor(Math.random() * ROLES.length)],
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      tenure: parseFloat(tenure.toFixed(1)),
      rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
      status: Math.random() > 0.1 ? 'Active' : 'On Leave',
      salary: 60000 + Math.random() * 120000
    };
  });

  const retentionTrend = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    retention: 94 + Math.random() * 4,
    attrition: 1 + Math.random() * 3
  }));

  const deptDistribution = DEPARTMENTS.map(dept => ({
    name: dept,
    count: employees.filter(e => e.department === dept).length
  }));

  return { employees, retentionTrend, deptDistribution };
};

const DATA = generateMockData();

// --- COMPONENTS ---

const KPICard = ({ title, value, trend, icon: Icon, isPositive }) => (
  <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-[20px] flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <span style={{ fontSize: '12px', fontWeight: '400', color: '#457bb4' }} className="dark:text-[#94a3b8] uppercase tracking-wider">
        {title}
      </span>
      <Icon size={18} className="text-[#598dc5] dark:text-[#3b82f6]" />
    </div>
    <div style={{ fontSize: '30px', fontWeight: '600', color: '#5f6972' }} className="dark:text-[#3b82f6]">
      {value}
    </div>
    <div className="flex items-center gap-1">
      <span style={{ fontSize: '12px', fontWeight: '500' }} className={isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'}>
        {isPositive ? '↑' : '↓'} {trend}
      </span>
      <span style={{ fontSize: '12px', color: '#64748b' }}>vs last year</span>
    </div>
  </div>
);

export default function HRAnalyticsApp() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredEmployees = useMemo(() => {
    return DATA.employees.filter(emp => {
      const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            emp.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [deptFilter, searchQuery]);

  const filteredDeptDist = useMemo(() => {
    if (deptFilter === 'All') return DATA.deptDistribution;
    return DATA.deptDistribution.filter(d => d.name === deptFilter);
  }, [deptFilter]);

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] font-['Inter',sans-serif] text-[#5c5c5c] dark:text-[#dbdbdb]">

      {/* HEADER */}
      <header className="w-full h-[64px] border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-6 bg-[#ffffff] dark:bg-[#1a1a1a] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-[#e2e8f0] dark:hover:bg-[#1e293b] rounded transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '600' }} className="text-[#5c5c5c] dark:text-[#dbdbdb]">
            HRInsight<span className="text-[#598dc5]">Pro</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
            <input 
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#f8fafc] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[8px] focus:ring-2 focus:ring-[#3b82f6] outline-none text-sm transition-all w-[240px]"
            />
          </div>
          <button className="bg-[#598dc5] dark:bg-[#5aa1d8] text-white dark:text-black px-4 py-2 rounded-[5px] text-sm font-medium hover:opacity-90 transition-opacity">
            Export Report
          </button>
        </div>
      </header>

      <div className="flex relative">
        {/* SIDEBAR */}
        <aside 
          className={`fixed md:sticky top-[64px] left-0 h-[calc(100vh-64px)] w-[240px] bg-[#ffffff] dark:bg-[#1a1a1a] border-r border-[#e2e8f0] dark:border-[#1e293b] transition-transform z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden'}`}
        >
          <div className="p-6 flex flex-col gap-8">
            <div>
              <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }} className="uppercase tracking-widest mb-4">Navigation</h6>
              <nav className="flex flex-col gap-2">
                {['Overview', 'Directory', 'Retention'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-left px-3 py-2 rounded-md transition-all text-sm font-medium ${activeTab === tab ? 'bg-[#ebf5ff] dark:bg-[#1e3a8a] text-[#457bb5] dark:text-[#bfdbfe]' : 'text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]'}`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }} className="uppercase tracking-widest mb-4">Filters</h6>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label style={{ fontSize: '12px', color: '#64748b' }}>Department</label>
                  <select 
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="bg-[#f8fafc] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  >
                    <option value="All">All Departments</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CANVAS */}
        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-8">

            <div className="flex justify-between items-center">
              <div>
                <h2 style={{ fontSize: '30px', fontWeight: '600' }} className="text-[#5c5c5c] dark:text-[#f8fafc]">
                  {activeTab} Analytics
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Overview of your organization's workforce metrics and health.</p>
              </div>
              <div className="flex gap-2 bg-[#d4dee8] dark:bg-[#121212] p-1 rounded-lg">
                <button className="px-3 py-1 bg-white dark:bg-[#262626] rounded-md text-xs font-semibold text-[#457bb5] shadow-sm">Monthly</button>
                <button className="px-3 py-1 text-xs font-semibold text-[#598dc5]">Quarterly</button>
              </div>
            </div>

            {activeTab === 'Overview' && (
              <>
                {/* KPI GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard title="Total Headcount" value={filteredEmployees.length} trend="12.4%" icon={Users} isPositive={true} />
                  <KPICard title="Attrition Rate" value="4.2%" trend="0.8%" icon={TrendingDown} isPositive={true} />
                  <KPICard title="Avg Tenure" value="3.4 yrs" trend="5.2%" icon={Clock} isPositive={true} />
                  <KPICard title="Open Roles" value="86" trend="15%" icon={Briefcase} isPositive={false} />
                </div>

                {/* CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Distribution Chart */}
                  <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6 shadow-sm">
                    <h5 style={{ fontSize: '18px', fontWeight: '500' }} className="mb-6 text-[#5c5c5c] dark:text-[#f8fafc]">Department Distribution</h5>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredDeptDist}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            cursor={{ fill: '#f1f5f9' }}
                          />
                          <Bar dataKey="count" fill="#62a8ea" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Retention Trend */}
                  <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6 shadow-sm">
                    <h5 style={{ fontSize: '18px', fontWeight: '500' }} className="mb-6 text-[#5c5c5c] dark:text-[#f8fafc]">Retention vs Attrition Trends</h5>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DATA.retentionTrend}>
                          <defs>
                            <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#62a8ea" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#62a8ea" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                          <Tooltip />
                          <Legend iconType="circle" />
                          <Area type="monotone" dataKey="retention" stroke="#62a8ea" fillOpacity={1} fill="url(#colorRet)" strokeWidth={2} />
                          <Line type="monotone" dataKey="attrition" stroke="#ef4444" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* MINI TABLE */}
                <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] overflow-hidden shadow-sm">
                  <div className="p-6 flex justify-between items-center border-b border-[#e2e8f0] dark:border-[#1e293b]">
                    <h5 style={{ fontSize: '18px', fontWeight: '500' }} className="text-[#5c5c5c] dark:text-[#f8fafc]">Top Rated Employees</h5>
                    <button onClick={() => setActiveTab('Directory')} className="text-[#598dc5] text-sm font-medium hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#f8fafc] dark:bg-[#121212]">
                          {['Name', 'Dept', 'Role', 'Rating', 'Status'].map(h => (
                            <th key={h} className="px-6 py-4 text-xs font-semibold text-[#457bba] uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                        {filteredEmployees.slice(0, 5).sort((a,b) => b.rating - a.rating).map((emp) => (
                          <tr key={emp.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#121212] transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-[#475569] dark:text-[#cbd5e1]">{emp.name}</span>
                                <span className="text-xs text-[#94a3b8]">{emp.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#64748b]">{emp.department}</td>
                            <td className="px-6 py-4 text-sm text-[#64748b]">{emp.role}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-[#ecfdf5] dark:bg-[#064e3b] text-[#047857] dark:text-[#a7f3d0] rounded-full text-xs font-bold">
                                {emp.rating} ★
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${emp.status === 'Active' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}`} />
                                <span className="text-sm text-[#64748b]">{emp.status}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Directory' && (
              <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#e2e8f0] dark:border-[#1e293b] flex flex-col md:flex-row justify-between gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
                    <input 
                      type="text"
                      placeholder="Search directory..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-[#f8fafc] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-md text-sm w-full md:w-[320px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] dark:border-[#1e293b] rounded-md text-sm font-medium hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]">
                      <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] dark:border-[#1e293b] rounded-md text-sm font-medium hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]">
                      <Download size={16} /> Export
                    </button>
                  </div>
                </div>
                <div className="h-[600px] overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 bg-[#f8fafc] dark:bg-[#121212]">
                      <tr className="border-b border-[#e2e8f0] dark:border-[#1e293b]">
                        {['ID', 'Name', 'Department', 'Role', 'Tenure', 'Salary', 'Rating'].map(h => (
                          <th key={h} className="px-6 py-4 text-xs font-semibold text-[#457bba] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#121212] transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-[#94a3b8]">{emp.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-[#475569] dark:text-[#cbd5e1]">{emp.name}</span>
                              <span className="text-xs text-[#94a3b8]">{emp.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#64748b]">{emp.department}</td>
                          <td className="px-6 py-4 text-sm text-[#64748b]">{emp.role}</td>
                          <td className="px-6 py-4 text-sm text-[#64748b]">{emp.tenure} yrs</td>
                          <td className="px-6 py-4 text-sm text-[#64748b] font-mono">${emp.salary.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="px-6 py-4 text-sm font-bold text-[#f59e0b]">{emp.rating} / 5</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredEmployees.length === 0 && (
                    <div className="p-20 text-center">
                      <Users size={48} className="mx-auto text-[#e2e8f0] mb-4" />
                      <p className="text-[#94a3b8] italic">No employees found matching the criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Retention' && (
              <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-20 text-center shadow-sm">
                <TrendingDown size={64} className="mx-auto text-[#e2e8f0] mb-6" />
                <h3 style={{ fontSize: '24px', fontWeight: '600' }} className="mb-2">Deep Retention Analysis</h3>
                <p style={{ fontSize: '16px', color: '#64748b' }} className="max-w-[500px] mx-auto">
                  Detailed cohort analysis and attrition forecasting views are currently being calculated based on your historical data points.
                </p>
                <div className="mt-8">
                  <button className="bg-[#598dc5] text-white px-6 py-2 rounded-md font-medium" onClick={() => setActiveTab('Overview')}>
                    Return to Overview
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}