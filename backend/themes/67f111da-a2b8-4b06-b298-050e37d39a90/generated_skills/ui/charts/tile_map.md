---
name: tile_map
category: visualizations
description: Abstract geographic map using equal-sized tiles.
intent_keywords: ["tile map", "grid map", "spatial"]
schema: x: number, y: number, value: number
---

# Tile Map Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

**Map Layout & Styling Rules**:
- **Size & Height**: Ensure the map container has an adequate minimum height (e.g., `minHeight: 400px` or `500px`) so the geographic area is fully visible and not squished.
- **Legend Placement**: Do not allow the legend to obscure the map. Place the legend completely outside the map region (such as below or adjacent to the map) rather than overlaying it on top of the geographical areas. Ensure legends do not have an opaque background that hides data.
- **Background & Theme Match**: The map background color must strictly match the current active theme (e.g., the `background` property in `shared_visuals.md`). Apply the same color to the map component itself to prevent unsightly color clashes.

## Usage Context
Abstract geographic map using equal-sized tiles.