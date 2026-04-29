import React, { useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Plus, Minus } from 'lucide-react';
import * as echarts from 'echarts';
import { useChartColors } from '../context/ChartColorContext';
import worldData from '../assets/geo/world.json';

// Register the map once
echarts.registerMap('world', worldData);

export default function WorldMapChart({ height = '400px' }) {
    const { chartColors } = useChartColors();
    const chartRef = useRef(null);

    const handleZoom = (direction) => {
        if (chartRef.current) {
            const chart = chartRef.current.getEchartsInstance();
            chart.dispatchAction({
                type: 'roam',
                componentType: 'series',
                seriesIndex: 0,
                zoom: direction === 'in' ? 1.2 : 0.8
            });
        }
    };

    const options = useMemo(() => {
        // Generate some mock data for different countries
        const data = [
            { name: 'United States', value: Math.random() * 100 },
            { name: 'China', value: Math.random() * 100 },
            { name: 'Brazil', value: Math.random() * 100 },
            { name: 'Australia', value: Math.random() * 100 },
            { name: 'India', value: Math.random() * 100 },
            { name: 'Russia', value: Math.random() * 100 },
            { name: 'Canada', value: Math.random() * 100 },
            { name: 'South Africa', value: Math.random() * 100 },
            { name: 'Germany', value: Math.random() * 100 },
            { name: 'France', value: Math.random() * 100 },
            { name: 'United Kingdom', value: Math.random() * 100 },
            { name: 'Japan', value: Math.random() * 100 },
            { name: 'Argentina', value: Math.random() * 100 },
            // Add more as needed or let them be empty
        ];

        return {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#e2e8f0',
                textStyle: { color: '#0f172a' },
                formatter: '{b}: {c}'
            },
            visualMap: {
                min: 0,
                max: 100,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#eff6ff', chartColors[0] || '#3b82f6'] // Use the first dynamic chart color
                },
                textStyle: {
                    color: '#64748b' // slate-500
                },
                itemHeight: 100,
                itemWidth: 15,
                left: 'right',
                bottom: '10%'
            },
            series: [
                {
                    name: 'World Data',
                    type: 'map',
                    map: 'world',
                    roam: true, // Allow zooming and dragging
                    itemStyle: {
                        borderColor: '#e2e8f0',
                        areaColor: '#f8fafc', // slate-50
                    },
                    emphasis: {
                        itemStyle: {
                            areaColor: chartColors[1] || '#93c5fd', // hover color
                        },
                        label: {
                            show: false
                        }
                    },
                    data: data
                }
            ]
        };
    }, [chartColors]);

    return (
        <div style={{ height, width: '100%', position: 'relative' }}>
            <div className="absolute top-4 left-4 flex flex-col z-10 bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
                <button onClick={() => handleZoom('in')} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Zoom In">
                    <Plus size={16} strokeWidth={2.5} />
                </button>
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
                <button onClick={() => handleZoom('out')} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Zoom Out">
                    <Minus size={16} strokeWidth={2.5} />
                </button>
            </div>
            <ReactECharts
                ref={chartRef}
                option={options}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
}
