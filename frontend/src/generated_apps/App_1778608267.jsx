import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  Cell as BarCell
} from 'recharts';
import { 
  CloudRain, 
  Sun, 
  Snowflake, 
  Menu, 
  AlertTriangle, 
  Trash2, 
  TrendingDown, 
  Package, 
  ChevronDown 
} from 'lucide-react';

/**
 * FOOD TRUCK SMART INVENTORY APP
 * 
 * Features:
 * - Ingredient Tracking (Name, Stock, Spoilage)
 * - Weather-based Sales Projections (-30% during Rain)
 * - Conditional Waste Risk Flagging (Cilantro/Rain logic)
 * - Interactive 'Log Usage' functionality with immediate Gauge updates
 */

export default function TacoTruckInventory() {
  // --- STATE ---
  const [weather, setWeather] = useState('Sunny');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Cilantro', stock: 12, spoilageRate: 0.85, maxStock: 20, isHighSpoilage: true },
    { id: 2, name: 'Asada Carnitas', stock: 45, spoilageRate: 0.20, maxStock: 60, isHighSpoilage: false },
    { id: 3, name: 'Corn Tortillas', stock: 80, spoilageRate: 0.05, maxStock: 100, isHighSpoilage: false },
    { id: 4, name: 'Pico de Gallo', stock: 15, spoilageRate: 0.70, maxStock: 25, isHighSpoilage: true },
    { id: 5, name: 'Chihuahua Cheese', stock: 30, spoilageRate: 0.15, maxStock: 40, isHighSpoilage: false },
    { id: 6, name: 'Limes', stock: 18, spoilageRate: 0.30, maxStock: 30, isHighSpoilage: false },
    { id: 7, name: 'Avocado Salsa', stock: 8, spoilageRate: 0.90, maxStock: 15, isHighSpoilage: true },
    { id: 8, name: 'Radishes', stock: 5, spoilageRate: 0.40, maxStock: 10, isHighSpoilage: false },
  ]);

  // --- BUSINESS LOGIC ---
  const weatherEffects = useMemo(() => {
    let salesModifier = 1.0;
    if (weather === 'Rainy') salesModifier = 0.7;
    if (weather === 'Freezing') salesModifier = 0.5;

    const projectedSales = 1250 * salesModifier;
    const wasteRiskItems = ingredients.filter(i => 
      (weather === 'Rainy' && i.isHighSpoilage) || i.stock > i.maxStock * 0.9
    ).length;

    return { projectedSales, wasteRiskItems };
  }, [weather, ingredients]);

  const handleLogUsage = (id) => {
    setIngredients(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, stock: Math.max(0, item.stock - 5) };
      }
      return item;
    }));
  };

  // --- RENDER HELPERS ---
  const getWeatherIcon = () => {
    switch (weather) {
      case 'Sunny': return <Sun size={20} className="text-[#f59e0b]" />;
      case 'Rainy': return <CloudRain size={20} className="text-[#62a8ea]" />;
      case 'Freezing': return <Snowflake size={20} className="text-[#40bdd4]" />;
      default: return <Sun size={20} />;
    }
  };

  // --- THEME TOKENS (Visual Spec) ---
  const theme = {
    bgPrimary: '#1a1a1a',
    bgSecondary: '#1e293b',
    textPrimary: '#dbdbdb',
    textSecondary: '#cbd5e1',
    border: '#1e293b',
    accent: '#3b82f6',
    error: '#ef4444',
    success: '#10b981',
    chartPalette: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"]
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter',_sans-serif]" style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary }}>

      {/* HEADER SECTION */}
      <header className="h-[64px] border-b flex items-center justify-between px-6 sticky top-0 z-50 bg-[#1a1a1a]" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#1e293b] rounded-md transition-colors"
          >
            <Menu size={24} color={theme.textPrimary} />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: theme.textPrimary }}>Taco Truck Inventory</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2 rounded-lg border bg-[#121212]" style={{ borderColor: theme.border }}>
              {getWeatherIcon()}
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Forecast: {weather}</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border rounded-xl overflow-hidden shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]" style={{ borderColor: theme.border }}>
              {['Sunny', 'Rainy', 'Freezing'].map(w => (
                <button 
                  key={w}
                  onClick={() => setWeather(w)}
                  className="w-full px-4 py-3 text-left hover:bg-[#1e293b] transition-colors flex items-center gap-3"
                  style={{ fontSize: '14px' }}
                >
                  {w === 'Sunny' && <Sun size={16} color="#f59e0b" />}
                  {w === 'Rainy' && <CloudRain size={16} color="#62a8ea" />}
                  {w === 'Freezing' && <Snowflake size={16} color="#40bdd4" />}
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR - Under Header */}
        <aside 
          className={`w-[280px] border-r transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} absolute md:relative z-40 bg-[#1a1a1a] h-full`}
          style={{ borderColor: theme.border }}
        >
          <div className="p-6">
            <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Operations Dashboard</h6>
            <nav className="space-y-2">
              <div className="px-4 py-3 rounded-lg bg-[#1e293b] text-[#60a5fa] flex items-center gap-3 cursor-pointer">
                <Package size={18} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Inventory Monitor</span>
              </div>
              <div className="px-4 py-3 rounded-lg hover:bg-[#1e293b] text-[#94a3b8] flex items-center gap-3 cursor-pointer transition-colors">
                <TrendingDown size={18} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Sales Forecast</span>
              </div>
              <div className="px-4 py-3 rounded-lg hover:bg-[#1e293b] text-[#94a3b8] flex items-center gap-3 cursor-pointer transition-colors">
                <AlertTriangle size={18} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Spoilage Alerts</span>
              </div>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#1a1a1a]">

          {/* KPI ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KPICard title="Total Inventory Stock" value={`${ingredients.reduce((a,b) => a + b.stock, 0).toFixed(0)} lbs`} subtitle="Across all categories" />
            <KPICard 
              title="Projected Daily Sales" 
              value={`$${weatherEffects.projectedSales.toFixed(0)}`} 
              subtitle={weather === 'Rainy' ? "-30% Weather Impact" : "Optimal Conditions"}
              trend={weather === 'Sunny' ? "positive" : "negative"}
            />
            <KPICard 
              title="High Waste Risk Items" 
              value={weatherEffects.wasteRiskItems} 
              subtitle="Requires immediate use" 
              variant={weatherEffects.wasteRiskItems > 2 ? "warning" : "default"}
            />
            <KPICard title="Truck Readiness" value="94%" subtitle="Fuel, Gas & Water Checked" trend="positive" />
          </div>

          {/* WARNING BANNER FOR RAIN */}
          {weather === 'Rainy' && (
            <div className="mb-8 p-4 rounded-xl border border-[#9f1239] bg-[#881337] flex items-center gap-4">
              <AlertTriangle className="text-[#fda4af]" size={24} />
              <div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#fda4af' }}>Inclement Weather Protocol Active</p>
                <p style={{ fontSize: '14px', color: '#fb7185' }}>Sales projections reduced. Perishable items like Cilantro are flagged as High Risk.</p>
              </div>
            </div>
          )}

          {/* INVENTORY GRID */}
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontSize: '30px', fontWeight: '600', color: theme.textPrimary }}>Ingredient Stock Level</h2>
            <div className="flex gap-2">
               <button className="px-4 py-2 rounded-lg bg-[#292929] border border-[#1e293b] text-[#a0a7b0] hover:bg-[#122940] transition-all" style={{ fontSize: '14px' }}>Filter: All</button>
               <button className="px-4 py-2 rounded-lg bg-[#292929] border border-[#1e293b] text-[#a0a7b0] hover:bg-[#122940] transition-all" style={{ fontSize: '14px' }}>Sort: Stock</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ingredients.map((item) => (
              <InventoryCard 
                key={item.id} 
                item={item} 
                weather={weather} 
                onLogUsage={() => handleLogUsage(item.id)} 
                theme={theme}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function KPICard({ title, value, subtitle, trend, variant = 'default' }) {
  const isNegative = trend === 'negative';
  const isWarning = variant === 'warning';

  return (
    <div className="bg-[#1a1a1a] border rounded-xl p-5" style={{ borderColor: '#1e293b' }}>
      <p style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8', marginBottom: '8px' }}>{title}</p>
      <div className="flex items-end gap-2 mb-2">
        <h2 style={{ fontSize: '30px', fontWeight: '600', color: isWarning ? '#fbbf24' : '#3b82f6' }}>{value}</h2>
        {trend && (
          <span className={`text-xs mb-2 flex items-center ${isNegative ? 'text-[#fb7185]' : 'text-[#34d399]'}`}>
            {isNegative ? '▼ 4%' : '▲ 12%'}
          </span>
        )}
      </div>
      <p style={{ fontSize: '12px', color: '#64748b' }}>{subtitle}</p>
    </div>
  );
}

function InventoryCard({ item, weather, onLogUsage, theme }) {
  const isRisk = (weather === 'Rainy' && item.isHighSpoilage);
  const stockPercentage = (item.stock / item.maxStock) * 100;

  // Recharts Gauge Data
  const data = [
    { value: item.stock },
    { value: item.maxStock - item.stock }
  ];

  return (
    <div 
      className={`bg-[#1a1a1a] border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center ${isRisk ? 'border-[#9f1239] shadow-[0_0_15px_rgba(159,18,57,0.3)]' : 'border-[#1e293b]'}`}
    >
      <div className="w-full flex justify-between items-start mb-2">
        <div className="p-2 bg-[#1e293b] rounded-lg">
          <Package size={18} className="text-[#3b82f6]" />
        </div>
        {isRisk && (
          <div className="px-2 py-1 bg-[#881337] rounded flex items-center gap-1">
             <AlertTriangle size={12} className="text-[#fda4af]" />
             <span className="text-[10px] uppercase font-bold text-[#fda4af]">High Risk</span>
          </div>
        )}
      </div>

      <h4 className="mb-1" style={{ fontSize: '20px', fontWeight: '500', color: theme.textPrimary }}>{item.name}</h4>
      <p className="mb-4" style={{ fontSize: '12px', color: theme.textSecondary }}>Daily Spoilage: {(item.spoilageRate * 100).toFixed(0)}%</p>

      {/* GAUGE CHART */}
      <div className="w-full h-[120px] relative mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={45}
              outerRadius={65}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={stockPercentage < 20 ? '#ef4444' : '#10b981'} />
              <Cell fill="#262626" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span style={{ fontSize: '20px', fontWeight: '700' }}>{item.stock}</span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>lbs / {item.maxStock}</span>
        </div>
      </div>

      <button 
        onClick={onLogUsage}
        className="w-full py-3 rounded-lg flex items-center justify-center gap-2 group transition-all"
        style={{ 
          backgroundColor: '#5aa1d8', 
          color: '#000000',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Log 5 lbs Used
      </button>

      {stockPercentage < 15 && (
        <p className="mt-4 text-[#fb7185] animate-pulse" style={{ fontSize: '11px', fontWeight: '600' }}>CRITICAL LOW STOCK</p>
      )}
    </div>
  );
}