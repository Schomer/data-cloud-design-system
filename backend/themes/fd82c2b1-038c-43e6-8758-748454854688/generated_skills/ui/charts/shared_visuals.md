---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#EA580C",
    "#C2410C",
    "#F59E0B",
    "#D97706",
    "#E11D48",
    "#9A3412",
    "#B45309",
    "#BE123C",
    "#F97316",
    "#F43F5E"
  ],
  "light": {
    "background": "#FFFFFF",
    "gridLineColor": "#FED7AA",
    "textColor": "#EA580C",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#7C2D12",
    "gridLineColor": "#EA580C",
    "textColor": "#FED7AA",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.