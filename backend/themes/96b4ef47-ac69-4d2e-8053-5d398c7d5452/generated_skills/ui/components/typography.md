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
    "fontSize": 43,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#000000",
    "darkColor": "#FFFFFF"
  },
  "h2": {
    "fontSize": 36,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#000000",
    "darkColor": "#FFFFFF"
  },
  "h3": {
    "fontSize": 28,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#000000",
    "darkColor": "#FFFFFF"
  },
  "h4": {
    "fontSize": 24,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#000000",
    "darkColor": "#FFFFFF"
  },
  "h5": {
    "fontSize": 21,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#000000",
    "darkColor": "#FFFFFF"
  },
  "h6": {
    "fontSize": 19,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#000000",
    "darkColor": "#FFFFFF"
  },
  "p": {
    "fontSize": 19,
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#000000",
    "darkColor": "#FFFFFF"
  },
  "small": {
    "fontSize": 16,
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#333333",
    "darkColor": "#CCCCCC"
  },
  "mono": {
    "fontSize": 16,
    "fontWeight": "400",
    "fontFamily": "monospace",
    "lightColor": "#000000",
    "darkColor": "#FFFFFF"
  },
  "muted": {
    "fontSize": 16,
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#333333",
    "darkColor": "#CCCCCC",
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