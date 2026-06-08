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
      "bg": "#FFFFFF",
      "borderColor": "#FED7AA",
      "focusRingColor": "#3b82f6",
      "borderRadius": 16,
      "paddingX": 20,
      "paddingY": 10,
      "placeholder": "Enter text...",
      "textColor": "#7C2D12",
      "typographyVariant": "p",
      "darkBg": "#121212",
      "darkBorderColor": "#1e293b"
    },
    "dark": {
      "bg": "#7C2D12",
      "borderColor": "#EA580C",
      "focusRingColor": "#3b82f6",
      "borderRadius": 16,
      "paddingX": 20,
      "paddingY": 10,
      "placeholder": "Enter text...",
      "textColor": "#FFF7ED",
      "typographyVariant": "p",
      "darkBg": "#121212",
      "darkBorderColor": "#1e293b"
    }
  },
  "filterChip": {
    "light": {
      "bg": "#FFEDD5",
      "borderColor": "#EA580C",
      "textColor": "#C2410C",
      "borderRadius": 9999
    },
    "dark": {
      "bg": "#C2410C",
      "borderColor": "#FB923C",
      "textColor": "#FFEDD5",
      "borderRadius": 9999
    }
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for building robust filtering panels to slice datasets. 1. The 'Add Filter' button should show a list of fields available in the data, letting the user pick a field to filter on. 2. When the field is picked, the UI for the filter must match the data type for the field (text, number, date, etc.) and create the proper filter UI for that type. 3. Text fields should show a list of values when clicked into and allow searching for a field value, showing matching results as you type. 4. Number fields should allow entering a specific number, or adjusting a range slider. 5. Date filters should show a preset list of date ranges (e.g. today, last 7 days, last 30 days) but also explicitly allow setting a custom date range.