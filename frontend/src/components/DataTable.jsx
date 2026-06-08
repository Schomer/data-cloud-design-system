import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Calendar, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ArrowDown, ArrowUp } from 'lucide-react';
import Typography from './Typography';
import Button from './Button';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';

export default function DataTable({
    title = "Data Table",
    subtitle = "",
    columns = [],
    data = [],
    onRowSelect,
    selectedRowId = null,
    showFilters = true,
    pagination = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => { },
    sortConfig,
    onSort,
    className = "min-h-[500px]"
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState('All Time');
    const [isDateOpen, setIsDateOpen] = useState(false);

    // Sorting & Resizing state
    const [internalSort, setInternalSort] = useState({ key: null, direction: 'asc' });
    const [columnWidths, setColumnWidths] = useState({});
    const [resizingCol, setResizingCol] = useState(null);
    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);

    const activeSort = sortConfig !== undefined ? sortConfig : internalSort;

    const handleSort = (key) => {
        let direction = 'asc';
        if (activeSort.key === key && activeSort.direction === 'asc') {
            direction = 'desc';
        }
        if (onSort) {
            onSort(key, direction);
        } else {
            setInternalSort({ key, direction });
        }
    };

    const handleResizeStart = (e, colIndex) => {
        e.stopPropagation();
        setResizingCol(colIndex);
        setStartX(e.clientX);
        const th = e.target.closest('th');
        setStartWidth(th.offsetWidth);
    };

    useEffect(() => {
        if (resizingCol === null) return;

        const handleMouseMove = (e) => {
            const currentX = e.clientX;
            const diff = currentX - startX;
            const newWidth = Math.max(50, startWidth + diff);
            setColumnWidths(prev => ({ ...prev, [resizingCol]: newWidth }));
        };

        const handleMouseUp = () => {
            setResizingCol(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingCol, startX, startWidth]);

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (activeSort.key !== null) {
            sortableData.sort((a, b) => {
                let valA = a[activeSort.key];
                let valB = b[activeSort.key];
                if (typeof valA === 'string' && valA.startsWith('$')) valA = parseFloat(valA.replace(/[^0-9.-]+/g,"")) || 0;
                if (typeof valB === 'string' && valB.startsWith('$')) valB = parseFloat(valB.replace(/[^0-9.-]+/g,"")) || 0;
                
                if (valA < valB) return activeSort.direction === 'asc' ? -1 : 1;
                if (valA > valB) return activeSort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [data, activeSort]);

    const { theme, globalSpecs } = useEditor();
    const tableSpec = globalSpecs?.[theme]?.table;

    const tableStyles = tableSpec ? {
        '--table-bg': tableSpec.bg,
        '--table-border': tableSpec.borderColor,
        '--table-radius': `${tableSpec.borderRadius}px`,
        '--table-header-text': tableSpec.headerText,
        '--table-row-text': tableSpec.rowText,
        '--table-row-border': tableSpec.rowBorder,
        borderRadius: 'var(--table-radius)',
    } : {};

    const tableContent = (
        <div style={tableStyles} className={`
            ${className}
            ${tableSpec ? 'bg-[var(--table-bg)] border-[var(--table-border)]' : 'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-xl'}
            border shadow-sm flex flex-col overflow-hidden h-full
        `}>
            {/* Header Toolbar */}
            <div className={`flex items-center justify-between p-4 border-b relative z-30 ${tableSpec ? 'border-[var(--table-border)]' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className="flex items-center gap-3">
                    <Typography variant="h6" as="h2" className="mr-4">{title}</Typography>

                    {showFilters && (
                        <>
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#262626] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                                >
                                    <Filter size={14} /> Filter
                                </button>
                                {isFilterOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-48 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-md shadow-lg z-20 p-2 text-xs text-slate-500">
                                        More filters coming soon...
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setIsDateOpen(!isDateOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-transparent bg-slate-100 dark:bg-[#262626] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <Calendar size={14} /> {dateFilter} <ChevronDown size={14} />
                                </button>
                                {isDateOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-40 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-md shadow-lg z-20 overflow-hidden">
                                        {['All Time', 'Last 7 Days', 'Last 30 Days'].map(date => (
                                            <button
                                                key={date}
                                                onClick={() => { setDateFilter(date); setIsDateOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#262626] transition-colors"
                                            >
                                                {date}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {subtitle && (
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {subtitle}
                    </div>
                )}
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto overflow-x-auto relative">
                <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
                    <thead className={`sticky top-0 z-10 border-b ${tableSpec ? 'bg-[var(--table-bg)] border-[var(--table-row-border)]' : 'bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-slate-800'}`}>
                        <tr className={`${tableSpec ? 'text-[var(--table-header-text)]' : 'text-xs font-medium text-slate-500 dark:text-slate-400'}`}>
                            {columns.map((col, idx) => (
                                <th 
                                    key={idx} 
                                    style={{ width: columnWidths[idx] || col.width || 'auto' }}
                                    className={`py-3 px-4 font-normal tracking-wide relative group ${col.className || ''} ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 select-none' : ''}`}
                                    onClick={() => col.sortable !== false && handleSort(col.accessorKey)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Typography variant={tableSpec?.headerTypography || 'xs'} style={{ color: 'inherit' }} as="span">{col.header}</Typography>
                                        {col.sortable !== false && activeSort.key === col.accessorKey && (
                                            <span className="text-slate-400 flex-shrink-0">
                                                {activeSort.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                            </span>
                                        )}
                                        {col.sortable !== false && activeSort.key !== col.accessorKey && (
                                            <span className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <ArrowUp size={14} />
                                            </span>
                                        )}
                                    </div>
                                    {col.resizable !== false && (
                                        <div 
                                            className={`absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors z-20 ${resizingCol === idx ? 'bg-blue-500' : 'bg-transparent'}`}
                                            onMouseDown={(e) => handleResizeStart(e, idx)}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${tableSpec ? 'divide-[var(--table-row-border)] text-[var(--table-row-text)]' : 'text-xs divide-slate-100 dark:divide-slate-800/80'}`}>
                        {sortedData.map((row, rowIdx) => {
                            const isSelected = selectedRowId === row.id;
                            const rowClasses = isSelected
                                ? "bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer transition-colors"
                                : "hover:bg-slate-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors"; // Slightly adjusted default hover to work better with custom rows

                            return (
                                <tr
                                    key={row.id || rowIdx}
                                    className={onRowSelect ? rowClasses : "hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"}
                                    onClick={() => onRowSelect && onRowSelect(row)}
                                >
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`py-3 px-4 ${col.cellClassName || ''}`}>
                                            <Typography variant={tableSpec?.rowTypography || 'p'} style={{ color: 'inherit' }} as="span">
                                                {col.render ? col.render(row) : row[col.accessorKey]}
                                            </Typography>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        {sortedData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="py-10 text-center text-slate-500 italic">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            {pagination && (
                <div className={`border-t p-4 flex items-center justify-between text-sm ${tableSpec ? 'border-[var(--table-border)]' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="text-slate-500 dark:text-slate-400">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(1)}
                            variant="secondary"
                            className="p-1 px-1.5"
                            aria-label="First page"
                        >
                            <ChevronsLeft size={16} />
                        </Button>
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            variant="secondary"
                            className="p-1 px-1.5"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            variant="secondary"
                            className="p-1 px-1.5"
                            aria-label="Next page"
                        >
                            <ChevronRight size={16} />
                        </Button>
                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(totalPages)}
                            variant="secondary"
                            className="p-1 px-1.5"
                            aria-label="Last page"
                        >
                            <ChevronsRight size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );

    return tableSpec ? (
        <EditableWrapper type="table" hideSkillButton={true} className="h-full w-full">
            {tableContent}
        </EditableWrapper>
    ) : tableContent;
}
