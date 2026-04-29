---
name: chat_sidebar
category: components
description: Sidebar conversational interface alongside main content
intent_keywords: ["chat", "sidebar", "gemini", "ai", "assistant", "panel", "message"]
schema: messages: array, onSendMessage: function
---

# Gemini Sidebar Chat Skill

## Visual Specifications
For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for Gemini Sidebar Chat:
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
Use for building a contextual AI assistant in a dismissible or pinned sidebar where a user can enter a prompt and get results vertically while viewing the main application.