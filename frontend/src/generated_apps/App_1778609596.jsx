import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Briefcase, 
  Clock,
  Filter
} from 'lucide-react';

/**
 * PROJECT TIMESHEET MATRIX
 * 
 * A high-performance React application for resource allocation analysis.
 * Features a dynamic pivot engine that transforms flat log data into a
 * matrix view with real-time filtering and aggregate totals.
 */

// --- MOCK DATA GENERATION ---
const EMPLOYEES = [
  "Alex Rivera", "Jordan Smith", "Sam Taylor", "Casey Morgan", 
  "Riley Cooper", "Jamie Lee", "Quinn Fabray", "Taylor Do",
  "Morgan Freeman", "Blake Lively", "Drew Barrymore", "Cameron Diaz"
];

const PROJECTS = [
  "Apollo", "Zeus", "Hermes", "Artemis", "Poseidon", "Ares"
];

const generateMockData = () => {
  const data = [];
  const today = new Date();

  // Generate logs for the last 4 weeks
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    EMPLOYEES.forEach(emp => {
      // Each employee works on 1-3 projects per day
      const dailyProjectsCount = Math.floor(Math.random() * 3) + 1;
      const shuffledProjects = [...PROJECTS].sort(() => 0.5 - Math.random());

      for (let j = 0; j < dailyProjectsCount; j++) {
        data.push({
          id: `${i}-${emp}-${j}`,
          employee: emp,
          date: new Date(date),
          project: shuffledProjects[j],
          hours: parseFloat((Math.random() * 6 + 1).toFixed(1)) // 1 to 7 hours
        });
      }
    });
  }
  return data;
};

const RAW_DATA = generateMockData();

// --- DESIGN TOKENS (from visual_spec.skill.md) ---
const THEME = {
  dark: {
    bg_primary: "#1a1a1a",
    bg_secondary: "#1e293b",
    text_primary: "#dbdbdb",
    text_secondary: "#cbd5e1",
    border: "#1e293b",
    accent: "#5aa1d8",
    header_text: "#94a3b8",
    row_border: "#262626"
  },
  typography: {
    h2: { fontSize: "30px", fontWeight: "600", color: "#dbdbdb" },
    h6: { fontSize: "14px", fontWeight: "600", color: "#7e8ea5", textTransform: "uppercase" },
    p: { fontSize: "14px", fontWeight: "400", color: "#cbd5e1" },
    small: { fontSize: "12px", fontWeight: "400", color: "#94a3b8" },
    value: { fontSize: "16px", fontWeight: "500", color: "#f8fafc" }
  }
};

export default function ProjectTimesheetMatrix() {
  // --- STATE ---
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    return { start, end };
  });

  // --- PIVOT LOGIC ---
  const matrixData = useMemo(() => {
    // 1. Filter by date range
    const filtered = RAW_DATA.filter(log => 
      log.date >= dateRange.start && log.date <= dateRange.end
    );

    // 2. Aggregate hours by Employee & Project
    const pivot = {};
    const projectsInView = new Set();

    filtered.forEach(log => {
      if (!pivot[log.employee]) pivot[log.employee] = {};
      if (!pivot[log.employee][log.project]) pivot[log.employee][log.project] = 0;

      pivot[log.employee][log.project] += log.hours;
      projectsInView.add(log.project);
    });

    const sortedProjects = Array.from(projectsInView).sort();

    // 3. Build Row Objects with Totals
    const rows = Object.keys(pivot).map(emp => {
      let employeeTotal = 0;
      const projectHours = sortedProjects.reduce((acc, proj) => {
        const hours = pivot[emp][proj] || 0;
        acc[proj] = hours;
        employeeTotal += hours;
        return acc;
      }, {});

      return {
        name: emp,
        ...projectHours,
        total: employeeTotal
      };
    }).sort((a, b) => b.total - a.total);

    // 4. Calculate Column Totals (Bottom Row)
    const columnTotals = sortedProjects.reduce((acc, proj) => {
      acc[proj] = rows.reduce((sum, row) => sum + (row[proj] || 0), 0);
      return acc;
    }, {});

    const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

    return { 
      rows, 
      projects: sortedProjects, 
      columnTotals, 
      grandTotal 
    };
  }, [dateRange]);

  // --- HANDLERS ---
  const shiftWeek = (direction) => {
    const offset = direction === 'next' ? 7 : -7;
    const newStart = new Date(dateRange.start);
    const newEnd = new Date(dateRange.end);
    newStart.setDate(newStart.getDate() + offset);
    newEnd.setDate(newEnd.getDate() + offset);
    setDateRange({ start: newStart, end: newEnd });
  };

  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div 
      className="min-h-screen p-8 flex flex-col gap-6"
      style={{ 
        backgroundColor: THEME.dark.bg_primary, 
        fontFamily: "'Inter', sans-serif" 
      }}
    >
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 style={THEME.typography.h2}>Project Timesheet Matrix</h1>
          <p style={THEME.typography.small}>Aggregated view of employee resource allocation and project hours.</p>
        </div>

        {/* DATE RANGE CONTROLS */}
        <div 
          className="flex items-center p-1 rounded-lg border"
          style={{ 
            backgroundColor: THEME.dark.bg_secondary, 
            borderColor: THEME.dark.border 
          }}
        >
          <button 
            onClick={() => shiftWeek('prev')}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors"
            style={{ color: THEME.dark.text_primary }}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="px-4 flex items-center gap-2 border-x" style={{ borderColor: THEME.dark.border }}>
            <Calendar size={14} className="text-slate-500" />
            <span style={THEME.typography.p} className="whitespace-nowrap">
              {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
            </span>
          </div>

          <button 
            onClick={() => shiftWeek('next')}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors"
            style={{ color: THEME.dark.text_primary }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      {/* KPI TOP ROW (Using 4 columns grid pattern from layout.skill.md) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Employees", value: matrixData.rows.length, icon: <User size={16} /> },
          { label: "Active Projects", value: matrixData.projects.length, icon: <Briefcase size={16} /> },
          { label: "Total Logged Hours", value: matrixData.grandTotal.toFixed(1), icon: <Clock size={16} /> },
          { label: "Avg Hours / Employee", value: (matrixData.grandTotal / (matrixData.rows.length || 1)).toFixed(1), icon: <Filter size={16} /> }
        ].map((kpi, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl border flex flex-col gap-1"
            style={{ backgroundColor: THEME.dark.bg_secondary, borderColor: THEME.dark.border }}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span style={THEME.typography.h6}>{kpi.label}</span>
              {kpi.icon}
            </div>
            <span style={THEME.typography.h2}>{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* MATRIX CANVAS */}
      <div 
        className="flex-grow overflow-auto rounded-xl border shadow-2xl"
        style={{ 
          backgroundColor: THEME.dark.bg_secondary, 
          borderColor: THEME.dark.border 
        }}
      >
        <table className="w-full text-left border-collapse min-w-[1000px]">
          {/* STICKY HEADER */}
          <thead 
            className="sticky top-0 z-10"
            style={{ backgroundColor: THEME.dark.bg_secondary }}
          >
            <tr>
              <th 
                className="p-4 border-b border-r"
                style={{ 
                  borderColor: THEME.dark.row_border,
                  ...THEME.typography.h6,
                  color: THEME.dark.header_text
                }}
              >
                Employee Name
              </th>
              {matrixData.projects.map(project => (
                <th 
                  key={project}
                  className="p-4 border-b text-center"
                  style={{ 
                    borderColor: THEME.dark.row_border,
                    ...THEME.typography.h6,
                    color: THEME.dark.header_text
                  }}
                >
                  {project}
                </th>
              ))}
              <th 
                className="p-4 border-b border-l text-center"
                style={{ 
                  borderColor: THEME.dark.row_border,
                  backgroundColor: "#2d3748",
                  ...THEME.typography.h6,
                  color: "#fff"
                }}
              >
                Total Hours
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {matrixData.rows.map((row, idx) => (
              <tr 
                key={row.name} 
                className="hover:bg-slate-800 transition-colors group"
              >
                <td 
                  className="p-4 border-b border-r"
                  style={{ 
                    borderColor: THEME.dark.row_border,
                    ...THEME.typography.p
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-sky-400">
                      {row.name.charAt(0)}
                    </div>
                    {row.name}
                  </div>
                </td>
                {matrixData.projects.map(proj => (
                  <td 
                    key={proj}
                    className="p-4 border-b text-center"
                    style={{ 
                      borderColor: THEME.dark.row_border,
                      ...THEME.typography.p,
                      color: (row[proj] || 0) > 0 ? THEME.dark.text_primary : "#4a5568"
                    }}
                  >
                    {row[proj] ? row[proj].toFixed(1) : '-'}
                  </td>
                ))}
                <td 
                  className="p-4 border-b border-l text-center font-bold"
                  style={{ 
                    borderColor: THEME.dark.row_border,
                    backgroundColor: "rgba(90, 161, 216, 0.05)",
                    ...THEME.typography.value,
                    color: THEME.dark.accent
                  }}
                >
                  {row.total.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>

          {/* FOOTER TOTALS ROW */}
          <tfoot className="sticky bottom-0 z-10" style={{ backgroundColor: THEME.dark.bg_secondary }}>
            <tr className="border-t-2" style={{ borderColor: THEME.dark.accent }}>
              <td 
                className="p-4 border-r"
                style={{ 
                  borderColor: THEME.dark.row_border,
                  ...THEME.typography.h6,
                  color: THEME.dark.accent
                }}
              >
                Total Project Hours
              </td>
              {matrixData.projects.map(proj => (
                <td 
                  key={proj}
                  className="p-4 text-center font-bold"
                  style={{ 
                    borderColor: THEME.dark.row_border,
                    ...THEME.typography.value,
                    color: THEME.dark.accent
                  }}
                >
                  {matrixData.columnTotals[proj].toFixed(1)}
                </td>
              ))}
              <td 
                className="p-4 border-l text-center bg-sky-900"
                style={{ 
                  ...THEME.typography.value,
                  color: "#fff"
                }}
              >
                {matrixData.grandTotal.toFixed(1)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* FOOTER INSIGHT */}
      <footer className="mt-auto pt-6 flex justify-between border-t" style={{ borderColor: THEME.dark.border }}>
        <p style={THEME.typography.small}>
          System Status: <span className="text-emerald-500">Live • All resources synchronized</span>
        </p>
        <p style={THEME.typography.small}>
          Showing aggregation for {matrixData.rows.length} employees over {matrixData.projects.length} projects.
        </p>
      </footer>
    </div>
  );
}