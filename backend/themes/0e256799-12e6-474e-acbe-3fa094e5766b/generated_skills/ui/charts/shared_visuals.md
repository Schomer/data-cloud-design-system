---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#0284C7",
    "#0369A1",
    "#075985",
    "#082F49",
    "#38BDF8",
    "#7DD3FC",
    "#0EA5E9",
    "#0284C7",
    "#3B82F6",
    "#1D4ED8"
  ],
  "light": {
    "background": "#FFFFFF",
    "gridLineColor": "#BAE6FD",
    "textColor": "#0284C7",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#0C4A6E",
    "gridLineColor": "#0369A1",
    "textColor": "#BAE6FD",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.