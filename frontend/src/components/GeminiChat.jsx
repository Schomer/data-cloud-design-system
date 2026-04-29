import React, { useState } from 'react';
import { Sparkles, Send, Mic, Plus } from 'lucide-react';

export default function GeminiChat({
    messages = [],
    isTyping = false,
    onSendMessage,
    placeholder = "Message Gemini...",
    title = "Gemini Advanced",
    height = "h-[600px]",
    variant = "fullscreen" // "fullscreen" | "sidebar" | "field"
}) {
    const [chatInput, setChatInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        if (onSendMessage) {
            onSendMessage(chatInput);
        }
        setChatInput('');
    };

    if (variant === 'field') {
        return (
            <div className="w-full relative">
                <form onSubmit={handleSubmit} className="relative flex items-center bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-[#333] transition-shadow focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 overflow-hidden pr-2">
                    
                    <button type="button" className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <Plus size={20} />
                    </button>
                    
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Update your app using Gemini..." 
                        className="flex-1 py-4 px-2 bg-transparent outline-none text-[15px] text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    />
                    
                    <div className="flex items-center gap-1 shrink-0">
                        <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-[#2A2A2A]">
                            <Mic size={18} />
                        </button>
                        <button type="submit" disabled={isTyping || !chatInput.trim()} className={`
                            p-2 rounded-lg transition-all ml-1
                            ${chatInput.trim() 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                                : 'bg-slate-100 dark:bg-[#2A2A2A] text-slate-400 dark:text-slate-500'}
                        `}>
                            <Send size={18} className={chatInput.trim() ? '' : 'translate-x-[-1px] translate-y-[1px]'} />
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    const containerStyle = variant === 'sidebar' 
        ? `w-full md:w-80 lg:w-96 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${height}` 
        : `bg-white dark:bg-[#0D0D0D] rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-lg shadow-slate-200/50 dark:shadow-none ${height}`;

    return (
        <div className={`font-sans flex flex-col relative overflow-hidden ${containerStyle}`}>
            {/* Header */}
            {title && (
                <div className={`flex items-center justify-between p-4 sticky top-0 z-10 border-b ${variant === 'sidebar' ? 'bg-white/80 dark:bg-[#1a1a1a]/80 border-slate-200 dark:border-slate-800' : 'bg-white/80 dark:bg-[#0D0D0D]/80 border-transparent'} backdrop-blur-md`}>
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold ${variant === 'sidebar' ? 'text-base' : 'text-lg'} flex items-center gap-1.5 text-slate-900 dark:text-slate-100`}>
                            {title.includes('Gemini') ? (
                                <>
                                    Gemini <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">{variant === 'sidebar' ? 'Assistant' : 'Advanced'}</span>
                                </>
                            ) : title}
                        </span>
                    </div>
                </div>
            )}

            {/* Chat Log */}
            <div className={`flex-1 overflow-y-auto px-4 ${variant === 'sidebar' ? 'py-4' : 'sm:px-8 py-6'} flex flex-col pb-32`}>
                {messages.length === 0 && !isTyping && (
                    <div className="m-auto flex flex-col items-center justify-center max-w-lg text-center space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-inner">
                            <Sparkles size={32} className="text-blue-500 dark:text-blue-400" />
                        </div>
                        <h2 className={`${variant === 'sidebar' ? 'text-xl' : 'text-2xl'} font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 text-transparent bg-clip-text`}>How can I help you today?</h2>
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`flex w-full mb-8 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role !== 'user' && (
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 shrink-0 mt-1 border border-blue-200/50 dark:border-blue-800/50">
                                <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                        )}
                        
                        <div className={`
                            max-w-[85%] ${variant === 'sidebar' ? '' : 'sm:max-w-[75%]'} rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed
                            ${m.role === 'user' 
                                ? 'bg-slate-100 dark:bg-[#1E1E1E] text-slate-800 dark:text-slate-100 rounded-tr-sm' 
                                : 'bg-transparent text-slate-800 dark:text-slate-200'
                            }
                        `}>
                            {m.content}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className={`flex w-full mb-8 justify-start`}>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 shrink-0 mt-1 border border-blue-200/50 dark:border-blue-800/50">
                            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed bg-transparent text-slate-500 italic animate-pulse">
                            Analyzing...
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Input sticky bottom */}
            <div className={`absolute bottom-0 w-full bg-gradient-to-t ${variant === 'sidebar' ? 'from-white via-white dark:from-[#1a1a1a] dark:via-[#1a1a1a]' : 'from-white via-white dark:from-[#0D0D0D] dark:via-[#0D0D0D]'} to-transparent p-4 ${variant === 'sidebar' ? '' : 'sm:p-6'} pb-6 z-10`}>
                <div className="w-full relative">
                    <form onSubmit={handleSubmit} className="relative flex items-center bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-[#333] transition-shadow focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 overflow-hidden pr-2">
                        
                        {variant !== 'sidebar' && (
                            <button type="button" className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <Plus size={20} />
                            </button>
                        )}
                        
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={variant === 'sidebar' ? 'Ask anything...' : placeholder} 
                            className={`flex-1 py-4 ${variant === 'sidebar' ? 'px-4' : 'px-2'} bg-transparent outline-none text-[15px] text-slate-900 dark:text-slate-100 placeholder-slate-400`}
                        />
                        
                        <div className="flex items-center gap-1 shrink-0">
                            {variant !== 'sidebar' && (
                                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-[#2A2A2A]">
                                    <Mic size={18} />
                                </button>
                            )}
                            <button type="submit" disabled={isTyping || !chatInput.trim()} className={`
                                p-2 rounded-lg transition-all ml-1
                                ${chatInput.trim() 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                                    : 'bg-slate-100 dark:bg-[#2A2A2A] text-slate-400 dark:text-slate-500'}
                            `}>
                                <Send size={18} className={chatInput.trim() ? '' : 'translate-x-[-1px] translate-y-[1px]'} />
                            </button>
                        </div>
                    </form>
                    {variant !== 'sidebar' && (
                        <div className="text-center mt-3 text-xs text-slate-400 font-medium">
                            Gemini may display inaccurate info, including about people, so double-check its responses.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
