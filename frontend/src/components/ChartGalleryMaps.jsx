import React from 'react';
import ReactECharts from 'echarts-for-react';
import EditableWrapper from './EditableWrapper';
import Typography from './Typography';
import { useChartColors } from '../context/ChartColorContext';
import { useEditor } from '../context/EditorContext';
import SkillEditButton from './SkillEditButton';
import WorldMapChart from './WorldMapChart';
import USAMapChart from './USAMapChart';

const RealChartContainer = ({ title, description, options, height = "500px", skillPath, children }) => {
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
                    {children || <ReactECharts option={options} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} notMerge={true} />}
                </div>
            </div>
        </div>
    </EditableWrapper>
    );
};

export default function ChartGalleryMaps() {
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

    const optPointMapMock = {
        ...baseTheme,
        xAxis: { show: false, min: -1, max: 9 },
        yAxis: { show: false, min: -1, max: 5 },
        series: [
            {
                type: 'scatter', symbol: 'rect', symbolSize: 30, silent: true,
                itemStyle: { color: '#f1f5f9' },
                data: [
                    [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
                    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3],
                    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2],
                    [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1],
                    [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]
                ]
            },
            {
                type: 'effectScatter', symbolSize: Math.random() * 20 + 5,
                itemStyle: { color: chartColors[0], shadowBlur: 10, shadowColor: chartColors[0] },
                data: [
                    [1.5, 3.5], [6.2, 2.8], [4.1, 1.2], [7.8, 3.1], [2.5, 0.5], [0.5, 2.5]
                ]
            }
        ]
    };

    const optTileMap = {
        ...baseTheme,
        tooltip: { trigger: 'item' },
        xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'], show: false },
        yAxis: { type: 'category', data: ['W', 'X', 'Y', 'Z'], show: false },
        visualMap: { show: false, min: 0, max: 100, inRange: { color: ['#dcfce7', '#4ade80', '#166534'] } },
        series: [{
            type: 'heatmap',
            data: [
                [0, 0, 20], [1, 0, 80], [2, 0, 40], [3, 0, 60],
                [0, 1, 90], [1, 1, 10], [2, 1, 30], [3, 1, 50],
                [0, 2, 40], [1, 2, 70], [2, 2, 20], [3, 2, 80],
                [0, 3, 10], [1, 3, 50], [2, 3, 90], [3, 3, 30],
            ],
            label: { show: true, formatter: (p) => `${['A', 'B', 'C', 'D'][p.data[0]]}-${['W', 'X', 'Y', 'Z'][p.data[1]]}\n\n${p.data[2]}`, color: '#000', fontSize: 10 },
            itemStyle: { borderColor: '#fff', borderWidth: 4, borderRadius: 8 }
        }]
    };

    return (
        <div className="space-y-12 pb-24">
            <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold tracking-tight mb-2">Maps & Geodata</h2>
                <p className="text-slate-500">Visualizations focused on spatial relationships and geographic data distributions.</p>
            </div>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Choropleth Maps</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="World Map" description="Global regions colored by value intensity" skillPath="ui/charts/world_map.md">
                        <WorldMapChart height="100%" />
                    </RealChartContainer>
                    <RealChartContainer title="USA Map" description="US States colored by value intensity" skillPath="ui/charts/usa_map.md">
                        <USAMapChart height="100%" />
                    </RealChartContainer>
                </div>
            </section>

            <section>
                <div className="flex items-center gap-2 mb-6 mt-12">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Other Geo Charts</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RealChartContainer title="Geo Point Map" description="Data points located on coordinates" height="350px" skillPath="ui/charts/geo_point_map.md">
                        <ReactECharts option={optPointMapMock} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
                    </RealChartContainer>
                    <RealChartContainer title="Tile Map" description="Equal-sized tiles representing regions" height="350px" skillPath="ui/charts/tile_map.md">
                        <ReactECharts option={optTileMap} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
                    </RealChartContainer>
                </div>
            </section>
        </div>
    );
}
