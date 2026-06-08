import React, { useState, useMemo, useEffect } from 'react';
import { 
  CloudRain, 
  Sun, 
  AlertTriangle, 
  Truck, 
  Download, 
  RefreshCw, 
  Package, 
  MapPin, 
  TrendingUp,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

/**
 * Regional Seasonal Inventory Optimizer
 * A high-performance React dashboard for inventory rebalancing during weather shocks.
 */

// --- MOCK DATA GENERATOR ---
const REGIONS = ['Southeast', 'Northeast', 'Midwest', 'Southwest', 'Pacific'];
const RDCS = {
  'Southeast': ['RDC-ATL-01', 'RDC-CLT-02'],
  'Northeast': ['RDC-PHL-05', 'RDC-BOS-03'],
  'Midwest': ['RDC-ORD-04', 'RDC-IND-07'],
  'Southwest': ['RDC-DFW-09', 'RDC-PHX-08'],
  'Pacific': ['RDC-LAX-10', 'RDC-SEA-11']
};

const CATEGORIES = ['AC Units', 'Fans', 'Cooling Systems', 'Outdoor Furniture', 'General Housewares'];

const generateMockInventory = () => {
  return Array.from({ length: 250 }, (_, i) => {
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const rdc = RDCS[region][Math.floor(Math.random() * RDCS[region].length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const weeklyVelocity = Math.floor(Math.random() * 45) + 5;
    // Base current stock around 3 weeks of velocity
    const currentStock = Math.floor(weeklyVelocity * (Math.random() * 4 + 1));

    return {
      id: `SKU-${1000 + i}`,
      rdc,
      region,
      storeId: `STR-${Math.floor(Math.random() * 900) + 100}`,
      sku: `SKU-${1000 + i}`,
      productName: `${category} Model ${String.fromCharCode(65 + (i % 26))}${i % 10}`,
      category,
      currentStock,
      weeklySalesVelocity: weeklyVelocity,
      baseTarget: weeklyVelocity * 3 // Standard 3-week cover
    };
  });
};

const INITIAL_INVENTORY = generateMockInventory();

export default function RegionalInventoryOptimizer() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [selectedRegion, setSelectedRegion] = useState('Southeast');
  const [weatherEvent, setWeatherEvent] = useState(null); // 'Heatwave' or 'Storm'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- CORE LOGIC: Dynamic Recalculation ---
  const processedData = useMemo(() => {
    return inventory.map(item => {
      let targetStock = item.baseTarget;
      let status = 'Stable';

      if (weatherEvent === 'Heatwave' && item.region === selectedRegion) {
        if (item.category === 'AC Units' || item.category === 'Fans' || item.category === 'Cooling Systems') {
          // Heatwave increases target stock by 250% for cooling products
          targetStock = Math.ceil(item.weeklySalesVelocity * 7.5);

          // Check for critical shortage (current stock < 80% of new target)
          if (item.currentStock < targetStock * 0.8) {
            status = 'Critical';
          }
        }
      }

      if (weatherEvent === 'Storm' && item.region === selectedRegion) {
        if (item.category === 'Outdoor Furniture') {
          // Storm warning reduces target (moving stock indoors/slowing sales)
          targetStock = Math.ceil(item.weeklySalesVelocity * 1.5);
        }
      }

      return { ...item, targetStock, status };
    });
  }, [inventory, selectedRegion, weatherEvent]);

  const filteredData = useMemo(() => {
    return processedData.filter(item => 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processedData, searchTerm]);

  // --- ACTIONS ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setInventory(generateMockInventory());
      setIsRefreshing(false);
    }, 800);
  };

  const generateTransferOrders = () => {
    const criticalItems = processedData.filter(d => d.status === 'Critical');
    const surplusItems = processedData.filter(d => d.currentStock > d.targetStock * 1.5);

    let manifest = `INVENTORY TRANSFER MANIFEST - ${new Date().toLocaleString()}
`;
    manifest += `REGION: ${selectedRegion} | EVENT: ${weatherEvent || 'None'}
`;
    manifest += `----------------------------------------------------------

`;

    criticalItems.forEach(sink => {
      const source = surplusItems.find(s => s.sku === sink.sku && s.rdc === sink.rdc);
      if (source) {
        const transferQty = Math.min(
          source.currentStock - source.targetStock,
          sink.targetStock - sink.currentStock
        );
        if (transferQty > 0) {
          manifest += `[ORDER] MOVE ${transferQty} units of ${sink.productName} (${sink.sku})
`;
          manifest += `        FROM: Store ${source.storeId} (Surplus)
`;
          manifest += `        TO:   Store ${sink.storeId} (Critical)
`;
          manifest += `        RDC:  ${sink.rdc}

`;
        }
      }
    });

    if (criticalItems.length === 0) manifest += "No critical shortages identified for current parameters.";

    const blob = new Blob([manifest], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Transfer_Orders_${selectedRegion}_${weatherEvent || 'Normal'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- STATS ---
  const stats = useMemo(() => {
    const regionData = processedData.filter(d => d.region === selectedRegion);
    const criticalCount = regionData.filter(d => d.status === 'Critical').length;
    const totalStock = regionData.reduce((acc, curr) => acc + curr.currentStock, 0);
    const avgVelocity = regionData.reduce((acc, curr) => acc + curr.weeklySalesVelocity, 0) / (regionData.length || 1);

    return { criticalCount, totalStock, avgVelocity };
  }, [processedData, selectedRegion]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Regional Seasonal Inventory Optimizer</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Logistics Control Center v4.2</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <button 
            onClick={generateTransferOrders}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all text-sm font-bold shadow-md shadow-indigo-100"
          >
            <Truck className="w-4 h-4" />
            Generate Transfer Orders
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 overflow-y-auto">
          {/* Weather Shock Panel */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-700">Weather Shock Override</h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Target Region</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Weather Trigger</label>
              <button 
                onClick={() => setWeatherEvent(weatherEvent === 'Heatwave' ? null : 'Heatwave')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  weatherEvent === 'Heatwave' 
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sun className={`w-5 h-5 ${weatherEvent === 'Heatwave' ? 'text-orange-600' : ''}`} />
                  <span className="font-semibold">Heatwave Trigger</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${weatherEvent === 'Heatwave' ? 'bg-orange-500 border-orange-600' : 'border-slate-300'}`} />
              </button>

              <button 
                onClick={() => setWeatherEvent(weatherEvent === 'Storm' ? null : 'Storm')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  weatherEvent === 'Storm' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CloudRain className={`w-5 h-5 ${weatherEvent === 'Storm' ? 'text-blue-600' : ''}`} />
                  <span className="font-semibold">Storm Warning</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${weatherEvent === 'Storm' ? 'bg-blue-500 border-blue-600' : 'border-slate-300'}`} />
              </button>
            </div>

            {weatherEvent === 'Heatwave' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 leading-relaxed animate-pulse">
                <strong>Attention:</strong> Target stock for all cooling categories in {selectedRegion} has been adjusted to 7.5x weekly sales velocity.
              </div>
            )}
          </section>

          {/* Quick Stats Sidebar */}
          <section className="space-y-4">
            <h2 className="font-bold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Regional Health
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase">Critical Stores</span>
                <p className={`text-2xl font-black ${stats.criticalCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {stats.criticalCount}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase">Avg Sales Velocity</span>
                <p className="text-2xl font-black text-slate-800">{stats.avgVelocity.toFixed(1)} <span className="text-sm font-normal text-slate-400">u/wk</span></p>
              </div>
            </div>
          </section>

          {/* Visualization Mini */}
          <div className="flex-1 min-h-[200px] mt-4">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Stable', value: filteredData.length - stats.criticalCount },
                    { name: 'Critical', value: stats.criticalCount },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#e2e8f0" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Top Bar for Table */}
          <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-96">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search SKU, Product Name, or Store ID..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-200 border border-amber-300 rounded" />
                Critical Shortage
              </span>
              <span>Showing {filteredData.length} records</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-20">
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">RDC</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Store ID</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Product Details</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Velocity</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Current Stock</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Target Stock</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Fill Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.slice(0, 100).map((item) => {
                    const fillRatio = (item.currentStock / item.targetStock);
                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-slate-50 transition-colors ${item.status === 'Critical' ? 'bg-amber-50/50' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700">{item.rdc}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm text-indigo-600">{item.storeId}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">{item.productName}</span>
                            <span className="text-xs text-slate-400">SKU: {item.sku} • {item.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-medium text-slate-600">{item.weeklySalesVelocity}u</td>
                        <td className={`px-4 py-3 text-center text-sm font-bold ${item.status === 'Critical' ? 'text-red-600' : 'text-slate-800'}`}>
                          {item.currentStock}
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-bold text-indigo-600">{item.targetStock}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center flex-col gap-1">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${fillRatio < 0.8 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                style={{ width: `${Math.min(fillRatio * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{(fillRatio * 100).toFixed(0)}% Fill</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredData.length > 100 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500 font-medium">
                Truncated view: Displaying first 100 of {filteredData.length} matches. Use search to refine.
              </div>
            )}
          </div>

          {/* Bottom Trends Chart */}
          <div className="mt-6 h-64 bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Stock Position by Store (Top 20 Samples)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.slice(0, 20)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="storeId" tick={{fontSize: 10}} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar name="Current Stock" dataKey="currentStock" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Target Stock" dataKey="targetStock" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>

      {/* Weather Overlay Indicator */}
      {weatherEvent && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-full shadow-2xl border border-slate-700 animate-bounce z-50">
          {weatherEvent === 'Heatwave' ? <Sun className="w-5 h-5 text-orange-400" /> : <CloudRain className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-bold tracking-tight">Active Warning: {weatherEvent} ({selectedRegion})</span>
          <button 
            onClick={() => setWeatherEvent(null)}
            className="ml-2 p-1 hover:bg-slate-700 rounded-full"
          >
            <div className="w-4 h-4 rotate-45 border-2 border-white relative">
               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white -translate-y-1/2" />
               <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white -translate-x-1/2" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}