import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Columns, 
  Merge, 
  Save, 
  X, 
  ChevronRight, 
  ChevronDown,
  Download,
  Filter,
  Check,
  AlertCircle,
  Menu
} from 'lucide-react';

/**
 * DataWranglerPro
 * A comprehensive React application for data cleaning, searching, and column manipulation.
 * Adheres strictly to the Visual Specification and Layout Patterns provided.
 */

// --- Constants & Visual Tokens (derived from visual_spec.skill.md) ---
const THEME = {
  light: {
    bg_primary: "#ffffff",
    bg_secondary: "#e2e8f0",
    text_primary: "#5c5c5c",
    text_secondary: "#475569",
    border: "#e2e8f0",
    card_bg: "#ffffff",
    accent: "#598dc5",
    header_text: "#457bba",
    row_border: "#f1f5f9"
  },
  dark: {
    bg_primary: "#1a1a1a",
    bg_secondary: "#1e293b",
    text_primary: "#dbdbdb",
    text_secondary: "#cbd5e1",
    border: "#1e293b",
    card_bg: "#1a1a1a",
    accent: "#5aa1d8",
    header_text: "#94a3b8",
    row_border: "#262626"
  }
};

const TYPOGRAPHY = {
  h1: { fontSize: '36px', fontWeight: '600' },
  h3: { fontSize: '24px', fontWeight: '600' },
  h4: { fontSize: '20px', fontWeight: '600' },
  h6: { fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  p: { fontSize: '14px', fontWeight: '400' },
  small: { fontSize: '12px', fontWeight: '400' }
};

// --- Mock Data Generation ---
const generateMockData = () => {
  const statuses = ['Shipped', 'Processing', 'Cancelled', 'Returned', 'Delivered'];
  return Array.from({ length: 200 }, (_, i) => ({
    id: 1000 + i,
    order_id: 5000 + i,
    user_id: 200 + (i % 50),
    inventory_item_id: 10000 + i,
    sale_price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    created_at: new Date(2026, 0, 1, 10, 30).toISOString().split('T')[0],
    is_active: Math.random() > 0.1,
    tags: 'ecomm,retail'
  }));
};

// --- Components ---

const Typography = ({ variant, children, className = "", style = {} }) => {
  const config = TYPOGRAPHY[variant] || TYPOGRAPHY.p;
  return (
    <span 
      className={className} 
      style={{ 
        fontSize: config.fontSize, 
        fontWeight: config.fontWeight, 
        textTransform: config.textTransform || 'none',
        letterSpacing: config.letterSpacing || 'normal',
        ...style 
      }}
    >
      {children}
    </span>
  );
};

const Button = ({ label, variant = 'primary', onClick, icon: Icon, disabled = false, className = "" }) => {
  // Styles strictly from button.md
  const isDark = true; // Simulating dark mode preference
  const mode = isDark ? 'dark' : 'light';

  const baseStyles = "inline-flex items-center justify-center transition-colors duration-200 focus:outline-none";
  const variants = {
    primary: "bg-[#5aa1d8] hover:bg-[#3875a3] text-[#000000]",
    secondary: "bg-[#292929] hover:bg-[#122940] text-[#a0a7b0] border border-[#1e293b]",
    destructive: "bg-[#25a77c] hover:bg-[#610f24] text-[#cfcfcf]",
    ghost: "text-[#9ea5ae] hover:bg-[#eff6ff]/10"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      {Icon && <Icon size={16} className="mr-2" />}
      {label}
    </button>
  );
};

export default function DataWranglerPro() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingRow, setEditingRow] = useState(null);
  const [showNewColumnModal, setShowNewColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [activeTool, setActiveTool] = useState('search'); // search, transform, merge

  // Initialization
  useEffect(() => {
    setData(generateMockData());
  }, []);

  // Filter Logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(row => 
      Object.values(row).some(val => String(val).toLowerCase().includes(lowerSearch))
    );
  }, [data, searchTerm]);

  // Actions
  const handleToggleRow = (id) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedRows.size} records?`)) {
      setData(prev => prev.filter(row => !selectedRows.has(row.id)));
      setSelectedRows(new Set());
    }
  };

  const handleUpdateRow = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = Object.fromEntries(formData.entries());

    setData(prev => prev.map(row => 
      row.id === editingRow.id ? { ...row, ...updated, sale_price: parseFloat(updated.sale_price) } : row
    ));
    setEditingRow(null);
  };

  const handleAddColumn = () => {
    if (!newColumnName) return;
    const key = newColumnName.toLowerCase().replace(/\s+/g, '_');
    setData(prev => prev.map(row => ({ ...row, [key]: "" })));
    setNewColumnName("");
    setShowNewColumnModal(false);
  };

  const handleMergeRows = () => {
    if (selectedRows.size < 2) return;
    const rowsToMerge = data.filter(r => selectedRows.has(r.id));
    const merged = {
      ...rowsToMerge[0],
      id: Math.max(...rowsToMerge.map(r => r.id)) + 1,
      status: 'Merged',
      tags: [...new Set(rowsToMerge.map(r => r.tags).join(',').split(','))].join(',')
    };

    setData(prev => [merged, ...prev.filter(row => !selectedRows.has(row.id))]);
    setSelectedRows(new Set());
    setActiveTool('search');
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-[#dbdbdb] font-sans selection:bg-[#5aa1d8]/30">

      {/* Header - Full Width */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-[#1e293b] bg-[#1a1a1a] sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-[#1e293b] rounded transition-colors"
          >
            <Menu size={20} color="#dbdbdb" />
          </button>
          <Typography variant="h4" className="text-[#dbdbdb]">DataWrangler Pro</Typography>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#5aa1d8] transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Instant search records..."
              className="bg-[#121212] border border-[#1e293b] rounded-lg pl-10 pr-4 py-2 text-sm w-80 focus:outline-none focus:ring-1 focus:ring-[#5aa1d8] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="secondary" label="Export CSV" icon={Download} onClick={() => alert("CSV Export Triggered")} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar - Wrangling Tools */}
        <aside 
          className={`bg-[#1a1a1a] border-r border-[#1e293b] transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-72' : 'w-0 opacity-0 overflow-hidden'}`}
        >
          <div className="p-6 flex flex-col gap-6">

            {/* Tool Selection */}
            <div>
              <Typography variant="h6" className="mb-4 text-[#94a3b8] block">Wrangling Tools</Typography>
              <div className="flex flex-col gap-1">
                {[
                  { id: 'search', label: 'Filter & Search', icon: Filter },
                  { id: 'transform', label: 'Schema Editor', icon: Columns },
                  { id: 'merge', label: 'Merge Logic', icon: Merge }
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all ${activeTool === tool.id ? 'bg-[#1e293b] text-[#5aa1d8]' : 'hover:bg-[#1e293b]/50 text-[#cbd5e1]'}`}
                  >
                    <tool.icon size={18} />
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Sidebar Content */}
            <div className="pt-6 border-t border-[#1e293b]">
              {activeTool === 'search' && (
                <div className="space-y-4">
                  <Typography variant="small" className="text-[#94a3b8]">Active Filters</Typography>
                  <div className="p-3 bg-[#121212] rounded-lg border border-[#1e293b]">
                    <Typography variant="p" className="text-[#cbd5e1] block mb-2">Showing {filteredData.length} of {data.length} rows</Typography>
                    {selectedRows.size > 0 && (
                      <div className="flex flex-col gap-2 mt-4">
                        <Typography variant="small" className="text-[#5aa1d8]">{selectedRows.size} rows selected</Typography>
                        <Button variant="destructive" label="Delete Selected" icon={Trash2} onClick={handleDeleteSelected} className="w-full text-xs" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTool === 'transform' && (
                <div className="space-y-4">
                  <Typography variant="small" className="text-[#94a3b8]">Modify Schema</Typography>
                  <Button variant="primary" label="New Column" icon={Plus} onClick={() => setShowNewColumnModal(true)} className="w-full" />
                  <div className="mt-4 space-y-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {columns.map(col => (
                      <div key={col} className="flex items-center justify-between p-2 rounded hover:bg-[#1e293b]">
                        <Typography variant="small" className="text-[#cbd5e1] lowercase">{col}</Typography>
                        <Typography variant="small" className="text-[#94a3b8] italic">txt</Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTool === 'merge' && (
                <div className="space-y-4">
                  <Typography variant="small" className="text-[#94a3b8]">Selection Required</Typography>
                  <div className="p-4 bg-[#1e3a8a]/20 border border-[#1e40af] rounded-lg">
                    <Typography variant="small" className="text-[#bfdbfe]">Select 2 or more rows in the table to activate merging capabilities.</Typography>
                  </div>
                  <Button 
                    variant="primary" 
                    label="Merge Selected" 
                    icon={Merge} 
                    disabled={selectedRows.size < 2} 
                    onClick={handleMergeRows}
                    className="w-full" 
                  />
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Table Area */}
        <main className="flex-1 overflow-auto bg-[#1a1a1a] p-6 custom-scrollbar">
          <div className="bg-[#1a1a1a] border border-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-[#121212] border-b border-[#1e293b]">
                    <th className="p-4 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded bg-[#1a1a1a] border-[#1e293b] text-[#5aa1d8] focus:ring-0"
                        checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRows(new Set(filteredData.map(r => r.id)));
                          else setSelectedRows(new Set());
                        }}
                      />
                    </th>
                    {columns.map(col => (
                      <th key={col} className="p-4 text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                        {col.replace(/_/g, ' ')}
                      </th>
                    ))}
                    <th className="p-4 text-xs font-semibold text-[#94a3b8] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {filteredData.map((row) => (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-[#1e293b]/30 transition-colors ${selectedRows.has(row.id) ? 'bg-[#1e3a8a]/10' : ''}`}
                    >
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.has(row.id)}
                          onChange={() => handleToggleRow(row.id)}
                          className="rounded bg-[#1a1a1a] border-[#1e293b] text-[#5aa1d8] focus:ring-0"
                        />
                      </td>
                      {columns.map(col => (
                        <td key={col} className="p-4">
                          <Typography variant="p" className={col === 'id' ? 'text-[#5aa1d8] font-mono' : 'text-[#cbd5e1]'}>
                            {String(row[col])}
                          </Typography>
                        </td>
                      ))}
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setEditingRow(row)}
                          className="p-1 hover:text-[#5aa1d8] transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <AlertCircle size={48} className="text-[#1e293b] mb-4" />
                <Typography variant="h5" className="text-[#94a3b8]">No records found matching "{searchTerm}"</Typography>
                <Typography variant="small" className="text-[#64748b] mt-1">Try adjusting your filters or clearing your search.</Typography>
                <Button variant="ghost" label="Clear Search" onClick={() => setSearchTerm("")} className="mt-4" />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Row Overlay */}
      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-[#1e293b] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#1e293b] flex justify-between items-center bg-[#121212]">
              <Typography variant="h5">Edit Record #{editingRow.id}</Typography>
              <button onClick={() => setEditingRow(null)} className="text-[#94a3b8] hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateRow} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#94a3b8] uppercase">Status</label>
                  <select name="status" defaultValue={editingRow.status} className="w-full bg-[#121212] border border-[#1e293b] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5aa1d8]">
                    {['Shipped', 'Processing', 'Cancelled', 'Returned', 'Delivered'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#94a3b8] uppercase">Price</label>
                  <input name="sale_price" type="number" step="0.01" defaultValue={editingRow.sale_price} className="w-full bg-[#121212] border border-[#1e293b] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5aa1d8]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#94a3b8] uppercase">Tags (comma separated)</label>
                <input name="tags" type="text" defaultValue={editingRow.tags} className="w-full bg-[#121212] border border-[#1e293b] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5aa1d8]" />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="secondary" label="Cancel" onClick={() => setEditingRow(null)} />
                <Button variant="primary" label="Save Changes" icon={Save} type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Column Overlay */}
      {showNewColumnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-[#1e293b] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#1e293b] bg-[#121212]">
              <Typography variant="h5">Create New Column</Typography>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-[#94a3b8] uppercase">Column Name</label>
                <input 
                  type="text" 
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="e.g. region, customer_tier"
                  className="w-full bg-[#121212] border border-[#1e293b] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5aa1d8]" 
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="secondary" label="Cancel" onClick={() => setShowNewColumnModal(false)} />
                <Button variant="primary" label="Create" onClick={handleAddColumn} />
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        input[type="checkbox"]:checked {
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
        }
      `}} />
    </div>
  );
}