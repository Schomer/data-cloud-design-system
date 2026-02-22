---
name: jtc-design-system-app architecture
description: Detailed guidelines for layout, visuals, typography, and feature implementation of high-quality standard dashboard applications.
---

# JTC Design System Dashboard UI Skill

This file documents the layout, visual design, state management, and interaction patterns required to reconstruct the JTC Design System dashboards. It provides constraints for future applications.

## 1. Overall Architecture
- **Framework**: React + Vite
- **Styling**: Tailwind CSS (Leverage standard Tailwind token palette directly for colors, e.g., text-slate-500 or border-slate-800, rather than CSS custom variables)
- **State Management**: Use React Context (`createContext`) for application-wide theme values like a Sortable Chart Color list. React local state (`useState`) for isolated components.
- **Backend/API Integration Framework**: Python FastAPI endpoint structure integration for any necessary services, including the Gemini Data Analytics Chat endpoint wrapper.
- **Core Dependencies**: `lucide-react` (icons), `date-fns` (formatting), `@dnd-kit/core` (drag interactions), `echarts-for-react` (visualizations).

## 2. Layout & Visuals
- Use a **dark mode default** switching paradigm. Define dark interfaces with `bg-[#121212]`, lighter overlay containers with `bg-[#1a1a1a]`. Soft borders using `border-slate-800`.
- Use a global sidebar wrapper mapped tightly against the viewport for navigation, reserving the remaining large canvas view area for dynamic section rendering. Limit the max-width of inner canvas wrappers using Tailwind max-w modifiers for ultrawide readability.

## 3. Core Features & Complex Interactions
- **Sortable / Reorderable Data Lists**: Utilize `@dnd-kit/core` with Sensors for pointer/keyboard, rendering arrays within a `SortableContext`. 
  - Standard use-case: An interactive Chart Color Swatch toolbar enabling dynamic ordering of underlying EChart color configs. Default 10 variable set array for charts: `['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1']`.
- **Data Tables with Pagination**: Functional paginated tables capped logically (e.g. 30 item chunks). Include pagination controls at the bottom employing strict **Icon-Only UI patterns** from Lucide for actions (`ChevronsLeft`, `ChevronLeft`, `ChevronRight`, `ChevronsRight`). Must have explicit disabled states dynamically driven by bounds.
- **Deep AI Agent Subpanels**: Secondary panels implementing context-aware Gemini Data Analytics Chat components, formatted linearly to mimic conversation structure.

## 4. UI Component Anatomy
- **KPI Cards Row**: Responsive grid elements showcasing primary metrics. Features rounded-md trend badges (`bg-emerald-100` success / `bg-rose-100` regression overlays natively configured with Lucide arrows). Include standard pulse loading animation variations.
- **Data Table Layouts**:
  - Filtering toolbars rendered logically above the core UI with grouped dropdown primitives displaying active categories locally.
  - Active Row indicators. Highlight the exact user focus dynamically in high contrast bounding boxes.
- **Data Chart / EChart Blocks**:
  - Housed in standalone `display: flex; flex-col` cards with descriptive headers and padded internal regions. 
  - Use SVG rendering preference for `echarts-for-react`.
  - Establish a standardized **1 chart per row** grid boundary constraint for large visibility inside specific content groupings (i.e. Time & Trends grids configured as `col-span-1` width across a vertical responsive axis or `md:grid-cols-2`). Avoid crowding.
