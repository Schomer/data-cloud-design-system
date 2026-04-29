import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, ChevronDown, Check, X, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';
import Button from './Button';

function AdvancedFiltersGallery({ filterChipStyleVars, inputStyleVars, inputClasses }) {
    const mockFields = [
        { name: 'Product Name', type: 'text' },
        { name: 'Category', type: 'text' },
        { name: 'Revenue', type: 'number' },
        { name: 'Quantity', type: 'number' },
        { name: 'Order Date', type: 'date' }
    ];

    const [activeFilters, setActiveFilters] = useState([
        { id: 'f1', field: mockFields[0], value: '' },
        { id: 'f2', field: mockFields[2], value: '' },
        { id: 'f3', field: mockFields[4], value: '' }
    ]);
    const [showFieldPicker, setShowFieldPicker] = useState(false);

    const [textSearch, setTextSearch] = useState({});
    const [showTextDropdown, setShowTextDropdown] = useState({});
    const [dateMode, setDateMode] = useState({});
    const [numberVal, setNumberVal] = useState({});
    const [numberOp, setNumberOp] = useState({});
    const [showNumberPopup, setShowNumberPopup] = useState({});

    const mockTextValues = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Omega', 'Sigma'];

    const addFilter = (field) => {
        setActiveFilters([...activeFilters, { id: Date.now().toString(), field, value: '' }]);
        setShowFieldPicker(false);
    };

    const removeFilter = (id) => {
        setActiveFilters(activeFilters.filter(f => f.id !== id));
    };

    return (
        <div className="md:col-span-3 p-6 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center gap-3" style={filterChipStyleVars}>
                {activeFilters.map(filter => (
                    <EditableWrapper key={filter.id} type="filterChip">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 font-medium text-xs border" style={{ backgroundColor: 'var(--chip-bg)', borderColor: 'var(--chip-border)', color: 'var(--chip-text)', borderRadius: 'var(--chip-radius, 9999px)' }}>
                            {filter.field.name}
                            <button onClick={() => removeFilter(filter.id)} className="opacity-70 hover:opacity-100 rounded-full p-0.5"><X size={12} /></button>
                        </div>
                    </EditableWrapper>
                ))}
                
                <div className="relative">
                    <EditableWrapper type="button" variant="secondary">
                        <Button
                            variant="secondary"
                            onClick={() => setShowFieldPicker(!showFieldPicker)}
                            className="border-dashed px-3 py-1.5 text-sm"
                        >
                            + Add Filter
                        </Button>
                    </EditableWrapper>
                    
                    {showFieldPicker && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md overflow-hidden z-10">
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">Add Condition</div>
                            {mockFields.map((field, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => addFilter(field)}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    {field.name} <span className="text-xs text-slate-400 capitalize ml-2">({field.type})</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter Conditions</h4>
                {activeFilters.length === 0 && <p className="text-sm text-slate-500">No active filters.</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-visible">
                    {activeFilters.map(filter => (
                        <div key={filter.id}>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{filter.field.name}</label>
                            
                            {filter.field.type === 'text' && (
                                <div className="relative">
                                    <EditableWrapper type="input">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search values..."
                                                style={inputStyleVars}
                                                className={inputClasses}
                                                value={textSearch[filter.id] || ''}
                                                onChange={(e) => setTextSearch({...textSearch, [filter.id]: e.target.value})}
                                                onFocus={() => setShowTextDropdown({...showTextDropdown, [filter.id]: true})}
                                                onBlur={() => setTimeout(() => setShowTextDropdown({...showTextDropdown, [filter.id]: false}), 200)}
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                                <Search size={14} />
                                            </div>
                                        </div>
                                    </EditableWrapper>
                                    {showTextDropdown[filter.id] && (
                                        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 max-h-40 overflow-y-auto">
                                            {mockTextValues.filter(v => v.toLowerCase().includes((textSearch[filter.id] || '').toLowerCase())).map(val => (
                                                <div key={val} className="px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                onClick={() => setTextSearch({...textSearch, [filter.id]: val})}>
                                                    {val}
                                                </div>
                                            ))}
                                            {mockTextValues.filter(v => v.toLowerCase().includes((textSearch[filter.id] || '').toLowerCase())).length === 0 && (
                                                <div className="px-3 py-1.5 text-sm text-slate-400">No matches...</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {filter.field.type === 'number' && (
                                <div className="relative">
                                    <EditableWrapper type="input">
                                        <button 
                                            onClick={() => setShowNumberPopup({...showNumberPopup, [filter.id]: !showNumberPopup[filter.id]})}
                                            style={inputStyleVars} 
                                            className={`${inputClasses} flex justify-between items-center text-left w-full h-[36px]`}
                                        >
                                            <span className="truncate">
                                                {numberVal[filter.id] ? `${numberOp[filter.id] || '>'} ${numberVal[filter.id]}` : 'Any number'}
                                            </span>
                                            <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                                        </button>
                                    </EditableWrapper>
                                    {showNumberPopup[filter.id] && (
                                        <div className="absolute top-full left-0 mt-1 w-64 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <select 
                                                    style={inputStyleVars} 
                                                    className={`${inputClasses} !w-auto !px-1`}
                                                    value={numberOp[filter.id] || '>'}
                                                    onChange={(e) => setNumberOp({...numberOp, [filter.id]: e.target.value})}
                                                >
                                                    <option value=">">{'>'}</option>
                                                    <option value="<">{'<'}</option>
                                                    <option value="=">{'='}</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    placeholder="Value"
                                                    value={numberVal[filter.id] || ''}
                                                    onChange={(e) => setNumberVal({...numberVal, [filter.id]: e.target.value})}
                                                    style={inputStyleVars}
                                                    className={`${inputClasses} flex-1`}
                                                />
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                    <span>0</span>
                                                    <span>1000</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="0" max="1000" 
                                                    value={numberVal[filter.id] || 0}
                                                    onChange={(e) => setNumberVal({...numberVal, [filter.id]: e.target.value})}
                                                    className="w-full accent-blue-500" 
                                                />
                                            </div>
                                            <div className="mt-2 text-right">
                                                <Button variant="primary" className="px-3 py-1 text-xs" onClick={() => setShowNumberPopup({...showNumberPopup, [filter.id]: false})}>Apply</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {filter.field.type === 'date' && (
                                <EditableWrapper type="input">
                                    <div className="flex flex-col gap-2">
                                        <div className="relative">
                                            <select 
                                                style={inputStyleVars} 
                                                className={`${inputClasses} appearance-none`}
                                                value={dateMode[filter.id] || 'preset'}
                                                onChange={(e) => setDateMode({...dateMode, [filter.id]: e.target.value})}
                                            >
                                                <option value="today">Today</option>
                                                <option value="preset">Last 7 Days</option>
                                                <option value="30days">Last 30 Days</option>
                                                <option value="custom">Custom Range...</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                        {(dateMode[filter.id] === 'custom') && (
                                            <div className="relative flex items-center">
                                                <input
                                                    type="date"
                                                    style={inputStyleVars}
                                                    className={`${inputClasses} rounded-r-none border-r-0 !px-2`}
                                                />
                                                <input
                                                    type="date"
                                                    style={inputStyleVars}
                                                    className={`${inputClasses} rounded-l-none !px-2`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </EditableWrapper>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ControlsGallery() {
    const [toggleOn, setToggleOn] = useState(true);
    const [radioVal, setRadioVal] = useState('option1');
    const [checkboxVal, setCheckboxVal] = useState(true);
    const [segmentedVal, setSegmentedVal] = useState('daily');
    const { theme, globalSpecs } = useEditor();
    const btnSpec = globalSpecs[theme].button;
    const inputSpec = globalSpecs[theme].input;

    const checkboxSpec = globalSpecs[theme].checkbox || {};
    const radioSpec = globalSpecs[theme].radio || {};
    const switchSpec = globalSpecs[theme].switch || {};
    const segmentedSpec = globalSpecs[theme].segmented || {};
    const filterChipSpec = globalSpecs[theme].filterChip || {};

    const inputStyleVars = {
        '--input-bg': inputSpec.bg,
        '--input-border': inputSpec.borderColor,
        '--input-focus': inputSpec.focusRingColor,
        '--input-text': inputSpec.textColor,
        borderRadius: `${inputSpec.borderRadius}px`,
        paddingTop: `${inputSpec.paddingY}px`,
        paddingBottom: `${inputSpec.paddingY}px`,
        paddingLeft: `${inputSpec.paddingX}px`,
        paddingRight: `${inputSpec.paddingX}px`
    };

    const checkboxStyleVars = {
        '--chk-bg': checkboxSpec.bg,
        '--chk-border': checkboxSpec.borderColor,
        '--chk-text': checkboxSpec.textColor
    };

    const radioStyleVars = {
        '--rad-bg': radioSpec.bg,
        '--rad-dot': radioSpec.dotColor,
        '--rad-text': radioSpec.textColor
    };

    const switchStyleVars = {
        '--sw-bg-on': switchSpec.bgOn,
        '--sw-bg-off': switchSpec.bgOff,
        '--sw-circle-on': switchSpec.circleOn,
        '--sw-circle-off': switchSpec.circleOff
    };

    const segmentedStyleVars = {
        '--seg-bg': segmentedSpec.bg,
        '--seg-selected-bg': segmentedSpec.selectedBg,
        '--seg-selected-text': segmentedSpec.selectedText,
        '--seg-text': segmentedSpec.textColor
    };

    const filterChipStyleVars = {
        '--chip-bg': filterChipSpec.bg,
        '--chip-border': filterChipSpec.borderColor,
        '--chip-text': filterChipSpec.textColor,
        '--chip-radius': `${filterChipSpec.borderRadius || 9999}px`
    };

    const buttonStyleVars = {
        '--bg': btnSpec?.primaryBg,
        '--hover-bg': btnSpec?.primaryHoverBg,
        '--text': btnSpec?.primaryText,
        '--sec-bg': btnSpec?.secondaryBg,
        '--sec-hover': btnSpec?.secondaryHoverBg,
        '--sec-text': btnSpec?.secondaryText,
        '--sec-border': btnSpec?.secondaryBorder,
        '--dest-bg': btnSpec?.destructiveBg,
        '--dest-hover': btnSpec?.destructiveHoverBg,
        '--dest-text': btnSpec?.destructiveText,
        '--ghost-text': btnSpec?.ghostText,
        '--ghost-hover': btnSpec?.ghostHoverBg,
        '--btn-radius': `${btnSpec?.borderRadius || 8}px`,
        '--btn-pad-x': `${btnSpec?.paddingX || 16}px`,
        '--btn-pad-y': `${btnSpec?.paddingY || 8}px`,
        '--btn-font-weight': btnSpec?.fontWeight || '500'
    };

    const inputClasses = `w-full bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)] text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] transition-all cursor-pointer`;

    return (
        <div className="space-y-12">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Inputs & Controls</h2>
                <p className="text-slate-500 dark:text-slate-400">Interactive elements for data entry, state switching, and application configuration.</p>
            </div>

            {/* Buttons */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-blue-500 pl-3">Buttons</h3>
                    <p className="text-xs text-slate-500 mt-2">Primary actions, secondary workflows, and destructive operations.</p>
                </div>
                <div className="md:col-span-3 p-6 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <EditableWrapper type="button" variant="primary">
                            <Button variant="primary" />
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="secondary">
                            <Button variant="secondary" />
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="destructive">
                            <Button variant="destructive" />
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="ghost">
                            <Button variant="ghost" />
                        </EditableWrapper>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <EditableWrapper type="button" variant="primary">
                            <Button variant="primary" className="px-3 py-1.5 text-xs">Small</Button>
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="primary">
                            <Button variant="primary" disabled className="opacity-50 cursor-not-allowed">Disabled state</Button>
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="primary">
                            <Button variant="primary">
                                <Check size={16} /> With Icon
                            </Button>
                        </EditableWrapper>
                    </div>

                    {/* Pagination Controls Showcase */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Pagination Controls</div>
                        <div className="flex items-center gap-1.5">
                            <EditableWrapper type="button" variant="secondary">
                                <Button
                                    disabled
                                    variant="secondary"
                                    className="p-1.5"
                                >
                                    <ChevronsLeft size={16} />
                                </Button>
                            </EditableWrapper>
                            <EditableWrapper type="button" variant="secondary">
                                <Button
                                    disabled
                                    variant="secondary"
                                    className="p-1.5"
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                            </EditableWrapper>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 px-2">Page 1 of 5</div>
                            <EditableWrapper type="button" variant="secondary">
                                <Button
                                    variant="secondary"
                                    className="p-1.5"
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </EditableWrapper>
                            <EditableWrapper type="button" variant="secondary">
                                <Button
                                    variant="secondary"
                                    className="p-1.5"
                                >
                                    <ChevronsRight size={16} />
                                </Button>
                            </EditableWrapper>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Inputs & Fields */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-emerald-500 pl-3">Form Fields</h3>
                    <p className="text-xs text-slate-500 mt-2">Standard text entry, numbers, searchable dropdowns, and date pickers.</p>
                </div>
                <div className="md:col-span-3 p-6 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Text Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                        <EditableWrapper type="input">
                            <input
                                type="email"
                                placeholder="jane@example.com"
                                style={inputStyleVars}
                                className={inputClasses}
                            />
                        </EditableWrapper>
                    </div>

                    {/* Number Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount (USD)</label>
                        <EditableWrapper type="input">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-slate-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    style={{ ...inputStyleVars, paddingLeft: `calc(${inputSpec.paddingX}px + 1rem)` }}
                                    className={inputClasses}
                                />
                            </div>
                        </EditableWrapper>
                    </div>

                    {/* Dropdown Menu (Mock) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                        <EditableWrapper type="input">
                            <div className="relative">
                                <select
                                    style={inputStyleVars}
                                    className={`${inputClasses} appearance-none cursor-pointer`}
                                >
                                    <option>Administrator</option>
                                    <option>Editor</option>
                                    <option>Viewer</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                    <ChevronDown size={14} />
                                </div>
                            </div>
                        </EditableWrapper>
                    </div>

                    {/* Date Picker (Mock) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">End Date</label>
                        <EditableWrapper type="input">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <CalendarIcon size={14} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Select date"
                                    readOnly
                                    value="14 Oct 2026"
                                    style={{ ...inputStyleVars, paddingLeft: `calc(${inputSpec.paddingX}px + 1.5rem)` }}
                                    className={inputClasses}
                                />
                            </div>
                        </EditableWrapper>
                    </div>

                    {/* Search Input */}
                    <div className="md:col-span-2 mt-2">
                        <EditableWrapper type="input">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search databases..."
                                    style={{ ...inputStyleVars, paddingLeft: `calc(${inputSpec.paddingX}px + 1.5rem)` }}
                                    className={`${inputClasses} placeholder-slate-400`}
                                />
                            </div>
                        </EditableWrapper>
                    </div>
                </div>
            </section>

            {/* Selection Controls */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-purple-500 pl-3">Selection & Toggles</h3>
                    <p className="text-xs text-slate-500 mt-2">Checkboxes, radio groups, switches, and segmented controls.</p>
                </div>
                <div className="md:col-span-3 p-6 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-8">

                    <div className="flex items-start gap-12 flex-wrap">
                        {/* Checkboxes */}
                        <div className="space-y-3" style={checkboxStyleVars}>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Features</div>
                            <EditableWrapper type="checkbox">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        style={{ accentColor: 'var(--chk-bg)', borderColor: 'var(--chk-border)' }}
                                        className="w-4 h-4 rounded border-slate-300 focus:ring-blue-500"
                                        checked={checkboxVal}
                                        onChange={() => setCheckboxVal(!checkboxVal)}
                                    />
                                    <span className="text-sm" style={{ color: 'var(--chk-text)' }}>Enable Analytics</span>
                                </label>
                            </EditableWrapper>
                            <EditableWrapper type="checkbox">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        style={{ accentColor: 'var(--chk-bg)', borderColor: 'var(--chk-border)' }}
                                        className="w-4 h-4 rounded border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: 'var(--chk-text)' }}>Share data</span>
                                </label>
                            </EditableWrapper>
                        </div>

                        {/* Radios */}
                        <div className="space-y-3" style={radioStyleVars}>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Access Level</div>
                            <EditableWrapper type="radio">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="access"
                                        value="option1"
                                        checked={radioVal === 'option1'}
                                        onChange={(e) => setRadioVal(e.target.value)}
                                        style={{ accentColor: 'var(--rad-dot)', backgroundColor: 'var(--rad-bg)' }}
                                        className="w-4 h-4 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: 'var(--rad-text)' }}>Read only</span>
                                </label>
                            </EditableWrapper>
                            <EditableWrapper type="radio">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="access"
                                        value="option2"
                                        checked={radioVal === 'option2'}
                                        onChange={(e) => setRadioVal(e.target.value)}
                                        style={{ accentColor: 'var(--rad-dot)', backgroundColor: 'var(--rad-bg)' }}
                                        className="w-4 h-4 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: 'var(--rad-text)' }}>Read & Write</span>
                                </label>
                            </EditableWrapper>
                        </div>

                        {/* Toggles (Switches) */}
                        <div className="space-y-4" style={switchStyleVars}>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Settings</div>
                            <EditableWrapper type="switch">
                                <div className="flex items-center justify-between gap-4 w-48">
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Auto-refresh</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={toggleOn} onChange={() => setToggleOn(!toggleOn)} />
                                        <div
                                            className="w-9 h-5 rounded-full transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-4 after:w-4 after:transition-all"
                                            style={{
                                                backgroundColor: toggleOn ? 'var(--sw-bg-on)' : 'var(--sw-bg-off)',
                                                '--tw-after-bg': toggleOn ? 'var(--sw-circle-on)' : 'var(--sw-circle-off)',
                                            }}
                                        // Using a trick for pseudo-element background if needed, or just standard tailwind if circle colors are white mostly
                                        >
                                            <div
                                                className={`absolute top-[2px] left-[2px] h-4 w-4 rounded-full transition-all ${toggleOn ? 'translate-x-4' : ''}`}
                                                style={{ backgroundColor: toggleOn ? 'var(--sw-circle-on)' : 'var(--sw-circle-off)' }}
                                            />
                                        </div>
                                    </label>
                                </div>
                            </EditableWrapper>

                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Segmented Control</div>
                        <div className="inline-flex p-1 rounded-[var(--btn-radius)] w-full max-w-sm" style={{ ...segmentedStyleVars, backgroundColor: 'var(--seg-bg)', borderRadius: `${segmentedSpec.borderRadius || 8}px` }}>
                            {['daily', 'weekly', 'monthly'].map((val) => (
                                <EditableWrapper key={val} type="segmented" className="flex-1 flex flex-col">
                                    <button
                                        onClick={() => setSegmentedVal(val)}
                                        className={`flex-1 py-1.5 px-3 rounded-md text-sm font-[var(--btn-font-weight)] capitalize transition-all w-full h-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 ${segmentedVal === val
                                            ? 'shadow-sm'
                                            : ''
                                            }`}
                                        style={{
                                            backgroundColor: segmentedVal === val ? 'var(--seg-selected-bg)' : undefined,
                                            color: segmentedVal === val ? 'var(--seg-selected-text)' : 'var(--seg-text)'
                                        }}
                                    >
                                        {val}
                                    </button>
                                </EditableWrapper>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Filter Controls & Chips */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-amber-500 pl-3">Filters</h3>
                    <p className="text-xs text-slate-500 mt-2">Filter controls for text fields, number fields, date ranges, and removable status tags.</p>
                </div>
                <AdvancedFiltersGallery 
                    filterChipStyleVars={filterChipStyleVars} 
                    inputStyleVars={inputStyleVars} 
                    inputClasses={inputClasses} 
                />
            </section>
        </div>
    );
}
