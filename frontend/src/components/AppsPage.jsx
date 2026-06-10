import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus, ExternalLink, Trash2, LayoutTemplate } from 'lucide-react';
import Typography from './Typography';
import Button from './Button';
import SkillEditButton from './SkillEditButton';
import { useAuth } from '../context/AuthContext';

export default function AppsPage() {
    const { isAdmin, getAuthHeaders } = useAuth();
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [apps, setApps] = useState([]);
    const [statusMessages, setStatusMessages] = useState([]);
    const [streamedCode, setStreamedCode] = useState("");

    const fetchApps = async () => {
        try {
            const res = await axios.get('/api/apps');
            setApps(res.data.apps || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleGenerate = async (useSkills = true) => {
        if (!prompt.trim() || !isAdmin) return;
        setIsGenerating(useSkills ? 'skilled' : 'nonskilled');
        setStatusMessages([]);
        setStreamedCode("");
        try {
            const headers = await getAuthHeaders();
            const res = await fetch('/api/apps/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...headers },
                body: JSON.stringify({ prompt, use_skills: useSkills })
            });
            
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let generatedAppId = null;
            
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer
                
                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const data = JSON.parse(line);
                        if (data.type === 'status' || data.type === 'info') {
                            setStatusMessages(prev => [...prev, data.message]);
                        } else if (data.type === 'token') {
                            setStreamedCode(prev => prev + data.message);
                        } else if (data.type === 'complete') {
                            generatedAppId = data.app_id;
                            setStatusMessages(prev => [...prev, "Generation complete!"]);
                        } else if (data.type === 'error') {
                            setStatusMessages(prev => [...prev, "Error: " + data.message]);
                            throw new Error(data.message);
                        }
                    } catch (e) {
                         console.error("Error parsing NDJSON line:", line, e);
                    }
                }
            }
            
            setPrompt("");
            await fetchApps();
            if (generatedAppId) {
                setTimeout(() => {
                    window.open(`/?app=${generatedAppId}`, '_blank');
                }, 1000);
            }
        } catch (err) {
            console.error("Failed to generate app:", err);
            alert("Failed to generate app. Check console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (appId) => {
        if (!isAdmin) return;
        try {
            const headers = await getAuthHeaders();
            await axios.delete(`/api/apps/${appId}`, { headers });
            setApps(apps.filter(app => app.id !== appId));
        } catch (err) {
            console.error("Failed to delete app:", err);
            alert("Failed to delete app.");
        }
    };

    const openApp = (appId) => {
        window.open(`/?app=${appId}`, '_blank');
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Header & Generator Profile */}
            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <div>
                    <div className="flex items-center mb-1">
                        <Typography variant="h3" className="m-0">App Playground</Typography>
                        <SkillEditButton skillPath="orchestrator.skill.md" label="App Architect Skill" />
                        <SkillEditButton skillPath="router.md" label="Router Skill" />
                    </div>
                    <Typography variant="bodyBase" className="text-slate-500">
                        Describe the app you want. The AI will immediately build a custom React application using your design system components and mocked data.
                    </Typography>
                </div>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., A marketing dashboard for tracking ad campaigns with a spend chart and active campaign table..."
                    className="w-full h-32 p-4 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    disabled={!!isGenerating}
                />

                {isAdmin ? (
                    <div className="flex justify-end gap-3">
                        <Button
                            onClick={() => handleGenerate(false)}
                            disabled={!!isGenerating || !prompt.trim()}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            {isGenerating === 'nonskilled' ? (
                                <><Loader2 size={18} className="animate-spin" /> Generating...</>
                            ) : (
                                <><Plus size={18} /> Create Nonskilled App</>
                            )}
                        </Button>
                        <Button
                            onClick={() => handleGenerate(true)}
                            disabled={!!isGenerating || !prompt.trim()}
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            {isGenerating === 'skilled' ? (
                                <><Loader2 size={18} className="animate-spin" /> Generating App...</>
                            ) : (
                                <><Plus size={18} /> Create Skilled App</>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-end">
                        <p className="text-sm text-slate-400 italic">Sign in as admin to generate apps</p>
                    </div>
                )}

                {(!!isGenerating || statusMessages.length > 0) && (
                    <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col gap-2">
                        {statusMessages.length === 0 && !!isGenerating && (
                            <div className="flex items-center gap-2 text-slate-400">
                                <Loader2 size={14} className="animate-spin" />
                                <Typography variant="bodyXs" className="font-mono">Connecting to orchestration server...</Typography>
                            </div>
                        )}
                        {statusMessages.length > 0 && (
                            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                                {statusMessages.map((msg, idx) => (
                                    <Typography key={idx} variant="bodyXs" className={`${idx === statusMessages.length - 1 ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} font-mono`}>
                                        &gt; {msg}
                                    </Typography>
                                ))}
                            </div>
                        )}
                        {streamedCode && (
                            <pre className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-2 h-48 overflow-y-auto whitespace-pre-wrap p-3 bg-white dark:bg-black rounded border border-slate-100 dark:border-slate-800">
                                {streamedCode}
                            </pre>
                        )}
                    </div>
                )}
            </div>

            {/* Generated Apps Gallery */}
            <div>
                <Typography variant="h4" className="mb-4">Generated Apps</Typography>

                {apps.length === 0 ? (
                    <div className="text-center p-12 bg-white/50 dark:bg-[#1a1a1a]/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <LayoutTemplate size={48} className="mx-auto text-slate-400 mb-3" />
                        <Typography variant="h6" className="text-slate-600 dark:text-slate-400">
                            No apps generated yet.
                        </Typography>
                        <p className="text-sm text-slate-500 mt-1">Use the prompt box above to build your first test layout.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apps.map(app => (
                            <div key={app.id} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                <div className="p-5 flex flex-col h-full cursor-pointer" onClick={() => openApp(app.id)}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <LayoutTemplate size={20} className="text-blue-500" />
                                            <Typography variant="h6" className="truncate" title={app.name || app.id}>
                                                {app.name || app.id}
                                            </Typography>
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2 mt-2">
                                            {app.prompt || "Generated app layout"}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                            {(() => {
                                                const match = app.id.match(/App_(\d+)/);
                                                if (match) {
                                                    const ts = match[1].length === 10 ? parseInt(match[1]) * 1000 : parseInt(match[1]);
                                                    return new Date(ts).toLocaleString(undefined, { 
                                                        month: 'short', day: 'numeric', year: 'numeric', 
                                                        hour: 'numeric', minute: '2-digit' 
                                                    });
                                                }
                                                return "Unknown date";
                                            })()}
                                        </p>
                                        {isAdmin && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(app.id);
                                                }}
                                                className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 rounded-md transition-colors"
                                                title="Delete layout"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
