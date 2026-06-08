import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertCircle, 
  Activity, 
  Clock, 
  User, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Stethoscope, 
  Thermometer, 
  Droplet 
} from 'lucide-react';
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
 * Hospital ER Shift Commander
 * A high-performance dashboard for emergency department triage and patient management.
 */
export default function HospitalERShiftCommander() {
  const [patients, setPatients] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Generate Mock Data (200 rows)
  useEffect(() => {
    const symptoms = ["Chest Pain", "Shortness of Breath", "Laceration", "High Fever", "Abdominal Pain", "Head Trauma", "Possible Fracture", "Allergic Reaction", "Dizziness"];
    const doctors = ["Dr. Aris", "Dr. Vance", "Dr. Sterling", "Dr. Cho", "Dr. Morales"];
    const allergiesList = ["Penicillin", "Latex", "Sulfa", "Peanuts", "Aspirin", "None"];

    const mockPatients = Array.from({ length: 200 }, (_, i) => {
      const acuity = Math.floor(Math.random() * 5) + 1;
      const waitTime = Math.floor(Math.random() * 60);
      return {
        id: `ER-${1000 + i}`,
        acuity,
        symptom: symptoms[Math.floor(Math.random() * symptoms.length)],
        waitTime,
        doctor: doctors[Math.floor(Math.random() * doctors.length)],
        vitals: {
          temp: (97 + Math.random() * 6).toFixed(1),
          hr: Math.floor(60 + Math.random() * 60),
          bp: `${Math.floor(110 + Math.random() * 40)}/${Math.floor(70 + Math.random() * 30)}`,
          spo2: Math.floor(88 + Math.random() * 12)
        },
        allergies: [allergiesList[Math.floor(Math.random() * allergiesList.length)]],
        isCritical: (acuity <= 2 && waitTime > 15)
      };
    });
    setPatients(mockPatients);
  }, []);

  // 2. Cognitive Overload Safety Mode Logic
  const criticalAlerts = useMemo(() => patients.filter(p => p.isCritical), [patients]);
  const isSafetyMode = criticalAlerts.length > 10;

  useEffect(() => {
    if (isSafetyMode) {
      setExpandedId(null);
    }
  }, [isSafetyMode]);

  // 3. Analytics Data
  const chartData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    patients.forEach(p => counts[p.acuity - 1]++);
    return counts.map((count, i) => ({ acuity: `Level ${i + 1}`, count }));
  }, [patients]);

  const ACUITY_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  // 4. Filtering Logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.symptom.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'critical') return p.isCritical && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className={`min-h-screen p-6 transition-colors duration-500 ${isSafetyMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* HEADER SECTION */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldAlert className={isSafetyMode ? "text-red-500 animate-pulse" : "text-blue-600"} size={32} />
            ER Shift Commander
          </h1>
          <p className={isSafetyMode ? "text-red-400 font-medium" : "text-slate-500"}>
            {isSafetyMode ? "CRITICAL OVERLOAD: SAFETY MODE ACTIVE" : "System Status: Nominal"}
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className={`flex-1 md:w-64 p-4 rounded-xl shadow-sm border ${isSafetyMode ? 'bg-red-950 border-red-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium opacity-70">Critical Red Flags</span>
              <AlertCircle className="text-red-500" size={20} />
            </div>
            <div className="text-2xl font-bold">{criticalAlerts.length}</div>
          </div>
          <div className={`flex-1 md:w-64 p-4 rounded-xl shadow-sm border ${isSafetyMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium opacity-70">Total Waiting</span>
              <Clock className="text-blue-500" size={20} />
            </div>
            <div className="text-2xl font-bold">{patients.length}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* CHARTS & ANALYTICS */}
        <div className={`lg:col-span-4 space-y-6 ${isSafetyMode ? 'hidden lg:block' : ''}`}>
          <div className={`p-6 rounded-2xl shadow-sm border ${isSafetyMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} /> Triage Distribution
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isSafetyMode ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="acuity" stroke={isSafetyMode ? '#94a3b8' : '#64748b'} />
                  <YAxis stroke={isSafetyMode ? '#94a3b8' : '#64748b'} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ACUITY_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border ${isSafetyMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className="text-lg font-semibold mb-2">Cognitive Load Strategy</h3>
            <p className="text-sm opacity-70">
              {isSafetyMode 
                ? "Automatic simplification enabled to reduce decision fatigue. Focusing on high-acuity throughput." 
                : "Active progressive disclosure allows for clinical deep-dives."}
            </p>
          </div>
        </div>

        {/* PATIENT LISTING */}
        <div className={`${isSafetyMode ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-4`}>
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-lg w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-60'}`}
              >
                All Patients
              </button>
              <button 
                onClick={() => setActiveTab('critical')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'critical' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-60'}`}
              >
                Critical Flags
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Search ID or symptom..."
              className={`w-full sm:w-64 px-4 py-2 rounded-lg border focus:ring-2 outline-none ${isSafetyMode ? 'bg-slate-800 border-slate-700 focus:ring-red-500' : 'bg-white border-slate-200 focus:ring-blue-500'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={`rounded-2xl overflow-hidden border shadow-sm ${isSafetyMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <table className="w-full text-left border-collapse">
              <thead className={`text-xs uppercase tracking-wider ${isSafetyMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <tr>
                  <th className="px-6 py-4 font-semibold">Acuity</th>
                  <th className="px-6 py-4 font-semibold">Patient ID</th>
                  <th className="px-6 py-4 font-semibold">Symptom</th>
                  <th className="px-6 py-4 font-semibold">Wait Time</th>
                  <th className="px-6 py-4 font-semibold">Doctor</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredPatients.map((patient) => (
                  <React.Fragment key={patient.id}>
                    <tr className={`group transition-colors ${patient.isCritical ? 'bg-red-500/5' : ''} ${isSafetyMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white`} style={{ backgroundColor: ACUITY_COLORS[patient.acuity - 1] }}>
                          Level {patient.acuity}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">{patient.id}</td>
                      <td className="px-6 py-4">{patient.symptom}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={patient.waitTime > 30 ? 'text-red-500 font-bold' : ''}>{patient.waitTime}m</span>
                          {patient.waitTime > 30 && <Clock size={14} className="text-red-500 animate-pulse" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
                            <User size={12} />
                          </div>
                          <span className="text-sm">{patient.doctor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isSafetyMode ? (
                          <button 
                            onClick={() => setExpandedId(expandedId === patient.id ? null : patient.id)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                          >
                            {expandedId === patient.id ? 'Close' : 'View Details'}
                            {expandedId === patient.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-red-500">PRIORITY</span>
                        )}
                      </td>
                    </tr>

                    {/* PROGRESSIVE DISCLOSURE PANEL */}
                    {expandedId === patient.id && !isSafetyMode && (
                      <tr>
                        <td colSpan="6" className="px-6 py-0 border-none">
                          <div className="py-6 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl my-2 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
                            <div>
                              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-1">
                                <Activity size={12} /> Current Vitals
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="flex items-center gap-2 opacity-70"><Thermometer size={14}/> Temp</span>
                                  <span className="font-semibold">{patient.vitals.temp}°F</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="flex items-center gap-2 opacity-70"><Droplet size={14}/> Heart Rate</span>
                                  <span className="font-semibold">{patient.vitals.hr} BPM</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="flex items-center gap-2 opacity-70"><Activity size={14}/> BP</span>
                                  <span className="font-semibold">{patient.vitals.bp}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="flex items-center gap-2 opacity-70"><Stethoscope size={14}/> SpO2</span>
                                  <span className={`font-semibold ${patient.vitals.spo2 < 92 ? 'text-red-500' : ''}`}>{patient.vitals.spo2}%</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Medical Alerts</h4>
                              <div className="flex flex-wrap gap-2">
                                {patient.allergies.map((allergy, idx) => (
                                  <span key={idx} className="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800">
                                    ALLERGY: {allergy}
                                  </span>
                                ))}
                                {patient.acuity <= 2 && (
                                  <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
                                    FAST TRACK REQUIRED
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Triage Notes</h4>
                                <p className="text-sm opacity-80 italic">"Patient presenting with acute {patient.symptom.toLowerCase()}. Onset noted approximately {Math.floor(patient.waitTime * 1.5)} minutes prior to arrival. Monitoring required."</p>
                              </div>
                              <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors">
                                Update Patient Status
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {filteredPatients.length === 0 && (
              <div className="py-20 text-center opacity-50">
                <ShieldAlert className="mx-auto mb-2" size={48} />
                <p>No triage records found matching the criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER STATUS BAR */}
      <footer className={`mt-8 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest transition-colors ${isSafetyMode ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
        <div className="flex items-center gap-4">
          <span>Station: 04-B</span>
          <span>Shift: Night (22:00 - 06:00)</span>
          <span>Lead: S. Vance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isSafetyMode ? 'bg-white' : 'bg-green-500'}`} />
          <span>Live Data Stream Active</span>
        </div>
      </footer>
    </div>
  );
}