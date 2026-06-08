import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

/**
 * DepartmentalExpenseDrillDown
 * A hierarchical explorer for organizational spending.
 * Features: Master Table (Departments), Drill-down Sidebar (Teams), Dynamic Donut (Expense Items).
 */
export default function DepartmentalExpenseDrillDown() {
  // --- STATE ---
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);

  // --- MOCK DATA GENERATION ---
  useEffect(() => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'Product', 'Human Resources'];
    const teams = {
      'Engineering': ['Frontend', 'Backend', 'QA', 'DevOps', 'Mobile'],
      'Marketing': ['Growth', 'Brand', 'Events', 'Product Marketing'],
      'Sales': ['Enterprise', 'SMB', 'Enablement', 'Operations'],
      'Product': ['Design', 'Core Platform', 'Analytics'],
      'Human Resources': ['Recruiting', 'L&D', 'Total Rewards']
    };
    const items = ['Software Licenses', 'Hardware', 'Travel', 'Salaries', 'Office Supplies', 'Cloud Infrastructure', 'Consulting'];

    const generatedData = Array.from({ length: 500 }, (_, i) => {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const teamList = teams[dept];
      const team = teamList[Math.floor(Math.random() * teamList.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      return {
        id: i,
        department: dept,
        team: team,
        item: item,
        amount: Math.floor(Math.random() * 5000) + 500,
        date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
      };
    });
    setExpenses(generatedData);
  }, []);

  // --- ANALYTICS CALCULATIONS ---
  const deptTotals = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.department] = (map[e.department] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, total]) => ({ name, total }));
  }, [expenses]);

  const teamTotals = useMemo(() => {
    if (!selectedDept) return [];
    const map = {};
    expenses.filter(e => e.department === selectedDept).forEach(e => {
      map[e.team] = (map[e.team] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, total]) => ({ name, total }));
  }, [expenses, selectedDept]);

  const itemBreakdown = useMemo(() => {
    let filtered = expenses;
    if (selectedDept) filtered = filtered.filter(e => e.department === selectedDept);
    if (selectedTeam) filtered = filtered.filter(e => e.team === selectedTeam);

    const map = {};
    filtered.forEach(e => {
      map[e.item] = (map[e.item] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses, selectedDept, selectedTeam]);

  const totalFilteredAmount = itemBreakdown.reduce((sum, current) => sum + current.value, 0);

  // --- HANDLERS ---
  const handleDeptClick = (deptName) => {
    setSelectedDept(deptName);
    setSelectedTeam(null);
    setIsSidebarOpen(true);
  };

  const handleTeamClick = (teamName) => {
    setSelectedTeam(teamName === selectedTeam ? null : teamName);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedDept(null);
    setSelectedTeam(null);
  };

  // --- THEME TOKENS (from visual_spec.skill.md) ---
  const theme = {
    bg: '#ffffff',
    darkBg: '#1a1a1a',
    bgSecondary: '#e2e8f0',
    darkBgSecondary: '#1e293b',
    textPrimary: '#5c5c5c',
    darkTextPrimary: '#dbdbdb',
    textSecondary: '#475569',
    darkTextSecondary: '#cbd5e1',
    border: '#e2e8f0',
    darkBorder: '#1e293b',
    chartPalette: ['#62a8ea', '#aaa47c', '#a8d95e', '#40bdd4', '#7375c9', '#ea75b0', '#f59e0b'],
    headerColor: '#457bba',
    darkHeaderColor: '#94a3b8'
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200 bg-[#ffffff] dark:bg-[#1a1a1a]">
      {/* HEADER */}
      <header className="w-full border-b border-[#e2e8f0] dark:border-[#1e293b] px-8 py-4 flex items-center justify-between z-10">
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: theme.textPrimary }} className="dark:text-[#dbdbdb]">
          Departmental Expense Drill-Down
        </h1>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-[5px] bg-[#e2e8f0] dark:bg-[#1e293b]">
            <span style={{ fontSize: '12px', color: '#64748b' }}>Currency: USD</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {/* MASTER VIEW */}
        <div className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? 'mr-[400px]' : ''}`}>
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: theme.textPrimary }} className="dark:text-[#dbdbdb]">
              Global Department Overview
            </h2>

            {/* MASTER TABLE */}
            <div className="overflow-hidden rounded-[12px] border border-[#e2e8f0] dark:border-[#1e293b]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#ffffff] dark:bg-[#1a1a1a] border-b border-[#e2e8f0] dark:border-[#1e293b]">
                  <tr>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: theme.headerColor }}>Department Name</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: theme.headerColor }}>Total Spending</th>
                    <th className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: theme.headerColor }}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                  {deptTotals.map((dept) => (
                    <tr 
                      key={dept.name} 
                      onClick={() => handleDeptClick(dept.name)}
                      className={`cursor-pointer hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors ${selectedDept === dept.name ? 'bg-[#ebf5ff] dark:bg-[#122940]' : ''}`}
                    >
                      <td className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '500', color: '#657281' }}>{dept.name}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '400', color: '#657281' }}>${dept.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <button 
                          className="text-[#598dc5] dark:text-[#5aa1d8] hover:underline"
                          style={{ fontSize: '12px', fontWeight: '600' }}
                        >
                          View Breakdown
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CHART AREA (Dynamic Donut) */}
            <div className="p-6 rounded-[12px] border border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#1a1a1a]">
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: theme.textPrimary }} className="dark:text-[#dbdbdb]">
                  Expense Breakdown: {selectedTeam ? selectedTeam : (selectedDept ? selectedDept : 'All Departments')}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Total: ${totalFilteredAmount.toLocaleString()}</p>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={itemBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {itemBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={theme.chartPalette[index % theme.chartPalette.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* DRILL-DOWN SIDEBAR */}
        <div 
          className={`fixed top-[73px] right-0 bottom-0 w-[400px] bg-[#ffffff] dark:bg-[#1a1a1a] border-l border-[#e2e8f0] dark:border-[#1e293b] shadow-2xl transform transition-transform duration-300 ease-in-out z-20 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h4 style={{ fontSize: '20px', fontWeight: '600', color: theme.textPrimary }} className="dark:text-[#dbdbdb]">
                {selectedDept} Teams
              </h4>
              <button 
                onClick={closeSidebar}
                className="p-2 hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              Select a team to filter the expense breakdown chart.
            </p>

            <div className="space-y-3">
              {teamTotals.map((team) => (
                <button
                  key={team.name}
                  onClick={() => handleTeamClick(team.name)}
                  className={`w-full p-4 rounded-[12px] border text-left flex justify-between items-center transition-all ${
                    selectedTeam === team.name 
                    ? 'border-[#598dc5] bg-[#ebf5ff] dark:bg-[#1e3a8a] dark:border-[#3b82f6]' 
                    : 'border-[#e2e8f0] dark:border-[#1e293b] hover:bg-[#f8fafc] dark:hover:bg-[#262626]'
                  }`}
                >
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '500', display: 'block' }} className="text-[#475569] dark:text-[#cbd5e1]">
                      {team.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{Math.floor(Math.random() * 20) + 5} Headcount</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }} className="text-[#5c5c5c] dark:text-[#dbdbdb]">
                    ${team.total.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-[#e2e8f0] dark:border-[#1e293b]">
              <div className="p-4 rounded-[8px] bg-[#eff6ff] dark:bg-[#1e3a8a] text-[#1e40af] dark:text-[#bfdbfe]">
                <p style={{ fontSize: '12px', fontWeight: '500' }}>Quick Insight</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>
                  {selectedTeam 
                    ? `Showing data for the ${selectedTeam} team within ${selectedDept}.`
                    : `Aggregate view for all teams in ${selectedDept}.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* OVERLAY FOR SIDEBAR MOBILE/MODAL FEEL */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-10" 
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}