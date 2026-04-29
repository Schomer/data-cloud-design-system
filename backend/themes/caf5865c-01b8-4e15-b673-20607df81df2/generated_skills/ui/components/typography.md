---
name: typography
category: components
description: Full sizing and weight scale for H1-H6 and Body text
intent_keywords: ["font", "text", "heading", "body", "size", "weight"]
schema: variant: string, children: string
---

# Typography System Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Typography System:
```json
{
  "h1": {
    "fontSize": 36,
    "fontWeight": "600",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#5c5c5c",
    "darkColor": "#dbdbdb"
  },
  "h2": {
    "fontSize": 30,
    "fontWeight": "600",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#5c5c5c",
    "darkColor": "#dbdbdb"
  },
  "h3": {
    "fontSize": 24,
    "fontWeight": "600",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#5c5c5c",
    "darkColor": "#dbdbdb"
  },
  "h4": {
    "fontSize": 20,
    "fontWeight": "600",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#5c5c5c",
    "darkColor": "#dbdbdb"
  },
  "h5": {
    "fontSize": 18,
    "fontWeight": "500",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#5c5c5c",
    "darkColor": "#dbdbdb"
  },
  "h6": {
    "fontSize": 14,
    "fontWeight": "600",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#64748b",
    "darkColor": "#7e8ea5"
  },
  "p": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#475569",
    "darkColor": "#cbd5e1"
  },
  "small": {
    "fontSize": 12,
    "fontWeight": "400",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#64748b",
    "darkColor": "#94a3b8"
  },
  "mono": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "monospace",
    "lightColor": "#1e293b",
    "darkColor": "#a0a7b0"
  },
  "muted": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "\"Inter\", sans-serif",
    "lightColor": "#94a3b8",
    "darkColor": "#94a3b8",
    "fontStyle": "italic"
  },
  "link": {}
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for maintaining consistent hierarchical text sizing, headers, and readability across the interface.