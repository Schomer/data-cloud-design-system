---
name: filters
category: components
description: Various filter controls for data including text fields, number fields, and date ranges.
intent_keywords: ["filter", "query", "slice", "search", "date range", "number", "text"]
schema: filters: array, onChange: function
---

# Filter Controls Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Filter Controls:
```json
{
  "input": {
    "light": {
      "bg": "#F8F9FA",
      "borderColor": "#DADCE0",
      "focusRingColor": "#3b82f6",
      "borderRadius": 4,
      "paddingX": 12,
      "paddingY": 8,
      "placeholder": "Enter text...",
      "textColor": "#202124",
      "typographyVariant": "p",
      "darkBg": "#121212",
      "darkBorderColor": "#1e293b"
    },
    "dark": {
      "bg": "#303134",
      "borderColor": "#5F6368",
      "focusRingColor": "#3b82f6",
      "borderRadius": 4,
      "paddingX": 12,
      "paddingY": 8,
      "placeholder": "Enter text...",
      "textColor": "#E8EAED",
      "typographyVariant": "p",
      "darkBg": "#121212",
      "darkBorderColor": "#1e293b"
    }
  },
  "filterChip": {
    "light": {
      "bg": "#E8F0FE",
      "borderColor": "#1A73E8",
      "textColor": "#1967D2",
      "borderRadius": 4
    },
    "dark": {
      "bg": "#1A73E8",
      "borderColor": "#8AB4F8",
      "textColor": "#E8F0FE",
      "borderRadius": 4
    }
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for building robust filtering panels to slice datasets. 1. The 'Add Filter' button should show a list of fields available in the data, letting the user pick a field to filter on. 2. When the field is picked, the UI for the filter must match the data type for the field (text, number, date, etc.) and create the proper filter UI for that type. 3. Text fields should show a list of values when clicked into and allow searching for a field value, showing matching results as you type. 4. Number fields should allow entering a specific number, or adjusting a range slider. 5. Date filters should show a preset list of date ranges (e.g. today, last 7 days, last 30 days) but also explicitly allow setting a custom date range.