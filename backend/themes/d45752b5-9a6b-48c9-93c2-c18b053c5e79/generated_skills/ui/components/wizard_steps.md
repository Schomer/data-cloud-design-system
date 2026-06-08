---
name: wizard_steps
category: components
description: Progress indicators for multi-step workflows
intent_keywords: ["wizard", "step", "progress", "workflow", "sequence"]
schema: steps: array, currentStep: number
---

# Wizard Steps Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Wizard Steps:
```json
{
  "light": {
    "stepBg": "#FFFFFF",
    "stepBorder": "#D8DEE9",
    "activeBg": "#E5E9F0",
    "activeBorder": "#5E81AC",
    "activeText": "#4C566A",
    "completedBg": "#A3BE8C",
    "completedBorder": "#A3BE8C",
    "completedText": "#047857",
    "inactiveText": "#4C566A"
  },
  "dark": {
    "stepBg": "#3B4252",
    "stepBorder": "#4C566A",
    "activeBg": "#434C5E",
    "activeBorder": "#88C0D0",
    "activeText": "#ECEFF4",
    "completedBg": "#A3BE8C",
    "completedBorder": "#A3BE8C",
    "completedText": "#a7f3d0",
    "inactiveText": "#E5E9F0"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.