---
name: sparkline
category: visualizations
description: Tiny line chart for embedding within text or tables.
intent_keywords: ["inline", "micro", "quick trend"]
schema: timestamp: string, value: number
---

# Sparkline Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Tiny line chart for embedding within text or tables.