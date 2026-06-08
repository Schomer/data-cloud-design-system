import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, 
  ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

/**
 * SantaCruzTreeMonitor
 * Expert-level dashboard for Santa Cruz Urban Forestry.
 * Features health stats, mapping, and carbon sequestration modeling.
 */

// Configuration Constants
const SPECIES_METRICS = {
  'Coast Redwood': { color: '#064e3b', growthRate: 2.5, carbonFactor: 0.8 },
  'Coast Live Oak': { color: '#166534', growthRate: 1.2, carbonFactor: 1.2 },
  'Douglas Fir': { color: '#15803d', growthRate: 1.8, carbonFactor: 0.9 },
  'Monterey Cypress': { color: '#14532d', growthRate: 1.5, carbonFactor: 1.1 },
  'Western Sycamore': { color: '#16a34a', growthRate: 2.1, carbonFactor: 0.7 }
};

const SPECIES = Object.keys(SPECIES_METRICS);
const STATUSES = ['Healthy', 'Fair', 'Poor', 'Dead'];
const STATUS_COLORS = ['#10b981', '#fbbf24', '#f97316', '#ef4444'];
const SC_COORDS = { lat: 36.9741, lng: -122.0308 };

// Compact Mock Data Generation
const mockTrees = Array.from({ length: 50 }, (_, i) => {
  const species = SPECIES[i % 5];
  const size = Math.floor(Math.random() * 55) + 12;
  const age = Math.floor(Math.random() * 120) + 10;
  return {
    id: i + 1,
    species,
    size,
    age,
    status: STATUSES[i % 4],
    lat: SC_COORDS.lat + (Math.random() * 0.03 - 0.015),
    lng: SC_COORDS.lng + (Math.random() * 0.03 - 0.015),
    carbon: (size * SPECIES_METRICS[species].carbonFactor * 1.5).toFixed(2)
  };
});

export default function SantaCruzTreeMonitor() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectionYears, setProjectionYears] = useState(0);

  // Logic: Filtering & Calculations
  const filteredData = useMemo(() => 
    statusFilter === 'All' ? mockTrees : mockTrees.filter(t => t.status === statusFilter),
    [statusFilter]
  );

  const healthStats = useMemo(() => 
    STATUSES.map((s, i) => ({
      name: s,
      value: mockTrees.filter(t => t.status === s).length,
      color: STATUS_COLORS[i]
    })), []);

  const projectedCanopy = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => ({
      year: 2024 + i,
      area: mockTrees.reduce((acc, t) => {
        const growth = SPECIES_METRICS[t.species].growthRate * i;
        return acc + (Math.PI * Math.pow((t.size + growth) / 24, 2));
      }, 0).toFixed(0)
    }));
  }, []);

  // Styles
  const containerStyle = { padding: '24px', background: '#f1f5f9', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' };
  const cardStyle = { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '20px' };
  const navButtonStyle = (id) => ({
    padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600',
    background: activeTab === id ? '#065f46' : '#e2e8f0', color: activeTab === id ? 'white' : '#475569', transition: 'all 0.2s'
  });

  return (
    <div style={containerStyle}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#065f46', fontSize: '28px' }}>Santa Cruz Urban Forest</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b' }}>Precision Inventory & Sequestration Modeler</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['dashboard', 'map', 'inventory'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={navButtonStyle(tab)}>{tab.toUpperCase()}</button>
          ))}
        </div>
      </header>

      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px' }}>Health & Sequestration Distribution</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={healthStats} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {healthStats.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px' }}>10-Year Canopy Growth Projection (Sq Ft)</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectedCanopy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="area" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'map' && (
        <div style={{ ...cardStyle, height: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Spatial Infrastructure Correlation</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', ...STATUSES].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding: '4px 10px', borderRadius: '15px', border: '1px solid #cbd5e1', cursor: 'pointer',
                  background: statusFilter === s ? '#065f46' : 'white', color: statusFilter === s ? 'white' : '#475569', fontSize: '12px'
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ height: '500px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis type="number" dataKey="lng" name="Long" domain={['auto', 'auto']} hide />
                <YAxis type="number" dataKey="lat" name="Lat" domain={['auto', 'auto']} hide />
                <ZAxis type="number" dataKey="size" range={[50, 500]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={filteredData}>
                  {filteredData.map((e, i) => (
                    <Cell key={i} fill={STATUS_COLORS[STATUSES.indexOf(e.status)]} fillOpacity={0.6} stroke="#fff" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                {['ID', 'Species', 'Age', 'Health', 'CO2 Seq (kg/yr)'].map(h => (
                  <th key={h} style={{ padding: '16px', textAlign: 'left', color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((t, idx) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fcfcfc' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>#{t.id}</td>
                  <td style={{ padding: '12px 16px' }}>{t.species}</td>
                  <td style={{ padding: '12px 16px' }}>{t.age}y</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold',
                      background: STATUS_COLORS[STATUSES.indexOf(t.status)] + '20',
                      color: STATUS_COLORS[STATUSES.indexOf(t.status)]
                    }}>{t.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#059669', fontWeight: '600' }}>{t.carbon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}