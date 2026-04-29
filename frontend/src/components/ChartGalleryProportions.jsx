import React from 'react';
import ReactECharts from 'echarts-for-react';
import EditableWrapper from './EditableWrapper';
import Typography from './Typography';
import { useChartColors } from '../context/ChartColorContext';
import { useEditor } from '../context/EditorContext';
import SkillEditButton from './SkillEditButton';


// Pictogram / Icon Chart
const svgPath = 'path://M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z';

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

export default function ChartGalleryProportions() {
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

    const optSankey = {
        tooltip: { trigger: 'item', triggerOn: 'mousemove' },
        color: chartColors,
        series: {
            type: 'sankey', layout: 'none', focusNodeAdjacency: true,
            data: [
                { name: 'Node A' }, { name: 'Node B' }, { name: 'Node C' },
                { name: 'Node D' }, { name: 'Node E' }
            ],
            links: [
                { source: 'Node A', target: 'Node C', value: 5 },
                { source: 'Node B', target: 'Node C', value: 2 },
                { source: 'Node A', target: 'Node D', value: 1 },
                { source: 'Node C', target: 'Node E', value: 3 }
            ],
            lineStyle: { color: 'source', curveness: 0.5 }
        }
    };

    const optTreemap = {
        color: chartColors,
        series: [{
            type: 'treemap', width: '100%', height: '100%', roam: false, nodeClick: false,
            breadcrumb: { show: false },
            data: [
                { name: 'Category A', value: 40 },
                { name: 'Category B', value: 20 },
                { name: 'Category C', value: 15 },
                { name: 'Category D', value: 25 }
            ]
        }]
    };

    const optSunburst = {
        color: chartColors,
        series: {
            type: 'sunburst', radius: [0, '90%'],
            data: [{
                name: 'Core',
                children: [
                    { name: 'A', value: 15 },
                    { name: 'B', value: 20, children: [{ name: 'B1', value: 10 }] }
                ]
            }, {
                name: 'Edge',
                children: [{ name: 'C', value: 10 }]
            }]
        }
    };

    const optFunnel = {
        ...baseTheme,
        tooltip: { trigger: 'item', formatter: '{b} : {c}%' },
        series: [
            {
                name: 'Funnel', type: 'funnel', left: '5%', top: 20, bottom: 20, width: '90%',
                label: { show: true, position: 'inside' },
                data: [
                    { value: 100, name: 'Visitors' },
                    { value: 60, name: 'Clicks' },
                    { value: 40, name: 'Leads' },
                    { value: 20, name: 'Sales' }
                ]
            }
        ]
    };

    const generateWaffleData = () => {
        let data = [];
        let colors = [
            { name: 'Apples', color: chartColors[0], count: 45 },
            { name: 'Oranges', color: chartColors[1], count: 30 },
            { name: 'Bananas', color: chartColors[2], count: 25 }
        ];
        let k = 0;
        for (let c of colors) {
            for (let i = 0; i < c.count; i++) {
                let x = k % 10;
                let y = Math.floor(k / 10);
                data.push({
                    name: c.name,
                    value: [x, y],
                    itemStyle: { color: c.color }
                });
                k++;
            }
        }
        return data;
    };

    const optWaffle = {
        ...baseTheme,
        tooltip: { formatter: '{b}' },
        xAxis: { show: false, min: -0.5, max: 9.5 },
        yAxis: { show: false, min: -0.5, max: 9.5 },
        series: [{
            type: 'scatter',
            symbol: 'roundRect',
            symbolSize: 22,
            data: generateWaffleData()
        }]
    };

    const optPictogram = {
        ...baseTheme,
        tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
        xAxis: { data: ['A', 'B', 'C', 'D', 'E'], axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: '#64748b' } },
        yAxis: { show: false },
        series: [{
            name: 'Likes',
            type: 'pictorialBar',
            symbol: svgPath,
            symbolRepeat: true,
            symbolMargin: '5%',
            symbolClip: true,
            symbolSize: [25, 25],
            itemStyle: { color: chartColors[0] },
            data: [120, 200, 150, 80, 70]
        }]
    };

    const optTrellis = {
        ...baseTheme,
        tooltip: { trigger: 'axis' },
        axisPointer: { link: { xAxisIndex: 'all' } },
        grid: [
            { top: '10%', bottom: '55%', left: '10%', right: '10%' },
            { top: '55%', bottom: '10%', left: '10%', right: '10%' }
        ],
        xAxis: [
            { gridIndex: 0, type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'], axisLabel: { show: false }, axisTick: { show: false } },
            { gridIndex: 1, type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] }
        ],
        yAxis: [
            { gridIndex: 0, name: 'Sales', type: 'value', max: 500 },
            { gridIndex: 1, name: 'Profit', type: 'value', max: 300 }
        ],
        series: [
            { xAxisIndex: 0, yAxisIndex: 0, type: 'bar', data: [320, 450, 280, 410], itemStyle: { color: chartColors[0] } },
            { xAxisIndex: 1, yAxisIndex: 1, type: 'bar', data: [120, 200, 80, 150], itemStyle: { color: chartColors[1] } }
        ]
    };

    const optCircularTreemap = {
        ...baseTheme,
        series: [
            {
                name: 'Group',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
                label: { position: 'inner', fontSize: 10 },
                labelLine: { show: false },
                data: [
                    { value: 1548, name: 'Internal' },
                    { value: 775, name: 'External' },
                    { value: 679, name: 'Agent' }
                ]
            },
            {
                name: 'Sub-group',
                type: 'pie',
                radius: ['45%', '60%'],
                labelLine: { length: 10 },
                label: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#F6F8FC', borderColor: '#8C8D8E', borderWidth: 1, borderRadius: 4,
                    rich: {
                        a: { color: '#6E7079', lineHeight: 22, align: 'center' },
                        hr: { borderColor: '#8C8D8E', width: '100%', borderWidth: 0.5, height: 0 },
                        b: { color: '#4C5058', fontSize: 11, fontWeight: 'bold', lineHeight: 25 },
                        per: { color: '#fff', backgroundColor: '#4C5058', padding: [3, 4], borderRadius: 2 }
                    }
                },
                data: [
                    { value: 1048, name: 'A' },
                    { value: 335, name: 'B' },
                    { value: 310, name: 'C' },
                    { value: 251, name: 'D' },
                    { value: 234, name: 'E' },
                    { value: 147, name: 'F' },
                    { value: 135, name: 'G' },
                    { value: 102, name: 'H' }
                ]
            }
        ]
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Proportions & Hierarchy</h2>
                <p className="text-slate-500">Visualizations that show part-to-whole relationships and nested data structures.</p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Grids & Arrays</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Waffle Chart" description="Proportional 10x10 square grid" options={optWaffle} height="300px" skillPath="ui/charts/waffle.md" />
                    <RealChartContainer title="Pictogram / Icon Chart" description="Units represented by visual symbols" options={optPictogram} height="300px" skillPath="ui/charts/pictogram.md" />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Multi-Panels & Nested</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Trellis / Panel Chart" description="Small multiples sharing an axis" options={optTrellis} height="400px" skillPath="ui/charts/trellis.md" />
                    <RealChartContainer title="Circular Treemap (Nested Pie)" description="Hierarchical multi-level rings" options={optCircularTreemap} height="400px" skillPath="ui/charts/circular_treemap.md" />
                </div>
            </section>
            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Hierarchies & Flows</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Treemap" description="Nested rects by grouping" options={optTreemap} skillPath="ui/charts/treemap.md" />
                    <RealChartContainer title="Sunburst" description="Radial hierarchical tree" options={optSunburst} skillPath="ui/charts/sunburst.md" />
                    <RealChartContainer title="Sankey Diagram" description="Energy/Resource flow mapping" options={optSankey} skillPath="ui/charts/sankey.md" />
                    <RealChartContainer title="Funnel" description="Process stage conversion" options={optFunnel} skillPath="ui/charts/funnel.md" />
                </div>
            </section>
        </div>
    );
}
