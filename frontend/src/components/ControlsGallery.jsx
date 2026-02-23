import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, ChevronDown, Check, X, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';

export default function ControlsGallery() {
    const [toggleOn, setToggleOn] = useState(true);
    const [radioVal, setRadioVal] = useState('option1');
    const [checkboxVal, setCheckboxVal] = useState(true);
    const [segmentedVal, setSegmentedVal] = useState('daily');
    const { globalSpecs } = useEditor();
    const btnSpec = globalSpecs.button;
    const inputSpec = globalSpecs.input;

    const inputStyleVars = {
        '--input-bg': inputSpec.bg,
        '--input-dark-bg': inputSpec.darkBg,
        '--input-border': inputSpec.borderColor,
        '--input-dark-border': inputSpec.darkBorderColor,
        '--input-focus': inputSpec.focusRingColor,
        borderRadius: `${inputSpec.borderRadius}px`,
        paddingTop: `${inputSpec.paddingY}px`,
        paddingBottom: `${inputSpec.paddingY}px`,
        paddingLeft: `${inputSpec.paddingX}px`,
        paddingRight: `${inputSpec.paddingX}px`
    };

    const buttonStyleVars = {
        '--bg': btnSpec?.primaryBg,
        '--hover-bg': btnSpec?.primaryHoverBg,
        '--text': btnSpec?.primaryText,
        '--sec-bg': btnSpec?.secondaryBg,
        '--sec-hover': btnSpec?.secondaryHoverBg,
        '--sec-dark-bg': btnSpec?.secondaryDarkBg,
        '--sec-dark-hover': btnSpec?.secondaryDarkHoverBg,
        '--sec-text': btnSpec?.secondaryText,
        '--sec-dark-text': btnSpec?.secondaryDarkText,
        '--sec-border': btnSpec?.secondaryBorder,
        '--sec-dark-border': btnSpec?.secondaryDarkBorder,
        '--dest-bg': btnSpec?.destructiveBg,
        '--dest-hover': btnSpec?.destructiveHoverBg,
        '--dest-text': btnSpec?.destructiveText,
        '--ghost-text': btnSpec?.ghostText,
        '--ghost-dark-text': btnSpec?.ghostDarkText,
        '--ghost-hover': btnSpec?.ghostHoverBg,
        '--ghost-dark-hover': btnSpec?.ghostDarkHoverBg,
        '--btn-radius': `${btnSpec?.borderRadius || 8}px`,
        '--btn-pad-x': `${btnSpec?.paddingX || 16}px`,
        '--btn-pad-y': `${btnSpec?.paddingY || 8}px`,
        '--btn-font-weight': btnSpec?.fontWeight || '500'
    };

    const inputClasses = `w-full bg-[var(--input-bg)] dark:bg-[var(--input-dark-bg)] border border-[var(--input-border)] dark:border-[var(--input-dark-border)] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--input-focus)]/50 focus:border-[var(--input-focus)] text-slate-900 dark:text-slate-100 transition-all cursor-pointer`;

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
                            <button
                                className={`bg-[var(--bg)] hover:bg-[var(--hover-bg)] text-[var(--text)] text-sm transition-colors shadow-sm rounded-[var(--btn-radius)] font-[var(--btn-font-weight)]`}
                                style={{ ...buttonStyleVars, padding: `${btnSpec.paddingY}px ${btnSpec.paddingX}px` }}>
                                {btnSpec.primaryLabel || "Primary Action"}
                            </button>
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="secondary">
                            <button
                                className={`bg-[var(--sec-bg)] dark:bg-[var(--sec-dark-bg)] hover:bg-[var(--sec-hover)] dark:hover:bg-[var(--sec-dark-hover)] text-[var(--sec-text)] dark:text-[var(--sec-dark-text)] text-sm border border-[var(--sec-border)] dark:border-[var(--sec-dark-border)] transition-colors shadow-sm rounded-[var(--btn-radius)] font-[var(--btn-font-weight)]`}
                                style={{ ...buttonStyleVars, padding: `${btnSpec.paddingY}px ${btnSpec.paddingX}px` }}>
                                {btnSpec.secondaryLabel || "Secondary"}
                            </button>
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="destructive">
                            <button
                                className={`bg-[var(--dest-bg)] hover:bg-[var(--dest-hover)] text-[var(--dest-text)] text-sm transition-colors shadow-sm rounded-[var(--btn-radius)] font-[var(--btn-font-weight)]`}
                                style={{ ...buttonStyleVars, padding: `${btnSpec.paddingY}px ${btnSpec.paddingX}px` }}>
                                {btnSpec.destructiveLabel || "Destructive"}
                            </button>
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="ghost">
                            <button
                                className={`text-[var(--ghost-text)] dark:text-[var(--ghost-dark-text)] hover:bg-[var(--ghost-hover)] dark:hover:bg-[var(--ghost-dark-hover)] text-sm transition-colors bg-transparent border border-transparent shadow-none rounded-[var(--btn-radius)] font-[var(--btn-font-weight)]`}
                                style={{ ...buttonStyleVars, padding: `${btnSpec.paddingY}px ${btnSpec.paddingX}px` }}>
                                {btnSpec.ghostLabel || "Ghost Button"}
                            </button>
                        </EditableWrapper>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <EditableWrapper type="button" variant="primary">
                            <button
                                style={buttonStyleVars}
                                className={`text-[var(--text)] bg-[var(--bg)] hover:bg-[var(--hover-bg)] transition-colors shadow-sm font-[var(--btn-font-weight)] px-3 py-1.5 text-xs rounded-[var(--btn-radius)] flex items-center gap-2`}
                            >
                                Small
                            </button>
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="primary">
                            <button
                                style={buttonStyleVars}
                                className={`text-[var(--text)] bg-[var(--bg)] hover:bg-[var(--hover-bg)] transition-colors font-[var(--btn-font-weight)] px-[var(--btn-pad-x)] py-[var(--btn-pad-y)] text-sm rounded-[var(--btn-radius)] flex items-center gap-2 opacity-50 cursor-not-allowed`}
                            >
                                Disabled state
                            </button>
                        </EditableWrapper>
                        <EditableWrapper type="button" variant="primary">
                            <button
                                style={buttonStyleVars}
                                className={`text-[var(--text)] bg-[var(--bg)] hover:bg-[var(--hover-bg)] transition-colors shadow-sm font-[var(--btn-font-weight)] px-[var(--btn-pad-x)] py-[var(--btn-pad-y)] text-sm rounded-[var(--btn-radius)] flex items-center gap-2`}
                            >
                                <Check size={16} /> With Icon
                            </button>
                        </EditableWrapper>
                    </div>

                    {/* Pagination Controls Showcase */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Pagination Controls</div>
                        <div className="flex items-center gap-1.5">
                            <EditableWrapper type="button" variant="secondary">
                                <button
                                    disabled
                                    style={buttonStyleVars}
                                    className={`p-1.5 rounded-[var(--btn-radius)] border border-[var(--sec-border)] dark:border-[var(--sec-dark-border)] bg-[var(--sec-bg)] dark:bg-[var(--sec-dark-bg)] text-[var(--sec-text)] dark:text-[var(--sec-dark-text)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                                >
                                    <ChevronsLeft size={16} />
                                </button>
                            </EditableWrapper>
                            <EditableWrapper type="button" variant="secondary">
                                <button
                                    disabled
                                    style={buttonStyleVars}
                                    className={`p-1.5 rounded-[var(--btn-radius)] border border-[var(--sec-border)] dark:border-[var(--sec-dark-border)] bg-[var(--sec-bg)] dark:bg-[var(--sec-dark-bg)] text-[var(--sec-text)] dark:text-[var(--sec-dark-text)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            </EditableWrapper>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 px-2">Page 1 of 5</div>
                            <EditableWrapper type="button" variant="secondary">
                                <button
                                    style={buttonStyleVars}
                                    className={`p-1.5 rounded-[var(--btn-radius)] border border-[var(--sec-border)] dark:border-[var(--sec-dark-border)] bg-[var(--sec-bg)] dark:bg-[var(--sec-dark-bg)] text-[var(--sec-text)] dark:text-[var(--sec-dark-text)] hover:bg-[var(--sec-hover)] hover:dark:bg-[var(--sec-dark-hover)] transition-colors`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </EditableWrapper>
                            <EditableWrapper type="button" variant="secondary">
                                <button
                                    style={buttonStyleVars}
                                    className={`p-1.5 rounded-[var(--btn-radius)] border border-[var(--sec-border)] dark:border-[var(--sec-dark-border)] bg-[var(--sec-bg)] dark:bg-[var(--sec-dark-bg)] text-[var(--sec-text)] dark:text-[var(--sec-dark-text)] hover:bg-[var(--sec-hover)] hover:dark:bg-[var(--sec-dark-hover)] transition-colors`}
                                >
                                    <ChevronsRight size={16} />
                                </button>
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
                                    style={inputStyleVars}
                                    className={`${inputClasses} pl-7`}
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
                                    style={inputStyleVars}
                                    className={`${inputClasses} pl-9`}
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
                                    style={inputStyleVars}
                                    className={`${inputClasses} pl-10 bg-slate-50 dark:bg-slate-900 border-transparent dark:border-transparent font-medium placeholder-slate-400`}
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
                        <div className="space-y-3">
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Features</div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" checked={checkboxVal} onChange={() => setCheckboxVal(!checkboxVal)} />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Enable Analytics</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Share data</span>
                            </label>
                        </div>

                        {/* Radios */}
                        <div className="space-y-3">
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Access Level</div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="access" value="option1" checked={radioVal === 'option1'} onChange={(e) => setRadioVal(e.target.value)} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Read only</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="access" value="option2" checked={radioVal === 'option2'} onChange={(e) => setRadioVal(e.target.value)} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Read & Write</span>
                            </label>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-4">
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Settings</div>
                            <div className="flex items-center justify-between gap-4 w-48">
                                <span className="text-sm text-slate-700 dark:text-slate-300">Auto-refresh</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={toggleOn} onChange={() => setToggleOn(!toggleOn)} />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between gap-4 w-48">
                                <span className="text-sm text-slate-700 dark:text-slate-300">Dark Mode</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Segmented Control</div>
                        <div className="inline-flex p-1 bg-slate-100 dark:bg-[#121212] rounded-[var(--btn-radius)] w-full max-w-sm" style={buttonStyleVars}>
                            {['daily', 'weekly', 'monthly'].map((val) => (
                                <EditableWrapper key={val} type="button" variant="ghost" className="flex-1 flex flex-col">
                                    <button
                                        onClick={() => setSegmentedVal(val)}
                                        className={`flex-1 py-1.5 px-3 rounded-md text-sm font-[var(--btn-font-weight)] capitalize transition-all w-full h-full ${segmentedVal === val
                                            ? 'bg-white dark:bg-[#262626] text-[var(--ghost-text)] dark:text-[var(--ghost-dark-text)] shadow-sm'
                                            : 'text-slate-500 hover:text-[var(--ghost-text)] dark:hover:text-[var(--ghost-dark-text)] hover:bg-[var(--ghost-hover)] dark:hover:bg-[var(--ghost-dark-hover)]'
                                            }`}
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
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-amber-500 pl-3">Filter Chips</h3>
                    <p className="text-xs text-slate-500 mt-2">Removable status and attribute tags used primarily in tables and search headers.</p>
                </div>
                <div className="md:col-span-3 p-6 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium text-xs rounded-full border border-blue-200 dark:border-blue-800/50">
                            Status: Active <button className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"><X size={12} /></button>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium text-xs rounded-full border border-amber-200 dark:border-amber-800/50">
                            Environment: Staging <button className="hover:bg-amber-200 dark:hover:bg-amber-800 rounded-full p-0.5"><X size={12} /></button>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium text-xs rounded-full border border-slate-200 dark:border-slate-700">
                            Region: us-east1 <button className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5"><X size={12} /></button>
                        </div>

                        <EditableWrapper type="button" variant="secondary">
                            <button
                                style={buttonStyleVars}
                                className={`inline-flex items-center justify-center border border-dashed border-[var(--sec-border)] dark:border-[var(--sec-dark-border)] text-[var(--sec-text)] dark:text-[var(--sec-dark-text)] bg-transparent hover:bg-[var(--sec-hover)] dark:hover:bg-[var(--sec-dark-hover)] rounded-[var(--btn-radius)] px-3 py-1 text-xs font-[var(--btn-font-weight)] transition-colors`}
                            >
                                + Add Filter
                            </button>
                        </EditableWrapper>
                    </div>
                </div>
            </section>
        </div>
    );
}
