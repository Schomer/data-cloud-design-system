import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from google.cloud import bigquery
from google.cloud import geminidataanalytics_v1beta as gemini
import json
import zipfile
import io
import shutil
import time
import re
from pathlib import Path
from fastapi.responses import StreamingResponse

# Firebase Admin for token verification
try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    FIREBASE_INITIALIZED = True
except Exception as e:
    print(f"Warning: Firebase Admin SDK not initialized: {e}")
    FIREBASE_INITIALIZED = False

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "malloy-data")
DATASET_ID = "ecomm"
TABLE_ID = "order_items"
LOCATION = "us"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "schomer@google.com")

def require_admin(request: Request):
    """Verify the Firebase ID token and check that the user is the admin."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=403, detail="Admin access required")
    token = auth_header[7:]
    if not FIREBASE_INITIALIZED:
        raise HTTPException(status_code=503, detail="Auth service unavailable")
    try:
        decoded = firebase_auth.verify_id_token(token)
        email = decoded.get("email", "")
        if email != ADMIN_EMAIL:
            raise HTTPException(status_code=403, detail="Admin access required")
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Invalid auth token: {e}")

bq_client = None
try:
    bq_client = bigquery.Client(project=PROJECT_ID)
except Exception as e:
    print(f"Warning: Failed to initialize BigQuery client: {e}")

gemini_client = None
try:
    gemini_client = gemini.DataChatServiceClient()
except Exception as e:
    print(f"Warning: Failed to initialize Gemini client: {e}")



app = FastAPI(title="Data App Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StatusUpdate(BaseModel):
    status: str

class ExportRequest(BaseModel):
    specs: dict
    chartColors: list[str]

class SkillUpdate(BaseModel):
    path: str
    content: str

class ThemeMetadata(BaseModel):
    id: str
    name: str
    description: str
    thumbnail: str

class AppGenerateRequest(BaseModel):
    theme_id: str = "dak_default"
    prompt: str
    use_skills: bool = True

class ChatRequestModel(BaseModel):
    message: str
    transaction_id: str
    history: list[dict] = []


@app.get("/api/data")
def get_data():
    query = f"""
    SELECT *
    FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
    LIMIT 100
    """
    try:
        query_job = bq_client.query(query)
        results = [dict(row) for row in query_job]
        # Convert any date/datetime/timedelta objects to strings so FastAPI can serialize them
        for row in results:
            for k, v in row.items():
                if hasattr(v, 'isoformat'):
                    row[k] = v.isoformat()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/skills/content")
def get_skill_content(path: str):
    root_dir = Path(__file__).resolve().parent.parent
    target_path = root_dir / "generated_skills" / path
    
    # Security check to prevent path traversal
    try:
        if not target_path.resolve().is_relative_to((root_dir / "generated_skills").resolve()):
            raise HTTPException(status_code=400, detail="Invalid path")
    except ValueError:
        pass
        
    if not target_path.exists():
        raise HTTPException(status_code=404, detail="Skill not found")
        
    with open(target_path, "r", encoding="utf-8") as f:
        content = f.read()
    return {"content": content}

@app.put("/api/skills/content")
def update_skill_content(update: SkillUpdate, request: Request):
    require_admin(request)
    root_dir = Path(__file__).resolve().parent.parent
    target_path = root_dir / "generated_skills" / update.path
    
    try:
        if not target_path.resolve().is_relative_to((root_dir / "generated_skills").resolve()):
            raise HTTPException(status_code=400, detail="Invalid path")
    except ValueError:
        pass
        
    target_path.parent.mkdir(parents=True, exist_ok=True)
        
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(update.content)
        
    return {"message": "Skill updated"}

def generate_skill_files(specs: dict, chart_colors: list, theme_id: str = "dak_default"):
    root_dir = Path(__file__).resolve().parent.parent
    export_dir = root_dir / "backend"/ "themes" / theme_id / "generated_skills"
    ui_dir = export_dir / "ui"
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
    charts_dir.mkdir(parents=True, exist_ok=True)
    
    files_to_zip = []
    
    theme_manifest = {
        "theme": "dark",
        "colors": {
            "light": {
                "background_primary": specs.get("light", {}).get("card", {}).get("bg", "#ffffff"),
                "background_secondary": specs.get("light", {}).get("card", {}).get("borderColor", "#e2e8f0"),
                "text_primary": specs.get("light", {}).get("typography", {}).get("h1", {}).get("color", "#0f172a"),
                "text_secondary": specs.get("light", {}).get("typography", {}).get("p", {}).get("color", "#475569"),
                "border": specs.get("light", {}).get("card", {}).get("borderColor", "#e2e8f0"),
                "chart_palette": chart_colors
            },
            "dark": {
                "background_primary": specs.get("dark", {}).get("card", {}).get("bg", "#121212"),
                "background_secondary": specs.get("dark", {}).get("card", {}).get("borderColor", "#1e293b"),
                "text_primary": specs.get("dark", {}).get("typography", {}).get("h1", {}).get("color", "#f8fafc"),
                "text_secondary": specs.get("dark", {}).get("typography", {}).get("p", {}).get("color", "#cbd5e1"),
                "border": specs.get("dark", {}).get("card", {}).get("borderColor", "#1e293b"),
                "chart_palette": chart_colors
            }
        },
        "typography": {
            "font_family": "Inter, sans-serif"
        },
        "components": specs
    }
    
    theme_content = f"""---
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
5.  **Exact Typography Enforcement**: You MUST NOT use generic Tailwind text classes like `text-xl` or `font-bold`. For EVERY text element (headings, paragraphs, buttons, etc.), look up its designated typography token (like `h1`, `p`, `small`, `muted`, etc.) in this specification and explicitly apply its `fontSize` (in px), `fontWeight`, and `color` as inline styles or explicit Tailwind values.

## Guidelines
- **background_primary**: Use for the main application background.
- **background_secondary**: Use for alternate row colors, card backgrounds, or sidebars.
- **text_primary**: Use for primary text like headings and main content.
- **text_secondary**: Use for secondary text like subtitles, descriptions, or less important info.
- **border**: Use for borders of cards, tables, inputs, and dividers.
- **chart_palette**: Use these hex codes sequentially for visualization colors.
- **components**: Look here for component-specific overrides like button border radius, input height, or table cell padding.

## Raw Tokens
```json
{json.dumps(theme_manifest, indent=2)}
```
"""
    theme_path = design_dir / "visual_spec.skill.md"
    with open(theme_path, "w") as f:
        f.write(theme_content)
    files_to_zip.append(theme_path)

    # 3. Generate Catalog Skills (Logic Layer)
    
    def get_comp_spec(comp_name, sub_key=None):
        comp_spec = {}
        for theme in ["light", "dark"]:
            base = specs.get(theme, {}).get(comp_name, {})
            if sub_key:
                comp_spec[theme] = base.get(sub_key, {})
            else:
                comp_spec[theme] = base
        return comp_spec

    # Build typography definitions explicitly
    typography_spec = {}
    for style_key in ["h1", "h2", "h3", "h4", "h5", "h6", "p", "small", "mono", "muted", "link"]:
        light_style = specs.get("light", {}).get("typography", {}).get(style_key, {})
        dark_style = specs.get("dark", {}).get("typography", {}).get(style_key, {})
        style_obj = {
            "fontSize": light_style.get("fontSize"),
            "fontWeight": light_style.get("fontWeight"),
            "fontFamily": light_style.get("fontFamily"),
            "lightColor": light_style.get("color"),
            "darkColor": dark_style.get("color"),
            "fontStyle": light_style.get("fontStyle"),
            "textDecoration": light_style.get("textDecoration")
        }
        typography_spec[style_key] = {k: v for k, v in style_obj.items() if v is not None}

    # Define all skills
    skills = []
    
    # --- UI COMPONENTS ---
    skills.append({
        "id": "button", "name": "Button", "category": "components",
        "description": "Primary, Secondary, Destructive, and Ghost action triggers",
        "usage_context": "Use for primary actions, form submissions, state transitions, and interactive triggers.",
        "keywords": ["click", "submit", "action", "trigger", "button"],
        "schema": "label: string, variant: 'primary'|'secondary'|'destructive'|'ghost', disabled: boolean",
        "signature": "Trigger context",
        "scalability": "High density",
        "persona": "All",
        "complexity": "Low",
        "priority": "Primary",
        "specifications": get_comp_spec("button")
    })
    skills.append({
        "id": "input_fields", "name": "Input Fields", "category": "components",
        "description": "Text, Number, Email, and Search input controls",
        "usage_context": "Use for capturing user textual input data, search queries, and numerical values in forms.",
        "keywords": ["text", "input", "form", "search", "field", "type"],
        "schema": "label: string, placeholder: string, value: string, type: string",
        "signature": "User input",
        "scalability": "N/A",
        "persona": "All",
        "complexity": "Low",
        "priority": "Primary",
        "specifications": get_comp_spec("input")
    })
    skills.append({
        "id": "date_range", "name": "Date Range", "category": "components",
        "description": "Custom date range selector and temporal controls",
        "usage_context": "Use for filtering datasets by date, selecting time horizons, and interacting with temporal charts.",
        "keywords": ["date", "range", "time", "calendar", "horizon"],
        "schema": "startDate: string, endDate: string, onChange: function",
        "signature": "Temporal range selection",
        "scalability": "N/A",
        "persona": "All",
        "complexity": "Medium",
        "priority": "Primary",
        "specifications": get_comp_spec("input")
    })
    skills.append({
        "id": "filters", "name": "Filter Controls", "category": "components",
        "description": "Various filter controls for data including text fields, number fields, and date ranges.",
        "usage_context": "Use for building robust filtering panels to slice datasets. 1. The 'Add Filter' button should show a list of fields available in the data, letting the user pick a field to filter on. 2. When the field is picked, the UI for the filter must match the data type for the field (text, number, date, etc.) and create the proper filter UI for that type. 3. Text fields should show a list of values when clicked into and allow searching for a field value, showing matching results as you type. 4. Number fields should allow entering a specific number, or adjusting a range slider. 5. Date filters should show a preset list of date ranges (e.g. today, last 7 days, last 30 days) but also explicitly allow setting a custom date range.",
        "keywords": ["filter", "query", "slice", "search", "date range", "number", "text"],
        "schema": "filters: array, onChange: function",
        "signature": "Data slicing",
        "scalability": "High",
        "persona": "All",
        "complexity": "Medium",
        "priority": "Primary",
        "specifications": {
            "input": get_comp_spec("input"),
            "filterChip": get_comp_spec("filterChip")
        }
    })
    skills.append({
        "id": "selection_controls", "name": "Selection Controls", "category": "components",
        "description": "Checkboxes, Radios, Toggles, and Segmented switches",
        "usage_context": "Use for binary toggles, multiple choice selections, and dataset filtering options.",
        "keywords": ["checkbox", "radio", "toggle", "switch", "segmented"],
        "schema": "options: array, value: string|boolean, multi: boolean",
        "signature": "Option arrays",
        "scalability": "High (multi-selection)",
        "persona": "All",
        "complexity": "Low",
        "priority": "Primary",
        "specifications": {
            "borderRadius": get_comp_spec("button", "borderRadius"),
            "switch": get_comp_spec("switch")
        }
    })
    skills.append({
        "id": "cards_kpi", "name": "KPI Cards", "category": "components",
        "description": "Visual containers for high-level metrics and summaries",
        "usage_context": "Use for displaying high-level metrics, overarching summary statistics, and dashboard entry points.",
        "keywords": ["metric", "kpi", "card", "summary", "stat"],
        "schema": "title: string, value: string|number, trend: string",
        "signature": "1-2 Numerical Metrics",
        "scalability": "Best for 4-8 cards",
        "persona": "Executive",
        "complexity": "Low",
        "priority": "Primary",
        "specifications": get_comp_spec("card")
    })
    skills.append({
        "id": "data_table", "name": "Data Table", "category": "components",
        "description": "Detailed grid for records with sorting and search",
        "usage_context": "Use for displaying dense tabular data, sortable lists, and bulk record management.",
        "keywords": ["table", "grid", "list", "rows", "records"],
        "schema": "columns: array, data: array",
        "signature": "Records (Array of Objects)",
        "scalability": "High (> 100 rows)",
        "persona": "Analyst, Ops",
        "complexity": "Low",
        "priority": "Primary",
        "specifications": get_comp_spec("table")
    })
    skills.append({
        "id": "navigation", "name": "Navigation Systems", "category": "components",
        "description": "Sidebar and Top-bar navigation items",
        "usage_context": "Use for primary app routing, application sidebar menus, and contextual section navigation.",
        "keywords": ["nav", "menu", "sidebar", "link", "active"],
        "schema": "items: array, activeId: string",
        "signature": "Nav hierarchy",
        "scalability": "High",
        "persona": "All",
        "complexity": "Low",
        "priority": "Primary",
        "specifications": get_comp_spec("nav")
    })
    skills.append({
        "id": "wizard_steps", "name": "Wizard Steps", "category": "components",
        "description": "Progress indicators for multi-step workflows",
        "usage_context": "Use for forms, sign-up processes, or any sequential workflow where users need to know their current progress.",
        "keywords": ["wizard", "step", "progress", "workflow", "sequence"],
        "schema": "steps: array, currentStep: number",
        "signature": "Sequential stages",
        "scalability": "3-7 steps",
        "persona": "All",
        "complexity": "Medium",
        "priority": "Specialized",
        "specifications": get_comp_spec("wizard")
    })
    skills.append({
        "id": "overlays", "name": "Modals & Overlays", "category": "components",
        "description": "Dialogs, Modals, and Popover containers",
        "usage_context": "Use for focus-requiring tasks, confirmations, layered forms, and contextual popovers over existing content.",
        "keywords": ["modal", "dialog", "overlay", "popup"],
        "schema": "title: string, isOpen: boolean, children: any",
        "signature": "Contextual containers",
        "scalability": "Single focus",
        "persona": "All",
        "complexity": "Low",
        "priority": "Specialized",
        "specifications": get_comp_spec("overlay")
    })
    skills.append({
        "id": "chat_fullscreen", "name": "Gemini Full Screen Chat", "category": "components",
        "description": "Full screen AI conversational view",
        "usage_context": "Use for dedicated, full-screen chat interfaces simulating interaction with Gemini.",
        "keywords": ["chat", "gemini", "ai", "conversation", "fullscreen", "message"],
        "schema": "messages: array, onSendMessage: function",
        "signature": "Natural Language",
        "scalability": "High",
        "persona": "All",
        "complexity": "Medium",
        "priority": "Specialized",
        "specifications": get_comp_spec("chat")
    })
    skills.append({
        "id": "chat_sidebar", "name": "Gemini Sidebar Chat", "category": "components",
        "description": "Sidebar conversational interface alongside main content",
        "usage_context": "Use for building a contextual AI assistant in a dismissible or pinned sidebar where a user can enter a prompt and get results vertically while viewing the main application.",
        "keywords": ["chat", "sidebar", "gemini", "ai", "assistant", "panel", "message"],
        "schema": "messages: array, onSendMessage: function",
        "signature": "Natural Language",
        "scalability": "Medium",
        "persona": "All",
        "complexity": "Medium",
        "priority": "Specialized",
        "specifications": get_comp_spec("chat")
    })
    skills.append({
        "id": "chat_field", "name": "Gemini Command Field", "category": "components",
        "description": "Inline AI command field to instruct the application",
        "usage_context": "Use for a search-like input field where the user enters a prompt to update their application state or instruct the app with commands. It does not display a chat history.",
        "keywords": ["chat", "command", "field", "gemini", "ai", "prompt", "input"],
        "schema": "onSendMessage: function, placeholder: string",
        "signature": "Natural Language",
        "scalability": "Low",
        "persona": "All",
        "complexity": "Low",
        "priority": "Specialized",
        "specifications": get_comp_spec("chat")
    })
    skills.append({
        "id": "typography", "name": "Typography System", "category": "components",
        "description": "Full sizing and weight scale for H1-H6 and Body text",
        "usage_context": "Use for maintaining consistent hierarchical text sizing, headers, and readability across the interface.",
        "keywords": ["font", "text", "heading", "body", "size", "weight"],
        "schema": "variant: string, children: string",
        "signature": "Text hierarchical",
        "scalability": "High",
        "persona": "All",
        "complexity": "Low",
        "priority": "Primary",
        "specifications": typography_spec
    })

    # Generate Shared Chart Settings
    chart_shared_specs = {
        "palette": chart_colors,
        "light": {
            "background": specs.get("light", {}).get("card", {}).get("bg", "#ffffff"),
            "gridLineColor": specs.get("light", {}).get("chart", {}).get("gridLineColor", specs.get("light", {}).get("card", {}).get("borderColor", "#e2e8f0")),
            "textColor": specs.get("light", {}).get("typography", {}).get("small", {}).get("color", "#64748b"),
            "tooltipBg": specs.get("light", {}).get("chart", {}).get("tooltipBg", "#ffffff"),
            "tooltipText": specs.get("light", {}).get("chart", {}).get("tooltipText", "#484747")
        },
        "dark": {
            "background": specs.get("dark", {}).get("card", {}).get("bg", "#1a1a1a"),
            "gridLineColor": specs.get("dark", {}).get("chart", {}).get("gridLineColor", specs.get("dark", {}).get("card", {}).get("borderColor", "#1e293b")),
            "textColor": specs.get("dark", {}).get("typography", {}).get("small", {}).get("color", "#94a3b8"),
            "tooltipBg": specs.get("dark", {}).get("chart", {}).get("tooltipBg", "#334155"),
            "tooltipText": specs.get("dark", {}).get("chart", {}).get("tooltipText", "#f8fafc")
        }
    }

    shared_visuals_content = f"""---
name: shared_visuals
category: visualizations
description: Shared visual attributes for all charts
---

# Shared Visualization Attributes

```json
{json.dumps(chart_shared_specs, indent=2)}
```

## Responsive Grid Layout for Charts
Charts should ALWAYS be encapsulated in a responsive layout grid.
- Use responsive Tailwind grid utilities (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for laying out multiple UI components or charts.
- Individual chart containers must ensure they adjust to their wrapper (e.g. `w-full min-h-[300px]`) so they scale correctly across device formats.
"""
    shared_path = charts_dir / "shared_visuals.md"
    with open(shared_path, "w") as f:
        f.write(shared_visuals_content.strip())
    files_to_zip.append(shared_path)

    # --- VISUALIZATIONS ---
    chart_definitions = {
        # Standard
        "line_chart": {
            "category": "visualizations", 
            "keywords": ["line", "trend", "temporal", "series"], 
            "schema": "data: array, axes: object", 
            "desc": "Best for showing continuous data over time; highlights overall trends and changes.",
            "signature": "1 Temporal, 1+ Numerical",
            "scalability": "High density allowed",
            "persona": "All",
            "complexity": "Low",
            "priority": "Primary"
        },
        "area_chart": {
            "category": "visualizations", 
            "keywords": ["area", "volume", "stacked", "magnitude"], 
            "schema": "data: array, axes: object", 
            "desc": "Similar to line charts but emphasizes magnitude of change by filling area below the line.",
            "signature": "1 Temporal, 1+ Numerical (Stacked)",
            "scalability": "Best for 2-5 series",
            "persona": "Business, Analyst",
            "complexity": "Low",
            "priority": "Primary"
        },
        "column_chart": {
            "category": "visualizations", 
            "keywords": ["column", "vertical bar", "comparison", "small"], 
            "schema": "data: array, axes: object", 
            "desc": "Best for comparing values across separate categories where there are few categories.",
            "signature": "1 Categorical, 1 Numerical",
            "scalability": "Low (< 10 categories)",
            "persona": "All",
            "complexity": "Low",
            "priority": "Primary"
        },
        "bar_chart": {
            "category": "visualizations", 
            "keywords": ["bar", "horizontal", "ranking", "long labels"], 
            "schema": "data: array, axes: object", 
            "desc": "Best for comparing categories, especially with many items or long labels.",
            "signature": "1 Categorical, 1 Numerical",
            "scalability": "High (> 15 categories)",
            "persona": "All",
            "complexity": "Low",
            "priority": "Primary"
        },
        "pie_chart": {
            "category": "visualizations", 
            "keywords": ["pie", "proportion", "slices", "part-to-whole"], 
            "schema": "data: array, axes: object", 
            "desc": "Shows relative proportions of categories; best for 2-5 slices.",
            "signature": "1 Categorical, 1 Numerical (Sum=100%)",
            "scalability": "Very Low (2-5 slices)",
            "persona": "Executive",
            "complexity": "Low",
            "priority": "Specialized"
        },
        "donut_chart": {
            "category": "visualizations", 
            "keywords": ["donut", "ring", "proportion", "total"], 
            "schema": "data: array, axes: object", 
            "desc": "Similar to pie chart but center can display total value or key metric.",
            "signature": "1 Categorical, 1 Numerical",
            "scalability": "Very Low (2-5 slices)",
            "persona": "Executive",
            "complexity": "Low",
            "priority": "Specialized"
        },
        "scatter_plot": {
            "category": "visualizations", 
            "keywords": ["scatter", "correlation", "relationship", "outliers"], 
            "schema": "data: array, axes: object", 
            "desc": "Best for showing relationship or correlation between two numerical variables.",
            "signature": "2 Numerical (X, Y)",
            "scalability": "High density (points)",
            "persona": "Analyst, Data Scientist",
            "complexity": "Medium",
            "priority": "Primary"
        },

        # Distributions
        "histogram": {
            "category": "visualizations", 
            "keywords": ["distribution", "frequency", "bins"], 
            "schema": "ranges: array, frequency: numeric[]", 
            "desc": "Shows distribution of a continuous variable divided into bins.",
            "signature": "1 Continuous Numerical",
            "scalability": "Medium (10-30 bins)",
            "persona": "Analyst, Scientist",
            "complexity": "Medium",
            "priority": "Primary"
        },
        "heatmap": {
            "category": "visualizations", 
            "keywords": ["matrix", "correlation", "intensity", "density"], 
            "schema": "ranges: array, frequency: numeric[]", 
            "desc": "Shows magnitude of data in a 2D matrix using color gradients.",
            "signature": "2 Categorical, 1 Numerical",
            "scalability": "High (Large matrices)",
            "persona": "Analyst, Power User",
            "complexity": "Medium",
            "priority": "Specialized"
        },
        "boxplot": {
            "category": "visualizations", 
            "keywords": ["outliers", "quartiles", "variance", "spread"], 
            "schema": "ranges: array, frequency: numeric[]", 
            "desc": "Comparing distributions across groups, highlighting median and outliers.",
            "signature": "1 Categorical, 1 Numerical (dist)",
            "scalability": "Medium (5-12 groups)",
            "persona": "Analyst, Scientist",
            "complexity": "High",
            "priority": "Specialized"
        },

        # Maps
        "world_map": {
            "category": "visualizations", 
            "keywords": ["global", "countries", "international", "geography", "map", "location", "region"], 
            "schema": "region: string, value: number", 
            "desc": "Visualizing country-level data globally via color intensity.",
            "signature": "1 Country Geo, 1 Numerical",
            "scalability": "Global breadth",
            "persona": "Executive, Global Ops",
            "complexity": "Low",
            "priority": "Primary"
        },
        "usa_map": {
            "category": "visualizations", 
            "keywords": ["usa", "states", "domestic", "geography", "map", "location", "region"], 
            "schema": "region: string, value: number", 
            "desc": "Visualizing state-level data across the United States.",
            "signature": "1 US State Geo, 1 Numerical",
            "scalability": "50 states",
            "persona": "Regional Mgr, Executive",
            "complexity": "Low",
            "priority": "Primary"
        },

        # Flow & Hierarchy
        "sankey": {
            "category": "visualizations", 
            "keywords": ["flow", "journey", "conversion", "budget"], 
            "schema": "children: array, value: number", 
            "desc": "Best for showing flow of resources or journeys between states.",
            "signature": "2+ Categorical (Stages), 1 Numerical",
            "scalability": "Medium complexity flow",
            "persona": "Analyst, Strategist",
            "complexity": "High",
            "priority": "Specialized"
        },
        "treemap": {
            "category": "visualizations", 
            "keywords": ["hierarchy", "proportions", "nested", "allocation"], 
            "schema": "children: array, value: number", 
            "desc": "Hierarchical data as nested rectangles; great for large category sets.",
            "signature": "1-2 Categorical (Parent/Child), 1 Numerical",
            "scalability": "High (> 20 categories)",
            "persona": "Portfolio Mgr, Analyst",
            "complexity": "Medium",
            "priority": "Specialized"
        },
        "funnel": {
            "category": "visualizations", 
            "keywords": ["drop-off", "conversion", "sales pipeline"], 
            "schema": "children: array, value: number", 
            "desc": "Progressive reduction of data as it passes through phases.",
            "signature": "1 Categorical (Sequential), 1 Numerical",
            "scalability": "3-7 stages",
            "persona": "Sales, Marketing, Ops",
            "complexity": "Low",
            "priority": "Primary"
        },

        # Specialized
        "gauge": {
            "category": "visualizations", 
            "keywords": ["target", "kpi", "speedometer", "status"], 
            "schema": "nodes: array, links: array, metrics: string[]", 
            "desc": "Single metric relative to a goal or target range.",
            "signature": "1 Numerical (Value vs Goal)",
            "scalability": "Single point",
            "persona": "Executive, Ops",
            "complexity": "Low",
            "priority": "Specialized"
        },
        "radar": {
            "category": "visualizations", 
            "keywords": ["spider", "multivariate", "profile", "comparison"], 
            "schema": "nodes: array, links: array, metrics: string[]", 
            "desc": "Comparing multiple entities across 3-8 different quantitative variables.",
            "signature": "1 Categorical, 3-8 Numerical metrics",
            "scalability": "Low (1-3 entities)",
            "persona": "Analyst, HR, Product",
            "complexity": "Medium",
            "priority": "Specialized"
        },

        # Time
        "sparkline": {
            "category": "visualizations", 
            "keywords": ["inline", "micro", "quick trend"], 
            "schema": "timestamp: string, value: number", 
            "desc": "Tiny line chart for embedding within text or tables.",
            "signature": "1 Temporal, 1 Numerical",
            "scalability": "Very compact",
            "persona": "All",
            "complexity": "Low",
            "priority": "Primary"
        },
        "candlestick": {
            "category": "visualizations", 
            "keywords": ["candlestick", "ohlc", "financial", "stock"], 
            "schema": "timestamp: string, open: number, high: number, low: number, close: number", 
            "desc": "Used for financial and stock price movements showing open, high, low, and close values.",
            "signature": "1 Temporal, 4 Numerical",
            "scalability": "Medium",
            "persona": "Trader, Analyst",
            "complexity": "High",
            "priority": "Specialized"
        },
        "ridgeline": {
            "category": "visualizations", 
            "keywords": ["ridgeline", "joyplot", "distribution", "density"], 
            "schema": "category: string, value: number, group: string", 
            "desc": "Shows distribution of a numeric value for several groups.",
            "signature": "1 Categorical, 1 Continuous Numerical, 1 Grouping",
            "scalability": "Medium",
            "persona": "Scientist, Analyst",
            "complexity": "High",
            "priority": "Specialized"
        },
        "density_plot": {
            "category": "visualizations", 
            "keywords": ["density plot", "distribution", "variance"], 
            "schema": "value: number", 
            "desc": "Visualizes the distribution of data over a continuous interval or time period.",
            "signature": "1 Continuous Numerical",
            "scalability": "Medium",
            "persona": "Scientist, Analyst",
            "complexity": "Medium",
            "priority": "Specialized"
        },
        "violin": {
            "category": "visualizations", 
            "keywords": ["violin", "distribution", "spread", "density"], 
            "schema": "category: string, value: number", 
            "desc": "Similar to box plot, but with a rotated kernel density plot on each side.",
            "signature": "1 Categorical, 1 Numerical",
            "scalability": "Low",
            "persona": "Scientist, Analyst",
            "complexity": "High",
            "priority": "Specialized"
        },
        "network_graph": {
            "category": "visualizations", 
            "keywords": ["network", "graph", "connections", "nodes", "edges"], 
            "schema": "nodes: array, links: array", 
            "desc": "Displays complex relationships between entities.",
            "signature": "Nodes and Edges",
            "scalability": "High",
            "persona": "Data Scientist, Analyst",
            "complexity": "High",
            "priority": "Specialized"
        },
        "geo_point_map": {
            "category": "visualizations", 
            "keywords": ["geo point", "coordinates", "lat long", "map"], 
            "schema": "latitude: number, longitude: number, value: number", 
            "desc": "Maps individual data points geographically by coordinates.",
            "signature": "2 Geo (Lat/Long), 1 Numerical",
            "scalability": "High",
            "persona": "Analyst, Ops",
            "complexity": "Medium",
            "priority": "Specialized"
        },
        "tile_map": {
            "category": "visualizations", 
            "keywords": ["tile map", "grid map", "spatial"], 
            "schema": "x: number, y: number, value: number", 
            "desc": "Abstract geographic map using equal-sized tiles.",
            "signature": "X/Y Coordinates, 1 Numerical",
            "scalability": "Medium",
            "persona": "Analyst",
            "complexity": "Medium",
            "priority": "Specialized"
        },
        "workflow_diagram": {
            "category": "components", 
            "keywords": ["workflow", "diagram", "process", "flowchart"], 
            "schema": "steps: array", 
            "desc": "Visualizes a step-by-step process or flowchart.",
            "signature": "Sequential nodes",
            "scalability": "Low",
            "persona": "Ops, PM",
            "complexity": "Medium",
            "priority": "Specialized"
        }
    }

    for chart_id, chart_info in chart_definitions.items():
        skills.append({
            "id": chart_id, 
            "name": chart_id.replace("_", " ").title(), 
            "category": chart_info["category"],
            "description": chart_info["desc"],
            "usage_context": chart_info["desc"],
            "keywords": chart_info["keywords"],
            "schema": chart_info["schema"],
            "signature": chart_info.get("signature", "N/A"),
            "scalability": chart_info.get("scalability", "N/A"),
            "persona": chart_info.get("persona", "All"),
            "complexity": chart_info.get("complexity", "Low"),
            "priority": chart_info.get("priority", "Primary"),
            "specifications": None
        })

    for skill in skills:
        if skill['category'] == 'visualizations':
            specs_block = "See `ui/charts/shared_visuals.md` for shared color, grid, and background attributes. You must map these visual tokens into the configuration object of the charting library you use. Do not use raw SVG data to draw charts."
            category_dir = charts_dir
        else:
            specs_json = json.dumps(skill.get("specifications", {}), indent=2)
            specs_block = f"""For all padding, color, borders, and typography styling, you MUST look up the exact values for this component in `design/visual_spec.skill.md` and apply them as inline Tailwind CSS arbitrary values.

### Component-Specific Tokens
Use these exact hex codes and measurements for {skill['name']}:
```json
{specs_json}
```"""
            category_dir = components_dir

        skill_path = category_dir / f"{skill['id']}.md"
        content = ""
        
        # SMART MERGE: If the file already exists, we preserve it and JUST replace the Visual Specifications block
        if skill_path.exists():
            with open(skill_path, "r") as f:
                existing_content = f.read()
                
            # Use regex to find and replace the Visual Specifications block
            # This looks for the heading and replaces everything until the next heading
            pattern = r"(## Visual Specifications\n)(.*?)(?=\n## |$)"

            
            # If the block was found and replaced
            if re.search(pattern, existing_content, flags=re.DOTALL):
                 # Use lambda to prevent backreference issues if specs_block contains raw strings
                 content = re.sub(pattern, lambda m: m.group(1) + specs_block + "\n\n", existing_content, flags=re.DOTALL)
            else:
                 # If the heading wasn't found (user deleted it?), just append it
                 content = existing_content + f"\n\n## Visual Specifications\n{specs_block}\n\n"
        else:
            # File doesn't exist, create it from scratch
            
            map_guidelines = ""
            if "map" in skill['id']:
                map_guidelines = """
**Map Layout & Styling Rules**:
- **Size & Height**: Ensure the map container has an adequate minimum height (e.g., `minHeight: 400px` or `500px`) so the geographic area is fully visible and not squished.
- **Legend Placement**: Do not allow the legend to obscure the map. Place the legend completely outside the map region (such as below or adjacent to the map) rather than overlaying it on top of the geographical areas. Ensure legends do not have an opaque background that hides data.
- **Background & Theme Match**: The map background color must strictly match the current active theme (e.g., the `background` property in `shared_visuals.md`). Apply the same color to the map component itself to prevent unsightly color clashes.
"""
            kpi_guidelines = ""
            if "cards_kpi" in skill['id']:
                kpi_guidelines = """
**Trend Indicator Rules**:
- **Positive Trend**: Use the `successText` color hex from `visual_spec.skill.md` and an upward-pointing arrow icon next to the percentage/value change.
- **Negative Trend**: Use the `errorText` color hex from `visual_spec.skill.md` and a downward-pointing arrow icon.
- **Stable Trend**: Use the `text_secondary` color hex and a standard dash or sideways arrow to indicate no significant change.
- **Placement**: Trend indicators should be placed immediately adjacent to the primary KPI value or on a dedicated line directly below it, using a smaller typography variant (e.g., `small` or `xs`).

**Typography & Text Color Rules**:
- You must apply `titleColor` from the Component-Specific Tokens as the inline style for the card's title text (e.g., `style={{ color: '#...' }}`).
- CRITICAL: You MUST apply `valueColor` from the Component-Specific Tokens uniformly to ALL main KPI values (e.g., `style={{ color: '#...' }}`). DO NOT apply individual semantic colors (e.g., differing colors for distinct KPIs like red for churn or blue for population) to the main KPI values. Every single KPI value MUST use the exact same `valueColor`.
- For the title's font size and weight, you MUST look up the base typography token referenced by `titleTypography` in the `visual_spec.skill.md` typography section and apply its exact `fontSize`, `fontWeight`, etc.
- For the value's font size and weight, you MUST look up the base typography token referenced by `valueTypography` in the `visual_spec.skill.md` typography section and apply its exact `fontSize`, `fontWeight`, etc.

**Progress Bar Rules**:
- CRITICAL: Do NOT add arbitrary progress bars to KPI cards or any other component. Progress bars are ONLY permissible if the underlying data has a known, explicit upper bound, target, or goal value to accurately determine progress. If these known bounds are absent, progress bars are strictly forbidden.
"""
            table_guidelines = ""
            if "data_table" in skill['id']:
                table_guidelines = """
**Table Typography Rules**:
- You must apply `headerText` color from the Component-Specific Tokens as the inline style for all table header (`<th>`) text.
- You must apply `rowText` color from the Component-Specific Tokens as the inline style for all standard data row (`<td>`) text.
- For headers, you MUST look up the typography token referenced by `headerTypography` (e.g. `xs` or `small`) in `visual_spec.skill.md` and apply its exact `fontSize`, `fontWeight`, etc.
- For rows, you MUST look up the base typography token referenced by `rowTypography` in `visual_spec.skill.md` and apply its exact `fontSize`, `fontWeight`, etc.

**Progress Bar Rules**:
- CRITICAL: Do NOT add arbitrary progress bars to table cells. Progress bars are ONLY permissible if the underlying data has a known, explicit upper bound, target, or goal value. If these known bounds are absent, progress bars are strictly forbidden.
"""
            nav_guidelines = ""
            if "navigation" in skill['id']:
                nav_guidelines = """
**Navigation Layout & Styling Rules**:
- **Wayfinding (Breadcrumbs & Tabs)**: 
  - **Tabs**: Use `borderColor` for the bottom border of the tab container, `activeBorder` for the bottom border of the selected tab, `activeText` for the text color of the selected tab, `inactiveText` for the default text color of unselected tabs, and `hoverText` on hover.
  - **Breadcrumbs**: Use `inactiveText` for breadcrumb previous path values, `hoverText` on hover, and `activeText` for the current page value.
"""
            content = f"""---
name: {skill['id']}
category: {skill['category']}
description: {skill['description']}
intent_keywords: {json.dumps(skill['keywords'])}
schema: {skill['schema']}
---

# {skill['name']} Skill

## Visual Specifications
{specs_block}

## Recommended Implementation Pattern
This component should be rendered using the DAK Hyperskills guidelines. 
Components mapping straight to recharts, lucide-react, echarts-for-react, d3, 
or other pre-built libraries if specified by skills.
It inherits global themes from `theme.md`.
{map_guidelines}{kpi_guidelines}{table_guidelines}{nav_guidelines}
## Usage Context
{skill.get('usage_context', skill['description'])}
"""
        with open(skill_path, "w") as f:
            f.write(content.strip())
        print(f"Updated skill file: {skill_path}")
        files_to_zip.append(skill_path)

    # 4. Generate router.md (Discovery Layer)
    router_content = """---
name: discovery_router
description: Advanced data-centric reasoning engine for mapping user intents to UI and Visualization skills
---

# Discovery & Reasoning Router

This skill is the "brain" of the component selection process. You MUST use the following framework to decide which components and visualizations are best suited for the user's data and objectives.

## 1. Selection Philosophy
To select the correct component, follow this reasoning loop:
1.  **Analyze Data Shape**: Identify if the data is categorical (discrete buckets), temporal (time-series), geospatial (locations), or relational (correlations/networks).
2.  **Identify User Outcome**: Determine if the goal is to **Compare** values, show **Distribution**, track **Trends**, visualize **Composition**, or map **Flow**.
3.  **Layout Assumption Fallback**: If the app archetype/layout is ambiguous, quietly fall back to using the 'Executive Summary' grid as the baseline layout. Do NOT output any user-facing textual notes or warnings about this assumption in the generated app.
4.  **Rank and Select**: Use the catalog below to pick the component that scores highest across both Data Shape and Outcome requirements.

## 2. Data Archetype Mapping
| Data Archetype | Recommended Skills | Why? |
|---|---|---|
| **Categorical** | `bar_chart`, `column_chart`, `pie_chart`, `treemap` | Best for discrete groupings and part-to-whole relationships. |
| **Temporal** | `line_chart`, `area_chart`, `candlestick`, `ridgeline` | Best for showing change, trends, and volatility over time. |
| **Geospatial** | `world_map`, `usa_map`, `geo_point_map`, `tile_map` | Best for revealing geographic patterns and regional performance. |
| **Relational** | `scatter_plot`, `heatmap`, `network_graph`, `radar` | Best for correlation, density, and multi-variable connectivity. |
| **Metric / KPI** | `cards_kpi`, `gauge`, `sparkline` | Best for "at-a-glance" status and high-level performance tracking. |

## 3. Outcome-Oriented Routing
- **Comparison**: Use `bar_chart` (many items), `column_chart` (few items), or `radar` (multi-metric).
- **Distribution**: Use `histogram`, `boxplot`, `density_plot`, or `violin` to show variance and spread.
- **Composition**: Use `pie_chart` (2-5 items), `donut_chart`, or `treemap` (complex hierarchies).
- **Flow / Process**: Use `sankey` for resource flow, `funnel` for conversion, or `workflow_diagram`.
- **Relationship**: Use `scatter_plot` (two variables) or `heatmap` (matrix/correlation).
- **Detailed Audit**: Use `data_table` for deep-dive record inspections with sorting and search.

## 4. Component Catalog (Registry)

| Category | Keywords | Data Signature | Scalability | Persona | Complexity | Priority | Skill File |
|---|---|---|---|---|---|---|---|
"""
    for skill in skills:
        intent_str = " / ".join(skill['keywords'][:5])
        folder = "charts" if skill['category'] == 'visualizations' else "components"
        router_content += f"| {skill['category'].title()} | {intent_str} | {skill.get('signature', 'N/A')} | {skill.get('scalability', 'N/A')} | {skill.get('persona', 'All')} | {skill.get('complexity', 'Low')} | {skill.get('priority', 'Primary')} | ui/{folder}/{skill['id']}.md |\n"
    
    router_path = export_dir / "router.md"
    with open(router_path, "w", encoding="utf-8") as f:
        f.write(router_content.strip() + "\n")
    files_to_zip.append(router_path)

    # 4.5 Add manual skill files that are not python-generated
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
            files_to_zip.append(path)

    workflows_dir = export_dir / ".agent" / "workflows"
    workflows_dir.mkdir(parents=True, exist_ok=True)
    workflow_content = """---
description: How to build a new app using the DAK Hyperskills
---
When I ask you to build a new application or add a feature, you must execute the following steps:

1. Read `orchestrator.skill.md` and `app_approach.skill.md` to understand user archetype and workflow.
2. Read `design/visual_spec.skill.md` and `design/layout.skill.md` for styling constraints and layouts.
3. Read `router.md` to map the requested feature to the correct UI component skills.
4. Inspect the `ui/` and `data/` folders to see what components and data tools are available.
5. Only after reading these files should you begin making an implementation plan or writing code.
"""
    workflow_path = workflows_dir / "design_system_bootstrap.md"
    with open(workflow_path, "w") as f:
        f.write(workflow_content.strip() + "\n")
    files_to_zip.append(workflow_path)

    rules_content = """# DAK Hyperskills Rules

Whenever you are asked to create, modify, or plan a new application or component in this repository, you MUST ALWAYS read and strictly adhere to the following design system definitions:

1. `design/visual_spec.skill.md` - Use this for all design tokens, colors, typography, and spacing.
2. `app_approach.skill.md`, `orchestrator.skill.md`, and `design/layout.skill.md` - Follow the core architecture, layout rules, and component hierarchy defined here.
3. `router.md` - Use this to map user intents to the correct page structures.
4. `ui/` directory - This folder contains all the approved UI components. You must use these pre-defined components instead of writing custom elements from scratch.

Do not write any new code until you have reviewed these files."""
    rules_path = export_dir / ".cursorrules"
    with open(rules_path, "w") as f:
        f.write(rules_content)
    files_to_zip.append(rules_path)

    return files_to_zip

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
def create_theme(data: dict, request: Request):
    require_admin(request)
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
def update_theme(theme_id: str, data: dict, request: Request):
    require_admin(request)
    theme_dir = get_theme_dir(theme_id)
    meta_path = theme_dir / "metadata.json"
    meta = {}
    if meta_path.exists():
        with open(meta_path, "r") as f:
            meta = json.load(f)
    
    for k, v in data.items():
        meta[k] = v
        
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    return meta

@app.delete("/api/themes/{theme_id}")
def delete_theme(theme_id: str, request: Request):
    require_admin(request)
    import shutil
    theme_dir = get_theme_dir(theme_id)
    if theme_dir.exists():
         shutil.rmtree(theme_dir)
    return {"status": "deleted"}

@app.post("/api/export-skills")
async def export_skills(request: Request, theme_id: str = "dak_default"):
    require_admin(request)
    root_dir = Path(__file__).resolve().parent.parent
    export_dir = root_dir / "backend"/ "themes" / theme_id / "generated_skills"
    
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
def save_specs(specs: dict, request: Request, theme_id: str = "dak_default"):
    require_admin(request)
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


@app.get("/api/active_theme_id")
def get_active_theme_id():
    pref_path = Path(__file__).parent / "active_theme_pref.json"
    if not pref_path.exists():
        return {"activeThemeId": "dak_default"}
    import json
    with open(pref_path, "r") as f:
        return json.load(f)

@app.post("/api/active_theme_id")
def save_active_theme_id(data: dict, request: Request):
    require_admin(request)
    pref_path = Path(__file__).parent / "active_theme_pref.json"
    import json
    with open(pref_path, "w") as f:
        json.dump(data, f, indent=2)
    return {"message": "Active theme ID saved successfully"}

@app.get("/api/theme")
def get_theme():
    # Keep UI preference separate from Data Theme
    theme_path = Path(__file__).parent / "theme_pref.json"
    if not theme_path.exists():
        return {"theme": "light"}
    with open(theme_path, "r") as f:
        return json.load(f)

@app.post("/api/theme")
def save_theme(data: dict, request: Request):
    require_admin(request)
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
def save_chart_colors(data: dict, request: Request, theme_id: str = "dak_default"):
    require_admin(request)
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

@app.post("/api/apps/generate")
def generate_app(request_body: AppGenerateRequest, request: Request):
    require_admin(request)
    root_dir = Path(__file__).resolve().parent.parent
    
    def event_stream():
        yield json.dumps({"type": "status", "message": "Initializing generation context..."}) + "\n"
        
        # --- PHASE 1 & 2: Core Files and Intents ---
        system_prompt = "You are an expert Data Cloud Application Developer.\n\n"
        
        matched_skills = []
        if request_body.use_skills:
            # 1. Read Design Constraints
            yield json.dumps({"type": "info", "message": "Reading visual_spec.skill.md for design tokens..."}) + "\n"
            theme_path = root_dir / "backend"/ "themes" / request_body.theme_id / "generated_skills" / "design" / "visual_spec.skill.md"
            if theme_path.exists():
                with open(theme_path, "r") as f:
                    system_prompt += "### 1. VISUAL DESIGN CONSTRAINTS (design/visual_spec.skill.md)\n"
                    system_prompt += f"{f.read()}\n\n"

            # 2. Read App Orchestrator, Approach, and Layout
            for name, path_suffix in [("APP APPROACH", "app_approach.skill.md"), ("ORCHESTRATOR", "orchestrator.skill.md"), ("LAYOUT PATTERNS", "design/layout.skill.md")]:
                full_path = root_dir / "backend"/ "themes" / request_body.theme_id / "generated_skills" / path_suffix
                if full_path.exists():
                    yield json.dumps({"type": "info", "message": f"Assessing {path_suffix}..."}) + "\n"
                    with open(full_path, "r") as f:
                        system_prompt += f"### {name} ({path_suffix})\n"
                        system_prompt += f"{f.read()}\n\n"
                    
            # 3. Read Router (Component catalog)
            router_path = root_dir / "backend"/ "themes" / request_body.theme_id / "generated_skills" / "router.md"
            router_content = ""
            if router_path.exists():
                yield json.dumps({"type": "info", "message": "Scanning router.md for available UI components..."}) + "\n"
                with open(router_path, "r") as f:
                    router_content = f.read()
                    system_prompt += "### 3. COMPONENT CATALOG (router.md)\n"
                    system_prompt += f"{router_content}\n\n"

            # --- PHASE 3: Selective Component Loading ---
            system_prompt += "### 4. SELECTED COMPONENT SKILLS\n"
            system_prompt += "Based on the user's prompt, the following components and visualizations are highly relevant. Follow their specifications carefully:\n"
            
            # Parse the Router to find matched skills
            user_prompt_lower = request_body.prompt.lower()
            lines = router_content.split('\n')
            in_table = False
            
            for line in lines:
                line = line.strip()
                if line.startswith('|---'):
                    in_table = True
                    continue
                
                if in_table and line.startswith('|'):
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 9:
                        keywords_str = parts[2]
                        skill_file = parts[8].strip()
                        
                        keywords = [k.strip().lower() for k in keywords_str.split('/')]
                        
                        # Extract descriptive words from the filename to ensure explicit requests like 'heatmap' match
                        skill_name = skill_file.split('/')[-1].replace('.md', '').replace('_', ' ').lower()
                        file_words = [w for w in re.split(r'[_/.]', skill_file.lower()) 
                                      if w and w not in ['ui', 'components', 'charts', 'md', 'chart', 'data', 'plot', 'map']]
                        
                        all_matchers = keywords + [skill_name] + file_words
                        
                        match_found = any(re.search(r'\b' + re.escape(kw) + r'\b', user_prompt_lower) for kw in all_matchers if kw)
                        
                        # Always include baseline components
                        always_include = ["button.md", "typography.md", "overlays.md"]
                        is_core = any(core_file in skill_file for core_file in always_include)
                        
                        if match_found or is_core:
                            skill_path = root_dir / "backend"/ "themes" / request_body.theme_id / "generated_skills" / skill_file
                            if skill_path.exists():
                                matched_skills.append(skill_file)
                                with open(skill_path, "r") as sf:
                                    system_prompt += f"\n--- SKILL: {skill_file} ---\n{sf.read()}\n"

            yield json.dumps({"type": "info", "message": f"Matched {len(matched_skills)} relevant skills to your prompt!"}) + "\n"
            for s in matched_skills:
                yield json.dumps({"type": "info", "message": f"Injecting Component Skill: {s}"}) + "\n"
                time.sleep(0.05)

            system_prompt += "\n\nCRITICAL INSTRUCTIONS:\n" \
                             "1. ROLE: You are an Expert React Developer building a gorgeous Data Application for the Data Cloud Playground.\n" \
                             "2. DESIGN SYSTEM ADHERENCE: You should try to use the color, spacing, corner radius, borders, layout, shadow, typography, interaction rules, and default views from the skills context where applicable, but if an aesthetic is missing you should supply standard tailwind classes or styles (i.e. 'text-slate-500 text-sm') matching the visual guidelines of a sleek modern data application.\n" \
                             "3. COMPONENT UTILIZATION: You must build the DAK Hyperskills components directly in your code using the uploaded skill files as your implementation and design guide. Do not assume any pre-built components are available to import. Use the skill files' schemas, layout patterns, and functionality rules to construct them.\n" \
                             "4. INTERACTION: Components MUST be functional. Tabs must switch content, sidebars must toggle, utility buttons must have hover states. \n" \
                             "5. VISUAL EXCELLENCE: For all UI components, you must style them inline using precise Tailwind arbitrary classes mapped to the exact hex codes from `visual_spec.skill.md`. Do not use generic Tailwind colors. Furthermore, for ANY text (headings, paragraphs, KPI values, table rows, etc.), you MUST explicitly apply the exact `fontSize` (in px), `fontWeight`, and `color` specified in the corresponding `typography` token from `visual_spec.skill.md`. Do not use generic Tailwind text sizes like text-lg or font-bold.\n" \
                             "6. MOCK DATA: You MUST generate robust, realistic mock data for EVERYTHING so the app functions perfectly. If there are charts, generate arrays with at least 15 data points. If there are tables, generate about 50 rows of data. CRITICAL: To avoid exceeding token limits, you MUST write a highly compact JavaScript generation loop (e.g., `Array.from({ length: 50 }, ...)`). NEVER hardcode large arrays of JSON objects.\n" \
                             "7. OUTPUT FORMAT: You must output your response in TWO distinct parts.\n" \
                             "   PART 1: A JSON block containing your thought process. It must exactly match this structure:\n" \
                             "   ```json\n" \
                             "   {\n" \
                             "     \"interpretation\": \"How you interpreted the persona and goals.\",\n" \
                             "     \"skills_utilized\": [\"list of exact .md skill files you used\"],\n" \
                             "     \"assumed_from_scratch\": [\"List of complex pieces you had to hallucinate or build without a skill file (e.g. heatmap, filter pane)\"],\n" \
                             "     \"skill_suggestions\": \"Actionable advice on what new markdown skill files should be created based on your assumptions.\"\n" \
                             "   }\n" \
                             "   ```\n" \
                             "   PART 2: The React Component. Wrap your code in a standard markdown `jsx` code block. Give your `export default function` a highly descriptive name (e.g., `export default function SalesMonitor()`). Do NOT include any explanations outside of these two blocks.\n" \
                             "7. STRICT DEMAND FOR FUNCTIONALITY: You are forbidden from creating UI elements that do not work. Every single button, tab, hamburger menu, overlay, or control MUST have working state logic implemented. \n" \
                             "   - Tabs: NEVER add tabs unless you fully implement the state (`activeTab`) and render distinct working panels for each tab.\n" \
                             "   - Hamburger Menus: If you add a hamburger menu icon, it MUST have an onClick handler that toggles a state variable (e.g. `isSidebarOpen`) which actually shows/hides the sidebar. Dead toggle buttons are strictly forbidden.\n" \
                             "   - Buttons: NEVER add 'Export', 'Download', or 'Share' buttons unless they actually trigger the respective functionality.\n" \
                             "8. PURITY & SCOPE: You are ENCOURAGED to proactively add helpful, functional controls like date pickers and category filters that improve the core data dashboard, but EVERY element must be fully functional. Do NOT add decorative junk like user avatars, dead \"Generate Report\", \"Global View\" or \"Export CSV\" buttons, or unrequested generic \"Key Findings\" sidebars. NEVER add decorative icons next to text labels, filter titles, or headers. Never use a search icon for a sidebar toggle; use a bare, un-styled Hamburger menu with NO background color, and ensure IT WORKS. Sidebars MUST go under top-headers.\n" \
                             "9. NO SYNTAX ERRORS: The React Component you output MUST be completely valid, error-free JSX/JavaScript without any missing brackets, missing closing tags, trailing commas, or syntax errors. Ensure the code compiles cleanly and correctly.\n" \
                             "10. VISUALIZATIONS & CHARTS: For standard charts (line, bar, area, pie, etc.), you MUST use a standard charting library like `Recharts`. However, for any geographical maps (World Map, USA Map, Geo Point Map), you MUST NOT use Recharts; instead, you MUST use the native Google Maps Custom Elements (`<gmp-map>` and `<gmp-advanced-marker>`) as specified in the map skill files. NEVER simulate maps using a Recharts ScatterChart or blank grid. Make sure to load the Google Maps script dynamically using a useEffect hook.\n" \
                             "11. CONCISENESS: Keep your code extremely compact. You are under a strict output token limit. Do not add unnecessary comments, and compress logic where possible.\""
        else:
            yield json.dumps({"type": "info", "message": "Using generic generation without curated skills..."}) + "\n"
            system_prompt += "\n\nCRITICAL INSTRUCTIONS:\n" \
                             "1. ROLE: You are an Expert React Developer building a Data Application for the Data Cloud.\n" \
                             "2. MOCK DATA: You MUST generate robust, realistic mock data for EVERYTHING so the app functions perfectly. If there are charts, generate arrays with at least 15 data points. If there are tables, generate about 50 rows of data. CRITICAL: To avoid exceeding token limits, you MUST write a highly compact JavaScript generation loop (e.g., `Array.from({ length: 50 }, ...)`). NEVER hardcode large arrays of JSON objects.\n" \
                             "3. OUTPUT FORMAT: You must output your response in TWO distinct parts.\n" \
                             "   PART 1: A JSON block containing your thought process. It must exactly match this structure:\n" \
                             "   ```json\n" \
                             "   {\n" \
                             "     \"interpretation\": \"How you interpreted the persona and goals.\",\n" \
                             "     \"skills_utilized\": [],\n" \
                             "     \"assumed_from_scratch\": [\"List of complex pieces you had to hallucinate or build\"],\n" \
                             "     \"skill_suggestions\": \"Actionable advice on what new components should be created based on your assumptions.\"\n" \
                             "   }\n" \
                             "   ```\n" \
                             "   PART 2: The React Component. Wrap your code in a standard markdown `jsx` code block. Give your `export default function` a highly descriptive name (e.g., `export default function SalesMonitor()`). Do NOT include any explanations outside of these two blocks.\n" \
                             "4. STRICT DEMAND FOR FUNCTIONALITY: You are forbidden from creating UI elements that do not work. Every single button, tab, hamburger menu, overlay, or control MUST have working state logic implemented. If you add it, it must function. Dead tabs and dead toggle buttons are strictly forbidden.\n" \
                             "5. NO SYNTAX ERRORS: The React Component you output MUST be completely valid, error-free JSX/JavaScript without any missing brackets, missing closing tags, trailing commas, or syntax errors. Ensure the code compiles cleanly and correctly.\n" \
                             "6. VISUALIZATIONS & CHARTS: For standard charts, use a library like Recharts. For geographical maps, you MUST use the native Google Maps Custom Elements (`<gmp-map>` and `<gmp-advanced-marker>`) with a dynamic script loader. NEVER simulate maps using Recharts ScatterChart or raw SVGs.\n" \
                             "7. CONCISENESS: Keep your code extremely compact. You are under a strict output token limit. Do not add unnecessary comments, and compress logic where possible.\""

        prompt_to_send = request_body.prompt
        max_attempts = 2
        
        for attempt in range(max_attempts):
            if attempt == 0:
                yield json.dumps({"type": "status", "message": "Prompt completed. Generating application code..."}) + "\n"

            # 2. Call Gemini Data Analytics API
            try:
                chat_request = gemini.ChatRequest(
                    parent=f"projects/{PROJECT_ID}/locations/{LOCATION}",
                    messages=[gemini.Message(user_message=gemini.UserMessage(text=prompt_to_send))],
                    inline_context={
                        "system_instruction": system_prompt,
                        "datasource_references": {
                            "bq": {
                                "table_references": [{
                                    "project_id": PROJECT_ID,
                                    "dataset_id": DATASET_ID,
                                    "table_id": TABLE_ID
                                }]
                            }
                        },
                        "options": {"chart": {}}
                    }
                )
                
                response_stream = gemini_client.chat(request=chat_request)
                generated_text = ""
                for chunk in response_stream:
                    if chunk.system_message and chunk.system_message.text:
                        part = "".join(chunk.system_message.text.parts)
                        generated_text += part
                        yield json.dumps({"type": "token", "message": part}) + "\n"
            except Exception as e:
                yield json.dumps({"type": "error", "message": f"LLM Error: {str(e)}"}) + "\n"
                return
        
            if attempt == 0:
                yield json.dumps({"type": "status", "message": "AI finished generating. Processing code blocks..."}) + "\n"
            
            # 1. Extract JSON thought process
            thought_process = {}
            json_match = re.search(r"```json\s*\n(.*?)\n```", generated_text, flags=re.DOTALL | re.IGNORECASE)
            if json_match:
                try:
                    thought_process = json.loads(json_match.group(1))
                except Exception:
                    pass
            
            # 2. Extract JSX Component robustly
            extracted_code = re.sub(r"```json\s*\n.*?\n```", "", generated_text, flags=re.DOTALL | re.IGNORECASE)
            
            matches = re.findall(r"```(?:[a-z]+)?\s*\n(.*?)```(?:$|\n)", extracted_code, flags=re.DOTALL | re.IGNORECASE)
            matches = [m for m in matches if m.strip()]
            
            val = ""
            if matches:
                val = matches[-1].strip()
                for m in reversed(matches):
                    if "import React" in m or "export default" in m:
                        val = m.strip()
                        break
            else:
                fallback = re.search(r"```(?:[a-z]+)?\s*\n(.*)", extracted_code, flags=re.DOTALL | re.IGNORECASE)
                if fallback:
                    val = fallback.group(1).strip()
                else:
                    val = extracted_code.strip()
                    
            # Recursive clean newly extracted chunk
            while True:
                match = re.match(r"^\s*```(?:[a-z]+)?\s*\n", val, flags=re.IGNORECASE)
                if match:
                    val = val[match.end():].strip()
                else:
                    break
                    
            while True:
                match = re.search(r"\n\s*```\s*$", val)
                if match:
                    val = val[:match.start()].strip()
                else:
                    break
                    
            # Handle the weird single-line cut-off trailing backticks
            val = re.sub(r"```\s*$", "", val).strip()
            
            generated_text = val

            # 3. Validate Syntax using esbuild
            import subprocess
            esbuild_path = root_dir / "frontend" / "node_modules" / ".bin" / "esbuild"
            if esbuild_path.exists():
                yield json.dumps({"type": "info", "message": "Validating JSX syntax..."}) + "\n"
                try:
                    process = subprocess.run(
                        [str(esbuild_path), "--loader=jsx"], 
                        input=generated_text.encode('utf-8'),
                        capture_output=True,
                        timeout=10
                    )
                    
                    if process.returncode != 0:
                        error_output = process.stderr.decode('utf-8')
                        if attempt < max_attempts - 1:
                            yield json.dumps({"type": "error", "message": f"Syntax error detected! Asking AI to auto-fix (Attempt {attempt+2}/{max_attempts})..."}) + "\n"
                            # Re-prompt Gemini with the exact esbuild error
                            prompt_to_send = (
                                "You generated the following React component, but it has a syntax error. "
                                "Please fix the error and return the full component again.\n\n"
                                f"### Compiler Error:\n```\n{error_output}\n```\n\n"
                                f"### Your Broken Code:\n```jsx\n{generated_text}\n```\n\n"
                                "Fix the syntax error and output the entire corrected React JSX component."
                            )
                            continue
                        else:
                            yield json.dumps({"type": "error", "message": f"Failed to generate valid syntax: {error_output}"}) + "\n"
                            return # Abort generation
                except Exception as eval_err:
                    yield json.dumps({"type": "error", "message": f"Syntax validation crashed: {str(eval_err)}"}) + "\n"

            break # Valid syntax, break out of retry loop
        
        # 3. Save File
        timestamp = int(time.time())
        app_id = f"App_{timestamp}"
        apps_dir = root_dir / "frontend" / "src" / "generated_apps"
        apps_dir.mkdir(parents=True, exist_ok=True)
        
        with open(apps_dir / f"{app_id}.jsx", "w", encoding="utf-8") as f:
            f.write(generated_text)
            
        title = request_body.prompt[:50] + "..." if len(request_body.prompt) > 50 else request_body.prompt
        match_name = re.search(r"export\s+default\s+(?:function\s+)?([A-Z][A-Za-z0-9_]+)", generated_text)
        if match_name:
            raw_name = match_name.group(1)
            title = re.sub(r"([A-Z])", r" \1", raw_name).strip()

        metadata = {
            "id": app_id,
            "name": title,
            "prompt": request_body.prompt,
            "skills_used": matched_skills,
            "thought_process": thought_process
        }
        
        # Save placeholder JSON to avoid UI crashing while Visual QA runs
        with open(apps_dir / f"{app_id}.json", "w", encoding="utf-8") as f:
            json.dump(metadata, f)
            
        yield json.dumps({"type": "info", "message": "Launching Headless Chromium for Visual QA... waiting for component to mount on frontend."}) + "\n"
        
        # VISUAL QA LOOP
        try:
            from playwright.sync_api import sync_playwright
            import base64
            import requests
            import google.auth
            import google.auth.transport.requests
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page(viewport={"width": 1400, "height": 900})
                page.goto(f"http://127.0.0.1:5900/?app={app_id}", wait_until="networkidle", timeout=25000)
                page.wait_for_timeout(2500) # Give ECharts and Tailwind 2.5s to fully render animations
                
                screenshot_path = str(apps_dir / f"{app_id}.png")
                page.screenshot(path=screenshot_path)
                browser.close()
                
                yield json.dumps({"type": "info", "message": "Snapshot acquired! Executing Gemini Vision multimodal critique."}) + "\n"
                
                with open(screenshot_path, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    
                qa_prompt = f"""
You are an expert Data Application QA Tester.
Analyze the React code that was just generated for this prompt: '{request_body.prompt}'.
More importantly, LOOK at the screenshot provided, which is exactly how the app rendered in the browser.

Analyze:
1. Does it fulfill the user's initial prompt requirements?
2. Does the layout look clean, mathematically aligned, and visually aesthetic based on standard Tailwind/CSS rules? Or are there giant empty gray boxes or broken padding?
3. Did it use the proper UI components or did it hack something together incorrectly?

Output ONLY a JSON block with the following exact keys:
```json
{{
  "prompt_adherence_score": 8,
  "visual_aesthetic_score": 7,
  "qa_analysis": "Detailed critique of the code's fulfillment, layout alignment, and UI usage.",
  "improvement_suggestions": "Specific code or skill file changes to improve this app."
}}
```
"""
                credentials, _ = google.auth.default()
                auth_req = google.auth.transport.requests.Request()
                credentials.refresh(auth_req)
                
                url = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/gemini-3.1-pro-preview:generateContent"
                headers = {
                    "Authorization": f"Bearer {credentials.token}",
                    "Content-Type": "application/json"
                }
                data = {
                    "contents": [{
                        "role": "user",
                        "parts": [
                            {"text": qa_prompt},
                            {
                                "inlineData": {
                                    "mimeType": "image/png",
                                    "data": encoded_string
                                }
                            }
                        ]
                    }],
                    "generationConfig": {"temperature": 0.2}
                }
                res = requests.post(url, headers=headers, json=data)
                if res.status_code == 200:
                    try:
                        qa_text = res.json()["candidates"][0]["content"]["parts"][0]["text"]
                        qa_json_match = re.search(r"```json\s*\n(.*?)\n```", qa_text, flags=re.DOTALL | re.IGNORECASE)
                        if qa_json_match:
                            metadata["qa_report"] = json.loads(qa_json_match.group(1))
                            with open(apps_dir / f"{app_id}.json", "w", encoding="utf-8") as f:
                                json.dump(metadata, f)
                            yield json.dumps({"type": "info", "message": "Visual QA loop completed successfully!"}) + "\n"
                    except Exception as parse_e:
                        print("Failed to parse QA json:", parse_e)
        except Exception as e:
            # Non-fatal if visual QA fails, just log it internally
            print(f"Visual QA Failed: {e}")
            yield json.dumps({"type": "info", "message": f"Visual QA skipped: {str(e)}"}) + "\n"
            
        yield json.dumps({"type": "complete", "app_id": app_id}) + "\n"

    return StreamingResponse(
        event_stream(), 
        media_type="application/x-ndjson",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.get("/api/apps")
def list_apps():
    root_dir = Path(__file__).resolve().parent.parent
    apps_dir = root_dir / "frontend" / "src" / "generated_apps"
    apps = []
    if apps_dir.exists():
        for file_path in apps_dir.glob("App_*.jsx"):
            app_id = file_path.stem
            
            meta_path = apps_dir / f"{app_id}.json"
            if meta_path.exists():
                with open(meta_path, "r") as f:
                    apps.append(json.load(f))
            else:
                content = ""
                try:
                    with open(file_path, "r") as f:
                        content = f.read()
                except Exception:
                    pass
                
                name = app_id.replace("App_", "Generated Layout ")
                match_name = re.search(r"export\s+default\s+function\s+([A-Za-z0-9_]+)", content)
                if match_name:
                    name = re.sub(r"([A-Z])", r" \1", match_name.group(1)).strip()
                    
                apps.append({
                    "id": app_id,
                    "name": name,
                    "prompt": "Custom UI Dashboard"
                })
    return {"apps": sorted(apps, key=lambda x: x["id"], reverse=True)}

@app.delete("/api/apps/{app_id}")
def delete_app(app_id: str, request: Request):
    require_admin(request)
    apps_dir = Path(__file__).parent.parent / "frontend" / "src" / "generated_apps"
    target_file = apps_dir / f"{app_id}.jsx"
    meta_file = apps_dir / f"{app_id}.json"
    deleted = False
    
    if target_file.exists():
        target_file.unlink()
        deleted = True
        
    if meta_file.exists():
        meta_file.unlink()
        
    if deleted:
        return {"message": "Deleted"}
    raise HTTPException(status_code=404, detail="App not found")

@app.post("/api/chat")
def chat(chat_request: ChatRequestModel, request: Request):
    require_admin(request)
    inline_context = {
        "system_instruction": "You are a data assistant. You have access to a BigQuery table with thousands of historical records. You can answer questions about the specific record the user is looking at, OR you can write SQL to query the entire table for aggregate metrics, trends, or other users. Keep your answers concise and text-only. Do not generate charts. Do not suggest actions unless asked.",
        "datasource_references": {
            "bq": {
                "table_references": [{
                    "project_id": PROJECT_ID,
                    "dataset_id": DATASET_ID,
                    "table_id": TABLE_ID
                }]
            }
        },
        "options": {"chart": {}}
    }
    
    prompt = chat_request.message

    client_history = []
    for msg in chat_request.history:
        if msg.get("role") == "user":
            client_history.append(gemini.Message(user_message=gemini.UserMessage(text=msg.get("content"))))
        elif msg.get("role") == "model":
            # Gemini models use system_message for AI responses in this specific V1 API schema format
            client_history.append(gemini.Message(system_message=gemini.SystemMessage(text=gemini.TextMessage(parts=[msg.get("content")]))))

    chat_request = gemini.ChatRequest(
        parent=f"projects/{PROJECT_ID}/locations/{LOCATION}",
        messages=client_history + [
            gemini.Message(user_message=gemini.UserMessage(text=prompt))
        ],
        inline_context=inline_context
    )

    try:
        response_stream = gemini_client.chat(request=chat_request)
        full_response = ""
        for chunk in response_stream:
            if chunk.system_message and chunk.system_message.text:
                full_response += "".join(chunk.system_message.text.parts)
                
        return {"response": full_response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve the static React build
app.mount("/", StaticFiles(directory="dist", html=True), name="frontend")

@app.exception_handler(404)
async def custom_404_handler(request, __):
    # Catch-all for React Router/SPA paths
    return FileResponse("dist/index.html")
