import React from 'react';
import { useEditor } from '../context/EditorContext';
import { FileCode } from 'lucide-react';

export default function EditableWrapper({
    children,
    type,
    variant = null,
    skillPath = null,
    hideSkillButton = false,
    className = ""
}) {
    const { selectedType, selectedVariant, setSelectedType, setSelectedVariant, editorMode, setEditingSkill } = useEditor();

    let defaultSkillPath = null;
    if (!skillPath) {
        const typeMap = {
            'button': 'ui/components/button.md',
            'input': 'ui/components/input_fields.md',
            'checkbox': 'ui/components/selection_controls.md',
            'radio': 'ui/components/selection_controls.md',
            'switch': 'ui/components/selection_controls.md',
            'segmented': 'ui/components/selection_controls.md',
            'filterChip': 'ui/components/selection_controls.md',
            'card': 'ui/components/cards_kpi.md',
            'table': 'ui/components/data_table.md',
            'typography': 'ui/components/typography.md',
            'nav': 'ui/components/navigation.md',
            'overlay': 'ui/components/overlays.md',
            'geminiChatFullscreen': 'ui/components/chat_fullscreen.md',
            'geminiChatSidebar': 'ui/components/chat_sidebar.md',
            'geminiChatField': 'ui/components/chat_field.md',
            'alert': 'ui/components/feedback_status.md',
            'loader': 'ui/components/feedback_status.md',
        };
        
        if (type === 'chart' && variant) {
            const needsChartSuffix = ['bar', 'line', 'pie', 'donut', 'area', 'column', 'waffle', 'horizon', 'quadrant'].includes(variant);
            defaultSkillPath = `ui/charts/${variant}${needsChartSuffix ? '_chart' : ''}.md`;
        } else if (typeMap[type]) {
            defaultSkillPath = typeMap[type];
        }
    }
    const finalSkillPath = skillPath || defaultSkillPath;

    // In preview mode, completely bypass the wrapper returning raw children.
    // This allows native browser interactions (hover, active, focus) to work natively.
    if (editorMode === 'preview') {
        return children;
    }

    const isSelected = selectedType === type && (variant ? selectedVariant === variant : true);

    const handleClick = (e) => {
        // Prevent click events from propagating up 
        e.stopPropagation();
        e.preventDefault();

        // Toggle selection
        if (isSelected) {
            setSelectedType(null);
            setSelectedVariant(null);
        } else {
            setSelectedType(type);
            setSelectedVariant(variant);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                editable-component-wrapper relative group cursor-pointer rounded-lg transition-all duration-200
                ${isSelected
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#1a1a1a] z-10'
                    : 'hover:ring-2 hover:ring-blue-400/50 hover:ring-offset-2 hover:ring-offset-slate-50 hover:dark:ring-offset-[#1a1a1a]'
                }
                ${className}
            `}
        >
            {/* Absolute badge identifying component type and skill action trigger on hover/selection */}
            <div className={`
                absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 z-20
                ${isSelected || 'group-hover:opacity-100'}
            `}>
                <div className="px-2 py-1 bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold rounded shadow-sm pointer-events-none capitalize whitespace-nowrap">
                    {variant ? `${variant} ` : ''}{type}
                </div>
                {!hideSkillButton && finalSkillPath && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setEditingSkill(finalSkillPath);
                        }}
                        className="p-1 px-[6px] bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white rounded shadow-sm transition-colors flex items-center gap-1 pointer-events-auto"
                        title="Edit component skill"
                    >
                        <FileCode size={12} strokeWidth={2.5} />
                    </button>
                )}
            </div>

            {/* Prevent child clicks from triggering typical button behavior when in editor mode */}
            <div className="pointer-events-none w-full h-full">
                {children}
            </div>
        </div>
    );
}
