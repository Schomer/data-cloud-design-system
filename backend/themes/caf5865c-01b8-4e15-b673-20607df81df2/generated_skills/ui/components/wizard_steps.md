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
    "stepBorder": "#FBCFE8",
    "activeBg": "#FCE7F3",
    "activeBorder": "#F472B6",
    "activeText": "#DB2777",
    "completedBg": "#34D399",
    "completedBorder": "#34D399",
    "completedText": "#047857",
    "inactiveText": "#F472B6"
  },
  "dark": {
    "stepBg": "#5B21B6",
    "stepBorder": "#8B5CF6",
    "activeBg": "#7C3AED",
    "activeBorder": "#F472B6",
    "activeText": "#F5D0FE",
    "completedBg": "#6EE7B7",
    "completedBorder": "#6EE7B7",
    "completedText": "#a7f3d0",
    "inactiveText": "#E9D5FF"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.