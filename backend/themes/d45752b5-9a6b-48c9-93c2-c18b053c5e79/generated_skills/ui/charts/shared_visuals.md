---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#88C0D0",
    "#81A1C1",
    "#5E81AC",
    "#A3BE8C",
    "#B48EAD",
    "#EBCB8B",
    "#D08770",
    "#BF616A",
    "#4C566A",
    "#ECEFF4"
  ],
  "light": {
    "background": "#FFFFFF",
    "gridLineColor": "#D8DEE9",
    "textColor": "#4C566A",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#3B4252",
    "gridLineColor": "#4C566A",
    "textColor": "#E5E9F0",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.