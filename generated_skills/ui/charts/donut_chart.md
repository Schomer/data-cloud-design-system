---
name: donut_chart
category: visualizations
description: Similar to pie chart but center can display total value or key metric.
intent_keywords: ["donut", "ring", "proportion", "total"]
schema: data: array, axes: object
---

# Donut Chart Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Showing relative proportions of a whole while conveying the absolute total.
- Strict limit of 3-5 segments for part-to-whole comparisons.

**Best Default States:** 
- Display the total absolute value (or a primary key metric) prominently in the center hole.
- Start the largest slice at 12 o'clock, sorted descending.

**User Interactions:** 
- Slice hover tooltips displaying exact absolute values and precise percentages.
- Optional: Implement slice click behaviors to cross-filter other data components ONLY if explicitly requested.