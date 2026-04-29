import React from 'react';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';
import Typography from './Typography';
import SkillEditButton from './SkillEditButton';

export default function TypographyGallery() {
    const { globalSpecs, theme } = useEditor();
    const typoSpec = globalSpecs?.[theme]?.typography;
    const isDarkMode = theme === 'dark';

    const getInlineStyle = (variant) => {
        if (!typoSpec || !typoSpec[variant]) return {};
        const spec = typoSpec[variant];
        return {
            fontSize: `${spec.fontSize}px`,
            fontWeight: spec.fontWeight,
            fontFamily: spec.fontFamily,
            color: spec.color,
            backgroundColor: spec.bg || 'transparent',
            ...(spec.fontStyle ? { fontStyle: spec.fontStyle } : {}),
            ...(spec.letterSpacing ? { letterSpacing: spec.letterSpacing } : {}),
            ...(spec.lineHeight ? { lineHeight: spec.lineHeight } : {}),
            ...(spec.textTransform ? { textTransform: spec.textTransform } : {})
        };
    };

    return (
        <div className="space-y-12">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Typography & Text Styles</h2>
                    <SkillEditButton skillPath="ui/components/typography.md" />
                </div>
                <p className="text-slate-500">Standardized text styles for maintaining a consistent hierarchical reading experience.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-blue-500 pl-3">Headings</h3>
                    <p className="text-xs text-slate-500 mt-2">Used for page titles, section titles, and component headers.</p>
                </div>
                <div className="md:col-span-3 space-y-6 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H1</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="h1" className="flex-1">
                            <Typography variant="h1" className="m-0" />
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H2</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="h2" className="flex-1">
                            <Typography variant="h2" className="m-0" />
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H3</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="h3" className="flex-1">
                            <Typography variant="h3" className="m-0" />
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H4</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="h4" className="flex-1">
                            <Typography variant="h4" className="m-0" />
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H5</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="h5" className="flex-1">
                            <Typography variant="h5" className="m-0" />
                        </EditableWrapper>
                    </div>
                    <div className="flex items-end gap-6">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">H6</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="h6" className="flex-1">
                            <Typography variant="h6" className="m-0" />
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
                        <EditableWrapper type="typography" hideSkillButton={true} variant="p" className="flex-1">
                            <Typography variant="p" className="m-0 max-w-2xl" />
                        </EditableWrapper>
                    </div>
                    <div className="flex items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 pt-1 shrink-0">Small</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="small" className="flex-1">
                            <Typography variant="small" className="m-0 max-w-2xl" />
                        </EditableWrapper>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="w-16 text-xs font-mono text-slate-400 pt-0.5 shrink-0">xs</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="xs" className="flex-1">
                            <Typography variant="xs" className="m-0 max-w-2xl" />
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
                        <EditableWrapper type="typography" hideSkillButton={true} variant="mono" className="inline-block">
                            <Typography variant="mono" className="px-2 py-1 rounded inline-block" />
                        </EditableWrapper>
                    </div>

                    <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">Muted</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="muted" className="inline-block">
                            <Typography variant="muted" />
                        </EditableWrapper>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-16 text-xs font-mono text-slate-400 shrink-0">Link</div>
                        <EditableWrapper type="typography" hideSkillButton={true} variant="link" className="inline-block">
                            <Typography variant="link" className="cursor-pointer">
                                Click here to read more
                            </Typography>
                        </EditableWrapper>
                    </div>
                </div>
            </section>
        </div>
    );
}
