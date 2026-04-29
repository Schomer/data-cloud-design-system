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

export default function ChartGallerySpecialized() {
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

    const optGauge = {
        series: [{
            type: 'gauge', progress: { show: true, width: 10, itemStyle: { color: chartColors[0] } },
            axisLine: { lineStyle: { width: 10 } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
            pointer: { show: true, width: 4 }, detail: { valueAnimation: true, fontSize: 20, offsetCenter: [0, '70%'] },
            data: [{ value: 78, name: 'Score' }]
        }]
    };

    const optRadar = {
        ...baseTheme,
        radar: {
            indicator: [
                { name: 'Sales', max: 6500 }, { name: 'Admin', max: 16000 }, { name: 'IT', max: 30000 },
                { name: 'Support', max: 38000 }, { name: 'Dev', max: 52000 }, { name: 'Marketing', max: 25000 }
            ]
        },
        series: [{
            type: 'radar',
            data: [{ value: [4200, 3000, 20000, 35000, 50000, 18000], name: 'Allocated Budget', areaStyle: { opacity: 0.4 } }]
        }]
    };

    const optNetwork = {
        ...baseTheme,
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'force',
                symbolSize: 40,
                roam: true,
                label: { show: true },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: { fontSize: 20 },
                force: { repulsion: 250, edgeLength: [50, 200] },
                data: [
                    { name: 'Node 1', x: 300, y: 300, symbolSize: 60, itemStyle: { color: chartColors[0] } },
                    { name: 'Node 2', x: 800, y: 300, symbolSize: 40, itemStyle: { color: chartColors[1] } },
                    { name: 'Node 3', x: 550, y: 100, symbolSize: 40, itemStyle: { color: chartColors[2] } },
                    { name: 'Node 4', x: 550, y: 500, symbolSize: 40, itemStyle: { color: chartColors[3] } }
                ],
                links: [
                    { source: 'Node 1', target: 'Node 2' },
                    { source: 'Node 1', target: 'Node 3' },
                    { source: 'Node 2', target: 'Node 3' },
                    { source: 'Node 2', target: 'Node 4' },
                    { source: 'Node 1', target: 'Node 4' }
                ],
                lineStyle: { opacity: 0.9, width: 2, curveness: 0 }
            }
        ]
    };

    const optWorkflow = {
        ...baseTheme,
        tooltip: { trigger: 'item', triggerOn: 'mousemove' },
        series: [
            {
                type: 'tree',
                data: [{
                    name: 'Start',
                    children: [
                        { name: 'Review', children: [{ name: 'Approved' }, { name: 'Rejected' }] },
                        { name: 'QA Tech', children: [{ name: 'Passed' }] }
                    ]
                }],
                top: '1%', left: '7%', bottom: '1%', right: '20%',
                symbolSize: 15,
                itemStyle: { color: chartColors[0], borderColor: chartColors[0] },
                label: { position: 'left', verticalAlign: 'middle', align: 'right', fontSize: 13 },
                leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
    };

    const optQuadrant = {
        ...baseTheme,
        grid: { top: 30, right: 30, bottom: 30, left: 30 },
        xAxis: { max: 100, min: 0, show: false },
        yAxis: { max: 100, min: 0, show: false },
        series: [{
            type: 'scatter',
            symbolSize: 20,
            data: Array.from({ length: 40 }, () => [Math.random() * 100, Math.random() * 100]),
            markLine: {
                silent: true,
                symbol: 'none',
                label: { show: false },
                lineStyle: { type: 'solid', color: '#94a3b8', width: 2 },
                data: [
                    { xAxis: 50 },
                    { yAxis: 50 }
                ]
            },
            markArea: {
                silent: true,
                itemStyle: { opacity: 0.1 },
                data: [
                    [{ xAxis: 50, yAxis: 50, itemStyle: { color: chartColors[0] } }, { xAxis: 100, yAxis: 100 }],
                    [{ xAxis: 0, yAxis: 0, itemStyle: { color: chartColors[1] } }, { xAxis: 50, yAxis: 50 }]
                ]
            }
        }]
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight mb-2">Specialized Charts</h2>
                <p className="text-slate-500">Niche visualizations for specific engineering, scientific, or complex data relationships.</p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Performance & Limits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Radar Chart" description="Multi-variable capability" options={optRadar} skillPath="ui/charts/radar.md" />
                    <RealChartContainer title="Gauge Indicator" description="Performance against limits" options={optGauge} skillPath="ui/charts/gauge.md" />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nodes & Paths</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Network Diagram" description="Relationship clusters between entities" options={optNetwork} skillPath="ui/charts/network_graph.md" />
                    <RealChartContainer title="Workflow Diagram" description="Stages and decision trees" options={optWorkflow} skillPath="ui/charts/workflow_diagram.md" />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Classification</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Quadrant Chart" description="Evaluating scatter points into four actionable categories" options={optQuadrant} skillPath="ui/charts/quadrant_chart.md" />
                </div>
            </section>
        </div>
    );
}
