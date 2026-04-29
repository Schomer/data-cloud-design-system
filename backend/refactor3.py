import os
import re

file_path = "main.py"
with open(file_path, "r") as f:
    content = f.read()

# 1. Replace directories
content = content.replace(
'''    catalog_dir = export_dir / "catalog"
    
    # 1. Prepare directories (No longer wiping out the old directory)
    export_dir.mkdir(parents=True, exist_ok=True)
    catalog_dir.mkdir(parents=True, exist_ok=True)
    
    components_dir = catalog_dir / "components"
    visualizations_dir = catalog_dir / "visualizations"
    components_dir.mkdir(parents=True, exist_ok=True)
    visualizations_dir.mkdir(parents=True, exist_ok=True)''',
'''    ui_dir = export_dir / "ui"
    design_dir = export_dir / "design"
    data_dir = export_dir / "data"
    
    # 1. Prepare directories (No longer wiping out the old directory)
    export_dir.mkdir(parents=True, exist_ok=True)
    ui_dir.mkdir(parents=True, exist_ok=True)
    design_dir.mkdir(parents=True, exist_ok=True)
    data_dir.mkdir(parents=True, exist_ok=True)
    
    components_dir = ui_dir / "components"
    charts_dir = ui_dir / "charts"
    components_dir.mkdir(parents=True, exist_ok=True)
    charts_dir.mkdir(parents=True, exist_ok=True)'''
)

# 2. Replace theme generation
content = content.replace(
'''    theme_content = f"""---
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
    theme_path = export_dir / "theme.md"
    with open(theme_path, "w") as f:
        f.write(theme_content)
    files_to_zip.append(theme_path)''',
'''    theme_content = f"""---
name: visual_spec
description: Global design tokens, typography, color palettes, and strict theming rules
---

# Visual Specification & Theme Configuration

You MUST use these exact design tokens for Light/Dark modes.

## Rules for Styling & Theming
1.  **Read and Apply Exact Hex Codes**: This is CRITICAL. You MUST NOT use generic Tailwind classes like `bg-white`, `dark:bg-slate-900`, `text-gray-100`, etc. for structural colors. Instead, you MUST look up the exact hex codes for `background_primary`, `background_secondary`, `text_primary`, `text_secondary`, and `border`, and apply them as explicit Tailwind arbitrary values.
2.  **Support Both Light and Dark Modes**: You must provide both the light and dark mode hex code for every color. Example: `<div className="bg-[#ffffff] dark:bg-[#1a1a1a] border-[#e2e8f0] dark:border-[#1e293b] text-[#0f172a] dark:text-[#f8fafc]">`.
3.  **100% Standalone Code**: The generated React code must be completely standalone. Do NOT rely on custom CSS variables. Every color must be an explicit arbitrary value derived strictly from this specification.
4.  **App Container Background**: Look up the `background_primary` hex values for both light and dark modes and apply them to the root `className` (e.g. `min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a]`).

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
    theme_path = design_dir / "visual_spec.skill.md"
    with open(theme_path, "w") as f:
        f.write(theme_content)
    files_to_zip.append(theme_path)'''
)

# 3. Replace Shared Visuals path
content = content.replace("shared_path = visualizations_dir / \"shared_visuals.md\"", "shared_path = charts_dir / \"shared_visuals.md\"")

# 4. Replace Category Dir assignment
content = content.replace(
'''        if skill['category'] == 'visualizations':
            specs_block = "See `catalog/visualizations/shared_visuals.md` for shared color, grid, and background attributes."
            category_dir = visualizations_dir
        else:
            specs_block = f"```json\\n{json.dumps(skill.get('specifications', {}), indent=2)}\\n```"
            category_dir = components_dir''',
'''        if skill['category'] == 'visualizations':
            specs_block = "See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes."
            category_dir = charts_dir
        else:
            specs_block = f"```json\\n{json.dumps(skill.get('specifications', {}), indent=2)}\\n```"
            category_dir = components_dir'''
)

# 5. Fix Router output
content = content.replace(
'''        router_content += f"| {skill['category'].title()} | {intent_str} | {skill['description']} | catalog/{skill['category']}/{skill['id']}.md |\\n"''',
'''        folder = "charts" if skill['category'] == 'visualizations' else "components"
        router_content += f"| {skill['category'].title()} | {intent_str} | {skill['description']} | ui/{folder}/{skill['id']}.md |\\n"'''
)

# 6. Change Architect loading to load parts instead
content = content.replace(
'''    # 4.5 Add Architect file and Antigravity rules/workflows
    architect_path = export_dir / "app_architect.md"
    if architect_path.exists():
        files_to_zip.append(architect_path)''',
'''    # 4.5 Add manual skill files that are not python-generated
    for static_file in ["app_approach.skill.md", "orchestrator.skill.md"]:
        path = export_dir / static_file
        if path.exists():
            files_to_zip.append(path)
    for static_file in ["layout.skill.md"]:
        path = design_dir / static_file
        if path.exists():
            files_to_zip.append(path)
    for static_file in ["connect.skill.md", "clean.skill.md", "query.skill.md", "insights.skill.md"]:
        path = data_dir / static_file
        if path.exists():
            files_to_zip.append(path)'''
)

content = content.replace(
'''1. Read `theme.md` to understand the visual design constraints and instructions.
2. Read `app_architect.md` to understand the required file structure and application architecture.
3. Read `router.md` to map the requested feature to the correct layout.
4. Inspect the `catalog` folder to see what components are available to you.
5. Only after reading these files should you begin making an implementation plan or writing code.''',
'''1. Read `orchestrator.skill.md` and `app_approach.skill.md` to understand user archetype and workflow.
2. Read `design/visual_spec.skill.md` and `design/layout.skill.md` for styling constraints and layouts.
3. Read `router.md` to map the requested feature to the correct UI component skills.
4. Inspect the `ui/` and `data/` folders to see what components and data tools are available.
5. Only after reading these files should you begin making an implementation plan or writing code.'''
)

content = content.replace(
'''1. `theme.md` - Use this for all design tokens, colors, typography, and spacing.
2. `app_architect.md` - Follow the core architecture, state management, and component hierarchy defined here.
3. `router.md` - Use this to map user intents to the correct page layouts and navigation structures.
4. `catalog/` directory - This folder contains all the approved UI components. You must use these pre-defined components instead of writing custom elements from scratch.''',
'''1. `design/visual_spec.skill.md` - Use this for all design tokens, colors, typography, and spacing.
2. `app_approach.skill.md`, `orchestrator.skill.md`, and `design/layout.skill.md` - Follow the core architecture, layout rules, and component hierarchy defined here.
3. `router.md` - Use this to map user intents to the correct page structures.
4. `ui/` directory - This folder contains all the approved UI components. You must use these pre-defined components instead of writing custom elements from scratch.'''
)

# 7. Update Master Spec Builder
content = content.replace(
'''    # Read Architect if available
    if architect_path.exists():
        with open(architect_path, "r") as f:
            master_content += f"## Application Architecture Rules\\n\\n{f.read()}\\n\\n"

    for cat_dir in [components_dir, visualizations_dir]:''',
'''    # Read static orchestrator/approach/layout files if available
    for static_path in [export_dir / "orchestrator.skill.md", export_dir / "app_approach.skill.md", design_dir / "layout.skill.md"]:
        if static_path.exists():
            with open(static_path, "r") as f:
                master_content += f"## {static_path.stem.replace('_', ' ').title()}\\n\\n{f.read()}\\n\\n"

    for cat_dir in [components_dir, charts_dir]:'''
)

# 8. Update /api/apps/generate Prompt Builder
content = content.replace(
'''    # 1. Read Theme Constraints
    theme_path = root_dir / "generated_skills" / "theme.md"
    if theme_path.exists():
        with open(theme_path, "r") as f:
            system_prompt += "### 1. THEME CONSTRAINTS (theme.md)\\n"
            system_prompt += f"{f.read()}\\n\\n"

    # 2. Read App Architect (Layout patterns)
    architect_path = root_dir / "generated_skills" / "app_architect.md"
    if architect_path.exists():
        with open(architect_path, "r") as f:
            system_prompt += "### 2. ARCHITECTURE & LAYOUT (app_architect.md)\\n"
            system_prompt += f"{f.read()}\\n\\n"''',
'''    # 1. Read Design Constraints
    theme_path = root_dir / "generated_skills" / "design" / "visual_spec.skill.md"
    if theme_path.exists():
        with open(theme_path, "r") as f:
            system_prompt += "### 1. VISUAL DESIGN CONSTRAINTS (design/visual_spec.skill.md)\\n"
            system_prompt += f"{f.read()}\\n\\n"

    # 2. Read App Orchestrator, Approach, and Layout
    for name, path_suffix in [("APP APPROACH", "app_approach.skill.md"), ("ORCHESTRATOR", "orchestrator.skill.md"), ("LAYOUT PATTERNS", "design/layout.skill.md")]:
        full_path = root_dir / "generated_skills" / path_suffix
        if full_path.exists():
            with open(full_path, "r") as f:
                system_prompt += f"### {name} ({path_suffix})\\n"
                system_prompt += f"{f.read()}\\n\\n"'''
)

with open(file_path, "w") as f:
    f.write(content)
print("Done refactoring backend main.py")
