---
name: chat_field
category: components
description: Inline AI command field to instruct the application
intent_keywords: ["chat", "command", "field", "gemini", "ai", "prompt", "input"]
schema: onSendMessage: function, placeholder: string
---

# Gemini Command Field Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Gemini Command Field:
```json
{
  "light": {},
  "dark": {}
}
```


## Recommended Implementation Pattern
This component should be rendered using the Cloud Data App Skills guidelines. 
It inherits global themes from `theme.md`.

## Usage Context
Use for a search-like input field where the user enters a prompt to update their application state or instruct the app with commands. It does not display a chat history.