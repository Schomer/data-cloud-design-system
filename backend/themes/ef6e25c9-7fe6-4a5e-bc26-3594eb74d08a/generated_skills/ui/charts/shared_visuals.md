---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#16A34A",
    "#15803D",
    "#CA8A04",
    "#0D9488",
    "#4ADE80",
    "#22C55E",
    "#10B981",
    "#84CC16",
    "#047857",
    "#064E3B"
  ],
  "light": {
    "background": "#FFFFFF",
    "gridLineColor": "#BBF7D0",
    "textColor": "#16A34A",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#14532D",
    "gridLineColor": "#16A34A",
    "textColor": "#BBF7D0",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.