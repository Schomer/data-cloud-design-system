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
    "fontSize": 37,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#14532D",
    "darkColor": "#F0FDF4"
  },
  "h2": {
    "fontSize": 31,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#14532D",
    "darkColor": "#F0FDF4"
  },
  "h3": {
    "fontSize": 25,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#14532D",
    "darkColor": "#F0FDF4"
  },
  "h4": {
    "fontSize": 21,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#14532D",
    "darkColor": "#F0FDF4"
  },
  "h5": {
    "fontSize": 18,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#14532D",
    "darkColor": "#F0FDF4"
  },
  "h6": {
    "fontSize": 16,
    "fontWeight": "700",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#14532D",
    "darkColor": "#F0FDF4"
  },
  "p": {
    "fontSize": 16,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#14532D",
    "darkColor": "#F0FDF4"
  },
  "small": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#16A34A",
    "darkColor": "#BBF7D0"
  },
  "mono": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "monospace",
    "lightColor": "#14532D",
    "darkColor": "#F0FDF4"
  },
  "muted": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#16A34A",
    "darkColor": "#BBF7D0",
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