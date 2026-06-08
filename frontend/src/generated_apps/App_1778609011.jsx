import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Trash2, 
  Filter,
  BarChart3,
  Users,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

/**
 * ClientFeedbackPrioritizer
 * A robust React application for triaging and managing customer feedback.
 */
export default function ClientFeedbackPrioritizer() {
  // --- Constants & Logic ---
  const PRIORITY_KEYWORDS = ['broken', 'disaster', 'subscribing', 'cancel', 'error', 'failed', 'urgent'];
  const COLUMNS = [
    { id: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
    { id: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    { id: 'High', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertTriangle },
  ];

  const calculateHeatScore = (text, urgent) => {
    const hasKeyword = PRIORITY_KEYWORDS.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    if (urgent || hasKeyword) return 'High';
    if (text.length > 100) return 'Medium';
    return 'Low';
  };

  // --- Mock Data Generation ---
  const generateMockData = () => {
    const clients = ["GlobalCorp", "TechStart", "Innovate-X", "CloudNine", "NexusGroup", "DataDynamics", "SoftSystems", "VertexInc"];
    const features = ["Dashboard Analytics", "SSO Login", "API Integration", "Mobile App", "Bulk Export", "User Permissions"];
    const snippets = [
      "The dashboard is totally broken and we can't see stats.",
      "Just wanted to say the new UI is great, maybe add dark mode?",
      "Thinking about subscribing to the Pro plan next month.",
      "Please cancel our account immediately, the disaster of an update is too much.",
      "Is it possible to export to PDF? This would be a nice-to-have.",
      "SSO login failed for 50 users this morning. Critical!",
      "I am having trouble finding the settings menu.",
      "The API response time is a bit slow under heavy load.",
      "We need a way to filter by region in the main view."
    ];

    return Array.from({ length: 200 }, (_, i) => {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const feature = features[Math.floor(Math.random() * features.length)];
      const rawText = snippets[Math.floor(Math.random() * snippets.length)];
      const isUrgent = Math.random() > 0.85;

      return {
        id: `ticket-${i}`,
        client,
        feature,
        isUrgent,
        text: rawText,
        score: calculateHeatScore(rawText, isUrgent),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
      };
    });
  };

  // --- State ---
  const [tickets, setTickets] = useState(generateMockData());
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    client: '',
    feature: '',
    isUrgent: false,
    text: ''
  });

  // --- Handlers ---
  const handleAddTicket = (e) => {
    e.preventDefault();
    if (!newTicket.client || !newTicket.text) return;

    const ticket = {
      ...newTicket,
      id: `ticket-${Date.now()}`,
      score: calculateHeatScore(newTicket.text, newTicket.isUrgent),
      createdAt: new Date().toLocaleDateString()
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ client: '', feature: '', isUrgent: false, text: '' });
    setIsFormOpen(false);
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  // --- Drag and Drop Logic ---
  const [draggedId, setDraggedId] = useState(null);

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetScore) => {
    e.preventDefault();
    setTickets(prev => prev.map(t => 
      t.id === draggedId ? { ...t, score: targetScore } : t
    ));
    setDraggedId(null);
  };

  // --- Memoized Derived Data ---
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => 
      t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.feature.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tickets, searchQuery]);

  const stats = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    tickets.forEach(t => counts[t.score]++);
    return [
      { name: 'Low', value: counts.Low, fill: '#10b981' },
      { name: 'Medium', value: counts.Medium, fill: '#f59e0b' },
      { name: 'High', value: counts.High, fill: '#f43f5e' }
    ];
  }, [tickets]);

  // --- UI Components ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <MessageSquare size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FeedbackPrioritizer</h1>
              <p className="text-xs text-slate-500 font-medium uppercase">Customer Success Ops</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search tickets, clients..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 rounded-lg text-sm transition-all w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              <Plus size={18} />
              New Ticket
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'board' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <BarChart3 size={18} /> Triage Board
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users size={18} /> Feedback Analytics
          </button>
        </div>

        {activeTab === 'board' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-[calc(100vh-220px)] overflow-hidden">
            {COLUMNS.map((col) => (
              <div 
                key={col.id}
                className="flex flex-col h-full bg-slate-200/50 rounded-2xl border-2 border-dashed border-transparent transition-all overflow-hidden"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className={`p-4 flex items-center justify-between border-b ${col.color} bg-white shadow-sm`}>
                  <div className="flex items-center gap-2">
                    <col.icon size={20} />
                    <h3 className="font-bold text-lg">{col.id} Priority</h3>
                  </div>
                  <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-black shadow-sm">
                    {filteredTickets.filter(t => t.score === col.id).length}
                  </span>
                </div>

                {/* Column Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300">
                  {filteredTickets
                    .filter(t => t.score === col.id)
                    .map(ticket => (
                      <div 
                        key={ticket.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, ticket.id)}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-grab active:cursor-grabbing group transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {ticket.client}
                          </span>
                          <button 
                            onClick={() => deleteTicket(ticket.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors">
                          {ticket.feature}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 italic">
                          "{ticket.text}"
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                            <Clock size={12} />
                            {ticket.createdAt}
                          </div>
                          {ticket.isUrgent && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 animate-pulse">
                              URGENT
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="text-indigo-500" /> Heat Score Distribution
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}} 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-lg font-bold mb-2">Total Feedback Processed</h3>
                <p className="text-5xl font-black mb-4">{tickets.length}</p>
                <div className="flex items-center gap-4 text-indigo-100 text-sm">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> {Math.round((stats[0].value/tickets.length)*100)}% Optimized</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-400 rounded-full" /> {stats[2].value} Critical Issues</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold mb-4">Top Triage Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_KEYWORDS.map(word => {
                    const count = tickets.filter(t => t.text.toLowerCase().includes(word)).length;
                    return (
                      <div key={word} className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                        <span className="font-bold text-slate-700 capitalize">{word}</span>
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-black">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-over Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus className="text-indigo-600" /> Log New Feedback
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <ChevronRight size={24} />
              </button>
            </div>

            <form onSubmit={handleAddTicket} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Client Name</label>
                <input 
                  autoFocus
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Acme Corp"
                  value={newTicket.client}
                  onChange={(e) => setNewTicket({...newTicket, client: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Feature Reference</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Navigation Bar"
                  value={newTicket.feature}
                  onChange={(e) => setNewTicket({...newTicket, feature: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-rose-500" />
                  <div>
                    <p className="text-sm font-bold text-rose-900">Mark as Urgent?</p>
                    <p className="text-xs text-rose-700">This automatically sets Heat Score to 'High'</p>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  className="w-6 h-6 rounded-lg text-rose-600 focus:ring-rose-500 border-rose-300 cursor-pointer"
                  checked={newTicket.isUrgent}
                  onChange={(e) => setNewTicket({...newTicket, isUrgent: e.target.checked})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Raw Feedback Text</label>
                <textarea 
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder="Paste customer message here..."
                  value={newTicket.text}
                  onChange={(e) => setNewTicket({...newTicket, text: e.target.value})}
                />
                <p className="mt-2 text-[11px] text-slate-400 font-medium">
                  Scanning for: {PRIORITY_KEYWORDS.join(', ')}
                </p>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  Analyze & Prioritize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interaction Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}