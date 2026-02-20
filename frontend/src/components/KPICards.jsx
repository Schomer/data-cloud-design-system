import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const kpiData = [
    { title: "Review Queue", value: "12,348", trend: "-2.1%", isPositive: true },
    { title: "High Risk", value: "645", trend: "+5.1%", isPositive: false },
    { title: "Cleared Today", value: "12,817", trend: "+12.4%", isPositive: true },
    { title: "Fraud Marked", value: "278", trend: "-1.1%", isPositive: true },
];

export default function KPICards() {
    return (
        <div className="grid grid-cols-4 gap-4">
            {kpiData.map((kpi, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a1a1a] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[120px]">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {kpi.title}
                    </div>
                    <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-[#3b82f6]">
                        {kpi.value}
                    </div>
                    <div className={`text-xs font-semibold px-2 py-0.5 mt-1 rounded-md w-max flex items-center gap-1 ${kpi.isPositive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-[#a3a3a3]'
                        }`}>
                        {kpi.trend.replace(/[+-]/, '')}%
                        {kpi.trend.includes('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    </div>
                </div>
            ))}
        </div>
    );
}
