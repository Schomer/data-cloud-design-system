import React, { createContext, useState, useContext, useEffect } from 'react';

const EditorContext = createContext();

export function EditorProvider({ children }) {
    // Store the global specifications for components that we will eventually export.
    const [globalSpecs, setGlobalSpecs] = useState({
        button: {
            primaryBg: '#059669', // emerald-600 baseline
            primaryHoverBg: '#047857', // emerald-700
            primaryText: '#000000',
            primaryLabel: 'Primary Action',
            secondaryBg: '#ffffff',
            secondaryHoverBg: '#f8fafc', // slate-50
            secondaryDarkBg: '#262626', // neutral bg
            secondaryDarkHoverBg: '#1e293b', // slate-800
            secondaryText: '#334155', // slate-700
            secondaryDarkText: '#e2e8f0', // slate-200
            secondaryBorder: '#e2e8f0', // slate-200
            secondaryDarkBorder: '#334155', // slate-700
            secondaryLabel: 'Secondary',
            destructiveBg: '#e11d48', // rose-600
            destructiveHoverBg: '#be123c', // rose-700
            destructiveText: '#ffffff',
            destructiveLabel: 'Destructive',
            ghostText: '#2563eb', // blue-600
            ghostDarkText: '#60a5fa', // blue-400
            ghostHoverBg: '#eff6ff', // blue-50
            ghostDarkHoverBg: '#1e3a8a', // blue-900 with some opacity later
            ghostLabel: 'Ghost Button',
            borderRadius: 8,
            paddingX: 16,
            paddingY: 8,
            fontWeight: '500',
        },
        input: {
            bg: '#ffffff',
            darkBg: '#121212',
            borderColor: '#e2e8f0', // slate-200
            darkBorderColor: '#1e293b', // slate-800
            borderRadius: 8,
            paddingX: 12, // px-3
            paddingY: 8,  // py-2
            placeholder: 'Enter text...',
        },
        card: {
            bg: '#ffffff',
            darkBg: '#1a1a1a',
            borderColor: '#e2e8f0', // slate-200
            darkBorderColor: '#1e293b', // slate-800
            borderRadius: 12, // xl
            padding: 20, // p-5
            titleColor: '#64748b', // slate-500
            darkTitleColor: '#94a3b8', // slate-400
            valueColor: '#0f172a', // slate-900
            darkValueColor: '#3b82f6', // blue-500
            defaultTitle: 'KPI Metric',
        },
        nav: {
            activeText: '#2563eb', // blue-600
            darkActiveText: '#60a5fa', // blue-400
            activeBorder: '#3b82f6', // blue-500
            inactiveText: '#64748b', // slate-500
            darkInactiveText: '#cbd5e1', // slate-300
            hoverText: '#334155', // slate-700
            darkHoverText: '#e2e8f0', // slate-200
            defaultText: 'Nav Item',
        },
        overlay: {
            bg: '#ffffff',
            darkBg: '#1a1a1a',
            borderColor: '#e2e8f0', // slate-200
            darkBorderColor: '#1e293b', // slate-800
            borderRadius: 12, // 12px for xl
            title: 'Overlay Modal',
        },
        table: {
            bg: '#ffffff',
            darkBg: '#1a1a1a',
            borderColor: '#e2e8f0', // slate-200
            darkBorderColor: '#1e293b', // slate-800
            headerText: '#64748b', // slate-500
            darkHeaderText: '#94a3b8', // slate-400
            rowText: '#0f172a', // slate-900
            darkRowText: '#cbd5e1', // slate-300
            rowBorder: '#f1f5f9', // slate-100
            darkRowBorder: '#262626', // Custom dark border
            borderRadius: 12, // xl
            headerContent: 'Column Header',
        },
        typography: {
            h1: { fontSize: 36, fontWeight: '800', fontFamily: '"Inter", sans-serif', color: '#0f172a', darkColor: '#f8fafc', letterSpacing: '-0.025em', lineHeight: '1', content: 'Display Headline' },
            h2: { fontSize: 30, fontWeight: '700', fontFamily: '"Inter", sans-serif', color: '#0f172a', darkColor: '#f8fafc', letterSpacing: '-0.025em', lineHeight: '1.25', content: 'Page Title' },
            h3: { fontSize: 24, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#0f172a', darkColor: '#f8fafc', letterSpacing: '-0.025em', lineHeight: '1.375', content: 'Section Header' },
            h4: { fontSize: 20, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#0f172a', darkColor: '#f8fafc', letterSpacing: '-0.025em', lineHeight: '1.375', content: 'Card Title' },
            h5: { fontSize: 18, fontWeight: '500', fontFamily: '"Inter", sans-serif', color: '#0f172a', darkColor: '#f8fafc', letterSpacing: '-0.025em', lineHeight: '1.375', content: 'Subsection' },
            h6: { fontSize: 14, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#64748b', darkColor: '#94a3b8', letterSpacing: '0.05em', lineHeight: '1.375', textTransform: 'uppercase', content: 'Subtitle' },
            bodyBase: { fontSize: 16, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#334155', darkColor: '#cbd5e1', letterSpacing: 'normal', lineHeight: '1.625', content: 'The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading.' },
            bodySmall: { fontSize: 14, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#475569', darkColor: '#94a3b8', letterSpacing: 'normal', lineHeight: '1.625', content: 'The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter.' },
            bodyXs: { fontSize: 12, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#64748b', darkColor: '#64748b', letterSpacing: 'normal', lineHeight: '1.5', content: 'The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs.' },
            mono: { fontSize: 14, fontWeight: '400', fontFamily: 'monospace', color: '#1e293b', darkColor: '#e2e8f0', bg: '#f1f5f9', darkBg: '#1e293b', letterSpacing: 'normal', lineHeight: '1.5', content: 'UUID-8472-A9F3-XYZ' },
            metric: { fontSize: 36, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#2563eb', darkColor: '#60a5fa', letterSpacing: '-0.05em', lineHeight: '1', content: '$24.5M' },
            muted: { fontSize: 14, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#94a3b8', darkColor: '#64748b', fontStyle: 'italic', letterSpacing: 'normal', lineHeight: '1.5', content: 'No data available for the selected period.' },
            kpiTitle: { fontSize: 14, fontWeight: '500', fontFamily: '"Inter", sans-serif', color: '#64748b', darkColor: '#94a3b8', letterSpacing: 'normal', lineHeight: '1.25', content: 'Total Revenue' },
            kpiValue: { fontSize: 30, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#0f172a', darkColor: '#f8fafc', letterSpacing: '-0.025em', lineHeight: '1.25', content: '$124.5k' },
            buttonText: { fontSize: 14, fontWeight: '500', fontFamily: '"Inter", sans-serif', color: '#ffffff', darkColor: '#ffffff', letterSpacing: 'normal', lineHeight: '1.25', content: 'Primary Action' },
            navText: { fontSize: 14, fontWeight: '500', fontFamily: '"Inter", sans-serif', color: '#64748b', darkColor: '#94a3b8', letterSpacing: 'normal', lineHeight: '1.25', content: 'Dashboard Home' },
            tooltipText: { fontSize: 12, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#0f172a', darkColor: '#f8fafc', letterSpacing: 'normal', lineHeight: '1.5', content: 'Last updated 2 hours ago' },
            tableHeader: { fontSize: 12, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#64748b', darkColor: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: '1', content: 'Transaction Type' },
            tableRow: { fontSize: 14, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#0f172a', darkColor: '#cbd5e1', letterSpacing: 'normal', lineHeight: '1.25', content: 'Payment sent to vendor' }
        }

    });

    // What component type is currently selected? (e.g., 'button', 'input')
    const [selectedType, setSelectedType] = useState(null);
    // What specific variant of that type is selected? (e.g., 'primary', 'secondary')
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Global editor mode: 'edit' or 'preview'
    const [editorMode, setEditorMode] = useState('edit');

    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (
                !e.target.closest('#editor-sidebar') &&
                !e.target.closest('.editable-component-wrapper') &&
                !e.target.closest('#main-nav-sidebar')
            ) {
                if (editorMode === 'edit') {
                    setSelectedType(null);
                    setSelectedVariant(null);
                }
            }
        };
        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, []);

    const updateGlobalSpec = (type, key, ...args) => {
        if (args.length === 2) {
            const [subKey, value] = args;
            setGlobalSpecs(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    [key]: {
                        ...prev[type][key],
                        [subKey]: value
                    }
                }
            }));
        } else {
            const [value] = args;
            setGlobalSpecs(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    [key]: value
                }
            }));
        }
    };

    return (
        <EditorContext.Provider value={{
            globalSpecs,
            updateGlobalSpec,
            selectedType,
            setSelectedType,
            selectedVariant,
            setSelectedVariant,
            editorMode,
            setEditorMode
        }}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    return useContext(EditorContext);
}
