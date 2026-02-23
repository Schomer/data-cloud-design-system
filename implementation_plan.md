# Plan: Fix Realtime Updates and Mono Style

The user reported that the text color editor doesn't update in realtime and the Mono text style background is white in dark mode. This plan addresses these issues by improving the event handling in the editor sidebar and ensuring dynamic styles in the typography gallery are robust across themes.

## Proposed Changes

### [Component: Editor]

#### [MODIFY] [EditorSidebar.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/EditorSidebar.jsx)
- Change `onChange` to `onInput` for all `input type="color"` elements. `onChange` for color pickers only fires when the mouse is released, while `onInput` fires continuously during dragging, providing the "realtime" experience the user expects.
- This applies to: buttons, inputs, cards, navigation, overlays, tables, charts, and typography settings.

---

### [Component: Typography Gallery]

#### [MODIFY] [App.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/App.jsx)
- Pass the `darkMode` state to the `TypographyGallery` component as `isDarkMode`.

#### [MODIFY] [TypographyGallery.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/TypographyGallery.jsx)
- Accept the `isDarkMode` prop.
- Update `getInlineStyle` to include `color` and `backgroundColor` based on the current theme (`isDarkMode ? spec.darkColor : spec.color`).
- Remove the dependency on dynamic Tailwind classes (`getColorClass`, `getBgClass`) which can be unreliable when built from dynamic strings and may not update as fluidly.
- Ensure the `mono` variant correctly applies the `backgroundColor` from the specification.

## Verification Plan

### Manual Verification
1.  **Start Dev Server**: Ensure `npm run dev` is running in the `frontend` directory.
2.  **Open Browser**: Navigate to the JTC Design System app.
3.  **Test Realtime Updates**:
    - Go to the **Typography** page.
    - Select a heading (e.g., H1) to open the editor sidebar.
    - Use the color picker to change the text color. Drag the cursor in the picker and verify the text in the gallery updates **while dragging**.
4.  **Test Mono Style Background**:
    - Toggle the app to **Dark Mode**.
    - Scroll to the **Specialty** section on the Typography page.
    - Verify that the **Mono** text has a dark background (not white).
    - Use the color picker to change the Mono background in the sidebar, verify it updates in realtime.
