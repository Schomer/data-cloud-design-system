---
name: funnel
category: visualizations
description: Progressive reduction of data as it passes through phases.
intent_keywords: ["drop-off", "conversion", "sales pipeline"]
schema: children: array, value: number
---

# Funnel Skill

## Visual Specifications
See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts.


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context

**Best Use Cases:** 
- Progressive reduction of data as it passes through sequential phases.

**Metrics Rules:** 
- Must display both the absolute raw volume AND the step-by-step conversion percentage.

**User Interactions:** 
- Phase hover tooltips displaying exact drop-off counts, conversion percentages from the previous step, and phase labels.