import json
import os
import requests

BASE_URL = "http://127.0.0.1:8000"

# Exhaustive typography scale definitions
def typography_scale(base_scale, weight_headers, weight_body, header_font, body_font, tracking="normal", text_transform="none"):
    return {
        "h1": {"fontSize": int(36 * base_scale), "fontWeight": str(weight_headers), "fontFamily": header_font, "letterSpacing": tracking, "textTransform": text_transform},
        "h2": {"fontSize": int(30 * base_scale), "fontWeight": str(weight_headers), "fontFamily": header_font, "letterSpacing": tracking, "textTransform": text_transform},
        "h3": {"fontSize": int(24 * base_scale), "fontWeight": str(weight_headers), "fontFamily": header_font, "letterSpacing": tracking, "textTransform": text_transform},
        "h4": {"fontSize": int(20 * base_scale), "fontWeight": str(weight_headers), "fontFamily": header_font, "letterSpacing": tracking, "textTransform": text_transform},
        "h5": {"fontSize": int(18 * base_scale), "fontWeight": str(weight_headers), "fontFamily": header_font, "letterSpacing": tracking, "textTransform": text_transform},
        "h6": {"fontSize": int(16 * base_scale), "fontWeight": str(weight_headers), "fontFamily": header_font, "letterSpacing": tracking, "textTransform": text_transform},
        "p": {"fontSize": int(16 * base_scale), "fontWeight": str(weight_body), "fontFamily": body_font},
        "small": {"fontSize": int(14 * base_scale), "fontWeight": str(weight_body), "fontFamily": body_font},
        "xs": {"fontSize": int(12 * base_scale), "fontWeight": str(weight_body), "fontFamily": body_font},
        "muted": {"fontSize": int(14 * base_scale), "fontWeight": str(weight_body), "fontFamily": body_font, "fontStyle": "italic"},
        "bodyBase": {"fontSize": int(16 * base_scale), "fontWeight": str(weight_body), "fontFamily": body_font},
        "bodySmall": {"fontSize": int(14 * base_scale), "fontWeight": str(weight_body), "fontFamily": body_font},
        "bodyXs": {"fontSize": int(12 * base_scale), "fontWeight": str(weight_body), "fontFamily": body_font},
        "mono": {"fontSize": int(14 * base_scale), "fontWeight": "400", "fontFamily": "monospace"}
    }

themes_config = {
    "Google Material 3": {
        "br": 16, "cardPad": 24, "btnPadX": 24, "btnPadY": 10,
        "typo": typography_scale(1.1, 500, 400, "'Roboto', sans-serif", "'Roboto', sans-serif"),
        "colors": ["#6750A4", "#9E2A2B", "#006874", "#B3261E", "#3A5A92", "#7D5260", "#4A4458", "#1D1B20", "#386A20", "#B3261E"]
    },
    "Google Cloud": {
        "br": 4, "cardPad": 20, "btnPadX": 16, "btnPadY": 8,
        "typo": typography_scale(1.0, 600, 400, "'Inter', sans-serif", "'Inter', sans-serif"),
        "colors": ["#1A73E8", "#34A853", "#FBBC04", "#EA4335", "#F29900", "#185ABC", "#137333", "#B31412", "#E8710A", "#1E8E3E"]
    },
    "Cyberpunk Neon": {
        "br": 0, "cardPad": 16, "btnPadX": 20, "btnPadY": 8,
        "typo": typography_scale(1.0, 700, 400, "monospace", "monospace", "0.05em", "uppercase"),
        "colors": ["#00FF41", "#FF003C", "#FCEE09", "#00FFFF", "#FF00FF", "#008F11", "#990024", "#FF8C00", "#008B8B", "#800080"]
    },
    "Oceanic Blue": {
        "br": 8, "cardPad": 24, "btnPadX": 18, "btnPadY": 10,
        "typo": typography_scale(1.0, 600, 400, "'Outfit', sans-serif", "'Outfit', sans-serif"),
        "colors": ["#0284C7", "#0369A1", "#075985", "#082F49", "#38BDF8", "#7DD3FC", "#0EA5E9", "#0284C7", "#3B82F6", "#1D4ED8"]
    },
    "Nord Arctic": {
        "br": 6, "cardPad": 20, "btnPadX": 16, "btnPadY": 8,
        "typo": typography_scale(1.0, 500, 400, "'Inter', sans-serif", "'Inter', sans-serif"),
        "colors": ["#88C0D0", "#81A1C1", "#5E81AC", "#A3BE8C", "#B48EAD", "#EBCB8B", "#D08770", "#BF616A", "#4C566A", "#ECEFF4"]
    },
    "Dracula": {
        "br": 8, "cardPad": 20, "btnPadX": 16, "btnPadY": 8,
        "typo": typography_scale(1.0, 600, 400, "'Inter', sans-serif", "'Inter', sans-serif"),
        "colors": ["#FF79C6", "#BD93F9", "#50FA7B", "#FFB86C", "#FF5555", "#F1FA8C", "#8BE9FD", "#6272A4", "#44475A", "#F8F8F2"]
    },
    "Forest Green": {
        "br": 12, "cardPad": 32, "btnPadX": 20, "btnPadY": 12,
        "typo": typography_scale(1.05, 700, 400, "'Inter', sans-serif", "'Inter', sans-serif"),
        "colors": ["#16A34A", "#15803D", "#CA8A04", "#0D9488", "#4ADE80", "#22C55E", "#10B981", "#84CC16", "#047857", "#064E3B"]
    },
    "Monokai Classic": {
        "br": 4, "cardPad": 16, "btnPadX": 16, "btnPadY": 8,
        "typo": typography_scale(0.9, 600, 400, "monospace", "monospace"),
        "colors": ["#A6E22E", "#F92672", "#66D9EF", "#FD971F", "#AE81FF", "#E6DB74", "#A6E22E", "#F92672", "#66D9EF", "#FD971F"]
    },
    "Sunset Orange": {
        "br": 16, "cardPad": 24, "btnPadX": 24, "btnPadY": 10,
        "typo": typography_scale(1.1, 700, 400, "'Outfit', sans-serif", "'Inter', sans-serif"),
        "colors": ["#EA580C", "#C2410C", "#F59E0B", "#D97706", "#E11D48", "#9A3412", "#B45309", "#BE123C", "#F97316", "#F43F5E"]
    },
    "Pastel Dream": {
        "br": 24, "cardPad": 32, "btnPadX": 32, "btnPadY": 12,
        "typo": typography_scale(1.15, 600, 500, "'Outfit', sans-serif", "'Outfit', sans-serif"),
        "colors": ["#F472B6", "#A78BFA", "#60A5FA", "#34D399", "#FBBF24", "#FDE047", "#FCA5A5", "#818CF8", "#C084FC", "#E879F9"]
    },
    "High Contrast Base": {
        "br": 0, "cardPad": 12, "btnPadX": 16, "btnPadY": 8,
        "typo": typography_scale(1.2, 700, 500, "'Inter', sans-serif", "'Inter', sans-serif"),
        "colors": ["#0000FF", "#FFFF00", "#FF0000", "#008000", "#800080", "#FFA500", "#00FFFF", "#000000", "#FF00FF", "#000080"]
    },
    "Earthy Sepia": {
        "br": 4, "cardPad": 24, "btnPadX": 16, "btnPadY": 8,
        "typo": typography_scale(1.0, 500, 400, "ui-serif, Georgia, serif", "ui-serif, Georgia, serif"),
        "colors": ["#92400E", "#B45309", "#D97706", "#F59E0B", "#78350F", "#451A03", "#B45309", "#92400E", "#D97706", "#78350F"]
    }
}

def apply_exhaustive_settings(specs, config):
    br = config["br"]
    cardPad = config["cardPad"]
    btnX = config["btnPadX"]
    btnY = config["btnPadY"]
    typo_defs = config["typo"]
    
    for mode in ["light", "dark"]:
        t = specs.get(mode, {})
        
        # Merge spacings
        if "button" in t:
            t["button"]["borderRadius"] = br
            t["button"]["paddingX"] = btnX
            t["button"]["paddingY"] = btnY
        if "input" in t:
            t["input"]["borderRadius"] = br
            t["input"]["paddingX"] = btnX - 4
            t["input"]["paddingY"] = btnY
        if "card" in t:
            t["card"]["borderRadius"] = br
            t["card"]["padding"] = cardPad
        if "overlay" in t:
            t["overlay"]["borderRadius"] = br
        if "table" in t:
            t["table"]["borderRadius"] = br
        if "filterChip" in t:
            t["filterChip"]["borderRadius"] = 9999 if br > 12 else br
        if "alert" in t:
            t["alert"]["borderRadius"] = br
            
        # Merge typography logic deeply
        if "typography" in t:
            for k, val in typo_defs.items():
                if k in t["typography"]:
                    for prop in val:
                        t["typography"][k][prop] = val[prop]
                        
        specs[mode] = t
    return specs

print("Fetching all themes...")
res = requests.get(f"{BASE_URL}/api/themes")
themes_db = res.json()

for th in themes_db:
    t_name = th["name"]
    if t_name in themes_config:
        print(f"Applying exhaustive layout tokens for {t_name}...")
        c = themes_config[t_name]
        
        # 1. Update Specs
        spec_req = requests.get(f"{BASE_URL}/api/specs?theme_id={th['id']}")
        specs = spec_req.json()
        new_specs = apply_exhaustive_settings(specs, c)
        requests.post(f"{BASE_URL}/api/specs?theme_id={th['id']}", json=new_specs)
        
        # 2. Update Charts
        new_colors = {"light": c["colors"], "dark": c["colors"]}
        requests.post(f"{BASE_URL}/api/chart_colors?theme_id={th['id']}", json=new_colors)

print("All themes exhaustively styled.")
