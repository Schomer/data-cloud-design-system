---
name: discovery_router
description: Advanced data-centric reasoning engine for mapping user intents to UI and Visualization skills
---

# Discovery & Reasoning Router

This skill is the "brain" of the component selection process. You MUST use the following framework to decide which components and visualizations are best suited for the user's data and objectives.

## 1. Selection Philosophy
To select the correct component, follow this reasoning loop:
1.  **Analyze Data Shape**: Identify if the data is categorical (discrete buckets), temporal (time-series), geospatial (locations), or relational (correlations/networks).
2.  **Identify User Outcome**: Determine if the goal is to **Compare** values, show **Distribution**, track **Trends**, visualize **Composition**, or map **Flow**.
3.  **Layout Assumption Fallback**: If the app archetype/layout is ambiguous, quietly fall back to using the 'Executive Summary' grid as the baseline layout. Do NOT output any user-facing textual notes or warnings about this assumption in the generated app.
4.  **Rank and Select**: Use the catalog below to pick the component that scores highest across both Data Shape and Outcome requirements.

## 2. Data Archetype Mapping
| Data Archetype | Recommended Skills | Why? |
|---|---|---|
| **Categorical** | `bar_chart`, `column_chart`, `pie_chart`, `treemap` | Best for discrete groupings and part-to-whole relationships. |
| **Temporal** | `line_chart`, `area_chart`, `candlestick`, `ridgeline` | Best for showing change, trends, and volatility over time. |
| **Geospatial** | `world_map`, `usa_map`, `geo_point_map`, `tile_map` | Best for revealing geographic patterns and regional performance. |
| **Relational** | `scatter_plot`, `heatmap`, `network_graph`, `radar` | Best for correlation, density, and multi-variable connectivity. |
| **Metric / KPI** | `cards_kpi`, `gauge`, `sparkline` | Best for "at-a-glance" status and high-level performance tracking. |

## 3. Outcome-Oriented Routing
- **Comparison**: Use `bar_chart` (many items), `column_chart` (few items), or `radar` (multi-metric).
- **Distribution**: Use `histogram`, `boxplot`, `density_plot`, or `violin` to show variance and spread.
- **Composition**: Use `pie_chart` (2-5 items), `donut_chart`, or `treemap` (complex hierarchies).
- **Flow / Process**: Use `sankey` for resource flow, `funnel` for conversion, or `workflow_diagram`.
- **Relationship**: Use `scatter_plot` (two variables) or `heatmap` (matrix/correlation).
- **Detailed Audit**: Use `data_table` for deep-dive record inspections with sorting and search.

## 4. Component Catalog (Registry)

| Category | Keywords | Data Signature | Scalability | Persona | Complexity | Priority | Skill File |
|---|---|---|---|---|---|---|---|
| Components | click / submit / action / trigger / button | Trigger context | High density | All | Low | Primary | ui/components/button.md |
| Components | text / input / form / search / field | User input | N/A | All | Low | Primary | ui/components/input_fields.md |
| Components | date / range / time / calendar / horizon | Temporal range selection | N/A | All | Medium | Primary | ui/components/date_range.md |
| Components | filter / query / slice / search / date range | Data slicing | High | All | Medium | Primary | ui/components/filters.md |
| Components | checkbox / radio / toggle / switch / segmented | Option arrays | High (multi-selection) | All | Low | Primary | ui/components/selection_controls.md |
| Components | metric / kpi / card / summary / stat | 1-2 Numerical Metrics | Best for 4-8 cards | Executive | Low | Primary | ui/components/cards_kpi.md |
| Components | table / grid / list / rows / records | Records (Array of Objects) | High (> 100 rows) | Analyst, Ops | Low | Primary | ui/components/data_table.md |
| Components | nav / menu / sidebar / link / active | Nav hierarchy | High | All | Low | Primary | ui/components/navigation.md |
| Components | wizard / step / progress / workflow / sequence | Sequential stages | 3-7 steps | All | Medium | Specialized | ui/components/wizard_steps.md |
| Components | modal / dialog / overlay / popup | Contextual containers | Single focus | All | Low | Specialized | ui/components/overlays.md |
| Components | chat / gemini / ai / conversation / fullscreen | Natural Language | High | All | Medium | Specialized | ui/components/chat_fullscreen.md |
| Components | chat / sidebar / gemini / ai / assistant | Natural Language | Medium | All | Medium | Specialized | ui/components/chat_sidebar.md |
| Components | chat / command / field / gemini / ai | Natural Language | Low | All | Low | Specialized | ui/components/chat_field.md |
| Components | font / text / heading / body / size | Text hierarchical | High | All | Low | Primary | ui/components/typography.md |
| Visualizations | line / trend / temporal / series | 1 Temporal, 1+ Numerical | High density allowed | All | Low | Primary | ui/charts/line_chart.md |
| Visualizations | area / volume / stacked / magnitude | 1 Temporal, 1+ Numerical (Stacked) | Best for 2-5 series | Business, Analyst | Low | Primary | ui/charts/area_chart.md |
| Visualizations | column / vertical bar / comparison / small | 1 Categorical, 1 Numerical | Low (< 10 categories) | All | Low | Primary | ui/charts/column_chart.md |
| Visualizations | bar / horizontal / ranking / long labels | 1 Categorical, 1 Numerical | High (> 15 categories) | All | Low | Primary | ui/charts/bar_chart.md |
| Visualizations | pie / proportion / slices / part-to-whole | 1 Categorical, 1 Numerical (Sum=100%) | Very Low (2-5 slices) | Executive | Low | Specialized | ui/charts/pie_chart.md |
| Visualizations | donut / ring / proportion / total | 1 Categorical, 1 Numerical | Very Low (2-5 slices) | Executive | Low | Specialized | ui/charts/donut_chart.md |
| Visualizations | scatter / correlation / relationship / outliers | 2 Numerical (X, Y) | High density (points) | Analyst, Data Scientist | Medium | Primary | ui/charts/scatter_plot.md |
| Visualizations | distribution / frequency / bins | 1 Continuous Numerical | Medium (10-30 bins) | Analyst, Scientist | Medium | Primary | ui/charts/histogram.md |
| Visualizations | matrix / correlation / intensity / density | 2 Categorical, 1 Numerical | High (Large matrices) | Analyst, Power User | Medium | Specialized | ui/charts/heatmap.md |
| Visualizations | outliers / quartiles / variance / spread | 1 Categorical, 1 Numerical (dist) | Medium (5-12 groups) | Analyst, Scientist | High | Specialized | ui/charts/boxplot.md |
| Visualizations | global / countries / international / geography / map | 1 Country Geo, 1 Numerical | Global breadth | Executive, Global Ops | Low | Primary | ui/charts/world_map.md |
| Visualizations | usa / states / domestic / geography / map | 1 US State Geo, 1 Numerical | 50 states | Regional Mgr, Executive | Low | Primary | ui/charts/usa_map.md |
| Visualizations | flow / journey / conversion / budget | 2+ Categorical (Stages), 1 Numerical | Medium complexity flow | Analyst, Strategist | High | Specialized | ui/charts/sankey.md |
| Visualizations | hierarchy / proportions / nested / allocation | 1-2 Categorical (Parent/Child), 1 Numerical | High (> 20 categories) | Portfolio Mgr, Analyst | Medium | Specialized | ui/charts/treemap.md |
| Visualizations | drop-off / conversion / sales pipeline | 1 Categorical (Sequential), 1 Numerical | 3-7 stages | Sales, Marketing, Ops | Low | Primary | ui/charts/funnel.md |
| Visualizations | target / kpi / speedometer / status | 1 Numerical (Value vs Goal) | Single point | Executive, Ops | Low | Specialized | ui/charts/gauge.md |
| Visualizations | spider / multivariate / profile / comparison | 1 Categorical, 3-8 Numerical metrics | Low (1-3 entities) | Analyst, HR, Product | Medium | Specialized | ui/charts/radar.md |
| Visualizations | inline / micro / quick trend | 1 Temporal, 1 Numerical | Very compact | All | Low | Primary | ui/charts/sparkline.md |
| Visualizations | candlestick / ohlc / financial / stock | 1 Temporal, 4 Numerical | Medium | Trader, Analyst | High | Specialized | ui/charts/candlestick.md |
| Visualizations | ridgeline / joyplot / distribution / density | 1 Categorical, 1 Continuous Numerical, 1 Grouping | Medium | Scientist, Analyst | High | Specialized | ui/charts/ridgeline.md |
| Visualizations | density plot / distribution / variance | 1 Continuous Numerical | Medium | Scientist, Analyst | Medium | Specialized | ui/charts/density_plot.md |
| Visualizations | violin / distribution / spread / density | 1 Categorical, 1 Numerical | Low | Scientist, Analyst | High | Specialized | ui/charts/violin.md |
| Visualizations | network / graph / connections / nodes / edges | Nodes and Edges | High | Data Scientist, Analyst | High | Specialized | ui/charts/network_graph.md |
| Visualizations | geo point / coordinates / lat long / map | 2 Geo (Lat/Long), 1 Numerical | High | Analyst, Ops | Medium | Specialized | ui/charts/geo_point_map.md |
| Visualizations | tile map / grid map / spatial | X/Y Coordinates, 1 Numerical | Medium | Analyst | Medium | Specialized | ui/charts/tile_map.md |
| Components | workflow / diagram / process / flowchart | Sequential nodes | Low | Ops, PM | Medium | Specialized | ui/components/workflow_diagram.md |
