import React from 'react';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';

export default function TypographyGallery({ isDarkMode }) {
    const { globalSpecs } = useEditor();
    const typoSpec = globalSpecs?.typography;

    const getInlineStyle = (variant) => {
        if (!typoSpec || !typoSpec[variant]) return {};
        const spec = typoSpec[variant];
        return {
            fontSize: `${spec.fontSize}px`,
            fontWeight: spec.fontWeight,
            fontFamily: spec.fontFamily,
            color: isDarkMode ? spec.darkColor : spec.color,
            backgroundColor: spec.bg ? (isDarkMode ? spec.darkBg : spec.bg) : 'transparent',
            ...(spec.fontStyle ? { fontStyle: spec.fontStyle } : {}),
            ...(spec.letterSpacing ? { letterSpacing: spec.letterSpacing } : {}),
            ...(spec.lineHeight ? { lineHeight: spec.lineHeight } : {}),
            ...(spec.textTransform ? { textTransform: spec.textTransform } : {})
        };
    };

    return (
        <div className="space-y-12">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Typography & Text Styles</h2>
                <p className="text-slate-500 dark:text-slate-400">Standardized text styles for maintaining a consistent hierarchical reading experience.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-blue-500 pl-3">Headings</h3>
                    <p className="text-xs text-slate-500 mt-2">Used for page titles, section titles, and component headers.</p>
                </div>
                <div className="md:col-span-3 space-y-6 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H1</div>
                        <EditableWrapper type="typography" variant="h1" className="flex-1">
                            <h1 className="m-0 leading-none" style={getInlineStyle('h1')}>
                                {typoSpec?.h1?.content}
                            </h1>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H2</div>
                        <EditableWrapper type="typography" variant="h2" className="flex-1">
                            <h2 className="m-0 leading-none" style={getInlineStyle('h2')}>
                                {typoSpec?.h2?.content}
                            </h2>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H3</div>
                        <EditableWrapper type="typography" variant="h3" className="flex-1">
                            <h3 className="m-0 leading-none" style={getInlineStyle('h3')}>
                                {typoSpec?.h3?.content}
                            </h3>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H4</div>
                        <EditableWrapper type="typography" variant="h4" className="flex-1">
                            <h4 className="m-0 leading-none" style={getInlineStyle('h4')}>
                                {typoSpec?.h4?.content}
                            </h4>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H5</div>
                        <EditableWrapper type="typography" variant="h5" className="flex-1">
                            <h5 className="m-0 leading-none" style={getInlineStyle('h5')}>
                                {typoSpec?.h5?.content}
                            </h5>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H6</div>
                        <EditableWrapper type="typography" variant="h6" className="flex-1">
                            <h6 className="m-0 leading-none" style={getInlineStyle('h6')}>
                                {typoSpec?.h6?.content}
                            </h6>
                        </EditableWrapper>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-emerald-500 pl-3">Body Text</h3>
                    <p className="text-xs text-slate-500 mt-2">Standard text sizes for paragraphs, descriptions, and labels.</p>
                </div>
                <div className="md:col-span-3 space-y-6 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <div className="flex items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 pt-1 shrink-0">Base</div>
                        <EditableWrapper type="typography" variant="bodyBase" className="flex-1">
                            <p className="m-0 leading-relaxed max-w-2xl" style={getInlineStyle('bodyBase')}>
                                {typoSpec?.bodyBase?.content}
                            </p>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 pt-1 shrink-0">Small</div>
                        <EditableWrapper type="typography" variant="bodySmall" className="flex-1">
                            <p className="m-0 leading-relaxed max-w-2xl" style={getInlineStyle('bodySmall')}>
                                {typoSpec?.bodySmall?.content}
                            </p>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="w-16 text-xs font-mono text-slate-400 pt-0.5 shrink-0">xs</div>
                        <EditableWrapper type="typography" variant="bodyXs" className="flex-1">
                            <p className="m-0 leading-normal max-w-2xl" style={getInlineStyle('bodyXs')}>
                                {typoSpec?.bodyXs?.content}
                            </p>
                        </EditableWrapper>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-purple-500 pl-3">Specialty</h3>
                    <p className="text-xs text-slate-500 mt-2">Formatted text for data, emphasized metrics, and inline code.</p>
                </div>
                <div className="md:col-span-3 space-y-6 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">Mono</div>
                        <EditableWrapper type="typography" variant="mono" className="inline-block">
                            <div className="px-2 py-1 rounded inline-block" style={getInlineStyle('mono')}>
                                {typoSpec?.mono?.content}
                            </div>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">Metric</div>
                        <EditableWrapper type="typography" variant="metric" className="inline-block">
                            <div className="tracking-tighter" style={getInlineStyle('metric')}>
                                {typoSpec?.metric?.content}
                            </div>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">Muted</div>
                        <EditableWrapper type="typography" variant="muted" className="inline-block">
                            <div style={getInlineStyle('muted')}>
                                {typoSpec?.muted?.content}
                            </div>
                        </EditableWrapper>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-amber-500 pl-3">Functional & UI Text</h3>
                    <p className="text-xs text-slate-500 mt-2">Styles specifically sized and weighted for interactive components and data displays.</p>
                </div>
                <div className="md:col-span-3 space-y-6 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-24 text-xs font-mono text-slate-400 shrink-0">KPI Title</div>
                        <EditableWrapper type="typography" variant="kpiTitle" className="inline-block">
                            <div style={getInlineStyle('kpiTitle')}>
                                {typoSpec?.kpiTitle?.content}
                            </div>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-24 text-xs font-mono text-slate-400 shrink-0">KPI Value</div>
                        <EditableWrapper type="typography" variant="kpiValue" className="inline-block">
                            <div style={getInlineStyle('kpiValue')}>
                                {typoSpec?.kpiValue?.content}
                            </div>
                        </EditableWrapper>
                    </div>
                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-24 text-xs font-mono text-slate-400 shrink-0">Button Text</div>
                        <div className="px-4 py-2 bg-blue-600 rounded-md">
                            <EditableWrapper type="typography" variant="buttonText" className="inline-block">
                                <div style={getInlineStyle('buttonText')}>
                                    {typoSpec?.buttonText?.content}
                                </div>
                            </EditableWrapper>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-24 text-xs font-mono text-slate-400 shrink-0">Nav Menu</div>
                        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                            <EditableWrapper type="typography" variant="navText" className="inline-block">
                                <div style={getInlineStyle('navText')}>
                                    {typoSpec?.navText?.content}
                                </div>
                            </EditableWrapper>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-24 text-xs font-mono text-slate-400 shrink-0">Tooltip</div>
                        <div className="px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 rounded shadow-md">
                            <EditableWrapper type="typography" variant="tooltipText" className="inline-block">
                                <div className={`text-white dark:text-slate-100`} style={{ ...getInlineStyle('tooltipText'), color: 'inherit' }}>
                                    {typoSpec?.tooltipText?.content}
                                </div>
                            </EditableWrapper>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-24 text-xs font-mono text-slate-400 shrink-0">Table Header</div>
                        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 w-full border-b border-slate-200 dark:border-slate-700">
                            <EditableWrapper type="typography" variant="tableHeader" className="inline-block">
                                <div style={getInlineStyle('tableHeader')}>
                                    {typoSpec?.tableHeader?.content}
                                </div>
                            </EditableWrapper>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-24 text-xs font-mono text-slate-400 shrink-0">Table Row</div>
                        <div className="px-4 py-2 w-full">
                            <EditableWrapper type="typography" variant="tableRow" className="inline-block">
                                <div style={getInlineStyle('tableRow')}>
                                    {typoSpec?.tableRow?.content}
                                </div>
                            </EditableWrapper>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
