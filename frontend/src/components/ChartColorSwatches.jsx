import React, { useRef } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useChartColors } from '../context/ChartColorContext';

function SortableColorSwatch({ color, id, index }) {
    const { updateColor } = useChartColors();
    const inputRef = useRef(null);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
    };

    const handleColorClick = (e) => {
        // Trigger hidden color input
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`relative flex flex-col items-center p-2 pb-[6px] gap-2 rounded-lg border bg-white dark:bg-[#1a1a1a] shadow-sm select-none hover:border-slate-300 dark:hover:border-slate-600 transition-colors w-20 flex-shrink-0 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 border-blue-500 shadow-md' : 'border-slate-200 dark:border-slate-800'
                }`}
        >
            <div
                className="w-full aspect-[4/3] rounded-md cursor-pointer hover:ring-2 hover:ring-blue-500/20 active:scale-95 transition-all"
                style={{ backgroundColor: color }}
                onClick={handleColorClick}
            />
            <input
                ref={inputRef}
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="absolute opacity-0 pointer-events-none w-0 h-0"
            />
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                {color}
            </span>
        </div>
    );
}

export default function ChartColorSwatches() {
    const { chartColors, reorderColors } = useChartColors();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = chartColors.indexOf(active.id);
            const newIndex = chartColors.indexOf(over.id);
            reorderColors(oldIndex, newIndex);
        }
    }

    return (
        <div className="w-full bg-slate-50/50 dark:bg-[#1a1a1a]/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-3 w-max">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={chartColors}
                        strategy={horizontalListSortingStrategy}
                    >
                        {chartColors.map((color, index) => (
                            <SortableColorSwatch key={color} id={color} color={color} index={index} />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
