---
name: scatter_plot
category: visualizations
description: Best for showing relationship or correlation between two numerical variables.
intent_keywords: ["scatter", "correlation", "relationship", "outliers"]
schema: data: array, axes: object
---

# Scatter Plot Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Visualizing relationship or correlation between two numerical variables.

**Supporting Controls:** 
- Add linear/non-linear trend line toggles.

**Sub-variation (Bubble Chart):** 
- To introduce a third quantitative metric, map it to the bubble's diameter (ensure the mapping sizes bubbles proportionately by area, not raw diameter scale).

**User Interactions:** 
- Data point hover tooltips exposing X, Y, and optional Z (bubble) precise values.
- Drag-to-select (lasso or bounding box) for highlighting specific cohorts or filtering.