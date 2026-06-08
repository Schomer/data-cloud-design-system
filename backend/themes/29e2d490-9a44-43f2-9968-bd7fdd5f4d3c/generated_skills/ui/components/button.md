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
    "primaryBg": "#FF003C",
    "primaryHoverBg": "#00FFFF",
    "primaryText": "#FFFFFF",
    "primaryLabel": "Primary Action",
    "secondaryBg": "#F0F0F0",
    "secondaryHoverBg": "#f8fafc",
    "secondaryText": "#000000",
    "secondaryBorder": "#000000",
    "secondaryLabel": "Secondary",
    "destructiveBg": "#FF0000",
    "destructiveHoverBg": "#a91439",
    "destructiveText": "#ffffff",
    "destructiveLabel": "Destructive",
    "ghostText": "#598dc5",
    "ghostHoverBg": "#e9edf1",
    "ghostLabel": "Ghost Button",
    "borderRadius": 0,
    "paddingX": 20,
    "paddingY": 8,
    "fontWeight": "500",
    "typographyVariant": "buttonText",
    "fontSize": 14,
    "fontFamily": "'Courier New', Courier, monospace",
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
    "primaryBg": "#00FF41",
    "primaryHoverBg": "#FF003C",
    "primaryText": "#0D0208",
    "primaryLabel": "Primary Action",
    "secondaryBg": "#121212",
    "secondaryHoverBg": "#122940",
    "secondaryText": "#00FF41",
    "secondaryBorder": "#00FF41",
    "secondaryLabel": "Secondary",
    "destructiveBg": "#FF003C",
    "destructiveHoverBg": "#610f24",
    "destructiveText": "#cfcfcf",
    "destructiveLabel": "Destructive",
    "ghostText": "#9ea5ae",
    "ghostHoverBg": "#eff6ff",
    "ghostLabel": "Ghost Button",
    "borderRadius": 0,
    "paddingX": 20,
    "paddingY": 8,
    "fontWeight": "500",
    "typographyVariant": "buttonText",
    "fontSize": 14,
    "fontFamily": "'Courier New', Courier, monospace",
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