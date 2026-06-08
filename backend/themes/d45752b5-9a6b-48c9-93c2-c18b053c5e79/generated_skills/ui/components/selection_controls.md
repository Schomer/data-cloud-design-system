---
name: selection_controls
category: components
description: Checkboxes, Radios, Toggles, and Segmented switches
intent_keywords: ["checkbox", "radio", "toggle", "switch", "segmented"]
schema: options: array, value: string|boolean, multi: boolean
---

# Selection Controls Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Selection Controls:
```json
{
  "borderRadius": {
    "light": 6,
    "dark": 6
  },
  "switch": {
    "light": {
      "bgOn": "#5E81AC",
      "bgOff": "#D8DEE9",
      "circleOn": "#FFFFFF",
      "circleOff": "#FFFFFF"
    },
    "dark": {
      "bgOn": "#88C0D0",
      "bgOff": "#4C566A",
      "circleOn": "#2E3440",
      "circleOff": "#3B4252"
    }
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for binary toggles, multiple choice selections, and dataset filtering options. Segmented controls for switching between views (like Gaussian Density and Histogram) must actually change the view to show the selected option. Features need to work, period.