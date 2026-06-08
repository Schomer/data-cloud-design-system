---
name: input_fields
category: components
description: Text, Number, Email, and Search input controls
intent_keywords: ["text", "input", "form", "search", "field", "type"]
schema: label: string, placeholder: string, value: string, type: string
---

# Input Fields Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Input Fields:
```json
{
  "light": {
    "bg": "#F4EFF4",
    "borderColor": "#CAC4D0",
    "focusRingColor": "#3b82f6",
    "borderRadius": 16,
    "paddingX": 20,
    "paddingY": 10,
    "placeholder": "Enter text...",
    "textColor": "#1D1B20",
    "typographyVariant": "p",
    "darkBg": "#121212",
    "darkBorderColor": "#1e293b"
  },
  "dark": {
    "bg": "#2B2930",
    "borderColor": "#938F99",
    "focusRingColor": "#3b82f6",
    "borderRadius": 16,
    "paddingX": 20,
    "paddingY": 10,
    "placeholder": "Enter text...",
    "textColor": "#E6E0E9",
    "typographyVariant": "p",
    "darkBg": "#121212",
    "darkBorderColor": "#1e293b"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for capturing user textual input data, search queries, and numerical values in forms.