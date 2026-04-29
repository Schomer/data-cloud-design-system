import React from 'react';
import { useEditor } from '../context/EditorContext';
import { FileCode, Pencil } from 'lucide-react';

export default function SkillEditButton({ skillPath, label = "Edit Skill", iconOnly = false }) {
    const { setEditingSkill, editorMode } = useEditor();
    
    if (editorMode !== 'edit' || !skillPath) return null;
    
    if (iconOnly) {
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingSkill(skillPath);
                }}
                className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-md transition-colors pointer-events-auto shrink-0"
                title={`Edit ${skillPath}`}
            >
                <Pencil size={16} />
            </button>
        );
    }
    
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditingSkill(skillPath);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 ml-3 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded-md text-sm font-medium transition-colors border border-blue-200 dark:border-blue-800 pointer-events-auto"
            title={`Edit ${skillPath}`}
        >
            <FileCode size={14} />
            {label}
        </button>
    );
}
