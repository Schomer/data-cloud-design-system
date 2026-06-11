import React, { useState, useEffect } from 'react';
import { Copy, Trash, CheckCircle2, PackageSearch, PenTool } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { useAuth } from '../context/AuthContext';
import * as fs from '../services/firestoreService';

function ThemeThumbnail({ specs, colors }) {
    if (!specs || !specs.light) return <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-md"></div>;
    const bg = specs.light.card.bg;
    const pBg = specs.light.button.primaryBg;
    const text = specs.light.typography.h2.color;
    
    return (
        <div className="h-32 rounded-md border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-2" style={{ backgroundColor: bg }}>
            <div className="h-4 w-1/2 rounded" style={{ backgroundColor: text, opacity: 0.8 }}></div>
            <div className="h-2 w-3/4 rounded" style={{ backgroundColor: text, opacity: 0.5 }}></div>
            <div className="flex-1 flex items-end gap-1 mt-2">
                {[40, 70, 30, 90, 50].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: colors ? (colors.light ? colors.light[i % colors.light.length] : pBg) : pBg }}></div>
                ))}
            </div>
        </div>
    );
}

export default function ThemeGallery({ onEditTheme }) {
    const { activeThemeId, setActiveThemeId } = useEditor();
    const { isAdmin } = useAuth();
    const [themes, setThemes] = useState([]);
    const [themeConfigs, setThemeConfigs] = useState({});
    
    const loadThemes = async () => {
        try {
            const themesData = await fs.getThemes();
            setThemes(themesData);
            // Load specs and colors for each theme
            for (const t of themesData) {
                const [specs, colors] = await Promise.all([
                    fs.getSpecs(t.id),
                    fs.getChartColors(t.id),
                ]);
                setThemeConfigs(prev => ({
                    ...prev,
                    [t.id]: { specs, colors }
                }));
            }
        } catch (err) {
            console.error("Failed to load themes", err);
        }
    };

    useEffect(() => { loadThemes(); }, []);

    const handleDuplicate = async (sourceId) => {
        if (!isAdmin) return;
        const sourceTheme = themes.find(t => t.id === sourceId);
        const newName = `${sourceTheme.name} Copy`;
        await fs.createTheme({ sourceThemeId: sourceId, name: newName });
        loadThemes();
    };

    const handleDelete = async (id) => {
        if (!isAdmin) return;
        await fs.deleteTheme(id);
        loadThemes();
    };

    const selectTheme = (id) => {
        setActiveThemeId(id);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h1 className="text-3xl font-bold mb-2">Themes Library</h1>
                <p className="text-slate-500">Create, manage, and duplicate visual themes for your applications.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {themes.map(t => (
                    <div key={t.id} className={`group relative bg-white dark:bg-[#1a1a1a] rounded-xl border p-4 transition-all ${activeThemeId === t.id ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                        {activeThemeId === t.id && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-0.5">
                                <CheckCircle2 size={16} />
                            </div>
                        )}
                        <ThemeThumbnail specs={themeConfigs[t.id]?.specs} colors={themeConfigs[t.id]?.colors} />
                        <div className="mt-4">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description || 'No description provided.'}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                            {activeThemeId !== t.id ? (
                                <button onClick={() => selectTheme(t.id)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium py-1.5 rounded transition">
                                    Select
                                </button>
                            ) : (
                                <button onClick={() => onEditTheme()} className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-medium py-1.5 rounded transition flex items-center justify-center gap-1">
                                    <PenTool size={14} /> Edit Visuals
                                </button>
                            )}
                            {isAdmin && (
                                <button onClick={() => handleDuplicate(t.id)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded hover:bg-blue-50 dark:hover:bg-slate-800" title="Duplicate">
                                    <Copy size={16} />
                                </button>
                            )}
                            {isAdmin && t.id !== 'dak_default' && (
                                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-slate-800" title="Delete">
                                    <Trash size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
