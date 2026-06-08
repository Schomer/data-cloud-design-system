import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChevronRight, Search, PieChart as PieIcon, Users, DollarSign, Filter, X } from 'lucide-react';

/**
 * MOCK DATA GENERATION
 * Generates a robust hierarchical dataset: 
 * Departments -> Teams -> Expense Items
 */
const generateData = () => {
  const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'Product', 'Customer Success', 'Finance', 'Human Resources', 'Operations'];
  const TEAMS_MAP = {
    'Engineering': ['Frontend', 'Backend', 'DevOps', 'QA', 'Mobile', 'Data Science'],
    'Marketing': ['Growth', 'Brand', 'Content', 'Events', 'SEO'],
    'Sales': ['SDRs', 'Account Executives', 'Sales Ops', 'Enterprise'],
    'Product': ['Design', 'Management', 'User Research'],
    'Customer Success': ['Support', 'Implementation', 'Account Management'],
    'Finance': ['Accounting', 'Audit', 'Payroll'],
    'Human Resources': ['Recruiting', 'L&D', 'Employee Relations'],
    'Operations': ['Logistics', 'Procurement', 'IT Support']
  };
  const EXPENSE_CATEGORIES = ['Software Licenses', 'Hardware', 'Travel', 'Professional Services', 'Office Supplies', 'Marketing Spend', 'Cloud Infrastructure', 'Utilities'];

  const expenses = [];
  let idCounter = 1;

  DEPARTMENTS.forEach(dept => {
    const teams = TEAMS_MAP[dept] || ['General'];
    teams.forEach(team => {
      // Generate at least 5-8 expense items per team to ensure volume
      const numExpenses = Math.floor(Math.random() * 5) + 5;
      for (let i = 0; i < numExpenses; i++) {
        expenses.push({
          id: idCounter++,
          department: dept,
          team: team,
          category: EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)],
          amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
          description: `Expense ${idCounter} for ${team}`,
          date: new Date(2026, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28)).toISOString().split('T')[0]
        });
      }
    });
  });

  return expenses;
};

const RAW_DATA = generateData();

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];

export default function DepartmentalExpenseDrillDown() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculate Department Aggregates
  const departmentAggregates = useMemo(() => {
    const map = {};
    RAW_DATA.forEach(item => {
      if (!map[item.department]) map[item.department] = 0;
      map[item.department] += item.amount;
    });
    return Object.entries(map).map(([name, total]) => ({ name, total }));
  }, []);

  // 2. Filter teams based on selected department
  const teamAggregates = useMemo(() => {
    if (!selectedDept) return [];
    const map = {};
    RAW_DATA.filter(item => item.department === selectedDept).forEach(item => {
      if (!map[item.team]) map[item.team] = 0;
      map[item.team] += item.amount;
    });
    return Object.entries(map).map(([name, total]) => ({ name, total }));
  }, [selectedDept]);

  // 3. Calculate Chart Data based on current selection (Dept or Team)
  const chartData = useMemo(() => {
    const scope = RAW_DATA.filter(item => {
      const matchDept = selectedDept ? item.department === selectedDept : true;
      const matchTeam = selectedTeam ? item.team === selectedTeam : true;
      return matchDept && matchTeam;
    });

    const categoryMap = {};
    scope.forEach(item => {
      if (!categoryMap[item.category]) categoryMap[item.category] = 0;
      categoryMap[item.category] += item.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [selectedDept, selectedTeam]);

  const handleDeptClick = (deptName) => {
    if (selectedDept === deptName) {
      setSelectedDept(null);
      setSelectedTeam(null);
    } else {
      setSelectedDept(deptName);
      setSelectedTeam(null);
    }
  };

  const handleTeamClick = (teamName) => {
    setSelectedTeam(selectedTeam === teamName ? null : teamName);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <DollarSign size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Expensify Pro</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Departmental Drill-Down</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search departments..." 
              className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto grid grid-cols-12 gap-8">

        {/* Main Master Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-blue-500" />
                Departmental Spending
              </h2>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">FY 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-3">Department Name</th>
                    <th className="px-6 py-3">Total Allocation</th>
                    <th className="px-6 py-3 text-right">Status</th>
                    <th className="px-6 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departmentAggregates
                    .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((dept) => (
                    <tr 
                      key={dept.name}
                      onClick={() => handleDeptClick(dept.name)}
                      className={`cursor-pointer transition-all hover:bg-blue-50/50 group ${selectedDept === dept.name ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-700 group-hover:text-blue-700">{dept.name}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">
                        ${dept.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Within Budget
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight 
                          size={18} 
                          className={`text-slate-300 group-hover:text-blue-400 transition-transform ${selectedDept === dept.name ? 'rotate-90 text-blue-600' : ''}`} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Individual Expense Items List (Full Detail Table) */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-semibold text-slate-800">Transaction Ledger</h2>
              <div className="text-xs text-slate-500">Showing {Math.min(200, RAW_DATA.length)} recent entries</div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Team</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {RAW_DATA.slice(0, 200).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-slate-500 font-mono text-xs">{item.date}</td>
                      <td className="px-6 py-3 font-medium text-slate-700">{item.team}</td>
                      <td className="px-6 py-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 uppercase">{item.category}</span>
                      </td>
                      <td className="px-6 py-3 font-semibold">${item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar Panel for Drill-Down */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">

          {/* Chart Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <PieIcon size={18} className="text-purple-500" />
                Expense Composition
              </h3>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Current Scope</span>
                <span className="text-xs font-bold text-purple-600">
                  {selectedTeam ? selectedTeam : (selectedDept ? selectedDept : 'All Organizations')}
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val) => [`$${val.toLocaleString()}`, 'Amount']}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
                <span className="text-slate-400 text-xs font-bold uppercase">Total</span>
                <span className="text-xl font-extrabold text-slate-800">
                  ${chartData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* Team Drill Down Side Panel */}
          {selectedDept && (
            <div className="bg-white rounded-2xl border border-blue-200 shadow-lg shadow-blue-50/50 p-6 animate-in slide-in-from-right-4 duration-300 overflow-hidden relative">
              <button 
                onClick={() => setSelectedDept(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Drill-down</p>
                <h3 className="text-xl font-bold text-slate-800">{selectedDept} Teams</h3>
              </div>

              <div className="space-y-3">
                {teamAggregates.map((team) => (
                  <button
                    key={team.name}
                    onClick={() => handleTeamClick(team.name)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      selectedTeam === team.name 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-sm">{team.name}</span>
                      <span className={`text-[10px] ${selectedTeam === team.name ? 'text-blue-100' : 'text-slate-400'} font-bold`}>
                        {Math.floor(Math.random() * 10 + 5)} ACTIVE EMPLOYEES
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold">${team.total.toLocaleString()}</div>
                      <div className={`text-[10px] ${selectedTeam === team.name ? 'text-blue-200' : 'text-slate-400'}`}>
                        {((team.total / RAW_DATA.filter(i => i.department === selectedDept).reduce((a, b) => a + b.amount, 0)) * 100).toFixed(1)}% of Dept
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Insights</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Avg/Team</div>
                    <div className="text-md font-bold text-slate-800">
                      ${(teamAggregates.reduce((a, b) => a + b.total, 0) / teamAggregates.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Overhead</div>
                    <div className="text-md font-bold text-green-600">-12.4%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedDept && (
            <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Users size={32} className="text-slate-300" />
              </div>
              <h4 className="text-slate-600 font-bold">Select a Department</h4>
              <p className="text-slate-400 text-xs mt-2 max-w-[200px]">
                Click on a row in the master table to drill down into team-level expenditures and category breakdowns.
              </p>
            </div>
          )}
        </aside>
      </main>

      {/* Floating Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-2 flex items-center justify-between z-40">
        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            System Live
          </div>
          <div>Last Aggregated: Just Now</div>
          <div className="text-blue-500">Auto-Refreshes in 12s</div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-slate-400 uppercase">Total Corporate Burn</span>
           <span className="text-sm font-black text-slate-800">
             ${departmentAggregates.reduce((a, b) => a + b.total, 0).toLocaleString()}
           </span>
        </div>
      </footer>
    </div>
  );
}