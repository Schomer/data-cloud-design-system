---
name: usa_map
category: visualizations
description: Best for visualizing state-level data across the United States.
intent_keywords: ["map", "geo", "spatial", "location", "usa"]
schema: region: string, value: number
---

# Usa Map Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

**Map Layout & Styling Rules**:
- **Size & Height**: Ensure the map container has an adequate minimum height (e.g., `minHeight: 400px` or `500px`) so the geographic area is fully visible and not squished.
- **Legend Placement**: Do not allow the legend to obscure the map. Place the legend completely outside the map region (such as below or adjacent to the map) rather than overlaying it on top of the geographical areas. Ensure legends do not have an opaque background that hides data.
- **Background & Theme Match**: The map background color must strictly match the current active theme (e.g., the `background` property in `shared_visuals.md`). Apply the same color to the map component itself to prevent unsightly color clashes.
- **Default View**: The default map view should be zoomed to the continental United States (excluding Alaska and Hawaii) to maximize the detail and visibility of the primary landmass. For ECharts, use `zoom: 2.8` and `center: [-96, 38]` on the series object to accomplish this.

## Usage Context

**Best Use Cases:** 
- Visualizing state-level or regional data across the United States.

**Rendering Logic:** 
- **Choropleth Maps**: Use a sequential color ramp for volume/intensity; use a diverging color ramp for metrics crossing zero (e.g., profit/loss).
- **Symbol Maps**: Use when exact location coordinates are necessary. Prevent boundary bias for overlapping city data.

## Interactions
This chart type generically supports the following interactions:
- **Hover/Tooltip**: Shows geographical locale ID alongside metrics.
- **Zoom/Pan**: Essential for seeing county-level detail.
- **Click Cross-filtering**: Optional. Treat clicked region like a categorical filter driving page metrics (only implement if explicitly requested).

## Partner Components
Consider placing these components adjacent to the chart based on the app layout context (e.g., page-level filters for dashboards, component-level constraints for detailed reports):
- **State/County Selector**: Type ahead filter to zoom map coordinates to a location and outline it.
- **Metric Dropdown**: Controls color choropleth intensity.