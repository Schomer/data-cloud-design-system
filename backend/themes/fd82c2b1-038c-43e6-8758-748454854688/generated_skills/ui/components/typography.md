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
    "fontSize": 39,
    "fontWeight": "700",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#7C2D12",
    "darkColor": "#FFF7ED"
  },
  "h2": {
    "fontSize": 33,
    "fontWeight": "700",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#7C2D12",
    "darkColor": "#FFF7ED"
  },
  "h3": {
    "fontSize": 26,
    "fontWeight": "700",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#7C2D12",
    "darkColor": "#FFF7ED"
  },
  "h4": {
    "fontSize": 22,
    "fontWeight": "700",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#7C2D12",
    "darkColor": "#FFF7ED"
  },
  "h5": {
    "fontSize": 19,
    "fontWeight": "700",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#7C2D12",
    "darkColor": "#FFF7ED"
  },
  "h6": {
    "fontSize": 17,
    "fontWeight": "700",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#7C2D12",
    "darkColor": "#FFF7ED"
  },
  "p": {
    "fontSize": 17,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#7C2D12",
    "darkColor": "#FFF7ED"
  },
  "small": {
    "fontSize": 15,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#EA580C",
    "darkColor": "#FED7AA"
  },
  "mono": {
    "fontSize": 15,
    "fontWeight": "400",
    "fontFamily": "monospace",
    "lightColor": "#7C2D12",
    "darkColor": "#FFF7ED"
  },
  "muted": {
    "fontSize": 15,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#EA580C",
    "darkColor": "#FED7AA",
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