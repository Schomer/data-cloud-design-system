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
    "bg": "#FFFFFF",
    "borderColor": "#BBF7D0",
    "focusRingColor": "#3b82f6",
    "borderRadius": 12,
    "paddingX": 16,
    "paddingY": 12,
    "placeholder": "Enter text...",
    "textColor": "#14532D",
    "typographyVariant": "p",
    "darkBg": "#121212",
    "darkBorderColor": "#1e293b"
  },
  "dark": {
    "bg": "#14532D",
    "borderColor": "#16A34A",
    "focusRingColor": "#3b82f6",
    "borderRadius": 12,
    "paddingX": 16,
    "paddingY": 12,
    "placeholder": "Enter text...",
    "textColor": "#F0FDF4",
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