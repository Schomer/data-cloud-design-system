import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

/**
 * Hospital ER Shift Commander Dashboard
 * 
 * Features:
 * - Real-time situational awareness for ER triage.
 * - Cognitive Overload Safety Mode: Triggers when > 10 critical alerts are detected.
 * - Progressive Disclosure: Details nested within table rows.
 * - Strict adherence to visual_spec design tokens.
 */

// --- Constants & Themes ---
const TOKENS = {
  light: {
    background_primary: "#ffffff",
    background_secondary: "#e2e8f0",
    text_primary: "#5c5c5c",
    text_secondary: "#475569",
    border: "#e2e8f0",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
    kpiValue: "#5f6972",
    kpiTitle: "#457bb4"
  },
  dark: {
    background_primary: "#1a1a1a",
    background_secondary: "#1e293b",
    text_primary: "#dbdbdb",
    text_secondary: "#cbd5e1",
    border: "#1e293b",
    error: "#fb7185",
    success: "#34d399",
    warning: "#fbbf24",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
    kpiValue: "#3b82f6",
    kpiTitle: "#94a3b8"
  }
};

const TYPOGRAPHY = {
  h2: { fontSize: '30px', fontWeight: '600', lineHeight: '1.25' },
  h4: { fontSize: '20px', fontWeight: '600', lineHeight: '1.375' },
  h5: { fontSize: '18px', fontWeight: '500', lineHeight: '1.375' },
  p: { fontSize: '14px', fontWeight: '400', lineHeight: '1.6' },
  xs: { fontSize: '12px', fontWeight: '400', lineHeight: '1.5' },
  mono: { fontSize: '14px', fontWeight: '400', fontFamily: 'monospace' }
};

// --- Mock Data Generation ---
const SYMPTOMS = ["Chest Pain", "Laceration", "Abdominal Pain", "High Fever", "Shortness of Breath", "Fracture", "Allergic Reaction", "Migraine"];
const DOCTORS = ["Dr. Smith", "Dr. Jones", "Dr. Chen", "Dr. Garcia", "Dr. Kim"];

const generatePatients = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const acuity = Math.floor(Math.random() * 5) + 1;
    const waitTime = Math.floor(Math.random() * 45); // up to 45 mins
    return {
      id: `PAT-${1000 + i}`,
      acuity,
      symptom: SYMPTOMS[Math.floor(Math.random() * SYMPTOMS.length)],
      waitTime,
      doctor: DOCTORS[Math.floor(Math.random() * DOCTORS.length)],
      vitals: [
        { time: '10:00', hr: 82, bp: '120/80', temp: '98.6' },
        { time: '11:30', hr: 88, bp: '125/82', temp: '99.1' }
      ],
      allergies: acuity === 1 ? "Penicillin, Latex" : "None reported"
    };
  });
};

// --- Components ---

const KPICard = ({ title, value, theme, isAlert = false }) => (
  <div 
    className={`p-[20px] rounded-[12px] border-[1px] shadow-sm transition-all duration-300`}
    style={{ 
      backgroundColor: theme.background_primary, 
      borderColor: isAlert ? theme.error : theme.border 
    }}
  >
    <div style={{ ...TYPOGRAPHY.xs, color: theme.kpiTitle, marginBottom: '8px' }}>{title}</div>
    <div style={{ 
      ...TYPOGRAPHY.h2, 
      color: isAlert ? theme.error : theme.kpiValue 
    }}>
      {value}
    </div>
  </div>
);

export default function ERShiftCommander() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [patients, setPatients] = useState([]);
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const theme = isDarkMode ? TOKENS.dark : TOKENS.light;

  useEffect(() => {
    // Generate 200 patients initially
    setPatients(generatePatients(200));
  }, []);

  // Logic: Critical Red Flags (Acuity 1-2 + Wait > 15 mins)
  const criticalPatients = useMemo(() => {
    return patients.filter(p => (p.acuity <= 2) && (p.waitTime > 15));
  }, [patients]);

  const isOverloadMode = criticalPatients.length > 10;

  // Safety Mode Effect: Collapse panels when overload triggers
  useEffect(() => {
    if (isOverloadMode) {
      setExpandedPatientId(null);
    }
  }, [isOverloadMode]);

  const acuityDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    patients.forEach(p => dist[p.acuity - 1]++);
    return dist.map((count, i) => ({ acuity: `Lvl ${i + 1}`, count }));
  }, [patients]);

  return (
    <div 
      className="min-h-screen transition-colors duration-500 font-sans"
      style={{ 
        backgroundColor: theme.background_primary, 
        color: theme.text_primary,
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Top Header */}
      <header className="w-full px-8 py-4 border-b-[1px] flex justify-between items-center" style={{ borderColor: theme.border }}>
        <h1 style={{ ...TYPOGRAPHY.h2, color: isOverloadMode ? theme.error : theme.text_primary }}>
          ER SHIFT COMMANDER
          {isOverloadMode && <span className="ml-4 text-[12px] uppercase tracking-widest animate-pulse">! Cognitive Overload Safety Mode Active</span>}
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-4 py-2 rounded-md border text-[12px] uppercase font-bold"
            style={{ borderColor: theme.border, backgroundColor: theme.background_secondary }}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <main className="p-8 max-w-[1400px] mx-auto">

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard title="Total Waiting" value={patients.length} theme={theme} />
          <KPICard title="Critical Alerts" value={criticalPatients.length} theme={theme} isAlert={criticalPatients.length > 0} />
          <KPICard title="Avg Wait Time" value={`${Math.round(patients.reduce((acc, p) => acc + p.waitTime, 0) / (patients.length || 1))}m`} theme={theme} />
          <KPICard title="Staff Availability" value="82%" theme={theme} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Patient List (Progressive Disclosure) */}
          <div className="flex-[2] overflow-hidden">
            <div className="mb-4 flex justify-between items-center">
              <h3 style={{ ...TYPOGRAPHY.h4 }}>Live Triage Feed</h3>
              <div style={{ ...TYPOGRAPHY.xs, color: theme.text_secondary }}>Showing {patients.slice(0, 15).length} of {patients.length} active cases</div>
            </div>

            <div 
              className="rounded-[12px] border-[1px] overflow-hidden" 
              style={{ backgroundColor: theme.background_primary, borderColor: theme.border }}
            >
              <table className="w-full text-left border-collapse">
                <thead style={{ backgroundColor: theme.background_secondary }}>
                  <tr>
                    <th className="p-4" style={{ ...TYPOGRAPHY.xs, color: theme.kpiTitle, textTransform: 'uppercase' }}>ID</th>
                    <th className="p-4" style={{ ...TYPOGRAPHY.xs, color: theme.kpiTitle, textTransform: 'uppercase' }}>Acuity</th>
                    <th className="p-4" style={{ ...TYPOGRAPHY.xs, color: theme.kpiTitle, textTransform: 'uppercase' }}>Wait Time</th>
                    <th className="p-4" style={{ ...TYPOGRAPHY.xs, color: theme.kpiTitle, textTransform: 'uppercase' }}>Symptom</th>
                    <th className="p-4" style={{ ...TYPOGRAPHY.xs, color: theme.kpiTitle, textTransform: 'uppercase' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.slice(0, 15).map((patient) => {
                    const isCritical = (patient.acuity <= 2) && (patient.waitTime > 15);
                    return (
                      <React.Fragment key={patient.id}>
                        <tr 
                          className="border-b-[1px] hover:bg-opacity-50 transition-colors"
                          style={{ 
                            borderColor: theme.border,
                            backgroundColor: isCritical ? `${theme.error}10` : 'transparent'
                          }}
                        >
                          <td className="p-4" style={{ ...TYPOGRAPHY.mono }}>{patient.id}</td>
                          <td className="p-4">
                            <span 
                              className="px-2 py-1 rounded text-[10px] font-bold uppercase"
                              style={{ 
                                backgroundColor: patient.acuity === 1 ? theme.error : patient.acuity === 2 ? theme.warning : theme.border,
                                color: patient.acuity <= 2 ? '#fff' : theme.text_secondary
                              }}
                            >
                              Lvl {patient.acuity}
                            </span>
                          </td>
                          <td className="p-4" style={{ color: patient.waitTime > 20 ? theme.error : theme.text_primary }}>
                            {patient.waitTime} mins
                          </td>
                          <td className="p-4" style={{ ...TYPOGRAPHY.p }}>{patient.symptom}</td>
                          <td className="p-4">
                            {!isOverloadMode && (
                              <button 
                                onClick={() => setExpandedPatientId(expandedPatientId === patient.id ? null : patient.id)}
                                className="px-3 py-1 rounded-[5px] border-[1px] text-[12px] transition-colors"
                                style={{ 
                                  borderColor: theme.border, 
                                  color: theme.kpiTitle,
                                  backgroundColor: expandedPatientId === patient.id ? theme.background_secondary : 'transparent'
                                }}
                              >
                                {expandedPatientId === patient.id ? "Close" : "View Details"}
                              </button>
                            )}
                          </td>
                        </tr>
                        {/* Nested Sub-panel */}
                        {expandedPatientId === patient.id && (
                          <tr style={{ backgroundColor: theme.background_secondary }}>
                            <td colSpan="5" className="p-6">
                              <div className="grid grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                                <div>
                                  <h6 style={{ ...TYPOGRAPHY.h6, marginBottom: '8px', color: theme.text_secondary }}>Vitals History</h6>
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b" style={{ borderColor: theme.border }}>
                                        <th className="pb-2">Time</th>
                                        <th className="pb-2">HR</th>
                                        <th className="pb-2">BP</th>
                                        <th className="pb-2">Temp</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {patient.vitals.map((v, idx) => (
                                        <tr key={idx} className="border-b" style={{ borderColor: theme.border }}>
                                          <td className="py-2">{v.time}</td>
                                          <td className="py-2">{v.hr}</td>
                                          <td className="py-2">{v.bp}</td>
                                          <td className="py-2">{v.temp}°F</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div>
                                  <h6 style={{ ...TYPOGRAPHY.h6, marginBottom: '8px', color: theme.text_secondary }}>Clinical Context</h6>
                                  <div className="p-3 rounded border" style={{ borderColor: theme.border, backgroundColor: theme.background_primary }}>
                                    <div className="mb-2">
                                      <span style={{ ...TYPOGRAPHY.xs, fontWeight: 'bold' }}>Allergies: </span>
                                      <span style={{ ...TYPOGRAPHY.xs, color: theme.error }}>{patient.allergies}</span>
                                    </div>
                                    <div className="mb-2">
                                      <span style={{ ...TYPOGRAPHY.xs, fontWeight: 'bold' }}>Assigned: </span>
                                      <span style={{ ...TYPOGRAPHY.xs }}>{patient.doctor}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Analytics / Overload View */}
          <div className="flex-1">
            <h3 className="mb-4" style={{ ...TYPOGRAPHY.h4 }}>
              {isOverloadMode ? "PRIORITY QUEUE" : "Patient Acuity Spread"}
            </h3>

            <div 
              className="p-6 rounded-[12px] border-[1px] min-h-[400px]" 
              style={{ backgroundColor: theme.background_primary, borderColor: isOverloadMode ? theme.error : theme.border }}
            >
              {isOverloadMode ? (
                /* Minimalist Overload View */
                <div className="flex flex-col gap-4">
                  <div className="p-4 border-l-4 rounded bg-red-500 bg-opacity-10" style={{ borderLeftColor: theme.error }}>
                    <p style={{ ...TYPOGRAPHY.xs, color: theme.error, fontWeight: 'bold' }}>SYSTEM OVERLOAD: {criticalPatients.length} CRITICAL ALERTS</p>
                  </div>
                  {criticalPatients.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 border-b" style={{ borderColor: theme.border }}>
                      <div>
                        <span style={{ ...TYPOGRAPHY.mono, fontWeight: 'bold' }}>{p.id}</span>
                        <p style={{ ...TYPOGRAPHY.xs, color: theme.text_secondary }}>{p.symptom}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ ...TYPOGRAPHY.xs, color: theme.error }}>{p.waitTime}m Delay</p>
                        <p style={{ ...TYPOGRAPHY.xs, fontWeight: 'bold' }}>ACUITY {p.acuity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Standard Analytic View */
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={acuityDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                    <XAxis 
                      dataKey="acuity" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: theme.text_secondary, fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: theme.text_secondary, fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: theme.background_secondary }}
                      contentStyle={{ 
                        backgroundColor: theme.background_primary, 
                        borderColor: theme.border,
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                      {acuityDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index < 2 ? theme.error : theme.chart[index % theme.chart.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {!isOverloadMode && (
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: theme.background_secondary }}>
                <p style={{ ...TYPOGRAPHY.xs, color: theme.text_secondary }}>
                  System Health: Stable. Critical Alerts threshold set to 10. Dashboard will automatically collapse on overload.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer System Status */}
      <footer className="fixed bottom-0 w-full px-8 py-2 border-t flex justify-between items-center" style={{ backgroundColor: theme.background_primary, borderColor: theme.border }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isOverloadMode ? theme.error : theme.success }}></div>
          <span style={{ ...TYPOGRAPHY.xs, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {isOverloadMode ? "Emergency Override Active" : "Operational Status: Normal"}
          </span>
        </div>
        <div style={{ ...TYPOGRAPHY.xs, color: theme.text_secondary }}>
          Server Time: {new Date().toLocaleTimeString()} | Instance: ER-NORTH-04
        </div>
      </footer>
    </div>
  );
}