import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell
} from 'recharts';
import { Menu, X, Filter, ChevronDown, Download, Search } from 'lucide-react';

/**
 * HRAnalytics Dashboard
 * An executive-level dashboard for monitoring employee distribution and retention.
 * Built with strict adherence to visual_spec and functional interactivity.
 */
export default function HRAnalytics() {
  // --- STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('Last 12 Months');

  // --- MOCK DATA GENERATION ---
  const departments = ['Engineering', 'Sales', 'Marketing', 'Product', 'Finance', 'HR', 'Operations', 'Customer Success'];

  const employees = useMemo(() => {
    const statuses = ['Active', 'Active', 'Active', 'Active', 'Terminated']; // Weight towards Active for retention
    return Array.from({ length: 200 }, (_, i) => {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const hireDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
      return {
        id: `EMP-${1000 + i}`,
        name: `Employee ${i + 1}`,
        department: dept,
        role: ['Manager', 'Lead', 'Senior', 'Junior', 'Associate'][Math.floor(Math.random() * 5)],
        status: status,
        hireDate: hireDate.toISOString().split('T')[0],
        tenure: Math.floor(Math.random() * 5) + 1,
        performance: (Math.random() * 5).toFixed(1)
      };
    });
  }, []);

  // --- FILTERED DATA & METRICS ---
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchDept = selectedDept === 'All Departments' || emp.department === selectedDept;
      const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [employees, selectedDept, searchTerm]);

  const stats = useMemo(() => {
    const total = filteredEmployees.length;
    const active = filteredEmployees.filter(e => e.status === 'Active').length;
    const terminated = total - active;
    const retentionRate = total > 0 ? ((active / total) * 100).toFixed(1) : 0;
    const avgTenure = total > 0 ? (filteredEmployees.reduce((acc, curr) => acc + curr.tenure, 0) / total).toFixed(1) : 0;

    return { total, active, terminated, retentionRate, avgTenure };
  }, [filteredEmployees]);

  const deptDistribution = useMemo(() => {
    return departments.map(dept => ({
      name: dept,
      count: employees.filter(e => e.department === dept).length
    })).sort((a, b) => b.count - a.count);
  }, [employees]);

  const retentionTrend = [
    { month: 'Jan', rate: 94.2 }, { month: 'Feb', rate: 93.8 }, { month: 'Mar', rate: 95.1 },
    { month: 'Apr', rate: 94.8 }, { month: 'May', rate: 96.2 }, { month: 'Jun', rate: 95.5 },
    { month: 'Jul', rate: 94.9 }, { month: 'Aug', rate: 93.2 }, { month: 'Sep', rate: 95.8 },
    { month: 'Oct', rate: 96.5 }, { month: 'Nov', rate: 97.1 }, { month: 'Dec', rate: 96.8 }
  ];

  // --- STYLES (Arbitrary Tailwind via Visual Spec) ---
  const light = {
    bg: '#ffffff',
    bgSecondary: '#e2e8f0',
    text: '#5c5c5c',
    textSec: '#475569',
    border: '#e2e8f0',
    chart: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9'],
    cardTitle: '#457bb4',
    cardVal: '#5f6972'
  };

  const dark = {
    bg: '#1a1a1a',
    bgSecondary: '#1e293b',
    text: '#dbdbdb',
    textSec: '#cbd5e1',
    border: '#1e293b',
    chart: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9'],
    cardTitle: '#94a3b8',
    cardVal: '#3b82f6'
  };

  // --- HELPERS ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] font-['Inter',_sans-serif]">
      {/* TOP HEADER */}
      <header className="w-full h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-6 sticky top-0 z-50 bg-[#ffffff] dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-1 hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] rounded transition-colors"
          >
            {isSidebarOpen ? <X className="text-[#5c5c5c] dark:text-[#dbdbdb]" /> : <Menu className="text-[#5c5c5c] dark:text-[#dbdbdb]" />}
          </button>
          <h1 className="text-[24px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb] tracking-tight">
            Workforce Intelligence
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-[#f8fafc] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-md px-3 py-1.5">
            <Search size={16} className="text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="Search employee..."
              className="bg-transparent border-none outline-none ml-2 text-[14px] text-[#0f172a] dark:text-[#f8fafc] w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#598dc5] dark:bg-[#5aa1d8] text-white dark:text-black px-4 py-2 rounded-[5px] text-[14px] font-[500] hover:opacity-90 transition-opacity">
            Export Report
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* SIDEBAR (Under Header) */}
        <aside className={`
          ${isSidebarOpen ? 'w-64' : 'w-0'} 
          transition-all duration-300 ease-in-out border-r border-[#e2e8f0] dark:border-[#1e293b] 
          bg-[#ffffff] dark:bg-[#1a1a1a] overflow-y-auto
        `}>
          <div className="p-6">
            <h6 className="text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase tracking-widest mb-4">
              Analytics Views
            </h6>
            <nav className="space-y-1">
              {['Overview', 'Performance', 'Retention', 'Hiring Pipeline'].map((item) => (
                <button 
                  key={item}
                  className={`w-full text-left px-3 py-2 rounded text-[14px] ${item === 'Overview' ? 'bg-[#ebf5ff] dark:bg-[#1e3a8a] text-[#457bb5] dark:text-[#bfdbfe] font-medium' : 'text-[#64748b] dark:text-[#cbd5e1] hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]'}`}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="mt-8">
              <h6 className="text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase tracking-widest mb-4">
                Department Filter
              </h6>
              <div className="space-y-1">
                <button 
                  onClick={() => setSelectedDept('All Departments')}
                  className={`w-full text-left px-3 py-2 rounded text-[14px] ${selectedDept === 'All Departments' ? 'text-[#457bb5] dark:text-[#60a5fa] font-semibold' : 'text-[#64748b] dark:text-[#cbd5e1]'}`}
                >
                  All Departments
                </button>
                {departments.map(dept => (
                  <button 
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`w-full text-left px-3 py-2 rounded text-[14px] ${selectedDept === dept ? 'text-[#457bb5] dark:text-[#60a5fa] font-semibold' : 'text-[#64748b] dark:text-[#cbd5e1] hover:text-[#334155]'}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#ffffff] dark:bg-[#1a1a1a] p-8">
          <div className="max-w-7xl mx-auto">
            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] p-5 rounded-[12px]">
                <p className="text-[12px] font-[400] text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Headcount</p>
                <h2 className="text-[30px] font-[600] text-[#5f6972] dark:text-[#dbdbdb]">{stats.total}</h2>
                <div className="flex items-center mt-2">
                  <span className="text-[12px] text-green-500 font-medium">+12%</span>
                  <span className="text-[12px] text-[#94a3b8] ml-2">vs last year</span>
                </div>
              </div>
              <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] p-5 rounded-[12px]">
                <p className="text-[12px] font-[400] text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Retention Rate</p>
                <h2 className="text-[30px] font-[600] text-[#5f6972] dark:text-[#dbdbdb]">{stats.retentionRate}%</h2>
                <div className="flex items-center mt-2">
                  <span className="text-[12px] text-green-500 font-medium">+0.4%</span>
                  <span className="text-[12px] text-[#94a3b8] ml-2">above target</span>
                </div>
              </div>
              <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] p-5 rounded-[12px]">
                <p className="text-[12px] font-[400] text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Avg Tenure</p>
                <h2 className="text-[30px] font-[600] text-[#5f6972] dark:text-[#dbdbdb]">{stats.avgTenure} Yrs</h2>
                <div className="flex items-center mt-2">
                  <span className="text-[12px] text-blue-500 font-medium">Stable</span>
                  <span className="text-[12px] text-[#94a3b8] ml-2">last 6 months</span>
                </div>
              </div>
              <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] p-5 rounded-[12px]">
                <p className="text-[12px] font-[400] text-[#64748b] dark:text-[#94a3b8] mb-1 uppercase">Turnover Vol.</p>
                <h2 className="text-[30px] font-[600] text-[#5f6972] dark:text-[#dbdbdb]">{stats.terminated}</h2>
                <div className="flex items-center mt-2">
                  <span className="text-[12px] text-red-400 font-medium">+3</span>
                  <span className="text-[12px] text-[#94a3b8] ml-2">this quarter</span>
                </div>
              </div>
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Distribution Bar Chart */}
              <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[20px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb]">Distribution by Department</h4>
                  <span className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Active Employees</span>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptDistribution} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100} 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" fill="#62a8ea" radius={[0, 4, 4, 0]} barSize={20}>
                        {deptDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={light.chart[index % light.chart.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Retention Line Chart */}
              <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[20px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb]">Retention Rate Trend</h4>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#62a8ea]"></span>
                    <span className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Actual %</span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={retentionTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: '#64748b' }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[90, 100]} 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#62a8ea" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#62a8ea', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* EMPLOYEE LIST TABLE */}
            <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-[12px] overflow-hidden">
              <div className="p-6 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between">
                <h4 className="text-[18px] font-[600] text-[#457bb4] dark:text-[#94a3b8]">Staff Directory</h4>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] text-[#64748b]">{filteredEmployees.length} Records</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] dark:bg-[#121212]">
                    <tr>
                      {['Employee', 'ID', 'Department', 'Role', 'Hired', 'Status'].map(header => (
                        <th key={header} className="px-6 py-4 text-[12px] font-[600] text-[#457bba] dark:text-[#94a3b8] uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                    {filteredEmployees.slice(0, 10).map((emp) => (
                      <tr key={emp.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors">
                        <td className="px-6 py-4 text-[14px] font-medium text-[#475569] dark:text-[#dbdbdb]">{emp.name}</td>
                        <td className="px-6 py-4 text-[14px] font-mono text-[#64748b] dark:text-[#a0a7b0]">{emp.id}</td>
                        <td className="px-6 py-4 text-[14px] text-[#475569] dark:text-[#cbd5e1]">{emp.department}</td>
                        <td className="px-6 py-4 text-[14px] text-[#475569] dark:text-[#cbd5e1]">{emp.role}</td>
                        <td className="px-6 py-4 text-[14px] text-[#64748b] dark:text-[#94a3b8]">{emp.hireDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-[#e2e8f0] dark:border-[#1e293b] bg-[#f8fafc] dark:bg-[#121212] flex justify-center">
                <button className="text-[14px] text-[#598dc5] font-medium hover:underline">View all employees</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}