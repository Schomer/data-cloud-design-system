import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import * as fs from '../services/firestoreService';

const EditorContext = createContext();

/**
 * Deep merge two objects.
 */
function deepMerge(target, source) {
    if (!source) return target;
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

const initialSpecs = {
    light: {
        button: {
            primaryBg: '#2563eb',
            primaryHoverBg: '#1d4ed8',
            primaryText: '#ffffff',
            primaryLabel: 'Primary Action',
            secondaryBg: '#ffffff',
            secondaryHoverBg: '#f8fafc',
            secondaryText: '#475569',
            secondaryBorder: '#e2e8f0',
            secondaryLabel: 'Secondary',
            destructiveBg: '#ef4444',
            destructiveHoverBg: '#dc2626',
            destructiveText: '#ffffff',
            destructiveLabel: 'Destructive',
            ghostText: '#2563eb',
            ghostHoverBg: '#eff6ff',
            ghostLabel: 'Ghost Button',
            borderRadius: 8,
            paddingX: 16,
            paddingY: 8,
            fontWeight: '500',
            typographyVariant: 'p',
        },
        input: {
            bg: '#ffffff',
            borderColor: '#e2e8f0',
            focusRingColor: '#3b82f6',
            borderRadius: 8,
            paddingX: 12,
            paddingY: 8,
            placeholder: 'Enter text...',
            textColor: '#0f172a',
            typographyVariant: 'p',
        },
        checkbox: {
            bg: '#3b82f6',
            borderColor: '#e2e8f0',
            textColor: '#475569',
            typographyVariant: 'p',
        },
        radio: {
            bg: '#ffffff',
            dotColor: '#3b82f6',
            textColor: '#475569',
            typographyVariant: 'p',
        },
        switch: {
            bgOn: '#3b82f6',
            bgOff: '#e2e8f0',
            circleOn: '#ffffff',
            circleOff: '#ffffff',
        },
        segmented: {
            bg: '#f1f5f9',
            selectedBg: '#ffffff',
            selectedText: '#0f172a',
            textColor: '#64748b',
            typographyVariant: 'small',
        },
        card: {
            bg: '#ffffff',
            borderColor: '#e2e8f0',
            borderRadius: 12,
            padding: 20,
            titleColor: '#64748b',
            valueColor: '#0f172a',
            defaultTitle: 'KPI Metric',
            titleTypography: 'xs',
            valueTypography: 'h2',
        },
        nav: {
            bg: '#ffffff',
            borderColor: '#e2e8f0',
            activeText: '#2563eb',
            activeBorder: '#3b82f6',
            inactiveText: '#64748b',
            hoverText: '#0f172a',
            defaultText: 'Nav Item',
            typographyVariant: 'small',
        },
        wizard: {
            stepBg: '#ffffff',
            stepBorder: '#e2e8f0',
            activeBg: '#ebf5ff',
            activeBorder: '#3b82f6',
            activeText: '#1d4ed8',
            completedBg: '#ecfdf5',
            completedBorder: '#10b981',
            completedText: '#047857',
            inactiveText: '#64748b',
        },
        overlay: {
            bg: '#ffffff',
            borderColor: '#e2e8f0',
            textColor: '#64748b',
            headerTextColor: '#0f172a',
            footerBg: '#f8fafc',
            borderRadius: 12,
            title: 'Overlay Modal',
        },
        table: {
            bg: '#ffffff',
            borderColor: '#e2e8f0',
            headerText: '#64748b',
            rowText: '#475569',
            rowBorder: '#f1f5f9',
            borderRadius: 12,
            headerTypography: 'xs',
            rowTypography: 'p',
        },
        filterChip: {
            bg: '#eff6ff',
            borderColor: '#bfdbfe',
            textColor: '#1d4ed8',
            borderRadius: 9999,
        },
        tooltip: {
            bg: '#0f172a',
            textColor: '#ffffff',
            typographyVariant: 'xs',
        },
        typography: {
            h1: { fontSize: 48, fontWeight: '700', fontFamily: '"Inter", sans-serif', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: '1.2', content: 'Design System' },
            h2: { fontSize: 30, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#0f172a', letterSpacing: '-0.01em', lineHeight: '1.3', content: 'Main Heading' },
            h3: { fontSize: 24, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#0f172a', letterSpacing: 'normal', lineHeight: '1.4', content: 'Sub-section' },
            h4: { fontSize: 18, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#0f172a', letterSpacing: 'normal', lineHeight: '1.5', content: 'Minor Title' },
            h5: { fontSize: 16, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#0f172a', letterSpacing: 'normal', lineHeight: '1.5', content: 'Card Header' },
            h6: { fontSize: 14, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#0f172a', letterSpacing: 'normal', lineHeight: '1.5', content: 'Utility Title' },
            p: { fontSize: 16, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#475569', letterSpacing: 'normal', lineHeight: '1.6', content: 'Standard body text for reading descriptions.' },
            small: { fontSize: 14, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#64748b', letterSpacing: 'normal', lineHeight: '1.5', content: 'Caption or fine print.' },
            xs: { fontSize: 12, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#64748b', letterSpacing: 'normal', lineHeight: '1.5', content: 'Extra small and utility text.' },
            mono: { fontSize: 14, fontWeight: '400', fontFamily: 'monospace', color: '#475569', bg: '#f1f5f9', letterSpacing: 'normal', lineHeight: '1.5', content: 'UUID-8472-A9F3-XYZ' },
            muted: { fontSize: 14, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#94a3b8', fontStyle: 'italic', letterSpacing: 'normal', lineHeight: '1.5', content: 'No data available for the selected period.' }
        },
        alert: {
            infoBg: '#eff6ff',
            infoBorder: '#bfdbfe',
            infoIcon: '#60a5fa',
            infoTitle: '#1e40af',
            infoText: '#1d4ed8',
            successBg: '#ecfdf5',
            successBorder: '#a7f3d0',
            successIcon: '#34d399',
            successTitle: '#065f46',
            successText: '#047857',
            warningBg: '#fffbeb',
            warningBorder: '#fde68a',
            warningIcon: '#fbbf24',
            warningTitle: '#92400e',
            warningText: '#b45309',
            errorBg: '#fff1f2',
            errorBorder: '#fecdd3',
            errorIcon: '#fb7185',
            errorTitle: '#9f1239',
            errorText: '#be123c',
            borderRadius: 6,
        },
        loader: {
            spinnerColor: '#2563eb',
            spinnerSecondaryColor: '#94a3b8',
            spinnerSuccessColor: '#10b981',
            progressBg: '#e2e8f0',
            progressFill: '#2563eb',
            borderRadius: 4,
        },
        chart: {
            titleTypography: 'h3',
            subtitleTypography: 'small',
            headerPaddingY: 16,
        }
    },
    dark: {
        button: {
            primaryBg: '#2563eb',
            primaryHoverBg: '#1d4ed8',
            primaryText: '#ffffff',
            primaryLabel: 'Primary Action',
            secondaryBg: '#262626',
            secondaryHoverBg: '#1e293b',
            secondaryText: '#e2e8f0',
            secondaryBorder: '#334155',
            secondaryLabel: 'Secondary',
            destructiveBg: '#ef4444',
            destructiveHoverBg: '#dc2626',
            destructiveText: '#ffffff',
            destructiveLabel: 'Destructive',
            ghostText: '#60a5fa',
            ghostHoverBg: '#1e3a8a',
            ghostLabel: 'Ghost Button',
            borderRadius: 8,
            paddingX: 16,
            paddingY: 8,
            fontWeight: '500',
            typographyVariant: 'p',
        },
        input: {
            bg: '#121212',
            borderColor: '#1e293b',
            focusRingColor: '#3b82f6',
            borderRadius: 8,
            paddingX: 12,
            paddingY: 8,
            placeholder: 'Enter text...',
            textColor: '#f8fafc',
            typographyVariant: 'p',
        },
        checkbox: {
            bg: '#3b82f6',
            borderColor: '#334155',
            textColor: '#cbd5e1',
            typographyVariant: 'p',
        },
        radio: {
            bg: '#121212',
            dotColor: '#3b82f6',
            textColor: '#cbd5e1',
            typographyVariant: 'p',
        },
        switch: {
            bgOn: '#3b82f6',
            bgOff: '#334155',
            circleOn: '#ffffff',
            circleOff: '#cbd5e1',
        },
        segmented: {
            bg: '#121212',
            selectedBg: '#262626',
            selectedText: '#60a5fa',
            textColor: '#94a3b8',
            typographyVariant: 'small',
        },
        card: {
            bg: '#1a1a1a',
            borderColor: '#1e293b',
            borderRadius: 12,
            padding: 20,
            titleColor: '#94a3b8',
            valueColor: '#3b82f6',
            defaultTitle: 'KPI Metric',
            titleTypography: 'xs',
            valueTypography: 'h2',
        },
        nav: {
            bg: '#1a1a1a',
            borderColor: '#1e293b',
            activeText: '#60a5fa',
            activeBorder: '#3b82f6',
            inactiveText: '#cbd5e1',
            hoverText: '#e2e8f0',
            defaultText: 'Nav Item',
            typographyVariant: 'small',
        },
        wizard: {
            stepBg: '#121212',
            stepBorder: '#1e293b',
            activeBg: '#1e3a8a',
            activeBorder: '#3b82f6',
            activeText: '#bfdbfe',
            completedBg: '#064e3b',
            completedBorder: '#10b981',
            completedText: '#a7f3d0',
            inactiveText: '#94a3b8',
        },
        overlay: {
            bg: '#1a1a1a',
            borderColor: '#1e293b',
            textColor: '#94a3b8',
            headerTextColor: '#f8fafc',
            footerBg: '#121212',
            borderRadius: 12,
            title: 'Overlay Modal',
        },
        table: {
            bg: '#1a1a1a',
            borderColor: '#1e293b',
            headerText: '#94a3b8',
            rowText: '#cbd5e1',
            rowBorder: '#1e293b',
            borderRadius: 12,
            headerTypography: 'xs',
            rowTypography: 'p',
        },
        filterChip: {
            bg: '#1e3a8a',
            borderColor: '#1e4ed8',
            textColor: '#f8fafc',
            borderRadius: 9999,
        },
        tooltip: {
            bg: '#334155',
            textColor: '#f8fafc',
            typographyVariant: 'xs',
        },
        typography: {
            h1: { fontSize: 48, fontWeight: '700', fontFamily: '"Inter", sans-serif', color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: '1.2', content: 'Design System' },
            h2: { fontSize: 30, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#f8fafc', letterSpacing: '-0.01em', lineHeight: '1.3', content: 'Main Heading' },
            h3: { fontSize: 24, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#f8fafc', letterSpacing: 'normal', lineHeight: '1.4', content: 'Sub-section' },
            h4: { fontSize: 18, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#f8fafc', letterSpacing: 'normal', lineHeight: '1.5', content: 'Minor Title' },
            h5: { fontSize: 16, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#f8fafc', letterSpacing: 'normal', lineHeight: '1.5', content: 'Card Header' },
            h6: { fontSize: 14, fontWeight: '600', fontFamily: '"Inter", sans-serif', color: '#f8fafc', letterSpacing: 'normal', lineHeight: '1.5', content: 'Utility Title' },
            p: { fontSize: 16, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#cbd5e1', letterSpacing: 'normal', lineHeight: '1.6', content: 'Standard body text for reading descriptions.' },
            small: { fontSize: 14, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#94a3b8', letterSpacing: 'normal', lineHeight: '1.5', content: 'Caption or fine print.' },
            xs: { fontSize: 12, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#94a3b8', letterSpacing: 'normal', lineHeight: '1.5', content: 'Extra small and utility text.' },
            mono: { fontSize: 14, fontWeight: '400', fontFamily: 'monospace', color: '#cbd5e1', bg: '#1e293b', letterSpacing: 'normal', lineHeight: '1.5', content: 'UUID-8472-A9F3-XYZ' },
            muted: { fontSize: 14, fontWeight: '400', fontFamily: '"Inter", sans-serif', color: '#64748b', fontStyle: 'italic', letterSpacing: 'normal', lineHeight: '1.5', content: 'No data available for the selected period.' }
        },
        alert: {
            infoBg: '#1e3a8a', // blue-900/20 in tailwind roughly, backing it to hex
            infoBorder: '#1e40af',
            infoIcon: '#3b82f6',
            infoTitle: '#93c5fd',
            infoText: '#60a5fa',
            successBg: '#064e3b', // emerald-900/20
            successBorder: '#065f46',
            successIcon: '#10b981',
            successTitle: '#6ee7b7',
            successText: '#34d399',
            warningBg: '#78350f', // amber-900/20
            warningBorder: '#92400e',
            warningIcon: '#f59e0b',
            warningTitle: '#fcd34d',
            warningText: '#fbbf24',
            errorBg: '#881337', // rose-900/20
            errorBorder: '#9f1239',
            errorIcon: '#f43f5e',
            errorTitle: '#fda4af',
            errorText: '#fb7185',
            borderRadius: 6,
        },
        loader: {
            spinnerColor: '#3b82f6',
            spinnerSecondaryColor: '#64748b',
            spinnerSuccessColor: '#10b981',
            progressBg: '#334155',
            progressFill: '#3b82f6',
            borderRadius: 4,
        },
        chart: {
            titleTypography: 'h3',
            subtitleTypography: 'small',
            headerPaddingY: 16,
        }
    }
};

export function EditorProvider({ children }) {
    // Store the global specifications for components that we will eventually export.
        const [globalSpecs, setGlobalSpecs] = useState(initialSpecs);
    const [theme, setTheme] = useState('light'); // 'light' or 'dark'
    const [activeThemeId, setActiveThemeId] = useState('dak_default');
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const saveTimeoutRef = useRef(null);
    const hasInitialLoadedRef = useRef(false);
    const { isAdmin, getAuthHeaders } = useAuth();


    // Fetch initial specs and theme from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                // First get the active theme ID
                const initialActiveThemeId = await fs.getActiveThemeId();
                setActiveThemeId(initialActiveThemeId);

                const [specsData, uiTheme] = await Promise.all([
                    fs.getSpecs(initialActiveThemeId),
                    fs.getUiTheme()
                ]);
                
                if (specsData && Object.keys(specsData).length > 0) {
                    setGlobalSpecs(specsData);
                } else {
                    // Reset to defaults if no specs found for this theme
                    setGlobalSpecs({
                        ...initialSpecs,
                        typography: { ...initialSpecs.typography }
                    });
                }
                
                if (uiTheme) {
                    setTheme(uiTheme);
                }
            } catch (err) {
                console.error("Failed to fetch initial data", err);
            } finally {
                setIsInitialLoad(false);
                hasInitialLoadedRef.current = true;
            }
        };
        fetchData();
    }, []); // Only run once on mount

    // Fetch specs when activeThemeId changes (after initial load)
    useEffect(() => {
        if (isInitialLoad || !hasInitialLoadedRef.current) return;
        
        const fetchSpecsForTheme = async () => {
            try {
                const specsData = await fs.getSpecs(activeThemeId);
                if (specsData && Object.keys(specsData).length > 0) {
                    setGlobalSpecs(specsData);
                }
            } catch (err) {
                console.error("Failed to fetch specs for new theme", err);
            }
        };
        
        fetchSpecsForTheme();
        
        // Also save the active theme ID to Firestore (admin only)
        if (isAdmin) {
            fs.saveActiveThemeId(activeThemeId).catch(e => console.error("Failed to save active theme ID", e));
        }

    }, [activeThemeId, isInitialLoad, isAdmin]);

    // Save to Firestore when theme changes (admin only)
    useEffect(() => {
        if (isInitialLoad || !hasInitialLoadedRef.current) return;
        if (!isAdmin) return;
        fs.saveUiTheme(theme).catch(e => console.error("Failed to save theme", e));
    }, [theme, isInitialLoad, isAdmin]);

    // Automated saving is removed to prevent cross-contamination on theme load.
    // It is now handled directly by updateGlobalSpec.

    // What component type is currently selected? (e.g., 'button', 'input')
    const [selectedType, setSelectedType] = useState(null);
    // What specific variant of that type is selected? (e.g., 'primary', 'secondary')
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Global editor mode: 'edit' or 'preview'
    const [editorMode, setEditorMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('app')) {
                return 'preview';
            }
        }
        return 'edit';
    });

    // Skill currently being edited (path to the skill file, null if closed)
    const [editingSkill, setEditingSkill] = useState(null);

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
    }, [editorMode]);

    const updateGlobalSpec = (type, key, ...args) => {
        let newState = null;
        if (args.length === 2) {
            const [subKey, value] = args;
            setGlobalSpecs(prev => {
                newState = {
                    ...prev,
                    [theme]: {
                        ...prev[theme],
                        [type]: {
                            ...prev[theme][type],
                            [key]: {
                                ...prev[theme][type][key],
                                [subKey]: value
                            }
                        }
                    }
                };
                return newState;
            });
        } else {
            const [value] = args;
            setGlobalSpecs(prev => {
                newState = {
                    ...prev,
                    [theme]: {
                        ...prev[theme],
                        [type]: {
                            ...prev[theme][type],
                            [key]: value
                        }
                    }
                };
                return newState;
            });
        }
        
        // Trigger save (admin only)
        if (isAdmin) {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                 if (newState) {
                     fs.saveSpecs(activeThemeId, newState).catch(e => console.error(e));
                 }
            }, 1000);
        }
    };

    return (
        <EditorContext.Provider value={{
            globalSpecs,
            updateGlobalSpec,
            activeThemeId,
            setActiveThemeId,
            selectedType,
            setSelectedType,
            selectedVariant,
            setSelectedVariant,
            editorMode,
            setEditorMode,
            editingSkill,
            setEditingSkill,
            theme,
            setTheme
        }}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    return useContext(EditorContext);
}
