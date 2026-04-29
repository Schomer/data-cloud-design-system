import React, { useState } from 'react';
import { Info, Code2, Cpu, X, Box } from 'lucide-react';
import Typography from './Typography';

export default function AppInspectorOverlay({ appMetadata }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!appMetadata) return null;

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 right-6 z-50 h-12 w-12 bg-white dark:bg-[#1e1e1e] border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all bg-opacity-90 backdrop-blur"
                title="Inspect App Skills"
            >
                <Code2 size={24} />
            </button>

            {/* Modal Dialog */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[80vh] sm:h-auto sm:max-h-[85vh]">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#1e1e1e]/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Cpu size={24} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">App Inspector</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Generation Context & Skills</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            
                            {/* App Metadata */}
                            <section>
                                <Typography variant="h6" className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200">
                                    <Info size={18} className="text-slate-400" /> Application Details
                                </Typography>
                                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Generated Title</p>
                                            <p className="font-medium text-slate-800 dark:text-slate-200">{appMetadata.name || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Local Identity</p>
                                            <p className="font-mono text-sm text-slate-600 dark:text-slate-400">{appMetadata.id || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700/50">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Persona Prompt</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                                            "{appMetadata.prompt}"
                                        </p>
                                    </div>

                                    {appMetadata.thought_process?.interpretation && (
                                        <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700/50">
                                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">AI Architect Interpretation</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                                                {appMetadata.thought_process.interpretation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Skills Used */}
                            <section>
                                <Typography variant="h6" className="flex items-center gap-2 mb-3 text-slate-800 dark:text-slate-200">
                                    <Box size={18} className="text-slate-400" /> Injected Skill Files
                                </Typography>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    The orchestrator mapped your prompt against the following UI markdown skills.
                                </p>
                                
                                <div className="flex flex-wrap gap-3">
                                    {/* Base skills are always used */}
                                    <span className="px-3 py-1.5 bg-indigo-50 leading-none dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-mono rounded-lg border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-1.5 shadow-sm">
                                        layout.skill.md
                                    </span>
                                    <span className="px-3 py-1.5 bg-indigo-50 leading-none dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-mono rounded-lg border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-1.5 shadow-sm">
                                        visual_spec.skill.md
                                    </span>

                                    {/* Specifically matched component skills */}
                                    {appMetadata.skills_used && appMetadata.skills_used.length > 0 ? (
                                        appMetadata.skills_used.map((skill, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-3 py-1.5 bg-white leading-none dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:scale-105 cursor-default"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : null}
                                </div>
                            </section>

                            {/* Assumed from Scratch (Thought Process) */}
                            {appMetadata.thought_process?.assumed_from_scratch?.length > 0 && (
                                <section className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-5">
                                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-500 mb-3 flex items-center gap-2">⚠️ Hallucination Warning: Items Built From Scratch</h4>
                                    <p className="text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed mb-4">
                                        The AI was forced to build the following features from scratch because it did not have matching skill files. This means it guessed the layout and CSS instead of adhering to the Design System!
                                    </p>
                                    <ul className="list-disc pl-5 text-sm text-amber-800 dark:text-amber-300 font-mono space-y-1 mb-5">
                                        {appMetadata.thought_process.assumed_from_scratch.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                    
                                    <div className="bg-white/50 dark:bg-[#1a1a1a]/50 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 mb-2">Skill Authoring Advice</h5>
                                        <p className="text-sm text-amber-800 dark:text-amber-300">
                                            {appMetadata.thought_process.skill_suggestions}
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Automated QA Report */}
                            {appMetadata.qa_report && (
                                <section className="border-t-4 border-slate-200 dark:border-slate-800 pt-8 mt-8">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                        <span className="flex h-3 w-3 relative">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                        Automated Visual QA Report
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                                            <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">
                                                {appMetadata.qa_report.prompt_adherence_score}<span className="text-lg text-slate-400 font-normal">/10</span>
                                            </p>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prompt Fulfillment</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                                            <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">
                                                {appMetadata.qa_report.visual_aesthetic_score}<span className="text-lg text-slate-400 font-normal">/10</span>
                                            </p>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visual Aesthetics</p>
                                        </div>
                                    </div>

                                    {/* Snapshot Display */}
                                    <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-inner group relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs font-medium">Auto-captured snapshot via headless browser</p>
                                        </div>
                                        <img 
                                            src={`/src/generated_apps/${appMetadata.id}.png`} 
                                            alt="App Rendering Snapshot" 
                                            className="w-full h-auto object-cover max-h-[400px] object-top"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
                                            <h5 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-1 flex items-center gap-2">🔍 Layout & Alignment Critique</h5>
                                            <p className="text-sm text-blue-800 dark:text-slate-300 leading-relaxed font-serif">
                                                "{appMetadata.qa_report.qa_analysis}"
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-300 mb-1 flex items-center gap-2">💡 Suggested Improvements</h5>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-serif">
                                                {appMetadata.qa_report.improvement_suggestions}
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
