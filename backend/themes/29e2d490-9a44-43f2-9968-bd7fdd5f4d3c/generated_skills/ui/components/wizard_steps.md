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
    "stepBg": "#F0F0F0",
    "stepBorder": "#000000",
    "activeBg": "#00FFFF",
    "activeBorder": "#FF003C",
    "activeText": "#000000",
    "completedBg": "#00FF41",
    "completedBorder": "#00FF41",
    "completedText": "#047857",
    "inactiveText": "#333333"
  },
  "dark": {
    "stepBg": "#121212",
    "stepBorder": "#00FF41",
    "activeBg": "#FF003C",
    "activeBorder": "#00FF41",
    "activeText": "#FFFFFF",
    "completedBg": "#00FF41",
    "completedBorder": "#00FF41",
    "completedText": "#a7f3d0",
    "inactiveText": "#008F11"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.