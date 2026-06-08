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
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#2E3440",
    "darkColor": "#ECEFF4"
  },
  "h2": {
    "fontSize": 30,
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#2E3440",
    "darkColor": "#ECEFF4"
  },
  "h3": {
    "fontSize": 24,
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#2E3440",
    "darkColor": "#ECEFF4"
  },
  "h4": {
    "fontSize": 20,
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#2E3440",
    "darkColor": "#ECEFF4"
  },
  "h5": {
    "fontSize": 18,
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#2E3440",
    "darkColor": "#ECEFF4"
  },
  "h6": {
    "fontSize": 16,
    "fontWeight": "500",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#2E3440",
    "darkColor": "#ECEFF4"
  },
  "p": {
    "fontSize": 16,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#2E3440",
    "darkColor": "#ECEFF4"
  },
  "small": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#4C566A",
    "darkColor": "#E5E9F0"
  },
  "mono": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "monospace",
    "lightColor": "#2E3440",
    "darkColor": "#ECEFF4"
  },
  "muted": {
    "fontSize": 14,
    "fontWeight": "400",
    "fontFamily": "'Inter', sans-serif",
    "lightColor": "#4C566A",
    "darkColor": "#E5E9F0",
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