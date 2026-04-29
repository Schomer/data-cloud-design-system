import React, { useState } from 'react';
import { ChevronRight, Home, MoreHorizontal, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import EditableWrapper from './EditableWrapper';
import Typography from './Typography';

export default function NavigationGallery() {
    const [activeTab, setActiveTab] = useState('Overview');
    const { theme, globalSpecs } = useEditor();

    const navSpec = globalSpecs[theme].nav;
    const wizardSpec = globalSpecs[theme].wizard;
    const overlaySpec = globalSpecs[theme].overlay;
    const tooltipSpec = globalSpecs[theme].tooltip;
    const typography = globalSpecs[theme].typography;

    const navStyleVars = {
        '--nav-active-text': navSpec.activeText,
        '--nav-active-border': navSpec.activeBorder,
        '--nav-inactive-text': navSpec.inactiveText,
        '--nav-hover-text': navSpec.hoverText,
    };

    const wizardStyleVars = {
        '--wizard-step-bg': wizardSpec.stepBg,
        '--wizard-step-border': wizardSpec.stepBorder,
        '--wizard-active-bg': wizardSpec.activeBg,
        '--wizard-active-border': wizardSpec.activeBorder,
        '--wizard-active-text': wizardSpec.activeText,
        '--wizard-completed-bg': wizardSpec.completedBg,
        '--wizard-completed-border': wizardSpec.completedBorder,
        '--wizard-completed-text': wizardSpec.completedText,
        '--wizard-inactive-text': wizardSpec.inactiveText,
    };

    const overlayStyleVars = {
        '--overlay-bg': overlaySpec.bg,
        '--overlay-border': overlaySpec.borderColor,
        '--overlay-radius': `${overlaySpec.borderRadius}px`,
    };

    return (
        <div className="space-y-12">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: typography.h2.color }}>Navigation & Overlays</h2>
                <p className="text-slate-500 dark:text-slate-400" style={{ color: typography.p.color }}>Context switching, deep-dives, menus, and popovers.</p>
            </div>

            {/* Breadcrumbs & Tabs */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold border-l-2 border-orange-500 pl-3" style={{ color: typography.h3.color }}>Wayfinding</h3>
                    <p className="text-xs text-slate-500 mt-2" style={{ color: typography.p.color }}>Breadcrumbs for hierarchy and Tabs for same-page context switching.</p>
                </div>
                <div className="md:col-span-3 space-y-8 p-6 rounded-xl shadow-sm" style={{ backgroundColor: navSpec.bg, border: `1px solid ${navSpec.borderColor}` }}>

                    {/* Breadcrumbs */}
                    <div style={navStyleVars}>
                        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: typography.h6.color }}>Breadcrumbs</div>
                        <EditableWrapper type="nav" variant="breadcrumbs">
                            <Typography variant={navSpec?.typographyVariant || 'small'} style={{ color: 'inherit' }} as="nav" className="flex items-center text-sm font-medium text-[var(--nav-inactive-text)]">
                                <a href="#" className="hover:text-[var(--nav-hover-text)] transition-colors flex items-center">
                                    <Home size={14} className="mr-1" /> Home
                                </a>
                                <ChevronRight size={14} className="mx-2 opacity-50" />
                                <a href="#" className="hover:text-[var(--nav-hover-text)] transition-colors">Integrations</a>
                                <ChevronRight size={14} className="mx-2 opacity-50" />
                                <span className="text-[var(--nav-active-text)]">API Settings</span>
                            </Typography>
                        </EditableWrapper>
                    </div>

                    {/* Classic Tabs */}
                    <div className="pt-6 border-t" style={{ ...navStyleVars, borderTopColor: navSpec.borderColor }}>
                        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: typography.h6.color }}>Tabs (Underline)</div>
                        <EditableWrapper type="nav" variant="tabs">
                            <div className="border-b" style={{ borderBottomColor: navSpec.borderColor }}>
                                <Typography variant={navSpec?.typographyVariant || 'small'} style={{ color: 'inherit' }} as="nav" className="-mb-px flex space-x-8">
                                    {['Overview', 'Performance', 'Settings'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            style={activeTab === tab ? { borderColor: 'var(--nav-active-border)' } : undefined}
                                            className={`
                                                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                                                ${activeTab === tab
                                                    ? 'text-[var(--nav-active-text)]'
                                                    : 'border-transparent text-[var(--nav-inactive-text)] hover:text-[var(--nav-hover-text)] hover:border-slate-300'}
                                            `}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </Typography>
                            </div>
                        </EditableWrapper>
                        <div className="py-4 text-sm" style={{ color: typography.p.color }}>
                            Content for {activeTab} goes here.
                        </div>
                    </div>

                    {/* Wizard Steps */}
                    <div className="pt-6 border-t" style={{ ...wizardStyleVars, borderTopColor: navSpec.borderColor }}>
                        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: typography.h6.color }}>Wizard Steps</div>
                        <EditableWrapper type="wizard" variant="wizard_steps">
                            <div className="flex items-center w-full">
                                {[
                                    { step: 1, label: 'Account', status: 'completed' },
                                    { step: 2, label: 'Profile', status: 'active' },
                                    { step: 3, label: 'Billing', status: 'inactive' }
                                ].map((s, i, arr) => (
                                    <div key={s.step} className={`flex items-center ${i < arr.length - 1 ? 'flex-1' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors duration-200`}
                                                style={{
                                                    backgroundColor: s.status === 'completed' ? 'var(--wizard-completed-bg)' : s.status === 'active' ? 'var(--wizard-active-bg)' : 'var(--wizard-step-bg)',
                                                    borderColor: s.status === 'completed' ? 'var(--wizard-completed-border)' : s.status === 'active' ? 'var(--wizard-active-border)' : 'var(--wizard-step-border)',
                                                    color: s.status === 'completed' ? 'var(--wizard-completed-text)' : s.status === 'active' ? 'var(--wizard-active-text)' : 'var(--wizard-inactive-text)'
                                                }}
                                            >
                                                {s.status === 'completed' ? <CheckCircle2 size={16} /> : s.step}
                                            </div>
                                            <span 
                                                className="text-sm font-medium hidden sm:block" 
                                                style={{ 
                                                    color: s.status === 'completed' ? 'var(--wizard-completed-text)' : s.status === 'active' ? 'var(--wizard-active-text)' : 'var(--wizard-inactive-text)' 
                                                }}
                                            >
                                                {s.label}
                                            </span>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className="flex-1 mx-4 flex items-center">
                                                <div 
                                                    className="w-full h-[2px]" 
                                                    style={{ 
                                                        backgroundColor: s.status === 'completed' ? 'var(--wizard-completed-border)' : 'var(--wizard-step-border)' 
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </EditableWrapper>
                    </div>
                </div>
            </section>

            {/* Dialogs and Popovers */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold border-l-2 border-rose-500 pl-3" style={{ color: typography.h3.color }}>Overlays & Popovers</h3>
                    <p className="text-xs text-slate-500 mt-2" style={{ color: typography.p.color }}>Modals for focused tasks and callouts for inline context.</p>
                </div>
                <div className="md:col-span-3 space-y-8 p-6 rounded-xl border" style={{ backgroundColor: overlaySpec.bg, borderColor: overlaySpec.borderColor }}>

                    {/* Mock Dialog Window */}
                    <div style={overlayStyleVars}>
                        <EditableWrapper type="overlay" variant="dialog">
                            <div
                                style={{ borderRadius: 'var(--overlay-radius)', backgroundColor: 'var(--overlay-bg)', borderColor: 'var(--overlay-border)' }}
                                className="shadow-xl max-w-md border overflow-hidden mx-auto"
                            >
                                <div className="px-6 pt-6 pb-4 border-b" style={{ borderBottomColor: 'var(--overlay-border)' }}>
                                    <h3 className="text-lg font-semibold leading-none" style={{ color: overlaySpec.headerTextColor }}>Delete Project</h3>
                                </div>
                                <div className="px-6 py-5">
                                    <p className="text-sm" style={{ color: overlaySpec.textColor }}>
                                        Are you sure you want to delete the <strong>Auth V2</strong> project? All of your data will be permanently removed. This action cannot be undone.
                                    </p>
                                </div>
                                <div className="px-6 py-4 flex items-center justify-end gap-3 border-t" style={{ borderTopColor: 'var(--overlay-border)', backgroundColor: overlaySpec.footerBg || 'transparent' }}>
                                    <button
                                        className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                                        style={{ color: overlaySpec.textColor, backgroundColor: theme === 'dark' ? '#262626' : '#f1f5f9' }}
                                    >
                                        Cancel
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-sm">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </EditableWrapper>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t" style={{ borderTopColor: overlaySpec.borderColor }}>
                        {/* Mock Dropdown Menu */}
                        <div style={overlayStyleVars}>
                            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: typography.h6.color }}>Action Menu</div>
                            <EditableWrapper type="overlay" variant="dropdown">
                                <div
                                    style={{ borderRadius: 'calc(var(--overlay-radius) * 0.75)', backgroundColor: 'var(--overlay-bg)', borderColor: 'var(--overlay-border)' }}
                                    className="w-56 shadow-lg ring-1 ring-black ring-opacity-5 border overflow-hidden"
                                >
                                    <div className="py-1">
                                        <a href="#" className="block px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5" style={{ color: overlaySpec.textColor }}>Edit settings</a>
                                        <a href="#" className="block px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5" style={{ color: overlaySpec.textColor }}>Duplicate</a>
                                        <a href="#" className="block px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5" style={{ color: overlaySpec.textColor }}>Share</a>
                                    </div>
                                    <div className="py-1 border-t" style={{ borderTopColor: 'var(--overlay-border)' }}>
                                        <a href="#" className="block px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Delete</a>
                                    </div>
                                </div>
                            </EditableWrapper>
                        </div>

                        {/* Callout / Popover */}
                        <div style={overlayStyleVars}>
                            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: typography.h6.color }}>Tooltip / Popover</div>
                            <EditableWrapper type="tooltip" variant="tooltip">
                                <div className="relative inline-block">
                                    <Typography
                                        variant={tooltipSpec?.typographyVariant || 'xs'}
                                        style={{ borderRadius: 'calc(var(--overlay-radius) * 0.75)', backgroundColor: tooltipSpec.bg, borderColor: overlaySpec.borderColor, color: tooltipSpec.textColor }}
                                        className="p-3 border shadow-xl text-xs max-w-xs relative z-10 w-48"
                                    >
                                        <div className="font-semibold mb-1" style={{ color: overlaySpec.headerTextColor }}>Cost Projection</div>
                                        <span className="opacity-90 leading-relaxed">Based on current usage patterns, this service will exceed budget constraints by Q3.</span>
                                    </Typography>
                                    {/* Tooltip Arrow mock */}
                                    <div className="absolute -bottom-1.5 left-6 w-3 h-3 border-b border-r transform rotate-45 z-20" style={{ backgroundColor: tooltipSpec.bg, borderColor: overlaySpec.borderColor }}></div>
                                </div>
                            </EditableWrapper>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
