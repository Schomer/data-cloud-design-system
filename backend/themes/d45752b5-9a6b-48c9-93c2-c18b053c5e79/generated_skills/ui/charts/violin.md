---
name: violin
category: visualizations
description: Similar to box plot, but with a rotated kernel density plot on each side.
intent_keywords: ["violin", "distribution", "spread", "density"]
schema: category: string, value: number
---

# Violin Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Similar to box plot, but with a rotated kernel density plot on each side.