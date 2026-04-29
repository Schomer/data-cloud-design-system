import React from 'react';
import ReactECharts from 'echarts-for-react';
import EditableWrapper from './EditableWrapper';
import Typography from './Typography';
import { useChartColors } from '../context/ChartColorContext';
import { useEditor } from '../context/EditorContext';
import SkillEditButton from './SkillEditButton';

// Heatmap Data
const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];
const days = ['Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon', 'Sun'];
const heatmapData = [];
for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
        heatmapData.push([j, i, Math.floor(Math.random() * 10)]);
    }
}

// Hexagonal Binning Data (Simulated with scatter grid)
const hexData = [];
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        hexData.push([i, j + (i % 2 !== 0 ? 0.5 : 0), Math.random() * 100]);
    }
}

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

export default function ChartGalleryDistributions() {
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

    const optHistogram = {
        ...baseTheme,
        xAxis: { type: 'category', data: ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70'], axisTick: { alignWithLabel: true } },
        yAxis: { type: 'value' },
        series: [{
            type: 'bar',
            barWidth: '99%',
            data: [10, 52, 200, 334, 390, 330],
            itemStyle: { borderColor: '#fff', borderWidth: 1 }
        }]
    };

    const optBoxplot = {
        ...baseTheme,
        xAxis: { type: 'category', data: ['Exp 1', 'Exp 2', 'Exp 3'] },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
        series: [{
            name: 'boxplot', type: 'boxplot',
            itemStyle: { color: chartColors[0], borderColor: chartColors[0] },
            data: [
                [850, 890, 920, 950, 990],
                [710, 750, 800, 850, 950],
                [800, 840, 880, 920, 970]
            ]
        }]
    };

    const optDensity = {
        ...baseTheme,
        xAxis: { type: 'category', boundaryGap: false, data: Array.from({ length: 50 }, (_, i) => i) },
        yAxis: { type: 'value', show: false },
        series: [{
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: { opacity: 0.5 },
            data: Array.from({ length: 50 }, (_, i) => Math.exp(-Math.pow(i - 25, 2) / 100) * 100)
        }]
    };

    const optPyramid = {
        ...baseTheme,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['Male', 'Female'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: [{ type: 'value' }],
        yAxis: [{ type: 'category', axisTick: { show: false }, data: ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60+'] }],
        series: [
            { name: 'Male', type: 'bar', stack: 'Total', label: { show: true }, emphasis: { focus: 'series' }, data: [320, 302, 341, 374, 390, 450, 420] },
            { name: 'Female', type: 'bar', stack: 'Total', label: { show: true, position: 'left' }, emphasis: { focus: 'series' }, data: [-120, -132, -101, -134, -190, -230, -210] }
        ]
    };

    const optDiverging = {
        ...baseTheme,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: 30, bottom: 30, left: 40, right: 40 },
        xAxis: { type: 'value', position: 'bottom', splitLine: { lineStyle: { type: 'dashed' } } },
        yAxis: { type: 'category', axisLine: { show: false }, axisLabel: { show: false }, axisTick: { show: false }, splitLine: { show: false }, data: ['Q1', 'Q2', 'Q3', 'Q4'] },
        series: [{
            name: 'Profit', type: 'bar', stack: 'Total',
            label: { show: true, formatter: '{b}' },
            data: [
                { value: 200, itemStyle: { color: chartColors[0] } },
                { value: 170, itemStyle: { color: chartColors[0] } },
                { value: -120, itemStyle: { color: chartColors[1] }, label: { position: 'left' } },
                { value: 240, itemStyle: { color: chartColors[0] } }
            ]
        }]
    };

    const optHeatmap = {
        tooltip: { position: 'top' },
        grid: { height: '50%', top: '10%' },
        xAxis: { type: 'category', data: hours, splitArea: { show: true } },
        yAxis: { type: 'category', data: days, splitArea: { show: true } },
        visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', bottom: '15%', inRange: { color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] } },
        series: [{ name: 'Punch Card', type: 'heatmap', data: heatmapData, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }]
    };

    const optHexbin = {
        ...baseTheme,
        tooltip: { trigger: 'item' },
        xAxis: { show: false },
        yAxis: { show: false },
        visualMap: { show: false, min: 0, max: 100, inRange: { color: ['#e0f2fe', '#0284c7', '#082f49'] } },
        series: [{
            type: 'scatter',
            symbol: 'path://M50,0 L100,28 L100,85 L50,113 L0,85 L0,28 Z',
            symbolSize: 22,
            data: hexData
        }]
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight mb-2">Distributions & Correlations</h2>
                <p className="text-slate-500">Charts designed to show the spread of data and relationships between multiple variables.</p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Frequency & Spreads</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Histogram" description="Distribution of continuous data" options={optHistogram} skillPath="ui/charts/histogram.md" />
                    <RealChartContainer title="Density Plot" description="Continuous curve of distribution" options={optDensity} skillPath="ui/charts/density_plot.md" />
                    <RealChartContainer title="Box Plot" description="Quartiles and statistical outliers" options={optBoxplot} skillPath="ui/charts/boxplot.md" />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Divergence & Comparisons</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Population Pyramid" description="Bidirectional distribution" options={optPyramid} skillPath="ui/charts/pyramid.md" />
                    <RealChartContainer title="Diverging Bar" description="Values branching from a zero midpoint" options={optDiverging} skillPath="ui/charts/diverging_bar.md" />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Heat mapping</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <RealChartContainer title="Heatmap" description="2D matrix with color intensities" options={optHeatmap} height="400px" skillPath="ui/charts/heatmap.md" />
                    <div className="w-1/2">
                        <RealChartContainer title="Hexagonal Binning" description="Heatmap aggregated into hexagons" options={optHexbin} height="300px" skillPath="ui/charts/hexbin.md" />
                    </div>
                </div>
            </section>
        </div>
    );
}
