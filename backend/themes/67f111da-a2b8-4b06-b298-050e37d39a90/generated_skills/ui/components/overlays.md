---
name: overlays
category: components
description: Dialogs, Modals, and Popover containers
intent_keywords: ["modal", "dialog", "overlay", "popup"]
schema: title: string, isOpen: boolean, children: any
---

# Modals & Overlays Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Modals & Overlays:
```json
{
  "light": {
    "bg": "#FFFFFF",
    "borderColor": "#D7D7D1",
    "textColor": "#44475A",
    "headerTextColor": "#282A36",
    "footerBg": "#F8F8F2",
    "borderRadius": 8,
    "title": "Overlay Modal",
    "darkBg": "#1a1a1a",
    "darkBorderColor": "#1e293b"
  },
  "dark": {
    "bg": "#44475A",
    "borderColor": "#6272A4",
    "textColor": "#BFBFBF",
    "headerTextColor": "#F8F8F2",
    "footerBg": "#282A36",
    "borderRadius": 8,
    "title": "Overlay Modal",
    "darkBg": "#1a1a1a",
    "darkBorderColor": "#1e293b"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for focus-requiring tasks, confirmations, layered forms, and contextual popovers over existing content.