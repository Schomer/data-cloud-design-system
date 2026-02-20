import React, { useState } from 'react';
import axios from 'axios';
import { X, Send } from 'lucide-react';
import { format } from 'date-fns';

const API_BASE = '/api';

export default function InvestigationPanel({ transaction, onClose, onUpdateStatus }) {
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const getRiskLabel = (score) => {
        const s = parseFloat(score);
        if (s > 0.8) return { label: 'High', color: 'bg-rose-500 text-white' };
        if (s > 0.4) return { label: 'Medium-High', color: 'bg-amber-400 text-amber-900' };
        return { label: 'Low', color: 'bg-emerald-500 text-white' };
    };

    const risk = getRiskLabel(transaction.predicted_is_fraud);

    const handleSendChat = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        const apiMessage = `[System: The following is the data for the transaction the user is currently looking at. Use it to answer their question: ${JSON.stringify({ transaction_id: transaction.transaction_id, amount: transaction.amount, payee_name: transaction.payee_name, payor_name: transaction.payor_name, payor_account_age_days: transaction.payor_account_age_days, payor_risk_score: transaction.payor_risk_score, predicted_is_fraud: transaction.predicted_is_fraud, investigation_status: transaction.investigation_status })}]\n\nUser Question: ${userMsg}`;

        try {
            // Send history so model remembers context
            const res = await axios.post(`${API_BASE}/chat`, {
                message: apiMessage,
                transaction_id: transaction.transaction_id,
                history: messages
            });
            setMessages(prev => [...prev, { role: 'model', content: res.data.response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Error communicating with Gemini Analytics API." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[600px] overflow-hidden relative">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Risk Score</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono">7/10</span>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1 pb-24 space-y-6">

                {/* Risk Level */}
                <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Risk Level</div>
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-md inline-block ${risk.color}`}>
                        {risk.label}
                    </div>
                </div>

                <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Amount</div>
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-md inline-block bg-rose-500 text-white`}>
                        High
                    </div>
                </div>

                {/* Transaction Details */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Transaction details</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Merchant</div>
                            <div className="text-sm text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-[#262626] border border-slate-100 dark:border-slate-800 rounded-md px-3 py-2">
                                {transaction.payee_name}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Amount</div>
                            <div className="text-sm text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-[#262626] border border-slate-100 dark:border-slate-800 rounded-md px-3 py-2 font-mono">
                                ${transaction.amount?.toFixed(2)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Date</div>
                            <div className="text-sm text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-[#262626] border border-slate-100 dark:border-slate-800 rounded-md px-3 py-2">
                                {format(new Date(transaction.event_ts), 'MMM dd, yyyy, HH:mm')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Customer details</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Customer ID</div>
                            <div className="text-sm text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-[#262626] border border-slate-100 dark:border-slate-800 rounded-md px-3 py-2 font-mono truncate">
                                {transaction.payor_id || 'Unknown'} - {transaction.payor_name}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Account Age</div>
                            <div className="text-sm text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-[#262626] border border-slate-100 dark:border-slate-800 rounded-md px-3 py-2 font-mono">
                                {transaction.payor_account_age_days} days
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">Risk Score</div>
                            <div className="text-sm text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-[#262626] border border-slate-100 dark:border-slate-800 rounded-md px-3 py-2 font-mono">
                                {transaction.payor_risk_score}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <button
                        onClick={() => onUpdateStatus(transaction.transaction_id, 'CLEARED')}
                        className="flex-1 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#262626] border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                        Clear Transaction
                    </button>
                    <button
                        onClick={() => onUpdateStatus(transaction.transaction_id, 'FRAUD')}
                        className="flex-1 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-md transition"
                    >
                        Mark as Fraud
                    </button>
                </div>

                {/* Gemini Chat Log */}
                <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">AI Investigation</h3>
                    <div className="space-y-4 mb-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`p-3 rounded-lg text-sm ${m.role === 'user'
                                ? 'bg-[#2563eb]/10 text-[#2563eb] dark:text-[#60a5fa] ml-6'
                                : 'bg-slate-50 dark:bg-[#262626] text-slate-700 dark:text-slate-300 mr-6'
                                }`}>
                                {m.content}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="p-3 rounded-lg text-sm bg-slate-50 dark:bg-[#262626] text-slate-500 italic mr-6 max-w-fit">
                                Gemini is analyzing...
                            </div>
                        )}
                        {messages.length === 0 && (
                            <div className="text-xs text-slate-400 text-center italic">
                                Ask a question to start investigating with Gemini Data Analytics.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Input sticky bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#1a1a1a] border-t border-slate-200 dark:border-slate-800">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask AI about this transaction..."
                        className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-[#262626] border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2563eb]/50 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={isTyping || !chatInput.trim()}
                        className="p-2 rounded-full bg-[#2563eb] text-white disabled:opacity-50 transition"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>

        </div>
    );
}
