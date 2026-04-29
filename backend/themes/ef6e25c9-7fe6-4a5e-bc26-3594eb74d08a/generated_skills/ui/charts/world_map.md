---
name: world_map
category: visualizations
description: Visualizing country-level data globally via color intensity.
intent_keywords: ["global", "countries", "international"]
schema: region: string, value: number
---

# World Map Skill

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

**Best Use Cases:** 
- Visualizing country-level or global data via color intensity (Choropleth).

**Rendering Logic:** 
- **Choropleth Maps**: Use a sequential color ramp for volume/intensity; use a diverging color ramp for metrics crossing zero (e.g., profit/loss).
- **Symbol Maps**: Use when exact location coordinates are necessary. Prevent boundary bias for overlapping city data.

**User Interactions:** 
- **Hover/Tooltip**: Shows geographical locale ID alongside mapped metrics.
- **Zoom/Pan**: Essential for seeing country-level detail and navigating regions.
- **Click Cross-filtering**: Optional. Treat clicked regions like a categorical filter (only implement if explicitly requested).