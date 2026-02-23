import React, { useState, useEffect } from 'react';
import { Moon, Sun, Layout, Settings2, Component } from 'lucide-react';

import KPICard from './components/KPICard';
import DataTable from './components/DataTable';
import DataChart from './components/DataChart';
import DetailPanel from './components/DetailPanel';
import GeminiChat from './components/GeminiChat';
import { EditorProvider } from './context/EditorContext';
import EditorSidebar from './components/EditorSidebar';
import UpdateSkillsButton from './components/UpdateSkillsButton';
import EditorModeToggle from './components/EditorModeToggle';

// New Galleries
import TypographyGallery from './components/TypographyGallery';
import ControlsGallery from './components/ControlsGallery';
import NavigationGallery from './components/NavigationGallery';
import FeedbackGallery from './components/FeedbackGallery';
import TableGallery from './components/TableGallery';
import ChartGallery from './components/ChartGallery';
import ChartGalleryTime from './components/ChartGalleryTime';
import ChartGalleryDistributions from './components/ChartGalleryDistributions';
import ChartGalleryMaps from './components/ChartGalleryMaps';
import ChartGallerySpecialized from './components/ChartGallerySpecialized';
import ChartGalleryProportions from './components/ChartGalleryProportions';
import { ChartColorProvider } from './context/ChartColorContext';

function App() {
    // Global sticker sheet controls
    const [activeSection, setActiveSection] = useState('Core Components');
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Mock data
    const mockTableCols = [
        { header: 'ID', accessorKey: 'id', cellClassName: 'font-mono text-slate-500' },
        { header: 'Customer', accessorKey: 'customer' },
        { header: 'Amount', accessorKey: 'amount', cellClassName: 'font-medium' },
        {
            header: 'Status', accessorKey: 'status', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                    {row.status}
                </span>
            )
        }
    ];

    const mockTableData = [
        { id: 'CUST-001', customer: 'Acme Corp', amount: '$1,250.00', status: 'Active' },
        { id: 'CUST-002', customer: 'Globex Inc', amount: '$3,400.00', status: 'Pending' },
        { id: 'CUST-003', customer: 'Soylent', amount: '$850.00', status: 'Active' },
        { id: 'CUST-004', customer: 'Initech', amount: '$4,200.00', status: 'Active' },
    ];

    const mockChartData = [
        { label: 'Jan', value1: 400, value2: 240 },
        { label: 'Feb', value1: 300, value2: 139 },
        { label: 'Mar', value1: 200, value2: 980 },
        { label: 'Apr', value1: 278, value2: 390 },
        { label: 'May', value1: 189, value2: 480 },
        { label: 'Jun', value1: 239, value2: 380 },
    ];

    const mockChatMessages = [
        { role: 'user', content: 'What is our churn rate looking like this month?' },
        { role: 'model', content: 'Based on the latest data, churn rate has decreased from 2.4% last month to 1.8% this month. This is primarily driven by higher retention in the Enterprise segment.' },
    ];

    return (
        <EditorProvider>
            <ChartColorProvider>
                <div className="min-h-screen bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex">
                    {/* Sidebar Controls */}
                    <div id="main-nav-sidebar" className="w-72 bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto">
                        <div className="flex items-center gap-2 font-semibold text-lg mb-8">
                            <Component className="text-blue-500" size={24} />
                            <span>JTC Design System</span>
                        </div>

                        <div className="flex-1 space-y-8">
                            {/* Navigation */}
                            <section>
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Layout size={14} /> Libraries
                                </h3>
                                <nav className="space-y-1">
                                    {[
                                        'Core Components', 'Typography', 'Inputs & Controls', 'Navigation & Overlays', 'Feedback & Status',
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

                            {/* Appearance Controls */}
                            <section>
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Settings2 size={14} /> Appearance
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Theme Mode</span>
                                        <button
                                            onClick={() => setDarkMode(!darkMode)}
                                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#262626] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                                        </button>
                                    </div>
                                    {/* The component switch */}
                                    <EditorModeToggle />
                                </div>
                            </section>

                            <UpdateSkillsButton />
                        </div>
                    </div>

                    {/* Main Canvas */}
                    <div className="flex-1 p-8 overflow-y-auto w-full">
                        <div className="max-w-6xl mx-auto">

                            {activeSection === 'Core Components' && (
                                <>
                                    <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
                                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Core Components</h1>
                                        <p className="text-slate-500 mt-2">The fundamental building blocks assembled for specific data app scenarios.</p>
                                    </div>
                                    <div className="flex flex-col gap-12">
                                        {/* KPI Cards */}
                                        <section>
                                            <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">1. KPI Cards</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <KPICard title="Revenue" value="$42,390" trend="+12.5%" isPositive={true} />
                                                <KPICard title="Active Users" value="1,249" trend="-2.1%" isPositive={false} />
                                                <KPICard title="Server Cost" value="$845" trend="-5.4%" isPositive={true} />
                                                <KPICard title="Conversion" value="4.8%" trend="+0.6%" isPositive={true} />
                                            </div>
                                        </section>

                                        {/* Chart */}
                                        <section>
                                            <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">2. Simple Tailwind Bar Chart</h2>
                                            <DataChart data={mockChartData} title="Monthly Growth & Revenue" />
                                        </section>

                                        {/* Tables and Panels Layout */}
                                        <section>
                                            <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">3. Data Table & Detail Panel</h2>
                                            <div className="flex gap-4 items-start">
                                                <div className="w-2/3">
                                                    <DataTable
                                                        columns={mockTableCols}
                                                        data={mockTableData}
                                                        title="Customer Directory"
                                                    />
                                                </div>
                                                <div className="w-1/3">
                                                    <DetailPanel
                                                        title="Customer Overview"
                                                        subtitle="CUST-002"
                                                        riskScore={0.75}
                                                        amount={3400.00}
                                                        details={[
                                                            { label: "Company Name", value: "Globex Inc" },
                                                            { label: "Industry", value: "Manufacturing" },
                                                        ]}
                                                        customerDetails={[
                                                            { label: "Account Age", value: "1.2 Years" },
                                                        ]}
                                                        actions={[
                                                            { label: "Pause Account", primary: true, onClick: () => alert("Account paused") },
                                                            { label: "Message", onClick: () => alert("Messaging customer") }
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                        </section>

                                        {/* Gemini Chat */}
                                        <section>
                                            <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">4. Gemini AI Chat Explorer</h2>
                                            <div className="max-w-3xl">
                                                <GeminiChat
                                                    messages={mockChatMessages}
                                                    onSendMessage={(msg) => alert(`You asked: ${msg}`)}
                                                />
                                            </div>
                                        </section>
                                    </div>
                                </>
                            )}

                            {activeSection === 'Typography' && <TypographyGallery isDarkMode={darkMode} />}
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
                    <EditorSidebar isDarkMode={darkMode} />
                </div>
            </ChartColorProvider>
        </EditorProvider>
    );
}

export default App;
