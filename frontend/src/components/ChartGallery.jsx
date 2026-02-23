import React from 'react';
import ReactECharts from 'echarts-for-react';
import KPICard from './KPICard';
import ChartColorSwatches from './ChartColorSwatches';
import { useChartColors } from '../context/ChartColorContext';
import EditableWrapper from './EditableWrapper';

const getDummyData = () => Array.from({ length: 7 }, () => Math.round(Math.random() * 100));

const RealChartContainer = ({ title, description, options, height = "400px" }) => (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:border-blue-500/50 transition-colors">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#1a1a1a]">
            <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
            </div>
        </div>
        <div className="p-5 flex-1 bg-white dark:bg-[#121212]/50 relative overflow-hidden" style={{ minHeight: height }}>
            <ReactECharts
                option={options}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    </div>
);

export default function ChartGallery() {
    const { chartColors } = useChartColors();

    const baseTheme = {
        color: chartColors,
        textStyle: { fontFamily: 'Inter, sans-serif' },
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0', textStyle: { color: '#0f172a' } },
        grid: { top: 30, right: 20, bottom: 20, left: 20, containLabel: true }
    };

    // --- Option Generators ---
    const optLine = {
        ...baseTheme,
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], boundaryGap: false },
        yAxis: { type: 'value' },
        series: [
            { data: getDummyData(), type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: 3 } },
            { data: getDummyData(), type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: 3 } }
        ]
    };

    const optArea = {
        ...baseTheme,
        xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [
            { data: getDummyData(), type: 'line', smooth: true, areaStyle: { opacity: 0.2 }, lineStyle: { width: 2 } }
        ]
    };

    const optStackedArea = {
        ...baseTheme,
        xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [
            { name: 'A', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: getDummyData() },
            { name: 'B', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: getDummyData() },
            { name: 'C', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: getDummyData() },
        ]
    };

    const optColumn = {
        ...baseTheme,
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [
            { data: getDummyData(), type: 'bar', itemStyle: { borderRadius: [4, 4, 0, 0] } },
            { data: getDummyData(), type: 'bar', itemStyle: { borderRadius: [4, 4, 0, 0] } }
        ]
    };

    const optStackedColumn = {
        ...baseTheme,
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [
            { name: 'X', type: 'bar', stack: 'total', data: getDummyData() },
            { name: 'Y', type: 'bar', stack: 'total', data: getDummyData() },
            { name: 'Z', type: 'bar', stack: 'total', data: getDummyData(), itemStyle: { borderRadius: [4, 4, 0, 0] } }
        ]
    };

    const optBar = {
        ...baseTheme,
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E'] },
        series: [
            { data: getDummyData().slice(0, 5), type: 'bar', itemStyle: { borderRadius: [0, 4, 4, 0] } }
        ]
    };

    const optStackedBar = {
        ...baseTheme,
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E'] },
        series: [
            { name: 'Sys1', type: 'bar', stack: 'total', data: getDummyData().slice(0, 5) },
            { name: 'Sys2', type: 'bar', stack: 'total', data: getDummyData().slice(0, 5) },
            { name: 'Sys3', type: 'bar', stack: 'total', data: getDummyData().slice(0, 5), itemStyle: { borderRadius: [0, 4, 4, 0] } }
        ]
    };

    const optPie = {
        ...baseTheme,
        tooltip: { trigger: 'item' },
        series: [
            {
                name: 'Device Type', type: 'pie', radius: '65%', center: ['50%', '50%'],
                data: [
                    { value: 1048, name: 'Desktop' },
                    { value: 735, name: 'Mobile' },
                    { value: 580, name: 'Tablet' },
                ],
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
            }
        ]
    };

    const optDonut = {
        ...baseTheme,
        tooltip: { trigger: 'item' },
        series: [
            {
                name: 'Access From', type: 'pie', radius: ['45%', '75%'], avoidLabelOverlap: false,
                itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                label: { show: false, position: 'center' },
                data: [
                    { value: 1048, name: 'Search' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Ad' }
                ]
            }
        ]
    };

    const optScatter = {
        ...baseTheme,
        tooltip: { trigger: 'item' },
        xAxis: { splitLine: { lineStyle: { type: 'dashed' } } },
        yAxis: { splitLine: { lineStyle: { type: 'dashed' } } },
        series: [{
            symbolSize: 15,
            data: Array.from({ length: 30 }, () => [Math.random() * 100, Math.random() * 100]),
            type: 'scatter',
            itemStyle: { opacity: 0.7 }
        }]
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-2">Standard Charts</h2>
                <p className="text-slate-500 dark:text-slate-400">The core, essential visualizations for most analytical dashboards and reporting use cases.</p>
            </div>

            <EditableWrapper type="chart" className="mb-8">
                <ChartColorSwatches />
            </EditableWrapper>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Scorecards</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard value="$42,390" trend="+12.5%" isPositive={true} />
                    <KPICard value="1,249" trend="-2.1%" isPositive={false} />
                    <KPICard value="$845" trend="-5.4%" isPositive={true} />
                    <KPICard value="4.8%" trend="+0.6%" isPositive={true} />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Trends & Time</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Line Chart" description="Continuous trends over time" options={optLine} />
                    <RealChartContainer title="Area Chart" description="Volume trends over time" options={optArea} />
                    <RealChartContainer title="Stacked Area Chart" description="Cumulative volume trends" options={optStackedArea} />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Comparisons & Amounts</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Column Chart" description="Vertical comparisons" options={optColumn} />
                    <RealChartContainer title="Stacked Column Chart" description="Vertical cumulative comparisons" options={optStackedColumn} />
                    <RealChartContainer title="Bar Chart" description="Horizontal comparisons" options={optBar} />
                    <RealChartContainer title="Stacked Bar Chart" description="Horizontal cumulative comparisons" options={optStackedBar} />
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Proportions & Distributions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Pie Chart" description="Part-to-whole relationships" options={optPie} />
                    <RealChartContainer title="Donut Chart" description="Hollow part-to-whole relationships" options={optDonut} />
                    <RealChartContainer title="Scatter Chart" description="Multi-variable distribution" options={optScatter} />
                </div>
            </section>

        </div>
    );
}
