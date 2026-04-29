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
    "stepBg": "#ffffff",
    "stepBorder": "#e2e8f0",
    "activeBg": "#ebf5ff",
    "activeBorder": "#89acd2",
    "activeText": "#457bb5",
    "completedBg": "#ecfdf5",
    "completedBorder": "#10b981",
    "completedText": "#047857",
    "inactiveText": "#64748b"
  },
  "dark": {
    "stepBg": "#121212",
    "stepBorder": "#1e293b",
    "activeBg": "#1e3a8a",
    "activeBorder": "#3b82f6",
    "activeText": "#bfdbfe",
    "completedBg": "#064e3b",
    "completedBorder": "#10b981",
    "completedText": "#a7f3d0",
    "inactiveText": "#94a3b8"
  }
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.