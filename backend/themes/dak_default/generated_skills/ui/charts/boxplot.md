---
name: boxplot
category: visualizations
description: Comparing distributions across groups, highlighting median and outliers.
intent_keywords: ["outliers", "quartiles", "variance", "spread"]
schema: ranges: array, frequency: numeric[]
---

# Boxplot Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Comparing distributions across groups.
- Unmasking outliers.

**User Interactions:** 
- Require hover tooltips to expose exact statistical thresholds (Min, Max, Median, Quartiles).