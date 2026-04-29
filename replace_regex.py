import glob

frontend_dir = "frontend/src/components"

replace_map = {
    "match(/visualizations\\/(.*?)": "match(/charts\\/(.*?)"
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

print("Regex update complete.")
