import re

with open('main.py', 'r') as f:
    content = f.read()

# Replace the start of export_skills with generate_skill_files
new_func_def = """def generate_skill_files(specs: dict, chart_colors: list):
    root_dir = Path(__file__).parent.parent
    export_dir = root_dir / "generated_skills"
    catalog_dir = export_dir / "catalog"
    
    # 1. Prepare directories (No longer wiping out the old directory)
    export_dir.mkdir(parents=True, exist_ok=True)
    catalog_dir.mkdir(parents=True, exist_ok=True)
    
    components_dir = catalog_dir / "components"
    visualizations_dir = catalog_dir / "visualizations"
    components_dir.mkdir(parents=True, exist_ok=True)
    visualizations_dir.mkdir(parents=True, exist_ok=True)
    
    files_to_zip = []"""

# Find the start of export_skills
pattern_start = r'@app\.post\("/api/export-skills"\)\nasync def export_skills\(request: ExportRequest\):\n    root_dir = Path\(__file__\)\.parent\.parent\n    export_dir = root_dir / "generated_skills"\n    catalog_dir = export_dir / "catalog"\n    \n    # 1. Prepare directories \(No longer wiping out the old directory\)\n    export_dir\.mkdir\(parents=True, exist_ok=True\)\n    catalog_dir\.mkdir\(parents=True, exist_ok=True\)\n    \n    components_dir = catalog_dir / "components"\n    visualizations_dir = catalog_dir / "visualizations"\n    components_dir\.mkdir\(parents=True, exist_ok=True\)\n    visualizations_dir\.mkdir\(parents=True, exist_ok=True\)\n    \n    files_to_zip = \[\]'

# Replace request.specs with specs and request.chartColors with chart_colors
# We need to extract the huge block first.
match = re.search(pattern_start, content)
if not match:
    print("Could not find start of export_skills")
    exit(1)

start_idx = match.start()

# Find the ZIP creation part
pattern_zip = r'    # 5. Create ZIP\n    zip_buffer = io\.BytesIO\(\)\n    with zipfile\.ZipFile\(zip_buffer, "w", zipfile\.ZIP_DEFLATED\) as zip_file:\n        for file_path in files_to_zip:\n            arcname = file_path\.relative_to\(export_dir\)\n            zip_file\.write\(file_path, arcname=f"generated_skills/\{arcname\}"\)\n    \n    zip_buffer\.seek\(0\)\n    \n    return StreamingResponse\(\n        zip_buffer,\n        media_type="application/x-zip-compressed",\n        headers=\{"Content-Disposition": "attachment; filename=generated_skills\.zip"\}\n    \)'

match_zip = re.search(pattern_zip, content)
if not match_zip:
    print("Could not find end of export_skills")
    exit(1)

end_idx = match_zip.start()

# Extract inner block
inner_block = content[start_idx:end_idx]

# Replace inside inner_block
inner_block = re.sub(pattern_start, new_func_def, inner_block)
inner_block = inner_block.replace("request.specs", "specs")
inner_block = inner_block.replace("request.chartColors", "chart_colors")

# Add the new export_skills and helper back in
new_export = """    return files_to_zip

@app.post("/api/export-skills")
async def export_skills(request: ExportRequest):
    root_dir = Path(__file__).parent.parent
    export_dir = root_dir / "generated_skills"
    
    files_to_zip = generate_skill_files(request.specs, request.chartColors)
    
    # 5. Create ZIP
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for file_path in files_to_zip:
            arcname = file_path.relative_to(export_dir)
            zip_file.write(file_path, arcname=f"generated_skills/{arcname}")
    
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/x-zip-compressed",
        headers={"Content-Disposition": "attachment; filename=generated_skills.zip"}
    )"""

# Add trigger logic below save_specs 
trigger_logic = """    try:
        colors_path = Path(__file__).parent / "chart_colors.json"
        colors = []
        if colors_path.exists():
            import json as _json
            with open(colors_path, "r") as cf:
                data = _json.load(cf)
                if isinstance(data, dict):
                    colors = data.get("light", [])
                else:
                    colors = data
        generate_skill_files(specs, colors)
    except Exception as e:
        print(f"Failed to auto-generate skills on update: {e}")"""

# Replace in content
content = content[:start_idx] + inner_block + new_export + content[match_zip.end():]

# Update save_specs
content = content.replace('    return {"message": "Specs saved successfully"}', trigger_logic + '\n    return {"message": "Specs saved successfully"}', 1)

# Update save_chart_colors
# This function writes data. Then we want to trigger_skill_generation too
trigger_logic_colors = """    try:
        specs_path = Path(__file__).parent / "specs.json"
        specs = {}
        if specs_path.exists():
             import json as _json
             with open(specs_path, "r") as sf:
                 specs = _json.load(sf)
        
        colors = []
        if isinstance(data, dict):
            colors = data.get("light", [])
        else:
            colors = data
            
        generate_skill_files(specs, colors)
    except Exception as e:
        print(f"Failed to auto-generate skills on chart color update: {e}")"""

content = content.replace('    return {"message": "Chart colors saved successfully"}', trigger_logic_colors + '\n    return {"message": "Chart colors saved successfully"}', 1)

with open('main.py', 'w') as f:
    f.write(content)
print("done")
