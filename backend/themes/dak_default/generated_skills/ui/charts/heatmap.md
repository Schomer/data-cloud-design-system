---
name: heatmap
category: visualizations
description: Shows magnitude of data in a 2D matrix using color gradients.
intent_keywords: ["matrix", "correlation", "intensity", "density"]
schema: ranges: array, frequency: numeric[]
---

# Heatmap Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

**Heatmap Layout & Styling Rules**:
- **Color Palette**: The heatmap chart MUST use the system color palette defined in `shared_visuals.md` (e.g., the `palette` array) to construct its color gradients. Do not use random, hardcoded, or library-default color maps.
- **Cell Legibility**: Ensure adequate padding between cells and clear axes to maintain readability across data points.

## Usage Context
Shows magnitude of data in a 2D matrix using color gradients.