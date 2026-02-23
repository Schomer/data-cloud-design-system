import React from 'react';
import { X, SlidersHorizontal, Settings2, ShieldCheck } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { useChartColors } from '../context/ChartColorContext';
export default function EditorSidebar({
    isDarkMode
}) {
    const {
        selectedType,
        selectedVariant,
        setSelectedType,
        globalSpecs,
        updateGlobalSpec
    } = useEditor();
    const { chartColors, updateColor } = useChartColors();
    const currentSpec = selectedType && globalSpecs[selectedType] ? globalSpecs[selectedType] : null;
    if (!selectedType) return null;
    return <div id="editor-sidebar" className="w-80 bg-white dark:bg-[#1a1a1a] border-l border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col shadow-2xl transition-transform duration-300">
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
                            <input type="color" value={currentSpec.primaryBg} onInput={e => updateGlobalSpec('button', 'primaryBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.primaryBg} onChange={e => updateGlobalSpec('button', 'primaryBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Primary Hover Bg</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.primaryHoverBg} onInput={e => updateGlobalSpec('button', 'primaryHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.primaryHoverBg} onChange={e => updateGlobalSpec('button', 'primaryHoverBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.primaryText} onInput={e => updateGlobalSpec('button', 'primaryText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.primaryText} onChange={e => updateGlobalSpec('button', 'primaryText', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                </div>}

                {(!selectedVariant || selectedVariant === 'secondary') && <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Secondary Colors
                    </h3>
                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.secondaryBg} onInput={e => updateGlobalSpec('button', 'secondaryBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.secondaryBg} onChange={e => updateGlobalSpec('button', 'secondaryBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hover Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.secondaryHoverBg} onInput={e => updateGlobalSpec('button', 'secondaryHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.secondaryHoverBg} onChange={e => updateGlobalSpec('button', 'secondaryHoverBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        {!isDarkMode && (
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.secondaryText} onInput={e => updateGlobalSpec('button', 'secondaryText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                        {!isDarkMode && (
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.secondaryBorder} onInput={e => updateGlobalSpec('button', 'secondaryBorder', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                    </div>

                    {isDarkMode && <label className="block text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">Dark Mode Overrides</label>}

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {isDarkMode && (
                            <div>
                                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Dark Bg</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.secondaryDarkBg} onInput={e => updateGlobalSpec('button', 'secondaryDarkBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                        {isDarkMode && (
                            <div>
                                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Dark Hover Bg</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.secondaryDarkHoverBg} onInput={e => updateGlobalSpec('button', 'secondaryDarkHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {isDarkMode && (
                            <div>
                                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Dark Text</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.secondaryDarkText} onInput={e => updateGlobalSpec('button', 'secondaryDarkText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                        {isDarkMode && (
                            <div>
                                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Dark Border</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.secondaryDarkBorder} onInput={e => updateGlobalSpec('button', 'secondaryDarkBorder', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

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
                                <input type="color" value={currentSpec.destructiveBg} onInput={e => updateGlobalSpec('button', 'destructiveBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hover Bg</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.destructiveHoverBg} onInput={e => updateGlobalSpec('button', 'destructiveHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.destructiveText} onInput={e => updateGlobalSpec('button', 'destructiveText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            <input type="text" value={currentSpec.destructiveText} onChange={e => updateGlobalSpec('button', 'destructiveText', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                        </div>
                    </div>
                </div>}

                {(!selectedVariant || selectedVariant === 'ghost') && <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Ghost Colors
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {!isDarkMode && (
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hover Bg</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.ghostHoverBg} onInput={e => updateGlobalSpec('button', 'ghostHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                        {isDarkMode && (
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Hover Bg</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.ghostDarkHoverBg} onInput={e => updateGlobalSpec('button', 'ghostDarkHoverBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {!isDarkMode && (
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.ghostText} onInput={e => updateGlobalSpec('button', 'ghostText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                        {isDarkMode && (
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Text Color</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.ghostDarkText} onInput={e => updateGlobalSpec('button', 'ghostDarkText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

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
                </div>
            </>}

            {selectedType === 'input' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Colors
                    </h3>
                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.bg} onInput={e => updateGlobalSpec('input', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.bg} onChange={e => updateGlobalSpec('input', 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Mode Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkBg} onInput={e => updateGlobalSpec('input', 'darkBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.darkBg} onChange={e => updateGlobalSpec('input', 'darkBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.borderColor} onInput={e => updateGlobalSpec('input', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('input', 'borderColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Mode Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkBorderColor} onInput={e => updateGlobalSpec('input', 'darkBorderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.darkBorderColor} onChange={e => updateGlobalSpec('input', 'darkBorderColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Focus Ring Color</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.focusRingColor} onInput={e => updateGlobalSpec('input', 'focusRingColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
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

            {selectedType === 'card' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Surface Colors
                    </h3>
                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.bg} onInput={e => updateGlobalSpec('card', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.bg} onChange={e => updateGlobalSpec('card', 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkBg} onInput={e => updateGlobalSpec('card', 'darkBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.darkBg} onChange={e => updateGlobalSpec('card', 'darkBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.borderColor} onInput={e => updateGlobalSpec('card', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.borderColor} onChange={e => updateGlobalSpec('card', 'borderColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkBorderColor} onInput={e => updateGlobalSpec('card', 'darkBorderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.darkBorderColor} onChange={e => updateGlobalSpec('card', 'darkBorderColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Typography
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {!isDarkMode && (
                            <div>
                                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Title Color</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.titleColor} onInput={e => updateGlobalSpec('card', 'titleColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                        {isDarkMode && (
                            <div>
                                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Dark Title Color</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.darkTitleColor} onInput={e => updateGlobalSpec('card', 'darkTitleColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {!isDarkMode && (
                            <div>
                                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Value Color</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.valueColor} onInput={e => updateGlobalSpec('card', 'valueColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

                        {isDarkMode && (
                            <div>
                                <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Dark Value Color</label>
                                <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                    <input type="color" value={currentSpec.darkValueColor} onInput={e => updateGlobalSpec('card', 'darkValueColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                </div>
                            </div>
                        )}

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
                        <Settings2 size={14} /> Colors
                    </h3>
                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Active Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.activeText} onInput={e => updateGlobalSpec('nav', 'activeText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.activeText} onChange={e => updateGlobalSpec('nav', 'activeText', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Active Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkActiveText} onInput={e => updateGlobalSpec('nav', 'darkActiveText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Active Border</label>
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                            <input type="color" value={currentSpec.activeBorder} onInput={e => updateGlobalSpec('nav', 'activeBorder', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                        </div>
                    </div>
                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Inactive Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.inactiveText} onInput={e => updateGlobalSpec('nav', 'inactiveText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Inactive Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkInactiveText} onInput={e => updateGlobalSpec('nav', 'darkInactiveText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hover Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.hoverText} onInput={e => updateGlobalSpec('nav', 'hoverText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Hover Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkHoverText} onInput={e => updateGlobalSpec('nav', 'darkHoverText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                </div>
            </>}

            {selectedType === 'overlay' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Surface Colors
                    </h3>
                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.bg} onInput={e => updateGlobalSpec('overlay', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.bg} onChange={e => updateGlobalSpec('overlay', 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Mode Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkBg} onInput={e => updateGlobalSpec('overlay', 'darkBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.darkBg} onChange={e => updateGlobalSpec('overlay', 'darkBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.borderColor} onInput={e => updateGlobalSpec('overlay', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Mode Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkBorderColor} onInput={e => updateGlobalSpec('overlay', 'darkBorderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

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
                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.bg} onInput={e => updateGlobalSpec('table', 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={currentSpec.bg} onChange={e => updateGlobalSpec('table', 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Mode Background</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkBg} onInput={e => updateGlobalSpec('table', 'darkBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Border Color</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.borderColor} onInput={e => updateGlobalSpec('table', 'borderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Mode Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkBorderColor} onInput={e => updateGlobalSpec('table', 'darkBorderColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Row & Typography Colors
                    </h3>
                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Header Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.headerText} onInput={e => updateGlobalSpec('table', 'headerText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Header Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkHeaderText} onInput={e => updateGlobalSpec('table', 'darkHeaderText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Row Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.rowText} onInput={e => updateGlobalSpec('table', 'rowText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Row Text</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkRowText} onInput={e => updateGlobalSpec('table', 'darkRowText', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {!isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Row Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.rowBorder} onInput={e => updateGlobalSpec('table', 'rowBorder', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

                    {isDarkMode && (
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Row Border</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={currentSpec.darkRowBorder} onInput={e => updateGlobalSpec('table', 'darkRowBorder', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                            </div>
                        </div>
                    )}

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
                </div>
            </>}

            {selectedType === 'chart' && <>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Settings2 size={14} /> Chart Colors
                    </h3>
                    {chartColors.map((color, idx) => (
                        <div key={idx}>
                            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Color {idx + 1}</label>
                            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                <input type="color" value={color} onInput={e => updateColor(idx, e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                <input type="text" value={color} onChange={e => updateColor(idx, e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                            </div>
                        </div>
                    ))}
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
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Font Family</label>
                            <select
                                value={currentSpec[selectedVariant].fontFamily}
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

                        {/* Font Size & Weight Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Size (px)</label>
                                <input
                                    type="number"
                                    value={currentSpec[selectedVariant].fontSize}
                                    onChange={e => updateGlobalSpec('typography', selectedVariant, 'fontSize', parseInt(e.target.value) || 16)}
                                    className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Weight</label>
                                <select
                                    value={currentSpec[selectedVariant].fontWeight}
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

                        {/* Colors */}
                        <div className="space-y-3">
                            {!isDarkMode ? (
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Text Color</label>
                                    <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                        <input type="color" value={currentSpec[selectedVariant].color} onInput={e => updateGlobalSpec('typography', selectedVariant, 'color', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                        <input type="text" value={currentSpec[selectedVariant].color} onChange={e => updateGlobalSpec('typography', selectedVariant, 'color', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Text Color</label>
                                    <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                        <input type="color" value={currentSpec[selectedVariant].darkColor} onInput={e => updateGlobalSpec('typography', selectedVariant, 'darkColor', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                        <input type="text" value={currentSpec[selectedVariant].darkColor} onChange={e => updateGlobalSpec('typography', selectedVariant, 'darkColor', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Background Color for Mono */}
                        {selectedVariant === 'mono' && (
                            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                {!isDarkMode ? (
                                    <div>
                                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Background Color</label>
                                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                            <input type="color" value={currentSpec[selectedVariant].bg} onInput={e => updateGlobalSpec('typography', selectedVariant, 'bg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                            <input type="text" value={currentSpec[selectedVariant].bg} onChange={e => updateGlobalSpec('typography', selectedVariant, 'bg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dark Background Color</label>
                                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden h-9">
                                            <input type="color" value={currentSpec[selectedVariant].darkBg} onInput={e => updateGlobalSpec('typography', selectedVariant, 'darkBg', e.target.value)} className="w-10 h-full p-0 border-0 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                                            <input type="text" value={currentSpec[selectedVariant].darkBg} onChange={e => updateGlobalSpec('typography', selectedVariant, 'darkBg', e.target.value)} className="flex-1 bg-slate-50 dark:bg-[#121212] px-3 font-mono text-sm border-l border-slate-200 dark:border-slate-700 uppercase" />
                                        </div>
                                    </div>
                                )}
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
                    </div>
                )}
            </>}
        </div>
    </div>;
}