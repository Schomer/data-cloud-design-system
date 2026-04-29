import json

with open("backend/specs.json") as f:
    specs = json.load(f)
with open("backend/chart_colors.json") as f:
    chart_colors = json.load(f)

theme_manifest = {
    "theme": "dark",
    "colors": {
        "light": {
            "background_primary": specs.get("light", {}).get("card", {}).get("bg", "#ffffff"),
            "background_secondary": specs.get("light", {}).get("card", {}).get("borderColor", "#e2e8f0"),
            "text_primary": specs.get("light", {}).get("typography", {}).get("h1", {}).get("color", "#0f172a"),
            "text_secondary": specs.get("light", {}).get("typography", {}).get("p", {}).get("color", "#475569"),
            "border": specs.get("light", {}).get("card", {}).get("borderColor", "#e2e8f0"),
            "chart_palette": chart_colors.get("light", [])
        },
        "dark": {
            "background_primary": specs.get("dark", {}).get("card", {}).get("bg", "#121212"),
            "background_secondary": specs.get("dark", {}).get("card", {}).get("borderColor", "#1e293b"),
            "text_primary": specs.get("dark", {}).get("typography", {}).get("h1", {}).get("color", "#f8fafc"),
            "text_secondary": specs.get("dark", {}).get("typography", {}).get("p", {}).get("color", "#cbd5e1"),
            "border": specs.get("dark", {}).get("card", {}).get("borderColor", "#1e293b"),
            "chart_palette": chart_colors.get("dark", [])
        }
    },
    "typography": {
        "font_family": "Inter, sans-serif"
    }
}

theme_content = f"""---
name: theme
description: Global design tokens, typography, and color palettes
---

# Theme Configuration

You MUST use these exact design tokens for Light/Dark modes.

## Guidelines
- **background_primary**: Use for the main application background.
- **background_secondary**: Use for alternate row colors, card backgrounds, or sidebars.
- **text_primary**: Use for primary text like headings and main content.
- **text_secondary**: Use for secondary text like subtitles, descriptions, or less important info.
- **border**: Use for borders of cards, tables, inputs, and dividers.
- **chart_palette**: Use these hex codes sequentially for visualization colors.

## Raw Tokens
```json
{json.dumps(theme_manifest, indent=2)}
```
"""

with open("generated_skills/theme.md", "w") as f:
    f.write(theme_content)

print("theme.md generated successfully")
