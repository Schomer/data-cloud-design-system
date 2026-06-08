---
name: button
category: components
description: Primary, Secondary, Destructive, and Ghost action triggers
intent_keywords: ["click", "submit", "action", "trigger", "button"]
schema: label: string, variant: 'primary'|'secondary'|'destructive'|'ghost', disabled: boolean
---

# Button Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Button:
```json
{
  "light": {
    "primaryBg": "#1A73E8",
    "primaryHoverBg": "#E8F0FE",
    "primaryText": "#FFFFFF",
    "primaryLabel": "Primary Action",
    "secondaryBg": "#F8F9FA",
    "secondaryHoverBg": "#f8fafc",
    "secondaryText": "#202124",
    "secondaryBorder": "#DADCE0",
    "secondaryLabel": "Secondary",
    "destructiveBg": "#D93025",
    "destructiveHoverBg": "#a91439",
    "destructiveText": "#ffffff",
    "destructiveLabel": "Destructive",
    "ghostText": "#598dc5",
    "ghostHoverBg": "#e9edf1",
    "ghostLabel": "Ghost Button",
    "borderRadius": 4,
    "paddingX": 13,
    "paddingY": 5,
    "fontWeight": "500",
    "typographyVariant": "xs",
    "fontSize": 14,
    "fontFamily": "'Inter', sans-serif",
    "letterSpacing": "normal",
    "textTransform": "none",
    "secondaryDarkBg": "#262626",
    "secondaryDarkHoverBg": "#1e293b",
    "secondaryDarkText": "#e2e8f0",
    "secondaryDarkBorder": "#334155",
    "ghostDarkText": "#60a5fa",
    "ghostDarkHoverBg": "#1e3a8a"
  },
  "dark": {
    "primaryBg": "#8AB4F8",
    "primaryHoverBg": "#1A73E8",
    "primaryText": "#202124",
    "primaryLabel": "Primary Action",
    "secondaryBg": "#303134",
    "secondaryHoverBg": "#122940",
    "secondaryText": "#E8EAED",
    "secondaryBorder": "#5F6368",
    "secondaryLabel": "Secondary",
    "destructiveBg": "#F28B82",
    "destructiveHoverBg": "#610f24",
    "destructiveText": "#cfcfcf",
    "destructiveLabel": "Destructive",
    "ghostText": "#9ea5ae",
    "ghostHoverBg": "#eff6ff",
    "ghostLabel": "Ghost Button",
    "borderRadius": 4,
    "paddingX": 16,
    "paddingY": 8,
    "fontWeight": "500",
    "typographyVariant": "buttonText",
    "fontSize": 14,
    "fontFamily": "'Inter', sans-serif",
    "letterSpacing": "normal",
    "textTransform": "none",
    "secondaryDarkBg": "#262626",
    "secondaryDarkHoverBg": "#1e293b",
    "secondaryDarkText": "#e2e8f0",
    "secondaryDarkBorder": "#334155",
    "ghostDarkText": "#60a5fa",
    "ghostDarkHoverBg": "#1e3a8a"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for primary actions, form submissions, state transitions, and interactive triggers.