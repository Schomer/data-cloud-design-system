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
    "borderColor": "#BAE6FD",
    "textColor": "#0284C7",
    "headerTextColor": "#0C4A6E",
    "footerBg": "#F0F9FF",
    "borderRadius": 8,
    "title": "Overlay Modal",
    "darkBg": "#1a1a1a",
    "darkBorderColor": "#1e293b"
  },
  "dark": {
    "bg": "#0C4A6E",
    "borderColor": "#0369A1",
    "textColor": "#BAE6FD",
    "headerTextColor": "#F0F9FF",
    "footerBg": "#082F49",
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