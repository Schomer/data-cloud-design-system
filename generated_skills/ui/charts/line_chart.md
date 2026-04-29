---
name: line_chart
category: visualizations
description: Best for showing continuous data over time; highlights overall trends and changes.
intent_keywords: ["line", "trend", "temporal", "series"]
schema: data: array, axes: object
---

# Line Chart Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Spotting trends, spikes, and seasonality in continuous data.

**Best Default States:** 
- Left-to-right time axis.
- Hide individual data markers unless data points are relatively sparse.

**Supporting Controls:** 
- Highly recommended to pair with Date Range Selectors and Granularity Toggles (e.g., Daily/Weekly/Monthly).

**User Interactions:** 
- Crosshair/point hover tooltips displaying the exact value and time/date.
- Zooming and panning on the X-axis for dense datasets.
- Click legend series to isolate or hide trends in multi-line views.