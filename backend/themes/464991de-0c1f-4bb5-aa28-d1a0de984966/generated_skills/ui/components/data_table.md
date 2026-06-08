---
name: data_table
category: components
description: Detailed grid for records with sorting and search
intent_keywords: ["table", "grid", "list", "rows", "records"]
schema: columns: array, data: array
---

# Data Table Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Data Table:
```json
{
  "light": {
    "bg": "#F8F9FA",
    "borderColor": "#DADCE0",
    "headerText": "#eb0000",
    "rowText": "#202124",
    "rowBorder": "#DADCE0",
    "borderRadius": 4,
    "headerTypography": "xs",
    "rowTypography": "xs",
    "darkBg": "#1a1a1a",
    "darkBorderColor": "#1e293b",
    "darkHeaderText": "#94a3b8",
    "darkRowText": "#cbd5e1",
    "darkRowBorder": "#262626",
    "headerContent": "Column Header",
    "paddingY": 0,
    "paddingX": 0
  },
  "dark": {
    "bg": "#303134",
    "borderColor": "#5F6368",
    "headerText": "#9AA0A6",
    "rowText": "#E8EAED",
    "rowBorder": "#5F6368",
    "borderRadius": 4,
    "headerTypography": "xs",
    "rowTypography": "p",
    "darkBg": "#1a1a1a",
    "darkBorderColor": "#1e293b",
    "darkHeaderText": "#94a3b8",
    "darkRowText": "#cbd5e1",
    "darkRowBorder": "#262626",
    "headerContent": "Column Header"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

**Table Typography Rules**:
- You must apply `headerText` color from the Component-Specific Tokens as the inline style for all table header (`<th>`) text.
- You must apply `rowText` color from the Component-Specific Tokens as the inline style for all standard data row (`<td>`) text.
- For headers, you MUST look up the typography token referenced by `headerTypography` (e.g. `xs` or `small`) in `visual_spec.skill.md` and apply its exact `fontSize`, `fontWeight`, etc.
- For rows, you MUST look up the base typography token referenced by `rowTypography` in `visual_spec.skill.md` and apply its exact `fontSize`, `fontWeight`, etc.

**Progress Bar Rules**:
- CRITICAL: Do NOT add arbitrary progress bars to table cells. Progress bars are ONLY permissible if the underlying data has a known, explicit upper bound, target, or goal value. If these known bounds are absent, progress bars are strictly forbidden.

## Usage Context

**Best Use Cases:** 
- Displaying dense tabular data, sortable lists, and bulk record management.

**User Interactions:** 
- Require frozen headers to maintain context during scroll.
- Require active column sorting capabilities.

**Sub-variation (Pivot Table):** 
- Provide configuration for cross-tabulation when comparing dimensions against multiple categorizations.