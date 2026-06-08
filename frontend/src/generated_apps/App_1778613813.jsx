import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Menu, Activity, Battery, Weight, Navigation, AlertTriangle, Send } from 'lucide-react';

/**
 * AutonomousDeliveryFleetHub
 * A real-time monitoring application for autonomous drone delivery operations.
 * Implements a light theme based on the visual_spec skill.
 */
export default function AutonomousDeliveryFleetHub() {
  // Theme configuration from visual_spec (Light Mode)
  const theme = {
    background_primary: "#ffffff",
    background_secondary: "#e2e8f0",
    text_primary: "#5c5c5c",
    text_secondary: "#475569",
    border: "#e2e8f0",
    accent: "#598dc5",
    destructive: "#d18585",
    typography: {
      h2: { fontSize: "30px", fontWeight: "600", color: "#5c5c5c" },
      h4: { fontSize: "20px", fontWeight: "600", color: "#5c5c5c" },
      p: { fontSize: "14px", fontWeight: "400", color: "#475569" },
      small: { fontSize: "12px", fontWeight: "400", color: "#64748b" },
      mono: { fontSize: "14px", fontWeight: "400", color: "#1e293b", fontFamily: "monospace" },
    }
  };

  // --- STATE ---
  const [drones, setDrones] = useState([]);
  const [command, setCommand] = useState("");
  const [isRecallActive, setIsRecallActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- MOCK DATA GENERATION ---
  useEffect(() => {
    const destinations = ["Downtown Hub A", "Westside Landing 4", "East Port 2", "North Skyway", "South Depot", "Central Park 12", "Industrial District 8"];
    const initialDrones = Array.from({ length: 200 }, (_, i) => ({
      id: `DRN-${1000 + i}`,
      battery: Math.floor(Math.random() * 95) + 5, // 5% to 100%
      payload: (Math.random() * 8 + 0.5).toFixed(2), // 0.5kg to 8.5kg
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      exception: Math.random() > 0.85, // 15% chance of route exception
      slaSeconds: Math.floor(Math.random() * 2400) + 300, // 5 mins to 45 mins
    }));
    setDrones(initialDrones);
  }, []);

  // --- REAL-TIME SLA TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setDrones((prevDrones) =>
        prevDrones.map((drone) => ({
          ...drone,
          slaSeconds: drone.slaSeconds > 0 ? drone.slaSeconds - 1 : 0,
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- COMMAND LOGIC ---
  const handleCommandChange = (e) => {
    const val = e.target.value;
    setCommand(val);

    // Exact requirement: "Recall low battery vehicles" triggers filter
    if (val.toLowerCase().trim() === "recall low battery vehicles") {
      setIsRecallActive(true);
    } else if (val === "") {
      setIsRecallActive(false);
    }
  };

  const filteredDrones = useMemo(() => {
    if (isRecallActive) {
      return drones.filter(d => d.battery < 20);
    }
    return drones;
  }, [drones, isRecallActive]);

  // --- FORMATTERS ---
  const formatSLA = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div style={{ 
      backgroundColor: theme.background_primary, 
      minHeight: '100vh', 
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* --- TOP HEADER --- */}
      <header style={{ 
        height: '64px', 
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        justifyContent: 'space-between',
        zIndex: 50,
        backgroundColor: theme.background_primary
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <Menu size={20} color={theme.text_primary} />
          </button>
          <h1 style={{ ...theme.typography.h2, margin: 0, fontSize: '24px' }}>Autonomous Delivery Fleet Hub</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color={theme.accent} />
          <span style={{ ...theme.typography.small, color: theme.accent, fontWeight: '600' }}>LIVE TELEMETRY ACTIVE</span>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* --- SIDEBAR (UNDER HEADER) --- */}
        {isSidebarOpen && (
          <aside style={{
            width: '280px',
            borderRight: `1px solid ${theme.border}`,
            backgroundColor: theme.background_primary,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div>
              <h6 style={{ ...theme.typography.small, color: theme.text_secondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: '600' }}>Command Center</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ ...theme.typography.small, color: theme.text_secondary }}>Command Prompt</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    value={command}
                    onChange={handleCommandChange}
                    placeholder="Enter command..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${isRecallActive ? theme.accent : theme.border}`,
                      backgroundColor: theme.background_primary,
                      fontSize: '14px',
                      color: theme.text_primary,
                      outline: 'none'
                    }}
                  />
                  <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
                    <Send size={16} color={isRecallActive ? theme.accent : theme.text_secondary} />
                  </div>
                </div>
                <p style={{ ...theme.typography.small, fontStyle: 'italic', marginTop: '4px' }}>
                  Try: "Recall low battery vehicles"
                </p>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: theme.background_secondary }}>
              <h5 style={{ ...theme.typography.h4, fontSize: '16px', marginBottom: '8px' }}>System Health</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={theme.typography.small}>Total Fleet</span>
                <span style={{ ...theme.typography.small, fontWeight: '700' }}>200</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={theme.typography.small}>Exceptions</span>
                <span style={{ ...theme.typography.small, fontWeight: '700', color: theme.destructive }}>{drones.filter(d => d.exception).length}</span>
              </div>
            </div>
          </aside>
        )}

        {/* --- MAIN CANVAS --- */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: '#fcfcfc' }}>

          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={theme.typography.h2}>Fleet Telemetry</h2>
              <p style={theme.typography.p}>Real-time monitoring of all active autonomous units in the field.</p>
            </div>
            {isRecallActive && (
              <div className="animate-pulse" style={{ 
                padding: '8px 16px', 
                backgroundColor: '#fee2e2', 
                border: '1px solid #ef4444', 
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} color="#ef4444" />
                <span style={{ ...theme.typography.small, color: '#b91c1c', fontWeight: '700' }}>RECALL MODE ACTIVE</span>
              </div>
            )}
          </div>

          {/* --- TELEMETRY GRID (DATA TABLE) --- */}
          <div style={{ 
            backgroundColor: theme.background_primary,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${theme.border}`, backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '16px', ...theme.typography.small, color: '#457bba', fontWeight: '600' }}>DRONE ID</th>
                  <th style={{ padding: '16px', ...theme.typography.small, color: '#457bba', fontWeight: '600' }}>BATTERY %</th>
                  <th style={{ padding: '16px', ...theme.typography.small, color: '#457bba', fontWeight: '600' }}>PAYLOAD</th>
                  <th style={{ padding: '16px', ...theme.typography.small, color: '#457bba', fontWeight: '600' }}>DESTINATION</th>
                  <th style={{ padding: '16px', ...theme.typography.small, color: '#457bba', fontWeight: '600' }}>SLA COUNTDOWN</th>
                  <th style={{ padding: '16px', ...theme.typography.small, color: '#457bba', fontWeight: '600' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrones.map((drone) => {
                  const isLowBattery = drone.battery < 20;
                  const rowWarning = isRecallActive && isLowBattery;

                  return (
                    <tr 
                      key={drone.id} 
                      className={rowWarning ? "animate-pulse" : ""}
                      style={{ 
                        borderBottom: `1px solid ${theme.border}`,
                        backgroundColor: rowWarning ? '#fff1f2' : theme.background_primary,
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      <td style={{ padding: '16px', ...theme.typography.mono, color: theme.text_primary }}>
                        {drone.id}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '8px', 
                            backgroundColor: '#e2e8f0', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${drone.battery}%`, 
                              height: '100%', 
                              backgroundColor: drone.battery < 20 ? '#ef4444' : drone.battery < 50 ? '#f59e0b' : '#10b981'
                            }} />
                          </div>
                          <span style={{ ...theme.typography.small, fontWeight: '600', color: drone.battery < 20 ? '#ef4444' : theme.text_primary }}>
                            {drone.battery}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', ...theme.typography.p }}>
                        {drone.payload} kg
                      </td>
                      <td style={{ padding: '16px', ...theme.typography.p }}>
                        {drone.destination}
                      </td>
                      <td style={{ padding: '16px', ...theme.typography.mono, color: drone.slaSeconds < 300 ? '#ef4444' : theme.accent, fontWeight: '600' }}>
                        {formatSLA(drone.slaSeconds)}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {drone.exception ? (
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            backgroundColor: '#fff1f2', 
                            color: '#e11d48', 
                            fontSize: '11px', 
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            width: 'fit-content'
                          }}>
                            <AlertTriangle size={12} /> EXCEPTION
                          </span>
                        ) : (
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            backgroundColor: '#ecfdf5', 
                            color: '#059669', 
                            fontSize: '11px', 
                            fontWeight: '700',
                            width: 'fit-content'
                          }}>
                            NOMINAL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredDrones.length === 0 && (
              <div style={{ padding: '64px', textAlign: 'center' }}>
                <p style={theme.typography.muted}>No vehicles found matching the current command criteria.</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, padding: '20px', backgroundColor: theme.background_primary, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
              <h6 style={theme.typography.small}>Fleet Utilization</h6>
              <div style={{ ...theme.typography.h2, fontSize: '24px', marginTop: '4px' }}>84.2%</div>
            </div>
            <div style={{ flex: 1, padding: '20px', backgroundColor: theme.background_primary, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
              <h6 style={theme.typography.small}>Pending Deliveries</h6>
              <div style={{ ...theme.typography.h2, fontSize: '24px', marginTop: '4px' }}>142</div>
            </div>
            <div style={{ flex: 1, padding: '20px', backgroundColor: theme.background_primary, border: `1px solid ${theme.border}`, borderRadius: '12px' }}>
              <h6 style={theme.typography.small}>Avg Flight Time</h6>
              <div style={{ ...theme.typography.h2, fontSize: '24px', marginTop: '4px' }}>18m 12s</div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes pulse-red {
          0%, 100% { background-color: #fff1f2; }
          50% { background-color: #fecdd3; }
        }
        .animate-pulse {
          animation: pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}