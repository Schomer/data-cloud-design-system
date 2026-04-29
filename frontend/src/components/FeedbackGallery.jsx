import React from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';

export default function FeedbackGallery() {
    const { theme, globalSpecs } = useEditor();
    
    // Fallbacks just in case context isn't fully loaded
    const alertSpec = globalSpecs[theme]?.alert || {};
    const loaderSpec = globalSpecs[theme]?.loader || {};

    const alertStyleVars = {
        '--info-bg': alertSpec.infoBg,
        '--info-border': alertSpec.infoBorder,
        '--info-icon': alertSpec.infoIcon,
        '--info-title': alertSpec.infoTitle,
        '--info-text': alertSpec.infoText,
        
        '--success-bg': alertSpec.successBg,
        '--success-border': alertSpec.successBorder,
        '--success-icon': alertSpec.successIcon,
        '--success-title': alertSpec.successTitle,
        '--success-text': alertSpec.successText,
        
        '--warning-bg': alertSpec.warningBg,
        '--warning-border': alertSpec.warningBorder,
        '--warning-icon': alertSpec.warningIcon,
        '--warning-title': alertSpec.warningTitle,
        '--warning-text': alertSpec.warningText,
        
        '--error-bg': alertSpec.errorBg,
        '--error-border': alertSpec.errorBorder,
        '--error-icon': alertSpec.errorIcon,
        '--error-title': alertSpec.errorTitle,
        '--error-text': alertSpec.errorText,
        
        borderRadius: `${alertSpec.borderRadius || 6}px`
    };

    const loaderStyleVars = {
        '--loader-pri': loaderSpec.spinnerColor,
        '--loader-sec': loaderSpec.spinnerSecondaryColor,
        '--loader-suc': loaderSpec.spinnerSuccessColor,
        '--prog-bg': loaderSpec.progressBg,
        '--prog-fill': loaderSpec.progressFill,
        '--prog-rad': `${loaderSpec.borderRadius || 4}px`
    };
    return (
        <div className="space-y-12">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight mb-2">Feedback & Status</h2>
                <p className="text-slate-500">Loading indicators, inline status messages, and callout informational cards.</p>
            </div>

            {/* Status Messages (Alerts) */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold border-l-2 border-amber-500 pl-3">Status Alerts</h3>
                    <p className="text-xs text-slate-500 mt-2">Inline banners documenting success, warnings, or errors on the page level.</p>
                </div>
                <div className="md:col-span-3 space-y-4" style={alertStyleVars}>
                    {/* Info */}
                    <EditableWrapper type="alert">
                        <div className="p-4 border" style={{ backgroundColor: 'var(--info-bg)', borderColor: 'var(--info-border)', borderRadius: 'inherit' }}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Info className="h-5 w-5" style={{ color: 'var(--info-icon)' }} aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium" style={{ color: 'var(--info-title)' }}>New Data Available</h3>
                                    <div className="mt-2 text-sm" style={{ color: 'var(--info-text)' }}>
                                        <p>The weekly sync has completed. 1,492 new records were inserted into the dimensional model.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </EditableWrapper>

                    {/* Success */}
                    <EditableWrapper type="alert">
                        <div className="p-4 border" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success-border)', borderRadius: 'inherit' }}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircle2 className="h-5 w-5" style={{ color: 'var(--success-icon)' }} aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium" style={{ color: 'var(--success-title)' }}>Successfully Deployed</h3>
                                    <div className="mt-2 text-sm" style={{ color: 'var(--success-text)' }}>
                                        <p>Model configuration has been updated and propagated to all edge nodes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </EditableWrapper>

                    {/* Warning */}
                    <EditableWrapper type="alert">
                        <div className="p-4 border" style={{ backgroundColor: 'var(--warning-bg)', borderColor: 'var(--warning-border)', borderRadius: 'inherit' }}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5" style={{ color: 'var(--warning-icon)' }} aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium" style={{ color: 'var(--warning-title)' }}>Attention needed</h3>
                                    <div className="mt-2 text-sm" style={{ color: 'var(--warning-text)' }}>
                                        <p>CPU utilization is operating above 85% threshold. Consider scaling compute clusters.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </EditableWrapper>

                    {/* Error */}
                    <EditableWrapper type="alert">
                        <div className="p-4 border" style={{ backgroundColor: 'var(--error-bg)', borderColor: 'var(--error-border)', borderRadius: 'inherit' }}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5" style={{ color: 'var(--error-icon)' }} aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium" style={{ color: 'var(--error-title)' }}>Pipeline Failed</h3>
                                    <div className="mt-2 text-sm" style={{ color: 'var(--error-text)' }}>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Authentication token expired.</li>
                                            <li>Unable to connect to source database instance.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </EditableWrapper>
                </div>
            </section>

            {/* Loaders and Spinners */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold border-l-2 border-indigo-500 pl-3">Loaders</h3>
                    <p className="text-xs text-slate-500 mt-2">Spinners and progress bars for active execution state.</p>
                </div>
                <div className="md:col-span-3 p-6 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-8" style={loaderStyleVars}>

                    {/* Spinners */}
                    <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Spinners</div>
                        <div className="flex items-center gap-6">
                            <EditableWrapper type="loader">
                                <Loader2 className="animate-spin" style={{ color: 'var(--loader-pri)' }} size={24} />
                            </EditableWrapper>
                            <EditableWrapper type="loader">
                                <Loader2 className="animate-spin" style={{ color: 'var(--loader-sec)' }} size={32} />
                            </EditableWrapper>
                            <EditableWrapper type="loader">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" style={{ color: 'var(--loader-suc)' }} size={16} />
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Processing...</span>
                                </div>
                            </EditableWrapper>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Progress Bar</div>

                        <EditableWrapper type="loader">
                            <div className="space-y-2 max-w-sm">
                                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <span>Migrating data...</span>
                                    <span>65%</span>
                                </div>
                                <div className="w-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--prog-bg)', borderRadius: 'var(--prog-rad)' }}>
                                    <div className="h-full transition-all duration-500" style={{ width: '65%', backgroundColor: 'var(--prog-fill)', borderRadius: 'var(--prog-rad)' }}></div>
                                </div>
                            </div>
                        </EditableWrapper>
                    </div>

                </div>
            </section>
        </div>
    );
}
