import React, { useState, useMemo, useEffect } from 'react';

/**
 * Client Feedback Prioritizer
 * A React application for triaging customer feedback using keyword scanning 
 * and a functional Kanban board for manual overrides.
 */

// --- Constants & Logic ---
const PRIORITY_KEYWORDS = ['broken', 'disaster', 'subscribing', 'cancel', 'urgent', 'error', 'stop', 'quit'];

const SCORE_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

const COLUMN_CONFIG = [
  { id: SCORE_LEVELS.HIGH, color: '#ef4444' }, // Red
  { id: SCORE_LEVELS.MEDIUM, color: '#f59e0b' }, // Amber
  { id: SCORE_LEVELS.LOW, color: '#62a8ea' } // Blue (from palette)
];

const calculateHeatScore = (urgent, feedback) => {
  const hasKeyword = PRIORITY_KEYWORDS.some(kw => 
    feedback.toLowerCase().includes(kw.toLowerCase())
  );
  if (urgent || hasKeyword) return SCORE_LEVELS.HIGH;

  // Default logic for Medium vs Low: Length of feedback or presence of specific feature words
  if (feedback.length > 100) return SCORE_LEVELS.MEDIUM;
  return SCORE_LEVELS.LOW;
};

// --- Mock Data Generator ---
const generateMockTickets = () => {
  const clients = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Co', 'Hooli', 'Pied Piper', 'Stark Ind'];
  const features = ['API Access', 'Mobile App', 'SSO Login', 'Reporting Dashboard', 'Email Alerts', 'Dark Mode'];

  return Array.from({ length: 25 }, (_, i) => {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const feature = features[Math.floor(Math.random() * features.length)];
    const isUrgent = Math.random() > 0.8;
    const rawFeedback = [
      "The dashboard is totally broken and I can't see stats.",
      "Just curious if you'll ever add a dark mode option.",
      "Thinking about subscribing next month if you add SSO.",
      "Please cancel my account, this is a disaster.",
      "The API response time is a bit slow today.",
      "I love the new UI, but the export button is missing.",
      "We need email alerts for critical failures immediately.",
      "Great work on the last update, keep it up!"
    ][Math.floor(Math.random() * 8)];

    const score = calculateHeatScore(isUrgent, rawFeedback);

    return {
      id: `ticket-${i}`,
      clientName: client,
      featureRequested: feature,
      urgent: isUrgent,
      feedback: rawFeedback,
      score: score,
      createdAt: new Date(Date.now() - Math.random() * 100000000).toLocaleDateString()
    };
  });
};

export default function ClientFeedbackPrioritizer() {
  const [tickets, setTickets] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    featureRequested: '',
    urgent: false,
    feedback: ''
  });

  // Initialization
  useEffect(() => {
    setTickets(generateMockTickets());
  }, []);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.feedback) return;

    const newScore = calculateHeatScore(formData.urgent, formData.feedback);
    const newTicket = {
      id: `ticket-${Date.now()}`,
      ...formData,
      score: newScore,
      createdAt: new Date().toLocaleDateString()
    };

    setTickets([newTicket, ...tickets]);
    setFormData({ clientName: '', featureRequested: '', urgent: false, feedback: '' });
  };

  // --- Drag & Drop Handlers ---
  const onDragStart = (e, ticketId) => {
    e.dataTransfer.setData('ticketId', ticketId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetScore) => {
    const ticketId = e.dataTransfer.getData('ticketId');
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, score: targetScore } : t
    ));
  };

  // --- Render Helpers ---
  const getTicketsByScore = (score) => tickets.filter(t => t.score === score);

  return (
    <div className="min-h-screen font-['Inter',sans-serif] bg-[#ffffff] dark:bg-[#1a1a1a] text-[#475569] dark:text-[#cbd5e1]">
      {/* Top Header */}
      <header className="w-full h-16 flex items-center justify-between px-6 border-b border-[#e2e8f0] dark:border-[#1e293b] bg-[#ffffff] dark:bg-[#1a1a1a] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] rounded-md transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#f8fafc]">
            Client Feedback Prioritizer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
             <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total Feedback Tasks</span>
             <span style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#f8fafc]">{tickets.length}</span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar: New Ticket Form */}
        <aside 
          className={`bg-[#ffffff] dark:bg-[#1a1a1a] border-r border-[#e2e8f0] dark:border-[#1e293b] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0 opacity-0 pointer-events-none'}`}
        >
          <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto w-80">
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#5c5c5c' }} className="dark:text-[#f8fafc]">New Ticket</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }} className="uppercase tracking-wider">Client Name</label>
                <input 
                  type="text" 
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Acme Corp"
                  className="bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3b82f6] text-[#0f172a] dark:text-[#f8fafc]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }} className="uppercase tracking-wider">Feature Requested</label>
                <input 
                  type="text" 
                  name="featureRequested"
                  value={formData.featureRequested}
                  onChange={handleInputChange}
                  placeholder="SSO, Mobile app..."
                  className="bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3b82f6] text-[#0f172a] dark:text-[#f8fafc]"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="urgent-check"
                  name="urgent"
                  checked={formData.urgent}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-[#e2e8f0] text-[#598dc5]"
                />
                <label htmlFor="urgent-check" style={{ fontSize: '14px', color: '#475569' }} className="dark:text-[#cbd5e1]">Mark as Urgent</label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }} className="uppercase tracking-wider">Raw Feedback Text</label>
                <textarea 
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  placeholder="Paste customer comments here..."
                  rows={4}
                  className="bg-[#ffffff] dark:bg-[#121212] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#3b82f6] text-[#0f172a] dark:text-[#f8fafc] resize-none"
                  required
                />
                <p style={{ fontSize: '12px', color: '#94a3b8' }} className="italic mt-1">
                  Heat Score is auto-assigned based on priority keywords.
                </p>
              </div>

              <button 
                type="submit"
                className="mt-4 bg-[#598dc5] dark:bg-[#5aa1d8] hover:bg-[#054aa3] dark:hover:bg-[#3875a3] text-[#ffffff] dark:text-[#000000] rounded-[5px] px-4 py-2 font-medium text-[14px] transition-all"
              >
                Add Feedback
              </button>
            </form>
          </div>
        </aside>

        {/* Main Kanban Board */}
        <main className="flex-1 overflow-x-auto bg-[#f8fafc] dark:bg-[#121212] p-6">
          <div className="flex gap-6 h-full min-w-[900px]">
            {COLUMN_CONFIG.map(column => (
              <div 
                key={column.id}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, column.id)}
                className="flex-1 min-w-[300px] flex flex-col gap-4"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: column.color }}
                    />
                    <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }} className="uppercase tracking-widest dark:text-[#94a3b8]">
                      {column.id} Priority
                    </h2>
                  </div>
                  <span className="bg-[#e2e8f0] dark:bg-[#1e293b] px-2 py-0.5 rounded text-[12px] font-bold text-[#475569] dark:text-[#cbd5e1]">
                    {getTicketsByScore(column.id).length}
                  </span>
                </div>

                {/* Column Body / Drop Zone */}
                <div className="flex-1 bg-[#e2e8f0] bg-opacity-30 dark:bg-[#1e293b] dark:bg-opacity-20 rounded-xl p-3 flex flex-col gap-3 overflow-y-auto border border-dashed border-[#cbd5e7] dark:border-[#334155]">
                  {getTicketsByScore(column.id).map(ticket => (
                    <div
                      key={ticket.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, ticket.id)}
                      className="bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#457bb5' }} className="dark:text-[#60a5fa]">
                          {ticket.clientName}
                        </span>
                        {ticket.urgent && (
                          <span className="bg-[#fee2e2] text-[#ef4444] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Urgent
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '14px', color: '#334155' }} className="dark:text-[#cbd5e1] mb-3 line-clamp-3">
                        {ticket.feedback}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f1f5f9] dark:border-[#262626]">
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{ticket.featureRequested || 'General'}</span>
                        <span style={{ fontSize: '10px', color: '#cbd5e1' }} className="dark:text-[#64748b]">{ticket.createdAt}</span>
                      </div>
                    </div>
                  ))}

                  {getTicketsByScore(column.id).length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center px-4">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      <p style={{ fontSize: '12px', fontStyle: 'italic' }}>Drag items here to re-prioritize</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Floating Action Hint */}
      <div className="fixed bottom-6 right-6 bg-[#1e293b] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#0f172a] px-4 py-2 rounded-full shadow-lg text-[12px] flex items-center gap-2 pointer-events-none animate-pulse">
        <span className="w-2 h-2 bg-[#10b981] rounded-full"></span>
        AI Scanner Active
      </div>
    </div>
  );
}