---
name: area_chart
category: visualizations
description: Similar to line charts but emphasizes magnitude of change by filling area below the line.
intent_keywords: ["area", "volume", "stacked", "magnitude"]
schema: data: array, axes: object
---

# Area Chart Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Showing volume changes over time.
- Highlighting overlapping volumes.

**Best Default States:** 
- Use semi-transparent fills for overlap visibility.
- Emphasize the top boundary with a bold line stroke.

**User Interactions:** 
- Crosshair tooltips displaying exact values (discrete or cumulative) across the timeline.
- Legend toggling to isolate or selectively hide specific volume layers.