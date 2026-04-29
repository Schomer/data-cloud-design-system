---
name: chat_fullscreen
category: components
description: Full screen AI conversational view
intent_keywords: ["chat", "gemini", "ai", "conversation", "fullscreen", "message"]
schema: messages: array, onSendMessage: function
---

# Gemini Full Screen Chat Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Gemini Full Screen Chat:
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
Use for dedicated, full-screen chat interfaces simulating interaction with Gemini.