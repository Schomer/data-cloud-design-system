import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';
import Typography from './Typography';

export default function KPICard({
    title,
    value = "0",
    trend = "0%",
    isPositive = true,
    isLoading = false
}) {
    // Attempt to grab context safely
    const { theme, globalSpecs } = useEditor();
    const cardSpec = globalSpecs?.[theme]?.card;

    const displayTitle = title || cardSpec?.defaultTitle;

    const cardStyles = cardSpec ? {
        backgroundColor: cardSpec.bg,
        borderColor: cardSpec.borderColor,
        borderRadius: `${cardSpec.borderRadius}px`,
        padding: `${cardSpec.padding}px`,
    } : {};

    const cardContent = (
        <div style={cardStyles} className={`
            ${!cardSpec ? 'bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-slate-800 rounded-xl p-5' : ''}
            border shadow-sm flex flex-col gap-4 justify-between w-full transition-colors
        `}>
            <Typography variant={cardSpec?.titleTypography || 'xs'} style={{ color: cardSpec ? cardSpec.titleColor : 'inherit' }} as="div" className={`text-sm font-medium ${!cardSpec ? 'text-slate-500 dark:text-slate-400' : ''}`}>
                {displayTitle}
            </Typography>
            <Typography variant={cardSpec?.valueTypography || 'h2'} style={{ color: cardSpec ? cardSpec.valueColor : 'inherit' }} as="div" className={`text-3xl font-semibold tracking-tight ${!cardSpec ? 'text-slate-900 dark:text-[#3b82f6]' : ''}`}>
                {value}
            </Typography>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded-md w-max flex items-center gap-1 ${isPositive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-[#a3a3a3]'
                }`}>
                {String(trend).replace(/[+-]/, '')}%
                {String(trend).includes('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
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
