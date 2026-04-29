---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#62a8ea",
    "#aaa47c",
    "#a8d95e",
    "#40bdd4",
    "#7375c9",
    "#ea75b0",
    "#f59e0b",
    "#ef4444",
    "#10b981",
    "#8b5cf6"
  ],
  "light": {
    "background": "#ffffff",
    "gridLineColor": "#e2e8f0",
    "textColor": "#64748b",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#1a1a1a",
    "gridLineColor": "#1e293b",
    "textColor": "#94a3b8",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.