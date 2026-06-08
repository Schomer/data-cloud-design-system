import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

/**
 * FoodTruckInventoryManager
 * A specialized React dashboard for a taco truck fleet.
 * Includes interactive inventory cards, weather-dependent logic, 
 * and robust mock data generation.
 */
export default function FoodTruckInventoryManager() {
  // --- STATE ---
  const [weather, setWeather] = useState('Sunny');
  const [activeTab, setActiveTab] = useState('Inventory');
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // --- MOCK DATA GENERATION ---
  useEffect(() => {
    const baseIngredients = [
      { name: 'Cilantro', spoilage: 0.25, max: 20, type: 'Produce' },
      { name: 'Al Pastor (Pork)', spoilage: 0.05, max: 100, type: 'Protein' },
      { name: 'Carne Asada (Beef)', spoilage: 0.05, max: 120, type: 'Protein' },
      { name: 'Corn Tortillas', spoilage: 0.08, max: 50, type: 'Bakery' },
      { name: 'Flour Tortillas', spoilage: 0.08, max: 50, type: 'Bakery' },
      { name: 'White Onion', spoilage: 0.12, max: 40, type: 'Produce' },
      { name: 'Lime Wedges', spoilage: 0.15, max: 30, type: 'Produce' },
      { name: 'Radishes', spoilage: 0.18, max: 15, type: 'Produce' },
      { name: 'Salsa Roja', spoilage: 0.10, max: 40, type: 'Condiment' },
      { name: 'Salsa Verde', spoilage: 0.10, max: 40, type: 'Condiment' },
      { name: 'Cotija Cheese', spoilage: 0.04, max: 25, type: 'Dairy' },
      { name: 'Crema Mexicana', spoilage: 0.07, max: 20, type: 'Dairy' },
    ];

    // Generate 200 items by simulating variants/bulk units
    const fullInventory = Array.from({ length: 200 }, (_, i) => {
      const template = baseIngredients[i % baseIngredients.length];
      return {
        id: i,
        name: `${template.name} (Batch ${Math.floor(i / baseIngredients.length) + 1})`,
        stock: Math.floor(Math.random() * (template.max - 10) + 10),
        maxStock: template.max,
        spoilageRate: template.spoilage,
        category: template.type,
        lastUpdated: new Date().toLocaleTimeString()
      };
    });

    setInventory(fullInventory);
  }, []);

  // --- LOGIC & DERIVED DATA ---

  // Sales Projection Chart Data (15+ points)
  const salesData = useMemo(() => {
    let baseSales = [
      450, 480, 520, 600, 750, 900, 1100, 950, 800, 700, 650, 600, 550, 500, 480, 460
    ];

    let multiplier = 1.0;
    if (weather === 'Rainy') multiplier = 0.7; // 30% reduction
    if (weather === 'Freezing') multiplier = 0.5; // 50% reduction
    if (weather === 'Sunny') multiplier = 1.2; // 20% boost

    return baseSales.map((val, idx) => ({
      hour: `${idx + 8}:00`,
      projected: Math.round(val * multiplier),
      historical: val
    }));
  }, [weather]);

  const handleUseInventory = (id) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock - 5);
        return { ...item, stock: newStock, lastUpdated: new Date().toLocaleTimeString() };
      }
      return item;
    }));
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- RENDER HELPERS ---

  const InventoryGauge = ({ current, max }) => {
    const percent = Math.min(100, Math.round((current / max) * 100));
    const data = [
      { name: 'Used', value: percent },
      { name: 'Empty', value: 100 - percent }
    ];
    const COLORS = ['#10b981', '#f3f4f6'];

    return (
      <div className="h-16 w-16 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={20}
              outerRadius={30}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
          {percent}%
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* Header & Controls */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-orange-600 tracking-tighter uppercase italic">
            Taco Truck <span className="text-slate-800">Smart Inventory</span>
          </h1>
          <p className="text-slate-500 font-medium">Fleet Ops Management System v2.4</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <div className="px-3 py-1 text-xs font-bold uppercase text-slate-400">Weather Forecast</div>
          <select 
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="bg-slate-100 border-none rounded-lg font-bold text-slate-700 px-4 py-2 focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="Sunny">☀️ Sunny</option>
            <option value="Rainy">🌧️ Rainy</option>
            <option value="Freezing">❄️ Freezing</option>
          </select>
        </div>
      </header>

      {/* Main Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Projected Sales Intensity</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="projected" fill={weather === 'Rainy' ? '#3b82f6' : '#f97316'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            {weather === 'Rainy' ? '⚠️ 30% lower volume projected due to weather.' : '💪 High volume expected today.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Waste Risk Alert</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">
                {weather === 'Rainy' ? filteredInventory.filter(i => i.name.includes('Cilantro')).length : '0'}
              </span>
              <span className="text-slate-400 font-bold uppercase text-xs">High Risk Items</span>
            </div>
          </div>
          <div className={`mt-4 p-3 rounded-lg border ${weather === 'Rainy' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'} text-xs font-bold uppercase`}>
            {weather === 'Rainy' ? 'High Spoilage: Cilantro & Produce flagged' : 'Normal spoilage rates active'}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Sales Forecast (12h)</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <Line type="monotone" dataKey="projected" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 border-b border-slate-200">
          {['Inventory', 'Analytics', 'Settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold text-sm transition-all ${activeTab === tab ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'Inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <input 
                  type="text"
                  placeholder="Search 200+ ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <span className="absolute left-3 top-3.5 opacity-30">🔍</span>
              </div>
              <div className="text-xs font-bold text-slate-400 bg-slate-200 px-3 py-1 rounded-full uppercase">
                Showing {filteredInventory.length} Items
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredInventory.slice(0, 50).map(item => {
                const isHighRisk = weather === 'Rainy' && item.name.toLowerCase().includes('cilantro');
                const isLowStock = item.stock < (item.maxStock * 0.2);

                return (
                  <div key={item.id} className={`group bg-white p-5 rounded-2xl border transition-all hover:shadow-md ${isHighRisk ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="pr-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{item.category}</span>
                        <h4 className="font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">{item.name}</h4>
                      </div>
                      <InventoryGauge current={item.stock} max={item.maxStock} />
                    </div>

                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-black text-slate-800">{item.stock}<span className="text-xs font-medium text-slate-400 ml-1">lbs</span></div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Current Stock</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-black uppercase ${isHighRisk ? 'text-red-600 animate-pulse' : 'text-slate-500'}`}>
                          {isHighRisk ? 'High Waste Risk' : `Spoilage: ${Math.round(item.spoilageRate * 100)}%`}
                        </div>
                        <div className="text-[10px] text-slate-400">Updated {item.lastUpdated}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => handleUseInventory(item.id)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${isLowStock ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-900 text-white hover:bg-orange-600'}`}
                      >
                        Log 5 lbs Used
                      </button>
                      {isLowStock && (
                        <div className="text-center text-[10px] font-black text-red-600 uppercase tracking-tighter">
                          Critical Low Stock Alert
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredInventory.length > 50 && (
                <div className="col-span-full py-10 text-center">
                  <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    Load More (Pagination Simulated)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Analytics' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 min-h-[400px]">
            <h2 className="text-2xl font-black mb-6">Inventory Utilization Over Time</h2>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar name="Actual Use (lbs)" dataKey="historical" fill="#94a3b8" />
                  <Bar name="Projected Use (lbs)" dataKey="projected" fill="#fb923c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-2xl">
            <h2 className="text-2xl font-black mb-6">Truck Configuration</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-800">Auto-Refill Threshold</div>
                  <div className="text-xs text-slate-500">Trigger orders when stock hits %</div>
                </div>
                <input type="number" defaultValue={20} className="w-20 text-center font-bold border-slate-200 rounded-lg" />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-800">Weather API Integration</div>
                  <div className="text-xs text-slate-500">Sync with National Weather Service</div>
                </div>
                <div className="w-12 h-6 bg-orange-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <button className="w-full py-4 bg-slate-900 text-white font-black uppercase rounded-xl hover:bg-black transition-colors">
                Save System Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Status Bar */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">System Online</span>
        </div>
        <div className="w-px h-4 bg-slate-700"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest">
          Truck ID: <span className="text-orange-400">#TACO-09-LA</span>
        </div>
        <div className="w-px h-4 bg-slate-700"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest">
          Weather Sync: <span className="text-orange-400">{weather}</span>
        </div>
      </footer>
    </div>
  );
}