import React from 'react';
import { Filter, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionTable({ transactions, selectedTx, onSelect }) {
    const getRiskWidth = (score) => {
        // scale from 0 to 1, cap at 100%
        const numeric = parseFloat(score);
        if (isNaN(numeric)) return '0%';
        return `${Math.min(numeric * 100, 100)}%`;
    };

    const getRiskColorClass = (score) => {
        const s = parseFloat(score);
        if (s > 0.8) return 'bg-rose-500';
        if (s > 0.4) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-full min-h-[600px]">

            {/* Header Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mr-4">Transactions</h2>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#262626] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-[#262626] text-slate-700 dark:text-slate-300">
                        <Calendar size={14} /> January, 2026
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-[#262626] text-slate-700 dark:text-slate-300">
                        <User size={14} /> Review Needed
                    </div>
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    15,647
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white dark:bg-[#1a1a1a] z-10 border-b border-slate-200 dark:border-slate-800">
                        <tr className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            <th className="py-3 px-4 font-normal tracking-wide">Transaction ID</th>
                            <th className="py-3 px-4 font-normal tracking-wide">Date/Time</th>
                            <th className="py-3 px-4 font-normal tracking-wide">Amount</th>
                            <th className="py-3 px-4 font-normal tracking-wide">Risk Score</th>
                            <th className="py-3 px-4 font-normal tracking-wide hidden xl:table-cell">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800/80">
                        {transactions.map(tx => {
                            const isSelected = selectedTx?.transaction_id === tx.transaction_id;
                            // Add opacity classes or backgrounds based on selection
                            const rowClasses = isSelected
                                ? "bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer transition-colors"
                                : "hover:bg-slate-50 dark:hover:bg-[#262626] cursor-pointer transition-colors";

                            return (
                                <tr
                                    key={tx.transaction_id}
                                    className={rowClasses}
                                    onClick={() => onSelect(tx)}
                                >
                                    <td className="py-2.5 px-4 font-mono truncate max-w-[140px] text-slate-500 dark:text-slate-400" title={tx.transaction_id}>
                                        {tx.transaction_id}
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-900 dark:text-slate-300 whitespace-nowrap">
                                        {format(new Date(tx.event_ts), 'MMM dd, yyyy, HH:mm')}
                                    </td>
                                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-300">
                                        ${tx.amount?.toFixed(2)}
                                    </td>
                                    <td className="py-2.5 px-4 w-48">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${getRiskColorClass(tx.predicted_is_fraud)}`}
                                                    style={{ width: getRiskWidth(tx.predicted_is_fraud) }}
                                                />
                                            </div>
                                            <span className="text-slate-500 dark:text-slate-400 w-8 text-right font-mono text-[10px]">
                                                {(tx.predicted_is_fraud || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 hidden xl:table-cell">
                                        <span className="text-slate-600 dark:text-slate-300">
                                            {tx.investigation_status === 'PENDING' ? 'Review Needed' : tx.investigation_status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
