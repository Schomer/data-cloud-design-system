import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell 
} from 'recharts';
import { 
  CloudRain, 
  Sun, 
  ChevronDown, 
  Download, 
  AlertTriangle, 
  RefreshCcw,
  Package,
  Truck,
  Menu,
  X
} from 'lucide-react';

/**
 * REGIONAL SEASONAL INVENTORY OPTIMIZER
 * 
 * Features:
 * - Dynamic Regional Simulation
 * - Weather Shock Override Panel
 * - Demand Recalculation Logic
 * - Bulk Transfer Order Generation
 */

// --- DESIGN TOKENS (from visual_spec.skill.md) ---
const THEME = {
  light: {
    bg: "#ffffff",
    bgSecondary: "#e2e8f0",
    textPrimary: "#5c5c5c",
    textSecondary: "#475569",
    border: "#e2e8f0",
    primary: "#598dc5",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  dark: {
    bg: "#1a1a1a",
    bgSecondary: "#1e293b",
    textPrimary: "#dbdbdb",
    textSecondary: "#cbd5e1",
    border: "#1e293b",
    primary: "#5aa1d8",
    chart: ["#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#7375c9"],
    warning: "#f59e0b",
    danger: "#ef4444"
  }
};

// --- MOCK DATA GENERATION ---
const REGIONS = ['Southeast', 'Northeast', 'Midwest', 'West', 'Southwest'];
const PRODUCTS = [
  { name: 'AC Unit', category: 'Cooling' },
  { name: 'Fan', category: 'Cooling' },
  { name: 'Umbrella', category: 'Storm' },
  { name: 'Generator', category: 'Storm' },
  { name: 'Flashlight', category: 'Storm' },
  { name: 'Cooler', category: 'Seasonal' },
  { name: 'Tarp', category: 'Storm' }
];

const generateMockInventory = () => {
  return Array.from({ length: 150 }, (_, i) => {
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const velocity = Math.floor(Math.random() * 50) + 5;
    const stock = Math.floor(Math.random() * (velocity * 6));

    return {
      id: i + 1,
      rdc: `RDC-${region.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 10) + 1}`,
      storeId: `ST-${region.substring(0, 1)}${1000 + i}`,
      sku: `SKU-${Math.floor(Math.random() * 90000) + 10000}`,
      productName: product.name,
      category: product.category,
      region: region,
      currentStock: stock,
      weeklySalesVelocity: velocity,
      baseTarget: velocity * 4
    };
  });
};

export default function InventoryOptimizer() {
  const [data, setData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('Southeast');
  const [weatherShock, setWeatherShock] = useState('none'); // 'none', 'heatwave', 'storm'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setData(generateMockInventory());
  }, []);

  // --- LOGIC: Recalculate Demand based on Weather Shock ---
  const processedData = useMemo(() => {
    return data.map(item => {
      let targetDemand = item.baseTarget;
      let multiplier = 1;

      if (item.region === selectedRegion) {
        if (weatherShock === 'heatwave' && item.category === 'Cooling') {
          multiplier = 2.5;
        } else if (weatherShock === 'storm' && item.category === 'Storm') {
          multiplier = 3.0;
        }
      }

      targetDemand = Math.ceil(item.weeklySalesVelocity * 4 * multiplier);
      const isCritical = item.currentStock < (targetDemand * 0.8);

      return {
        ...item,
        targetDemand,
        isCritical
      };
    });
  }, [data, selectedRegion, weatherShock]);

  // Filtered view for the selected region
  const regionView = useMemo(() => {
    return processedData.filter(d => d.region === selectedRegion);
  }, [processedData, selectedRegion]);

  // KPI Metrics
  const kpis = useMemo(() => {
    const regionItems = regionView;
    const criticalCount = regionItems.filter(i => i.isCritical).length;
    const totalStock = regionItems.reduce((acc, i) => acc + i.currentStock, 0);
    const avgVelocity = (regionItems.reduce((acc, i) => acc + i.weeklySalesVelocity, 0) / regionItems.length).toFixed(1);

    return [
      { label: "Total Stock Units", value: totalStock.toLocaleString(), icon: Package },
      { label: "Critical Low Stores", value: criticalCount, icon: AlertTriangle, color: criticalCount > 0 ? "#ef4444" : "#10b981" },
      { label: "Avg Sales Velocity", value: avgVelocity, icon: RefreshCcw },
      { label: "Active Buffer", value: weatherShock === 'none' ? 'Standard (4w)' : 'Shock (8-12w)', icon: Truck }
    ];
  }, [regionView, weatherShock]);

  // --- ACTIONS ---
  const handleGenerateTransfer = () => {
    setIsDownloading(true);

    // Logic: Identify excess in "Northeast" (standard region) to ship to "Southeast" (shocked region)
    const criticalItems = regionView.filter(i => i.isCritical);
    const excessItems = processedData.filter(i => i.region !== selectedRegion && i.currentStock > i.targetDemand * 1.5);

    let manifest = `REGIONAL TRANSFER MANIFEST - ${new Date().toLocaleDateString()}
`;
    manifest += `Source Shock: ${weatherShock.toUpperCase()} in ${selectedRegion}
`;
    manifest += `------------------------------------------------------------

`;

    criticalItems.slice(0, 15).forEach((item, idx) => {
      const source = excessItems[idx % excessItems.length] || { storeId: 'RDC-CENTRAL', currentStock: 5000 };
      const transferQty = item.targetDemand - item.currentStock;
      manifest += `TRANSFER #${1000 + idx}: Ship ${transferQty} units of ${item.productName} (${item.sku})
`;
      manifest += `FROM: ${source.storeId} (Current: ${source.currentStock})
`;
      manifest += `TO:   ${item.storeId} (Current: ${item.currentStock} | Target: ${item.targetDemand})
`;
      manifest += `------------------------------------------------------------
`;
    });

    const blob = new Blob([manifest], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TransferOrder_${selectedRegion}_${weatherShock}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#1a1a1a] font-['Inter',_sans-serif]">

      {/* --- TOP HEADER --- */}
      <header className="h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-between px-6 z-20 bg-[#ffffff] dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#f1f5f9] dark:hover:bg-[#262626] rounded-md transition-colors"
          >
            <Menu size={20} className="text-[#5c5c5c] dark:text-[#dbdbdb]" />
          </button>
          <h1 className="text-[20px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb] tracking-tight">
            Regional Seasonal Inventory Optimizer
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#e2e8f0] dark:bg-[#262626] rounded-md p-1">
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1 text-[12px] font-[500] rounded transition-all ${
                  selectedRegion === r 
                    ? 'bg-[#ffffff] dark:bg-[#3b82f6] text-[#3b82f6] dark:text-white shadow-sm' 
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#334155]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* --- LEFT SIDEBAR: WEATHER SHOCK PANEL --- */}
        <aside className={`
          ${isSidebarOpen ? 'w-72' : 'w-0'} 
          border-r border-[#e2e8f0] dark:border-[#1e293b] 
          bg-[#f8fafc] dark:bg-[#1a1a1a] 
          transition-all duration-300 overflow-hidden flex flex-col
        `}>
          <div className="p-6">
            <h6 className="text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase tracking-widest mb-4">
              Weather Shock Override
            </h6>

            <div className="space-y-4">
              <div 
                onClick={() => setWeatherShock('none')}
                className={`
                  p-4 rounded-xl border cursor-pointer transition-all
                  ${weatherShock === 'none' 
                    ? 'border-[#598dc5] bg-[#ebf5ff] dark:bg-[#1e293b] dark:border-[#3b82f6]' 
                    : 'border-[#e2e8f0] dark:border-[#1e293b] hover:bg-white dark:hover:bg-[#262626]'}
                `}
              >
                <div className="flex items-center gap-3 mb-1">
                  <RefreshCcw size={18} className={weatherShock === 'none' ? 'text-[#3b82f6]' : 'text-[#64748b]'} />
                  <span className="text-[14px] font-[600] text-[#475569] dark:text-[#dbdbdb]">Normal Ops</span>
                </div>
                <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Standard 4-week sales velocity buffer.</p>
              </div>

              <div 
                onClick={() => setWeatherShock('heatwave')}
                className={`
                  p-4 rounded-xl border cursor-pointer transition-all
                  ${weatherShock === 'heatwave' 
                    ? 'border-[#f59e0b] bg-[#fffbeb] dark:bg-[#2d2110] dark:border-[#f59e0b]' 
                    : 'border-[#e2e8f0] dark:border-[#1e293b] hover:bg-white dark:hover:bg-[#262626]'}
                `}
              >
                <div className="flex items-center gap-3 mb-1">
                  <Sun size={18} className={weatherShock === 'heatwave' ? 'text-[#f59e0b]' : 'text-[#64748b]'} />
                  <span className="text-[14px] font-[600] text-[#475569] dark:text-[#dbdbdb]">Heatwave Trigger</span>
                </div>
                <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">2.5x Demand surge for Cooling (AC/Fans).</p>
              </div>

              <div 
                onClick={() => setWeatherShock('storm')}
                className={`
                  p-4 rounded-xl border cursor-pointer transition-all
                  ${weatherShock === 'storm' 
                    ? 'border-[#3b82f6] bg-[#eff6ff] dark:bg-[#121c2e] dark:border-[#3b82f6]' 
                    : 'border-[#e2e8f0] dark:border-[#1e293b] hover:bg-white dark:hover:bg-[#262626]'}
                `}
              >
                <div className="flex items-center gap-3 mb-1">
                  <CloudRain size={18} className={weatherShock === 'storm' ? 'text-[#3b82f6]' : 'text-[#64748b]'} />
                  <span className="text-[14px] font-[600] text-[#475569] dark:text-[#dbdbdb]">Storm Warning</span>
                </div>
                <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">3.0x Demand surge for Storm Prep units.</p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleGenerateTransfer}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#598dc5] dark:bg-[#3b82f6] text-white rounded-lg text-[14px] font-[600] hover:bg-[#054aa3] transition-all disabled:opacity-50"
              >
                {isDownloading ? <RefreshCcw className="animate-spin" size={16} /> : <Download size={16} />}
                Generate Transfer Orders
              </button>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT CANVAS --- */}
        <main className="flex-1 overflow-y-auto bg-[#ffffff] dark:bg-[#1a1a1a] p-8">

          {/* KPI ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white dark:bg-[#262626] border border-[#e2e8f0] dark:border-[#1e293b] p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-[500] text-[#64748b] dark:text-[#94a3b8]">{kpi.label}</span>
                  <kpi.icon size={16} className="text-[#94a3b8]" />
                </div>
                <div className="text-[28px] font-[600] text-[#457bb4] dark:text-[#3b82f6]" style={{ color: kpi.color }}>
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* CHART SECTION */}
          <div className="bg-white dark:bg-[#262626] border border-[#e2e8f0] dark:border-[#1e293b] p-6 rounded-2xl mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-[18px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb]">Stock vs Demand - {selectedRegion}</h4>
                <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Top 15 stores by velocity</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#62a8ea] rounded-sm"></div>
                  <span className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">Current Stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#f59e0b] rounded-sm"></div>
                  <span className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">Target Demand</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionView.slice(0, 15)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="storeId" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="currentStock" radius={[4, 4, 0, 0]}>
                    {regionView.slice(0, 15).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isCritical ? '#ef4444' : '#62a8ea'} />
                    ))}
                  </Bar>
                  <Bar dataKey="targetDemand" fill="#f59e0b" opacity={0.3} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DATA TABLE SECTION */}
          <div className="bg-white dark:bg-[#262626] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#e2e8f0] dark:border-[#1e293b]">
              <h5 className="text-[16px] font-[600] text-[#5c5c5c] dark:text-[#dbdbdb]">Inventory Ledger</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8fafc] dark:bg-[#1a1a1a]">
                  <tr>
                    <th className="px-6 py-4 text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase">Store ID</th>
                    <th className="px-6 py-4 text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase">Product Name</th>
                    <th className="px-6 py-4 text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase">Current Stock</th>
                    <th className="px-6 py-4 text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase">Velocity</th>
                    <th className="px-6 py-4 text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase">Target Demand</th>
                    <th className="px-6 py-4 text-[12px] font-[600] text-[#64748b] dark:text-[#94a3b8] uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#1e293b]">
                  {regionView.map((row) => (
                    <tr 
                      key={row.id} 
                      className={`
                        hover:bg-[#f8fafc] dark:hover:bg-[#262626] transition-colors
                        ${row.isCritical ? 'bg-yellow-50 dark:bg-[#2d2110]' : ''}
                      `}
                    >
                      <td className="px-6 py-4 text-[14px] font-[500] text-[#475569] dark:text-[#cbd5e1]">{row.storeId}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475569] dark:text-[#cbd5e1]">{row.productName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[14px] font-[600] ${row.isCritical ? 'text-red-500' : 'text-[#475569] dark:text-[#cbd5e1]'}`}>
                            {row.currentStock}
                          </span>
                          {row.isCritical && <AlertTriangle size={14} className="text-red-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#64748b] dark:text-[#94a3b8]">{row.weeklySalesVelocity}/wk</td>
                      <td className="px-6 py-4 text-[14px] font-[600] text-[#457bb5] dark:text-[#3b82f6]">{row.targetDemand}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[12px] font-[600] text-[#598dc5] dark:text-[#3b82f6] hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-[#f8fafc] dark:bg-[#1a1a1a] border-t border-[#e2e8f0] dark:border-[#1e293b] flex justify-between items-center">
               <span className="text-[12px] text-[#64748b] dark:text-[#94a3b8]">Showing {regionView.length} records</span>
               <div className="flex gap-2">
                 <button className="px-3 py-1 bg-white dark:bg-[#262626] border border-[#e2e8f0] dark:border-[#1e293b] rounded text-[12px] text-[#475569] dark:text-[#dbdbdb]">Previous</button>
                 <button className="px-3 py-1 bg-white dark:bg-[#262626] border border-[#e2e8f0] dark:border-[#1e293b] rounded text-[12px] text-[#475569] dark:text-[#dbdbdb]">Next</button>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}