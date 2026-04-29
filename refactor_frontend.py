import os
import glob

frontend_dir = "frontend/src/components"

replace_map = {
    # File Paths in props
    '"catalog/visualizations/shared_visuals.md"': '"ui/charts/shared_visuals.md"',
    '"catalog/visualizations/': '"ui/charts/',
    "'catalog/visualizations/": "'ui/charts/",
    "`catalog/visualizations/": "`ui/charts/",
    '"catalog/components/': '"ui/components/',
    "'catalog/components/": "'ui/components/",
    "`catalog/components/": "`ui/components/",

    # Text descriptions in HomePage
    "app_architect.md": "orchestrator.skill.md",
    "theme.md": "design/visual_spec.skill.md",
    "shared_visualization_attributes.md": "ui/charts/shared_visuals.md"
}

for filepath in glob.glob(f"{frontend_dir}/**/*.jsx", recursive=True):
    with open(filepath, "r") as f:
        content = f.read()

    original_content = content
    for old, new in replace_map.items():
        content = content.replace(old, new)

    if content != original_content:
        with open(filepath, "w") as f:
            f.write(content)
        print(f"Updated {filepath}")

print("Frontend refactoring complete.")
