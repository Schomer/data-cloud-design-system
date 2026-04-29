---
name: layout_skill
description: Defines specific layout patterns, component hierarchy, and structural rules for different React application approaches.
---

# Page Layout Patterns

The Orchestrator will pass the App Archetype identified in Step 1 to this skill. This skill then dictates the structural layout and outputs an explicit list of 'Component Slots' that must be filled. The Orchestrator will take these slots and pass them to Step 3 (`router.md`).

**PROACTIVE FUNCTIONAL COMPLETENESS RULE**: You are ENCOURAGED to proactively include helpful UI elements (such as robust filter sets, date range pickers, product category selectors, or export buttons) if they improve the user's data scenario, even if not explicitly requested. HOWEVER, every component MUST be fully functional (e.g., checkboxes must toggle, state must update, buttons must work). Do not include fake buttons, dead "Download PDF" links, or non-working date pickers. If you add a filter, it must actually filter the data.

## Strict UI Component Rules
- **Avatars**: Do not include "round avatar circles" or user profile placeholders unless explicitly requested for a team/user-management app.
- **Tabs & Navigation**: NEVER add unrequested tabs (e.g., "Discovery", "Cohorts", "Predictions") unless you fully implement the functional data views/panels for every single tab. ALL tabs must be fully working with state (e.g., `activeTab`) switching the content. Dead tabs are strictly forbidden.
- **Hamburger Menus**: If you add a hamburger menu icon or sidebar toggle, it MUST be fully functional. You MUST implement the state (e.g., `isSidebarOpen`) and use it to actually toggle the visibility of the sidebar. Dead buttons are strictly forbidden.
- **Icons**: NEVER add decorative icons next to ANY text (including form labels, filter titles, card titles, section headers, or general text) unless explicitly requested. If you need a menu toggle, use a bare, un-styled standard Hamburger menu icon (e.g., `<Menu />`) with NO background color, NO border, and NO square bounding box around it.
- **Utility Buttons**: NEVER add unrequested, dead utility buttons (e.g., "Export CSV", "Download PDF", "Global View") to headers or anywhere else unless you fully implement their state, logic, and actual download functionality. If they do nothing or just show a console log, do NOT add them.
- **Top Header & Sidebars**: The top header must always span the full width of the screen. Any sidebar must be placed *underneath* the top header, not beside it (the header should not be pushed right by a full-height sidebar). Let the visualizations take center stage.
- **Maps**: If the user requests a map visualization (e.g. they ask for data by geography, location, country, state), ensure you properly import, instantiate, and render the map component instead of creating generic cards.


*   **For "Data Investigator": Data Exploration / Discovery Layout**
    *   **Top:** Global navigation, breadcrumbs, and high-level dataset selection context.
    *   **Control Panel (Left/Right Sidebar):** A dedicated area for complex filter `selection_controls.md` or query building, allowing users to slice and dice the data dimensions and metrics.
    *   **Main Canvas:** The primary focus area showcasing the main `data_table.md` or a large visualization. This area fluidly adapts to the controls set in the side panel.
    *   **Assistant/Chat Panel (Optional):** A persistent chat interface often placed in a collapsible right sidebar or bottom overlay.

*   **For "Process Monitor": Real-Time Dashboard Layout**
    *   **Top:** Global navigation or breadcrumbs (`navigation.md`).
    *   **Header Section:** Page title and proactive global filters (e.g., fully functional time-range pickers or category selectors).
    *   **Top Row (Cards):** 3-4 KPI metrics (`cards_kpi.md`) acting as immediate health checks. Wrap them in a grid layout (e.g., `grid-cols-4`) to prevent them from stretching across the full screen width.
    *   **Middle/Main Section:** Primary real-time visualizations (e.g., `line_chart.md`, `area_chart.md`) tracking the pulse over the selected timeframe.
    *   **Bottom Section:** A frequently updating `data_table.md` for recent logs/events.

*   **For "Executive Summary": Classic Grid Dashboard Layout**
    *   **Top:** Global navigation or breadcrumbs (`navigation.md`).
    *   **Header Section:** Page title and global filters/date pickers. **IMPORTANT: Anytime there are global filters, they MUST be located here at the top of the page - NEVER in a sidebar. Ensure all added filters are functional.**
    *   **Top Row (Cards):** Broad, high-level KPI metrics (`cards_kpi.md`). **IMPORTANT: KPI Cards should never stretch the full width of the screen. Always use a responsive CSS grid (e.g., `grid-cols-1 md:grid-cols-4 gap-4`) to present them as small, uniformly sized tiles.**
    *   **Middle Section (Mixed Grid):** A balanced mix of a primary trend chart (`line_chart.md`) taking up the majority width, alongside a categorical breakdown chart on the side.
    *   **Bottom Section:** A summary `data_table.md` providing rolled-up figures.

*   **For "Segment Comparator": Overlay Comparison Layout**
    *   **Header Section:** Page title and `selection_controls.md` for defining the comparison context. Includes pickers for two distinct timeframes and controls to select the measure.
    *   **Main Canvas:** A single visualization area where data from selected segments is overlaid on the same axes for direct comparison.

*   **For "Workflow Tracker": Sequential Flow Layout**
    *   **Top:** Cohort definition filters.
    *   **Main Canvas:** A wide, full-width canvas dominating the screen to visualize the multi-stage pipeline without horizontal scrolling.

*   **For "Notebook": Document / Storytelling Layout**
    *   **Top:** Document title, author/metadata.
    *   **Main Canvas:** A single-column, center-aligned layout designed for vertical scrolling and readability.
    *   **Content Blocks:** Alternating blocks of explanatory text (`typography.md`) followed by supporting data visualizations.

## Interactivity & Data State Definition

1.  **Define State Ownership:** Identify what data context needs to be shared across the page.
2.  **Map Triggers to Actions:** 
    *   **Filter Change:** When a user changes a value in a selection control, specify that it triggers a data re-fetch for the connected visualizations. **IMPORTANT: There shouldn't be a "Submit" button to apply changes. Filters should apply automatically.**
    *   **Click/Select:** Specifying if clicking a chart element or table row updates another component (cross-filtering).
3.  **Empty and Loading States:** Specify what a component displays while waiting for data (e.g., skeleton loaders).
