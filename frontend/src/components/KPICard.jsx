import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';

export default function KPICard({
    title = "Metric",
    value = "0",
    trend = "0%",
    isPositive = true,
    isLoading = false
}) {
    // Attempt to grab context safely (in case KPICard is ever used outside EditorProvider, though it shouldn't be here)
    let cardSpec;
    try {
        const { globalSpecs } = useEditor();
        cardSpec = globalSpecs?.card;
    } catch (e) {
        // Fallback or ignore if not in context
    }

    const isDarkMode = document.documentElement.classList.contains('dark');

    const displayTitle = title || cardSpec?.defaultTitle || "Metric";

    const cardStyles = cardSpec ? {
        '--card-bg': cardSpec.bg,
        '--card-dark-bg': cardSpec.darkBg,
        '--card-border': cardSpec.borderColor,
        '--card-dark-border': cardSpec.darkBorderColor,
        '--card-radius': `${cardSpec.borderRadius}px`,
        '--card-padding': `${cardSpec.padding}px`,
        '--card-title': cardSpec.titleColor,
        '--card-dark-title': cardSpec.darkTitleColor,
        '--card-value': cardSpec.valueColor,
        '--card-dark-value': cardSpec.darkValueColor,
        borderRadius: 'var(--card-radius)',
        padding: 'var(--card-padding)',
    } : {};

    const cardContent = (
        <div style={cardStyles} className={`
            ${cardSpec ? 'bg-[var(--card-bg)] dark:bg-[var(--card-dark-bg)] border-[var(--card-border)] dark:border-[var(--card-dark-border)]' : 'bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-slate-800 rounded-xl p-5'}
            border shadow-sm flex flex-col justify-between h-[120px] w-full transition-colors
        `}>
            <div className={`text-sm font-medium ${cardSpec ? 'text-[var(--card-title)] dark:text-[var(--card-dark-title)]' : 'text-slate-500 dark:text-slate-400'}`}>
                {displayTitle}
            </div>
            <div className={`text-3xl font-semibold tracking-tight ${cardSpec ? 'text-[var(--card-value)] dark:text-[var(--card-dark-value)]' : 'text-slate-900 dark:text-[#3b82f6]'}`}>
                {value}
            </div>
            <div className={`text-xs font-semibold px-2 py-0.5 mt-1 rounded-md w-max flex items-center gap-1 ${isPositive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-[#a3a3a3]'
                }`}>
                {trend.replace(/[+-]/, '')}%
                {trend.includes('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            </div>
        </div>
    );

    // If we have cardSpec (meaning we're inside EditorProvider), wrap it. Otherwise, render bare card.
    return cardSpec ? (
        <EditableWrapper type="card" className="w-full">
            {cardContent}
        </EditableWrapper>
    ) : cardContent;
}
