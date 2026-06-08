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
    "stepBorder": "#D2CEB6",
    "activeBg": "#E6DB74",
    "activeBorder": "#F92672",
    "activeText": "#272822",
    "completedBg": "#A6E22E",
    "completedBorder": "#A6E22E",
    "completedText": "#047857",
    "inactiveText": "#75715E"
  },
  "dark": {
    "stepBg": "#3E3D32",
    "stepBorder": "#75715E",
    "activeBg": "#49483E",
    "activeBorder": "#A6E22E",
    "activeText": "#F8F8F2",
    "completedBg": "#A6E22E",
    "completedBorder": "#A6E22E",
    "completedText": "#a7f3d0",
    "inactiveText": "#E6DB74"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.