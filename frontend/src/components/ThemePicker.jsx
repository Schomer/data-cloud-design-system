import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useEditor } from '../context/EditorContext';
import { Palette, ChevronDown, Check } from 'lucide-react';

// Predefined colors for swatches based on theme names
const THEME_COLORS = {
    'DAK Hyperskills': '#3b82f6', // blue
    'Google Material 3': '#6750a4', // purple
    'Google Cloud': '#1a73e8', // blue
    'Cyberpunk Neon': '#f0f', // neon pink
    'Oceanic Blue': '#0ea5e9', // light blue
    'Nord Arctic': '#88c0d0', // nord frost
    'Dracula': '#bd93f9', // purple
    'Forest Green': '#22c55e', // green
    'Monokai Classic': '#a6e22e', // green
    'Sunset Orange': '#f97316', // orange
    'Pastel Dream': '#f472b6', // pink
    'High Contrast Base': '#000000', // black
    'Earthy Sepia': '#d97706', // amber
};

export default function ThemePicker() {
    const { activeThemeId, setActiveThemeId } = useEditor();
    const [themes, setThemes] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        axios.get('/api/themes')
            .then(res => setThemes(res.data))
            .catch(err => console.error("Failed to load themes", err));
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (themes.length === 0) return null;

    const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];

    const handleSelect = (id) => {
        setActiveThemeId(id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-slate-50 dark:bg-[#262626] hover:bg-slate-100 dark:hover:bg-[#333333] px-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors h-9 shadow-sm"
            >
                <div 
                    className="w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-black/10 dark:ring-white/10" 
                    style={{ backgroundColor: THEME_COLORS[activeTheme?.name] || '#3b82f6' }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
                    {activeTheme?.name || 'Theme'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Theme</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {themes.map(t => {
                            const isSelected = t.id === activeThemeId;
                            const swatchColor = THEME_COLORS[t.name] || '#cbd5e1';
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => handleSelect(t.id)}
                                    className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                                        isSelected 
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                                            : 'hover:bg-slate-50 dark:hover:bg-[#262626] text-slate-700 dark:text-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-4 h-4 rounded-full shadow-sm ring-1 ring-black/10 dark:ring-white/10 shrink-0" 
                                            style={{ backgroundColor: swatchColor }}
                                        />
                                        <span className="text-sm font-medium truncate">{t.name}</span>
                                    </div>
                                    {isSelected && <Check size={14} className="shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
