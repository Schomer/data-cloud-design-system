---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{
  "palette": [
    "#A6E22E",
    "#F92672",
    "#66D9EF",
    "#FD971F",
    "#AE81FF",
    "#E6DB74",
    "#A6E22E",
    "#F92672",
    "#66D9EF",
    "#FD971F"
  ],
  "light": {
    "background": "#FFFFFF",
    "gridLineColor": "#D2CEB6",
    "textColor": "#75715E",
    "tooltipBg": "#ffffff",
    "tooltipText": "#484747"
  },
  "dark": {
    "background": "#3E3D32",
    "gridLineColor": "#75715E",
    "textColor": "#E6DB74",
    "tooltipBg": "#334155",
    "tooltipText": "#f8fafc"
  }
}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.