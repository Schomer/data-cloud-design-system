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
    "stepBorder": "#BAE6FD",
    "activeBg": "#E0F2FE",
    "activeBorder": "#0284C7",
    "activeText": "#0369A1",
    "completedBg": "#059669",
    "completedBorder": "#059669",
    "completedText": "#047857",
    "inactiveText": "#0284C7"
  },
  "dark": {
    "stepBg": "#0C4A6E",
    "stepBorder": "#0369A1",
    "activeBg": "#0284C7",
    "activeBorder": "#38BDF8",
    "activeText": "#E0F2FE",
    "completedBg": "#34D399",
    "completedBorder": "#34D399",
    "completedText": "#a7f3d0",
    "inactiveText": "#BAE6FD"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.