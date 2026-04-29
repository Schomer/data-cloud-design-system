import React, { useState, useEffect } from 'react';
import { Moon, Sun, Layout, Settings2, Component, Home, AppWindow } from 'lucide-react';
import { useEditor } from './context/EditorContext';
import EditorSidebar from './components/EditorSidebar';
import UpdateSkillsButton from './components/UpdateSkillsButton';
import EditorModeToggle from './components/EditorModeToggle';
import Typography from './components/Typography';
import SkillEditorModal from './components/SkillEditorModal';

// New Galleries
import HomePage from './components/HomePage';
import HowItWorksPage from './components/HowItWorksPage';
import AppsPage from './components/AppsPage';
import TypographyGallery from './components/TypographyGallery';
import ControlsGallery from './components/ControlsGallery';
import ThemeGallery from './components/ThemeGallery';
import { Palette } from 'lucide-react';
import NavigationGallery from './components/NavigationGallery';
import FeedbackGallery from './components/FeedbackGallery';
import TableGallery from './components/TableGallery';
import ChartGallery from './components/ChartGallery';
import ChartGalleryTime from './components/ChartGalleryTime';
import ChartGalleryDistributions from './components/ChartGalleryDistributions';
import ChartGalleryMaps from './components/ChartGalleryMaps';
import ChartGallerySpecialized from './components/ChartGallerySpecialized';
import ChartGalleryProportions from './components/ChartGalleryProportions';
import GeminiChatGallery from './components/GeminiChatGallery';

import AppInspectorOverlay from './components/AppInspectorOverlay';

// Dynamically load all generated apps and metadata
const generatedApps = import.meta.glob('./generated_apps/*.jsx', { eager: true });
const generatedAppMeta = import.meta.glob('./generated_apps/*.json', { eager: true });


function App() {
    // Apply global theme settings (needed for Tailwind dark mode on HTML element)
    const { theme, setTheme } = useEditor();
    const isDarkMode = theme === 'dark';

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Isolated Render mode for generated apps
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('app');

    if (appId) {
        // Find the matching module from our eager glob
        const modulePath = Object.keys(generatedApps).find(path => path.includes(`${appId}.jsx`));
        const metaPath = Object.keys(generatedAppMeta).find(path => path.includes(`${appId}.json`));
        
        if (modulePath && generatedApps[modulePath]) {
            const GeneratedComponent = generatedApps[modulePath].default;
            const appMetadata = metaPath && generatedAppMeta[metaPath] ? generatedAppMeta[metaPath].default : { id: appId };
            
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-[#121212] font-sans p-8 transition-colors relative">
                    <GeneratedComponent />
                    <AppInspectorOverlay appMetadata={appMetadata} />
                </div>
            );
        } else {
            return (
                <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-slate-100 font-sans">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">App Layout Not Found</h2>
                        <p className="text-slate-500">The layout "{appId}" could not be found or has been deleted.</p>
                    </div>
                </div>
            );
        }
    }

    // Global sticker sheet controls
    const [activeSection, setActiveSection] = useState('Home');


    // ... rest of the component remains largely the same, but remove the providers at the bottom

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col">
            
            {/* Top Header */}
            <header className="w-full sticky top-0 z-50 h-16 bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-2 font-semibold text-lg">
                    <Component className="text-blue-500" size={24} />
                    <span>DAK Hyperskills</span>
                    {activeSection !== 'Themes Library' && <span className="ml-4 text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">Editing Theme</span>}
                </div>
                
                <div className="flex items-center gap-4">
                    <EditorModeToggle />
                    
                    <button
                        onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                        className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#262626] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    
                    <UpdateSkillsButton />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Controls */}
                <div id="main-nav-sidebar" className="w-72 bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">

                <div className="flex-1 space-y-6">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveSection('Home')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === 'Home'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800/50 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 font-medium border border-transparent'
                                }`}
                        >
                            <Home size={16} className={activeSection === 'Home' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"} /> App Home
                        </button>

                        <button
                            onClick={() => setActiveSection('App Playground')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === 'App Playground'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800/50 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 font-medium border border-transparent'
                                }`}
                        >
                            <AppWindow size={16} className={activeSection === 'App Playground' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"} /> App Playground
                        </button>
                        <button
                            onClick={() => setActiveSection('Themes Library')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === 'Themes Library'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800/50 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 font-medium border border-transparent'
                                }`}
                        >
                            <Palette size={16} className={activeSection === 'Themes Library' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"} /> Themes Library
                        </button>

                    </nav>

                    {/* Navigation */}
                    <section>
                        <Typography variant="h6" as="h3" className="mb-2 px-3 flex items-center gap-2 text-slate-500 tracking-wider">
                            <Layout size={16} className="text-slate-400 dark:text-slate-500" /> LIBRARIES
                        </Typography>
                        <nav className="space-y-1">
                            {[
                                'Gemini Chat',
                                'Typography', 'Inputs & Controls', 'Navigation & Overlays', 'Feedback & Status',
                                'Tables & Data Grids',
                                'Charts: Standard', 'Charts: Time & Trends', 'Charts: Distributions', 'Charts: Maps & Geodata', 'Charts: Specialized', 'Charts: Proportions & Parts'
                            ].map((section) => (
                                <button
                                    key={section}
                                    onClick={() => setActiveSection(section)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {section}
                                </button>
                            ))}
                        </nav>
                    </section>

                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 p-8 overflow-y-auto w-full h-[calc(100vh-64px)]">
                <div className="max-w-6xl mx-auto">

                    {activeSection === 'Themes Library' && <ThemeGallery onEditTheme={() => setActiveSection('Typography')} />}
                    {activeSection === 'Home' && <HomePage onNavigate={(section) => setActiveSection(section)} />}
                    {activeSection === 'How It Works' && <HowItWorksPage onBack={() => setActiveSection('Home')} />}
                    {activeSection === 'App Playground' && <AppsPage />}
                    {activeSection === 'Gemini Chat' && <GeminiChatGallery />}

                    {activeSection === 'Typography' && <TypographyGallery />}
                    {activeSection === 'Inputs & Controls' && <ControlsGallery />}
                    {activeSection === 'Navigation & Overlays' && <NavigationGallery />}
                    {activeSection === 'Feedback & Status' && <FeedbackGallery />}
                    {activeSection === 'Tables & Data Grids' && <TableGallery />}
                    {activeSection === 'Chart Gallery' && <ChartGallery />}
                    {activeSection === 'Charts: Standard' && <ChartGallery />}
                    {activeSection === 'Charts: Time & Trends' && <ChartGalleryTime />}
                    {activeSection === 'Charts: Distributions' && <ChartGalleryDistributions />}
                    {activeSection === 'Charts: Maps & Geodata' && <ChartGalleryMaps />}
                    {activeSection === 'Charts: Specialized' && <ChartGallerySpecialized />}
                    {activeSection === 'Charts: Proportions & Parts' && <ChartGalleryProportions />}

                </div>
            </div>

            {/* Editor Sidebar */}
            <EditorSidebar />
            <SkillEditorModal />
            </div>
        </div>
    );
}

export default App;
