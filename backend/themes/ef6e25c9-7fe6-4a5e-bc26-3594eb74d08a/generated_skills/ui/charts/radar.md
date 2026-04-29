---
name: radar
category: visualizations
description: Comparing multiple entities across 3-8 different quantitative variables.
intent_keywords: ["spider", "multivariate", "profile", "comparison"]
schema: nodes: array, links: array, metrics: string[]
---

# Radar Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Comparing multiple entities across 3-8 different quantitative variables.