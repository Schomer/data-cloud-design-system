import os
import re
from pathlib import Path

root_dir = Path("/Users/schomer/Desktop/Data Cloud Design System")
src_dir = root_dir / "frontend" / "src"

# 1. Update EditorContext.jsx
editor_context_path = src_dir / "context" / "EditorContext.jsx"
with open(editor_context_path, "r") as f:
    ec_content = f.read()

# Add activeWorkspaceThemeId to EditorContext state
state_block = """    const [globalSpecs, setGlobalSpecs] = useState(initialSpecs);
    const [theme, setTheme] = useState('dark'); // 'light' or 'dark'
    const [activeThemeId, setActiveThemeId] = useState('dak_default');
    const [isInitialLoad, setIsInitialLoad] = useState(true);"""

ec_content = re.sub(
    r"const \[globalSpecs, setGlobalSpecs\] = useState\(initialSpecs\);\n\s*const \[theme, setTheme\] = useState\('dark'\);[^\n]*\n\s*const \[isInitialLoad, setIsInitialLoad\] = useState\(true\);",
    state_block,
    ec_content
)

fetch_block_old = """                const [specsRes, themeRes] = await Promise.all([
                    axios.get('/api/specs'),
                    axios.get('/api/theme')
                ]);"""
fetch_block_new = """                const [specsRes, themeRes] = await Promise.all([
                    axios.get(`/api/specs?theme_id=${activeThemeId}`),
                    axios.get('/api/theme')
                ]);"""
ec_content = ec_content.replace(fetch_block_old, fetch_block_new)

# Make fetchData re-run on activeThemeId change
ec_content = ec_content.replace("}, []);", "}, [activeThemeId]);")

# Update save specs to pass theme_id
save_specs_old = "await axios.post('/api/specs', globalSpecs);"
save_specs_new = "await axios.post(`/api/specs?theme_id=${activeThemeId}`, globalSpecs);"
ec_content = ec_content.replace(save_specs_old, save_specs_new)

# Expose activeThemeId
context_value_old = """        <EditorContext.Provider value={{
            globalSpecs,
            updateGlobalSpec,"""
context_value_new = """        <EditorContext.Provider value={{
            globalSpecs,
            updateGlobalSpec,
            activeThemeId,
            setActiveThemeId,"""
ec_content = ec_content.replace(context_value_old, context_value_new)

with open(editor_context_path, "w") as f:
    f.write(ec_content)

print("Updated EditorContext.jsx")

# 2. Update UpdateSkillsButton.jsx to pass theme_id
usb_path = src_dir / "components" / "UpdateSkillsButton.jsx"
with open(usb_path, "r") as f:
    usb_content = f.read()

if "activeThemeId" not in usb_content:
    usb_content = usb_content.replace(
        "const { globalSpecs } = useEditor();",
        "const { globalSpecs, activeThemeId } = useEditor();\n    const [chartColors, setChartColors] = useState({});\n    useEffect(() => { axios.get(`/api/chart_colors?theme_id=${activeThemeId}`).then(res => setChartColors(res.data)).catch() }, [activeThemeId]);"
    )
    usb_content = usb_content.replace(
        "axios.post('/api/export-skills', {",
        "axios.post(`/api/export-skills?theme_id=${activeThemeId}`, {"
    )
    usb_content = usb_content.replace("chartColors: []", "chartColors: chartColors")
    with open(usb_path, "w") as f:
        f.write(usb_content)

# 3. Create ThemeGallery.jsx
theme_gallery_content = """import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy, Trash, CheckCircle2, PackageSearch, PenTool } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

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
    const [themes, setThemes] = useState([]);
    const [themeConfigs, setThemeConfigs] = useState({});
    
    const loadThemes = () => {
        axios.get('/api/themes').then(res => {
            setThemes(res.data);
            res.data.forEach(t => {
                axios.get(`/api/specs?theme_id=${t.id}`).then(specRes => {
                    axios.get(`/api/chart_colors?theme_id=${t.id}`).then(colorRes => {
                        setThemeConfigs(prev => ({
                            ...prev,
                            [t.id]: { specs: specRes.data, colors: colorRes.data }
                        }));
                    });
                });
            });
        });
    };

    useEffect(() => { loadThemes(); }, []);

    const handleDuplicate = async (sourceId) => {
        const sourceTheme = themes.find(t => t.id === sourceId);
        const newName = `${sourceTheme.name} Copy`;
        await axios.post('/api/themes', { source_theme_id: sourceId, name: newName });
        loadThemes();
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/themes/${id}`);
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
                            <button onClick={() => handleDuplicate(t.id)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded hover:bg-blue-50 dark:hover:bg-slate-800" title="Duplicate">
                                <Copy size={16} />
                            </button>
                            {t.id !== 'dak_default' && (
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
"""
with open(src_dir / "components" / "ThemeGallery.jsx", "w") as f:
    f.write(theme_gallery_content)

print("Created ThemeGallery.jsx")

# 4. Integrate into App.jsx
app_path = src_dir / "App.jsx"
with open(app_path, "r") as f:
    app_content = f.read()

app_imports = "import ThemeGallery from './components/ThemeGallery';\nimport { Palette } from 'lucide-react';\n"
if "import ThemeGallery" not in app_content:
    app_content = app_content.replace(
        "import NavigationGallery from './components/NavigationGallery';",
        app_imports + "import NavigationGallery from './components/NavigationGallery';"
    )

    # Add Sidebar Button
    theme_btn = """
                        <button
                            onClick={() => setActiveSection('Themes Library')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === 'Themes Library'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800/50 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 font-medium border border-transparent'
                                }`}
                        >
                            <Palette size={16} className={activeSection === 'Themes Library' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"} /> Themes Library
                        </button>
"""
    app_content = app_content.replace(
        "App Playground\n                        </button>",
        "App Playground\n                        </button>" + theme_btn
    )

    # Route ThemeGallery
    app_content = app_content.replace(
        "{activeSection === 'Home' &&",
        "{activeSection === 'Themes Library' && <ThemeGallery onEditTheme={() => setActiveSection('Typography')} />}\n                    {activeSection === 'Home' &&"
    )

    # Badge in Top Header
    app_content = app_content.replace(
        "<span>DAK Hyperskills</span>",
        "<span>DAK Hyperskills</span>\n                    {activeSection !== 'Themes Library' && <span className=\"ml-4 text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500\">Editing Theme</span>}"
    )

    with open(app_path, "w") as f:
        f.write(app_content)

print("Updated App.jsx")

# 5. Update AppsPage.jsx
apps_path = src_dir / "components" / "AppsPage.jsx"
with open(apps_path, "r") as f:
    apps_content = f.read()

if "theme_id" not in apps_content:
    apps_content = apps_content.replace(
        "const [prompt, setPrompt] = useState('');",
        "const [prompt, setPrompt] = useState('');\n    const [themes, setThemes] = useState([]);\n    const [selectedThemeId, setSelectedThemeId] = useState('dak_default');\n    useEffect(() => { axios.get('/api/themes').then(res => setThemes(res.data)) }, []);"
    )
    apps_content = apps_content.replace(
        "axios.post('/api/apps/generate', { prompt, use_skills: isChecked })",
        "axios.post('/api/apps/generate', { prompt, use_skills: isChecked, theme_id: selectedThemeId })"
    )

    # Add Theme Selector to the UI
    theme_selector = """
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select 
                            value={selectedThemeId} 
                            onChange={e => setSelectedThemeId(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-800 border-none text-sm rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 w-full sm:w-auto"
                        >
                            {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
"""
    apps_content = apps_content.replace(
        '<div className="flex flex-col sm:flex-row items-center gap-4">',
        '<div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">\n' + theme_selector
    )
    with open(apps_path, "w") as f:
        f.write(apps_content)

print("Updated AppsPage.jsx")
