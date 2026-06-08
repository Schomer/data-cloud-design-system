---
name: cards_kpi
category: components
description: Visual containers for high-level metrics and summaries
intent_keywords: ["metric", "kpi", "card", "summary", "stat"]
schema: title: string, value: string|number, trend: string
---

# KPI Cards Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for KPI Cards:
```json
{
  "light": {
    "bg": "#F4EFF4",
    "borderColor": "#CAC4D0",
    "borderRadius": 16,
    "padding": 24,
    "titleColor": "#49454F",
    "valueColor": "#6750A4",
    "defaultTitle": "KPI Metric",
    "titleTypography": "xs",
    "valueTypography": "h2",
    "darkBg": "#1a1a1a",
    "darkBorderColor": "#1e293b",
    "darkTitleColor": "#94a3b8",
    "darkValueColor": "#3b82f6"
  },
  "dark": {
    "bg": "#2B2930",
    "borderColor": "#938F99",
    "borderRadius": 16,
    "padding": 24,
    "titleColor": "#CAC4D0",
    "valueColor": "#D0BCFF",
    "defaultTitle": "KPI Metric",
    "titleTypography": "xs",
    "valueTypography": "h2",
    "darkBg": "#1a1a1a",
    "darkBorderColor": "#1e293b",
    "darkTitleColor": "#94a3b8",
    "darkValueColor": "#3b82f6"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

**Trend Indicator Rules**:
- **Positive Trend**: Use the `successText` color hex from `visual_spec.skill.md` and an upward-pointing arrow icon next to the percentage/value change.
- **Negative Trend**: Use the `errorText` color hex from `visual_spec.skill.md` and a downward-pointing arrow icon.
- **Stable Trend**: Use the `text_secondary` color hex and a standard dash or sideways arrow to indicate no significant change.
- **Placement**: Trend indicators should be placed immediately adjacent to the primary KPI value or on a dedicated line directly below it, using a smaller typography variant (e.g., `small` or `xs`).

**Progress Bar Rules**:
- CRITICAL: Do NOT add arbitrary progress bars to KPI cards or any other component. Progress bars are ONLY permissible if the underlying data has a known, explicit upper bound, target, or goal value to accurately determine progress. If these known bounds are absent, progress bars are strictly forbidden.

**Typography & Text Color Rules**:
- You must apply `titleColor` from the Component-Specific Tokens as the inline style for the card's title text.
- CRITICAL: You MUST apply `valueColor` from the Component-Specific Tokens uniformly to ALL main KPI values. DO NOT apply individual semantic colors to the main KPI values. Every single KPI value MUST use the exact same `valueColor`.
- For the title's font size and weight, you MUST look up the base typography token referenced by `titleTypography` in the `visual_spec.skill.md` typography section and apply its exact `fontSize`, `fontWeight`, etc.
- For the value's font size and weight, you MUST look up the base typography token referenced by `valueTypography` in the `visual_spec.skill.md` typography section and apply its exact `fontSize`, `fontWeight`, etc.

## Usage Context

**Best Use Cases:** 
- Displaying high-level metrics, overarching summary statistics, and dashboard entry points.

**Best Default States:** 
- Must prominently display the primary value.
- Mandate Period-over-Period (PoP) change indicators explicitly tied to semantic colors (green/red) and directional arrows.

**User Interactions:** 
- Optional hover tooltips to show the exact baseline date ranges used for comparisons.
- Clickable entire-card behavior to drill-down into detailed associated report pages.