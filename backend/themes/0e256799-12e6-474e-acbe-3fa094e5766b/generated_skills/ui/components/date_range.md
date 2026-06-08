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
    "borderColor": "#BAE6FD",
    "focusRingColor": "#3b82f6",
    "borderRadius": 8,
    "paddingX": 14,
    "paddingY": 10,
    "placeholder": "Enter text...",
    "textColor": "#0C4A6E",
    "typographyVariant": "p",
    "darkBg": "#121212",
    "darkBorderColor": "#1e293b"
  },
  "dark": {
    "bg": "#0C4A6E",
    "borderColor": "#0369A1",
    "focusRingColor": "#3b82f6",
    "borderRadius": 8,
    "paddingX": 14,
    "paddingY": 10,
    "placeholder": "Enter text...",
    "textColor": "#F0F9FF",
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