---
name: ridgeline
category: visualizations
description: Shows distribution of a numeric value for several groups.
intent_keywords: ["ridgeline", "joyplot", "distribution", "density"]
schema: category: string, value: number, group: string
---

# Ridgeline Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Shows distribution of a numeric value for several groups.