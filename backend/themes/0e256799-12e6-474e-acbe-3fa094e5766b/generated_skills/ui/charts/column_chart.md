---
name: column_chart
category: visualizations
description: Best for comparing values across separate categories where there are few categories.
intent_keywords: ["column", "vertical bar", "comparison", "small"]
schema: data: array, axes: object
---

# Column Chart Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Comparing metrics across 5-15 discrete categories.

**Best Default States:** 
- Sorted by value.
- Y-axis must have a zero baseline.
- Horizontal labels (avoid tilted labels).

**User Interactions:** 
- Value hover popups.
- Optional: Implement cross-filtering click behaviors ONLY if explicitly requested by the user.

**Sub-variation (Stacked Column Chart):** 
- Place the most important sub-category directly at the baseline for easier comparison.