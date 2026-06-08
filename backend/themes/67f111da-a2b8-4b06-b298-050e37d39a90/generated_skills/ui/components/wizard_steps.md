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
    "stepBorder": "#D7D7D1",
    "activeBg": "#E2E2DC",
    "activeBorder": "#FF79C6",
    "activeText": "#6272A4",
    "completedBg": "#50FA7B",
    "completedBorder": "#50FA7B",
    "completedText": "#047857",
    "inactiveText": "#44475A"
  },
  "dark": {
    "stepBg": "#44475A",
    "stepBorder": "#6272A4",
    "activeBg": "#6272A4",
    "activeBorder": "#FF79C6",
    "activeText": "#F8F8F2",
    "completedBg": "#50FA7B",
    "completedBorder": "#50FA7B",
    "completedText": "#a7f3d0",
    "inactiveText": "#BFBFBF"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.