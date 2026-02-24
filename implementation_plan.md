# Implementation Plan - Global Component Content Synchronization

This plan outlines the steps to enable global synchronization of component text (labels, titles) across the design system application. 

## User Review Required

> [!IMPORTANT]
> This change will shift the primary source of truth for component text from hardcoded props in the gallery pages to the global `EditorContext`. 
> - For components that currently have unique titles (e.g., KPICards in the dashboard), they will now show the global "template" title by default. 
> - Unique titles can still be passed as props, but if they are edited via the Sidebar, the change will propagate to all components of that type that follow the global system.

## Proposed Changes

### Step 0: Commit Plan
- Create `implementation_plan.md` in root.
- Git Commit: Phase 1

### Phase 1: Update Data Model (Context)
#### [MODIFY] [EditorContext.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/context/EditorContext.jsx)
- Update `globalSpecs` to include content fields:
  - `card.defaultTitle`
  - `button.labels` (e.g., `primary`, `secondary`, etc.)
  - `typography[variant].content`
  - `nav.defaultText`
  - `table.headerTextContent`

### Phase 2: Enhance Editor Sidebar
#### [MODIFY] [EditorSidebar.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/EditorSidebar.jsx)
- Add a "Content & Labels" section for each selected component type.
- Implement text input fields that call `updateGlobalSpec`.

### Phase 3: Update Components & Galleries
#### [MODIFY] [KPICard.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/KPICard.jsx)
- Use `globalSpecs.card.defaultTitle` as a fallback for the `title` prop.

#### [MODIFY] [ControlsGallery.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/ControlsGallery.jsx)
- Update buttons to use global labels if available.

#### [MODIFY] [TypographyGallery.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/TypographyGallery.jsx)
- Loop through typography variants and use `globalSpecs.typography[variant].content` for the display text.

### Phase 4: Centralized UI Components & Cross-Page Sync
#### [NEW] [Typography.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/Typography.jsx)
- Create a standard component that consumes `typoSpec` and renders headings/body text with global styles.

#### [NEW] [Button.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/Button.jsx)
- Create a standard button component that consumes `btnSpec` and supports variants (primary, secondary, ghost, destructive).

#### [MODIFY] [App.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/App.jsx)
- Use `Typography` component for all layout headers.
- Update sidebar navigation to potentially use global text styles (optional but recommended).

#### [MODIFY] [UpdateSkillsButton.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/UpdateSkillsButton.jsx)
- Replace hardcoded emerald button with the new `Button` component (primary).

#### [MODIFY] [DetailPanel.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/DetailPanel.jsx) and [DataTable.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/DataTable.jsx)
- Replace static headers and internal buttons with the centralized components.

---

## Verification Plan

### Automated Tests
- N/A (Project lacks automated UI tests in current state, relying on manual verification via browser).

### Manual Verification
1.  **Open the app** in the browser.
2.  **Navigate to Standard Charts**.
3.  **Select a KPI Card**.
4.  **Edit the Title** in the Sidebar.
5.  **Verify** that all KPI cards on the page update to the new title.
6.  **Navigate to Inputs & Controls**.
7.  **Select a Button**.
8.  **Edit the Button Text** in the Sidebar.
9.  **Verify** that all buttons of that variant update.
10. **Navigate to Typography**.
11. **Edit a Heading text** in the Sidebar.
12. **Verify** it updates globally.
