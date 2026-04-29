import React from 'react';
import { X, SlidersHorizontal, Settings2, ShieldCheck, Type } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { useChartColors } from '../context/ChartColorContext';

function TypographySelect({ value, onChange, label = "Text Style" }) {
    return (
        <div>
            {label && <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</label>}
            <select 
                value={value || 'p'} 
                onChange={onChange} 
                className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-sm h-9"
            >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
                <option value="p">Base</option>
                <option value="small">Small</option>
                <option value="xs">Extra Small</option>
                <option value="mono">Mono</option>
                <option value="muted">Muted</option>
                <option value="link">Link</option>
            </select>
        </div>
    );
}

export default function EditorSidebar() {
    const {
        selectedType,
        selectedVariant,
        setSelectedType,
        globalSpecs,
        updateGlobalSpec,
        theme
    } = useEditor();
    const { chartColors, updateColor } = useChartColors();
    const isDarkMode = theme === 'dark';
    if (!selectedType) return null;

    const currentSpec = selectedType && globalSpecs[theme] && globalSpecs[theme][selectedType] ? globalSpecs[theme][selectedType] : null;

    if (!currentSpec && ['typography', 'chart', 'alert', 'loader'].indexOf(selectedType) === -1) {
        return (
            <div id="editor-sidebar" className="w-80 bg-white dark:bg-[#1a1a1a] border-l border-slate-200 dark:border-slate-800 h-[calc(100vh-64px)] sticky top-16 flex flex-col p-8 text-center">
                <Settings2 size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-slate-900 dark:text-slate-100 font-medium mb-2">No Settings Found</h3>
                <p className="text-xs text-slate-500">The specification for "{selectedType}" could not be loaded for the current theme.</p>
                <button
                    onClick={() => setSelectedType(null)}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                >
                    Close Sidebar
                </button>
            </div>
        );
    }
    return <div id="editor-sidebar" className="w-80 bg-white dark:bg-[#1a1a1a] border-l border-slate-200 dark:border-slate-800 h-[calc(100vh-64px)] sticky top-16 flex flex-col shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold">
                <SlidersHorizontal size={16} className="text-blue-500" />
                <span className="capitalize">{selectedType} Settings</span>
            </div>
            <button onClick={() => setSelectedType(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors">
                <X size={16} />
            </button>
        </div>

        {/* Properties */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {/* Specific controls based on selected type */}
            {selectedType === 'button' && <>
                {(!selectedVariant || selectedVariant === 'primary') && <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Colors
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Primary Bg Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec?.primaryBg || '#000000'} onChange={e => updateGlobalSpec('button', 'primaryBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec?.primaryBg || ''} onChange={e => updateGlobalSpec('button', 'primaryBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Primary Hover Bg</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec?.primaryHoverBg || '#000000'} onChange={e => updateGlobalSpec('button', 'primaryHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec?.primaryHoverBg || ''} onChange={e => updateGlobalSpec('button', 'primaryHoverBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec?.primaryText || '#000000'} onChange={e => updateGlobalSpec('button', 'primaryText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec?.primaryText || ''} onChange={e => updateGlobalSpec('button', 'primaryText', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Label Content</label>
                        <input type="text" value={currentSpec?.primaryLabel || ''} onChange={e => updateGlobalSpec('button', 'primaryLabel', e.target.value)} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-sm" />
                    </div>
                </div>}

                {(!selectedVariant || selectedVariant === 'secondary') && <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Secondary Colors
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.secondaryBg} onChange={e => updateGlobalSpec('button', 'secondaryBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.secondaryBg} onChange={e => updateGlobalSpec('button', 'secondaryBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hover Background</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.secondaryHoverBg} onChange={e => updateGlobalSpec('button', 'secondaryHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.secondaryHoverBg} onChange={e => updateGlobalSpec('button', 'secondaryHoverBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.secondaryText} onChange={e => updateGlobalSpec('button', 'secondaryText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.secondaryBorder} onChange={e => updateGlobalSpec('button', 'secondaryBorder', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-2">
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Label Content</label>
                        <input type="text" value={currentSpec.secondaryLabel} onChange={e => updateGlobalSpec('button', 'secondaryLabel', e.target.value)} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-sm" />
                    </div>
                </div>}

                {(!selectedVariant || selectedVariant === 'destructive') && <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Destructive Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.destructiveBg} onChange={e => updateGlobalSpec('button', 'destructiveBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hover Bg</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.destructiveHoverBg} onChange={e => updateGlobalSpec('button', 'destructiveHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.destructiveText} onChange={e => updateGlobalSpec('button', 'destructiveText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.destructiveText} onChange={e => updateGlobalSpec('button', 'destructiveText', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                    <div className="pt-2">
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Label Content</label>
                        <input type="text" value={currentSpec.destructiveLabel} onChange={e => updateGlobalSpec('button', 'destructiveLabel', e.target.value)} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-sm" />
                    </div>
                </div>}

                {(!selectedVariant || selectedVariant === 'ghost') && <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Ghost Colors
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hover Bg</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.ghostHoverBg} onChange={e => updateGlobalSpec('button', 'ghostHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.ghostText} onChange={e => updateGlobalSpec('button', 'ghostText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-2">
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Label Content</label>
                        <input type="text" value={currentSpec.ghostLabel} onChange={e => updateGlobalSpec('button', 'ghostLabel', e.target.value)} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-sm" />
                    </div>
                </div>}

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout & Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                        <div className="relative">
                            <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('button', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                                px
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding X</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.paddingX} onChange={e => updateGlobalSpec('button', 'paddingX', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                                    px
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding Y</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.paddingY} onChange={e => updateGlobalSpec('button', 'paddingY', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                                    px
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <TypographySelect 
                            value={currentSpec.typographyVariant} 
                            onChange={e => updateGlobalSpec('button', 'typographyVariant', e.target.value)} 
                        />
                    </div>
                </div>
            </>}

            {selectedType === 'input' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Colors
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('input', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.bg} onChange={e => updateGlobalSpec('input', 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('input', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('input', 'borderColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.textColor} onChange={e => updateGlobalSpec('input', 'textColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.textColor} onChange={e => updateGlobalSpec('input', 'textColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Focus Ring Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.focusRingColor} onChange={e => updateGlobalSpec('input', 'focusRingColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.focusRingColor} onChange={e => updateGlobalSpec('input', 'focusRingColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout & Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                        <div className="relative">
                            <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('input', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                                px
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding X</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.paddingX} onChange={e => updateGlobalSpec('input', 'paddingX', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                                    px
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding Y</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.paddingY} onChange={e => updateGlobalSpec('input', 'paddingY', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                                    px
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'checkbox' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Checkbox Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Active Background</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('checkbox', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('checkbox', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Label Text Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.textColor} onChange={e => updateGlobalSpec('checkbox', 'textColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'radio' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Radio Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('radio', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Selection Circle</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.dotColor} onChange={e => updateGlobalSpec('radio', 'dotColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Label Text Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.textColor} onChange={e => updateGlobalSpec('radio', 'textColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'switch' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Switch Styles
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background ON</label>
                            <input type="color" value={currentSpec.bgOn} onChange={e => updateGlobalSpec('switch', 'bgOn', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background OFF</label>
                            <input type="color" value={currentSpec.bgOff} onChange={e => updateGlobalSpec('switch', 'bgOff', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Circle ON</label>
                            <input type="color" value={currentSpec.circleOn} onChange={e => updateGlobalSpec('switch', 'circleOn', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Circle OFF</label>
                            <input type="color" value={currentSpec.circleOff} onChange={e => updateGlobalSpec('switch', 'circleOff', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'segmented' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Segmented Control
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                        <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('segmented', 'bg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Selected Bg</label>
                            <input type="color" value={currentSpec.selectedBg} onChange={e => updateGlobalSpec('segmented', 'selectedBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Selected Text</label>
                            <input type="color" value={currentSpec.selectedText} onChange={e => updateGlobalSpec('segmented', 'selectedText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Default Text Color</label>
                        <input type="color" value={currentSpec.textColor} onChange={e => updateGlobalSpec('segmented', 'textColor', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                </div>
            </>}

            {selectedType === 'filterChip' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Filter Settings
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Chip Background</label>
                        <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('filterChip', 'bg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Chip Border</label>
                        <input type="color" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('filterChip', 'borderColor', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Chip Text Color</label>
                        <input type="color" value={currentSpec.textColor} onChange={e => updateGlobalSpec('filterChip', 'textColor', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout & Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                        <div className="relative">
                            <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('filterChip', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'tooltip' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Tooltip Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                        <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('tooltip', 'bg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                        <input type="color" value={currentSpec.textColor} onChange={e => updateGlobalSpec('tooltip', 'textColor', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                    <TypographySelect 
                        value={currentSpec.typographyVariant} 
                        onChange={e => updateGlobalSpec('tooltip', 'typographyVariant', e.target.value)} 
                    />
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                        <div className="relative">
                            <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('tooltip', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding X</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.paddingX} onChange={e => updateGlobalSpec('tooltip', 'paddingX', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding Y</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.paddingY} onChange={e => updateGlobalSpec('tooltip', 'paddingY', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'card' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Surface Colors
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('card', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.bg} onChange={e => updateGlobalSpec('card', 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('card', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('card', 'borderColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Default Title Content</label>
                        <input type="text" value={currentSpec.defaultTitle || ''} onChange={e => updateGlobalSpec('card', 'defaultTitle', e.target.value)} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-3 text-sm" />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Type size={14} /> Text Styles
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Title Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.titleColor} onChange={e => updateGlobalSpec('card', 'titleColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.titleColor} onChange={e => updateGlobalSpec('card', 'titleColor', e.target.value)} className="flex-1 w-0 bg-slate-50 dark:bg-[#121212] px-2 font-mono text-[10px] border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                        <TypographySelect 
                            label="Title Style"
                            value={currentSpec.titleTypography} 
                            onChange={e => updateGlobalSpec('card', 'titleTypography', e.target.value)} 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Value Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.valueColor} onChange={e => updateGlobalSpec('card', 'valueColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.valueColor} onChange={e => updateGlobalSpec('card', 'valueColor', e.target.value)} className="flex-1 w-0 bg-slate-50 dark:bg-[#121212] px-2 font-mono text-[10px] border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                        <TypographySelect 
                            label="Value Style"
                            value={currentSpec.valueTypography} 
                            onChange={e => updateGlobalSpec('card', 'valueTypography', e.target.value)} 
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout & Styles
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('card', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.padding} onChange={e => updateGlobalSpec('card', 'padding', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'nav' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Nav Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('nav', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.borderColor || '#e2e8f0'} onChange={e => updateGlobalSpec('nav', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Active Text</label>
                            <input type="color" value={currentSpec.activeText} onChange={e => updateGlobalSpec('nav', 'activeText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Active Border</label>
                            <input type="color" value={currentSpec.activeBorder} onChange={e => updateGlobalSpec('nav', 'activeBorder', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Inactive Text</label>
                            <input type="color" value={currentSpec.inactiveText} onChange={e => updateGlobalSpec('nav', 'inactiveText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Hover Text</label>
                            <input type="color" value={currentSpec.hoverText} onChange={e => updateGlobalSpec('nav', 'hoverText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <TypographySelect 
                        value={currentSpec.typographyVariant} 
                        onChange={e => updateGlobalSpec('nav', 'typographyVariant', e.target.value)} 
                    />
                </div>
            </>}

            {selectedType === 'wizard' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Wizard Step Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Step Bg</label>
                            <input type="color" value={currentSpec.stepBg} onChange={e => updateGlobalSpec('wizard', 'stepBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Step Border</label>
                            <input type="color" value={currentSpec.stepBorder} onChange={e => updateGlobalSpec('wizard', 'stepBorder', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-blue-500 dark:text-blue-400 mb-1">Active Bg</label>
                            <input type="color" value={currentSpec.activeBg} onChange={e => updateGlobalSpec('wizard', 'activeBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-blue-500 dark:text-blue-400 mb-1">Active Border</label>
                            <input type="color" value={currentSpec.activeBorder} onChange={e => updateGlobalSpec('wizard', 'activeBorder', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-emerald-500 dark:text-emerald-400 mb-1">Completed Bg</label>
                            <input type="color" value={currentSpec.completedBg} onChange={e => updateGlobalSpec('wizard', 'completedBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-emerald-500 dark:text-emerald-400 mb-1">Completed Border</label>
                            <input type="color" value={currentSpec.completedBorder} onChange={e => updateGlobalSpec('wizard', 'completedBorder', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 mt-4">
                        <Type size={14} /> Text Colors
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Inactive</label>
                            <input type="color" value={currentSpec.inactiveText} onChange={e => updateGlobalSpec('wizard', 'inactiveText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Active</label>
                            <input type="color" value={currentSpec.activeText} onChange={e => updateGlobalSpec('wizard', 'activeText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Completed</label>
                            <input type="color" value={currentSpec.completedText} onChange={e => updateGlobalSpec('wizard', 'completedText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'overlay' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Surface Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('overlay', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('overlay', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Footer Background</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.footerBg} onChange={e => updateGlobalSpec('overlay', 'footerBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout & Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                        <div className="relative">
                            <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('overlay', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'table' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Surface Colors
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.bg} onChange={e => updateGlobalSpec('table', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.bg} onChange={e => updateGlobalSpec('table', 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('table', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Header Text Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.headerText} onChange={e => updateGlobalSpec('table', 'headerText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.headerText} onChange={e => updateGlobalSpec('table', 'headerText', e.target.value)} className="flex-1 w-0 bg-slate-50 dark:bg-[#121212] px-2 font-mono text-[10px] border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                        <TypographySelect 
                            label="Header Text Style"
                            value={currentSpec.headerTypography} 
                            onChange={e => updateGlobalSpec('table', 'headerTypography', e.target.value)} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Row Text Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.rowText} onChange={e => updateGlobalSpec('table', 'rowText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.rowText} onChange={e => updateGlobalSpec('table', 'rowText', e.target.value)} className="flex-1 w-0 bg-slate-50 dark:bg-[#121212] px-2 font-mono text-[10px] border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                        <TypographySelect 
                            label="Row Text Style"
                            value={currentSpec.rowTypography} 
                            onChange={e => updateGlobalSpec('table', 'rowTypography', e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Row Border</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.rowBorder} onInput={e => updateGlobalSpec('table', 'rowBorder', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>

                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout & Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                        <div className="relative">
                            <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('table', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding X</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.paddingX} onChange={e => updateGlobalSpec('table', 'paddingX', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Padding Y</label>
                            <div className="relative">
                                <input type="number" value={currentSpec.paddingY} onChange={e => updateGlobalSpec('table', 'paddingY', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'chart' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Grid & Tooltip Colors
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Grid Line Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec?.gridLineColor || '#e2e8f0'} onChange={e => updateGlobalSpec('chart', 'gridLineColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Tooltip Bg</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec?.tooltipBg || '#ffffff'} onChange={e => updateGlobalSpec('chart', 'tooltipBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Tooltip Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec?.tooltipText || '#000000'} onChange={e => updateGlobalSpec('chart', 'tooltipText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Type size={14} /> Typography
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <TypographySelect 
                            label="Title Style"
                            value={currentSpec?.titleTypography} 
                            onChange={e => updateGlobalSpec('chart', 'titleTypography', e.target.value)} 
                        />
                        <TypographySelect 
                            label="Subtitle Style"
                            value={currentSpec?.subtitleTypography} 
                            onChange={e => updateGlobalSpec('chart', 'subtitleTypography', e.target.value)} 
                        />
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Container Style
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Header Padding Y</label>
                        <div className="relative">
                            <input type="number" value={currentSpec?.headerPaddingY} onChange={e => updateGlobalSpec('chart', 'headerPaddingY', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                        </div>
                    </div>
                </div>

            </>}

            {selectedType === 'alert' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Info Alert Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <input type="color" value={currentSpec.infoBg} onChange={e => updateGlobalSpec('alert', 'infoBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border</label>
                            <input type="color" value={currentSpec.infoBorder} onChange={e => updateGlobalSpec('alert', 'infoBorder', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Icon</label>
                            <input type="color" value={currentSpec.infoIcon} onChange={e => updateGlobalSpec('alert', 'infoIcon', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Title Text</label>
                            <input type="color" value={currentSpec.infoTitle} onChange={e => updateGlobalSpec('alert', 'infoTitle', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Body Text</label>
                        <input type="color" value={currentSpec.infoText} onChange={e => updateGlobalSpec('alert', 'infoText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Success Alert Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <input type="color" value={currentSpec.successBg} onChange={e => updateGlobalSpec('alert', 'successBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border</label>
                            <input type="color" value={currentSpec.successBorder} onChange={e => updateGlobalSpec('alert', 'successBorder', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                            <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Icon</label>
                            <input type="color" value={currentSpec.successIcon} onChange={e => updateGlobalSpec('alert', 'successIcon', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Title Text</label>
                            <input type="color" value={currentSpec.successTitle} onChange={e => updateGlobalSpec('alert', 'successTitle', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Body Text</label>
                        <input type="color" value={currentSpec.successText} onChange={e => updateGlobalSpec('alert', 'successText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Warning Alert Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <input type="color" value={currentSpec.warningBg} onChange={e => updateGlobalSpec('alert', 'warningBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border</label>
                            <input type="color" value={currentSpec.warningBorder} onChange={e => updateGlobalSpec('alert', 'warningBorder', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Icon</label>
                            <input type="color" value={currentSpec.warningIcon} onChange={e => updateGlobalSpec('alert', 'warningIcon', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Title Text</label>
                            <input type="color" value={currentSpec.warningTitle} onChange={e => updateGlobalSpec('alert', 'warningTitle', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Body Text</label>
                        <input type="color" value={currentSpec.warningText} onChange={e => updateGlobalSpec('alert', 'warningText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Error Alert Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <input type="color" value={currentSpec.errorBg} onChange={e => updateGlobalSpec('alert', 'errorBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border</label>
                            <input type="color" value={currentSpec.errorBorder} onChange={e => updateGlobalSpec('alert', 'errorBorder', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Icon</label>
                            <input type="color" value={currentSpec.errorIcon} onChange={e => updateGlobalSpec('alert', 'errorIcon', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Title Text</label>
                            <input type="color" value={currentSpec.errorTitle} onChange={e => updateGlobalSpec('alert', 'errorTitle', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Body Text</label>
                        <input type="color" value={currentSpec.errorText} onChange={e => updateGlobalSpec('alert', 'errorText', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                        <div className="relative">
                            <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('alert', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                        </div>
                    </div>
                </div>
            </>}

            {selectedType === 'loader' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Spinner Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Primary Color</label>
                            <input type="color" value={currentSpec.spinnerColor} onChange={e => updateGlobalSpec('loader', 'spinnerColor', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Secondary Color</label>
                            <input type="color" value={currentSpec.spinnerSecondaryColor} onChange={e => updateGlobalSpec('loader', 'spinnerSecondaryColor', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Success Color</label>
                        <input type="color" value={currentSpec.spinnerSuccessColor} onChange={e => updateGlobalSpec('loader', 'spinnerSuccessColor', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Progress Bar Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Track Background</label>
                            <input type="color" value={currentSpec.progressBg} onChange={e => updateGlobalSpec('loader', 'progressBg', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Fill Color</label>
                            <input type="color" value={currentSpec.progressFill} onChange={e => updateGlobalSpec('loader', 'progressFill', e.target.value)} className="w-full h-9 p-0 border border-slate-200 dark:border-slate-700 rounded-md bg-transparent cursor-pointer" />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck size={14} /> Layout Styles
                    </h3>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Radius</label>
                        <div className="relative">
                            <input type="number" value={currentSpec.borderRadius} onChange={e => updateGlobalSpec('loader', 'borderRadius', Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md py-1.5 pl-3 pr-8 text-sm" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">px</div>
                        </div>
                    </div>
                </div>
            </>}
            {selectedType === 'typography' && <>
                {!selectedVariant ? (
                    <div className="text-sm text-slate-500 text-center py-8">
                        Select a specific text element (like a heading or paragraph) to edit its styles.
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                            <Settings2 size={14} /> {selectedVariant.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Settings
                        </h3>

                        {/* Font Family */}
                        {selectedVariant !== 'link' && (
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Font Family</label>
                                <select
                                    value={currentSpec?.[selectedVariant]?.fontFamily || '"Inter", sans-serif'}
                                    onChange={e => updateGlobalSpec('typography', selectedVariant, 'fontFamily', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                                >
                                    <option value='"Inter", sans-serif'>Inter (Sans)</option>
                                    <option value='"Roboto", sans-serif'>Roboto (Sans)</option>
                                    <option value='"Outfit", sans-serif'>Outfit (Sans)</option>
                                    <option value="system-ui, sans-serif">System Default</option>
                                    <option value="Georgia, serif">Georgia (Serif)</option>
                                    <option value="monospace">Monospace</option>
                                </select>
                            </div>
                        )}

                        {/* Font Size & Weight Row */}
                        {selectedVariant !== 'link' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Size (px)</label>
                                    <input
                                        type="number"
                                        value={currentSpec?.[selectedVariant]?.fontSize || 16}
                                        onChange={e => updateGlobalSpec('typography', selectedVariant, 'fontSize', parseInt(e.target.value) || 16)}
                                        className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Weight</label>
                                    <select
                                        value={currentSpec?.[selectedVariant]?.fontWeight}
                                        onChange={e => updateGlobalSpec('typography', selectedVariant, 'fontWeight', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="300">Light (300)</option>
                                        <option value="400">Regular (400)</option>
                                        <option value="500">Medium (500)</option>
                                        <option value="600">Semibold (600)</option>
                                        <option value="700">Bold (700)</option>
                                        <option value="800">Extra Bold (800)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec?.[selectedVariant]?.color} onInput={e => updateGlobalSpec('typography', selectedVariant, 'color', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                    <input type="text" value={currentSpec?.[selectedVariant]?.color} onChange={e => updateGlobalSpec('typography', selectedVariant, 'color', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                                </div>
                            </div>
                        </div>

                        {/* Text Content Editing */}
                        {selectedVariant !== 'link' && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Content</label>
                                <textarea
                                    value={currentSpec?.[selectedVariant]?.content || ''}
                                    onChange={e => updateGlobalSpec('typography', selectedVariant, 'content', e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-100 resize-none font-normal"
                                />
                            </div>
                        )}

                        {/* Background Color for Mono */}
                        {selectedVariant === 'mono' && (
                            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                                    <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                        <input type="color" value={currentSpec[selectedVariant].bg} onInput={e => updateGlobalSpec('typography', selectedVariant, 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                        <input type="text" value={currentSpec[selectedVariant].bg} onChange={e => updateGlobalSpec('typography', selectedVariant, 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Font Style for Muted */}
                        {selectedVariant === 'muted' && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Font Style</label>
                                <select
                                    value={currentSpec[selectedVariant].fontStyle || 'normal'}
                                    onChange={e => updateGlobalSpec('typography', selectedVariant, 'fontStyle', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="italic">Italic</option>
                                    <option value="oblique">Oblique</option>
                                </select>
                            </div>
                        )}

                        {/* Text Decoration for Link */}
                        {selectedVariant === 'link' && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Decoration</label>
                                <select
                                    value={currentSpec[selectedVariant].textDecoration || 'none'}
                                    onChange={e => updateGlobalSpec('typography', selectedVariant, 'textDecoration', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                                >
                                    <option value="none">None</option>
                                    <option value="underline">Underline</option>
                                    <option value="overline">Overline</option>
                                    <option value="line-through">Line Through</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}
            </>}
        </div>
    </div >;
}