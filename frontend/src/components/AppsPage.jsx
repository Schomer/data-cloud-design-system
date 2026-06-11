import React, { useState, useEffect } from 'react';
import { Loader2, Plus, ExternalLink, Trash2, LayoutTemplate } from 'lucide-react';
import Typography from './Typography';
import Button from './Button';
import SkillEditButton from './SkillEditButton';
import { useAuth } from '../context/AuthContext';
import { useEditor } from '../context/EditorContext';
import * as fs from '../services/firestoreService';
import { streamGeminiResponse } from '../services/geminiService';

export default function AppsPage() {
    const { isAdmin } = useAuth();
    const { activeThemeId } = useEditor();
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [apps, setApps] = useState([]);
    const [statusMessages, setStatusMessages] = useState([]);
    const [streamedCode, setStreamedCode] = useState("");

    const fetchApps = async () => {
        try {
            const appsData = await fs.getApps();
            setApps(appsData);
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
            // Build the system prompt
            let systemPrompt = "You are an expert Data Cloud Application Developer.\n\n";
            let matchedSkills = [];

            if (useSkills) {
                setStatusMessages(prev => [...prev, "Reading skills from Firestore..."]);

                // Load all skills for the active theme
                const allSkills = await fs.getAllSkills();
                const skillMap = {};
                for (const s of allSkills) {
                    if (s.path && s.content) {
                        skillMap[s.path] = s.content;
                    }
                }

                // 1. Visual spec
                const visualSpec = skillMap['design/visual_spec.skill.md'];
                if (visualSpec) {
                    systemPrompt += "### 1. VISUAL DESIGN CONSTRAINTS (design/visual_spec.skill.md)\n" + visualSpec + "\n\n";
                    setStatusMessages(prev => [...prev, "Loaded visual_spec.skill.md"]);
                }

                // 2. App approach, orchestrator, layout
                for (const [name, path] of [
                    ["APP APPROACH", "app_approach.skill.md"],
                    ["ORCHESTRATOR", "orchestrator.skill.md"],
                    ["LAYOUT PATTERNS", "design/layout.skill.md"]
                ]) {
                    if (skillMap[path]) {
                        systemPrompt += `### ${name} (${path})\n${skillMap[path]}\n\n`;
                        setStatusMessages(prev => [...prev, `Loaded ${path}`]);
                    }
                }

                // 3. Router
                const routerContent = skillMap['router.md'] || '';
                if (routerContent) {
                    systemPrompt += "### 3. COMPONENT CATALOG (router.md)\n" + routerContent + "\n\n";
                    setStatusMessages(prev => [...prev, "Loaded router.md"]);
                }

                // 4. Selective component loading based on prompt keywords
                systemPrompt += "### 4. SELECTED COMPONENT SKILLS\n";
                systemPrompt += "Based on the user's prompt, the following components and visualizations are highly relevant:\n";

                const userPromptLower = prompt.toLowerCase();
                const lines = routerContent.split('\n');
                let inTable = false;

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('|---')) { inTable = true; continue; }
                    if (inTable && trimmed.startsWith('|')) {
                        const parts = trimmed.split('|').map(p => p.trim());
                        if (parts.length >= 9) {
                            const keywordsStr = parts[2];
                            const skillFile = parts[8].trim();
                            const keywords = keywordsStr.split('/').map(k => k.trim().toLowerCase());
                            const skillName = skillFile.split('/').pop().replace('.md', '').replace(/_/g, ' ').toLowerCase();
                            const allMatchers = [...keywords, skillName];

                            const matchFound = allMatchers.some(kw => {
                                if (!kw) return false;
                                const regex = new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
                                return regex.test(userPromptLower);
                            });

                            const alwaysInclude = ["button.md", "typography.md", "overlays.md"];
                            const isCore = alwaysInclude.some(f => skillFile.includes(f));

                            if (matchFound || isCore) {
                                if (skillMap[skillFile]) {
                                    matchedSkills.push(skillFile);
                                    systemPrompt += `\n--- SKILL: ${skillFile} ---\n${skillMap[skillFile]}\n`;
                                }
                            }
                        }
                    }
                }

                setStatusMessages(prev => [...prev, `Matched ${matchedSkills.length} skills to your prompt!`]);
                for (const s of matchedSkills) {
                    setStatusMessages(prev => [...prev, `Injecting: ${s}`]);
                }
            }

            // Add critical instructions
            systemPrompt += "\n\nCRITICAL INSTRUCTIONS:\n" +
                "1. ROLE: You are an Expert React Developer building a gorgeous Data Application for the Data Cloud Playground.\n" +
                "2. DESIGN SYSTEM ADHERENCE: Use the color, spacing, corner radius, borders, layout, shadow, typography, and interaction rules from the skills context where applicable.\n" +
                "3. COMPONENT UTILIZATION: Build DAK Hyperskills components directly in your code using the skill files as your implementation guide. Do not assume pre-built components.\n" +
                "4. INTERACTION: Components MUST be functional. Tabs must switch, sidebars must toggle, buttons must have hover states.\n" +
                "5. VISUAL EXCELLENCE: Style inline using precise Tailwind arbitrary classes mapped to exact hex codes from visual_spec.skill.md.\n" +
                "6. MOCK DATA: Generate robust, realistic mock data using compact loops (e.g., Array.from({ length: 50 }, ...)). NEVER hardcode large arrays.\n" +
                "7. OUTPUT FORMAT: Output TWO parts:\n" +
                "   PART 1: A JSON block with your thought process:\n" +
                "   ```json\n" +
                "   { \"interpretation\": \"...\", \"skills_utilized\": [...], \"assumed_from_scratch\": [...], \"skill_suggestions\": \"...\" }\n" +
                "   ```\n" +
                "   PART 2: The React Component in a ```jsx code block. Give your export default function a descriptive name.\n" +
                "8. STRICT FUNCTIONALITY: Every UI element MUST work. No dead tabs, no dead toggle buttons.\n" +
                "9. NO SYNTAX ERRORS: Output must be valid, error-free JSX/JavaScript.\n" +
                "10. CHARTS: Use Recharts for standard charts. For maps, use Google Maps Custom Elements.\n" +
                "11. CONCISENESS: Keep code compact — you are under a strict output token limit.\n";

            setStatusMessages(prev => [...prev, "Sending to Gemini..."]);

            // Stream from Gemini
            let generatedText = "";
            for await (const token of streamGeminiResponse(systemPrompt, prompt)) {
                generatedText += token;
                setStreamedCode(prev => prev + token);
            }

            setStatusMessages(prev => [...prev, "Generation complete!"]);

            // Extract the JSX code
            let code = generatedText;
            // Remove JSON thought block
            code = code.replace(/```json\s*\n.*?\n```/s, '');
            // Extract code from code blocks
            const codeMatches = [...code.matchAll(/```(?:[a-z]+)?\s*\n(.*?)```/gs)];
            if (codeMatches.length > 0) {
                // Find the one with React code
                let bestMatch = codeMatches[codeMatches.length - 1][1];
                for (const m of [...codeMatches].reverse()) {
                    if (m[1].includes('import React') || m[1].includes('export default')) {
                        bestMatch = m[1];
                        break;
                    }
                }
                code = bestMatch.trim();
            }
            // Clean trailing backticks
            code = code.replace(/```\s*$/, '').trim();

            // Extract thought process
            let thoughtProcess = {};
            const jsonMatch = generatedText.match(/```json\s*\n(.*?)\n```/s);
            if (jsonMatch) {
                try { thoughtProcess = JSON.parse(jsonMatch[1]); } catch {}
            }

            // Extract app name
            const timestamp = Date.now();
            const appId = `App_${timestamp}`;
            let title = prompt.length > 50 ? prompt.slice(0, 50) + "..." : prompt;
            const nameMatch = code.match(/export\s+default\s+(?:function\s+)?([A-Z][A-Za-z0-9_]+)/);
            if (nameMatch) {
                title = nameMatch[1].replace(/([A-Z])/g, ' $1').trim();
            }

            // Save to Firestore
            const metadata = {
                id: appId,
                name: title,
                prompt: prompt,
                code: code,
                skills_used: matchedSkills,
                thought_process: thoughtProcess,
                createdAt: new Date().toISOString(),
            };
            await fs.saveApp(appId, metadata);

            setStatusMessages(prev => [...prev, `App saved as ${appId}`]);
            setPrompt("");
            await fetchApps();
            setTimeout(() => {
                window.open(`/?app=${appId}`, '_blank');
            }, 1000);
        } catch (err) {
            console.error("Failed to generate app:", err);
            setStatusMessages(prev => [...prev, `Error: ${err.message}`]);
            alert("Failed to generate app: " + err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (appId) => {
        if (!isAdmin) return;
        try {
            await fs.deleteApp(appId);
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
                                <Typography variant="bodyXs" className="font-mono">Connecting to Gemini...</Typography>
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
