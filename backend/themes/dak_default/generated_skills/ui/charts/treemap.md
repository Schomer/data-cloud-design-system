---
name: treemap
category: visualizations
description: Hierarchical data as nested rectangles; great for large category sets.
intent_keywords: ["hierarchy", "proportions", "nested", "allocation"]
schema: children: array, value: number
---

# Treemap Skill

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
- Visualizing hierarchical data or part-to-whole across many small categories.

**Dimensions & Best Default States:** 
- Map the primary volume/size metric to node size.
- Map a secondary performance metric (e.g., Growth %, Profitability) to a color gradient across nodes.

**User Interactions:** 
- Hover tooltips explicitly exposing the node category name, volume metric, and secondary metric.
- Click-to-drill-down if the data model supports deeper hierarchical traversal.