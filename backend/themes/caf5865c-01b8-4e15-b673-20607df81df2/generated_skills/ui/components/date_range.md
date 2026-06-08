---
name: date_range
category: components
description: Custom date range selector and temporal controls
intent_keywords: ["date", "range", "time", "calendar", "horizon"]
schema: startDate: string, endDate: string, onChange: function
---

# Date Range Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Date Range:
```json
{
  "light": {
    "bg": "#FFFFFF",
    "borderColor": "#FBCFE8",
    "focusRingColor": "#3b82f6",
    "borderRadius": 24,
    "paddingX": 28,
    "paddingY": 12,
    "placeholder": "Enter text...",
    "textColor": "#831843",
    "typographyVariant": "p",
    "darkBg": "#121212",
    "darkBorderColor": "#1e293b"
  },
  "dark": {
    "bg": "#5B21B6",
    "borderColor": "#8B5CF6",
    "focusRingColor": "#3b82f6",
    "borderRadius": 24,
    "paddingX": 28,
    "paddingY": 12,
    "placeholder": "Enter text...",
    "textColor": "#FDF2F8",
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
Use for filtering datasets by date, selecting time horizons, and interacting with temporal charts. Dates at the top of a dashboard generally change all of the data under them. Features need to work, period.