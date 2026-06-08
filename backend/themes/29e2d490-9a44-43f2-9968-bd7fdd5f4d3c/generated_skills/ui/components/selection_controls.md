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
    "light": 0,
    "dark": 0
  },
  "switch": {
    "light": {
      "bgOn": "#FF003C",
      "bgOff": "#000000",
      "circleOn": "#FFFFFF",
      "circleOff": "#F0F0F0"
    },
    "dark": {
      "bgOn": "#00FF41",
      "bgOff": "#00FF41",
      "circleOn": "#0D0208",
      "circleOff": "#121212"
    }
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for binary toggles, multiple choice selections, and dataset filtering options. Segmented controls for switching between views (like Gaussian Density and Histogram) must actually change the view to show the selected option. Features need to work, period.