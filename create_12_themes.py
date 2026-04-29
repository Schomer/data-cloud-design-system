import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

themes_config = [
    {
        "name": "Google Material 3",
        "desc": "Material You styling with rounded corners and expressive colors.",
        "colors": {
            "primary": "#6750A4",
            "secondary": "#EADDFF",
            "bg": "#FEF7FF",
            "surface": "#F4EFF4",
            "text": "#1D1B20",
            "chart": ["#6750A4", "#006874", "#9E2A2B", "#B3261E", "#3A5A92"]
        },
        "border_radius": 16,
        "typography": "'Roboto', sans-serif"
    },
    {
        "name": "Google Cloud",
        "desc": "Clean, enterprise-focused data app theme matching GCP.",
        "colors": {
            "primary": "#1A73E8",
            "secondary": "#E8F0FE",
            "bg": "#FFFFFF",
            "surface": "#F8F9FA",
            "text": "#202124",
            "chart": ["#1A73E8", "#34A853", "#FBBC04", "#EA4335", "#F29900"]
        },
        "border_radius": 4,
        "typography": "'Inter', sans-serif"
    },
    {
        "name": "Cyberpunk Neon",
        "desc": "High contrast dark mode with neon accents.",
        "colors": {
            "primary": "#00FF41",
            "secondary": "#0A0A0A",
            "bg": "#0D0208",
            "surface": "#121212",
            "text": "#00FF41",
            "chart": ["#FF003C", "#00FF41", "#FCEE09", "#00FFFF", "#FF00FF"]
        },
        "border_radius": 0,
        "typography": "monospace"
    },
    {
        "name": "Oceanic Blue",
        "desc": "Calming deep sea shades for relaxed viewing.",
        "colors": {
            "primary": "#0284C7",
            "secondary": "#E0F2FE",
            "bg": "#F0F9FF",
            "surface": "#FFFFFF",
            "text": "#0C4A6E",
            "chart": ["#0284C7", "#0369A1", "#075985", "#082F49", "#38BDF8"]
        },
        "border_radius": 8,
        "typography": "'Inter', sans-serif"
    },
    {
        "name": "Nord Arctic",
        "desc": "Cool, frosty palette inspired by Arctic ice.",
        "colors": {
            "primary": "#88C0D0",
            "secondary": "#E5E9F0",
            "bg": "#ECEFF4",
            "surface": "#FFFFFF",
            "text": "#2E3440",
            "chart": ["#88C0D0", "#81A1C1", "#5E81AC", "#A3BE8C", "#B48EAD"]
        },
        "border_radius": 6,
        "typography": "'Inter', sans-serif"
    },
    {
        "name": "Dracula",
        "desc": "A dark theme for vampires and late-night coders.",
        "colors": {
            "primary": "#FF79C6",
            "secondary": "#44475A",
            "bg": "#282A36",
            "surface": "#44475A",
            "text": "#F8F8F2",
            "chart": ["#FF79C6", "#BD93F9", "#50FA7B", "#FFB86C", "#FF5555"]
        },
        "border_radius": 8,
        "typography": "'Inter', sans-serif"
    },
    {
        "name": "Forest Green",
        "desc": "Earthy tones with vibrant green highlights.",
        "colors": {
            "primary": "#16A34A",
            "secondary": "#DCFCE7",
            "bg": "#F0FDF4",
            "surface": "#FFFFFF",
            "text": "#14532D",
            "chart": ["#16A34A", "#15803D", "#CA8A04", "#0D9488", "#4ADE80"]
        },
        "border_radius": 12,
        "typography": "'Inter', sans-serif"
    },
    {
        "name": "Monokai Classic",
        "desc": "Vibrant syntax highlighting style for data.",
        "colors": {
            "primary": "#A6E22E",
            "secondary": "#49483E",
            "bg": "#272822",
            "surface": "#3E3D32",
            "text": "#F8F8F2",
            "chart": ["#A6E22E", "#F92672", "#66D9EF", "#FD971F", "#AE81FF"]
        },
        "border_radius": 4,
        "typography": "monospace"
    },
    {
        "name": "Sunset Orange",
        "desc": "Warm, energetic gradients for high impact dashboards.",
        "colors": {
            "primary": "#EA580C",
            "secondary": "#FFEDD5",
            "bg": "#FFF7ED",
            "surface": "#FFFFFF",
            "text": "#7C2D12",
            "chart": ["#EA580C", "#C2410C", "#F59E0B", "#D97706", "#E11D48"]
        },
        "border_radius": 16,
        "typography": "'Inter', sans-serif"
    },
    {
        "name": "Pastel Dream",
        "desc": "Soft, muted candy colors.",
        "colors": {
            "primary": "#F472B6",
            "secondary": "#FDF2F8",
            "bg": "#FDF2F8",
            "surface": "#FFFFFF",
            "text": "#831843",
            "chart": ["#F472B6", "#A78BFA", "#60A5FA", "#34D399", "#FBBF24"]
        },
        "border_radius": 24,
        "typography": "'Outfit', sans-serif"
    },
    {
        "name": "High Contrast Base",
        "desc": "Accessibility focused theme with stark boundaries.",
        "colors": {
            "primary": "#0000FF",
            "secondary": "#E5E5E5",
            "bg": "#FFFFFF",
            "surface": "#E5E5E5",
            "text": "#000000",
            "chart": ["#0000FF", "#000000", "#FFFF00", "#FF0000", "#008000"]
        },
        "border_radius": 0,
        "typography": "'Inter', sans-serif"
    },
    {
        "name": "Earthy Sepia",
        "desc": "Vintage paper aesthetics with brown and gold tones.",
        "colors": {
            "primary": "#92400E",
            "secondary": "#FEF3C7",
            "bg": "#FFFBEB",
            "surface": "#FFFFFF",
            "text": "#451A03",
            "chart": ["#92400E", "#B45309", "#D97706", "#F59E0B", "#78350F"]
        },
        "border_radius": 4,
        "typography": "'Inter', sans-serif"
    }
]

def mutate_specs(base_specs, config):
    c = config["colors"]
    br = config["border_radius"]
    font = config["typography"]
    
    # We mutate the 'light' section. For dark mode equivalents, similar mapping is done loosely.
    target = base_specs.get("light", {})
    if "button" in target:
        target["button"]["primaryBg"] = c["primary"]
        target["button"]["borderRadius"] = br
        target["button"]["fontFamily"] = font
        
    if "card" in target:
        target["card"]["bg"] = c["surface"]
        target["card"]["borderRadius"] = br
        target["card"]["valueColor"] = c["primary"]
        
    if "input" in target:
        target["input"]["bg"] = c["surface"]
        target["input"]["borderRadius"] = br
        
    if "typography" in target:
        for t_key in target["typography"]:
            target["typography"][t_key]["fontFamily"] = font
            target["typography"][t_key]["color"] = c["text"]
            
    base_specs["light"] = target
    return base_specs

# Give backend a moment to be running
print("Fetching base specs...")
res = requests.get(f"{BASE_URL}/api/specs?theme_id=dak_default")
base_specs = res.json()

for theme in themes_config:
    print(f"Creating thread: {theme['name']}...")
    res = requests.post(f"{BASE_URL}/api/themes", json={
        "source_theme_id": "dak_default",
        "name": theme["name"],
        "description": theme["desc"],
        "thumbnail": ""
    })
    theme_meta = res.json()
    new_id = theme_meta["id"]
    
    # Mutate specs map
    new_specs = mutate_specs(base_specs, theme)
    requests.post(f"{BASE_URL}/api/specs?theme_id={new_id}", json=new_specs)
    
    # Mutate charts array
    requests.post(f"{BASE_URL}/api/chart_colors?theme_id={new_id}", json={"light": theme["colors"]["chart"]})
    
    print(f"-> Successfully created Theme '{theme['name']}' ({new_id})")

print("All themes generated!")
