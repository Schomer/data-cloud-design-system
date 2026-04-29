import React from 'react';
import ReactECharts from 'echarts-for-react';
import EditableWrapper from './EditableWrapper';
import Typography from './Typography';
import { useChartColors } from '../context/ChartColorContext';
import { useEditor } from '../context/EditorContext';
import SkillEditButton from './SkillEditButton';


const RealChartContainer = ({ title, description, options, height = "500px", skillPath }) => {
    const { theme, globalSpecs } = useEditor();
    const chartSpec = globalSpecs?.[theme]?.chart;
    
    const titleVariant = chartSpec?.titleTypography || 'h3';
    const subtitleVariant = chartSpec?.subtitleTypography || 'small';
    const headerPadding = chartSpec?.headerPaddingY !== undefined ? chartSpec.headerPaddingY : 16;
    
    let chartVariant = 'bar';
    if(skillPath) {
        const match = skillPath.match(/charts\/(.*?)(_chart)?\.md/);
        if(match && match[1]) {
            chartVariant = match[1];
        }
    }

    return (
    <EditableWrapper type="chart" variant={chartVariant} skillPath={skillPath} hideSkillButton={true} className="w-full">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:border-blue-500/50 transition-colors">
            <div 
                className="px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1a1a]"
                style={{ paddingTop: `${headerPadding}px`, paddingBottom: `${headerPadding}px` }}
            >
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <Typography variant={titleVariant} as="div" className="font-semibold text-slate-900 dark:text-slate-100 m-0">
                            {title}
                        </Typography>
                    </div>
                    <Typography variant={subtitleVariant} as="div" className="text-slate-500 m-0 leading-tight">
                        {description}
                    </Typography>
                </div>
                {skillPath && <SkillEditButton skillPath={skillPath} iconOnly={true} />}
            </div>
            <div className="p-5 bg-white dark:bg-[#121212]/50 relative" style={{ height: height }}>
                <div className="absolute inset-0 p-5">
                    <ReactECharts option={options} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} notMerge={true} />
                </div>
            </div>
        </div>
    </EditableWrapper>
    );
};

export default function ChartGalleryTime() {
    const { chartColors } = useChartColors();
    const { theme } = useEditor();
    const isDarkMode = theme === 'dark';

    const baseTheme = {
        color: chartColors,
        textStyle: {
            fontFamily: 'Inter, sans-serif',
            color: isDarkMode ? '#cbd5e1' : '#475569'
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? '#334155' : '#e2e8f0',
            textStyle: { color: isDarkMode ? '#f1f5f9' : '#0f172a' }
        },
        grid: { top: 30, right: 20, bottom: 20, left: 20, containLabel: true },
        xAxis: {
            axisLine: { lineStyle: { color: isDarkMode ? '#334155' : '#e2e8f0' } },
            axisLabel: { color: isDarkMode ? '#94a3b8' : '#64748b' }
        },
        yAxis: {
            axisLine: { show: false },
            axisLabel: { color: isDarkMode ? '#94a3b8' : '#64748b' },
            splitLine: { lineStyle: { color: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9' } }
        }
    };

    const optCandlestick = {
        ...baseTheme,
        xAxis: { type: 'category', data: ['2017-10-24', '2017-10-25', '2017-10-26'], boundaryGap: true, axisTick: { alignWithLabel: true } },
        yAxis: { type: 'value', scale: true },
        series: [{
            type: 'candlestick',
            itemStyle: { color: chartColors[0], color0: chartColors[1], borderColor: chartColors[0], borderColor0: chartColors[1] },
            data: [
                [20, 30, 10, 35],
                [30, 25, 15, 38],
                [25, 40, 20, 42]
            ]
        }]
    };

    const optSparkline = {
        ...baseTheme,
        grid: { top: 10, right: 10, bottom: 10, left: 10 },
        xAxis: { type: 'category', show: false, data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
        yAxis: { type: 'value', show: false },
        tooltip: { show: false },
        series: [{
            data: [15, 20, 18, 25, 22, 30, 28, 35, 33, 40],
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3, color: chartColors[0] },
            areaStyle: {
                opacity: 0.1,
                color: chartColors[0]
            }
        }]
    };

    const optEventTimeline = {
        ...baseTheme,
        tooltip: {
            trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function (params) {
                return params[1].name + ': ' + params[1].value + ' days';
            }
        },
        xAxis: { type: 'value', show: false },
        yAxis: { type: 'category', data: ['Task C', 'Task B', 'Task A'] },
        series: [
            { name: 'Placeholder', type: 'bar', stack: 'Total', itemStyle: { borderColor: 'transparent', color: 'transparent' }, emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } }, data: [15, 5, 0] },
            { name: 'Duration', type: 'bar', stack: 'Total', label: { show: true, position: 'inside' }, data: [10, 10, 5], itemStyle: { color: chartColors[0], borderRadius: 4 } }
        ]
    };

    const optRidgeline = {
        ...baseTheme,
        xAxis: { type: 'category', boundaryGap: false, data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
        yAxis: { type: 'value', show: false, max: 200 },
        grid: { left: 10, right: 10, bottom: 20, top: 40 },
        series: [
            { name: 'A', type: 'line', data: [10, 30, 50, 120, 80, 40, 20], smooth: true, areaStyle: { opacity: 0.5 }, lineStyle: { width: 1 }, symbol: 'none' },
            { name: 'B', type: 'line', data: [20, 50, 90, 150, 110, 60, 30], smooth: true, areaStyle: { opacity: 0.5 }, lineStyle: { width: 1 }, symbol: 'none' },
            { name: 'C', type: 'line', data: [30, 80, 140, 180, 130, 70, 40], smooth: true, areaStyle: { opacity: 0.5 }, lineStyle: { width: 1 }, symbol: 'none' }
        ].map((s, i) => ({ ...s, data: s.data.map(d => d + (2 - i) * 30), itemStyle: { color: chartColors[i] } }))
    };

    const optHorizon = {
        ...baseTheme,
        grid: { top: 20, bottom: 20, right: 10, left: 10 },
        xAxis: { type: 'category', boundaryGap: false, show: false, data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
        yAxis: { type: 'value', max: 50, show: false },
        series: [
            { name: 'Band 1', type: 'line', data: [15, 25, 80, 60, 45, 110, 30, 40, 95, 25].map(v => Math.min(v, 50)), areaStyle: { color: chartColors[0], opacity: 0.3 }, smooth: true, symbol: 'none', lineStyle: { width: 0 } },
            { name: 'Band 2', type: 'line', data: [15, 25, 80, 60, 45, 110, 30, 40, 95, 25].map(v => Math.max(0, Math.min(v - 50, 50))), areaStyle: { color: chartColors[1], opacity: 0.6 }, smooth: true, symbol: 'none', lineStyle: { width: 0 } },
            { name: 'Band 3', type: 'line', data: [15, 25, 80, 60, 45, 110, 30, 40, 95, 25].map(v => Math.max(0, v - 100)), areaStyle: { color: chartColors[2], opacity: 0.9 }, smooth: true, symbol: 'none', lineStyle: { width: 0 } }
        ]
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight mb-2">Time & Trends Charts</h2>
                <p className="text-slate-500">Visualizations designed to show changes over a continuous time period or ordered categories.</p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Financial Displays</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Candlestick" description="Financial OHLC trading data" options={optCandlestick} skillPath="ui/charts/candlestick.md" />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold">Micro & Specialized Time Displays</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <RealChartContainer title="Sparkline" description="Miniature trend, often inline" options={optSparkline} height="250px" skillPath="ui/charts/sparkline.md" />
                    <RealChartContainer title="Horizon Chart" description="High density vertical compression" options={optHorizon} height="250px" skillPath="ui/charts/horizon_chart.md" />
                    <RealChartContainer title="Ridgeline Chart" description="Staggered distributions over time" options={optRidgeline} height="250px" skillPath="ui/charts/ridgeline.md" />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Planning & Logs</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <RealChartContainer title="Event Timeline (Gantt)" description="Schedule and durations" options={optEventTimeline} height="300px" skillPath="ui/charts/event_timeline.md" />
                </div>
            </section>
        </div>
    );
}
