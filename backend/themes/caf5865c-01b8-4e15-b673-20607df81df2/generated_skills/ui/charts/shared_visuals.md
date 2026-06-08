---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#F472B6",
    "#A78BFA",
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#FDE047",
    "#FCA5A5",
    "#818CF8",
    "#C084FC",
    "#E879F9"
  ],
  "light": {
    "background": "#FFFFFF",
    "gridLineColor": "#FBCFE8",
    "textColor": "#F472B6",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#5B21B6",
    "gridLineColor": "#8B5CF6",
    "textColor": "#E9D5FF",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.