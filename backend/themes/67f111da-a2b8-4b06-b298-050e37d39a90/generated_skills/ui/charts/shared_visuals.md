---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#FF79C6",
    "#BD93F9",
    "#50FA7B",
    "#FFB86C",
    "#FF5555",
    "#F1FA8C",
    "#8BE9FD",
    "#6272A4",
    "#44475A",
    "#F8F8F2"
  ],
  "light": {
    "background": "#FFFFFF",
    "gridLineColor": "#D7D7D1",
    "textColor": "#44475A",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#44475A",
    "gridLineColor": "#6272A4",
    "textColor": "#BFBFBF",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.