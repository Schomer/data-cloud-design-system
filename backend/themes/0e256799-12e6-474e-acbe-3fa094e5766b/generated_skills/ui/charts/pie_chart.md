---
name: pie_chart
category: visualizations
description: Shows relative proportions of categories; best for 2-5 slices.
intent_keywords: ["pie", "proportion", "slices", "part-to-whole"]
schema: data: array, axes: object
---

# Pie Chart Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Showing relative proportions of a whole.
- Strict limit of 3-5 segments for part-to-whole comparisons. (Consider grouping smaller segments into "Other").

**Best Default States:** 
- Start the largest slice at 12 o'clock.
- Sort remaining slices descending by size clockwise.

**User Interactions:** 
- Slice hover tooltips displaying exact absolute values and precise percentages.
- Optional: Implement slice click behaviors to cross-filter other data aggregations ONLY if explicitly requested.