import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEditor } from './EditorContext';
import { useAuth } from './AuthContext';
import { arrayMove } from '@dnd-kit/sortable';
import * as fs from '../services/firestoreService';

const INITIAL_LIGHT_COLORS = [
    '#2563eb', // blue-600
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // rose-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
];

const INITIAL_DARK_COLORS = [
    '#60a5fa', // blue-400
    '#34d399', // emerald-400
    '#fbbf24', // amber-400
    '#f87171', // rose-400
    '#a78bfa', // violet-400
    '#f472b6', // pink-400
    '#22d3ee', // cyan-400
    '#a3e635', // lime-400
    '#fb923c', // orange-400
    '#818cf8', // indigo-400
];

const ChartColorContext = createContext();

export function ChartColorProvider({ children }) {
    const { theme, activeThemeId } = useEditor();
    const { isAdmin } = useAuth();

    const [allColors, setAllColors] = useState({
        light: INITIAL_LIGHT_COLORS,
        dark: INITIAL_DARK_COLORS
    });

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Load from Firestore on mount and when activeThemeId changes
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const data = await fs.getChartColors(activeThemeId);
                if (data && Object.keys(data).length > 0) {
                     setAllColors(data);
                }
            } catch (err) {
                console.error("Failed to fetch chart colors", err);
            } finally {
                setIsInitialLoad(false);
            }
        };
        fetchColors();
    }, [activeThemeId]);

    const saveToFirestore = (newColors) => {
        if (!isAdmin) return;
        fs.saveChartColors(activeThemeId, newColors).catch(e => console.error("Failed to save chart colors", e));
    };

    const chartColors = allColors[theme] || INITIAL_LIGHT_COLORS;

    const reorderColors = (oldIndex, newIndex) => {
        const newArray = arrayMove(allColors[theme], oldIndex, newIndex);
        const newState = { ...allColors, [theme]: newArray };
        setAllColors(newState);
        saveToFirestore(newState);
    };

    const updateColor = (index, newColor) => {
        const newArray = allColors[theme].map((c, i) => i === index ? newColor : c);
        const newState = { ...allColors, [theme]: newArray };
        setAllColors(newState);
        saveToFirestore(newState);
    };

    return (
        <ChartColorContext.Provider value={{ chartColors, updateColor, reorderColors, allColors }}>
            {children}
        </ChartColorContext.Provider>
    );
}

export function useChartColors() {
    const context = useContext(ChartColorContext);
    if (!context) {
        throw new Error('useChartColors must be used within a ChartColorProvider');
    }
    return context;
}
