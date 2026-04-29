import json
import os
import requests
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"

themes_definitions = {
    "Google Material 3": {
        "font": "'Roboto', sans-serif",
        "br": 16,
        "light": {
            "bg": "#FEF7FF", "surface": "#F4EFF4", "primary": "#6750A4", "onPrimary": "#FFFFFF",
            "secondary": "#EADDFF", "onSecondary": "#21005D", "border": "#CAC4D0", "textMain": "#1D1B20", "textMuted": "#49454F",
            "error": "#B3261E", "success": "#386A20"
        },
        "dark": {
            "bg": "#141218", "surface": "#2B2930", "primary": "#D0BCFF", "onPrimary": "#381E72",
            "secondary": "#4A4458", "onSecondary": "#E8DEF8", "border": "#938F99", "textMain": "#E6E0E9", "textMuted": "#CAC4D0",
            "error": "#F2B8B5", "success": "#9CD67D"
        },
        "charts": ["#6750A4", "#006874", "#9E2A2B", "#B3261E", "#3A5A92"]
    },
    "Google Cloud": {
        "font": "'Inter', sans-serif",
        "br": 4,
        "light": {
            "bg": "#FFFFFF", "surface": "#F8F9FA", "primary": "#1A73E8", "onPrimary": "#FFFFFF",
            "secondary": "#E8F0FE", "onSecondary": "#1967D2", "border": "#DADCE0", "textMain": "#202124", "textMuted": "#5F6368",
            "error": "#D93025", "success": "#1E8E3E"
        },
        "dark": {
            "bg": "#202124", "surface": "#303134", "primary": "#8AB4F8", "onPrimary": "#202124",
            "secondary": "#1A73E8", "onSecondary": "#E8F0FE", "border": "#5F6368", "textMain": "#E8EAED", "textMuted": "#9AA0A6",
            "error": "#F28B82", "success": "#81C995"
        },
        "charts": ["#1A73E8", "#34A853", "#FBBC04", "#EA4335", "#F29900"]
    },
    "Cyberpunk Neon": {
        "font": "'Courier New', Courier, monospace",
        "br": 0,
        "light": { # Neon doesn't look great in light, making it harsh high-contrast
            "bg": "#FFFFFF", "surface": "#F0F0F0", "primary": "#FF003C", "onPrimary": "#FFFFFF",
            "secondary": "#00FFFF", "onSecondary": "#000000", "border": "#000000", "textMain": "#000000", "textMuted": "#333333",
            "error": "#FF0000", "success": "#00FF41"
        },
        "dark": {
            "bg": "#0D0208", "surface": "#121212", "primary": "#00FF41", "onPrimary": "#0D0208",
            "secondary": "#FF003C", "onSecondary": "#FFFFFF", "border": "#00FF41", "textMain": "#00FF41", "textMuted": "#008F11",
            "error": "#FF003C", "success": "#00FF41"
        },
        "charts": ["#FF003C", "#00FF41", "#FCEE09", "#00FFFF", "#FF00FF"]
    },
    "Oceanic Blue": {
        "font": "'Inter', sans-serif",
        "br": 8,
        "light": {
            "bg": "#F0F9FF", "surface": "#FFFFFF", "primary": "#0284C7", "onPrimary": "#FFFFFF",
            "secondary": "#E0F2FE", "onSecondary": "#0369A1", "border": "#BAE6FD", "textMain": "#0C4A6E", "textMuted": "#0284C7",
            "error": "#E11D48", "success": "#059669"
        },
        "dark": {
            "bg": "#082F49", "surface": "#0C4A6E", "primary": "#38BDF8", "onPrimary": "#082F49",
            "secondary": "#0284C7", "onSecondary": "#E0F2FE", "border": "#0369A1", "textMain": "#F0F9FF", "textMuted": "#BAE6FD",
            "error": "#FB7185", "success": "#34D399"
        },
        "charts": ["#0284C7", "#0369A1", "#075985", "#082F49", "#38BDF8"]
    },
    "Nord Arctic": {
        "font": "'Inter', sans-serif",
        "br": 6,
        "light": {
            "bg": "#ECEFF4", "surface": "#FFFFFF", "primary": "#5E81AC", "onPrimary": "#FFFFFF",
            "secondary": "#E5E9F0", "onSecondary": "#4C566A", "border": "#D8DEE9", "textMain": "#2E3440", "textMuted": "#4C566A",
            "error": "#BF616A", "success": "#A3BE8C"
        },
        "dark": {
            "bg": "#2E3440", "surface": "#3B4252", "primary": "#88C0D0", "onPrimary": "#2E3440",
            "secondary": "#434C5E", "onSecondary": "#ECEFF4", "border": "#4C566A", "textMain": "#ECEFF4", "textMuted": "#E5E9F0",
            "error": "#BF616A", "success": "#A3BE8C"
        },
        "charts": ["#88C0D0", "#81A1C1", "#5E81AC", "#A3BE8C", "#B48EAD"]
    },
    "Dracula": {
        "font": "'Inter', sans-serif",
        "br": 8,
        "light": {
            "bg": "#F8F8F2", "surface": "#FFFFFF", "primary": "#FF79C6", "onPrimary": "#FFFFFF",
            "secondary": "#E2E2DC", "onSecondary": "#6272A4", "border": "#D7D7D1", "textMain": "#282A36", "textMuted": "#44475A",
            "error": "#FF5555", "success": "#50FA7B"
        },
        "dark": {
            "bg": "#282A36", "surface": "#44475A", "primary": "#FF79C6", "onPrimary": "#282A36",
            "secondary": "#6272A4", "onSecondary": "#F8F8F2", "border": "#6272A4", "textMain": "#F8F8F2", "textMuted": "#BFBFBF",
            "error": "#FF5555", "success": "#50FA7B"
        },
        "charts": ["#FF79C6", "#BD93F9", "#50FA7B", "#FFB86C", "#FF5555"]
    },
    "Forest Green": {
        "font": "'Inter', sans-serif",
        "br": 12,
        "light": {
            "bg": "#F0FDF4", "surface": "#FFFFFF", "primary": "#16A34A", "onPrimary": "#FFFFFF",
            "secondary": "#DCFCE7", "onSecondary": "#15803D", "border": "#BBF7D0", "textMain": "#14532D", "textMuted": "#16A34A",
            "error": "#DC2626", "success": "#16A34A"
        },
        "dark": {
            "bg": "#052E16", "surface": "#14532D", "primary": "#4ADE80", "onPrimary": "#052E16",
            "secondary": "#15803D", "onSecondary": "#DCFCE7", "border": "#16A34A", "textMain": "#F0FDF4", "textMuted": "#BBF7D0",
            "error": "#F87171", "success": "#4ADE80"
        },
        "charts": ["#16A34A", "#15803D", "#CA8A04", "#0D9488", "#4ADE80"]
    },
    "Monokai Classic": {
        "font": "'Courier New', Courier, monospace",
        "br": 4,
        "light": {
            "bg": "#F8F8F2", "surface": "#FFFFFF", "primary": "#F92672", "onPrimary": "#FFFFFF",
            "secondary": "#E6DB74", "onSecondary": "#272822", "border": "#D2CEB6", "textMain": "#272822", "textMuted": "#75715E",
            "error": "#F92672", "success": "#A6E22E"
        },
        "dark": {
            "bg": "#272822", "surface": "#3E3D32", "primary": "#A6E22E", "onPrimary": "#272822",
            "secondary": "#49483E", "onSecondary": "#F8F8F2", "border": "#75715E", "textMain": "#F8F8F2", "textMuted": "#E6DB74",
            "error": "#F92672", "success": "#A6E22E"
        },
        "charts": ["#A6E22E", "#F92672", "#66D9EF", "#FD971F", "#AE81FF"]
    },
    "Sunset Orange": {
        "font": "'Inter', sans-serif",
        "br": 16,
        "light": {
            "bg": "#FFF7ED", "surface": "#FFFFFF", "primary": "#EA580C", "onPrimary": "#FFFFFF",
            "secondary": "#FFEDD5", "onSecondary": "#C2410C", "border": "#FED7AA", "textMain": "#7C2D12", "textMuted": "#EA580C",
            "error": "#E11D48", "success": "#16A34A"
        },
        "dark": {
            "bg": "#431407", "surface": "#7C2D12", "primary": "#FB923C", "onPrimary": "#431407",
            "secondary": "#C2410C", "onSecondary": "#FFEDD5", "border": "#EA580C", "textMain": "#FFF7ED", "textMuted": "#FED7AA",
            "error": "#FDA4AF", "success": "#4ADE80"
        },
        "charts": ["#EA580C", "#C2410C", "#F59E0B", "#D97706", "#E11D48"]
    },
    "Pastel Dream": {
        "font": "'Outfit', sans-serif",
        "br": 24,
        "light": {
            "bg": "#FDF2F8", "surface": "#FFFFFF", "primary": "#F472B6", "onPrimary": "#FFFFFF",
            "secondary": "#FCE7F3", "onSecondary": "#DB2777", "border": "#FBCFE8", "textMain": "#831843", "textMuted": "#F472B6",
            "error": "#FB7185", "success": "#34D399"
        },
        "dark": {
            "bg": "#4C1D95", "surface": "#5B21B6", "primary": "#F472B6", "onPrimary": "#4C1D95",
            "secondary": "#7C3AED", "onSecondary": "#F5D0FE", "border": "#8B5CF6", "textMain": "#FDF2F8", "textMuted": "#E9D5FF",
            "error": "#FDA4AF", "success": "#6EE7B7"
        },
        "charts": ["#F472B6", "#A78BFA", "#60A5FA", "#34D399", "#FBBF24"]
    },
    "High Contrast Base": {
        "font": "'Inter', sans-serif",
        "br": 0,
        "light": {
            "bg": "#FFFFFF", "surface": "#FFFFFF", "primary": "#0000FF", "onPrimary": "#FFFFFF",
            "secondary": "#E5E5E5", "onSecondary": "#000000", "border": "#000000", "textMain": "#000000", "textMuted": "#333333",
            "error": "#FF0000", "success": "#008000"
        },
        "dark": {
            "bg": "#000000", "surface": "#000000", "primary": "#FFFF00", "onPrimary": "#000000",
            "secondary": "#333333", "onSecondary": "#FFFFFF", "border": "#FFFFFF", "textMain": "#FFFFFF", "textMuted": "#CCCCCC",
            "error": "#FF0000", "success": "#00FF00"
        },
        "charts": ["#0000FF", "#000000", "#FFFF00", "#FF0000", "#008000"]
    },
    "Earthy Sepia": {
        "font": "'Inter', sans-serif",
        "br": 4,
        "light": {
            "bg": "#FFFBEB", "surface": "#FFFFFF", "primary": "#92400E", "onPrimary": "#FFFFFF",
            "secondary": "#FEF3C7", "onSecondary": "#B45309", "border": "#FDE68A", "textMain": "#451A03", "textMuted": "#92400E",
            "error": "#DC2626", "success": "#16A34A"
        },
        "dark": {
            "bg": "#451A03", "surface": "#78350F", "primary": "#FCD34D", "onPrimary": "#451A03",
            "secondary": "#92400E", "onSecondary": "#FEF3C7", "border": "#B45309", "textMain": "#FFFBEB", "textMuted": "#FDE68A",
            "error": "#F87171", "success": "#4ADE80"
        },
        "charts": ["#92400E", "#B45309", "#D97706", "#F59E0B", "#78350F"]
    }
}

def deeply_mutate(theme_data, specs, chart_colors):
    font = theme_data["font"]
    br = theme_data["br"]
    
    for mode in ["light", "dark"]:
        td = theme_data[mode]
        t = specs.get(mode, {})
        
        # Overwrite all components with meticulous color matching
        if "button" in t:
            t["button"]["primaryBg"] = td["primary"]
            t["button"]["primaryHoverBg"] = td["secondary"]
            t["button"]["primaryText"] = td["onPrimary"]
            t["button"]["secondaryBg"] = td["surface"]
            t["button"]["secondaryBorder"] = td["border"]
            t["button"]["secondaryText"] = td["textMain"]
            t["button"]["destructiveBg"] = td["error"]
            t["button"]["borderRadius"] = br
            t["button"]["fontFamily"] = font
            
        if "input" in t:
            t["input"]["bg"] = td["surface"]
            t["input"]["borderColor"] = td["border"]
            t["input"]["textColor"] = td["textMain"]
            t["input"]["borderRadius"] = br

        if "checkbox" in t:
            t["checkbox"]["bg"] = td["primary"]
            t["checkbox"]["borderColor"] = td["border"]
            t["checkbox"]["textColor"] = td["textMuted"]

        if "radio" in t:
            t["radio"]["bg"] = td["surface"]
            t["radio"]["dotColor"] = td["primary"]
            t["radio"]["textColor"] = td["textMuted"]

        if "switch" in t:
            t["switch"]["bgOn"] = td["primary"]
            t["switch"]["bgOff"] = td["border"]
            t["switch"]["circleOn"] = td["onPrimary"]
            t["switch"]["circleOff"] = td["surface"]

        if "segmented" in t:
            t["segmented"]["bg"] = td["bg"]
            t["segmented"]["selectedBg"] = td["surface"]
            t["segmented"]["selectedText"] = td["primary"]
            t["segmented"]["textColor"] = td["textMuted"]

        if "card" in t:
            t["card"]["bg"] = td["surface"]
            t["card"]["borderColor"] = td["border"]
            t["card"]["titleColor"] = td["textMuted"]
            t["card"]["valueColor"] = td["primary"]
            t["card"]["borderRadius"] = br
            
        if "nav" in t:
            t["nav"]["bg"] = td["surface"]
            t["nav"]["borderColor"] = td["border"]
            t["nav"]["activeText"] = td["primary"]
            t["nav"]["activeBorder"] = td["primary"]
            t["nav"]["inactiveText"] = td["textMuted"]
            t["nav"]["hoverText"] = td["textMain"]

        if "wizard" in t:
            t["wizard"]["stepBg"] = td["surface"]
            t["wizard"]["stepBorder"] = td["border"]
            t["wizard"]["activeBg"] = td["secondary"]
            t["wizard"]["activeBorder"] = td["primary"]
            t["wizard"]["activeText"] = td["onSecondary"]
            t["wizard"]["completedBg"] = td["success"]
            t["wizard"]["completedBorder"] = td["success"]
            t["wizard"]["inactiveText"] = td["textMuted"]

        if "overlay" in t:
            t["overlay"]["bg"] = td["surface"]
            t["overlay"]["borderColor"] = td["border"]
            t["overlay"]["textColor"] = td["textMuted"]
            t["overlay"]["headerTextColor"] = td["textMain"]
            t["overlay"]["footerBg"] = td["bg"]
            t["overlay"]["borderRadius"] = br

        if "table" in t:
            t["table"]["bg"] = td["surface"]
            t["table"]["borderColor"] = td["border"]
            t["table"]["headerText"] = td["textMuted"]
            t["table"]["rowText"] = td["textMain"]
            t["table"]["rowBorder"] = td["border"]
            t["table"]["borderRadius"] = br

        if "filterChip" in t:
            t["filterChip"]["bg"] = td["secondary"]
            t["filterChip"]["borderColor"] = td["primary"]
            t["filterChip"]["textColor"] = td["onSecondary"]
            t["filterChip"]["borderRadius"] = br

        if "alert" in t:
            t["alert"]["infoBg"] = td["secondary"]
            t["alert"]["infoBorder"] = td["primary"]
            t["alert"]["infoTitle"] = td["primary"]
            t["alert"]["infoText"] = td["onSecondary"]
            t["alert"]["successBg"] = td["success"]
            t["alert"]["successBorder"] = td["success"]
            t["alert"]["borderRadius"] = br
            
        if "loader" in t:
            t["loader"]["spinnerColor"] = td["primary"]
            t["loader"]["progressBg"] = td["border"]
            t["loader"]["progressFill"] = td["primary"]
            
        # TYPOGRAPHY (fonts and colors)
        if "typography" in t:
            for k, val in t["typography"].items():
                val["fontFamily"] = font
                val["color"] = td["textMuted"] if k in ["small", "xs", "muted", "bodySmall", "bodyXs"] else td["textMain"]
                if "darkColor" in val:
                    val["darkColor"] = val["color"]
                    
        specs[mode] = t
        
    return specs

print("Fetching all themes...")
res = requests.get(f"{BASE_URL}/api/themes")
existing_themes = res.json()

for th in existing_themes:
    # If the theme name exists in our mapping, rewrite it meticulously
    if th["name"] in themes_definitions:
        print(f"Deep customizing {th['name']} (ID: {th['id']})...")
        t_def = themes_definitions[th["name"]]
        
        # Get its current specs
        spec_req = requests.get(f"{BASE_URL}/api/specs?theme_id={th['id']}")
        specs = spec_req.json()
        
        # Mutate
        specs = deeply_mutate(t_def, specs, t_def["charts"])
        
        # Save specs back
        requests.post(f"{BASE_URL}/api/specs?theme_id={th['id']}", json=specs)
        
        # Save charts back
        requests.post(f"{BASE_URL}/api/chart_colors?theme_id={th['id']}", json={"light": t_def["charts"], "dark": t_def["charts"]})
        
        print(f"-> Successfully customized {th['name']}!")

print("All themes deeply customized.")
