import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertTriangle, 
  ArrowRightLeft, 
  ThermometerSun, 
  CloudLightning, 
  Download,
  Menu,
  ChevronDown
} from 'lucide-react';

/**
 * REGIONAL SEASONAL INVENTORY OPTIMIZER
 * A functional dashboard for category managers to adjust inventory
 * targets based on regional weather shocks.
 */

export default function RegionalInventoryOptimizer() {
  // --- STATE ---
  const [selectedRegion, setSelectedRegion] = useState('Southeast');
  const [isHeatwaveActive, setIsHeatwaveActive] = useState(false);
  const [isStormWarningActive, setIsStormWarningActive] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- MOCK DATA GENERATION ---
  useEffect(() => {
    const regions = ['Northeast', 'Southeast', 'Midwest', 'West'];
    const products = [
      { name: 'Arctic Breeze AC Unit', category: 'AC' },
      { name: 'CoolMist Oscillating Fan', category: 'Fan' },
      { name: 'Heavy Duty Winter Heater', category: 'Heater' },
      { name: 'StormGuard Compact Umbrella', category: 'Weather' },
      { name: 'EcoFlow Generator', category: 'Power' },
      { name: 'QuickChill Fridge Box', category: 'Cooler' }
    ];

    const generatedData = Array.from({ length: 200 }, (_, i) => {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const baseVelocity = Math.floor(Math.random() * 50) + 10;
      const currentStock = Math.floor(Math.random() * 150) + 20;

      return {
        id: i + 1,
        rdc: region,
        storeId: `STR-${1000 + i}`,
        sku: `SKU-${5000 + i}`,
        productName: product.name,
        category: product.category,
        currentStock: currentStock,
        weeklySalesVelocity: baseVelocity,
        baseTarget: baseVelocity * 4 // 4 weeks of cover
      };
    });

    setInventory(generatedData);
  }, []);

  // --- RECALCULATION LOGIC ---
  const processedData = useMemo(() => {
    return inventory.map(item => {
      let dynamicTarget = item.baseTarget;
      let isHighDemand = false;

      // Weather Shock Logic
      if (item.rdc === selectedRegion) {
        if (isHeatwaveActive && (item.category === 'AC' || item.category === 'Fan' || item.category === 'Cooler')) {
          dynamicTarget = Math.round(item.baseTarget * 2.5); // 150% increase
          isHighDemand = true;
        }
        if (isStormWarningActive && (item.category === 'Weather' || item.category === 'Power')) {
          dynamicTarget = Math.round(item.baseTarget * 3.0); // 200% increase
          isHighDemand = true;
        }
      }

      const isLowStock = item.currentStock < (dynamicTarget * 0.8);

      return {
        ...item,
        targetStock: dynamicTarget,
        status: isLowStock ? 'LOW_STOCK' : 'STABLE',
        highlight: isLowStock && isHighDemand
      };
    });
  }, [inventory, selectedRegion, isHeatwaveActive, isStormWarningActive]);

  // --- KPI CALCS ---
  const kpis = useMemo(() => {
    const regionalItems = processedData.filter(d => d.rdc === selectedRegion);
    const lowStockCount = regionalItems.filter(d => d.status === 'LOW_STOCK').length;
    const totalValue = regionalItems.reduce((acc, curr) => acc + curr.currentStock, 0);
    const alertCount = regionalItems.filter(d => d.highlight).length;

    return [
      { title: 'Regional Stock Level', value: totalValue, color: '#62a8ea' },
      { title: 'Stores Under Target', value: lowStockCount, color: '#f59e0b' },
      { title: 'Weather Shock Alerts', value: alertCount, color: '#ef4444' },
      { title: 'Avg Velocity', value: (totalValue / (regionalItems.length || 1)).toFixed(1), color: '#10b981' }
    ];
  }, [processedData, selectedRegion]);

  // --- ACTIONS ---
  const handleGenerateManifest = () => {
    const deficitStores = processedData.filter(d => d.status === 'LOW_STOCK' && d.rdc === selectedRegion);
    const surplusStores = processedData.filter(d => d.currentStock > d.targetStock * 1.5);

    let manifest = `INVENTORY TRANSFER MANIFEST - ${new Date().toLocaleDateString()}
`;
    manifest += `Region: ${selectedRegion}
`;
    manifest += `------------------------------------------------------------

`;

    deficitStores.slice(0, 15).forEach((target, idx) => {
      const source = surplusStores[idx % surplusStores.length];
      if (source) {
        manifest += `[ORDER ${10000 + idx}] SHIP ${Math.round(target.targetStock - target.currentStock)} units of ${target.productName}
`;
        manifest += `   FROM: Store ${source.storeId} (Surplus: ${source.currentStock - source.targetStock})
`;
        manifest += `   TO: Store ${target.storeId} (Deficit: ${target.targetStock - target.currentStock})

`;
      }
    });

    const element = document.createElement("a");
    const file = new Blob([manifest], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `TransferOrder_${selectedRegion}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a] font-['Inter',_sans-serif]">
      {/* Top Header */}
      <header className="w-full h-16 border-b border-[#e2e8f0] dark:border-[#1e293b] flex items-center px-6 bg-[#ffffff] dark:bg-[#1a1a1a] sticky top-0 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 mr-4 text-[#5c5c5c] dark:text-[#dbdbdb] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
          Regional Seasonal Inventory Optimizer
        </h1>
      </header>

      <div className="flex relative">
        {/* Sidebar (Process Control) */}
        <aside 
          className={`absolute lg:relative z-40 h-[calc(100vh-64px)] w-64 border-r border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="p-6 space-y-8">
            {/* Region Selection */}
            <div>
              <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                Primary Region
              </h6>
              <div className="relative">
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-md px-3 py-2 text-[#0f172a] dark:text-[#f8fafc] appearance-none focus:ring-2 focus:ring-[#598dc5]"
                >
                  {['Northeast', 'Southeast', 'Midwest', 'West'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-[#64748b]" />
              </div>
            </div>

            {/* Weather Shock Panel */}
            <div className="p-4 bg-[#f8fafc] dark:bg-[#1e293b] rounded-xl border border-[#e2e8f0] dark:border-[#334155]">
              <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#457bb5', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThermometerSun size={18} /> Weather Shock Panel
              </h6>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1]">Heatwave Trigger</span>
                  <button 
                    onClick={() => setIsHeatwaveActive(!isHeatwaveActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isHeatwaveActive ? 'bg-[#598dc5]' : 'bg-[#e2e8f0] dark:bg-[#334155]'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isHeatwaveActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1]">Storm Warning</span>
                  <button 
                    onClick={() => setIsStormWarningActive(!isStormWarningActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isStormWarningActive ? 'bg-[#598dc5]' : 'bg-[#e2e8f0] dark:bg-[#334155]'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isStormWarningActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <button 
                onClick={handleGenerateManifest}
                style={{ backgroundColor: '#598dc5', color: '#ffffff', fontWeight: '500', fontSize: '14px' }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md hover:bg-[#054aa3] transition-colors shadow-sm"
              >
                <Download size={18} />
                Generate Transfers
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-[#ffffff] dark:bg-[#1a1a1a] overflow-y-auto h-[calc(100vh-64px)]">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, idx) => (
              <div 
                key={idx}
                className="p-5 bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl shadow-sm"
              >
                <p style={{ fontSize: '12px', fontWeight: '400', color: '#64748b', marginBottom: '8px' }}>{kpi.title}</p>
                <div className="flex items-baseline gap-2">
                  <h2 style={{ fontSize: '30px', fontWeight: '600', color: kpi.color }}>{kpi.value}</h2>
                  {idx === 2 && kpi.value > 0 && <AlertTriangle size={18} className="text-[#ef4444]" />}
                </div>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#e2e8f0] dark:border-[#1e293b] flex justify-between items-center bg-[#f8fafc] dark:bg-[#1e293b]">
              <h5 style={{ fontSize: '18px', fontWeight: '500', color: '#5c5c5c' }} className="dark:text-[#dbdbdb]">
                Inventory Distribution: {selectedRegion}
              </h5>
              <div className="flex gap-2">
                 {isHeatwaveActive && (
                   <span className="px-3 py-1 bg-[#fffbeb] border border-[#fde68a] text-[#92400e] rounded-full text-xs font-medium flex items-center gap-1">
                     <ThermometerSun size={12} /> Heatwave Impact
                   </span>
                 )}
                 {isStormWarningActive && (
                   <span className="px-3 py-1 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] rounded-full text-xs font-medium flex items-center gap-1">
                     <CloudLightning size={12} /> Storm Impact
                   </span>
                 )}
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#f1f5f9] dark:bg-[#1e293b] z-10">
                  <tr>
                    {['Store ID', 'SKU', 'Product Name', 'Curr. Stock', 'Wkly Sales', 'Target Demand', 'Status'].map(h => (
                      <th key={h} className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '400', color: '#457bba' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-[#262626]">
                  {processedData.filter(d => d.rdc === selectedRegion).map((item) => (
                    <tr 
                      key={item.id} 
                      className={`transition-colors ${item.highlight ? 'bg-[#fff9e6] dark:bg-[#3d2e13]' : 'hover:bg-[#f8fafc] dark:hover:bg-[#121212]'}`}
                    >
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#657281' }} className="dark:text-[#cbd5e1] font-mono">{item.storeId}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#657281' }} className="dark:text-[#cbd5e1]">{item.sku}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }} className="dark:text-[#cbd5e1]">{item.productName}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }} className="dark:text-[#cbd5e1]">{item.currentStock}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#657281' }} className="dark:text-[#cbd5e1]">{item.weeklySalesVelocity}</td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#598dc5' }}>{item.targetStock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${item.status === 'LOW_STOCK' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#dcfce7] text-[#166534]'}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State (If Region Filter had no data) */}
            {processedData.filter(d => d.rdc === selectedRegion).length === 0 && (
              <div className="p-12 text-center">
                <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>
                  No active inventory records found for the {selectedRegion} region.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}