---
name: orchestrator_skill
description: Analyzes the user's request to understand the desired data application and coordinates use of other skills to generate the application components.
---

# Data App Orchestrator Skill

This skill analyzes the user's request to understand the desired data application and then orchestrates the use of other skills to generate the application components.

## Responsibilities

1.  **Step 1: App Approach Analysis:** Pass the user's prompt to `app_approach.skill.md`. This skill analyzes the persona and goal to determine the Application Archetype.
2.  **Step 2: App Layout:** Pass the Archetype from Step 1 to `design/layout.skill.md`. This skill defines the structural layout and outputs an explicit list of "Component Slots" that need to be filled.
3.  **Step 3: Functional Completeness Check:** Proactively adding helpful features (like date pickers, category filters, etc.) that improve the data scenario is ALLOWED and ENCOURAGED. However, you MUST explicitly ensure that any feature included in the requirements is FULLY FUNCTIONAL. Features need to work, period. Dates at the top of a dashboard generally change all of the data under them. Segmented controls must actually change the view shown. Checkboxes must check, state must update. Do not include mock UI elements, non-working buttons (e.g., dead Download PDF links), unrequested user avatars, or unrequested generic sidebars taking up screen estate. Let the data visualizations fulfill the core intent cleanly. CRITICAL: Do NOT add arbitrary progress bars to KPI cards, tables, or anywhere else. Progress bars are ONLY permissible if the underlying data has a known, explicit upper bound, target, or goal value to accurately determine progress.
4.  **Step 4: Component Resolution:** Pass the Layout component slots (and any explicit user feature requests) to `router.md`. This skill maps the slots/features to the exact charting and UI skill files required, fetching only the necessary skills.
5.  **Step 5: Visual Design Styling:** Instruct the `design/visual_spec.skill.md` to provide the strict design tokens and styling rules for all components. Apply any specific design overrides requested by the user.
6.  **Step 5.5: Data Shape Definition:** Define the complete TypeScript/JavaScript data schema (`interface`/`object shape`) for the application's data state. All components must be cleanly wired to this single source of truth before any rendering code is written.
7.  **Step 6: Code Generation:** Combine the selected components (from Step 4), the layout structure (from Step 2), and the visual styling (from Step 5) to generate the complete React application.
7.  **Step 7: QA & Testing:** Pass the generated application to `testing.skill.md`. Systematically verify that every single button and filter added (e.g. date pickers, download links) is functional. If an unrequested feature does not work, it must be removed.

## Child Skills

This skill will coordinate the following child skill groups:

*   `app_approach.skill.md`: Identifies the application archetype based on user persona and goals.
*   `data/connect.skill.md`: Connects to various data sources.
*   `data/clean.skill.md`: Cleans and preprocesses data.
*   `data/query.skill.md`: Queries data from connected sources.
*   `data/insights.skill.md`: Discovers and highlights insights in the data.
*   `design/layout.skill.md`: Determines the hierarchical component alignment structure of the React page.
*   `design/visual_spec.skill.md`: Defines and applies the visual design for all components.
*   `ui/charts/`: Generates various chart types.
*   `ui/components/`: Generates common UI components like tables, filters, buttons, etc.
