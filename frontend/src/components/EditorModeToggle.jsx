import React from 'react';
import { useEditor } from '../context/EditorContext';
import { Pencil, Eye } from 'lucide-react';

export default function EditorModeToggle() {
    const { editorMode, setEditorMode, setSelectedType, setSelectedVariant } = useEditor();

    const isEdit = editorMode === 'edit';

    const handleToggle = (mode) => {
        setEditorMode(mode);
        if (mode === 'preview') {
            // Deselect anything when switching to preview
            setSelectedType(null);
            setSelectedVariant(null);
        }
    };

    return (
        <div className="flex bg-slate-100 dark:bg-[#262626] p-[2px] rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner h-9 items-center">
            <button
                onClick={() => handleToggle('edit')}
                className={`flex items-center justify-center gap-1.5 px-3 h-full rounded-md text-sm font-medium transition-all ${isEdit
                        ? 'bg-white dark:bg-[#3a3a3a] text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
            >
                <Pencil size={14} /> Edit
            </button>
            <button
                onClick={() => handleToggle('preview')}
                className={`flex items-center justify-center gap-1.5 px-3 h-full rounded-md text-sm font-medium transition-all ${!isEdit
                        ? 'bg-white dark:bg-[#3a3a3a] text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
            >
                <Eye size={14} /> Preview
            </button>
        </div>
    );
}
