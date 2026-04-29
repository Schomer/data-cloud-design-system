---
name: sankey
category: visualizations
description: Best for showing flow of resources or journeys between states.
intent_keywords: ["flow", "journey", "conversion", "budget"]
schema: children: array, value: number
---

# Sankey Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Showing flow of resources or user journeys between states.

**Complexity Limits:** 
- Cap the visualization at <20 nodes or <30 flows to prevent visual spaghetti.
- Require aggregation for small flows (e.g., group into "Other").

**User Interactions:** 
- Node hover must highlight full connected flow paths.