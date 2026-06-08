---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#6750A4",
    "#9E2A2B",
    "#006874",
    "#B3261E",
    "#3A5A92",
    "#7D5260",
    "#4A4458",
    "#1D1B20",
    "#386A20",
    "#B3261E"
  ],
  "light": {
    "background": "#F4EFF4",
    "gridLineColor": "#CAC4D0",
    "textColor": "#49454F",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#2B2930",
    "gridLineColor": "#938F99",
    "textColor": "#CAC4D0",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.