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
    "stepBorder": "#FDE68A",
    "activeBg": "#FEF3C7",
    "activeBorder": "#92400E",
    "activeText": "#B45309",
    "completedBg": "#16A34A",
    "completedBorder": "#16A34A",
    "completedText": "#047857",
    "inactiveText": "#92400E"
  },
  "dark": {
    "stepBg": "#78350F",
    "stepBorder": "#B45309",
    "activeBg": "#92400E",
    "activeBorder": "#FCD34D",
    "activeText": "#FEF3C7",
    "completedBg": "#4ADE80",
    "completedBorder": "#4ADE80",
    "completedText": "#a7f3d0",
    "inactiveText": "#FDE68A"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.