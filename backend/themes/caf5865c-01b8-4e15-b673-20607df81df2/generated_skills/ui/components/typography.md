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
    "fontSize": 41,
    "fontWeight": "600",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#831843",
    "darkColor": "#FDF2F8"
  },
  "h2": {
    "fontSize": 34,
    "fontWeight": "600",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#831843",
    "darkColor": "#FDF2F8"
  },
  "h3": {
    "fontSize": 27,
    "fontWeight": "600",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#831843",
    "darkColor": "#FDF2F8"
  },
  "h4": {
    "fontSize": 23,
    "fontWeight": "600",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#831843",
    "darkColor": "#FDF2F8"
  },
  "h5": {
    "fontSize": 20,
    "fontWeight": "600",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#831843",
    "darkColor": "#FDF2F8"
  },
  "h6": {
    "fontSize": 18,
    "fontWeight": "600",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#831843",
    "darkColor": "#FDF2F8"
  },
  "p": {
    "fontSize": 18,
    "fontWeight": "500",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#831843",
    "darkColor": "#FDF2F8"
  },
  "small": {
    "fontSize": 16,
    "fontWeight": "500",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#F472B6",
    "darkColor": "#E9D5FF"
  },
  "mono": {
    "fontSize": 16,
    "fontWeight": "400",
    "fontFamily": "monospace",
    "lightColor": "#831843",
    "darkColor": "#FDF2F8"
  },
  "muted": {
    "fontSize": 16,
    "fontWeight": "500",
    "fontFamily": "'Outfit', sans-serif",
    "lightColor": "#F472B6",
    "darkColor": "#E9D5FF",
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