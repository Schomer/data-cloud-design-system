# Swatch Enhancements Implementation Plan

This plan aims to improve the user experience of color swatch editing by integrating a color picker directly into the swatches and ensuring reorderability works smoothly.

## Proposed Changes

### [Frontend Components]

#### [MODIFY] [ChartColorSwatches.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/ChartColorSwatches.jsx)
- Add a hidden `<input type="color">` to each swatch component.
- Trigger the color picker when the color swatch area is clicked.
- Distinguish between click events and drag events from `@dnd-kit`.
- Update the color in the global context when the picker value changes.

#### [MODIFY] [ChartGallery.jsx](file:///Users/schomer/Desktop/JTC_Design_System/frontend/src/components/ChartGallery.jsx)
- Remove `EditableWrapper` from around `ChartColorSwatches` since editing will now be handled directly by the swatches.

## Verification Plan

### Manual Verification
1.  Open the application in the browser.
2.  Navigate to the "Standard Charts" page.
3.  **Verify Reordering**: Drag a color swatch to a new position. Ensure it moves and the charts update (if applicable).
4.  **Verify Color Picking**: Click on a color swatch. A native color picker should appear. Select a new color and verify the swatch and charts update immediately.
5.  **Verify No Sidebar Jump**: Clicking the swatch should NOT open the editor sidebar anymore.

### Automated Tests
- None planned as the UI depends heavily on browser interactions and drag-and-drop.
