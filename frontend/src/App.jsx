import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Moon, Sun } from 'lucide-react';
import KPICards from './components/KPICards';
import TransactionTable from './components/TransactionTable';
import InvestigationPanel from './components/InvestigationPanel';

const API_BASE = '/api';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [selectedTx, setSelectedTx] = useState(null);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        // Apply dark mode class to html element
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${API_BASE}/transactions`);
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const updateStatus = async (txId, status) => {
        try {
            await axios.patch(`${API_BASE}/transactions/${txId}`, { status });
            // Remove from list
            setTransactions(prev => prev.filter(t => t.transaction_id !== txId));
            if (selectedTx?.transaction_id === txId) {
                setSelectedTx(null);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <div className="max-w-[1600px] mx-auto p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Transaction Review Queue</h1>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                {/* KPIs */}
                <KPICards />

                {/* Layout */}
                <div className="flex gap-4 mt-6">
                    <div className={`transition-all duration-300 ${selectedTx ? 'w-2/3' : 'w-full'}`}>
                        <TransactionTable
                            transactions={transactions}
                            selectedTx={selectedTx}
                            onSelect={setSelectedTx}
                        />
                    </div>

                    {selectedTx && (
                        <div className="w-1/3">
                            <InvestigationPanel
                                transaction={selectedTx}
                                onClose={() => setSelectedTx(null)}
                                onUpdateStatus={updateStatus}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default App;
