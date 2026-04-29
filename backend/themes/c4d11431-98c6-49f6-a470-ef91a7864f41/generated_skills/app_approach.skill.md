---
name: app_approach_skill
description: Identifies the user's persona and the primary goal of their desired data application.
---

# App Approach Identification Skill

This skill identifies the user's persona and the primary goal of their desired data application. This helps determine the overall structure, layout, and focus of the app to be generated.

## Responsibilities

1.  **Persona Identification:** Analyze the user's prompt to infer their likely persona (e.g., Business Analyst, Data Scientist, Executive).
2.  **Goal Analysis:** Determine the primary task the user wants to accomplish (e.g., monitoring KPIs, deep-dive analysis, ad-hoc exploration, data cleaning).
3.  **App Archetype Selection:** Based on the persona and goal, select a suitable application archetype (e.g., Dashboard, Explorer, Data Cleaning Utility).

## Data User Personas & App Archetypes

*   **Persona: Business Analyst / Operations Manager**
    *   **Goal:** Monitor key performance indicators (KPIs), track operational metrics, and understand business trends.
    *   **App Archetype: Dashboard / Scorecard**
        *   **Focus:** High-level metrics, trend lines, status indicators (e.g., gauges, KPIs), and summary tables.
        *   **Layout:** Often a single-screen view with key information visible at a glance. May have high-level filters (e.g., date range, region).
        *   **Typical Components:** KPI cards, line charts, bar charts, gauges, simple tables.

*   **Persona: Data Scientist / Researcher**
    *   **Goal:** Perform deep-dive analysis, explore relationships in the data, test hypotheses, and build models.
    *   **App Archetype: Data Explorer / Analytical App**
        *   **Focus:** Interactive data exploration, complex visualizations, and statistical analysis.
        *   **Layout:** Multi-faceted interface with detailed charts, filtering panels, and options for changing chart types or parameters. May include tabs or separate screens for different analyses.
        *   **Typical Components:** Line charts, bar charts, scatter plots, histograms, box plots, heatmaps, violin plots, correlation matrices, pivot tables, detailed filtering controls (sliders, multi-selects).

*   **Persona: Executive / C-Suite**
    *   **Goal:** Get a quick, high-level overview of business health and strategic goals.
    *   **App Archetype: Executive Dashboard / Strategic Overview**
        *   **Focus:** Highly summarized information, key strategic metrics, and clear "so-what" takeaways. Minimal complexity.
        *   **Layout:** Clean, simple, and often designed for mobile or tablet viewing.
        *   **Typical Components:** Big number KPIs, trend indicators (up/down arrows), high-level summary charts (e.g., monthly sales trend), and potentially a feed of alerts or insights.

*   **Persona: Data Engineer / Data Steward**
    *   **Goal:** Cleanse data, monitor data quality, and manage data pipelines.
    *   **App Archetype: Data Cleaning Utility / Data Quality Monitor**
        *   **Focus:** Identifying and fixing data issues.
        *   **Layout:** Table-centric view with tools for filtering, sorting, and editing data. May include data profiling visualizations.
        *   **Typical Components:** Editable data tables, data profiling statistics (missing values, distributions), forms for data entry/correction, and logs of cleaning operations.

## Workflow

1.  **Prompt Decomposition:** Before selecting an archetype, explicitly extract and define the following four dimensions from the user's prompt:
    *   **Primary entity:** What is the data about (e.g., customers, transactions, devices)?
    *   **Time orientation:** What is the timeframe (e.g., historical review, real-time monitoring, forecasting)?
    *   **User goal:** What is the intent (e.g., spot a problem, prove a point, explore freely)?
    *   **Data grain:** What is the level of detail (e.g., aggregate overview, row-level detail)?
2.  **Select Best-Fit Archetype:** Choose the archetype that most closely matches the extracted dimensions, inferred persona, and goal.
3.  **Return Archetype**: Return the identified Persona and App Archetype back to the Orchestrator. The Orchestrator will then use this to inform the Layout and Component steps.

## Elicitation Questions

If the user's desired app approach is unclear, ask clarifying questions:
*   "Are you looking to monitor key metrics at a glance, or do you need to do a deep, interactive exploration of the data?"
*   "Who is the primary audience for this app (e.g., executives, analysts, yourself)?"
*   "Is the main goal to track performance, explore for insights, or clean and prepare the data?"
