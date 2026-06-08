import re

with open('backend/main.py', 'r') as f:
    content = f.read()

new_endpoints = """
@app.get("/api/active_theme_id")
def get_active_theme_id():
    pref_path = Path(__file__).parent / "active_theme_pref.json"
    if not pref_path.exists():
        return {"activeThemeId": "dak_default"}
    import json
    with open(pref_path, "r") as f:
        return json.load(f)

@app.post("/api/active_theme_id")
def save_active_theme_id(data: dict):
    pref_path = Path(__file__).parent / "active_theme_pref.json"
    import json
    with open(pref_path, "w") as f:
        json.dump(data, f, indent=2)
    return {"message": "Active theme ID saved successfully"}
"""

if "/api/active_theme_id" not in content:
    content = content.replace('@app.get("/api/theme")', new_endpoints + '\n@app.get("/api/theme")')
    with open('backend/main.py', 'w') as f:
        f.write(content)
