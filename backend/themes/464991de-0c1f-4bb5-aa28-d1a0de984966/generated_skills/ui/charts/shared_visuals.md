---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#1A73E8",
    "#FBBC04",
    "#a8348f",
    "#EA4335",
    "#F29900",
    "#185ABC",
    "#137333",
    "#B31412",
    "#E8710A",
    "#1E8E3E"
  ],
  "light": {
    "background": "#F8F9FA",
    "gridLineColor": "#DADCE0",
    "textColor": "#5F6368",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#303134",
    "gridLineColor": "#5F6368",
    "textColor": "#9AA0A6",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.