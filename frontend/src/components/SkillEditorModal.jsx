import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Save, AlertCircle, Eye, FileText, Bold, Italic, Link as LinkIcon, Code as CodeIcon, List, Heading1, Heading2 } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
// Prism css for basic syntax highlighting
import 'prismjs/themes/prism.css';

export default function SkillEditorModal() {
    const { editingSkill, setEditingSkill, theme } = useEditor();
    const { getAuthHeaders } = useAuth();
    
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [viewMode, setViewMode] = useState('text'); // 'text' | 'rendered'
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editingSkill) {
            setContent('');
            setError(null);
            setViewMode('text');
            return;
        }

        const fetchSkill = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/skills/content?path=${encodeURIComponent(editingSkill)}`);
                setContent(response.data.content || '');
            } catch (err) {
                console.error("Failed to fetch skill content", err);
                setError("Failed to load skill file. It may not exist yet.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSkill();
    }, [editingSkill]);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const headers = await getAuthHeaders();
            await axios.put('/api/skills/content', {
                path: editingSkill,
                content: content
            }, { headers });
            // Close modal on success
            setEditingSkill(null);
        } catch (err) {
            console.error("Failed to save skill content", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const insertText = (before, after = '') => {
        const el = editorRef.current?._input;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const text = content;
        const selection = text.substring(start, end);
        const newText = text.substring(0, start) + before + selection + after + text.substring(end);
        setContent(newText);
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    if (!editingSkill) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`
                flex flex-col w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl overflow-hidden
                ${theme === 'dark' ? 'bg-[#1e1e1e] border border-slate-700/50' : 'bg-white border border-slate-200'}
            `}>
                {/* Header */}
                <div className={`
                    flex items-center justify-between px-6 py-4 border-b
                    ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}
                `}>
                    <h3 className={`font-semibold text-lg flex items-center gap-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                        Editing Skill: <span className="font-mono text-sm text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">{editingSkill}</span>
                    </h3>
                    <div className="flex items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'bg-[#121212]' : 'bg-slate-100'}`}>
                            <button
                                onClick={() => setViewMode('text')}
                                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                    viewMode === 'text' 
                                    ? (theme === 'dark' ? 'bg-[#2a2a2a] text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm')
                                    : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
                                }`}
                            >
                                <FileText size={16} /> Text
                            </button>
                            <button
                                onClick={() => setViewMode('rendered')}
                                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                    viewMode === 'rendered' 
                                    ? (theme === 'dark' ? 'bg-[#2a2a2a] text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm')
                                    : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
                                }`}
                            >
                                <Eye size={16} /> Rendered
                            </button>
                        </div>
                        <button 
                            onClick={() => setEditingSkill(null)}
                            className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark' 
                                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                {viewMode === 'text' && (
                    <div className={`
                        flex items-center gap-1 px-6 py-2 border-b text-sm
                        ${theme === 'dark' ? 'border-slate-800 bg-[#1a1a1a]' : 'border-slate-100 bg-slate-50'}
                    `}>
                        <button onClick={() => insertText('\n# ', '')} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} title="Heading 1"><Heading1 size={16} /></button>
                        <button onClick={() => insertText('\n## ', '')} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} title="Heading 2"><Heading2 size={16} /></button>
                        <div className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                        <button onClick={() => insertText('**', '**')} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} title="Bold"><Bold size={16} /></button>
                        <button onClick={() => insertText('*', '*')} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} title="Italic"><Italic size={16} /></button>
                        <div className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                        <button onClick={() => insertText('[', '](url)')} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} title="Link"><LinkIcon size={16} /></button>
                        <button onClick={() => insertText('`', '`')} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} title="Inline Code"><CodeIcon size={16} /></button>
                        <button onClick={() => insertText('\n- ')} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} title="List"><List size={16} /></button>
                    </div>
                )}

                {/* Body */}
                <div className={`flex-1 relative overflow-auto ${theme === 'dark' ? 'bg-[#121212]' : 'bg-slate-50'}`}>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : viewMode === 'text' ? (
                        <div className="min-h-full p-4">
                            <Editor
                                ref={editorRef}
                                value={content}
                                onValueChange={setContent}
                                highlight={code => Prism.highlight(code, Prism.languages.markdown || Prism.languages.markup, 'markdown')}
                                padding={16}
                                className={`
                                    w-full min-h-[500px] font-mono text-sm rounded-lg outline-none
                                    ${theme === 'dark' 
                                        ? 'bg-[#1e1e1e] text-slate-300 border border-slate-800 focus-within:border-blue-500/50' 
                                        : 'bg-white text-slate-800 border border-slate-200 focus-within:border-blue-400'}
                                `}
                                style={{
                                    fontFamily: '"Fira Code", "Consolas", monospace',
                                    fontSize: 14,
                                }}
                            />
                        </div>
                    ) : (
                        <div className={`p-8 w-full max-w-4xl mx-auto ${theme === 'dark' ? 'prose-invert' : ''}`}>
                            <div className="prose prose-blue max-w-none dark:prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`
                    flex items-center justify-between px-6 py-4 border-t
                    ${theme === 'dark' ? 'border-slate-800 bg-[#1a1a1a]' : 'border-slate-100 bg-white'}
                `}>
                    <div className="flex items-center">
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditingSkill(null)}
                            className={`
                                px-4 py-2 font-medium text-sm rounded-lg transition-colors
                                ${theme === 'dark' 
                                    ? 'text-slate-300 hover:bg-slate-800' 
                                    : 'text-slate-600 hover:bg-slate-100'}
                            `}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading || isSaving}
                            className={`
                                flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50
                            `}
                        >
                            <Save size={16} />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                /* Some basic dark mode overrides for Prism */
                ${theme === 'dark' ? `
                    .token.comment,
                    .token.prolog,
                    .token.doctype,
                    .token.cdata {
                        color: #6b7280;
                    }
                    .token.punctuation {
                        color: #9ca3af;
                    }
                    .token.namespace {
                        opacity: .7;
                    }
                    .token.property,
                    .token.tag,
                    .token.boolean,
                    .token.number,
                    .token.constant,
                    .token.symbol,
                    .token.deleted {
                        color: #fca5a5;
                    }
                    .token.selector,
                    .token.attr-name,
                    .token.string,
                    .token.char,
                    .token.builtin,
                    .token.inserted {
                        color: #a7f3d0;
                    }
                    .token.operator,
                    .token.entity,
                    .token.url,
                    .language-css .token.string,
                    .style .token.string {
                        color: #93c5fd;
                    }
                    .token.atrule,
                    .token.attr-value,
                    .token.keyword {
                        color: #c4b5fd;
                    }
                    .token.function,
                    .token.class-name {
                        color: #fcd34d;
                    }
                    .token.regex,
                    .token.important,
                    .token.variable {
                        color: #fde047;
                    }
                ` : ''}
            `}</style>
        </div>
    );
}

