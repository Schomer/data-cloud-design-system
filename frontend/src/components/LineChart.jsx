import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useChartColors } from '../context/ChartColorContext';
import { useEditor } from '../context/EditorContext';

const LineChart = ({ data, axes, height = '400px' }) => {
    const { chartColors } = useChartColors();
    const { theme } = useEditor();
    const isDarkMode = theme === 'dark';

    const option = useMemo(() => {
        if (!data || !axes || !axes.x || !axes.y) return {};

        const xAxisData = data.map(item => item[axes.x.field]);
        const yAxisData = data.map(item => item[axes.y.field]);

        return {
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
            grid: { top: 30, right: 20, bottom: 30, left: 40, containLabel: true },
            xAxis: {
                type: 'category',
                name: axes.x.title,
                nameLocation: 'middle',
                nameGap: 25,
                data: xAxisData,
                axisLine: { lineStyle: { color: isDarkMode ? '#334155' : '#e2e8f0' } },
                axisLabel: { color: isDarkMode ? '#94a3b8' : '#64748b' },
                nameTextStyle: { color: isDarkMode ? '#94a3b8' : '#64748b' }
            },
            yAxis: {
                type: 'value',
                name: axes.y.title,
                nameLocation: 'middle',
                nameGap: 40,
                axisLine: { show: false },
                axisLabel: { color: isDarkMode ? '#94a3b8' : '#64748b' },
                splitLine: { lineStyle: { color: isDarkMode ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9' } },
                nameTextStyle: { color: isDarkMode ? '#94a3b8' : '#64748b' }
            },
            series: [
                {
                    data: yAxisData,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    lineStyle: { width: 3 }
                }
            ]
        };
    }, [data, axes, chartColors, isDarkMode]);

    return (
        <div style={{ width: '100%', height }}>
            <ReactECharts
                option={option}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
};

export default LineChart;
