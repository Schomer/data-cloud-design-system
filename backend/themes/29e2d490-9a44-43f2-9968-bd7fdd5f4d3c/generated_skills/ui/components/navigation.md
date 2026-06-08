---
name: navigation
category: components
description: Sidebar and Top-bar navigation items
intent_keywords: ["nav", "menu", "sidebar", "link", "active"]
schema: items: array, activeId: string
---

# Navigation Systems Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Navigation Systems:
```json
{
  "light": {
    "bg": "#F0F0F0",
    "borderColor": "#000000",
    "activeText": "#FF003C",
    "activeBorder": "#FF003C",
    "inactiveText": "#333333",
    "hoverText": "#000000",
    "defaultText": "Nav Item",
    "typographyVariant": "small",
    "darkActiveText": "#60a5fa",
    "darkInactiveText": "#cbd5e1",
    "darkHoverText": "#e2e8f0"
  },
  "dark": {
    "bg": "#121212",
    "borderColor": "#00FF41",
    "activeText": "#00FF41",
    "activeBorder": "#00FF41",
    "inactiveText": "#008F11",
    "hoverText": "#00FF41",
    "defaultText": "Nav Item",
    "typographyVariant": "small",
    "darkActiveText": "#60a5fa",
    "darkInactiveText": "#cbd5e1",
    "darkHoverText": "#e2e8f0"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

**Navigation Layout & Styling Rules**:
- **Wayfinding (Breadcrumbs & Tabs)**: 
  - **Tabs**: Use `borderColor` for the bottom border of the tab container, `activeBorder` for the bottom border of the selected tab, `activeText` for the text color of the selected tab, `inactiveText` for the default text color of unselected tabs, and `hoverText` on hover.
  - **Breadcrumbs**: Use `inactiveText` for breadcrumb previous path values, `hoverText` on hover, and `activeText` for the current page value.

## Usage Context
Use for primary app routing, application sidebar menus, and contextual section navigation.