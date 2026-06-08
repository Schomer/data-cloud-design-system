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
    "borderColor": "#FBCFE8",
    "textColor": "#F472B6",
    "headerTextColor": "#831843",
    "footerBg": "#FDF2F8",
    "borderRadius": 24,
    "title": "Overlay Modal",
    "darkBg": "#1a1a1a",
    "darkBorderColor": "#1e293b"
  },
  "dark": {
    "bg": "#5B21B6",
    "borderColor": "#8B5CF6",
    "textColor": "#E9D5FF",
    "headerTextColor": "#FDF2F8",
    "footerBg": "#4C1D95",
    "borderRadius": 24,
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