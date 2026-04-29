---
name: density_plot
category: visualizations
description: Visualizes the distribution of data over a continuous interval or time period.
intent_keywords: ["density plot", "distribution", "variance"]
schema: value: number
---

# Density Plot Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Visualizes the distribution of data over a continuous interval or time period.