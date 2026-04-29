---
name: histogram
category: visualizations
description: Shows distribution of a continuous variable divided into bins.
intent_keywords: ["distribution", "frequency", "bins"]
schema: ranges: array, frequency: numeric[]
---

# Histogram Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Shows the un-aggregated distribution shape of a continuous variable.

**Best Default States:** 
- Ensure auto-calculation of bin widths.
- Enforce **zero gap spacing** between vertical bars to represent continuous frequency data correctly.

**User Interactions:** 
- Bar hover tooltips detailing the specific bin range brackets and exact frequency count.
- Drag-to-select (brushing) to zoom into granular distribution slices.