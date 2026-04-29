import React from 'react';
import { useEditor } from '../context/EditorContext';
import { FileCode } from 'lucide-react';
import EditableWrapper from './EditableWrapper';
import GeminiChat from './GeminiChat';

export default function GeminiChatGallery() {
    const { setEditingSkill } = useEditor();

    return (
        <div className="space-y-12">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Gemini AI Chat Explorer</h2>
                    <p className="text-slate-500 dark:text-slate-400">Conversational interface simulating interactions with Gemini Advanced.</p>
                </div>
                <button
                    onClick={() => setEditingSkill('ui/components/chat_fullscreen.md')}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-blue-300 hover:text-slate-900 dark:hover:text-white rounded-md shadow-sm transition-colors text-sm font-medium border border-slate-200 dark:border-transparent"
                >
                    <FileCode size={16} />
                    Edit Skill File
                </button>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-indigo-500 pl-3">Full Screen Chat</h3>
                    <p className="text-xs text-slate-500 mt-2">A versatile, standalone chat card allowing interaction with conversational AI.</p>
                </div>
                <div className="md:col-span-3">
                    <EditableWrapper type="geminiChatFullscreen" className="w-full">
                        <GeminiChat variant="fullscreen" />
                    </EditableWrapper>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-indigo-500 pl-3">Sidebar Chat</h3>
                    <p className="text-xs text-slate-500 mt-2">A persistent chat assistant designed to sit alongside application content.</p>
                </div>
                <div className="md:col-span-3 flex justify-end bg-slate-100 dark:bg-[#1A1A1A] rounded-2xl p-4 overflow-hidden border border-slate-200 dark:border-slate-800 h-[600px]">
                    <EditableWrapper type="geminiChatSidebar" className="h-full self-end">
                        <GeminiChat variant="sidebar" height="h-full" />
                    </EditableWrapper>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-l-2 border-indigo-500 pl-3">Gemini Command Field</h3>
                    <p className="text-xs text-slate-500 mt-2">An inline input field to instruct the application and update state using Gemini.</p>
                </div>
                <div className="md:col-span-3">
                    <EditableWrapper type="geminiChatField" className="w-full">
                        <GeminiChat variant="field" />
                    </EditableWrapper>
                </div>
            </section>
        </div>
    );
}
