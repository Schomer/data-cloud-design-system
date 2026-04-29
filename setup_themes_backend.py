import os
import re
import json
import shutil
from pathlib import Path

# Paths
root_dir = Path("/Users/schomer/Desktop/Data Cloud Design System")
backend_dir = root_dir / "backend"
main_py = backend_dir / "main.py"

# Create dark_default theme
themes_dir = backend_dir / "themes"
dak_default_dir = themes_dir / "dak_default"
dak_default_dir.mkdir(parents=True, exist_ok=True)

# Move existing configuration to dak_default
for file_name in ["specs.json", "theme_pref.json", "chart_colors.json"]:
    src = backend_dir / file_name
    if src.exists():
        shutil.copy(src, dak_default_dir / file_name)

if not (dak_default_dir / "metadata.json").exists():
    with open(dak_default_dir / "metadata.json", "w") as f:
        json.dump({
            "id": "dak_default",
            "name": "DAK Hyperskills",
            "description": "The default design system theme.",
            "thumbnail": ""
        }, f, indent=2)

# Copy generated_skills
root_generated_skills = root_dir / "generated_skills"
dak_default_skills = dak_default_dir / "generated_skills"
if root_generated_skills.exists():
    if not dak_default_skills.exists():
        shutil.copytree(root_generated_skills, dak_default_skills)

# We will read main.py and rewrite the API section
with open(main_py, "r") as f:
    main_content = f.read()

# 1. Update generate_skill_files to take theme_id
main_content = main_content.replace(
    'def generate_skill_files(specs: dict, chart_colors: list = None):',
    'def generate_skill_files(specs: dict, chart_colors: list = None, theme_id: str = "dak_default"):'
)
main_content = main_content.replace(
    'export_dir = root_dir / "generated_skills"',
    'export_dir = root_dir / "backend"/ "themes" / theme_id / "generated_skills"'
)

# 2. Add Theme Models
models_to_add = """class ThemeMetadata(BaseModel):
    id: str
    name: str
    description: str
    thumbnail: str

"""
if "class ThemeMetadata(BaseModel):" not in main_content:
    main_content = main_content.replace(
        "class AppGenerateRequest(BaseModel):",
        models_to_add + "class AppGenerateRequest(BaseModel):\n    theme_id: str = \"dak_default\""
    )

# 2.5 Ensure theme_id is parsed throughout API
old_api_block = """@app.post("/api/export-skills")
async def export_skills(request: ExportRequest):
    root_dir = Path(__file__).resolve().parent.parent
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
    )

@app.get("/api/specs")
def get_specs():
    specs_path = Path(__file__).parent / "specs.json"
    if not specs_path.exists():
        return {}
    with open(specs_path, "r") as f:
        return json.load(f)

@app.post("/api/specs")
def save_specs(specs: dict):
    specs_path = Path(__file__).parent / "specs.json"
    with open(specs_path, "w") as f:
        json.dump(specs, f, indent=2)
    try:
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
        print(f"Failed to auto-generate skills on update: {e}")
    return {"message": "Specs saved successfully"}

@app.get("/api/theme")
def get_theme():
    theme_path = Path(__file__).parent / "theme_pref.json"
    if not theme_path.exists():
        return {"theme": "dark"}
    with open(theme_path, "r") as f:
        return json.load(f)

@app.post("/api/theme")
def save_theme(data: dict):
    theme_path = Path(__file__).parent / "theme_pref.json"
    with open(theme_path, "w") as f:
        json.dump(data, f, indent=2)
    return {"message": "Theme saved successfully"}

@app.get("/api/chart_colors")
def get_chart_colors():
    colors_path = Path(__file__).parent / "chart_colors.json"
    if not colors_path.exists():
        return {}
    with open(colors_path, "r") as f:
        return json.load(f)

@app.post("/api/chart_colors")
def save_chart_colors(data: dict):
    colors_path = Path(__file__).parent / "chart_colors.json"
    with open(colors_path, "w") as f:
        json.dump(data, f, indent=2)
    try:
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
        print(f"Failed to auto-generate skills on chart color update: {e}")
    return {"message": "Chart colors saved successfully"}
"""

new_api_block = """
def get_theme_dir(theme_id: str):
    d = Path(__file__).parent / "themes" / theme_id
    d.mkdir(parents=True, exist_ok=True)
    return d

@app.get("/api/themes")
def list_themes():
    themes_dir = Path(__file__).parent / "themes"
    if not themes_dir.exists():
        return []
    
    themes = []
    for d in themes_dir.iterdir():
        if d.is_dir():
            meta_path = d / "metadata.json"
            if meta_path.exists():
                with open(meta_path, "r") as f:
                    themes.append(json.load(f))
    return themes

@app.post("/api/themes")
def create_theme(data: dict):
    import uuid
    import shutil
    new_id = str(uuid.uuid4())
    source_id = data.get("source_theme_id", "dak_default")
    
    new_theme_dir = get_theme_dir(new_id)
    source_theme_dir = get_theme_dir(source_id)
    
    if source_theme_dir.exists():
        for filename in ["specs.json", "chart_colors.json"]:
            if (source_theme_dir / filename).exists():
                shutil.copy(source_theme_dir / filename, new_theme_dir / filename)
        
        source_skills = source_theme_dir / "generated_skills"
        if source_skills.exists():
            shutil.copytree(source_skills, new_theme_dir / "generated_skills")
            
    meta = {
        "id": new_id,
        "name": data.get("name", "New Theme"),
        "description": data.get("description", ""),
        "thumbnail": data.get("thumbnail", "")
    }
    with open(new_theme_dir / "metadata.json", "w") as f:
        json.dump(meta, f, indent=2)
        
    return meta

@app.put("/api/themes/{theme_id}")
def update_theme(theme_id: str, data: dict):
    theme_dir = get_theme_dir(theme_id)
    meta_path = theme_dir / "metadata.json"
    meta = {}
    if meta_path.exists():
        with open(meta_path, "r") as f:
            meta = json.load(f)
    
    meta.update(data)
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    return meta

@app.delete("/api/themes/{theme_id}")
def delete_theme(theme_id: str):
    import shutil
    theme_dir = get_theme_dir(theme_id)
    if theme_dir.exists():
         shutil.rmtree(theme_dir)
    return {"status": "deleted"}

@app.post("/api/export-skills")
async def export_skills(theme_id: str = "dak_default"):
    root_dir = Path(__file__).resolve().parent.parent
    export_dir = root_dir / "backend"/ "themes" / theme_id / "generated_skills"
    
    # Optional logic to zip what exists
    files_to_zip = list(export_dir.rglob("*.md"))
    
    zip_buffer = io.BytesIO()
    import zipfile
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for file_path in files_to_zip:
            arcname = file_path.relative_to(export_dir)
            zip_file.write(file_path, arcname=f"generated_skills/{arcname}")
    
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/x-zip-compressed",
        headers={"Content-Disposition": f"attachment; filename=generated_skills_{theme_id}.zip"}
    )

@app.get("/api/specs")
def get_specs(theme_id: str = "dak_default"):
    specs_path = get_theme_dir(theme_id) / "specs.json"
    if not specs_path.exists():
        return {}
    with open(specs_path, "r") as f:
        return json.load(f)

@app.post("/api/specs")
def save_specs(specs: dict, theme_id: str = "dak_default"):
    specs_path = get_theme_dir(theme_id) / "specs.json"
    with open(specs_path, "w") as f:
        json.dump(specs, f, indent=2)
    try:
        colors_path = get_theme_dir(theme_id) / "chart_colors.json"
        colors = []
        if colors_path.exists():
            import json as _json
            with open(colors_path, "r") as cf:
                data = _json.load(cf)
                if isinstance(data, dict):
                    colors = data.get("light", [])
                else:
                    colors = data
        generate_skill_files(specs, colors, theme_id=theme_id)
    except Exception as e:
        print(f"Failed to auto-generate skills on update: {e}")
    return {"message": "Specs saved successfully"}

@app.get("/api/theme")
def get_theme():
    # Keep UI preference separate from Data Theme
    theme_path = Path(__file__).parent / "theme_pref.json"
    if not theme_path.exists():
        return {"theme": "dark"}
    with open(theme_path, "r") as f:
        return json.load(f)

@app.post("/api/theme")
def save_theme(data: dict):
    theme_path = Path(__file__).parent / "theme_pref.json"
    with open(theme_path, "w") as f:
        json.dump(data, f, indent=2)
    return {"message": "UI Theme saved successfully"}

@app.get("/api/chart_colors")
def get_chart_colors(theme_id: str = "dak_default"):
    colors_path = get_theme_dir(theme_id) / "chart_colors.json"
    if not colors_path.exists():
        return {}
    with open(colors_path, "r") as f:
        return json.load(f)

@app.post("/api/chart_colors")
def save_chart_colors(data: dict, theme_id: str = "dak_default"):
    colors_path = get_theme_dir(theme_id) / "chart_colors.json"
    with open(colors_path, "w") as f:
        json.dump(data, f, indent=2)
    try:
        specs_path = get_theme_dir(theme_id) / "specs.json"
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
            
        generate_skill_files(specs, colors, theme_id=theme_id)
    except Exception as e:
        print(f"Failed to auto-generate skills on chart color update: {e}")
    return {"message": "Chart colors saved successfully"}
"""

if "def list_themes():" not in main_content:
    main_content = main_content.replace(old_api_block, new_api_block)

# 3. Update generator to read from theme path
main_content = main_content.replace(
    'theme_path = root_dir / "generated_skills" / "design" / "visual_spec.skill.md"',
    'theme_path = root_dir / "backend"/ "themes" / request.theme_id / "generated_skills" / "design" / "visual_spec.skill.md"'
)
main_content = main_content.replace(
    'full_path = root_dir / "generated_skills" / path_suffix',
    'full_path = root_dir / "backend"/ "themes" / request.theme_id / "generated_skills" / path_suffix'
)
main_content = main_content.replace(
    'router_path = root_dir / "generated_skills" / "router.md"',
    'router_path = root_dir / "backend"/ "themes" / request.theme_id / "generated_skills" / "router.md"'
)
main_content = main_content.replace(
    'skill_path = root_dir / "generated_skills" / skill_file',
    'skill_path = root_dir / "backend"/ "themes" / request.theme_id / "generated_skills" / skill_file'
)
main_content = main_content.replace(
    'Theme GenerateRequest',
    'AppGenerateRequest'
)

with open(main_py, "w") as f:
    f.write(main_content)
