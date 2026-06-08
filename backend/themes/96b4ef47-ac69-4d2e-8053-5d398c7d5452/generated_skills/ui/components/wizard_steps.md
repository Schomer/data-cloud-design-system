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
    "stepBorder": "#000000",
    "activeBg": "#E5E5E5",
    "activeBorder": "#0000FF",
    "activeText": "#000000",
    "completedBg": "#008000",
    "completedBorder": "#008000",
    "completedText": "#047857",
    "inactiveText": "#333333"
  },
  "dark": {
    "stepBg": "#000000",
    "stepBorder": "#FFFFFF",
    "activeBg": "#333333",
    "activeBorder": "#FFFF00",
    "activeText": "#FFFFFF",
    "completedBg": "#00FF00",
    "completedBorder": "#00FF00",
    "completedText": "#a7f3d0",
    "inactiveText": "#CCCCCC"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.