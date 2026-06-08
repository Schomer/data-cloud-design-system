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
    "stepBg": "#F8F9FA",
    "stepBorder": "#DADCE0",
    "activeBg": "#E8F0FE",
    "activeBorder": "#1A73E8",
    "activeText": "#1967D2",
    "completedBg": "#1E8E3E",
    "completedBorder": "#1E8E3E",
    "completedText": "#047857",
    "inactiveText": "#5F6368"
  },
  "dark": {
    "stepBg": "#303134",
    "stepBorder": "#5F6368",
    "activeBg": "#1A73E8",
    "activeBorder": "#8AB4F8",
    "activeText": "#E8F0FE",
    "completedBg": "#81C995",
    "completedBorder": "#81C995",
    "completedText": "#a7f3d0",
    "inactiveText": "#9AA0A6"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.