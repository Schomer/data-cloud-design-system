---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#92400E",
    "#B45309",
    "#D97706",
    "#F59E0B",
    "#78350F",
    "#451A03",
    "#B45309",
    "#92400E",
    "#D97706",
    "#78350F"
  ],
  "light": {
    "background": "#FFFFFF",
    "gridLineColor": "#FDE68A",
    "textColor": "#92400E",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#78350F",
    "gridLineColor": "#B45309",
    "textColor": "#FDE68A",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.