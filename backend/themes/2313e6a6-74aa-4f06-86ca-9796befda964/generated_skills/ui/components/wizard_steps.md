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
    "stepBg": "#F4EFF4",
    "stepBorder": "#CAC4D0",
    "activeBg": "#EADDFF",
    "activeBorder": "#6750A4",
    "activeText": "#21005D",
    "completedBg": "#386A20",
    "completedBorder": "#386A20",
    "completedText": "#047857",
    "inactiveText": "#49454F"
  },
  "dark": {
    "stepBg": "#2B2930",
    "stepBorder": "#938F99",
    "activeBg": "#4A4458",
    "activeBorder": "#D0BCFF",
    "activeText": "#E8DEF8",
    "completedBg": "#9CD67D",
    "completedBorder": "#9CD67D",
    "completedText": "#a7f3d0",
    "inactiveText": "#CAC4D0"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.