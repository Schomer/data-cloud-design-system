import sys
import os
import json
from pathlib import Path

# Add backend directory to path
sys.path.append(str(Path(__file__).resolve().parent.parent / "backend"))

from main import generate_skill_files

def main():
    root_dir = Path(__file__).resolve().parent.parent
    themes_dir = root_dir / "backend" / "themes"
    
    print(f"Scanning themes in: {themes_dir}")
    count = 0
    for d in themes_dir.iterdir():
        if d.is_dir():
            theme_id = d.name
            specs_path = d / "specs.json"
            colors_path = d / "chart_colors.json"
            
            specs = {}
            colors = []
            
            if specs_path.exists():
                with open(specs_path, "r") as f:
                    specs = json.load(f)
            
            if colors_path.exists():
                with open(colors_path, "r") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        colors = data.get("light", [])
                    else:
                        colors = data
                        
            print(f"Regenerating skills for theme: {theme_id}...")
            try:
                generate_skill_files(specs, colors, theme_id=theme_id)
                print(f"Successfully generated skills for {theme_id}")
                count += 1
            except Exception as e:
                print(f"Failed to generate skills for {theme_id}: {e}")
                
    print(f"Completed! Regenerated skills for {count} themes.")

if __name__ == "__main__":
    main()
