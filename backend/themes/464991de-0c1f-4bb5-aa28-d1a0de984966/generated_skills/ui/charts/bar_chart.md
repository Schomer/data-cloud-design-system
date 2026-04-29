---
name: bar_chart
category: visualizations
description: Best for comparing categories, especially with many items or long labels.
intent_keywords: ["bar", "horizontal", "ranking", "long labels"]
schema: data: array, axes: object
---

# Bar Chart Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Long category names.
- Top-N ranking lists.

**Best Default States:** 
- Sorted descending by default.
- Guarantee longest label visibility without truncation.

**Sub-variation (Stacked Bar Chart):** 
- Display totals + part-to-whole relationships. Max 5 segments per bar.

**User Interactions:** 
- Value hover tooltips displaying exact values and category details.
- Optional: Implement click-to-filter (cross-filtering) behaviors ONLY if explicitly requested by the user.