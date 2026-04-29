---
name: gauge
category: visualizations
description: Single metric relative to a goal or target range.
intent_keywords: ["target", "kpi", "speedometer", "status"]
schema: nodes: array, links: array, metrics: string[]
---

# Gauge Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Single metric tracked strictly against a predefined goal or limit.

**Constraints:** 
- Must display the target threshold explicitly on the visual arc.

**User Interactions:** 
- Hover tooltips showing the exact absolute value versus the target goal constraint.